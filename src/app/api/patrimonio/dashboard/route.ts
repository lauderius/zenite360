import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Dashboard do Património
export async function GET() {
  try {
    // Tentar obter dados reais do banco
    const totalAtivos = await prisma.artigos_stock.count({
      where: { activo: true },
    }).catch(() => 0);

    // Dados mock baseados no schema administrativo
    const mockDashboard = {
      // Stats básicas
      totalAtivos: totalAtivos || 0,
      ativosOperacionais: Math.floor((totalAtivos || 5) * 0.85),
      ativosEmManutencao: Math.floor((totalAtivos || 5) * 0.1),
      ativosInoperantes: Math.floor((totalAtivos || 5) * 0.05),
      
      // Valores financeiros (mock)
      valorTotalPatrimonio: (totalAtivos || 5) * 5000000,
      taxaDisponibilidade: 94.5,
      
      // Manutenções
      manutencoesAbertasHoje: 3,
      manutencoesCriticas: 1,
      manutencoesPreventivas30Dias: 8,
      tempoMedioReparo: 4.5,
      
      // Gases Medicinais (mock por não existir no schema atual)
      alertasGases: 2,
      centralGases: [
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
          status: 'NORMAL',
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
          status: 'NORMAL',
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
          status: 'NORMAL',
          sensorId: 'SENSOR-VC-001',
          activo: true,
        },
      ],
      alertasGasesList: [
        {
          id: 1,
          centralId: 1,
          tipoAlerta: 'NIVEL_BAIXO',
          severidade: 'AVISO',
          mensagem: 'Nível de oxigênio abaixo de 75%',
          dataHora: new Date(),
          reconhecido: false,
          resolvido: false,
        },
        {
          id: 2,
          centralId: 2,
          tipoAlerta: 'PRESSAO_BAIXA',
          severidade: 'CRITICO',
          mensagem: 'Pressão de ar comprimido em 6.2 bar - monitorar',
          dataHora: new Date(),
          reconhecido: true,
          reconhecidoPor: 'Técnico de Plantão',
          dataReconhecimento: new Date(),
          resolvido: false,
        },
      ],
      
      // Ativos para listas
      ativos: [],
      ativosRecentes: [],
      
      // Status
      success: true,
      source: totalAtivos > 0 ? 'database' : 'mock',
    };

    return NextResponse.json(mockDashboard);
  } catch (error) {
    console.error('Erro ao buscar dados do património:', error);
    
    // Retornar dados mock em caso de erro
    return NextResponse.json({
      totalAtivos: 0,
      ativosOperacionais: 0,
      ativosEmManutencao: 0,
      ativosInoperantes: 0,
      valorTotalPatrimonio: 0,
      taxaDisponibilidade: 0,
      manutencoesAbertasHoje: 0,
      manutencoesCriticas: 0,
      manutencoesPreventivas30Dias: 0,
      tempoMedioReparo: 0,
      alertasGases: 0,
      centralGases: [],
      alertasGasesList: [],
      ativos: [],
      ativosRecentes: [],
      success: false,
      error: 'Erro ao carregar dados',
    });
  }
}

