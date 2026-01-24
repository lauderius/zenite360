import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar pacientes
export async function GET() {
  try {
    const pacientes = await prisma.paciente.findMany();
    return NextResponse.json(pacientes);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar pacientes.' }, { status: 500 });
  }
}

// POST: Criar paciente
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const paciente = await prisma.paciente.create({ data });
    return NextResponse.json(paciente, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar paciente.' }, { status: 500 });
  }
}
