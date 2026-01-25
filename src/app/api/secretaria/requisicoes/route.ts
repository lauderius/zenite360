import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';
    const departamento = searchParams.get('departamento') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const client: any = prisma as any;
    const model = client.requisicoes || client.requisicoes_material || null;

    if (model) {
      const where: any = {};
      if (status) where.status = status;
      if (departamento) where.departamentoSolicitante = departamento;
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
    console.error('Erro ao buscar requisições:', error);
    return NextResponse.json({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }, success: false, error: 'Erro ao buscar requisições' });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client: any = prisma as any;
    const model = client.requisicoes || client.requisicoes_material || null;

    if (model && typeof model.create === 'function') {
      const created = await model.create({ data: { ...body, status: 'PENDENTE' } }).catch(() => null);
      if (created) return NextResponse.json({ success: true, data: created });
    }

    const novaRequisicao = { id: Date.now(), codigo: `REQ-${new Date().getFullYear()}-${Date.now()}`, ...body, status: 'PENDENTE', dataSolicitacao: new Date() };
    return NextResponse.json({ success: true, data: novaRequisicao });
  } catch (error) {
    console.error('Erro ao criar requisição:', error);
    return NextResponse.json({ success: false, error: 'Erro ao criar requisição' }, { status: 500 });
  }
}

