const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning up maintenance and assets data...');

    // Delete maintenance orders first due to foreign key constraints
    const deletedOrders = await prisma.ordens_manutencao.deleteMany({
        where: {
            OR: [
                { descricao: { contains: 'Falha no sensor' } },
                { descricao: { contains: 'Bateria não segura' } },
                { descricao: { contains: 'Manutenção preventiva semestral' } }
            ]
        }
    });

    // Delete assets
    const deletedAssets = await prisma.ativos_patrimonio.deleteMany({
        where: {
            codigo: {
                in: ['EQP-001', 'EQP-002', 'EQP-003', 'EQP-004']
            }
        }
    });

    console.log(`Deleted ${deletedOrders.count} maintenance orders.`);
    console.log(`Deleted ${deletedAssets.count} assets.`);
    console.log('Cleanup finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
