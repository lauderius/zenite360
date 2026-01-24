import { NextResponse } from 'next/server';

// Dados mock para câmaras frias
const mockCamaras = [
  {
    id: 1,
    codigo: 'CAM-A',
    nome: 'Câmara Principal',
    capacidade: 10,
    ocupacaoAtual: 6,
    temperaturaAtual: -18.5,
    temperaturaMinimaAlerta: -22,
    temperaturaMaximaAlerta: -15,
    status: 'OPERACIONAL' as const,
    sensorId: 'SENSOR-CAM-A-001',
  },
  {
    id: 2,
    codigo: 'CAM-B',
    nome: 'Câmara Secundária',
    capacidade: 6,
    ocupacaoAtual: 2,
    temperaturaAtual: -19.2,
    temperaturaMinimaAlerta: -22,
    temperaturaMaximaAlerta: -15,
    status: 'OPERACIONAL' as const,
    sensorId: 'SENSOR-CAM-B-001',
  },
  {
    id: 3,
    codigo: 'CAM-C',
    nome: 'Câmara de Emergência',
    capacidade: 4,
    ocupacaoAtual: 0,
    temperaturaAtual: -20.0,
    temperaturaMinimaAlerta: -22,
    temperaturaMaximaAlerta: -15,
    status: 'OPERACIONAL' as const,
    sensorId: 'SENSOR-CAM-C-001',
  },
];

// GET: Listar câmaras frias
export async function GET() {
  try {
    return NextResponse.json({
      data: mockCamaras,
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar câmaras:', error);
    return NextResponse.json({
      data: [],
      success: false,
      error: 'Erro ao buscar câmaras',
    });
  }
}

