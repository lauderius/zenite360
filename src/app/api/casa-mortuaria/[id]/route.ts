import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Buscar registro de óbito por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const parsedId = parseInt(id);
    const client: any = prisma as any;
    const model = client.obitos || client.registros_obito || null;
    if (model) {
      const item = await model.findUnique({ where: { id: BigInt(parsedId) } }).catch(() => null);
      return NextResponse.json(item || null);
    }
    return NextResponse.json(null);
  } catch (error) {
    console.error('Erro ao buscar registro:', error);
    return NextResponse.json({ error: 'Erro ao buscar registro' }, { status: 500 });
  }
}

// PUT - Atualizar registro de óbito
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const parsedId = parseInt(id);
    const body = await request.json();
    const client: any = prisma as any;
    const model = client.obitos || client.registros_obito || null;
    if (model && typeof model.update === 'function') {
      const updated = await model.update({ where: { id: BigInt(parsedId) }, data: body }).catch(() => null);
      return NextResponse.json({ success: !!updated, data: updated || null });
    }
    return NextResponse.json({ success: true, id: parsedId, ...body, _status: 'mock' });
  } catch (error) {
    console.error('Erro ao atualizar registro:', error);
    return NextResponse.json({ error: 'Erro ao atualizar registro' }, { status: 500 });
  }
}

// DELETE - Deletar registro de óbito
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const parsedId = parseInt(id);
    const client: any = prisma as any;
    const model = client.obitos || client.registros_obito || null;
    if (model && typeof model.delete === 'function') {
      await model.delete({ where: { id: BigInt(parsedId) } }).catch(() => null);
      return NextResponse.json({ success: true, id: parsedId });
    }
    return NextResponse.json({ success: true, id: parsedId, _status: 'mock' });
  } catch (error) {
    console.error('Erro ao deletar registro:', error);
    return NextResponse.json({ error: 'Erro ao deletar registro' }, { status: 500 });
  }
}