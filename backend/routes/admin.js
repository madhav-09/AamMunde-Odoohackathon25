const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Admin middleware
const adminMiddleware = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT role FROM users WHERE id = $1', [req.user.userId]);
    if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, email, location, is_public, is_banned, role, created_at
      FROM users ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Ban/unban user
router.put('/users/:id/ban', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { is_banned } = req.body;
    const result = await pool.query(
      'UPDATE users SET is_banned = $1 WHERE id = $2 RETURNING id, name, is_banned',
      [is_banned, req.params.id]
    );
    
    // Log admin action
    await pool.query(
      'INSERT INTO admin_logs (admin_id, action, target_type, target_id, details) VALUES ($1, $2, $3, $4, $5)',
      [req.user.userId, is_banned ? 'BAN_USER' : 'UNBAN_USER', 'user', req.params.id, `User ${result.rows[0].name}`]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all swaps
router.get('/swaps', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sr.*, 
             sender.name as sender_name, receiver.name as receiver_name
      FROM swap_requests sr
      JOIN users sender ON sr.sender_id = sender.id
      JOIN users receiver ON sr.receiver_id = receiver.id
      ORDER BY sr.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Moderate skills
router.put('/skills/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    const is_approved = action === 'approve';
    
    const result = await pool.query(
      'UPDATE skills SET is_approved = $1 WHERE id = $2 RETURNING *',
      [is_approved, req.params.id]
    );
    
    // Log admin action
    await pool.query(
      'INSERT INTO admin_logs (admin_id, action, target_type, target_id, details) VALUES ($1, $2, $3, $4, $5)',
      [req.user.userId, `${action.toUpperCase()}_SKILL`, 'skill', req.params.id, `Skill: ${result.rows[0].name}`]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Send platform message
router.post('/messages', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const result = await pool.query(
      'INSERT INTO platform_messages (title, message, type, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, message, type, req.user.userId]
    );
    
    // Log admin action
    await pool.query(
      'INSERT INTO admin_logs (admin_id, action, target_type, target_id, details) VALUES ($1, $2, $3, $4, $5)',
      [req.user.userId, 'SEND_MESSAGE', 'platform_message', result.rows[0].id, title]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get reports
router.get('/reports', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [users, swaps, ratings, skills] = await Promise.all([
      pool.query('SELECT COUNT(*) as total_users FROM users WHERE is_banned = false'),
      pool.query('SELECT COUNT(*) as total_swaps, status FROM swap_requests GROUP BY status'),
      pool.query('SELECT AVG(score) as avg_rating, COUNT(*) as total_ratings FROM ratings'),
      pool.query('SELECT COUNT(*) as total_skills, type FROM skills WHERE is_approved = true GROUP BY type')
    ]);
    
    res.json({
      users: users.rows[0],
      swaps: swaps.rows,
      ratings: ratings.rows[0],
      skills: skills.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;