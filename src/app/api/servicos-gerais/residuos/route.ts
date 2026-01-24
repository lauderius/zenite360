import { NextRequest, NextResponse } from 'next/server';

// Dados mock para coletas de resíduos
const mockColetas = [
  {
    id: 1,
    codigo: 'COL-2024-0001',
    data: new Date(),
    turno: 'Matutino',
    status: 'CONCLUIDA' as const,
    pesoTotalKg: 45,
    volumeTotalLitros: 120,
    manifestoEmitido: true,
  },
  {
    id: 2,
    codigo: 'COL-2024-0002',
    data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    turno: 'Vespertino',
    status: 'CONCLUIDA' as const,
    pesoTotalKg: 38,
    volumeTotalLitros: 95,
    manifestoEmitido: true,
  },
  {
    id: 3,
    codigo: 'COL-2024-0003',
    data: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    turno: 'Matutino',
    status: 'AGENDADA' as const,
    pesoTotalKg: 0,
    volumeTotalLitros: 0,
    manifestoEmitido: false,
  },
];

// GET: Listar coletas de resíduos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let coletas = [...mockColetas];

    // Aplicar filtros
    if (status) {
      coletas = coletas.filter(c => c.status === status);
    }

    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const coletasPaginadas = coletas.slice(startIndex, endIndex);

    return NextResponse.json({
      data: coletasPaginadas,
      pagination: {
        page,
        limit,
        total: coletas.length,
        totalPages: Math.ceil(coletas.length / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar coletas:', error);
    return NextResponse.json({
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      success: false,
      error: 'Erro ao buscar coletas',
    });
  }
}

// POST: Agendar nova coleta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const novaColeta = {
      id: mockColetas.length + 1,
      codigo: `COL-${new Date().getFullYear()}-${String(mockColetas.length + 1).padStart(4, '0')}`,
      ...body,
      status: 'AGENDADA' as const,
      pesoTotalKg: 0,
      volumeTotalLitros: 0,
      manifestoEmitido: false,
      criadoEm: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: novaColeta,
    });
  } catch (error) {
    console.error('Erro ao agendar coleta:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao agendar coleta' },
      { status: 500 }
    );
  }
}

