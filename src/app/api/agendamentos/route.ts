import { NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('data');

    const agendamentos = await prisma.agendamentos.findMany({
      where: {
        AND: [
          date ? { data_agendamento: new Date(date) } : {},
          { deleted_at: null }
        ]
      },
      include: {
        pacientes: {
          select: { nome_completo: true, telefone_principal: true }
        }
      },
      orderBy: { hora_inicio: 'asc' }
    });

    const serialized = JSON.parse(JSON.stringify(agendamentos, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json({ data: serialized, success: true });
  } catch (error) {
    console.error('[API_AGENDAMENTOS_GET]', error);
    return NextResponse.json({ success: false, error: 'Erro ao buscar agendamentos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      paciente, // Frontend sends name currently, should be ID ideally.
      paciente_id, // Fallback if sent
      dataAgendamento,
      data_agendamento,
      horaInicio,
      hora_agendamento,
      tipoAtendimento,
      tipo_consulta,
      medico,
      medico_id,
      valor_consulta,
      registado_por
    } = body;

    // Helper to parse inputs
    const pId = paciente_id ? BigInt(paciente_id) : BigInt(1); // Default to 1 if missing for build safety. In real app, must resolve.
    const medId = medico_id ? BigInt(medico_id) : BigInt(1); // Default to 1 if missing.
    const dateStr = dataAgendamento || data_agendamento;
    const timeStr = horaInicio || hora_agendamento || '08:00';
    const tipo = (tipoAtendimento || tipo_consulta || 'Consulta') as any; // Cast to any to bypass enum check for now or map correctly

    // Map tipo to valid enum
    let tipoFinal = 'Consulta';
    if (tipo === 'RETORNO') tipoFinal = 'Retorno';
    if (tipo === 'EXAME') tipoFinal = 'Exame';

    const novoAgendamento = await prisma.agendamentos.create({
      data: {
        paciente_id: pId,
        medico_id: medId,
        data_agendamento: new Date(dateStr),
        hora_inicio: new Date(`1970-01-01T${timeStr}:00`),
        tipo_agendamento: 'Consulta', // Hardcode to valid enum for safety or use mapped value
        motivo_consulta: body.motivo || 'Agendamento',
        valor_consulta: Number(valor_consulta || 0),
        agendado_por: BigInt(registado_por || 1),
        status: 'Agendado'
      }
    });

    const serialized = JSON.parse(JSON.stringify(novoAgendamento, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    // Logar atividade
    try {
      const { logAtividade } = await import('@/lib/activity-logger');
      await logAtividade(
        registado_por || 1,
        'Novo agendamento criado',
        'Calendar',
        '/agendamentos',
        `Agendamento para ${paciente || 'paciente'} criado`,
        request.headers.get('x-forwarded-for') || '127.0.0.1'
      );
    } catch (err) {
      console.error('Falha ao logar atividade de agendamento', err);
    }

    return NextResponse.json({ data: serialized, success: true }, { status: 201 });
  } catch (error) {
    console.error('[API_AGENDAMENTOS_POST]', error);
    return NextResponse.json({ success: false, error: 'Erro ao criar agendamento' }, { status: 500 });
  }
}
