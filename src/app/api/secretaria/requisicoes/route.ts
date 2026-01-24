import { NextRequest, NextResponse } from 'next/server';

// Dados mock para requisições de material
const mockRequisicoes = [
  {
    id: 1,
    codigo: 'REQ-2024-0001',
    departamentoSolicitante: 'Enfermaria Geral',
    solicitante: 'Enfermeira Maria',
    status: 'PENDENTE' as const,
    dataSolicitacao: new Date(),
    itens: [
      { nome: 'Luvas de Procedimento', quantidade: 10, unidade: 'caixa' },
      { nome: 'Algodão', quantidade: 5, unidade: 'rolo' },
    ],
  },
  {
    id: 2,
    codigo: 'REQ-2024-0002',
    departamentoSolicitante: 'Consultórios',
    solicitante: 'Dr. João',
    status: 'APROVADA' as const,
    dataSolicitacao: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    itens: [
      { nome: 'Seringas 5ml', quantidade: 20, unidade: 'unidade' },
    ],
  },
  {
    id: 3,
    codigo: 'REQ-2024-0003',
    departamentoSolicitante: 'Laboratório',
    solicitante: 'Técnico Carlos',
    status: 'PENDENTE' as const,
    dataSolicitacao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    itens: [
      { nome: 'Tubos de Ensaio', quantidade: 50, unidade: 'unidade' },
      { nome: 'Luvas Nitrilo', quantidade: 5, unidade: 'caixa' },
    ],
  },
];

// GET: Listar requisições
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';
    const departamento = searchParams.get('departamento') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let requisicoes = [...mockRequisicoes];

    // Aplicar filtros
    if (status) {
      requisicoes = requisicoes.filter(r => r.status === status);
    }

    if (departamento) {
      requisicoes = requisicoes.filter(r => r.departamentoSolicitante === departamento);
    }

    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const requisicoesPaginadas = requisicoes.slice(startIndex, endIndex);

    return NextResponse.json({
      data: requisicoesPaginadas,
      pagination: {
        page,
        limit,
        total: requisicoes.length,
        totalPages: Math.ceil(requisicoes.length / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar requisições:', error);
    return NextResponse.json({
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      success: false,
      error: 'Erro ao buscar requisições',
    });
  }
}

// POST: Criar nova requisição
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const novaRequisicao = {
      id: mockRequisicoes.length + 1,
      codigo: `REQ-${new Date().getFullYear()}-${String(mockRequisicoes.length + 1).padStart(4, '0')}`,
      ...body,
      status: 'PENDENTE' as const,
      dataSolicitacao: new Date(),
      criadoEm: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: novaRequisicao,
    });
  } catch (error) {
    console.error('Erro ao criar requisição:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar requisição' },
      { status: 500 }
    );
  }
}

