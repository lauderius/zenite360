import { NextRequest, NextResponse } from 'next/server';

// Dados mock para estoque da cozinha
const mockEstoqueCozinha = [
  { id: 1, codigo: 'COZ-001', nome: 'Arroz (5kg)', categoria: 'Grãos', quantidadeAtual: 12, quantidadeMinima: 5, unidadeMedida: 'saco', validade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  { id: 2, codigo: 'COZ-002', nome: 'Feijão (1kg)', categoria: 'Grãos', quantidadeAtual: 8, quantidadeMinima: 5, unidadeMedida: 'kg', validade: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) },
  { id: 3, codigo: 'COZ-003', nome: 'Óleo de Cozinha', categoria: 'Óleos', quantidadeAtual: 3, quantidadeMinima: 5, unidadeMedida: 'litro', validade: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
  { id: 4, codigo: 'COZ-004', nome: 'Sal (1kg)', categoria: 'Condimentos', quantidadeAtual: 15, quantidadeMinima: 5, unidadeMedida: 'kg', validade: null },
  { id: 5, codigo: 'COZ-005', nome: 'Frango Congelado', categoria: 'Carnes', quantidadeAtual: 10, quantidadeMinima: 15, unidadeMedida: 'kg', validade: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
  { id: 6, codigo: 'COZ-006', nome: 'Legumes Mistos', categoria: 'Verduras', quantidadeAtual: 5, quantidadeMinima: 8, unidadeMedida: 'kg', validade: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
];

// GET: Listar estoque da cozinha
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const categoria = searchParams.get('categoria') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    let estoque = [...mockEstoqueCozinha];

    // Aplicar filtros
    if (search) {
      const searchLower = search.toLowerCase();
      estoque = estoque.filter(e =>
        e.nome.toLowerCase().includes(searchLower) ||
        e.codigo.toLowerCase().includes(searchLower)
      );
    }

    if (categoria) {
      estoque = estoque.filter(e => e.categoria === categoria);
    }

    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const estoquePaginado = estoque.slice(startIndex, endIndex);

    return NextResponse.json({
      data: estoquePaginado,
      pagination: {
        page,
        limit,
        total: estoque.length,
        totalPages: Math.ceil(estoque.length / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar estoque da cozinha:', error);
    return NextResponse.json({
      data: [],
      pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
      success: false,
      error: 'Erro ao buscar estoque',
    });
  }
}

// POST: Criar/Atualizar item do estoque
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const novoItem = {
      id: mockEstoqueCozinha.length + 1,
      codigo: `COZ-${String(mockEstoqueCozinha.length + 1).padStart(3, '0')}`,
      ...body,
      criadoEm: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: novoItem,
    });
  } catch (error) {
    console.error('Erro ao criar item do estoque:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar item' },
      { status: 500 }
    );
  }
}

