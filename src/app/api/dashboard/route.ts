import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { handlePrismaError } from '@/lib/prisma';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Consultas para hoje
    const consultasHoje = await prisma.agendamentos.count({
      where: {
        data_agendamento: {
          gte: today,
          lt: tomorrow,
        },
        deleted_at: null,
      },
    });

    // Total de pacientes (pode ser útil para contexto)
    const totalPacientes = await prisma.pacientes.count({
      where: { deleted_at: null },
    });

    // Itens em stock crítico
    const stockCritico = await prisma.artigos_stock.count({
      where: {
        quantidade_stock: {
          lte: prisma.artigos_stock.fields.stock_minimo,
        },
        deleted_at: null,
      },
    });

    // Agendamentos recentes para a lista de atividades
    const agendamentosRecentes = await prisma.agendamentos.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        pacientes: {
          select: { nome_completo: true }
        }
      },
      where: { deleted_at: null }
    });

    // Mocking some data that is not yet fully in schema or needs more complex logic
    // In a real scenario, these would come from specific tables or logic
    const emTriagem = 18; // Placeholder
    const admissoesAtivas = 45; // Placeholder

    // Formatar agendamentos recentes para a UI
    const atividades = agendamentosRecentes.map(ag => ({
      id: ag.id.toString(),
      tipo: 'AGENDAMENTO',
      titulo: `Novo Agendamento: ${ag.pacientes?.nome_completo || 'Paciente'}`,
      tempo: 'Recente',
      descricao: `Consulta de ${ag.especialidade}`,
      status: ag.status
    }));

    return NextResponse.json({
      stats: {
        consultasHoje,
        emTriagem,
        admissoesAtivas,
        stockCritico,
        totalPacientes
      },
      atividades,
      chartData: [
        { label: 'Emergência', value: 12 },
        { label: 'M. Urgente', value: 28 },
        { label: 'Urgente', value: 45 },
        { label: 'Pouco Urg.', value: 30 },
        { label: 'Não Urg.', value: 5 },
      ]
    });
  } catch (error) {
    console.error('[API_DASHBOARD_GET]', error);
    return handlePrismaError(error);
  }
}
