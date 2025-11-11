import pool from '../config/database.js';

class Audit {
  // Generate a unique 4-digit code
  static generateUpdateCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // Check if update code already exists
  static async isUpdateCodeUnique(code) {
    const [rows] = await pool.query('SELECT id FROM audits WHERE update_code = ?', [code]);
    return rows.length === 0;
  }

  // Generate a unique 4-digit update code
  static async generateUniqueUpdateCode() {
    let code;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      code = this.generateUpdateCode();
      isUnique = await this.isUpdateCodeUnique(code);
      attempts++;
    }

    if (!isUnique) {
      throw new Error('Failed to generate unique update code');
    }

    return code;
  }

  static async create(auditData) {
    const connection = await pool.getConnection();
    try {
      // Generate unique update code
      const updateCode = await this.generateUniqueUpdateCode();

      const [result] = await connection.query(
        `INSERT INTO audits (
          business_name, contact_name, email, phone, website, 
          industry, business_size, location,
          social_media_platforms, current_marketing_tools, target_audience,
          marketing_goals, monthly_budget, biggest_challenges,
          has_website, has_social_media, has_email_marketing, 
          has_seo, has_paid_ads, has_analytics, has_crm, has_automation,
          update_code
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          auditData.business_name,
          auditData.contact_name,
          auditData.email,
          auditData.phone || null,
          auditData.website || null,
          auditData.industry || null,
          auditData.business_size || null,
          auditData.location || null,
          JSON.stringify(auditData.social_media_platforms || []),
          JSON.stringify(auditData.current_marketing_tools || []),
          auditData.target_audience || null,
          auditData.marketing_goals || null,
          auditData.monthly_budget || null,
          auditData.biggest_challenges || null,
          auditData.has_website || false,
          auditData.has_social_media || false,
          auditData.has_email_marketing || false,
          auditData.has_seo || false,
          auditData.has_paid_ads || false,
          auditData.has_analytics || false,
          auditData.has_crm || false,
          auditData.has_automation || false,
          updateCode
        ]
      );
      return { auditId: result.insertId, updateCode };
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM audits WHERE id = ?', [id]);
    if (rows.length > 0) {
      const audit = rows[0];
      // Parse JSON fields
      audit.social_media_platforms = JSON.parse(audit.social_media_platforms || '[]');
      audit.current_marketing_tools = JSON.parse(audit.current_marketing_tools || '[]');
      return audit;
    }
    return null;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM audits WHERE email = ? ORDER BY created_at DESC',
      [email]
    );
    return rows.map(audit => ({
      ...audit,
      social_media_platforms: JSON.parse(audit.social_media_platforms || '[]'),
      current_marketing_tools: JSON.parse(audit.current_marketing_tools || '[]')
    }));
  }

  static async findAll(limit = 100, offset = 0) {
    const [rows] = await pool.query(
      'SELECT * FROM audits ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows.map(audit => ({
      ...audit,
      social_media_platforms: JSON.parse(audit.social_media_platforms || '[]'),
      current_marketing_tools: JSON.parse(audit.current_marketing_tools || '[]')
    }));
  }

  static async updateScores(id, scores) {
    await pool.query(
      `UPDATE audits SET 
        website_score = ?, 
        social_score = ?, 
        marketing_score = ?, 
        automation_score = ?, 
        overall_score = ?
      WHERE id = ?`,
      [
        scores.website_score,
        scores.social_score,
        scores.marketing_score,
        scores.automation_score,
        scores.overall_score,
        id
      ]
    );
  }

  static async updateReport(id, pdfPath) {
    await pool.query(
      'UPDATE audits SET report_generated = TRUE, pdf_path = ? WHERE id = ?',
      [pdfPath, id]
    );
  }

  // Find audit by update code and email
  static async findByUpdateCode(updateCode, email) {
    const [rows] = await pool.query(
      'SELECT * FROM audits WHERE update_code = ? AND email = ?',
      [updateCode, email]
    );
    if (rows.length > 0) {
      const audit = rows[0];
      // Parse JSON fields
      audit.social_media_platforms = JSON.parse(audit.social_media_platforms || '[]');
      audit.current_marketing_tools = JSON.parse(audit.current_marketing_tools || '[]');
      return audit;
    }
    return null;
  }

  // Update audit data
  static async update(id, auditData) {
    const connection = await pool.getConnection();
    try {
      await connection.query(
        `UPDATE audits SET
          business_name = ?, 
          contact_name = ?, 
          phone = ?, 
          website = ?,
          industry = ?, 
          business_size = ?, 
          location = ?,
          social_media_platforms = ?, 
          current_marketing_tools = ?, 
          target_audience = ?,
          marketing_goals = ?, 
          monthly_budget = ?, 
          biggest_challenges = ?,
          has_website = ?, 
          has_social_media = ?, 
          has_email_marketing = ?,
          has_seo = ?, 
          has_paid_ads = ?, 
          has_analytics = ?, 
          has_crm = ?, 
          has_automation = ?
        WHERE id = ?`,
        [
          auditData.business_name,
          auditData.contact_name,
          auditData.phone || null,
          auditData.website || null,
          auditData.industry || null,
          auditData.business_size || null,
          auditData.location || null,
          JSON.stringify(auditData.social_media_platforms || []),
          JSON.stringify(auditData.current_marketing_tools || []),
          auditData.target_audience || null,
          auditData.marketing_goals || null,
          auditData.monthly_budget || null,
          auditData.biggest_challenges || null,
          auditData.has_website || false,
          auditData.has_social_media || false,
          auditData.has_email_marketing || false,
          auditData.has_seo || false,
          auditData.has_paid_ads || false,
          auditData.has_analytics || false,
          auditData.has_crm || false,
          auditData.has_automation || false,
          id
        ]
      );
      return true;
    } finally {
      connection.release();
    }
  }

  static async getStats() {
    const [totalCount] = await pool.query('SELECT COUNT(*) as count FROM audits');
    const [todayCount] = await pool.query(
      'SELECT COUNT(*) as count FROM audits WHERE DATE(created_at) = CURDATE()'
    );
    const [weekCount] = await pool.query(
      'SELECT COUNT(*) as count FROM audits WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );
    const [avgScore] = await pool.query(
      'SELECT AVG(overall_score) as avg FROM audits WHERE overall_score > 0'
    );

    return {
      total: totalCount[0].count,
      today: todayCount[0].count,
      thisWeek: weekCount[0].count,
      averageScore: Math.round(avgScore[0].avg || 0)
    };
  }
}

export default Audit;
