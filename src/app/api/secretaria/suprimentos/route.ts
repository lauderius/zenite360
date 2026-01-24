import { NextRequest, NextResponse } from 'next/server';

// Dados mock para suprimentos de escritório
const mockSuprimentos = [
  { id: 1, codigo: 'SUP-001', nome: 'Papel A4 (500 fls)', categoria: 'Papelaria', quantidadeAtual: 45, quantidadeMinima: 20, unidadeMedida: 'resma' },
  { id: 2, codigo: 'SUP-002', nome: 'Caneta Azul', categoria: 'Papelaria', quantidadeAtual: 120, quantidadeMinima: 50, unidadeMedida: 'unidade' },
  { id: 3, codigo: 'SUP-003', nome: 'Caneta Vermelha', categoria: 'Papelaria', quantidadeAtual: 35, quantidadeMinima: 20, unidadeMedida: 'unidade' },
  { id: 4, codigo: 'SUP-004', nome: 'Pasta Arquivo', categoria: 'Arquivo', quantidadeAtual: 8, quantidadeMinima: 15, unidadeMedida: 'unidade' },
  { id: 5, codigo: 'SUP-005', nome: 'Clips (100 un)', categoria: 'Papelaria', quantidadeAtual: 25, quantidadeMinima: 10, unidadeMedida: 'caixa' },
  { id: 6, codigo: 'SUP-006', nome: 'Grampeador', categoria: 'Escritório', quantidadeAtual: 3, quantidadeMinima: 2, unidadeMedida: 'unidade' },
  { id: 7, codigo: 'SUP-007', nome: 'Tesoura', categoria: 'Escritório', quantidadeAtual: 2, quantidadeMinima: 2, unidadeMedida: 'unidade' },
  { id: 8, codigo: 'SUP-008', nome: 'Fita Adesiva', categoria: 'Papelaria', quantidadeAtual: 5, quantidadeMinima: 5, unidadeMedida: 'unidade' },
];

// GET: Listar suprimentos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const categoria = searchParams.get('categoria') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    let suprimentos = [...mockSuprimentos];

    // Aplicar filtros
    if (search) {
      const searchLower = search.toLowerCase();
      suprimentos = suprimentos.filter(s =>
        s.nome.toLowerCase().includes(searchLower) ||
        s.codigo.toLowerCase().includes(searchLower)
      );
    }

    if (categoria) {
      suprimentos = suprimentos.filter(s => s.categoria === categoria);
    }

    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const suprimentosPaginados = suprimentos.slice(startIndex, endIndex);

    return NextResponse.json({
      data: suprimentosPaginados,
      pagination: {
        page,
        limit,
        total: suprimentos.length,
        totalPages: Math.ceil(suprimentos.length / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar suprimentos:', error);
    return NextResponse.json({
      data: [],
      pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
      success: false,
      error: 'Erro ao buscar suprimentos',
    });
  }
}

// POST: Criar novo suprimento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const novoSuprimento = {
      id: mockSuprimentos.length + 1,
      codigo: `SUP-${String(mockSuprimentos.length + 1).padStart(3, '0')}`,
      ...body,
      criadoEm: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: novoSuprimento,
    });
  } catch (error) {
    console.error('Erro ao criar suprimento:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar suprimento' },
      { status: 500 }
    );
  }
}

// DELETE: Excluir suprimento
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    return NextResponse.json({
      success: true,
      message: 'Suprimento excluído com sucesso',
    });
  } catch (error) {
    console.error('Erro ao excluir suprimento:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao excluir suprimento' },
      { status: 500 }
    );
  }
}

