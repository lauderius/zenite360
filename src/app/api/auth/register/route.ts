import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    // Reload trigger
    try {
        const body = await request.json();
        const { name, email, password, username, bi, especialidade } = body;

        if (!name || !email || !password || !username || !bi) {
            return NextResponse.json(
                { error: 'Todos os campos são obrigatórios, incluindo o BI.' },
                { status: 400 }
            );
        }

        // Verificar se utilizador ou email já existem
        const existingUser = await prisma.utilizadores.findFirst({
            where: {
                OR: [
                    { email },
                    { username: username },
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Utilizador ou E-mail já registado.' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.utilizadores.create({
            data: {
                name: name,
                username: username,
                email: email,
                password: hashedPassword,
                numero_bi: bi,
                especialidade: especialidade
            }
        });

        return NextResponse.json({
            message: 'Utilizador registado com sucesso.',
            userId: newUser.id.toString()
        });

    } catch (error: any) {
        console.error('ERRO NO REGISTO:', error);
        return NextResponse.json(
            { error: `Erro Técnico: ${error.message}` },
            { status: 500 }
        );
    }
}
