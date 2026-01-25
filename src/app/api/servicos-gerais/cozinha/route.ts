import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar estoque da cozinha (usa artigos_stock quando disponível)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const categoria = searchParams.get('categoria') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = { activo: true };
    if (search) {
      where.OR = [
        { nome_artigo: { contains: search } },
        { codigo_artigo: { contains: search } },
      ];
    }
    if (categoria) {
      where.categoria = categoria;
    }

    const [artigos, total] = await Promise.all([
      prisma.artigos_stock.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { nome_artigo: 'asc' },
      }).catch(() => []),
      prisma.artigos_stock.count({ where }).catch(() => 0),
    ]);

    const data = (artigos || []).map((a: any) => ({
      id: Number(a.id),
      codigo: a.codigo_artigo || `ART-${a.id}`,
      nome: a.nome_artigo || a.nome || 'Item',
      categoria: a.categoria || 'Geral',
      quantidadeAtual: Number(a.quantidade_stock || 0),
      quantidadeMinima: Number(a.stock_minimo || 0),
      unidadeMedida: a.unidade_medida || 'un',
      validade: a.data_validade || null,
    }));

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil((total || 0) / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar estoque da cozinha:', error);
    return NextResponse.json({
      data: [],
      pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
      success: false,
      error: 'Erro ao buscar estoque',
    });
  }
}

// POST: Criar/Atualizar item do estoque
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const novoItem = {
      id: mockEstoqueCozinha.length + 1,
      codigo: `COZ-${String(mockEstoqueCozinha.length + 1).padStart(3, '0')}`,
      ...body,
      criadoEm: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: novoItem,
    });
  } catch (error) {
    console.error('Erro ao criar item do estoque:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar item' },
      { status: 500 }
    );
  }
}

