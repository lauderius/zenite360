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
// POST: Criar triagem
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Prepare data for Prisma
    const data: any = {
      paciente_nome: body.paciente_nome || body.paciente,
      idade: body.idade ? parseInt(body.idade) : null,
      genero: body.genero,
      prioridade: body.prioridade || 'Normal',
      status: body.status || "Aguardando",
      queixa_principal: body.queixa_principal,
      // Sinais Vitais
      pressao_arterial: body.pressao_arterial,
      frequencia_cardiaca: body.frequencia_cardiaca ? parseInt(body.frequencia_cardiaca) : null,
      frequencia_respiratoria: body.frequencia_respiratoria ? parseInt(body.frequencia_respiratoria) : null,
      temperatura: body.temperatura ? parseFloat(body.temperatura) : null,
      saturacao_oxigenio: body.saturacao_oxigenio ? parseInt(body.saturacao_oxigenio) : null,
    };

    if (body.paciente_id) {
      data.paciente_id = body.paciente_id;
    }

    const triagem = await prisma.triagem.create({
      data: data,
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

