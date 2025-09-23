import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cachimbosetabacos.com.br' },
    update: {},
    create: {
      email: 'admin@cachimbosetabacos.com.br',
      name: 'Admin User',
      passwordHash: adminPasswordHash,
      isActive: true,
    },
  });

  console.log('Created admin user:', adminUser.email);

  // Create sample pipes
  const pipe1 = await prisma.pipe.create({
    data: {
      name: 'Peterson Sherlock Holmes',
      brand: 'Peterson',
      material: 'Briar',
      shape: 'Billiard',
      finish: 'Smooth',
      filterType: '9mm',
      stemMaterial: 'Ebonite',
      country: 'Ireland',
      observations: 'Beautiful craftsmanship with excellent draw.',
      isActive: true,
    },
  });

  const pipe2 = await prisma.pipe.create({
    data: {
      name: 'Savinelli Autograph',
      brand: 'Savinelli',
      material: 'Briar',
      shape: 'Dublin',
      finish: 'Rusticated',
      filterType: 'None',
      stemMaterial: 'Acrylic',
      country: 'Italy',
      observations: 'Classic Italian design with perfect balance.',
      isActive: true,
    },
  });

  console.log('Created sample pipes:', pipe1.name, pipe2.name);

  // Create sample tobaccos
  const tobacco1 = await prisma.tobacco.create({
    data: {
      name: 'Early Morning Pipe',
      brand: 'Dunhill',
      blendType: 'English',
      contents: 'Virginia, Oriental, Latakia',
      cut: 'Ribbon',
      strength: 7,
      roomNote: 5,
      taste: 8,
      observations: 'Classic English blend with rich Latakia flavor.',
      isActive: true,
    },
  });

  const tobacco2 = await prisma.tobacco.create({
    data: {
      name: 'Virginia Flake',
      brand: 'Samuel Gawith',
      blendType: 'Virginia',
      contents: 'Virginia tobacco',
      cut: 'Flake',
      strength: 4,
      roomNote: 6,
      taste: 7,
      observations: 'Pure Virginia tobacco with natural sweetness.',
      isActive: true,
    },
  });

  console.log('Created sample tobaccos:', tobacco1.name, tobacco2.name);

  // Create sample accessories
  const accessory1 = await prisma.accessory.create({
    data: {
      name: 'Czech Tool',
      brand: 'Czech Pipe Tools',
      category: 'Tool',
      description: 'Multi-functional pipe tool with tamper, reamer, and pick.',
      observations: 'Essential tool for every pipe smoker.',
      isActive: true,
    },
  });

  const accessory2 = await prisma.accessory.create({
    data: {
      name: 'Leather Tobacco Pouch',
      brand: 'Comoy\'s',
      category: 'Storage',
      description: 'Premium leather tobacco pouch with rubber lining.',
      observations: 'Keeps tobacco fresh and adds elegance.',
      isActive: true,
    },
  });

  console.log('Created sample accessories:', accessory1.name, accessory2.name);

  // Create sample images (placeholders)
  const pipeImage1 = await prisma.image.create({
    data: {
      itemId: pipe1.id,
      itemType: 'pipe',
      filename: 'peterson-sherlock-featured.jpg',
      originalName: 'peterson-sherlock-holmes.jpg',
      fileSize: 256000,
      mimeType: 'image/jpeg',
      width: 800,
      height: 600,
      isFeatured: true,
      altText: 'Peterson Sherlock Holmes pipe',
      sortOrder: 0,
    },
  });

  const tobaccoImage1 = await prisma.image.create({
    data: {
      itemId: tobacco1.id,
      itemType: 'tobacco',
      filename: 'dunhill-emp-featured.jpg',
      originalName: 'dunhill-early-morning-pipe.jpg',
      fileSize: 180000,
      mimeType: 'image/jpeg',
      width: 600,
      height: 400,
      isFeatured: true,
      altText: 'Dunhill Early Morning Pipe tobacco',
      sortOrder: 0,
    },
  });

  console.log('Created sample images for pipe and tobacco');

  // Create sample ratings
  await prisma.rating.create({
    data: {
      itemId: pipe1.id,
      itemType: 'pipe',
      sessionId: 'session-001',
      rating: 5,
      ipAddress: '127.0.0.1',
    },
  });

  await prisma.rating.create({
    data: {
      itemId: tobacco1.id,
      itemType: 'tobacco',
      sessionId: 'session-002',
      rating: 4,
      ipAddress: '127.0.0.1',
    },
  });

  console.log('Created sample ratings');

  // Create sample comments
  await prisma.comment.create({
    data: {
      itemId: pipe1.id,
      itemType: 'pipe',
      content: 'Excellent pipe with perfect balance and great smoking qualities.',
      authorName: 'João Silva',
      sessionId: 'session-003',
      isApproved: true,
      moderatedBy: adminUser.id,
      moderatedAt: new Date(),
      ipAddress: '127.0.0.1',
    },
  });

  await prisma.comment.create({
    data: {
      itemId: tobacco1.id,
      itemType: 'tobacco',
      content: 'My favorite English blend! Rich Latakia flavor with great room note.',
      authorName: 'Maria Costa',
      sessionId: 'session-004',
      isApproved: true,
      moderatedBy: adminUser.id,
      moderatedAt: new Date(),
      ipAddress: '127.0.0.1',
    },
  });

  console.log('Created sample comments');

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });