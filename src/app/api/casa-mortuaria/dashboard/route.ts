import { NextResponse } from 'next/server';

// GET: Dashboard da Casa Mortuária
export async function GET() {
  try {
    // Dados mock para o dashboard da casa mortuária
    const dashboard = {
      corposEmConservacao: 8,
      capacidadeTotalCamaras: 20,
      aguardandoDocumentacao: 2,
      obitosHoje: 1,
      obitosMes: 15,
      tempoMedioConservacao: 24,
      distribuicaoPorCausa: [
        { causa: 'NATURAL', quantidade: 8 },
        { causa: 'ACIDENTAL', quantidade: 3 },
        { causa: 'VIOLENTA', quantidade: 2 },
        { causa: 'INDETERMINADA', quantidade: 2 },
      ],
      distribuicaoPorGenero: [
        { genero: 'MASCULINO', quantidade: 9 },
        { genero: 'FEMININO', quantidade: 6 },
      ],
      success: true,
    };

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error('Erro ao buscar dashboard da casa mortuária:', error);
    return NextResponse.json({
      corposEmConservacao: 0,
      capacidadeTotalCamaras: 0,
      aguardandoDocumentacao: 0,
      obitosHoje: 0,
      obitosMes: 0,
      tempoMedioConservacao: 0,
      distribuicaoPorCausa: [],
      distribuicaoPorGenero: [],
      success: false,
      error: 'Erro ao carregar dados',
    });
  }
}

