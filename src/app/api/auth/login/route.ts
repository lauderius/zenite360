import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import prisma from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'zenite360-secret-key-change-in-production'
);

export async function POST(request: NextRequest) {
  // Reload trigger
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Tentar buscar no banco de dados
    const usuario = await prisma.utilizadores.findFirst({
      where: {
        OR: [
          { email: username },
          { username: username }
        ]
      }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Utilizador não encontrado' },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(password, usuario.password);

    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    const userId = usuario.id.toString();
    const userEmail = usuario.email;
    const userName = usuario.name;
    const userNivelAcesso = 'USUARIO'; // Ajustar conforme lógica de níveis do banco

    // Gerar token JWT
    const token = await new SignJWT({
      userId,
      email: userEmail,
      nivelAcesso: userNivelAcesso,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(JWT_SECRET);

    return NextResponse.json({
      token,
      usuario: {
        id: userId,
        name: userName,
        email: userEmail,
        nivelAcesso: userNivelAcesso,
      }
    });

  } catch (error: any) {
    console.error('ERRO NO SERVIDOR:', error);

    return NextResponse.json(
      {
        error: 'Erro interno no servidor',
        message: error.message
      },
      { status: 500 }
    );
  }
}
