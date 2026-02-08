const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding default user...');

    try {
        const user = await prisma.utilizadores.upsert({
            where: { id: 1 },
            update: {},
            create: {
                id: 1,
                name: 'Administrador Sistema',
                username: 'admin',
                email: 'admin@zenite360.ao',
                password: '$2b$10$EpRnTzVlqQHks.P/XpA0r.0o.i.i.i.i.i.i.i.i.i.i.i.i', // hash for 'password' (fictional)
                created_at: new Date(),
                updated_at: new Date()
            },
        });

        console.log('Default user seeded:', convertBigInt(user));
    } catch (error) {
        console.error('Error seeding user:', error);
    }
}

function convertBigInt(obj) {
    return JSON.parse(JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
