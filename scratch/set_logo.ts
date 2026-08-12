import { prisma } from '../src/lib/db';

async function main() {
  const result = await prisma.siteSetting.upsert({
    where: { key: 'logo_image_url' },
    update: { value: '/secure_uploads/1786525409290-lpwmk5ty1.png' },
    create: {
      key: 'logo_image_url',
      value: '/secure_uploads/1786525409290-lpwmk5ty1.png',
      description: 'URL of the header logo image'
    }
  });
  console.log('Database updated successfully:', result);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
