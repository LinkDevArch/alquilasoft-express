import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// UUIDs Fijos para que la guía de pruebas en Markdown siempre funcione sin buscar IDs
const UUIDS = {
  tenant: 'aaaa0000-0000-0000-0000-000000000000',
  userAdmin: 'bbbb0001-0000-0000-0000-000000000000',
  userVentas: 'bbbb0002-0000-0000-0000-000000000000',
  catConstruccion: 'cccc0001-0000-0000-0000-000000000000',
  catEventos: 'cccc0002-0000-0000-0000-000000000000',
  locNorte: 'dddd0001-0000-0000-0000-000000000000',
  locSur: 'dddd0002-0000-0000-0000-000000000000',
  prodTaladro: 'eeee0001-0000-0000-0000-000000000000',
  prodCarpa: 'eeee0002-0000-0000-0000-000000000000',
  customer1: 'ffff0001-0000-0000-0000-000000000000',
  customer2: 'ffff0002-0000-0000-0000-000000000000',
  invItem1: '11110001-0000-0000-0000-000000000000',
  invItem2: '11110002-0000-0000-0000-000000000000',
  rental1: '22220001-0000-0000-0000-000000000000',
  maintenance1: '33330001-0000-0000-0000-000000000000',
};

async function main() {
  console.log('🚀 Iniciando poblado intensivo de datos con IDs estáticos...');

  // 1. Roles
  const roles = ['TENANT_ADMIN', 'SALES_AGENT', 'INVENTORY_MANAGER'];
  for (const name of roles) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }
  const roleAdmin = await prisma.role.findUnique({ where: { name: 'TENANT_ADMIN' } });
  const roleSales = await prisma.role.findUnique({ where: { name: 'SALES_AGENT' } });

  // 2. Tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: UUIDS.tenant },
    update: {},
    create: { id: UUIDS.tenant, name: 'AlquilaSoft Demo Corp' },
  });

  // 3. Usuarios
  const passwordHash = await bcrypt.hash('password123', 10);
  
  await prisma.user.upsert({
    where: { id: UUIDS.userAdmin },
    update: {},
    create: { id: UUIDS.userAdmin, tenantId: tenant.id, name: 'Admin Demo', email: 'admin@demo.com', password: passwordHash, roles: { create: { roleId: roleAdmin!.id } } }
  });
  
  await prisma.user.upsert({
    where: { id: UUIDS.userVentas },
    update: {},
    create: { id: UUIDS.userVentas, tenantId: tenant.id, name: 'Vendedor Juan', email: 'ventas@demo.com', password: passwordHash, roles: { create: { roleId: roleSales!.id } } }
  });

  // 4. Categorías
  await prisma.productCategory.upsert({
    where: { id: UUIDS.catConstruccion }, update: {},
    create: { id: UUIDS.catConstruccion, tenantId: tenant.id, name: 'Construcción', slug: 'construccion', description: 'Maquinaria pesada' }
  });
  await prisma.productCategory.upsert({
    where: { id: UUIDS.catEventos }, update: {},
    create: { id: UUIDS.catEventos, tenantId: tenant.id, name: 'Eventos', slug: 'eventos', description: 'Carpas, sillas' }
  });

  // 5. Bodegas
  await prisma.storageLocation.upsert({
    where: { id: UUIDS.locNorte }, update: {},
    create: { id: UUIDS.locNorte, tenantId: tenant.id, name: 'Bodega Norte', address: 'Calle 100' }
  });
  await prisma.storageLocation.upsert({
    where: { id: UUIDS.locSur }, update: {},
    create: { id: UUIDS.locSur, tenantId: tenant.id, name: 'Bodega Sur', address: 'Calle 10' }
  });

  // 6. Productos
  await prisma.product.upsert({
    where: { id: UUIDS.prodTaladro }, update: {},
    create: { id: UUIDS.prodTaladro, tenantId: tenant.id, categoryId: UUIDS.catConstruccion, name: 'Taladro Percutor 20V', priceInCents: 50000, trackingType: 'SERIALIZED' }
  });
  await prisma.product.upsert({
    where: { id: UUIDS.prodCarpa }, update: {},
    create: { id: UUIDS.prodCarpa, tenantId: tenant.id, categoryId: UUIDS.catEventos, name: 'Carpa 4x4m', priceInCents: 150000, trackingType: 'BULK' }
  });

  // 7. Clientes
  await prisma.customer.upsert({
    where: { id: UUIDS.customer1 }, update: {},
    create: { id: UUIDS.customer1, tenantId: tenant.id, name: 'Constructora Beta', email: 'beta@const.com', phone: '3000000000' }
  });
  await prisma.customer.upsert({
    where: { id: UUIDS.customer2 }, update: {},
    create: { id: UUIDS.customer2, tenantId: tenant.id, name: 'Eventos VIP', email: 'vip@eventos.com', phone: '3111111111' }
  });

  // 8. Artículos de Inventario
  await prisma.inventoryItem.upsert({
    where: { id: UUIDS.invItem1 }, update: {},
    create: { id: UUIDS.invItem1, tenantId: tenant.id, productId: UUIDS.prodTaladro, locationId: UUIDS.locNorte, serialNumber: 'TAL-001', quantity: 1 }
  });
  await prisma.inventoryItem.upsert({
    where: { id: UUIDS.invItem2 }, update: {},
    create: { id: UUIDS.invItem2, tenantId: tenant.id, productId: UUIDS.prodCarpa, locationId: UUIDS.locSur, quantity: 50 }
  });

  console.log('✅ Base de datos rellenada con IDs exactos. Lista para APIDog.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
