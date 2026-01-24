import { NextResponse } from 'next/server';

// GET: Dados de gases medicinais
export async function GET() {
  try {
    // Dados mock para central de gases (não existe no schema atual)
    const centraisGases = [
      {
        id: 1,
        nome: 'Central de Oxigênio Principal',
        localizacao: 'Subsolo - Área Técnica',
        tipoGas: 'OXIGENIO',
        capacidadeTotal: 10000,
        nivelAtualPercentual: 72,
        pressaoAtualBar: 6.5,
        pressaoMinimaAlerta: 3,
        nivelMinimoAlerta: 20,
        status: 'NORMAL' as const,
        ultimaRecarga: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        sensorId: 'SENSOR-OX-001',
        activo: true,
      },
      {
        id: 2,
        nome: 'Central de Ar Comprimido',
        localizacao: 'Subsolo - Área Técnica',
        tipoGas: 'AR_COMPRIMIDO',
        capacidadeTotal: 5000,
        nivelAtualPercentual: 68,
        pressaoAtualBar: 6.2,
        pressaoMinimaAlerta: 3,
        nivelMinimoAlerta: 20,
        status: 'NORMAL' as const,
        ultimaRecarga: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        sensorId: 'SENSOR-AR-001',
        activo: true,
      },
      {
        id: 3,
        nome: 'Central de Vácuo',
        localizacao: 'Subsolo - Área Técnica',
        tipoGas: 'VACUO',
        capacidadeTotal: 3000,
        nivelAtualPercentual: 85,
        pressaoAtualBar: -0.8,
        pressaoMinimaAlerta: -0.4,
        nivelMinimoAlerta: 15,
        status: 'NORMAL' as const,
        ultimaRecarga: null,
        sensorId: 'SENSOR-VC-001',
        activo: true,
      },
      {
        id: 4,
        nome: 'Central de Óxido Nitroso',
        localizacao: 'Ala C - Área Técnica',
        tipoGas: 'OXIDO_NITROSO',
        capacidadeTotal: 2000,
        nivelAtualPercentual: 45,
        pressaoAtualBar: 4.2,
        pressaoMinimaAlerta: 2,
        nivelMinimoAlerta: 25,
        status: 'ALERTA' as const,
        ultimaRecarga: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        sensorId: 'SENSOR-N2O-001',
        activo: true,
      },
    ];

    return NextResponse.json({
      data: centraisGases,
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar dados de gases:', error);
    return NextResponse.json({
      data: [],
      success: false,
      error: 'Erro ao buscar dados de gases',
    });
  }
}

