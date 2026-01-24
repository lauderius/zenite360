import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Estatísticas do Dashboard
export async function GET() {
  try {
    // Obter data de hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    // Contadores básicos do banco
    const [
      totalPacientes,
      pacientesHoje,
      totalAgendamentos,
      agendamentosHoje,
      totalConsultas,
      consultasHoje,
      totalPrescricoes,
      prescricoesPendentes,
      articulosStock,
      estoqueCritico,
      triagemPendente,
      internamentosActivos,
    ] = await Promise.all([
      prisma.pacientes.count({ where: { deleted_at: null } }),
      prisma.pacientes.count({
        where: {
          created_at: { gte: hoje },
          deleted_at: null,
        },
      }),
      prisma.agendamentos.count({ where: { deleted_at: null } }),
      prisma.agendamentos.count({
        where: {
          data_agendamento: { gte: hoje },
          deleted_at: null,
        },
      }),
      prisma.consultas.count({ where: { deleted_at: null } }),
      prisma.consultas.count({
        where: {
          data_consulta: { gte: hoje },
          deleted_at: null,
        },
      }),
      prisma.prescricoes.count({ where: { deleted_at: null } }),
      prisma.prescricoes.count({
        where: { status: 'Ativa' },
      }),
      prisma.artigos_stock.count({ where: { activo: true } }),
      prisma.artigos_stock.count({
        where: {
          activo: true,
          quantidade_stock: { lt: prisma.artigos_stock.fields.stock_minimo },
        },
      }).catch(() => 0), // Se a query falhar, retorna 0
      // Triagem pendente (exames solicitados não realizados)
      prisma.exames_solicitados.count({
        where: { status: 'Pendente' },
      }).catch(() => 0),
      // Internamentos ativos (tabela ainda não implementada)
      0,
    ]);

    // Se o banco não tiver dados, usar valores default
    const stats = {
      pacientesHoje: pacientesHoje || 0,
      pacientesTotal: totalPacientes || 0,
      consultasAgendadas: agendamentosHoje || 0,
      consultasTotal: totalAgendamentos || 0,
      consultasRealizadas: consultasHoje || 0,
      consultasTotalGeral: totalConsultas || 0,
      prescricoesPendentes: prescricoesPendentes || 0,
      prescricoesTotal: totalPrescricoes || 0,
      artigosStock: articulosStock || 0,
      estoqueCritico: estoqueCritico || 0,
      faturasVencidas: 0,
      ordensAbertas: 0,
      triagemPendente: 0,
      internamentosActivos: 0,
      
      // Para dashboard visual
      loading: false,
      data: new Date().toISOString(),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    
    // Retornar dados vazios em caso de erro
    return NextResponse.json({
      pacientesHoje: 0,
      pacientesTotal: 0,
      consultasAgendadas: 0,
      consultasTotal: 0,
      consultasRealizadas: 0,
      consultasTotalGeral: 0,
      prescricoesPendentes: 0,
      prescricoesTotal: 0,
      artigosStock: 0,
      estoqueCritico: 0,
      faturasVencidas: 0,
      ordensAbertas: 0,
      triagemPendente: 0,
      internamentosActivos: 0,
      loading: false,
      data: new Date().toISOString(),
    });
  }
}

