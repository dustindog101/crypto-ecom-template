import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Admin User
  const defaultAdminEmail = 'admin@cryptostore.local';
  const defaultPassword = 'adminPassword123!';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: defaultAdminEmail },
    update: { role: 'ADMIN' },
    create: {
      email: defaultAdminEmail,
      username: 'admin',
      name: 'Store Administrator',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log(`👤 Admin user seeded: ${admin.email} (Password: ${defaultPassword})`);

  // 2. Seed Default Payment Settings
  const defaultGateways = {
    btc: {
      enabled: false,
      address: '',
      minConfirmations: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      network: 'Bitcoin Mainnet',
    },
    ltc: {
      enabled: false,
      address: '',
      minConfirmations: 2,
      name: 'Litecoin',
      symbol: 'LTC',
      network: 'Litecoin Mainnet',
    },
    sol: {
      enabled: false,
      address: '',
      minConfirmations: 32,
      name: 'Solana',
      symbol: 'SOL',
      network: 'Solana Mainnet',
    },
    usdc_ethereum: {
      enabled: false,
      address: '',
      minConfirmations: 12,
      name: 'USDC (Ethereum)',
      symbol: 'USDC',
      network: 'Ethereum (ERC-20)',
    },
    usdc_base: {
      enabled: false,
      address: '',
      minConfirmations: 10,
      name: 'USDC (Base)',
      symbol: 'USDC',
      network: 'Base (EVM)',
    },
    usdc_polygon: {
      enabled: false,
      address: '',
      minConfirmations: 30,
      name: 'USDC (Polygon)',
      symbol: 'USDC',
      network: 'Polygon PoS',
    },
    usdc_solana: {
      enabled: false,
      address: '',
      minConfirmations: 32,
      name: 'USDC (Solana)',
      symbol: 'USDC',
      network: 'Solana (SPL)',
    },
  };

  await prisma.paymentSettings.upsert({
    where: { id: 'site' },
    update: {},
    create: {
      id: 'site',
      paymentGateways: JSON.stringify(defaultGateways),
      paymentIntentTtlHours: 48,
    },
  });
  console.log('💳 Payment settings initialized');

  // 3. Seed Demo Coupons
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      discountType: 'PERCENT',
      value: 10.0,
      minOrder: 50.0,
      maxUses: 1000,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'CRYPTO20' },
    update: {},
    create: {
      code: 'CRYPTO20',
      discountType: 'FIXED',
      value: 20.0,
      minOrder: 100.0,
      maxUses: 500,
      isActive: true,
    },
  });
  console.log('🎟️ Demo coupons seeded (WELCOME10, CRYPTO20)');

  // 4. Seed Dynamic Demo Products
  // Product A: Standard Hardware Product
  const hardwareProduct = await prisma.product.upsert({
    where: { slug: 'hardware-vault-key' },
    update: {},
    create: {
      slug: 'hardware-vault-key',
      name: 'Hardware Security Vault Key',
      category: 'hardware',
      categoryLabel: 'Security Hardware',
      description: 'Ultra-secure cryptographic hardware token for cold offline key storage.',
      longDescription: 'Engineered with military-grade tamper-resistant secure elements, this hardware vault key stores your private keys and seed phrases completely air-gapped from network attacks.',
      featured: true,
      isDigital: false,
      variants: {
        create: [
          {
            displayName: 'Single Key (Matte Black)',
            sku: 'HW-VAULT-BLK-1',
            price: 89.0,
            stockQty: 50,
            inStock: true,
            sortOrder: 1,
          },
          {
            displayName: 'Dual Redundancy Pack (2 Keys)',
            sku: 'HW-VAULT-DUO-2',
            price: 159.0,
            stockQty: 30,
            inStock: true,
            sortOrder: 2,
          },
        ],
      },
    },
  });

  // Product B: Custom Schema Product (with dynamic inputs)
  const customSchemaDemo = [
    {
      id: 'custom_engraving',
      type: 'text',
      label: 'Custom Laser Engraving Text',
      placeholder: 'e.g. My Secure Node 2026',
      required: false,
      maxLength: 32,
    },
    {
      id: 'finish_option',
      type: 'select',
      label: 'Anodized Casing Finish',
      options: ['Stealth Obsidian', 'Titanium Silver', 'Cyber Neon Blue'],
      required: true,
    },
    {
      id: 'custom_logo_upload',
      type: 'file',
      label: 'Custom Vector Logo / Asset (Optional)',
      accept: 'image/png,image/jpeg,image/svg+xml',
      maxSizeMb: 5,
      required: false,
    }
  ];

  await prisma.product.upsert({
    where: { slug: 'custom-metal-seed-plate' },
    update: {},
    create: {
      slug: 'custom-metal-seed-plate',
      name: 'Bespoke Titanium Seed Backup Plate',
      category: 'custom',
      categoryLabel: 'Custom Fabrication',
      description: 'Fireproof and waterproof titanium backup plate with custom laser engraving.',
      longDescription: 'Indestructible aerospace-grade titanium plate tested to withstand temperatures over 3,000°F. Includes custom laser engraving and serial inscription.',
      featured: true,
      customSchema: JSON.stringify(customSchemaDemo),
      isDigital: false,
      variants: {
        create: [
          {
            displayName: 'Standard Grade Titanium (24-word format)',
            sku: 'TI-PLATE-STD',
            price: 49.0,
            stockQty: 100,
            inStock: true,
            sortOrder: 1,
          },
          {
            displayName: 'Heavy-Duty Double Sided (48-word format)',
            sku: 'TI-PLATE-HD',
            price: 79.0,
            stockQty: 75,
            inStock: true,
            sortOrder: 2,
          },
        ],
      },
    },
  });

  // Product C: Digital Deliverable Product
  await prisma.product.upsert({
    where: { slug: 'self-hosted-node-suite' },
    update: {},
    create: {
      slug: 'self-hosted-node-suite',
      name: 'Automated Sovereign Node Operating Suite',
      category: 'digital',
      categoryLabel: 'Software & Digital',
      description: 'Instant automated provisioning scripts and private server management container suite.',
      longDescription: 'Comprehensive self-hosted orchestration package for running lightning nodes, private block explorers, and private VPN egress points. Instant cryptographic download access upon verified payment.',
      featured: false,
      isDigital: true,
      variants: {
        create: [
          {
            displayName: 'Single Server Lifetime License',
            sku: 'SOFT-NODE-LIFETIME',
            price: 120.0,
            stockQty: 9999,
            inStock: true,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  console.log('📦 Default catalog and products seeded successfully');
  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
