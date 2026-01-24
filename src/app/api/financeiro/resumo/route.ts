import { NextResponse } from 'next/server';

// GET: Resumo do financeiro
export async function GET() {
  try {
    // Dados mock para o resumo financeiro
    // Em implementação real, consultaria tabelas de movimento financeiro
    const resumo = {
      receitaHoje: 245000,
      receitaMes: 1850000,
      faturasEmitidas: 45,
      faturasPendentes: 12,
      faturasVencidas: 3,
      ticketMedio: 35000,
      totalFaturas: 60,
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

