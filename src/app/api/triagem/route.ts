import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar triagens
export async function GET() {
  try {
    const triagens = await prisma.triagem.findMany({
      orderBy: { created_at: 'desc' },
    });
    
    // Mapear BigInt para Number para JSON
    const data = triagens.map(t => ({
      ...t,
      id: Number(t.id),
      paciente_id: t.paciente_id ? Number(t.paciente_id) : null,
    }));

    return NextResponse.json({ data, success: true });
  } catch (error) {
    console.error('Erro ao buscar triagens:', error);
    return NextResponse.json({ data: [], success: false, error: 'Erro ao buscar triagens.' }, { status: 500 });
  }
}

// POST: Criar triagem
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const triagem = await prisma.triagem.create({
      data: {
        paciente_nome: body.paciente,
        idade: parseInt(body.idade),
        genero: body.genero,
        prioridade: body.prioridade,
        status: body.status || "Aguardando",
        queixa_principal: body.queixaPrincipal,
      },
    });

    return NextResponse.json({ 
      data: { ...triagem, id: Number(triagem.id) }, 
      success: true 
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar triagem:', error);
    return NextResponse.json({ success: false, error: 'Erro ao criar triagem.' }, { status: 500 });
  }
}

