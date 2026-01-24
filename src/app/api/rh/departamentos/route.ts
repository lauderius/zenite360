import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar departamentos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Tentar obter do banco
    let departamentos: any[] = [];
    let total = 0;

    try {
      // Não existe tabela de departamentos no schema atual, usar dados mock
      throw new Error('Tabela não existe');
    } catch {
      // Dados mock para departamentos
      departamentos = [
        { id: 1, nome: 'Administração', sigla: 'ADM', responsavel: 'Diretor Clínico', totalFuncionarios: 5, activo: true },
        { id: 2, nome: 'Enfermaria Geral', sigla: 'ENF', responsavel: 'Enfermeira Chefe', totalFuncionarios: 12, activo: true },
        { id: 3, nome: 'Consultórios', sigla: 'CON', responsavel: 'Coordenador Médico', totalFuncionarios: 8, activo: true },
        { id: 4, nome: 'Farmácia', sigla: 'FAR', responsavel: 'Farmacêutica', totalFuncionarios: 4, activo: true },
        { id: 5, nome: 'Laboratório', sigla: 'LAB', responsavel: 'Técnico Superior', totalFuncionarios: 6, activo: true },
        { id: 6, nome: 'Radiologia', sigla: 'RAD', responsavel: 'Médico Radiologista', totalFuncionarios: 4, activo: true },
        { id: 7, nome: 'Urgência', sigla: 'URG', responsavel: 'Enfermeiro Emergencista', totalFuncionarios: 10, activo: true },
        { id: 8, nome: 'Centro Cirúrgico', sigla: 'CC', responsavel: 'Enfermeiro Chefe', totalFuncionarios: 8, activo: true },
        { id: 9, nome: 'Internamento', sigla: 'INT', responsavel: 'Médico Internista', totalFuncionarios: 15, activo: true },
        { id: 10, nome: 'Financeiro', sigla: 'FIN', responsavel: 'Diretor Financeiro', totalFuncionarios: 3, activo: true },
        { id: 11, nome: 'RH', sigla: 'RH', responsavel: 'Coordenador RH', totalFuncionarios: 2, activo: true },
        { id: 12, nome: 'Manutenção', sigla: 'MAN', responsavel: 'Técnico de Manutenção', totalFuncionarios: 4, activo: true },
      ];
      total = departamentos.length;
    }

    // Filtrar por busca
    if (search) {
      departamentos = departamentos.filter(d =>
        d.nome.toLowerCase().includes(search.toLowerCase()) ||
        d.sigla.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      data: departamentos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Erro ao buscar departamentos:', error);
    return NextResponse.json({
      data: [],
      pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
      success: false,
      error: 'Erro ao buscar departamentos',
    });
  }
}

// POST: Criar novo departamento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const novoDepartamento = {
      id: Date.now(),
      ...body,
      totalFuncionarios: 0,
      activo: true,
      criadoEm: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: novoDepartamento,
    });
  } catch (error) {
    console.error('Erro ao criar departamento:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar departamento' },
      { status: 500 }
    );
  }
}

