import { NextRequest, NextResponse } from 'next/server';

// GET: Buscar internamento por ID
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Mock response
    // const internamento = await prisma.internamento.findUnique({ where: { id: Number(id) } });
    const internamento = {
      id,
      paciente: 'Paciente Mock',
      leito: 'Leito 1',
      setor: 'Geral',
      medicoResponsavel: 'Dr. Mock',
      dataEntrada: new Date(),
      status: 'Internado',
      _mock: true
    };

    if (!internamento) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json(internamento);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar internamento.' }, { status: 500 });
  }
}

// PUT: Atualizar internamento
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await req.json();
    // Mock response
    // const internamento = await prisma.internamento.update({ where: { id: Number(id) }, data });
    const internamento = { id, ...data, _mock: true };
    return NextResponse.json(internamento);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar internamento.' }, { status: 500 });
  }
}

// DELETE: Remover internamento
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Mock response
    // await prisma.internamento.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true, _mock: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover internamento.' }, { status: 500 });
  }
}
