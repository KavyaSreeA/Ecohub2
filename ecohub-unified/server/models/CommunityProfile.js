import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

class CommunityProfile {
  // Create community profile
  static async create(userId, profileData) {
    const id = uuidv4();
    
    const sql = `
      INSERT INTO community_profiles (
        id, user_id, organization_name, organization_type, registration_number,
        focus_areas, description, address, city, state, pincode, website,
        member_count, verification_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      id,
      userId,
      profileData.organization_name,
      profileData.organization_type,
      profileData.registration_number || null,
      JSON.stringify(profileData.focus_areas || []),
      profileData.description || null,
      profileData.address || null,
      profileData.city || null,
      profileData.state || null,
      profileData.pincode || null,
      profileData.website || null,
      profileData.member_count || null,
      'pending'
    ]);

    return this.findById(id);
  }

  // Find by ID
  static async findById(id) {
    const results = await query('SELECT * FROM community_profiles WHERE id = ?', [id]);
    if (results[0]) {
      results[0].focus_areas = JSON.parse(results[0].focus_areas || '[]');
    }
    return results[0] || null;
  }

  // Find by user ID
  static async findByUserId(userId) {
    const results = await query('SELECT * FROM community_profiles WHERE user_id = ?', [userId]);
    if (results[0]) {
      results[0].focus_areas = JSON.parse(results[0].focus_areas || '[]');
    }
    return results[0] || null;
  }

  // Update profile
  static async update(id, updates) {
    const allowedFields = [
      'organization_name', 'organization_type', 'registration_number',
      'focus_areas', 'description', 'address', 'city', 'state', 'pincode',
      'website', 'member_count'
    ];
    
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        if (key === 'focus_areas') {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
      }
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await query(`UPDATE community_profiles SET ${fields.join(', ')} WHERE id = ?`, values);
    
    return this.findById(id);
  }

  // Verify community (admin)
  static async verify(id, adminId, status, notes = null) {
    await query(`
      UPDATE community_profiles 
      SET verification_status = ?, verification_notes = ?, verified_by = ?, verified_at = NOW()
      WHERE id = ?
    `, [status, notes, adminId, id]);

    return this.findById(id);
  }

  // Get pending verifications
  static async getPending(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    
    const profiles = await query(`
      SELECT cp.*, u.name as owner_name, u.email as owner_email
      FROM community_profiles cp
      JOIN users u ON cp.user_id = u.id
      WHERE cp.verification_status = 'pending'
      ORDER BY cp.created_at ASC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    profiles.forEach(p => {
      p.focus_areas = JSON.parse(p.focus_areas || '[]');
    });

    const countResult = await query(
      'SELECT COUNT(*) as total FROM community_profiles WHERE verification_status = ?',
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

  // Get all communities
  static async getAll(options = {}) {
    const { page = 1, limit = 20, status, city, type, search } = options;
    const offset = (page - 1) * limit;
    
    let sql = `
      SELECT cp.*, u.name as owner_name, u.email as owner_email, u.status as account_status
      FROM community_profiles cp
      JOIN users u ON cp.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND cp.verification_status = ?';
      params.push(status);
    }

    if (city) {
      sql += ' AND cp.city = ?';
      params.push(city);
    }

    if (type) {
      sql += ' AND cp.organization_type = ?';
      params.push(type);
    }

    if (search) {
      sql += ' AND (cp.organization_name LIKE ? OR cp.registration_number LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY cp.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const profiles = await query(sql, params);
    profiles.forEach(p => {
      p.focus_areas = JSON.parse(p.focus_areas || '[]');
    });

    return { profiles };
  }
}

export default CommunityProfile;
