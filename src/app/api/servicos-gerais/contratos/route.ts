import { NextRequest, NextResponse } from 'next/server';

// Dados mock para contratos de terceiros
const mockContratos = [
  {
    id: 1,
    codigo: 'CTR-2024-0001',
    empresaContratada: 'Limpeza Total Ltda',
    objeto: 'Serviços de limpeza geral',
    tipo: 'LIMPEZA' as const,
    status: 'VIGENTE' as const,
    valorMensal: 350000,
    quantidadeFuncionarios: 15,
    diasParaVencimento: 120,
    notaAvaliacao: 4.5,
  },
  {
    id: 2,
    codigo: 'CTR-2024-0002',
    empresaContratada: 'Segurança 24h',
    objeto: 'Serviços de vigilância',
    tipo: 'SEGURANCA' as const,
    status: 'VIGENTE' as const,
    valorMensal: 280000,
    quantidadeFuncionarios: 12,
    diasParaVencimento: 85,
    notaAvaliacao: 4.0,
  },
  {
    id: 3,
    codigo: 'CTR-2024-0003',
    empresaContratada: 'Manutenção Predial SA',
    objeto: 'Manutenção predial e elétrica',
    tipo: 'MANUTENCAO_PREDIAL' as const,
    status: 'PROXIMO_VENCIMENTO' as const,
    valorMensal: 180000,
    quantidadeFuncionarios: 5,
    diasParaVencimento: 15,
    notaAvaliacao: 4.2,
  },
  {
    id: 4,
    codigo: 'CTR-2024-0004',
    empresaContratada: 'Nutri Hospitalar',
    objeto: 'Refeitório e cozinha',
    tipo: 'ALIMENTACAO' as const,
    status: 'VIGENTE' as const,
    valorMensal: 420000,
    quantidadeFuncionarios: 10,
    diasParaVencimento: 200,
    notaAvaliacao: 3.8,
  },
];

// GET: Listar contratos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tipo = searchParams.get('tipo') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let contratos = [...mockContratos];

    // Aplicar filtros
    if (tipo) {
      contratos = contratos.filter(c => c.tipo === tipo);
    }

    if (status) {
      contratos = contratos.filter(c => c.status === status);
    }

    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const contratosPaginados = contratos.slice(startIndex, endIndex);

    return NextResponse.json({
      data: contratosPaginados,
      pagination: {
        page,
        limit,
        total: contratos.length,
        totalPages: Math.ceil(contratos.length / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar contratos:', error);
    return NextResponse.json({
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      success: false,
      error: 'Erro ao buscar contratos',
    });
  }
}

// POST: Criar novo contrato
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const novoContrato = {
      id: mockContratos.length + 1,
      codigo: `CTR-${new Date().getFullYear()}-${String(mockContratos.length + 1).padStart(4, '0')}`,
      ...body,
      status: 'VIGENTE' as const,
      diasParaVencimento: 365,
      criadoEm: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: novoContrato,
    });
  } catch (error) {
    console.error('Erro ao criar contrato:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar contrato' },
      { status: 500 }
    );
  }
}

