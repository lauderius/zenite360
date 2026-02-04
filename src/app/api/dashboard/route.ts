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

    // Dados reais de Triagens
    const emTriagem = await prisma.triagem.count({
      where: { status: { not: 'Atendido' } }
    }).catch(() => 0);

    const triagensRecentes = await prisma.triagem.findMany({
      take: 5,
      orderBy: { created_at: 'desc' }
    }).catch(() => []);

    // Agregados para Manchester
    const agrupamentoPrioridade = await prisma.triagem.groupBy({
      by: ['prioridade'],
      _count: { id: true }
    }).catch(() => []);

    const chartData = [
      { label: 'Emergência', value: agrupamentoPrioridade.find(p => ['Vermelho', 'Emergência', 'EMERGENCIA'].includes(p.prioridade.toUpperCase()))?._count.id || 0 },
      { label: 'M. Urgente', value: agrupamentoPrioridade.find(p => ['Laranja', 'Muito Urgente', 'M_URGENTE'].includes(p.prioridade.toUpperCase()))?._count.id || 0 },
      { label: 'Urgente', value: agrupamentoPrioridade.find(p => ['Amarelo', 'Urgente', 'URGENTE'].includes(p.prioridade.toUpperCase()))?._count.id || 0 },
      { label: 'Pouco Urg.', value: agrupamentoPrioridade.find(p => ['Verde', 'Pouco Urgente', 'POUCO_URGENTE'].includes(p.prioridade.toUpperCase()))?._count.id || 0 },
      { label: 'Não Urg.', value: agrupamentoPrioridade.find(p => ['Azul', 'Não Urgente', 'NAO_URGENTE'].includes(p.prioridade.toUpperCase()))?._count.id || 0 },
    ];

    // Mock Admissões (Enquanto não há tabela de Internamento no Prisma)
    const admissoesAtivas = await prisma.pacientes.count({
      where: { created_at: { gte: today } }
    }).catch(() => 0);

    // Formatar atividades mixando agendamentos e triagens
    const atividades = [
      ...agendamentosRecentes.map(ag => ({
        id: `ag-${ag.id}`,
        titulo: `Consulta: ${ag.pacientes?.nome_completo}`,
        tempo: 'Recentemente',
        descricao: `${ag.especialidade} - ${ag.status}`,
      })),
      ...triagensRecentes.map(tr => ({
        id: `tr-${tr.id}`,
        titulo: `Triagem: ${tr.paciente_nome || 'Anónimo'}`,
        tempo: 'Agora',
        descricao: `Prioridade: ${tr.prioridade}`,
      }))
    ].slice(0, 8);

    // Pacientes Críticos Reais
    const pacientesCriticos = await prisma.triagem.findMany({
      where: { prioridade: { in: ['Vermelho', 'Emergência', 'Laranja', 'Muito Urgente'] }, status: { not: 'Atendido' } },
      take: 4,
      orderBy: { created_at: 'desc' }
    }).catch(() => []);

    // Fluxo Regional Real
    const porProvincia = await prisma.pacientes.groupBy({
      by: ['provincia'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    }).catch(() => []);

    const totalPacientesProv = porProvincia.reduce((acc, curr) => acc + curr._count.id, 0);
    const fluxoRegional = porProvincia.map(p => ({
      label: p.provincia,
      value: totalPacientesProv > 0 ? Math.round((p._count.id / totalPacientesProv) * 100) : 0
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
      pacientesCriticos: pacientesCriticos.map(p => ({
        id: p.id.toString(),
        nome: p.paciente_nome || 'N/A',
        prioridade: p.prioridade,
        tempoEspera: 'Em espera', // Poderia calcular baseado no created_at
      })),
      fluxoRegional,
      chartData
    });
  } catch (error) {
    console.error('[API_DASHBOARD_GET]', error);
    return handlePrismaError(error);
  }
}
