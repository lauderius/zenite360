import { NextResponse } from 'next/server';

// GET: Dashboard de Serviços Gerais
export async function GET() {
  try {
    // Dados mock para o dashboard de serviços gerais
    const dashboard = {
      contratosVigentes: 8,
      valorTotalContratos: 2500000,
      funcionariosTerceirizados: 45,
      residuosTotalKgMes: 1250,
      residuosInfectantesKg: 320,
      avaliacaoMediaContratos: 4.2,
      contratosProximoVencimento: 2,
    };

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error('Erro ao buscar dashboard de serviços gerais:', error);
    return NextResponse.json({
      contratosVigentes: 0,
      valorTotalContratos: 0,
      funcionariosTerceirizados: 0,
      residuosTotalKgMes: 0,
      residuosInfectantesKg: 0,
      avaliacaoMediaContratos: 0,
      contratosProximoVencimento: 0,
      success: false,
    });
  }
}

