import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

// GET - Buscar ativo por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const ativo = await prisma.ativo.findUnique({
      where: { id },
      include: {
        departamento: true,
        responsavel: { select: { id: true, nomeCompleto: true, cargo: true } },
        ordensManutencao: {
          orderBy: { dataAbertura: 'desc' },
          take: 10,
          include: {
            tecnico: { select: { nomeCompleto: true } },
          },
        },
      },
    });

    if (!ativo) {
      return NextResponse.json(
        { error: 'Ativo não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(ativo);
  } catch (error) {
    return handlePrismaError(error);
  }
}

// PUT - Atualizar ativo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const ativoAnterior = await prisma.ativo.findUnique({ where: { id } });

    if (!ativoAnterior) {
      return NextResponse.json(
        { error: 'Ativo não encontrado' },
        { status: 404 }
      );
    }

    const ativo = await prisma.ativo.update({
      where: { id },
      data: {
        ...body,
        dataAquisicao: body.dataAquisicao ? new Date(body.dataAquisicao) : undefined,
        garantiaAte: body.garantiaAte ? new Date(body.garantiaAte) : undefined,
        proximaManutencao: body.proximaManutencao ? new Date(body.proximaManutencao) : undefined,
        validadeCalibracao: body.validadeCalibracao ? new Date(body.validadeCalibracao) : undefined,
        atualizadoEm: new Date(),
      },
      include: {
        departamento: { select: { nome: true } },
      },
    });

    // Log de auditoria
    await prisma.logAuditoria.create({
      data: {
        tabela: 'Ativo',
        registroId: ativo.id,
        acao: 'UPDATE',
        dadosAnteriores: JSON.stringify(ativoAnterior),
        dadosNovos: JSON.stringify(ativo),
        usuarioId: body.usuarioId,
      },
    });

    return NextResponse.json(ativo);
  } catch (error) {
    return handlePrismaError(error);
  }
}

// DELETE - Desativar ativo (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const ativo = await prisma.ativo.update({
      where: { id },
      data: {
        activo: false,
        status: 'ABATIDO',
        atualizadoEm: new Date(),
      },
    });

    return NextResponse.json({ message: 'Ativo desativado com sucesso' });
  } catch (error) {
    return handlePrismaError(error);
  }
}