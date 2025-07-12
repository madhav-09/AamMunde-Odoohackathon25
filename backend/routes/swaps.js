const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get user's swap requests (sent and received)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sr.*, 
             sender.name as sender_name, sender.profile_photo_url as sender_photo,
             receiver.name as receiver_name, receiver.profile_photo_url as receiver_photo
      FROM swap_requests sr
      JOIN users sender ON sr.sender_id = sender.id
      JOIN users receiver ON sr.receiver_id = receiver.id
      WHERE sr.sender_id = $1 OR sr.receiver_id = $1
      ORDER BY sr.created_at DESC
    `, [req.user.userId]);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Send swap request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { receiver_id, skill_offered, skill_requested, message } = req.body;
    
    const result = await pool.query(`
      INSERT INTO swap_requests (sender_id, receiver_id, skill_offered, skill_requested, message)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [req.user.userId, receiver_id, skill_offered, skill_requested, message]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update swap request status
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    const result = await pool.query(`
      UPDATE swap_requests 
      SET status = $1 
      WHERE id = $2 AND receiver_id = $3 
      RETURNING *
    `, [status, req.params.id, req.user.userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Swap request not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete swap request
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      DELETE FROM swap_requests 
      WHERE id = $1 AND (sender_id = $2 OR receiver_id = $2)
      RETURNING *
    `, [req.params.id, req.user.userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Swap request not found or unauthorized' });
    }
    
    res.json({ message: 'Swap request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;