import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const insumos = [
    { chaveInsumo: 'PLACA_ST', nome: 'Placa Drywall Standard', precoUnitario: 35.00 },
    { chaveInsumo: 'PLACA_RU', nome: 'Placa Drywall Umidade', precoUnitario: 48.00 },
    { chaveInsumo: 'PLACA_RF', nome: 'Placa Drywall Fogo', precoUnitario: 55.00 },
    { chaveInsumo: 'GUIA_U', nome: 'Guia Perfil U (3m)', precoUnitario: 12.50 },
    { chaveInsumo: 'MONTANTE_C', nome: 'Montante Perfil C (3m)', precoUnitario: 14.00 },
    { chaveInsumo: 'PARAFUSO', nome: 'Parafuso Trombeta 25mm', precoUnitario: 0.05 },
  ];

  console.log('Limpando o cofre antigo...');
  await prisma.insumoPreco.deleteMany();

  console.log('Forjando o novo inventário...');
  for (const insumo of insumos) {
    await prisma.insumoPreco.create({
      data: insumo,
    });
  }

  console.log('Cofre reabastecido com as 6 peças com sucesso!');
}

main()
  .catch((e) => {
    console.error('ERRO NO COFRE:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });