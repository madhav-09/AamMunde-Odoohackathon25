const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get ratings for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, u.name as rater_name
      FROM ratings r
      JOIN users u ON r.rated_by = u.id
      WHERE r.rated_user = $1
      ORDER BY r.created_at DESC
    `, [req.params.userId]);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add rating
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { swap_id, rated_user, score, comment } = req.body;
    
    const result = await pool.query(`
      INSERT INTO ratings (swap_id, rated_by, rated_user, score, comment)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [swap_id, req.user.userId, rated_user, score, comment]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;