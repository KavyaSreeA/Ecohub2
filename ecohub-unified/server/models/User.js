import { query, transaction } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

class User {
  // Create a new user
  static async create(userData) {
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const sql = `
      INSERT INTO users (id, email, password_hash, name, phone, role, status, email_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await query(sql, [
      id,
      userData.email,
      hashedPassword,
      userData.name,
      userData.phone || null,
      userData.role || 'individual',
      userData.status || 'active',
      userData.email_verified || false
    ]);

    // Create impact metrics entry
    await query(
      'INSERT INTO user_impact (id, user_id) VALUES (?, ?)',
      [uuidv4(), id]
    );

    return this.findById(id);
  }

  // Find user by ID
  static async findById(id) {
    const sql = `
      SELECT id, email, name, avatar, phone, role, status, email_verified, 
             created_at, updated_at, last_login
      FROM users WHERE id = ?
    `;
    const results = await query(sql, [id]);
    return results[0] || null;
  }

  // Find user by email
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const results = await query(sql, [email]);
    return results[0] || null;
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user
  static async update(id, updates) {
    const allowedFields = ['name', 'avatar', 'phone', 'role', 'status', 'email_verified'];
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    
    return this.findById(id);
  }

  // Update last login
  static async updateLastLogin(id) {
    await query('UPDATE users SET last_login = NOW() WHERE id = ?', [id]);
  }

  // Change password
  static async changePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, id]);
  }

  // Get all users (admin)
  static async getAll(options = {}) {
    const { page = 1, limit = 20, role, status, search } = options;
    const offset = (page - 1) * limit;
    
    let sql = `
      SELECT id, email, name, avatar, phone, role, status, email_verified, 
             created_at, last_login
      FROM users WHERE 1=1
    `;
    const params = [];

    if (role) {
      sql += ' AND role = ?';
      params.push(role);
    }

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const users = await query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const countParams = [];

    if (role) {
      countSql += ' AND role = ?';
      countParams.push(role);
    }

    if (status) {
      countSql += ' AND status = ?';
      countParams.push(status);
    }

    if (search) {
      countSql += ' AND (name LIKE ? OR email LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const countResult = await query(countSql, countParams);
    const total = countResult[0].total;

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Get user with profile (business or community)
  static async getWithProfile(id) {
    const user = await this.findById(id);
    if (!user) return null;

    if (user.role === 'business') {
      const profile = await query(
        'SELECT * FROM business_profiles WHERE user_id = ?',
        [id]
      );
      user.businessProfile = profile[0] || null;
    } else if (user.role === 'community') {
      const profile = await query(
        'SELECT * FROM community_profiles WHERE user_id = ?',
        [id]
      );
      user.communityProfile = profile[0] || null;
    }

    // Get impact metrics
    const impact = await query(
      'SELECT * FROM user_impact WHERE user_id = ?',
      [id]
    );
    user.impact = impact[0] || null;

    return user;
  }

  // Suspend user (admin)
  static async suspend(id, reason, adminId) {
    await transaction(async (connection) => {
      // Update user status
      await connection.execute(
        'UPDATE users SET status = ? WHERE id = ?',
        ['suspended', id]
      );

      // Log admin action
      await connection.execute(
        `INSERT INTO admin_actions (id, admin_id, action_type, target_type, target_id, reason)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [uuidv4(), adminId, 'suspend', 'user', id, reason]
      );
    });
  }

  // Activate user (admin)
  static async activate(id, adminId) {
    await transaction(async (connection) => {
      await connection.execute(
        'UPDATE users SET status = ? WHERE id = ?',
        ['active', id]
      );

      await connection.execute(
        `INSERT INTO admin_actions (id, admin_id, action_type, target_type, target_id)
         VALUES (?, ?, ?, ?, ?)`,
        [uuidv4(), adminId, 'activate', 'user', id]
      );
    });
  }

  // Change user role (admin)
  static async changeRole(id, newRole, adminId) {
    const user = await this.findById(id);
    const previousRole = user.role;

    await transaction(async (connection) => {
      await connection.execute(
        'UPDATE users SET role = ? WHERE id = ?',
        [newRole, id]
      );

      await connection.execute(
        `INSERT INTO admin_actions (id, admin_id, action_type, target_type, target_id, previous_state, new_state)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          adminId,
          'modify',
          'user',
          id,
          JSON.stringify({ role: previousRole }),
          JSON.stringify({ role: newRole })
        ]
      );
    });
  }

  // Delete user
  static async delete(id) {
    await query('DELETE FROM users WHERE id = ?', [id]);
  }

  // Get user statistics (admin dashboard)
  static async getStats() {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN role = 'individual' THEN 1 ELSE 0 END) as individuals,
        SUM(CASE WHEN role = 'business' THEN 1 ELSE 0 END) as businesses,
        SUM(CASE WHEN role = 'community' THEN 1 ELSE 0 END) as communities,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users,
        SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended_users,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today_signups,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as week_signups,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as month_signups
      FROM users
    `);

    return stats[0];
  }
}

export default User;
