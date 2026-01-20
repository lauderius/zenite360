import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

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
      
      // Invalidar sessões do utilizador
      if (payload.userId) {
        await prisma.sessao.updateMany({
          where: {
            usuarioId: payload.userId as number,
            activa: true,
          },
          data: {
            activa: false,
          },
        });

        // Registrar log de auditoria
        await prisma.logAuditoria.create({
          data: {
            tabela: 'usuarios',
            registroId: payload.userId as number,
            acao: 'LOGOUT',
            dadosNovos: JSON.stringify({ timestamp: new Date() }),
            usuarioId: payload.userId as number,
            ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
          },
        });
      }
    } catch {
      // Token inválido, mas logout ainda é sucesso
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro no logout:', error);
    return NextResponse.json({ success: true });
  }
}