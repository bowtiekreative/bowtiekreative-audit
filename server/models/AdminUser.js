import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

class AdminUser {
  static async create(username, email, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO admin_users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );
    return result.insertId;
  }

  static async findByUsername(username) {
    const [rows] = await pool.query(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );
    return rows[0] || null;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM admin_users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateLastLogin(id) {
    await pool.query(
      'UPDATE admin_users SET last_login = NOW() WHERE id = ?',
      [id]
    );
  }
}

export default AdminUser;
