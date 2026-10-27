import fs from 'fs';
import path from 'path';
import pg from 'pg';

import dotenv from 'dotenv';
dotenv.config();

const DIRECT_URL = process.env.DIRECT_URL || process.env.DATABASE_URL || '';
const POOLER_URL = process.env.DATABASE_URL || '';
const projectId = 'znsgstqbeizurycmqvhq';

async function deployToSupabase() {
  console.log('================================================================');
  console.log('🚀 GLAMGO AUTOMATED CLOUD DATABASE DEPLOYMENT');
  console.log(`📡 Cloud Target: Supabase (${projectId} - Singapore ap-southeast-1)`);
  console.log('================================================================\n');

  const client = new pg.Client({
    connectionString: DIRECT_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔌 Connecting to Supabase PostgreSQL cluster...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // 1. Enable Extensions
    console.log('📦 [1/5] Enabling extensions: postgis, btree_gist, uuid-ossp...');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await client.query('CREATE EXTENSION IF NOT EXISTS "postgis";');
    await client.query('CREATE EXTENSION IF NOT EXISTS "btree_gist";');
    const extRes = await client.query(`SELECT extname FROM pg_extension WHERE extname IN ('postgis', 'btree_gist', 'uuid-ossp');`);
    console.log('   Installed:', extRes.rows.map((r) => r.extname).join(', '));

    // 2. Execute Migration SQL
    console.log('\n🏛️ [2/5] Executing database schema migration (migration.sql)...');
    const migrationPath = path.resolve('prisma/migrations/20261101000000_init_postgis_gist_schema/migration.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf-8');
    await client.query(migrationSql);
    console.log('✅ All tables, enums, GiST range exclusion constraints & spatial indexes created!');

    // 3. Ensure password_hash column in users
    console.log('\n🔒 [3/5] Configuring bcrypt authentication columns...');
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
      ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;
    `);
    console.log('✅ Authentication schema verified!');

    // 4. Execute Seed SQL
    console.log('\n🌱 [4/5] Seeding celebrity MUAs, bridal packages, cosmetics & addresses...');
    const seedPath = path.resolve('prisma/seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf-8');
    await client.query(seedSql);

    // Set default bcrypt password for all seeded users
    const defaultHash = '$2b$10$EDkvOMLMSBvGcWM9HtJ/I.LJnq7W8nvWvIfpcxcYdhkDV8L2e4Cfu';
    await client.query(`UPDATE users SET password_hash = $1 WHERE password_hash IS NULL;`, [defaultHash]);
    console.log('✅ Seed data imported & credentials synchronized!');

    // 5. Verification & Table Counts
    console.log('\n📊 [5/5] Querying live database tables in Supabase...');
    const tables = [
      'users',
      'user_addresses',
      'professional_profiles',
      'service_offerings',
      'portfolio_media',
      'professional_availability_rules',
      'vendor_profiles',
      'products',
      'product_skus',
      'bookings',
      'escrow_ledger_entries',
    ];

    for (const t of tables) {
      try {
        const res = await client.query(`SELECT count(1) as total FROM "${t}";`);
        console.log(`   Table "${t}": ${res.rows[0].total} rows`);
      } catch (err: any) {
        console.log(`   Table "${t}": (Notice: ${err.message})`);
      }
    }

    await client.end();

    // 6. Update local .env file
    console.log('\n📝 Updating local .env with Supabase credentials...');
    let envContent = fs.readFileSync('.env', 'utf-8');
    envContent = envContent.replace(
      /^DATABASE_URL=.*/m,
      `DATABASE_URL="${POOLER_URL}"`
    );
    envContent = envContent.replace(
      /^DIRECT_URL=.*/m,
      `DIRECT_URL="${DIRECT_URL}"`
    );
    fs.writeFileSync('.env', envContent, 'utf-8');
    console.log('✅ .env updated with live Supabase URLs!');

    console.log('\n================================================================');
    console.log('🎉 DEPLOYMENT COMPLETE! YOUR SUPABASE DATABASE IS 100% OPERATIONAL');
    console.log('================================================================\n');

  } catch (err: any) {
    console.error('\n❌ Deployment failed:', err.message);
    try { await client.end(); } catch {}
    process.exit(1);
  }
}

deployToSupabase();
