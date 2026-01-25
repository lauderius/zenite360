const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin user
  const adminPassword = 'Admin@Z360!';
  const hash = await bcrypt.hash(adminPassword, 10);

  const usuario = await prisma.usuarios.upsert({
    where: { username: 'admin' },
    update: { password_hash: hash, email: 'admin@zenite360.ao' },
    create: {
      username: 'admin',
      email: 'admin@zenite360.ao',
      password_hash: hash,
    },
  });

  // Funcionario associado
  await prisma.funcionarios.upsert({
    where: { id: 1 },
    update: {
      nomeCompleto: 'Administrador do Sistema',
      cargo: 'Administrador',
      nivelAcesso: 'SUPER_ADMIN',
      emailInstitucional: 'admin@zenite360.ao',
    },
    create: {
      id: 1,
      nomeCompleto: 'Administrador do Sistema',
      cargo: 'Administrador',
      nivelAcesso: 'SUPER_ADMIN',
      emailInstitucional: 'admin@zenite360.ao',
    },
  });

  // Exemplo: criar alguns pacientes
  for (let i = 1; i <= 5; i++) {
    await prisma.pacientes.upsert({
      where: { id: i },
      update: { nome: `Paciente Demo ${i}` },
      create: {
        id: i,
        nome: `Paciente Demo ${i}`,
      },
    });
  }

  // Exemplo: artigos de stock
  await prisma.artigos_stock.upsert({
    where: { id: 1 },
    update: { nome: 'Paracetamol 500mg', quantidade_stock: 150, stock_minimo: 100 },
    create: { id: 1, nome: 'Paracetamol 500mg', quantidade_stock: 150, stock_minimo: 100, activo: true },
  });

  await prisma.exames_solicitados.createMany({
    data: [
      { status: 'Pendente' },
      { status: 'Concluido' },
    ],
    skipDuplicates: true,
  }).catch(() => {});

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

