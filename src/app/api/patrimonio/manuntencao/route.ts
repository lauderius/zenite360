import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Lista de ordens de manutenção
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [manutencoes, total] = await Promise.all([
      prisma.ordens_manutencao.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.ordens_manutencao.count({ where }),
    ]);

    const data = manutencoes.map(m => ({
      ...m,
      id: Number(m.id),
      ativoId: Number(m.ativo_id),
      dataAbertura: m.created_at,
    }));

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar manutenções:', error);
    return NextResponse.json({
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      success: false,
      error: 'Erro ao buscar manutenções',
    });
  }
}

// POST: Criar nova ordem de manutenção
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const novaManutencao = await prisma.ordens_manutencao.create({
      data: {
        ativo_id: BigInt(body.ativoId),
        tipo: body.tipo,
        descricao: body.descricao || body.descricaoProblema || '',
        prioridade: body.prioridade,
        status: 'Pendente',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...novaManutencao,
        id: Number(novaManutencao.id),
        ativoId: Number(novaManutencao.ativo_id),
      },
    });
  } catch (error) {
    console.error('Erro ao criar manutenção:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar ordem de manutenção' },
      { status: 500 }
    );
  }
}


