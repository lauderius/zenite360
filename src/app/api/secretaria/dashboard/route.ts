import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Dashboard da Secretaria
export async function GET() {
  try {
    const [docHoje, docMes, reqPendentes] = await Promise.all([
      prisma.documentos.count({
        where: { dataDocumento: { gte: new Date(new Date().setHours(0,0,0,0)) } }
      }).catch(() => 0),
      prisma.documentos.count({
        where: { created_at: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } }
      }).catch(() => 0),
      prisma.requisicoes ? prisma.requisicoes.count({ where: { status: 'PENDENTE' } }).catch(() => 0) : Promise.resolve(0),
    ]);

    const documentosPorTipo = []; // requires specific aggregation - fallback empty
    const tramitacoesPorDepartamento = []; // fallback empty

    const dashboard = {
      documentosHoje: docHoje || 0,
      documentosMes: docMes || 0,
      documentosUrgentes: 0,
      tramitacoesPendentes: 0,
      tempoMedioTramitacao: 0,
      requisicoesMateriaisPendentes: reqPendentes || 0,
      documentosPorTipo,
      tramitacoesPorDepartamento,
    };

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error('Erro ao buscar dashboard da secretaria:', error);
    return NextResponse.json({
      documentosHoje: 0,
      documentosMes: 0,
      documentosUrgentes: 0,
      tramitacoesPendentes: 0,
      tempoMedioTramitacao: 0,
      requisicoesMateriaisPendentes: 0,
      documentosPorTipo: [],
      tramitacoesPorDepartamento: [],
      success: false,
    });
  }
}

