import { NextRequest, NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

// GET - Listar suprimentos de escritório
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const apenasBaixo = searchParams.get('apenasBaixo') === 'true';

    const where: any = { activo: true };
    if (categoria) where.categoria = categoria;

    let suprimentos = await prisma.suprimentoEscritorio.findMany({
      where,
      orderBy: [{ categoria: 'asc' }, { nome: 'asc' }],
    });

    if (apenasBaixo) {
      suprimentos = suprimentos.filter((s) => s.quantidadeAtual < s.quantidadeMinima);
    }

    const stats = {
      totalItens: suprimentos.length,
      itensBaixoEstoque: suprimentos.filter((s) => s.quantidadeAtual < s.quantidadeMinima).length,
    };

    return NextResponse.json({
      data: suprimentos.map((s) => ({
        ...s,
        estoqueBaixo: s.quantidadeAtual < s.quantidadeMinima,
      })),
      stats,
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}