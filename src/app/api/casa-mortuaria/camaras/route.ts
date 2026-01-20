import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

// GET - Listar câmaras frias
export async function GET(request: NextRequest) {
  try {
    const camaras = await prisma.camaraFria.findMany({
      where: { activo: true },
      orderBy: { codigo: 'asc' },
    });

    // Buscar ocupação detalhada
    const ocupacaoDetalhada = await Promise.all(
      camaras.map(async (camara) => {
        const corpos = await prisma.registroObito.findMany({
          where: {
            camaraFria: camara.codigo,
            status: { in: ['ADMITIDO', 'EM_CONSERVACAO', 'AGUARDANDO_DOCUMENTACAO'] },
          },
          select: {
            id: true,
            codigo: true,
            nomeCompleto: true,
            posicao: true,
            dataAdmissao: true,
            status: true,
          },
        });

        return {
          ...camara,
          corpos,
          ocupacaoAtual: corpos.length,
        };
      })
    );

    // Resumo geral
    const resumo = {
      totalCamaras: camaras.length,
      capacidadeTotal: camaras.reduce((acc, c) => acc + c.capacidade, 0),
      ocupacaoTotal: ocupacaoDetalhada.reduce((acc, c) => acc + c.ocupacaoAtual, 0),
      camarasOperacionais: camaras.filter((c) => c.status === 'OPERACIONAL').length,
      camarasComAlerta: ocupacaoDetalhada.filter(
        (c) =>
          c.temperaturaAtual &&
          (c.temperaturaAtual > c.temperaturaMaximaAlerta ||
            c.temperaturaAtual < c.temperaturaMinimaAlerta)
      ).length,
    };

    return NextResponse.json({
      data: ocupacaoDetalhada,
      resumo,
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}

// POST - Registrar leitura de temperatura (integração IoT)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { camaraId, sensorId, temperatura } = body;

    const camara = await prisma.camaraFria.findFirst({
      where: { OR: [{ id: camaraId }, { sensorId }] },
    });

    if (!camara) {
      return NextResponse.json(
        { error: 'Câmara fria não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se está fora dos limites
    const foraLimite =
      temperatura > camara.temperaturaMaximaAlerta ||
      temperatura < camara.temperaturaMinimaAlerta;

    // Atualizar temperatura
    await prisma.camaraFria.update({
      where: { id: camara.id },
      data: {
        temperaturaAtual: temperatura,
        status: foraLimite ? 'DEFEITO' : 'OPERACIONAL',
      },
    });

    // Registrar histórico
    await prisma.historicoTemperaturaCamara.create({
      data: {
        camaraId: camara.id,
        temperatura,
        dataHora: new Date(),
        alerta: foraLimite,
      },
    });

    // Gerar alerta se necessário
    if (foraLimite) {
      await prisma.alerta.create({
        data: {
          tipo: 'TEMPERATURA_CAMARA',
          modulo: 'CASA_MORTUARIA',
          titulo: `Alerta de Temperatura - ${camara.nome}`,
          mensagem: `Temperatura ${temperatura}°C fora dos limites (${camara.temperaturaMinimaAlerta}°C a ${camara.temperaturaMaximaAlerta}°C)`,
          severidade: 'CRITICO',
        },
      });
    }

    return NextResponse.json({
      camara: camara.nome,
      temperatura,
      alerta: foraLimite,
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}