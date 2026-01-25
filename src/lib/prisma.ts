import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

/**
 * Para evitar que o Next.js crie múltiplas instâncias do Prisma Client 
 * durante o hot-reload em desenvolvimento, armazenamos a instância no objeto global.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Instância principal do Prisma.
 * Em produção, cria uma nova instância.
 * Em desenvolvimento, reutiliza a instância global se existir.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Verifica se um erro capturado é proveniente do Prisma.
 */
export function isPrismaError(error: unknown): error is { code: string; meta?: Record<string, unknown> } {
  return (
    typeof error === 'object' && 
    error !== null && 
    'code' in error && 
    typeof (error as any).code === 'string'
  );
}

/**
 * Formata erros do Prisma para respostas amigáveis da API.
 */
export function handlePrismaError(error: unknown) {
  if (!isPrismaError(error)) {
    return NextResponse.json(
      { message: 'Erro inesperado no servidor' },
      { status: 500 }
    );
  }

  // Mapeamento de códigos de erro comuns do Prisma
  // Referência: https://www.prisma.io/docs/reference/api-reference/error-reference
  switch (error.code) {
    case 'P2002':
      return NextResponse.json(
        { message: 'Conflito: Já existe um registro com estes dados únicos.' },
        { status: 409 }
      );
    case 'P2025':
      return NextResponse.json(
        { message: 'Não encontrado: O registro solicitado não existe.' },
        { status: 404 }
      );
    case 'P2003':
      return NextResponse.json(
        { message: 'Erro de relação: Este registro possui dependências em outras tabelas.' },
        { status: 400 }
      );
    case 'P2014':
      return NextResponse.json(
        { message: 'Erro de integridade: A alteração violaria uma relação obrigatória.' },
        { status: 400 }
      );
    default:
      return NextResponse.json(
        { message: `Erro no banco de dados (Código: ${error.code})` },
        { status: 500 }
      );
  }
}

export default prisma;