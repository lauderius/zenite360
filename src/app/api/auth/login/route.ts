import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import prisma from '@/lib/prisma';
import { logAtividade } from '@/lib/activity-logger';

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
    // Map to a valid NivelAcesso from the enum
    const userNivelAcesso = 'ADMINISTRATIVO';

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

    // Mocking a refreshToken for the context
    const refreshToken = 'dummy-refresh-token';

    // Logar atividade de login
    await logAtividade(
      usuario.id,
      'Login no sistema',
      'LogIn',
      '/login',
      `O utilizador ${usuario.name} entrou no sistema`,
      request.headers.get('x-forwarded-for') || '127.0.0.1'
    );

    return NextResponse.json({
      token,
      refreshToken,
      usuario: {
        id: Number(usuario.id),
        name: userName,
        email: userEmail,
        username: usuario.username,
      },
      funcionario: {
        id: Number(usuario.id),
        nomeCompleto: userName,
        email: userEmail,
        nivelAcesso: userNivelAcesso,
        status: 'ACTIVO',
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
