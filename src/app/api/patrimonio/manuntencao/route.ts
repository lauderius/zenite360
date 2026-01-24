import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Lista de ordens de manutenção
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Mock de dados para manutenção
    const manutencoesMock = [
      {
        id: 1,
        codigo: 'OS-2024-00001',
        ativoId: 1,
        ativoNome: 'Monitor de Paciente - UTI 1',
        tipo: 'CORRETIVA' as const,
        prioridade: 'CRITICA' as const,
        status: 'ABERTA' as const,
        descricaoProblema: 'Display não Liga',
        dataAbertura: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        solicitante: 'Enfermeiro Chefe - UTI',
        custoEstimado: 50000,
      },
      {
        id: 2,
        codigo: 'OS-2024-00002',
        ativoId: 2,
        ativoNome: 'Bomba de Infusão - Ala B',
        tipo: 'PREVENTIVA' as const,
        prioridade: 'MEDIA' as const,
        status: 'EM_EXECUCAO' as const,
        descricaoProblema: 'Manutenção preventiva programada',
        dataAbertura: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        solicitante: 'Técnico de Manutenção',
        custoEstimado: 25000,
      },
      {
        id: 3,
        codigo: 'OS-2024-00003',
        ativoId: 3,
        ativoNome: 'ECG - Consultório 3',
        tipo: 'CORRETIVA' as const,
        prioridade: 'ALTA' as const,
        status: 'AGUARDANDO_PECAS' as const,
        descricaoProblema: 'Cable de ECG com defeito',
        dataAbertura: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        solicitante: 'Médico - Consultório 3',
        custoEstimado: 35000,
      },
      {
        id: 4,
        codigo: 'OS-2024-00004',
        ativoId: 4,
        ativoNome: 'Aspirador Cirúrgico - Centro Cirúrgico',
        tipo: 'CORRETIVA' as const,
        prioridade: 'BAIXA' as const,
        status: 'CONCLUIDA' as const,
        descricaoProblema: 'Vazamento no tubo de vácuo',
        dataAbertura: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        dataConclusao: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        solicitante: 'Enfermeiro - Centro Cirúrgico',
        custoTotal: 15000,
      },
    ];

    // Filtrar por status se especificado
    let manutencoesFiltradas = manutencoesMock;
    if (status) {
      manutencoesFiltradas = manutencoesMock.filter(m => m.status === status);
    }

    return NextResponse.json({
      data: manutencoesFiltradas,
      pagination: {
        page,
        limit,
        total: manutencoesFiltradas.length,
        totalPages: Math.ceil(manutencoesFiltradas.length / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar manutenções:', error);
    return NextResponse.json({
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      success: false,
      error: 'Erro ao buscar manutenções',
    });
  }
}

// POST: Criar nova ordem de manutenção
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Em implementação real, salvaria no banco
    const novaManutencao = {
      id: Date.now(),
      codigo: `OS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`,
      ...body,
      status: 'ABERTA',
      dataAbertura: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: novaManutencao,
    });
  } catch (error) {
    console.error('Erro ao criar manutenção:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar ordem de manutenção' },
      { status: 500 }
    );
  }
}

