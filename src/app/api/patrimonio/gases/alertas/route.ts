import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

// GET - Listar alertas de gases
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const apenasNaoResolvidos = searchParams.get('apenasNaoResolvidos') !== 'false';
    const severidade = searchParams.get('severidade');

    const where: any = {};

    if (apenasNaoResolvidos) where.resolvido = false;
    if (severidade) where.severidade = severidade;

    const alertas = await prisma.alertaGas.findMany({
      where,
      include: {
        central: { select: { nome: true, tipoGas: true, localizacao: true } },
        cilindro: { select: { codigo: true, tipoGas: true } },
      },
      orderBy: [
        { severidade: 'asc' },
        { dataHora: 'desc' },
      ],
    });

    return NextResponse.json(alertas);
  } catch (error) {
    return handlePrismaError(error);
  }
}

// PUT - Reconhecer ou resolver alerta
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { alertaId, acao, usuarioId } = body;

    const alerta = await prisma.alertaGas.findUnique({
      where: { id: alertaId },
    });

    if (!alerta) {
      return NextResponse.json(
        { error: 'Alerta não encontrado' },
        { status: 404 }
      );
    }

    const usuario = await prisma.funcionario.findUnique({
      where: { id: usuarioId },
      select: { nomeCompleto: true },
    });

    let updateData: any = {};

    if (acao === 'reconhecer' && !alerta.reconhecido) {
      updateData = {
        reconhecido: true,
        reconhecidoPor: usuario?.nomeCompleto,
        dataReconhecimento: new Date(),
      };
    } else if (acao === 'resolver' && !alerta.resolvido) {
      updateData = {
        resolvido: true,
        resolvidoPor: usuario?.nomeCompleto,
        dataResolucao: new Date(),
      };

      // Verificar se a central voltou ao normal
      if (alerta.centralId) {
        const central = await prisma.centralGases.findUnique({
          where: { id: alerta.centralId },
        });

        if (central && central.nivelAtualPercentual > central.nivelMinimoAlerta) {
          await prisma.centralGases.update({
            where: { id: alerta.centralId },
            data: { status: 'NORMAL' },
          });
        }
      }
    }

    const alertaAtualizado = await prisma.alertaGas.update({
      where: { id: alertaId },
      data: updateData,
    });

    return NextResponse.json(alertaAtualizado);
  } catch (error) {
    return handlePrismaError(error);
  }
}