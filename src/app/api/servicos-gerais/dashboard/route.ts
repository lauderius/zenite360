import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Dashboard de Serviços Gerais
export async function GET() {
  try {
    // Usar dados reais quando disponíveis, caso contrário retornar zeros
    const [totalFuncionarios, totalArtigos, estoqueTotal] = await Promise.all([
      prisma.funcionarios.count().catch(() => 0),
      prisma.artigos_stock.count().catch(() => 0),
      prisma.artigos_stock.aggregate({
        _sum: { quantidade_stock: true },
      }).catch(() => ({ _sum: { quantidade_stock: 0 } })),
    ]);

    const dashboard = {
      contratosVigentes: 0,
      valorTotalContratos: 0,
      funcionariosTerceirizados: totalFuncionarios || 0,
      residuosTotalKgMes: 0,
      residuosInfectantesKg: 0,
      avaliacaoMediaContratos: 0,
      contratosProximoVencimento: 0,
      totalArtigosEstoque: totalArtigos || 0,
      estoqueTotal: Number(estoqueTotal?._sum?.quantidade_stock || 0),
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

