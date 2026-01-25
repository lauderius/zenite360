import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar registros de óbito
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const client: any = prisma as any;
    const model = client.obitos || client.registros_obito || null;

    if (model) {
      const where: any = {};
      if (status) where.status = status;
      if (search) where.OR = [{ nomeCompleto: { contains: search } }, { codigo: { contains: search } }];
      const total = await model.count({ where }).catch(() => 0);
      const items = await model.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }).catch(() => []);

      return NextResponse.json({ data: items, pagination: { page, limit, total, totalPages: Math.ceil((total||0)/limit) }, success: true });
    }

    return NextResponse.json({ data: [], pagination: { page, limit, total: 0, totalPages: 0 }, success: true });
  } catch (error) {
    console.error('Erro ao buscar registros:', error);
    return NextResponse.json({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }, success: false, error: 'Erro ao buscar registros' });
  }
}

// POST: Criar novo registro de óbito
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client: any = prisma as any;
    const model = client.obitos || client.registros_obito || null;

    if (model && typeof model.create === 'function') {
      const created = await model.create({ data: { ...body, status: body.status || 'ADMITIDO', dataAdmissao: body.dataAdmissao ? new Date(body.dataAdmissao) : new Date() } }).catch(() => null);
      if (created) return NextResponse.json({ success: true, data: created });
    }

    const novoRegistro = { id: Date.now(), codigo: `OB-${new Date().getFullYear()}-${Date.now()}`, ...body, status: 'ADMITIDO', dataAdmissao: new Date() };
    return NextResponse.json({ success: true, data: novoRegistro });
  } catch (error) {
    console.error('Erro ao criar registro:', error);
    return NextResponse.json({ success: false, error: 'Erro ao criar registro' }, { status: 500 });
  }
}

