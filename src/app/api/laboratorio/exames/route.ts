import { NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

// Listar exames_solicitados com filtros opcionais (paciente_id, status, data)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pacienteId = searchParams.get('paciente_id');
    const status = searchParams.get('status');
    const q = searchParams.get('q'); // busca por tipo_exame/categoria/local

    const where: any = {};
    if (pacienteId) where.paciente_id = BigInt(pacienteId);
    if (status) where.status = status as any;
    if (q) where.OR = [
      { tipo_exame: { contains: q } },
      { categoria: { equals: q as any } },
      { local_realizacao: { contains: q } },
    ];

    const exames = await prisma.exames_solicitados.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: 100,
    });

    const serialized = JSON.parse(
      JSON.stringify(exames, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
    );

    return NextResponse.json({ success: true, data: serialized });
  } catch (error) {
    console.error('[API_LAB_EXAMES_GET]', error);
    return handlePrismaError(error);
  }
}

// Criar novo exame_solicitado
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      consulta_id,
      paciente_id,
      medico_solicitante_id,
      tipo_exame,
      categoria,
      prioridade = 'Normal',
      indicacao_clinica,
      local_realizacao,
      data_agendamento,
    } = body || {};

    if (!consulta_id || !paciente_id || !medico_solicitante_id || !tipo_exame || !categoria || !indicacao_clinica) {
      return NextResponse.json({ message: 'Campos obrigatórios: consulta_id, paciente_id, medico_solicitante_id, tipo_exame, categoria, indicacao_clinica' }, { status: 400 });
    }

    const now = new Date();
    const numero_pedido = `LAB-${now.getFullYear()}-${Date.now()}`;

    const created = await prisma.exames_solicitados.create({
      data: {
        consulta_id: BigInt(consulta_id),
        paciente_id: BigInt(paciente_id),
        medico_solicitante_id: BigInt(medico_solicitante_id),
        numero_pedido,
        data_solicitacao: now,
        tipo_exame,
        categoria,
        prioridade,
        indicacao_clinica,
        local_realizacao: local_realizacao || null,
        status: 'Pendente',
        data_agendamento: data_agendamento ? new Date(data_agendamento) : null,
      },
    });

    const serialized = JSON.parse(
      JSON.stringify(created, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
    );

    return NextResponse.json({ success: true, data: serialized }, { status: 201 });
  } catch (error) {
    console.error('[API_LAB_EXAMES_POST]', error);
    return handlePrismaError(error);
  }
}
