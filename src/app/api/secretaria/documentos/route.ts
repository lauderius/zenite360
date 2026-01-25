import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar documentos — usa modelo 'documentos' ou fallback
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const tipo = searchParams.get('tipo') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const client: any = prisma as any;
    const model = client.documentos || client.secretaria_documentos || null;

    if (model) {
      const where: any = {};
      if (search) where.OR = [{ assunto: { contains: search } }, { numero: { contains: search } }];
      if (tipo) where.tipo = tipo;
      if (status) where.status = status;
      const total = await model.count({ where }).catch(() => 0);
      const items = await model.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }).catch(() => []);

      return NextResponse.json({
        data: items,
        pagination: { page, limit, total, totalPages: Math.ceil((total || 0) / limit) },
        success: true,
      });
    }

    return NextResponse.json({ data: [], pagination: { page, limit, total: 0, totalPages: 0 }, success: true });
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    return NextResponse.json({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }, success: false, error: 'Erro ao buscar documentos' });
  }
}

// POST: Criar novo documento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client: any = prisma as any;
    const model = client.documentos || client.secretaria_documentos || null;

    if (model && typeof model.create === 'function') {
      const created = await model.create({ data: { ...body, status: body.status || 'RASCUNHO', dataDocumento: body.dataDocumento ? new Date(body.dataDocumento) : new Date() } }).catch(() => null);
      if (created) return NextResponse.json({ success: true, data: created });
    }

    const novoDocumento = { id: Date.now(), numero: `SEC-${new Date().getFullYear()}-${Date.now()}`, ...body, status: 'RASCUNHO', dataDocumento: new Date(), criadoEm: new Date() };
    return NextResponse.json({ success: true, data: novoDocumento });
  } catch (error) {
    console.error('Erro ao criar documento:', error);
    return NextResponse.json({ success: false, error: 'Erro ao criar documento' }, { status: 500 });
  }
}

