const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding maintenance data...');

    // 1. Create some Assets (Equipamentos)
    const assets = await Promise.all([
        prisma.ativos_patrimonio.upsert({
            where: { codigo: 'EQP-001' },
            update: {},
            create: {
                codigo: 'EQP-001',
                nome: 'Monitor Multiparamétrico',
                categoria: 'Monitorização',
                marca: 'Mindray',
                modelo: 'ePM 10',
                localizacao: 'UTI Adulto - Leito 05',
                status: 'Operacional'
            }
        }),
        prisma.ativos_patrimonio.upsert({
            where: { codigo: 'EQP-002' },
            update: {},
            create: {
                codigo: 'EQP-002',
                nome: 'Ventilador Pulmonar',
                categoria: 'Suporte à Vida',
                marca: 'Dräger',
                modelo: 'Evita V500',
                localizacao: 'UTI Adulto - Leito 12',
                status: 'Em Manutenção'
            }
        }),
        prisma.ativos_patrimonio.upsert({
            where: { codigo: 'EQP-003' },
            update: {},
            create: {
                codigo: 'EQP-003',
                nome: 'Aparelho de ECG',
                categoria: 'Diagnóstico',
                marca: 'GE Healthcare',
                modelo: 'MAC 2000',
                localizacao: 'Emergência',
                status: 'Operacional'
            }
        }),
        prisma.ativos_patrimonio.upsert({
            where: { codigo: 'EQP-004' },
            update: {},
            create: {
                codigo: 'EQP-004',
                nome: 'Bomba de Infusão',
                categoria: 'Administração',
                marca: 'B. Braun',
                modelo: 'Infusomat Compact plus',
                localizacao: 'Pediatria',
                status: 'Inoperante'
            }
        })
    ]);

    console.log(`Created ${assets.length} assets.`);

    // 2. Create some Maintenance Orders
    const orders = await Promise.all([
        prisma.ordens_manutencao.create({
            data: {
                ativo_id: assets[1].id,
                tipo: 'CORRETIVA',
                descricao: 'Falha no sensor de fluxo O2. O equipamento não está a reconhecer a entrada de gás.',
                prioridade: 'CRITICA',
                status: 'Em Execução'
            }
        }),
        prisma.ordens_manutencao.create({
            data: {
                ativo_id: assets[3].id,
                tipo: 'CORRETIVA',
                descricao: 'Bateria não segura carga. Necessária troca da célula de energia.',
                prioridade: 'ALTA',
                status: 'Pendente'
            }
        }),
        prisma.ordens_manutencao.create({
            data: {
                ativo_id: assets[0].id,
                tipo: 'PREVENTIVA',
                descricao: 'Manutenção preventiva semestral - calibração de sensores e limpeza interna.',
                prioridade: 'MEDIA',
                status: 'Pendente'
            }
        })
    ]);

    console.log(`Created ${orders.length} maintenance orders.`);
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
