import { NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

const BLOOD_TYPE_MAP: Record<string, any> = {
  'A+': 'A_Pos', 'A-': 'A_Neg',
  'B+': 'B_Pos', 'B-': 'B_Neg',
  'AB+': 'AB_Pos', 'AB-': 'AB_Neg',
  'O+': 'O_Pos', 'O-': 'O_Neg',
  'A_POSITIVO': 'A_Pos', 'A_NEGATIVO': 'A_Neg',
  'B_POSITIVO': 'B_Pos', 'B_NEGATIVO': 'B_Neg',
  'AB_POSITIVO': 'AB_Pos', 'AB_NEGATIVO': 'AB_Neg',
  'O_POSITIVO': 'O_Pos', 'O_NEGATIVO': 'O_Neg',
  'A_Pos': 'A_Pos', 'A_Neg': 'A_Neg',
  'B_Pos': 'B_Pos', 'B_Neg': 'B_Neg',
  'AB_Pos': 'AB_Pos', 'AB_Neg': 'AB_Neg',
  'O_Pos': 'O_Pos', 'O_Neg': 'O_Neg'
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    const pacientesList = await prisma.pacientes.findMany({
      where: query ? {
        OR: [
          { nome_completo: { contains: query } },
          { bi_numero: { contains: query } },
          { numero_processo: { contains: query } }
        ],
        deleted_at: null
      } : {
        deleted_at: null
      },
      orderBy: { created_at: 'desc' },
      take: 50
    });

    // Buscar estatísticas de triagem (pacientes ativos por prioridade)
    const statsTriagem = await prisma.triagem.groupBy({
      by: ['prioridade'],
      where: {
        status: { in: ['Aguardando', 'Em Atendimento', 'AGUARDANDO_TRIAGEM', 'EM_ATENDIMENTO'] }
      },
      _count: { id: true }
    });

    const stats = {
      emergencia: statsTriagem.find(p => ['EMERGENCIA', 'Emergência', 'Vermelho'].includes(p.prioridade))?._count.id || 0,
      muitoUrgente: statsTriagem.find(p => ['MUITO_URGENTE', 'Muito Urgente', 'Laranja'].includes(p.prioridade))?._count.id || 0,
      urgente: statsTriagem.find(p => ['URGENTE', 'Urgente', 'Amarelo'].includes(p.prioridade))?._count.id || 0,
      monitorizacao: statsTriagem.find(p => ['POUCO_URGENTE', 'Pouco Urgente', 'Verde', 'NAO_URGENTE', 'Não Urgente', 'Azul'].includes(p.prioridade))?._count.id || 0,
    };

    // Converter BigInt para Number/String para o JSON
    const serialized = JSON.parse(JSON.stringify(pacientesList, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json({
      data: serialized,
      stats,
      success: true
    });
  } catch (error) {
    console.error('[API_PACIENTES_GET]', error);
    return NextResponse.json({ success: false, error: 'Erro ao buscar pacientes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nome_completo,
      bi_numero,
      // numero_processo, // Gerado automaticamente
      data_nascimento,
      genero,
      telefone_principal,
      contacto_emergencia_nome,
      contacto_emergencia_telefone,
      provincia,
      municipio,
      grupo_sanguineo,
      alergias,
      registado_por
    } = body;

    // Gerar um placeholder único temporário para o processo
    // Gerar um placeholder único temporário para o processo (Base36 para caber em VarChar(20))
    const tempProcesso = `T-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 999)}`;

    // Criar o paciente
    const novoPaciente = await prisma.pacientes.create({
      data: {
        nome_completo,
        bi_numero,
        numero_processo: tempProcesso,
        data_nascimento: new Date(data_nascimento),
        genero,
        telefone_principal,
        telefone_alternativo: body.telefone_secundario || null,
        email: body.email || null,
        contacto_emergencia_nome,
        contacto_emergencia_telefone,
        contacto_emergencia_relacao: body.contatoEmergenciaParentesco || null,
        provincia,
        municipio,
        bairro: null,
        endereco_completo: body.endereco || null,
        grupo_sanguineo: (grupo_sanguineo && BLOOD_TYPE_MAP[grupo_sanguineo]) ? BLOOD_TYPE_MAP[grupo_sanguineo] : null,
        alergias: alergias || null,
        doencas_cronicas: body.doencas_cronicas || null,
        registado_por: BigInt(registado_por || 1),
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    // Gerar o número de processo final baseado no ID (Ex: 2024.0001)
    const year = new Date().getFullYear();
    const id = Number(novoPaciente.id);
    const finalProcesso = `${year}.${id.toString().padStart(6, '0')}`;

    const pacienteAtualizado = await prisma.pacientes.update({
      where: { id: novoPaciente.id },
      data: { numero_processo: finalProcesso }
    });

    const serialized = JSON.parse(JSON.stringify(pacienteAtualizado, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json({ data: serialized, success: true }, { status: 201 });
  } catch (error: any) {
    console.error('[API_PACIENTES_POST]', error);

    // Tratamento de erros específicos do Prisma
    if (error.code === 'P2002') {
      const field = error.meta?.target;
      if (field?.includes('bi_numero')) {
        return NextResponse.json({ success: false, error: 'Já existe um paciente com este número de documento.' }, { status: 409 });
      }
    }

    return NextResponse.json({ success: false, error: 'Erro ao criar paciente: ' + (error.message || 'Erro interno') }, { status: 500 });
  }
}
