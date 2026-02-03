import { NextRequest, NextResponse } from 'next/server';

// GET: Buscar configurações do sistema
export async function GET(_req: NextRequest) {
    try {
        // TODO: Implementar busca de configurações do banco de dados
        const configuracoes = {
            sistema: {
                nome: 'Zênite360',
                versao: '1.0.0',
                ambiente: process.env.NODE_ENV || 'development',
            },
            hospital: {
                nome: 'Hospital Central de Luanda',
                sigla: 'HCL',
                nif: '5000123456',
            },
        };

        return NextResponse.json({ success: true, data: configuracoes });
    } catch (error) {
        console.error('Erro ao buscar configurações:', error);
        return NextResponse.json({ error: 'Erro ao buscar configurações.' }, { status: 500 });
    }
}

// PUT: Atualizar configurações do sistema
export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        // TODO: Implementar atualização de configurações no banco de dados

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Erro ao atualizar configurações:', error);
        return NextResponse.json({ error: 'Erro ao atualizar configurações.' }, { status: 500 });
    }
}
