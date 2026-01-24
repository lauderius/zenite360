import { NextRequest, NextResponse } from 'next/server';

// Dados mock para faturas
const mockFaturas = [
  {
    id: 1,
    numero: 'FAT-2024-00001',
    paciente: 'Ana Maria Santos',
    tipo: 'Consulta',
    dataEmissao: new Date(),
    dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    total: 15000,
    valorPago: 0,
    status: 'EMITIDA',
  },
  {
    id: 2,
    numero: 'FAT-2024-00002',
    paciente: 'José Carlos Pereira',
    tipo: 'Exames',
    dataEmissao: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    dataVencimento: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    total: 45000,
    valorPago: 45000,
    status: 'PAGA',
    formaPagamento: 'MULTICAIXA',
  },
  {
    id: 3,
    numero: 'FAT-2024-00003',
    paciente: 'Maria Fernanda Costa',
    tipo: 'Internamento',
    dataEmissao: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    dataVencimento: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    total: 250000,
    valorPago: 0,
    status: 'VENCIDA',
  },
  {
    id: 4,
    numero: 'FAT-2024-00004',
    paciente: 'Carlos Manuel Costa',
    tipo: 'Medicamentos',
    dataEmissao: new Date(),
    dataVencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    total: 8500,
    valorPago: 0,
    status: 'EMITIDA',
  },
  {
    id: 5,
    numero: 'FAT-2024-00005',
    paciente: 'Teresa Antónia',
    tipo: 'Consulta + Exames',
    dataEmissao: new Date(),
    dataVencimento: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    total: 35000,
    valorPago: 35000,
    status: 'PAGA',
    formaPagamento: 'TRANSFERENCIA',
  },
];

// GET: Listar faturas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let faturasFiltradas = mockFaturas;

    if (status && status !== '') {
      faturasFiltradas = mockFaturas.filter(f => f.status === status);
    }

    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const faturasPaginadas = faturasFiltradas.slice(startIndex, endIndex);

    return NextResponse.json({
      data: faturasPaginadas,
      pagination: {
        page,
        limit,
        total: faturasFiltradas.length,
        totalPages: Math.ceil(faturasFiltradas.length / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar faturas:', error);
    return NextResponse.json({
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      success: false,
      error: 'Erro ao buscar faturas',
    });
  }
}

// POST: Criar nova fatura
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const novaFatura = {
      id: mockFaturas.length + 1,
      numero: `FAT-${new Date().getFullYear()}-${String(mockFaturas.length + 1).padStart(5, '0')}`,
      ...body,
      status: 'EMITIDA',
      dataEmissao: new Date(),
      valorPago: 0,
    };

    return NextResponse.json({
      success: true,
      data: novaFatura,
    });
  } catch (error) {
    console.error('Erro ao criar fatura:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar fatura' },
      { status: 500 }
    );
  }
}

