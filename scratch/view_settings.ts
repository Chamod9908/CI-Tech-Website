import { prisma } from '../src/lib/db';

async function main() {
  const settings = await prisma.siteSetting.findMany();
  console.log(JSON.stringify(settings, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
