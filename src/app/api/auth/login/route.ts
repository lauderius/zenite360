import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'zenite360-secret-key-change-in-production'
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    // 1. Buscar no modelo correto: "utilizadores"
    const usuario = await prisma.utilizadores.findUnique({
      where: { email: username },
    });

    // 2. Verificar existência
    if (!usuario) {
      return NextResponse.json({ error: 'Utilizador não encontrado' }, { status: 401 });
    }

    // 3. Verificar password (campo no seu schema é "password")
    const passwordValid = await bcrypt.compare(password, usuario.password);
    
    if (!passwordValid) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    // 4. Gerar token JWT (Convertendo BigInt para String)
    const token = await new SignJWT({
      userId: usuario.id.toString(), 
      email: usuario.email,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(JWT_SECRET);

    // 5. RESPOSTA SEGURA (Evitando erro de BigInt)
    return NextResponse.json({
      token,
      usuario: {
        id: usuario.id.toString(), // CRITICAL: JSON não aceita BigInt puro
        nome: usuario.name,
        email: usuario.email,
      }
    });

  } catch (error: any) {
    console.error('ERRO NO SERVIDOR:', error);
    
    // Forçamos o retorno de JSON mesmo no erro crítico
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno no servidor', 
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}