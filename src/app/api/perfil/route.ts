import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { logAtividade } from '@/lib/activity-logger';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'zenite360-secret-key-change-in-production'
);

export async function PUT(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId as string;

        const body = await request.json();
        const { nomeCompleto, email, telefone, cargo, departamento, especialidade } = body;

        // Atualizar utilizador
        const usuarioAtualizado = await prisma.utilizadores.update({
            where: { id: BigInt(userId) },
            data: {
                name: nomeCompleto,
                email: email,
                especialidade: especialidade,
            },
        });

        // Se houver lógica para atualizar funcionário, adicionar aqui.
        // Por enquanto, vamos assumir que o utilizador é o perfil principal.

        // Logar atividade
        await logAtividade(
            userId,
            'Atualização de perfil',
            'Edit',
            '/perfil',
            `O utilizador ${nomeCompleto} atualizou os seus dados de perfil`,
            request.headers.get('x-forwarded-for') || '127.0.0.1'
        );

        return NextResponse.json({
            success: true,
            usuario: {
                id: Number(usuarioAtualizado.id),
                name: usuarioAtualizado.name,
                email: usuarioAtualizado.email,
                username: usuarioAtualizado.username,
            }
        });
    } catch (error: any) {
        console.error('Erro ao atualizar perfil:', error);
        return NextResponse.json(
            { error: 'Erro interno no servidor', message: error.message },
            { status: 500 }
        );
    }
}
