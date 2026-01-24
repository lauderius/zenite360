import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar agendamentos
export async function GET() {
  try {
    const agendamentos = await prisma.agendamentos.findMany();
    return NextResponse.json(agendamentos);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar agendamentos.' }, { status: 500 });
  }
}

// POST: Criar agendamento
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const agendamento = await prisma.agendamentos.create({ data });
    return NextResponse.json(agendamento, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar agendamento.' }, { status: 500 });
  }
}
