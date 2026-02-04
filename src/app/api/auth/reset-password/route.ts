import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { bi, newPassword } = body;

        if (!bi || !newPassword) {
            return NextResponse.json(
                { error: 'Número do BI e nova senha são obrigatórios.' },
                { status: 400 }
            );
        }

        const trimmedBI = bi.trim();

        // Verificar se existe um utilizador com este BI
        const user = await prisma.utilizadores.findFirst({
            where: { numero_bi: trimmedBI }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Nenhum utilizador encontrado com este número de BI.' },
                { status: 404 }
            );
        }

        // Gerar novo hash da senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Atualizar no banco de dados
        await prisma.utilizadores.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        return NextResponse.json({
            message: 'Palavra-passe redefinida com sucesso.'
        });

    } catch (error: any) {
        console.error('ERRO NA RECUPERAÇÃO:', error);
        return NextResponse.json(
            { error: 'Erro ao processar a recuperação de senha.', details: error.message },
            { status: 500 }
        );
    }
}
