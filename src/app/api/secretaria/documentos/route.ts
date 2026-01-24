import { NextRequest, NextResponse } from 'next/server';

// Dados mock para documentos oficiais
const mockDocumentos = [
  {
    id: 1,
    numero: 'SEC-2024-0001',
    tipo: 'OFICIO',
    assunto: 'Solicitação de Material de Escritório',
    prioridade: 'NORMAL' as const,
    status: 'AGUARDANDO_ASSINATURA' as const,
    tipoMovimentacao: 'SAIDA',
    dataDocumento: new Date(),
    remetenteInterno: 'Departamento de Enfermaria',
    destinatarioExterno: 'Fornecedor Alpha',
    destinatarioInterno: null,
    remetenteExterno: null,
  },
  {
    id: 2,
    numero: 'SEC-2024-0002',
    tipo: 'MEMORANDO',
    assunto: 'Circular de Feriado',
    prioridade: 'BAIXA' as const,
    status: 'ENVIADO' as const,
    tipoMovimentacao: 'INTERNO',
    dataDocumento: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    remetenteInterno: 'Direção',
    destinatarioInterno: 'Todos os Departamentos',
    remetenteExterno: null,
    destinatarioExterno: null,
  },
  {
    id: 3,
    numero: 'SEC-2024-0003',
    tipo: 'PORTARIA',
    assunto: 'Nomeação de Responsável de Setor',
    prioridade: 'ALTA' as const,
    status: 'ASSINADO' as const,
    tipoMovimentacao: 'ENTRADA',
    dataDocumento: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    remetenteInterno: null,
    destinatarioInterno: null,
    remetenteExterno: 'Ministério da Saúde',
    destinatarioExterno: null,
  },
];

// GET: Listar documentos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const tipo = searchParams.get('tipo') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let documentos = [...mockDocumentos];

    // Aplicar filtros
    if (search) {
      const searchLower = search.toLowerCase();
      documentos = documentos.filter(d =>
        d.assunto.toLowerCase().includes(searchLower) ||
        d.numero.toLowerCase().includes(searchLower)
      );
    }

    if (tipo) {
      documentos = documentos.filter(d => d.tipo === tipo);
    }

    if (status) {
      documentos = documentos.filter(d => d.status === status);
    }

    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const documentosPaginados = documentos.slice(startIndex, endIndex);

    return NextResponse.json({
      data: documentosPaginados,
      pagination: {
        page,
        limit,
        total: documentos.length,
        totalPages: Math.ceil(documentos.length / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    return NextResponse.json({
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      success: false,
      error: 'Erro ao buscar documentos',
    });
  }
}

// POST: Criar novo documento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const novoDocumento = {
      id: mockDocumentos.length + 1,
      numero: `SEC-${new Date().getFullYear()}-${String(mockDocumentos.length + 1).padStart(4, '0')}`,
      ...body,
      status: 'RASCUNHO' as const,
      dataDocumento: new Date(),
      criadoEm: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: novoDocumento,
    });
  } catch (error) {
    console.error('Erro ao criar documento:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar documento' },
      { status: 500 }
    );
  }
}

