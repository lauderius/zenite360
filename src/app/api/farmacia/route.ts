import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Lista de medicamentos e dashboard
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    let artigos: any[] = [];
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

      [artigos, total] = await Promise.all([
        prisma.artigos_stock.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { nome_artigo: 'asc' },
        }),
        prisma.artigos_stock.count({ where }),
      ]);
    } catch (dbError) {
      artigos = [];
      total = 0;
    }

    // Mapear para formato da aplicação
    const medicamentos = artigos.map((artigo) => ({
      id: Number(artigo.id),
      codigo: artigo.codigo_artigo,
      nome: artigo.nome_artigo,
      apresentacao: artigo.unidade_medida || 'Unidade',
      tipo: artigo.tipo_medicamento || 'Referencia',
      estoque: Number(artigo.quantidade_stock) || 0,
      estoqueMinimo: Number(artigo.stock_minimo) || 10,
      preco: Number(artigo.preco_venda) || 0,
      validade: artigo.data_validade,
      controlado: artigo.controlado_anvisa || false,
      categoria: artigo.categoria,
    }));

    // Calcular alertas de estoque
    const estoqueCritico = medicamentos.filter(m => m.estoque < m.estoqueMinimo * 0.5);
    const estoqueBaixo = medicamentos.filter(m => m.estoque >= m.estoqueMinimo * 0.5 && m.estoque < m.estoqueMinimo);

    return NextResponse.json({
      data: medicamentos,
      stats: {
        total: medicamentos.length,
        critico: estoqueCritico.length,
        baixo: estoqueBaixo.length,
        ok: medicamentos.length - estoqueCritico.length - estoqueBaixo.length,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar medicamentos:', error);
    return NextResponse.json({
      data: [],
      stats: { total: 0, critico: 0, baixo: 0, ok: 0 },
      pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
      success: false,
      error: 'Erro ao buscar medicamentos',
    });
  }
}

// POST: Criar novo medicamento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const artigo = await prisma.artigos_stock.create({
      data: {
        codigo_artigo: body.codigo || `ART-${Date.now()}`,
        nome_artigo: body.nome,
        descricao: body.descricao || null,
        categoria: body.categoria || 'Medicamento',
        tipo_medicamento: body.tipo || 'Referencia',
        localizacao_stock: body.localizacao || 'Farmacia_Central',
        prateleira: body.prateleira || null,
        lote_atual: body.lote || null,
        data_validade: body.validade ? new Date(body.validade) : null,
        quantidade_stock: body.estoque || 0,
        unidade_medida: body.apresentacao || 'Unidade',
        stock_minimo: body.estoqueMinimo || 10,
        stock_maximo: body.estoqueMaximo || 100,
        preco_compra: body.precoCompra || 0,
        preco_venda: body.preco || 0,
        requer_receita_medica: body.requerReceita || false,
        controlado_anvisa: body.controlado || false,
        refrigeracao_necessaria: body.refrigeracao || false,
        activo: true,
        registado_por: BigInt(1),
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
    console.error('Erro ao criar medicamento:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar medicamento' },
      { status: 500 }
    );
  }
}

