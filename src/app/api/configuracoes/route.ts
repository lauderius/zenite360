import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Buscar configurações do sistema
export async function GET(_req: NextRequest) {
    try {
        let configuracoes = await prisma.configuracoes.findFirst();

        // Se não existir, retornar valores padrão
        if (!configuracoes) {
            configuracoes = {
                id: 1,
                hospital_nome: 'Zênite360 - Sistema Hospitalar',
                hospital_sigla: 'Z360',
                hospital_nif: '',
                hospital_telefone: '',
                hospital_email: '',
                hospital_website: '',
                hospital_endereco: '',
                hospital_logo: null,
                sistema_fuso_horario: 'Africa/Luanda',
                sistema_formato_data: 'dd/MM/yyyy',
                sistema_moeda: 'AOA',
                sistema_idioma: 'pt-AO',
                sistema_timeout_sessao: '30',
                sistema_backup_auto: true,
                sistema_notificacoes_email: true,
                sistema_auth_2fa: false,
                agt_endpoint: '',
                agt_app_id: '',
                agt_app_key: '',
                agt_token: '',
                agt_ambiente: 'homologacao',
                seguradoras_status: 'disconnected',
                seguradoras_endpoint: '',
                seguradoras_api_key: '',
                smtp_host: '',
                smtp_port: null,
                smtp_user: '',
                smtp_pass: '',
                smtp_encryption: '',
                created_at: new Date(),
                updated_at: new Date(),
            } as any;
        }

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

        // Remover campos que não devem ser atualizados manualmente se existirem
        const { id, created_at, updated_at, ...updateData } = data;

        const configuracoes = await prisma.configuracoes.upsert({
            where: { id: id || 1 },
            update: updateData,
            create: { ...updateData, id: 1 },
        });

        return NextResponse.json({ success: true, data: configuracoes });
    } catch (error) {
        console.error('Erro ao atualizar configurações:', error);
        return NextResponse.json({ error: 'Erro ao atualizar configurações.' }, { status: 500 });
    }
}
