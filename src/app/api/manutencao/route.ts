import { NextRequest, NextResponse } from 'next/server';

// Mock data para manutenção (até implementar tabelas no banco)
interface OrdemServico {
  id: number;
  codigo: string;
  titulo: string;
  equipamento?: string;
  departamento: string;
  tipo: string;
  prioridade: 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAIXA';
  status: 'ABERTA' | 'EM_ANALISE' | 'APROVADA' | 'EM_EXECUCAO' | 'AGUARDANDO_PECA' | 'CONCLUIDA' | 'CANCELADA';
  dataAbertura: Date;
  dataPrevisao?: Date;
  responsavel?: string;
  descricao: string;
}

interface Equipamento {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  departamento: string;
  status: 'OPERACIONAL' | 'EM_MANUTENCAO' | 'INOPERANTE' | 'DESATIVADO';
  ultimaManutencao?: Date;
  proximaManutencao?: Date;
}

// Mock data
const mockOrdens: OrdemServico[] = [
  {
    id: 1,
    codigo: 'OS-2024-001',
    titulo: 'Manutenção preventiva ar condicionado',
    equipamento: 'Ar Condicionado Sala 101',
    departamento: 'Consultório',
    tipo: 'Preventiva',
    prioridade: 'MEDIA',
    status: 'EM_EXECUCAO',
    dataAbertura: new Date('2024-01-15'),
    dataPrevisao: new Date('2024-01-20'),
    responsavel: 'João Silva',
    descricao: 'Manutenção preventiva do sistema de ar condicionado da sala 101',
  },
  {
    id: 2,
    codigo: 'OS-2024-002',
    titulo: 'Reparo elevador',
    equipamento: 'Elevador Principal',
    departamento: 'Infraestrutura',
    tipo: 'Corretiva',
    prioridade: 'CRITICA',
    status: 'AGUARDANDO_PECA',
    dataAbertura: new Date('2024-01-18'),
    dataPrevisao: new Date('2024-01-25'),
    responsavel: 'Carlos Santos',
    descricao: 'Reparo do motor do elevador principal - peça aguardando entrega',
  },
];

const mockEquipamentos: Equipamento[] = [
  {
    id: 1,
    codigo: 'EQ-001',
    nome: 'Ar Condicionado Sala 101',
    categoria: 'Climatização',
    departamento: 'Consultório',
    status: 'EM_MANUTENCAO',
    ultimaManutencao: new Date('2024-01-10'),
    proximaManutencao: new Date('2024-04-10'),
  },
  {
    id: 2,
    codigo: 'EQ-002',
    nome: 'Elevador Principal',
    categoria: 'Transporte',
    departamento: 'Infraestrutura',
    status: 'INOPERANTE',
    ultimaManutencao: new Date('2023-12-15'),
    proximaManutencao: new Date('2024-03-15'),
  },
];

// GET: Lista de ordens de serviço e equipamentos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tipo = searchParams.get('tipo') || 'ordens'; // ordens ou equipamentos

    if (tipo === 'equipamentos') {
      return NextResponse.json({
        data: mockEquipamentos,
        success: true,
      });
    }

    // Retornar ordens de serviço
    return NextResponse.json({
      data: mockOrdens,
      stats: {
        total: mockOrdens.length,
        abertas: mockOrdens.filter(o => ['ABERTA', 'EM_ANALISE', 'APROVADA'].includes(o.status)).length,
        emExecucao: mockOrdens.filter(o => o.status === 'EM_EXECUCAO').length,
        aguardandoPeca: mockOrdens.filter(o => o.status === 'AGUARDANDO_PECA').length,
        criticas: mockOrdens.filter(o => o.prioridade === 'CRITICA' && o.status !== 'CONCLUIDA').length,
      },
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar dados de manutenção:', error);
    return NextResponse.json({
      data: [],
      stats: { total: 0, abertas: 0, emExecucao: 0, aguardandoPeca: 0, criticas: 0 },
      success: false,
      error: 'Erro ao buscar dados de manutenção',
    });
  }
}

// POST: Criar nova ordem de serviço
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const novaOrdem: OrdemServico = {
      id: mockOrdens.length + 1,
      codigo: `OS-2024-${String(mockOrdens.length + 1).padStart(3, '0')}`,
      titulo: body.titulo,
      equipamento: body.equipamento,
      departamento: body.departamento || 'Geral',
      tipo: body.tipo || 'Corretiva',
      prioridade: body.prioridade || 'MEDIA',
      status: 'ABERTA',
      dataAbertura: new Date(),
      dataPrevisao: body.dataPrevisao ? new Date(body.dataPrevisao) : undefined,
      responsavel: body.responsavel,
      descricao: body.descricao,
    };

    mockOrdens.push(novaOrdem);

    return NextResponse.json({
      success: true,
      data: novaOrdem,
    });
  } catch (error) {
    console.error('Erro ao criar ordem de serviço:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar ordem de serviço' },
      { status: 500 }
    );
  }
}
