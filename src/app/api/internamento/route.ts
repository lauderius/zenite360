import { NextRequest, NextResponse } from 'next/server';

// GET: Listar internamentos
export async function GET() {
  try {
    // Mock response
    // const internamentos = await prisma.internamento.findMany();
    const internamentos: any[] = [];
    return NextResponse.json({ data: internamentos, success: true });
  } catch (error) {
    return NextResponse.json({ data: [], success: false, error: 'Erro ao buscar internamentos.' }, { status: 500 });
  }
}

// POST: Criar internamento
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Mock response
    // const internamento = await prisma.internamento.create({ data });
    const internamento = { id: 1, ...data, _mock: true };
    return NextResponse.json(internamento, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar internamento.' }, { status: 500 });
  }
}
