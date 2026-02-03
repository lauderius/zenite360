import { NextRequest, NextResponse } from 'next/server';

// GET: Listar ativos
export async function GET() {
  try {
    // Mock response
    // const ativos = await prisma.ativos.findMany();
    const ativos: any[] = [];
    return NextResponse.json(ativos);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar ativos.' }, { status: 500 });
  }
}

// POST: Criar ativo
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Mock response
    // const ativo = await prisma.ativos.create({ data });
    const ativo = { id: 1, ...data, _mock: true };
    return NextResponse.json(ativo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar ativo.' }, { status: 500 });
  }
}
