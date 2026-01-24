import { NextRequest, NextResponse } from 'next/server';

// Dados mock para registros de óbito
const mockRegistros = [
  {
    id: 1,
    codigo: 'OB-2024-00001',
    nomeCompleto: 'José António da Silva',
    idade: 65,
    genero: 'MASCULINO',
    causaObito: 'NATURAL' as const,
    status: 'EM_CONSERVACAO' as const,
    dataAdmissao: new Date(Date.now() - 12 * 60 * 60 * 1000),
    dataHoraObito: new Date(Date.now() - 14 * 60 * 60 * 1000),
    localObito: 'Hospital Central - UTI',
    medicoResponsável: 'Dr. António Silva',
    camaraFria: 'Câmara A',
    posicao: 'A1',
    declaracaoObitoEmitida: true,
    autopsiaRealizada: false,
    guiaSaidaEmitida: false,
    responsavelNome: 'Maria da Silva',
    responsavelParentesco: 'Esposa',
    responsavelTelefone: '+244 923 456 789',
  },
  {
    id: 2,
    codigo: 'OB-2024-00002',
    nomeCompleto: 'Maria Ferreira Santos',
    idade: 72,
    genero: 'FEMININO',
    causaObito: 'NATURAL' as const,
    status: 'AGUARDANDO_DOCUMENTACAO' as const,
    dataAdmissao: new Date(Date.now() - 36 * 60 * 60 * 1000),
    dataHoraObito: new Date(Date.now() - 38 * 60 * 60 * 1000),
    localObito: 'Domicílio',
    medicoResponsável: 'Dra. Carla Mendes',
    camaraFria: 'Câmara B',
    posicao: 'B3',
    declaracaoObitoEmitida: false,
    autopsiaRealizada: false,
    guiaSaidaEmitida: false,
    responsavelNome: 'Carlos Santos',
    responsavelParentesco: 'Filho',
    responsavelTelefone: '+244 934 567 890',
  },
  {
    id: 3,
    codigo: 'OB-2024-00003',
    nomeCompleto: 'Pedro Manuel Costa',
    idade: 45,
    genero: 'MASCULINO',
    causaObito: 'ACIDENTAL' as const,
    status: 'EM_CONSERVACAO' as const,
    dataAdmissao: new Date(Date.now() - 6 * 60 * 60 * 1000),
    dataHoraObito: new Date(Date.now() - 8 * 60 * 60 * 1000),
    localObito: 'Via Pública - Acidente',
    medicoResponsável: 'Dr. João Pereira',
    camaraFria: 'Câmara A',
    posicao: 'A2',
    declaracaoObitoEmitida: true,
    autopsiaRealizada: true,
    guiaSaidaEmitida: false,
    responsavelNome: 'Ana Costa',
    responsavelParentesco: 'Esposa',
    responsavelTelefone: '+244 945 678 901',
  },
];

// GET: Listar registros de óbito
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let registros = [...mockRegistros];

    // Aplicar filtros
    if (status && status !== '') {
      registros = registros.filter(r => r.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      registros = registros.filter(r =>
        r.nomeCompleto.toLowerCase().includes(searchLower) ||
        r.codigo.toLowerCase().includes(searchLower)
      );
    }

    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const registrosPaginados = registros.slice(startIndex, endIndex);

    return NextResponse.json({
      data: registrosPaginados,
      pagination: {
        page,
        limit,
        total: registros.length,
        totalPages: Math.ceil(registros.length / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar registros:', error);
    return NextResponse.json({
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      success: false,
      error: 'Erro ao buscar registros',
    });
  }
}

// POST: Criar novo registro de óbito
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const novoRegistro = {
      id: mockRegistros.length + 1,
      codigo: `OB-${new Date().getFullYear()}-${String(mockRegistros.length + 1).padStart(5, '0')}`,
      ...body,
      status: 'ADMITIDO' as const,
      dataAdmissao: new Date(),
      declaracaoObitoEmitida: false,
      autopsiaRealizada: false,
      guiaSaidaEmitida: false,
    };

    return NextResponse.json({
      success: true,
      data: novoRegistro,
    });
  } catch (error) {
    console.error('Erro ao criar registro:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar registro' },
      { status: 500 }
    );
  }
}

