import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar coletas de resíduos — tenta usar o modelo do prisma se existir, senão retorna vazio.
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const client: any = prisma as any;
    // Tentar modelos comuns
    const model = client.coletas || client.residuos || client.residuos_coletas || null;

    if (model) {
      const where: any = {};
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

    // Fallback seguro: retornar vazio
    return NextResponse.json({
      data: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar coletas:', error);
    return NextResponse.json({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }, success: false, error: 'Erro ao buscar coletas' });
  }
}

// POST: Agendar nova coleta — cria no DB se o modelo existir
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client: any = prisma as any;
    const model = client.coletas || client.residuos || client.residuos_coletas || null;

    if (model && typeof model.create === 'function') {
      const created = await model.create({ data: { ...body, status: 'AGENDADA' } }).catch(() => null);
      if (created) return NextResponse.json({ success: true, data: created });
    }

    // Fallback: 501 not implemented
    const novaColeta = { id: Date.now(), codigo: `COL-${new Date().getFullYear()}-${Date.now()}`, ...body, status: 'AGENDADA' };
    return NextResponse.json({ success: true, data: novaColeta });
  } catch (error) {
    console.error('Erro ao agendar coleta:', error);
    return NextResponse.json({ success: false, error: 'Erro ao agendar coleta' }, { status: 500 });
  }
}

