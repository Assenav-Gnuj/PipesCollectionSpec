import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting simple seed...');

  // Create admin user if not exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@pipescollection.com' }
  });

  let admin;
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    admin = await prisma.user.create({
      data: {
        email: 'admin@pipescollection.com',
        name: 'Administrador',
        passwordHash: hashedPassword,
        isActive: true,
      },
    });
    console.log('Created admin user:', admin.email);
  } else {
    admin = existingAdmin;
    console.log('Admin user already exists:', admin.email);
  }

  // Create sample pipes
  const pipe1 = await prisma.pipe.upsert({
    where: { id: 'cmfx68qhs0002wn2ebgcgc9ip' },
    update: {},
    create: {
      id: 'cmfx68qhs0002wn2ebgcgc9ip',
      name: 'Cachimbo Clássico Inglês',
      brand: 'Peterson',
      material: 'Briar',
      shape: 'Bent',
      finish: 'Natural',
      filterType: 'Sem filtro',
      stemMaterial: 'Vulcanite',
      country: 'Irlanda',
      observations: 'Um cachimbo clássico inspirado no famoso detetive.',
    }
  });

  const pipe2 = await prisma.pipe.upsert({
    where: { id: 'cmfx68qhs0003wn2ebgcgc9iq' },
    update: {},
    create: {
      id: 'cmfx68qhs0003wn2ebgcgc9iq',
      name: 'Cachimbo Rústico Italiano',
      brand: 'Savinelli',
      material: 'Briar',
      shape: 'Straight',
      finish: 'Rusticado',
      filterType: '9mm',
      stemMaterial: 'Acrílico',
      country: 'Itália',
      observations: 'Cachimbo com acabamento rústico tradicional.',
    }
  });

  // Create sample tobaccos
  const tobacco1 = await prisma.tobacco.upsert({
    where: { id: 'cmfx68qhs0004wn2ebgcgc9ir' },
    update: {},
    create: {
      id: 'cmfx68qhs0004wn2ebgcgc9ir',
      name: 'English Mixture',
      brand: 'Dunhill',
      blendType: 'English',
      contents: 'Virginia, Latakia, Oriental',
      cut: 'Ribbon',
      strength: 3,
      roomNote: 4,
      taste: 4,
      observations: 'Um blend inglês clássico e bem equilibrado.',
    }
  });

  const tobacco2 = await prisma.tobacco.upsert({
    where: { id: 'cmfx68qhs0005wn2ebgcgc9is' },
    update: {},
    create: {
      id: 'cmfx68qhs0005wn2ebgcgc9is',
      name: 'Virginia Flake',
      brand: 'Mac Baren',
      blendType: 'Virginia',
      contents: '100% Virginia',
      cut: 'Flake',
      strength: 2,
      roomNote: 3,
      taste: 3,
      observations: 'Virginia puro em formato flake, doce e suave.',
    }
  });

  // Create sample accessories
  const accessory1 = await prisma.accessory.upsert({
    where: { id: 'cmfx68qhs0006wn2ebgcgc9it' },
    update: {},
    create: {
      id: 'cmfx68qhs0006wn2ebgcgc9it',
      name: 'Tamper de Madeira',
      brand: 'Peterson',
      category: 'Ferramenta',
      description: 'Tamper de madeira nobre com detalhes em prata',
      observations: 'Ideal para compactar o tabaco no fornilho.',
    }
  });

  console.log('Sample data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });