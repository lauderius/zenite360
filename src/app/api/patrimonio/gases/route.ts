import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Dados de gases medicinais
export async function GET() {
  try {
    const client: any = prisma as any;
    const model = client.gases_centrais || client.centrais_gases || null;
    if (model) {
      const items = await model.findMany().catch(() => []);
      return NextResponse.json({ data: items, success: true });
    }
    return NextResponse.json({ data: [], success: true });
  } catch (error) {
    console.error('Erro ao buscar dados de gases:', error);
    return NextResponse.json({ data: [], success: false, error: 'Erro ao buscar dados de gases' });
  }
}

