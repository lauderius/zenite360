import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar ativos
export async function GET() {
  try {
    const ativos = await prisma.ativos_patrimonio.findMany();
    // Suportar BigInt
    const serialized = JSON.parse(JSON.stringify(ativos, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Erro ao buscar ativos:', error);
    return NextResponse.json({ error: 'Erro ao buscar ativos.' }, { status: 500 });
  }
}

// POST: Criar ativo
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const ativo = await prisma.ativos_patrimonio.create({
      data: {
        codigo: data.codigo || `ATV-${Date.now()}`,
        nome: data.nome,
        categoria: data.categoria,
        marca: data.marca,
        modelo: data.modelo,
        numero_serie: data.numero_serie,
        localizacao: data.localizacao,
        status: data.status || 'Operacional'
      }
    });

    // Suportar BigInt
    const serialized = JSON.parse(JSON.stringify(ativo, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json(serialized, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar ativo:', error);
    return NextResponse.json({ error: 'Erro ao criar ativo.' }, { status: 500 });
  }
}
