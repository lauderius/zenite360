import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

// GET - Buscar contrato por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const contrato = await prisma.contratoTerceiro.findUnique({
      where: { id },
      include: {
        gestorInterno: { select: { id: true, nomeCompleto: true, cargo: true, email: true } },
        funcionariosTerceirizados: {
          where: { activo: true },
          orderBy: { nomeCompleto: 'asc' },
        },
        avaliacoes: {
          orderBy: { dataAvaliacao: 'desc' },
          take: 5,
          include: {
            avaliador: { select: { nomeCompleto: true } },
          },
        },
      },
    });

    if (!contrato) {
      return NextResponse.json(
        { error: 'Contrato não encontrado' },
        { status: 404 }
      );
    }

    // Calcular dias para vencimento
    const diasParaVencimento = Math.ceil(
      (contrato.dataFim.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return NextResponse.json({
      ...contrato,
      diasParaVencimento,
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}

// PUT - Atualizar contrato
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const contrato = await prisma.contratoTerceiro.update({
      where: { id },
      data: {
        ...body,
        dataInicio: body.dataInicio ? new Date(body.dataInicio) : undefined,
        dataFim: body.dataFim ? new Date(body.dataFim) : undefined,
        atualizadoEm: new Date(),
      },
    });

    // Atualizar compromisso financeiro se valor mudou
    if (body.valorMensal) {
      await prisma.compromissoFinanceiro.updateMany({
        where: { contratoId: id },
        data: {
          valorMensal: body.valorMensal,
          dataFim: body.dataFim ? new Date(body.dataFim) : undefined,
        },
      });
    }

    return NextResponse.json(contrato);
  } catch (error) {
    return handlePrismaError(error);
  }
}

// DELETE - Desativar contrato
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await prisma.contratoTerceiro.update({
      where: { id },
      data: {
        activo: false,
        status: 'CANCELADO',
        atualizadoEm: new Date(),
      },
    });

    // Desativar compromisso financeiro
    await prisma.compromissoFinanceiro.updateMany({
      where: { contratoId: id },
      data: { status: 'CANCELADO' },
    });

    return NextResponse.json({ message: 'Contrato cancelado com sucesso' });
  } catch (error) {
    return handlePrismaError(error);
  }
}