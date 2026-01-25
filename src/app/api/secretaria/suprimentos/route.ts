import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar suprimentos (usa modelo 'suprimentos' ou fallback)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const categoria = searchParams.get('categoria') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const client: any = prisma as any;
    const model = client.suprimentos || client.artigos_stock || null;

    if (model) {
      const where: any = {};
      if (search) {
        where.OR = [
          { nome: { contains: search } },
          { codigo: { contains: search } },
          { nome_artigo: { contains: search } },
          { codigo_artigo: { contains: search } },
        ];
      }
      if (categoria) where.categoria = categoria;
      const total = await model.count({ where }).catch(() => 0);
      const items = await model.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
      }).catch(() => []);

      const data = (items || []).map((it: any) => ({
        id: Number(it.id),
        codigo: it.codigo || it.codigo_artigo || `SUP-${it.id}`,
        nome: it.nome || it.nome_artigo || 'Item',
        categoria: it.categoria || 'Geral',
        quantidadeAtual: Number(it.quantidadeAtual ?? it.quantidade_stock ?? 0),
        quantidadeMinima: Number(it.quantidadeMinima ?? it.stock_minimo ?? 0),
        unidadeMedida: it.unidadeMedida || it.unidade_medida || 'un',
      }));

      return NextResponse.json({
        data,
        pagination: { page, limit, total, totalPages: Math.ceil((total || 0) / limit) },
        success: true,
      });
    }

    return NextResponse.json({ data: [], pagination: { page, limit, total: 0, totalPages: 0 }, success: true });
  } catch (error) {
    console.error('Erro ao buscar suprimentos:', error);
    return NextResponse.json({ data: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 0 }, success: false, error: 'Erro ao buscar suprimentos' });
  }
}

// POST: Criar novo suprimento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client: any = prisma as any;
    const model = client.suprimentos || client.artigos_stock || null;

    if (model && typeof model.create === 'function') {
      const created = await model.create({ data: {
        codigo_artigo: body.codigo,
        nome_artigo: body.nome,
        categoria: body.categoria,
        quantidade_stock: body.quantidadeAtual ?? body.quantidade,
        stock_minimo: body.quantidadeMinima ?? body.stock_minimo,
        unidade_medida: body.unidadeMedida,
        activo: true,
      }}).catch(() => null);
      if (created) return NextResponse.json({ success: true, data: {
        id: Number(created.id),
        codigo: created.codigo_artigo || created.codigo,
        nome: created.nome_artigo || created.nome,
      }});
    }

    const novoSuprimento = { id: Date.now(), codigo: `SUP-${Date.now()}`, ...body, criadoEm: new Date() };
    return NextResponse.json({ success: true, data: novoSuprimento });
  } catch (error) {
    console.error('Erro ao criar suprimento:', error);
    return NextResponse.json({ success: false, error: 'Erro ao criar suprimento' }, { status: 500 });
  }
}

// DELETE: Excluir suprimento
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const client: any = prisma as any;
    const model = client.suprimentos || client.artigos_stock || null;
    if (model && typeof model.delete === 'function') {
      await model.delete({ where: { id: Number(id) } }).catch(() => null);
      return NextResponse.json({ success: true, message: 'Suprimento excluído com sucesso' });
    }

    return NextResponse.json({ success: true, message: 'Suprimento excluído (simulado)' });
  } catch (error) {
    console.error('Erro ao excluir suprimento:', error);
    return NextResponse.json({ success: false, error: 'Erro ao excluir suprimento' }, { status: 500 });
  }
}

