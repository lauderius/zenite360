import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface ArtigoStock {
  id: bigint;
  codigo_artigo: string;
  nome_artigo: string;
  descricao: string | null;
  categoria: string;
  localizacao_stock: string;
  quantidade_stock: any;
  preco_venda: any;
  preco_compra: any;
  created_at: Date | null;
  activo: boolean;
}

// GET: Listar ativos do património
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const categoria = searchParams.get('categoria') || '';

    // Tentar obter do banco
    let artigos: ArtigoStock[] = [];
    let total = 0;

    try {
      const where: any = {
        deleted_at: null,
      };

      if (search) {
        where.OR = [
          { nome_artigo: { contains: search } },
          { codigo_artigo: { contains: search } },
        ];
      }

      if (categoria) {
        where.categoria = categoria;
      }

      [artigos, total] = await Promise.all([
        prisma.artigos_stock.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { created_at: 'desc' },
        }),
        prisma.artigos_stock.count({ where }),
      ]);
    } catch (dbError) {
      // Se o banco não tiver dados estruturados, retornar array vazio
      artigos = [];
      total = 0;
    }

    // Mapear para formato da aplicação
    const ativos = artigos.map((artigo) => ({
      id: Number(artigo.id),
      codigo: artigo.codigo_artigo,
      numeroPatrimonio: `PAT-${String(artigo.id).padStart(6, '0')}`,
      nome: artigo.nome_artigo,
      descricao: artigo.descricao || '',
      categoria: mapCategoria(artigo.categoria),
      marca: '',
      modelo: '',
      localizacao: artigo.localizacao_stock,
      status: 'OPERACIONAL',
      quantidade_stock: Number(artigo.quantidade_stock) || 0,
      preco: Number(artigo.preco_venda) || 0,
      dataAquisicao: artigo.created_at,
      activo: artigo.activo,
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

    // Criar no banco
    const artigo = await prisma.artigos_stock.create({
      data: {
        codigo_artigo: body.codigo || `ART-${Date.now()}`,
        nome_artigo: body.nome,
        descricao: body.descricao || null,
        categoria: body.categoria || 'Outro',
        localizacao_stock: body.localizacao || 'Almoxarifado',
        quantidade_stock: body.quantidade_stock || 0,
        preco_venda: body.preco || 0,
        preco_compra: body.precoCompra || 0,
        activo: true,
        registado_por: BigInt(1), // TODO: obter do auth
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: Number(artigo.id),
        codigo: artigo.codigo_artigo,
        nome: artigo.nome_artigo,
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

function mapCategoria(categoria: string): string {
  const mapeamento: Record<string, string> = {
    Medicamento: 'OUTROS',
    Material_Medico: 'ELECTROMEDICINA',
    Equipamento: 'ELECTROMEDICINA',
    Consumivel: 'OUTROS',
    Outro: 'OUTROS',
  };
  return mapeamento[categoria] || 'OUTROS';
}

