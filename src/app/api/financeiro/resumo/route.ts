import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Resumo do financeiro
export async function GET() {
  try {
    const client: any = prisma as any;
    const totalFaturas = await (client.faturas ? client.faturas.count().catch(() => 0) : Promise.resolve(0));
    const faturasVencidas = await (client.faturas ? client.faturas.count({ where: { status: 'VENCIDA' } }).catch(() => 0) : Promise.resolve(0));
    const faturasPendentes = await (client.faturas ? client.faturas.count({ where: { status: 'EMITIDA' } }).catch(() => 0) : Promise.resolve(0));

    const resumo = {
      receitaHoje: 0,
      receitaMes: 0,
      faturasEmitidas: totalFaturas || 0,
      faturasPendentes: faturasPendentes || 0,
      faturasVencidas: faturasVencidas || 0,
      ticketMedio: 0,
      totalFaturas: totalFaturas || 0,
    };

    return NextResponse.json(resumo);
  } catch (error) {
    console.error('Erro ao buscar resumo financeiro:', error);
    return NextResponse.json({
      receitaHoje: 0,
      receitaMes: 0,
      faturasEmitidas: 0,
      faturasPendentes: 0,
      faturasVencidas: 0,
      ticketMedio: 0,
    });
  }
}

