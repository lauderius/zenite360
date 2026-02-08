import { NextResponse } from 'next/server';

// GET: Lista de alertas de gases medicinais
export async function GET() {
  try {
    const alertas: any[] = [];

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

