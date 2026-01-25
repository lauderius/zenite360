import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Dashboard da Casa Mortuária
export async function GET() {
  try {
    const client: any = prisma as any;
    // Tentativa de usar possíveis tabelas relacionadas
    const obitosHoje = await (client.obitos ? client.obitos.count({ where: { data: { gte: new Date(new Date().setHours(0,0,0,0)) } } }) : Promise.resolve(0)).catch(() => 0);
    const obitosMes = await (client.obitos ? client.obitos.count({ where: { created_at: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } }) : Promise.resolve(0)).catch(() => 0);

    const dashboard = {
      corposEmConservacao: 0,
      capacidadeTotalCamaras: 0,
      aguardandoDocumentacao: 0,
      obitosHoje: obitosHoje || 0,
      obitosMes: obitosMes || 0,
      tempoMedioConservacao: 0,
      distribuicaoPorCausa: [],
      distribuicaoPorGenero: [],
      success: true,
    };

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error('Erro ao buscar dashboard da casa mortuária:', error);
    return NextResponse.json({
      corposEmConservacao: 0,
      capacidadeTotalCamaras: 0,
      aguardandoDocumentacao: 0,
      obitosHoje: 0,
      obitosMes: 0,
      tempoMedioConservacao: 0,
      distribuicaoPorCausa: [],
      distribuicaoPorGenero: [],
      success: false,
      error: 'Erro ao carregar dados',
    });
  }
}

