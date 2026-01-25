import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listar câmaras frias
export async function GET() {
  try {
    const client: any = prisma as any;
    const model = client.camaras || client.camaras_frias || null;
    if (model) {
      const items = await model.findMany().catch(() => []);
      return NextResponse.json({ data: items, success: true });
    }

    return NextResponse.json({ data: [], success: true });
  } catch (error) {
    console.error('Erro ao buscar câmaras:', error);
    return NextResponse.json({ data: [], success: false, error: 'Erro ao buscar câmaras' });
  }
}

