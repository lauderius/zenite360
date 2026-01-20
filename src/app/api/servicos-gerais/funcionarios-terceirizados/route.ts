import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

// GET - Listar funcionários terceirizados
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contratoId = searchParams.get('contratoId');
    const funcao = searchParams.get('funcao');
    const turno = searchParams.get('turno');

    const where: any = { activo: true };

    if (contratoId) where.contratoId = parseInt(contratoId);
    if (funcao) where.funcao = { contains: funcao, mode: 'insensitive' };
    if (turno) where.turno = turno;

    const funcionarios = await prisma.funcionarioTerceirizado.findMany({
      where,
      include: {
        contrato: {
          select: { codigo: true, empresaContratada: true, tipo: true },
        },
      },
      orderBy: [{ contrato: { tipo: 'asc' } }, { nomeCompleto: 'asc' }],
    });

    // Agrupar por tipo de contrato
    const agrupados = funcionarios.reduce((acc, func) => {
      const tipo = func.contrato.tipo;
      if (!acc[tipo]) acc[tipo] = [];
      acc[tipo].push(func);
      return acc;
    }, {} as Record<string, typeof funcionarios>);

    return NextResponse.json({
      data: funcionarios,
      agrupados,
      total: funcionarios.length,
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}

// POST - Cadastrar funcionário terceirizado
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verificar se contrato existe e está ativo
    const contrato = await prisma.contratoTerceiro.findUnique({
      where: { id: body.contratoId },
    });

    if (!contrato || !contrato.activo) {
      return NextResponse.json(
        { error: 'Contrato não encontrado ou inativo' },
        { status: 400 }
      );
    }

    const funcionario = await prisma.funcionarioTerceirizado.create({
      data: {
        ...body,
        dataInicio: new Date(body.dataInicio),
        dataFim: body.dataFim ? new Date(body.dataFim) : null,
      },
      include: {
        contrato: { select: { codigo: true, empresaContratada: true } },
      },
    });

    // Atualizar quantidade de funcionários no contrato
    await prisma.contratoTerceiro.update({
      where: { id: body.contratoId },
      data: {
        quantidadeFuncionarios: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(funcionario, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}