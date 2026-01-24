
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar funcionários
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const departamento = searchParams.get('departamento') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let funcionarios = [...mockFuncionarios];

    // Aplicar filtros
    if (search) {
      const searchLower = search.toLowerCase();
      funcionarios = funcionarios.filter(f =>
        f.nomeCompleto.toLowerCase().includes(searchLower) ||
        f.numeroMecanografico.toLowerCase().includes(searchLower) ||
        f.cargo.toLowerCase().includes(searchLower) ||
        f.email.toLowerCase().includes(searchLower)
      );
    }

    if (status) {
      funcionarios = funcionarios.filter(f => f.status === status);
    }

    if (departamento) {
      funcionarios = funcionarios.filter(f => f.departamento === departamento);
    }

    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const funcionariosPaginados = funcionarios.slice(startIndex, endIndex);

    return NextResponse.json({
      data: funcionariosPaginados,
      pagination: {
        page,
        limit,
        total: funcionariosFiltrados.length,
        totalPages: Math.ceil(funcionariosFiltrados.length / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
    return NextResponse.json({
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      success: false,
      error: 'Erro ao buscar funcionários',
    });
  }
}

// POST: Criar novo funcionário
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Criar usuário no banco de dados
    const novoUsuario = await prisma.utilizadores.create({
      data: {
        name: body.nomeCompleto,
        email: body.email,
        password: body.password || '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // senha padrão
      },
    });

    const novoFuncionario = {
      id: Number(novoUsuario.id),
      numeroMecanografico: `F-${String(novoUsuario.id).padStart(5, '0')}`,
      nomeCompleto: novoUsuario.name,
      cargo: body.cargo || 'Funcionário',
      departamento: body.departamento || 'Administrativo',
      especialidade: body.especialidade,
      nivelAcesso: body.nivelAcesso || 'VISUALIZADOR',
      status: 'ACTIVO',
      dataAdmissao: new Date(),
      telefone: body.telefone || '',
      email: novoUsuario.email,
      fotoUrl: null,
    };

    return NextResponse.json({
      success: true,
      data: novoFuncionario,
    });
  } catch (error) {
    console.error('Erro ao criar funcionário:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar funcionário' },
      { status: 500 }
    );
  }
}

// Funções auxiliares para mapear dados (temporário até schema ser atualizado)
function getCargoById(id: number): string {
  const cargos: Record<number, string> = {
    1: 'Médico Clínico Geral',
    2: 'Enfermeira Chefe',
    3: 'Enfermeira',
    4: 'Técnico de Laboratório',
    5: 'Recepcionista',
    6: 'Farmacêutica',
    7: 'Técnico de Manutenção',
    8: 'Assistente Financeira',
  };
  return cargos[id] || 'Funcionário';
}

function getDepartamentoById(id: number): string {
  const departamentos: Record<number, string> = {
    1: 'Consultórios',
    2: 'Enfermaria Geral',
    3: 'Enfermaria Geral',
    4: 'Laboratório',
    5: 'Recepção',
    6: 'Farmácia',
    7: 'Manutenção',
    8: 'Financeiro',
  };
  return departamentos[id] || 'Administrativo';
}

function getEspecialidadeById(id: number): string | undefined {
  const especialidades: Record<number, string> = {
    1: 'Clínica Geral',
  };
  return especialidades[id];
}

function getNivelAcessoById(id: number): string {
  const niveis: Record<number, string> = {
    1: 'MEDICO',
    2: 'ENFERMEIRO',
    3: 'ENFERMEIRO',
    4: 'TECNICO',
    5: 'RECEPCAO',
    6: 'FARMACEUTICO',
    7: 'MANUTENCAO',
    8: 'FINANCEIRO',
  };
  return niveis[id] || 'VISUALIZADOR';
}

function getStatusById(id: number): string {
  const status: Record<number, string> = {
    1: 'ACTIVO',
    2: 'ACTIVO',
    3: 'ACTIVO',
    4: 'ACTIVO',
    5: 'FERIAS',
    6: 'ACTIVO',
    7: 'LICENCA',
    8: 'ACTIVO',
  };
  return status[id] || 'ACTIVO';
}

function getDataAdmissaoById(id: number): Date {
  const datas: Record<number, Date> = {
    1: new Date('2015-03-15'),
    2: new Date('2016-07-01'),
    3: new Date('2018-02-20'),
    4: new Date('2021-05-10'),
    5: new Date('2022-01-15'),
    6: new Date('2020-09-01'),
    7: new Date('2019-03-15'),
    8: new Date('2021-11-20'),
  };
  return datas[id] || new Date();
}

function getTelefoneById(id: number): string {
  const telefones: Record<number, string> = {
    1: '+244 923 456 789',
    2: '+244 934 567 890',
    3: '+244 934 567 891',
    4: '+244 945 678 901',
    5: '+244 956 789 012',
    6: '+244 967 890 123',
    7: '+244 978 901 234',
    8: '+244 989 012 345',
  };
  return telefones[id] || '+244 900 000 000';
}


