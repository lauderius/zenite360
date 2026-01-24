import { NextResponse } from 'next/server';

// GET: Dashboard da Secretaria
export async function GET() {
  try {
    // Dados mock para o dashboard da secretaria
    const dashboard = {
      documentosHoje: 12,
      documentosMes: 156,
      documentosUrgentes: 3,
      tramitacoesPendentes: 8,
      tempoMedioTramitacao: 2.5,
      requisicoesMateriaisPendentes: 5,
      documentosPorTipo: [
        { tipo: 'OFICIO', quantidade: 45 },
        { tipo: 'MEMORANDO', quantidade: 38 },
        { tipo: 'CIRCULAR', quantidade: 25 },
        { tipo: 'PORTARIA', quantidade: 18 },
        { tipo: 'DESPACHO', quantidade: 15 },
        { tipo: 'OUTROS', quantidade: 15 },
      ],
      tramitacoesPorDepartamento: [
        { departamento: 'Administração', quantidade: 35 },
        { departamento: 'Financeiro', quantidade: 28 },
        { departamento: 'RH', quantidade: 22 },
        { departamento: 'Farmácia', quantidade: 18 },
        { departamento: 'Enfermaria', quantidade: 15 },
        { departamento: 'Outros', quantidade: 38 },
      ],
    };

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error('Erro ao buscar dashboard da secretaria:', error);
    return NextResponse.json({
      documentosHoje: 0,
      documentosMes: 0,
      documentosUrgentes: 0,
      tramitacoesPendentes: 0,
      tempoMedioTramitacao: 0,
      requisicoesMateriaisPendentes: 0,
      documentosPorTipo: [],
      tramitacoesPorDepartamento: [],
      success: false,
    });
  }
}

