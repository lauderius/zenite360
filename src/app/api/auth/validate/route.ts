import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'zenite360-secret-key-change-in-production'
);

export async function GET(request: NextRequest) {
  try {
    // Obter token do header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // Verificar e decodificar token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    return NextResponse.json({
      valid: true,
      userId: payload.userId,
      username: payload.username,
      expiresAt: payload.exp ? new Date(payload.exp * 1000) : null,
    });
  } catch (error) {
    console.error('Erro na validação do token:', error);
    return NextResponse.json(
      { error: 'Token inválido ou expirado' },
      { status: 401 }
    );
  }
}