import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'zenite360-secret-key-change-in-production'
);

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: true });
    }

    const token = authHeader.split(' ')[1];

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      // Token foi validado, logout bem-sucedido
      return NextResponse.json({
        success: true,
        message: 'Logout realizado com sucesso',
      });
    } catch {
      // Token inválido, mas logout ainda é sucesso
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro no logout:', error);
    return NextResponse.json({ success: true });
  }
}