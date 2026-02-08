import prisma from './prisma';

export async function logAtividade(
    utilizadorId: number | bigint,
    acao: string,
    icon: string = 'Activity',
    rota?: string,
    descricao?: string,
    ipAddress?: string
) {
    try {
        await prisma.atividades_recentes.create({
            data: {
                utilizador_id: BigInt(utilizadorId),
                acao,
                icon,
                rota,
                descricao,
                ip_address: ipAddress,
            },
        });
    } catch (error) {
        console.error('Erro ao logar atividade:', error);
    }
}
