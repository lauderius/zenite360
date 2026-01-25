import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar triagens (se existir model 'triagem' no Prisma, usa-o; caso contrário retorna vazio)
export async function GET() {
  try {
    const client: any = prisma as any;
    if (client.triagem && typeof client.triagem.findMany === 'function') {
      const triagens = await client.triagem.findMany();
      return NextResponse.json(triagens);
    }

    // Fallback: retornar lista vazia se tabela não existir no client Prisma
    return NextResponse.json([]);
  } catch (error) {
    console.error('Erro ao buscar triagens:', error);
    return NextResponse.json({ error: 'Erro ao buscar triagens.' }, { status: 500 });
  }
}

// POST: Criar triagem (fallback para 501 se não implementado)
export async function POST(req: NextRequest) {
  try {
    const client: any = prisma as any;
    if (client.triagem && typeof client.triagem.create === 'function') {
      const data = await req.json();
      const triagem = await client.triagem.create({ data });
      return NextResponse.json(triagem, { status: 201 });
    }

    return NextResponse.json({ error: 'Endpoint de triagem não suportado no banco.' }, { status: 501 });
  } catch (error) {
    console.error('Erro ao criar triagem:', error);
    return NextResponse.json({ error: 'Erro ao criar triagem.' }, { status: 500 });
  }
}
