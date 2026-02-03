import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar triagens (se existir model 'triagem' no Prisma, usa-o; caso contrário retorna vazio)
export async function GET() {
  try {
    const client: any = prisma as any;
    if (client.triagem && typeof client.triagem.findMany === 'function') {
      const triagens = await client.triagem.findMany();
      return NextResponse.json({ data: triagens, success: true });
    }

    // Fallback: retornar lista vazia se tabela não existir no client Prisma
    return NextResponse.json({ data: [], success: true });
  } catch (error) {
    console.error('Erro ao buscar triagens:', error);
    return NextResponse.json({ data: [], success: false, error: 'Erro ao buscar triagens.' }, { status: 500 });
  }
}

// POST: Criar triagem (fallback para 501 se não implementado)
export async function POST(req: NextRequest) {
  try {
    const client: any = prisma as any;
    if (client.triagem && typeof client.triagem.create === 'function') {
      const data = await req.json();
      const triagem = await client.triagem.create({ data });
      return NextResponse.json({ data: triagem, success: true }, { status: 201 });
    }

    return NextResponse.json({ success: false, error: 'Endpoint de triagem não suportado no banco.' }, { status: 501 });
  } catch (error) {
    console.error('Erro ao criar triagem:', error);
    return NextResponse.json({ error: 'Erro ao criar triagem.' }, { status: 500 });
  }
}
