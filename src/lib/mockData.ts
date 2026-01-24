import { NextResponse } from 'next/server';

/**
 * Dados mock para desenvolvimento - quando os modelos Prisma não existem no schema
 */

export function mockNotImplemented(resource: string) {
  return NextResponse.json(
    {
      message: `Este recurso (${resource}) ainda não foi implementado no backend`,
      data: [],
      _status: 'mock',
    },
    { status: 501 }
  );
}

export function mockGetById(id: number | string, resource: string) {
  return NextResponse.json(
    {
      id,
      message: `Dados mock para ${resource}`,
      _status: 'mock',
      createdAt: new Date(),
    },
    { status: 200 }
  );
}

export function mockList(resource: string, count = 3) {
  return NextResponse.json(
    {
      data: Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        message: `Dado mock #${i + 1} de ${resource}`,
        _status: 'mock',
        createdAt: new Date(),
      })),
      _status: 'mock',
      count,
    },
    { status: 200 }
  );
}

export function mockSuccess(data: any = {}) {
  return NextResponse.json(
    {
      ...data,
      success: true,
      _status: 'mock',
    },
    { status: 200 }
  );
}
