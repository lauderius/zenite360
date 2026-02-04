import { NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

export async function GET() {
  try {
    // Simulação de agregação financeira (num sistema real seriam queries complexas de facturação)
    // Para o MVP clínico/financeiro, vamos buscar dados base

    const countPacientes = await prisma.pacientes.count({ where: { deleted_at: null } });
    const countConsultas = await prisma.consultas.count({ where: { deleted_at: null } });

    // Calcular facturação real baseada em agendamentos pagos
    const faturasPagas = await prisma.agendamentos.aggregate({
      where: {
        pago: true,
        deleted_at: null
      },
      _sum: {
        valor_consulta: true
      }
    });

    const facturacaoReal = Number(faturasPagas._sum.valor_consulta || 0);

    // Buscar transacções recentes de movimentos de stock com valor (exemplo de vendas)
    const transacoesRecentes = await prisma.movimentos_stock.findMany({
      take: 10,
      orderBy: { created_at: 'desc' },
      include: {
        pacientes: { select: { nome_completo: true } }
      }
    });

    const stats = {
      totalPacientes: countPacientes,
      totalConsultas: countConsultas,
      facturacaoMensal: facturacaoReal,
      movimentos: transacoesRecentes
    };

    const serialized = JSON.parse(JSON.stringify(stats, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('[API_FINANCEIRO_GET]', error);
    return handlePrismaError(error);
  }
}
