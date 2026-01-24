import { NextResponse } from 'next/server';

// GET: Lista de alertas de gases medicinais
export async function GET() {
  try {
    const alertas = [
      {
        id: 1,
        centralId: 4,
        tipoAlerta: 'NIVEL_BAIXO' as const,
        severidade: 'AVISO' as const,
        mensagem: 'Central de Óxido Nitroso em nível de alerta (45%). Considere recarga.',
        dataHora: new Date(Date.now() - 2 * 60 * 60 * 1000),
        reconhecido: false,
        resolvido: false,
      },
      {
        id: 2,
        centralId: 2,
        tipoAlerta: 'PRESSAO_BAIXA' as const,
        severidade: 'CRITICO' as const,
        mensagem: 'Pressão de ar comprimido em 6.2 bar - abaixo do ideal. Monitorar.',
        dataHora: new Date(Date.now() - 1 * 60 * 60 * 1000),
        reconhecido: true,
        reconhecidoPor: 'Técnico de Plantão',
        dataReconhecimento: new Date(Date.now() - 30 * 60 * 1000),
        resolvido: false,
      },
    ];

    return NextResponse.json({
      data: alertas,
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar alertas:', error);
    return NextResponse.json({
      data: [],
      success: false,
      error: 'Erro ao buscar alertas',
    });
  }
}

// POST: Reconhecer um alerta
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { alertaId, reconhecidoPor } = body;

    // Em implementação real, atualizaria no banco
    return NextResponse.json({
      success: true,
      message: 'Alerta reconhecido com sucesso',
    });
  } catch (error) {
    console.error('Erro ao reconhecer alerta:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao reconhecer alerta' },
      { status: 500 }
    );
  }
}

