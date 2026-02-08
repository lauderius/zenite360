import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar ativos do património
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const categoria = searchParams.get('categoria') || '';

    const where: any = {};

    if (search) {
      where.OR = [
        { nome: { contains: search } },
        { codigo: { contains: search } },
      ];
    }

    if (categoria) {
      where.categoria = categoria;
    }

    const [artigos, total] = await Promise.all([
      prisma.ativos_patrimonio.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.ativos_patrimonio.count({ where }),
    ]);

    const ativos = artigos.map((artigo) => ({
      ...artigo,
      id: Number(artigo.id),
      departamento: artigo.localizacao || 'Geral', // Map for frontend compatibility
      dataAquisicao: artigo.created_at, // Map for frontend compatibility
    }));

    return NextResponse.json({
      data: ativos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar ativos:', error);
    return NextResponse.json({
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      success: false,
      error: 'Erro ao buscar ativos',
    });
  }
}

// POST: Criar novo ativo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const ativo = await prisma.ativos_patrimonio.create({
      data: {
        codigo: body.codigo || `PAT-${Date.now()}`,
        nome: body.nome,
        categoria: body.categoria || 'Outro',
        marca: body.marca || '',
        modelo: body.modelo || '',
        numero_serie: body.numero_serie || '',
        localizacao: body.localizacao || '',
        status: body.status || 'OPERACIONAL',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...ativo,
        id: Number(ativo.id),
      },
    });
  } catch (error) {
    console.error('Erro ao criar ativo:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar ativo' },
      { status: 500 }
    );
  }
}


