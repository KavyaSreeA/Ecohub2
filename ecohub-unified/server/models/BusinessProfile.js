import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

class BusinessProfile {
  // Create business profile
  static async create(userId, profileData) {
    const id = uuidv4();
    
    const sql = `
      INSERT INTO business_profiles (
        id, user_id, business_name, business_type, gst_number, msme_registration,
        industry_sector, address, city, state, pincode, website, employee_count,
        annual_turnover, verification_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      id,
      userId,
      profileData.business_name,
      profileData.business_type,
      profileData.gst_number || null,
      profileData.msme_registration || null,
      profileData.industry_sector || null,
      profileData.address || null,
      profileData.city || null,
      profileData.state || null,
      profileData.pincode || null,
      profileData.website || null,
      profileData.employee_count || null,
      profileData.annual_turnover || null,
      'pending'
    ]);

    return this.findById(id);
  }

  // Find by ID
  static async findById(id) {
    const results = await query('SELECT * FROM business_profiles WHERE id = ?', [id]);
    return results[0] || null;
  }

  // Find by user ID
  static async findByUserId(userId) {
    const results = await query('SELECT * FROM business_profiles WHERE user_id = ?', [userId]);
    return results[0] || null;
  }

  // Update profile
  static async update(id, updates) {
    const allowedFields = [
      'business_name', 'business_type', 'gst_number', 'msme_registration',
      'industry_sector', 'address', 'city', 'state', 'pincode', 'website',
      'employee_count', 'annual_turnover'
    ];
    
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
    await query(`UPDATE business_profiles SET ${fields.join(', ')} WHERE id = ?`, values);
    
    return this.findById(id);
  }

  // Verify business (admin)
  static async verify(id, adminId, status, notes = null) {
    await query(`
      UPDATE business_profiles 
      SET verification_status = ?, verification_notes = ?, verified_by = ?, verified_at = NOW()
      WHERE id = ?
    `, [status, notes, adminId, id]);

    return this.findById(id);
  }

  // Get pending verifications
  static async getPending(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    
    const profiles = await query(`
      SELECT bp.*, u.name as owner_name, u.email as owner_email
      FROM business_profiles bp
      JOIN users u ON bp.user_id = u.id
      WHERE bp.verification_status = 'pending'
      ORDER BY bp.created_at ASC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    const countResult = await query(
      'SELECT COUNT(*) as total FROM business_profiles WHERE verification_status = ?',
      ['pending']
    );

    return {
      profiles,
      pagination: {
        page,
        limit,
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    };
  }

  // Get all businesses (with filters)
  static async getAll(options = {}) {
    const { page = 1, limit = 20, status, city, sector, search } = options;
    const offset = (page - 1) * limit;
    
    let sql = `
      SELECT bp.*, u.name as owner_name, u.email as owner_email, u.status as account_status
      FROM business_profiles bp
      JOIN users u ON bp.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND bp.verification_status = ?';
      params.push(status);
    }

    if (city) {
      sql += ' AND bp.city = ?';
      params.push(city);
    }

    if (sector) {
      sql += ' AND bp.industry_sector = ?';
      params.push(sector);
    }

    if (search) {
      sql += ' AND (bp.business_name LIKE ? OR bp.gst_number LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY bp.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const profiles = await query(sql, params);

    return { profiles };
  }
}

export default BusinessProfile;
