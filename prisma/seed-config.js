
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding configurations...');

    const config = await prisma.configuracoes.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            hospital_nome: 'Zênite360 - Sistema Hospitalar',
            hospital_sigla: 'Z360',
            sistema_fuso_horario: 'Africa/Luanda',
            sistema_idioma: 'pt-AO',
            sistema_moeda: 'AOA',
            sistema_backup_auto: true,
            sistema_notificacoes_email: true
        }
    });

    console.log('Configuration seeded:', config);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
