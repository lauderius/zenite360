import { NextResponse } from 'next/server';
import { prisma, handlePrismaError } from '@/lib/prisma';

/**
 * Iniciar nova triagem
 * Cria um agendamento (Em_Atendimento) e uma consulta (Em_Andamento) vinculados ao paciente/médico.
 * Payload esperado:
 * {
 *   paciente_id: string | number,
 *   medico_id: string | number,
 *   motivo_consulta?: string,
 *   prioridade?: 'Normal' | 'Urgente' | 'Emergencia',
 *   agendado_por?: string | number, // opcional (default 1)
 *   criado_por?: string | number // opcional (default 1)
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paciente_id, medico_id, motivo_consulta, prioridade, agendado_por, criado_por } = body || {};

    if (!paciente_id || !medico_id) {
      return NextResponse.json(
        { message: 'Campos obrigatórios: paciente_id, medico_id' },
        { status: 400 }
      );
    }

    const now = new Date();

    const result = await prisma.$transaction(async (tx) => {
      // Criar Agendamento em atendimento
      const agendamento = await tx.agendamentos.create({
        data: {
          paciente_id: BigInt(paciente_id),
          medico_id: BigInt(medico_id),
          tipo_agendamento: 'Consulta',
          data_agendamento: now,
          hora_inicio: now,
          duracao_minutos: 30,
          status: 'Em_Atendimento',
          prioridade: prioridade || 'Normal',
          motivo_consulta: motivo_consulta || undefined,
          agendado_por: BigInt(agendado_por || 1),
        },
      });

      // Gerar número único de consulta
      const numero_consulta = `CONS-${now.getFullYear()}-${Date.now()}`;

      // Criar Consulta em andamento
      const consulta = await tx.consultas.create({
        data: {
          agendamento_id: agendamento.id,
          paciente_id: agendamento.paciente_id,
          medico_id: agendamento.medico_id,
          numero_consulta,
          data_consulta: now,
          hora_inicio: now,
          tipo_consulta: 'Primeira_Consulta',
          status: 'Em_Andamento',
          motivo_consulta: motivo_consulta || undefined,
          criado_por: BigInt(criado_por || agendado_por || 1),
        },
      });

      return { agendamento, consulta };
    });

    const serialized = JSON.parse(
      JSON.stringify(result, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
    );

    return NextResponse.json({ success: true, data: serialized }, { status: 201 });
  } catch (error) {
    console.error('[API_TRIAGEM_INICIAR_POST]', error);
    return handlePrismaError(error);
  }
}
