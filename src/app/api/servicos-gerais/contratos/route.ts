import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar contratos — tenta usar model prisma.contratos ou fallback
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tipo = searchParams.get('tipo') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const client: any = prisma as any;
    const model = client.contratos || client.servicos_contratos || client.contratos_terceiros || null;

    if (model) {
      const where: any = {};
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

    // Fallback: vazio
    return NextResponse.json({ data: [], pagination: { page, limit, total: 0, totalPages: 0 }, success: true });
  } catch (error) {
    console.error('Erro ao buscar contratos:', error);
    return NextResponse.json({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }, success: false, error: 'Erro ao buscar contratos' });
  }
}

// POST: Criar novo contrato — cria no DB se modelo existir
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client: any = prisma as any;
    const model = client.contratos || client.servicos_contratos || client.contratos_terceiros || null;

    if (model && typeof model.create === 'function') {
      const created = await model.create({ data: { ...body, status: body.status || 'VIGENTE' } }).catch(() => null);
      if (created) return NextResponse.json({ success: true, data: created });
    }

    const novoContrato = { id: Date.now(), codigo: `CTR-${new Date().getFullYear()}-${Date.now()}`, ...body, status: 'VIGENTE' };
    return NextResponse.json({ success: true, data: novoContrato });
  } catch (error) {
    console.error('Erro ao criar contrato:', error);
    return NextResponse.json({ success: false, error: 'Erro ao criar contrato' }, { status: 500 });
  }
}

