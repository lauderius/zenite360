import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

// GET - Listar centrais de gases e alertas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');

    const where: any = { activo: true };
    if (tipo) where.tipoGas = tipo;

    const [centrais, alertasAtivos, cilindros] = await Promise.all([
      prisma.centralGases.findMany({
        where,
        orderBy: { nome: 'asc' },
      }),
      prisma.alertaGas.findMany({
        where: { resolvido: false },
        orderBy: [{ severidade: 'asc' }, { dataHora: 'desc' }],
        include: {
          central: { select: { nome: true, tipoGas: true } },
        },
      }),
      prisma.cilindroGas.findMany({
        where: { activo: true },
        orderBy: [{ status: 'asc' }, { tipoGas: 'asc' }],
      }),
    ]);

    // Calcular resumo
    const resumo = {
      totalCentrais: centrais.length,
      centraisNormais: centrais.filter((c) => c.status === 'NORMAL').length,
      centraisAlerta: centrais.filter((c) => c.status === 'ALERTA').length,
      centraisCriticas: centrais.filter((c) => c.status === 'CRITICO').length,
      alertasNaoReconhecidos: alertasAtivos.filter((a) => !a.reconhecido).length,
      cilindrosCheios: cilindros.filter((c) => c.status === 'CHEIO').length,
      cilindrosEmUso: cilindros.filter((c) => c.status === 'EM_USO').length,
      cilindrosVazios: cilindros.filter((c) => c.status === 'VAZIO').length,
    };

    return NextResponse.json({
      centrais,
      alertas: alertasAtivos,
      cilindros,
      resumo,
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}

// POST - Registrar leitura de sensor (para integração IoT)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { centralId, sensorId, nivelPercentual, pressaoBar, temperatura } = body;

    // Buscar central
    const central = await prisma.centralGases.findFirst({
      where: { OR: [{ id: centralId }, { sensorId }] },
    });

    if (!central) {
      return NextResponse.json(
        { error: 'Central de gases não encontrada' },
        { status: 404 }
      );
    }

    // Determinar novo status
    let novoStatus: 'NORMAL' | 'ALERTA' | 'CRITICO' = 'NORMAL';
    const alertas: any[] = [];

    if (nivelPercentual <= central.nivelMinimoAlerta * 0.5) {
      novoStatus = 'CRITICO';
      alertas.push({
        centralId: central.id,
        tipoAlerta: 'NIVEL_BAIXO',
        severidade: 'CRITICO',
        mensagem: `Nível crítico de ${central.tipoGas} - ${nivelPercentual}%. Solicitar recarga urgente!`,
      });
    } else if (nivelPercentual <= central.nivelMinimoAlerta) {
      novoStatus = 'ALERTA';
      alertas.push({
        centralId: central.id,
        tipoAlerta: 'NIVEL_BAIXO',
        severidade: 'AVISO',
        mensagem: `Nível baixo de ${central.tipoGas} - ${nivelPercentual}%. Programar recarga.`,
      });
    }

    if (pressaoBar <= central.pressaoMinimaAlerta * 0.5) {
      novoStatus = 'CRITICO';
      alertas.push({
        centralId: central.id,
        tipoAlerta: 'PRESSAO_BAIXA',
        severidade: 'CRITICO',
        mensagem: `Pressão crítica na central de ${central.tipoGas} - ${pressaoBar} bar.`,
      });
    } else if (pressaoBar <= central.pressaoMinimaAlerta) {
      if (novoStatus !== 'CRITICO') novoStatus = 'ALERTA';
      alertas.push({
        centralId: central.id,
        tipoAlerta: 'PRESSAO_BAIXA',
        severidade: 'AVISO',
        mensagem: `Pressão baixa na central de ${central.tipoGas} - ${pressaoBar} bar.`,
      });
    }

    // Atualizar central
    await prisma.centralGases.update({
      where: { id: central.id },
      data: {
        nivelAtualPercentual: nivelPercentual,
        pressaoAtualBar: pressaoBar,
        status: novoStatus,
      },
    });

    // Registrar histórico
    await prisma.historicoLeituraGas.create({
      data: {
        centralId: central.id,
        nivelPercentual,
        pressaoBar,
        temperatura,
        dataHora: new Date(),
      },
    });

    // Criar alertas
    for (const alerta of alertas) {
      // Verificar se já existe alerta similar não resolvido
      const alertaExistente = await prisma.alertaGas.findFirst({
        where: {
          centralId: alerta.centralId,
          tipoAlerta: alerta.tipoAlerta,
          resolvido: false,
        },
      });

      if (!alertaExistente) {
        await prisma.alertaGas.create({
          data: {
            ...alerta,
            dataHora: new Date(),
          },
        });

        // Notificar responsáveis
        const responsaveis = await prisma.funcionario.findMany({
          where: {
            OR: [
              { departamento: { sigla: 'MAN' } },
              { cargo: { contains: 'Engenheiro' } },
            ],
            activo: true,
          },
          select: { id: true },
        });

        await prisma.notificacao.createMany({
          data: responsaveis.map((r) => ({
            tipo: 'ALERTA_GAS',
            titulo: `Alerta de ${alerta.tipoAlerta === 'NIVEL_BAIXO' ? 'Nível' : 'Pressão'} - ${central.tipoGas}`,
            mensagem: alerta.mensagem,
            usuarioId: r.id,
            link: '/patrimonio/gases',
            prioridade: alerta.severidade === 'CRITICO' ? 'ALTA' : 'MEDIA',
          })),
        });
      }
    }

    return NextResponse.json({
      central: central.nome,
      status: novoStatus,
      alertasGerados: alertas.length,
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}