import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CHARACTER_ICONS = {
  Waldo: 'https://whereiswaldo.com/assets/icons/waldo.png',
  Odlaw: 'https://whereiswaldo.com/assets/icons/odlaw.png',
  Wizard: 'https://whereiswaldo.com/assets/icons/wizard.png',
  Wenda: 'https://whereiswaldo.com/assets/icons/wenda.png',
};

async function main() {
  console.log('Cleaning up existing data...');
  await prisma.character.deleteMany();
  await prisma.score.deleteMany();
  await prisma.image.deleteMany();

  console.log('Seeding new levels with original icons...');

  // Level 1: Beach Scene
  await prisma.image.create({
    data: {
      title: 'Beach Party',
      imageUrl: 'https://whereiswaldo.com/assets/level1-scene.webp',
      characters: {
        create: [
          {
            name: 'Waldo',
            imageUrl: CHARACTER_ICONS.Waldo,
            xMin: 50.83, xMax: 54.83, yMin: 46.12, yMax: 50.12,
          },
          {
            name: 'Odlaw',
            imageUrl: CHARACTER_ICONS.Odlaw,
            xMin: 22.57, xMax: 26.57, yMin: 46.64, yMax: 50.64,
          },
          {
            name: 'Wizard',
            imageUrl: CHARACTER_ICONS.Wizard,
            xMin: 60.66, xMax: 64.66, yMin: 46.79, yMax: 50.79,
          },
        ],
      },
    },
  });

  // Level 2: Park Scene
  await prisma.image.create({
    data: {
      title: 'Crowded Park',
      imageUrl: 'https://whereiswaldo.com/assets/level2-scene.webp',
      characters: {
        create: [
          {
            name: 'Waldo',
            imageUrl: CHARACTER_ICONS.Waldo,
            xMin: 82.75, xMax: 86.75, yMin: 27.75, yMax: 31.75,
          },
        ],
      },
    },
  });

  // Level 3: Elf Workshop
  await prisma.image.create({
    data: {
      title: 'Elf Workshop',
      imageUrl: 'https://whereiswaldo.com/assets/level3-scene.webp',
      characters: {
        create: [
          {
            name: 'Waldo',
            imageUrl: CHARACTER_ICONS.Waldo,
            xMin: 94.01, xMax: 98.01, yMin: 4.33, yMax: 8.33,
          },
          {
            name: 'Odlaw',
            imageUrl: CHARACTER_ICONS.Odlaw,
            xMin: 89.99, xMax: 93.99, yMin: 55.18, yMax: 59.18,
          },
          {
            name: 'Wizard',
            imageUrl: CHARACTER_ICONS.Wizard,
            xMin: 27.31, xMax: 31.31, yMin: 38.82, yMax: 42.82,
          },
          {
            name: 'Wenda',
            imageUrl: CHARACTER_ICONS.Wenda,
            xMin: 26.06, xMax: 30.06, yMin: 64.33, yMax: 68.33,
          },
        ],
      },
    },
  });

  console.log('All 3 levels with correct icons have been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });