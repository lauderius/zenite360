import { NextRequest, NextResponse } from 'next/server';

// GET: Buscar ativo por ID
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Mock response
    // const ativo = await prisma.ativos.findUnique({ where: { id: Number(id) } });
    const ativo = {
      id,
      nome: 'Ativo Mock',
      tipo: 'Equipamento',
      valor: 5000,
      dataAquisicao: new Date(),
      status: 'Ativo',
      _mock: true
    };

    if (!ativo) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json(ativo);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar ativo.' }, { status: 500 });
  }
}

// PUT: Atualizar ativo
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await req.json();
    // Mock response
    // const ativo = await prisma.ativos.update({ where: { id: Number(id) }, data });
    const ativo = { id, ...data, _mock: true };
    return NextResponse.json(ativo);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar ativo.' }, { status: 500 });
  }
}

// DELETE: Remover ativo
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Mock response
    // await prisma.ativos.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true, _mock: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover ativo.' }, { status: 500 });
  }
}
