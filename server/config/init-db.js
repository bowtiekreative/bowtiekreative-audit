import pool from './database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import AdminUser from '../models/AdminUser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  console.log('🔄 Initializing database...');

  try {
    // Read and execute schema
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const statements = schemaSQL.split(';').filter(stmt => stmt.trim().length > 0);

    for (const statement of statements) {
      await pool.query(statement);
    }

    console.log('✅ Database schema created successfully');

    // Check if admin user exists
    const existingAdmin = await AdminUser.findByUsername('admin');
    
    if (!existingAdmin) {
      // Create default admin user
      await AdminUser.create('admin', 'ryan@bowtiekreative.com', 'admin123');
      console.log('✅ Default admin user created');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('   ⚠️  Please change the password after first login!');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('✅ Database initialization complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
