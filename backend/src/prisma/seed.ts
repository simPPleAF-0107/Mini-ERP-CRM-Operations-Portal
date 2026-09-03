import { PrismaClient, Role, CustomerType, CustomerStatus, MovementType, ChallanStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // --- Users ---
  const hashedAdmin = await bcrypt.hash('admin123', 10);
  const hashedSales = await bcrypt.hash('sales123', 10);
  const hashedWarehouse = await bcrypt.hash('warehouse123', 10);
  const hashedAccounts = await bcrypt.hash('accounts123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@erp.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@erp.com', password: hashedAdmin, role: Role.ADMIN },
  });

  const sales = await prisma.user.upsert({
    where: { email: 'sales@erp.com' },
    update: {},
    create: { name: 'Sales User', email: 'sales@erp.com', password: hashedSales, role: Role.SALES },
  });

  const warehouse = await prisma.user.upsert({
    where: { email: 'warehouse@erp.com' },
    update: {},
    create: { name: 'Warehouse User', email: 'warehouse@erp.com', password: hashedWarehouse, role: Role.WAREHOUSE },
  });

  const accounts = await prisma.user.upsert({
    where: { email: 'accounts@erp.com' },
    update: {},
    create: { name: 'Accounts User', email: 'accounts@erp.com', password: hashedAccounts, role: Role.ACCOUNTS },
  });

  console.log('✅ Users seeded');

  // --- Customers ---
  const customers = [
    { name: 'Rajesh Kumar', mobile: '9876543210', email: 'rajesh@example.com', businessName: 'Kumar Traders', gstNumber: '29AABCU9603R1ZM', customerType: CustomerType.WHOLESALE, address: '123 MG Road, Mumbai', status: CustomerStatus.ACTIVE, followUpDate: new Date('2026-09-10') },
    { name: 'Priya Sharma', mobile: '9876543211', email: 'priya@example.com', businessName: 'Sharma Retail', customerType: CustomerType.RETAIL, address: '45 Park Street, Delhi', status: CustomerStatus.ACTIVE },
    { name: 'Amit Patel', mobile: '9876543212', email: 'amit@example.com', businessName: 'Patel Distributors', gstNumber: '24AAACR5055K1ZK', customerType: CustomerType.DISTRIBUTOR, address: '78 Ring Road, Ahmedabad', status: CustomerStatus.ACTIVE, followUpDate: new Date('2026-09-08') },
    { name: 'Sneha Reddy', mobile: '9876543213', email: 'sneha@example.com', businessName: 'Reddy Stores', customerType: CustomerType.RETAIL, address: '12 Jubilee Hills, Hyderabad', status: CustomerStatus.LEAD, followUpDate: new Date('2026-09-05') },
    { name: 'Vikram Singh', mobile: '9876543214', email: 'vikram@example.com', businessName: 'Singh Wholesale Hub', gstNumber: '06AABCS1429B1ZA', customerType: CustomerType.WHOLESALE, address: '56 Sector 17, Chandigarh', status: CustomerStatus.ACTIVE },
    { name: 'Deepika Nair', mobile: '9876543215', email: 'deepika@example.com', businessName: 'Nair Enterprises', customerType: CustomerType.DISTRIBUTOR, address: '89 Marine Drive, Kochi', status: CustomerStatus.LEAD },
    { name: 'Suresh Gupta', mobile: '9876543216', email: 'suresh@example.com', businessName: 'Gupta & Sons', gstNumber: '09AABCU9603R1ZP', customerType: CustomerType.WHOLESALE, address: '34 Civil Lines, Lucknow', status: CustomerStatus.INACTIVE },
    { name: 'Meera Joshi', mobile: '9876543217', email: 'meera@example.com', businessName: 'Joshi Retail Chain', customerType: CustomerType.RETAIL, address: '67 FC Road, Pune', status: CustomerStatus.ACTIVE, followUpDate: new Date('2026-09-15') },
    { name: 'Karan Malhotra', mobile: '9876543218', email: 'karan@example.com', businessName: 'Malhotra Traders', customerType: CustomerType.WHOLESALE, address: '23 Mall Road, Shimla', status: CustomerStatus.LEAD, followUpDate: new Date('2026-09-07') },
    { name: 'Anita Desai', mobile: '9876543219', email: 'anita@example.com', businessName: 'Desai Distribution Co', gstNumber: '27AABCU9603R1ZL', customerType: CustomerType.DISTRIBUTOR, address: '90 Station Road, Nagpur', status: CustomerStatus.ACTIVE },
  ];

  const createdCustomers = [];
  for (const c of customers) {
    const created = await prisma.customer.upsert({
      where: { id: customers.indexOf(c) + 1 },
      update: {},
      create: c,
    });
    createdCustomers.push(created);
  }

  console.log('✅ Customers seeded');

  // --- Follow-up Notes ---
  await prisma.followUpNote.createMany({
    skipDuplicates: true,
    data: [
      { customerId: createdCustomers[0].id, note: 'Discussed bulk order pricing for Q4. Will send revised quote by Friday.', createdById: sales.id },
      { customerId: createdCustomers[0].id, note: 'Client confirmed interest in 500 units. Awaiting PO.', createdById: sales.id },
      { customerId: createdCustomers[3].id, note: 'Initial inquiry about product catalog. Sent PDF brochure via email.', createdById: sales.id },
      { customerId: createdCustomers[8].id, note: 'Cold call - interested in wholesale rates. Scheduled meeting for next week.', createdById: sales.id },
    ],
  });

  console.log('✅ Follow-up notes seeded');

  // --- Products ---
  const products = [
    { name: 'Premium Basmati Rice (5kg)', sku: 'RICE-BAS-5KG', category: 'Grains', unitPrice: 450.00, currentStock: 200, minStockAlert: 50, location: 'Warehouse A - Rack 1' },
    { name: 'Toor Dal (1kg)', sku: 'DAL-TOOR-1KG', category: 'Pulses', unitPrice: 120.00, currentStock: 150, minStockAlert: 30, location: 'Warehouse A - Rack 2' },
    { name: 'Refined Sunflower Oil (5L)', sku: 'OIL-SUN-5L', category: 'Oils', unitPrice: 650.00, currentStock: 80, minStockAlert: 20, location: 'Warehouse B - Rack 1' },
    { name: 'Sugar (1kg)', sku: 'SUG-WHT-1KG', category: 'Sweeteners', unitPrice: 45.00, currentStock: 300, minStockAlert: 100, location: 'Warehouse A - Rack 3' },
    { name: 'Wheat Flour (10kg)', sku: 'FLR-WHT-10KG', category: 'Grains', unitPrice: 380.00, currentStock: 120, minStockAlert: 40, location: 'Warehouse A - Rack 1' },
    { name: 'Tea Powder (500g)', sku: 'TEA-PRM-500G', category: 'Beverages', unitPrice: 250.00, currentStock: 90, minStockAlert: 25, location: 'Warehouse B - Rack 2' },
    { name: 'Moong Dal (1kg)', sku: 'DAL-MNG-1KG', category: 'Pulses', unitPrice: 140.00, currentStock: 100, minStockAlert: 30, location: 'Warehouse A - Rack 2' },
    { name: 'Mustard Oil (1L)', sku: 'OIL-MUS-1L', category: 'Oils', unitPrice: 180.00, currentStock: 60, minStockAlert: 15, location: 'Warehouse B - Rack 1' },
    { name: 'Salt (1kg)', sku: 'SALT-IOD-1KG', category: 'Spices', unitPrice: 22.00, currentStock: 500, minStockAlert: 100, location: 'Warehouse A - Rack 4' },
    { name: 'Turmeric Powder (200g)', sku: 'SPC-TUR-200G', category: 'Spices', unitPrice: 65.00, currentStock: 15, minStockAlert: 20, location: 'Warehouse B - Rack 3' },
    { name: 'Red Chilli Powder (200g)', sku: 'SPC-CHL-200G', category: 'Spices', unitPrice: 55.00, currentStock: 10, minStockAlert: 20, location: 'Warehouse B - Rack 3' },
    { name: 'Coffee Powder (250g)', sku: 'COF-PRM-250G', category: 'Beverages', unitPrice: 320.00, currentStock: 45, minStockAlert: 15, location: 'Warehouse B - Rack 2' },
    { name: 'Ghee (1kg)', sku: 'GHE-COW-1KG', category: 'Dairy', unitPrice: 550.00, currentStock: 35, minStockAlert: 10, location: 'Warehouse C - Cold Storage' },
    { name: 'Chana Dal (1kg)', sku: 'DAL-CHN-1KG', category: 'Pulses', unitPrice: 95.00, currentStock: 130, minStockAlert: 30, location: 'Warehouse A - Rack 2' },
    { name: 'Soya Chunks (200g)', sku: 'SOY-CHK-200G', category: 'Protein', unitPrice: 45.00, currentStock: 8, minStockAlert: 15, location: 'Warehouse A - Rack 5' },
  ];

  const createdProducts = [];
  for (const p of products) {
    const created = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: { ...p, unitPrice: p.unitPrice },
    });
    createdProducts.push(created);
  }

  console.log('✅ Products seeded');

  // --- Stock Movements ---
  const movements = [
    { productId: createdProducts[0].id, quantity: 200, movementType: MovementType.IN, reason: 'Initial stock from supplier - ABC Foods', createdById: warehouse.id },
    { productId: createdProducts[1].id, quantity: 150, movementType: MovementType.IN, reason: 'Initial stock from supplier - XYZ Pulses', createdById: warehouse.id },
    { productId: createdProducts[2].id, quantity: 100, movementType: MovementType.IN, reason: 'Initial stock from supplier - SunGold Oils', createdById: warehouse.id },
    { productId: createdProducts[2].id, quantity: 20, movementType: MovementType.OUT, reason: 'Dispatched to retail outlet', createdById: warehouse.id },
    { productId: createdProducts[9].id, quantity: 25, movementType: MovementType.IN, reason: 'Restocking from supplier', createdById: warehouse.id },
    { productId: createdProducts[9].id, quantity: 10, movementType: MovementType.OUT, reason: 'Sold to walk-in customer', createdById: warehouse.id },
  ];

  await prisma.stockMovement.createMany({ skipDuplicates: true, data: movements });

  console.log('✅ Stock movements seeded');

  // --- Challans ---
  // Challan 1: Draft
  const challan1 = await prisma.challan.create({
    data: {
      challanNumber: 'CH-20260901-0001',
      customerId: createdCustomers[0].id,
      totalQuantity: 25,
      status: ChallanStatus.DRAFT,
      createdById: sales.id,
      items: {
        create: [
          { productId: createdProducts[0].id, quantity: 10, productName: 'Premium Basmati Rice (5kg)', productSku: 'RICE-BAS-5KG', productCategory: 'Grains', unitPrice: 450.00 },
          { productId: createdProducts[1].id, quantity: 15, productName: 'Toor Dal (1kg)', productSku: 'DAL-TOOR-1KG', productCategory: 'Pulses', unitPrice: 120.00 },
        ],
      },
    },
  });

  // Challan 2: Confirmed (stock already reduced by initial seed amounts)
  const challan2 = await prisma.challan.create({
    data: {
      challanNumber: 'CH-20260901-0002',
      customerId: createdCustomers[2].id,
      totalQuantity: 30,
      status: ChallanStatus.CONFIRMED,
      createdById: sales.id,
      items: {
        create: [
          { productId: createdProducts[3].id, quantity: 20, productName: 'Sugar (1kg)', productSku: 'SUG-WHT-1KG', productCategory: 'Sweeteners', unitPrice: 45.00 },
          { productId: createdProducts[4].id, quantity: 10, productName: 'Wheat Flour (10kg)', productSku: 'FLR-WHT-10KG', productCategory: 'Grains', unitPrice: 380.00 },
        ],
      },
    },
  });

  // Challan 3: Cancelled
  const challan3 = await prisma.challan.create({
    data: {
      challanNumber: 'CH-20260901-0003',
      customerId: createdCustomers[4].id,
      totalQuantity: 5,
      status: ChallanStatus.CANCELLED,
      createdById: sales.id,
      items: {
        create: [
          { productId: createdProducts[5].id, quantity: 5, productName: 'Tea Powder (500g)', productSku: 'TEA-PRM-500G', productCategory: 'Beverages', unitPrice: 250.00 },
        ],
      },
    },
  });

  console.log('✅ Challans seeded');
  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('Test Credentials:');
  console.log('  Admin:     admin@erp.com / admin123');
  console.log('  Sales:     sales@erp.com / sales123');
  console.log('  Warehouse: warehouse@erp.com / warehouse123');
  console.log('  Accounts:  accounts@erp.com / accounts123');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
