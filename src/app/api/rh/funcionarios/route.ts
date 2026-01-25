
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
    // Construir filtro para consulta ao banco
    const where: any = {};
    if (search) {
      where.OR = [
        { nomeCompleto: { contains: search, mode: 'insensitive' } },
        { numeroMecanografico: { contains: search, mode: 'insensitive' } },
        { cargo: { contains: search, mode: 'insensitive' } },
        { emailInstitucional: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) {
      where.status = status;
    }
    if (departamento) {
      where.departamentoId = parseInt(departamento);
    }

    const total = await prisma.funcionarios.count({ where });
    const funcionariosPaginados = await prisma.funcionarios.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: 'asc' },
    });

    return NextResponse.json({
      data: funcionariosPaginados,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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
    // Criar registro de usuario e funcionario
    const passwordHash = body.passwordHash || null;
    const usuario = await prisma.usuarios.create({
      data: {
        username: body.username || (body.email ? body.email.split('@')[0] : `user${Date.now()}`),
        email: body.email || null,
        password_hash: passwordHash,
      },
    });

    const novoFuncionario = await prisma.funcionarios.create({
      data: {
        nomeCompleto: body.nomeCompleto,
        cargo: body.cargo || 'Funcionário',
        nivelAcesso: body.nivelAcesso || 'VISUALIZADOR',
        departamentoId: body.departamentoId ? Number(body.departamentoId) : null,
        dataNascimento: body.dataNascimento ? new Date(body.dataNascimento) : null,
        emailInstitucional: body.email || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: { ...novoFuncionario, usuarioId: usuario.id },
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


