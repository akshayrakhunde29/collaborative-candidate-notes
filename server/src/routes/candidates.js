const express = require('express');
const Candidate = require('../models/Candidate');
const { authenticateToken } = require('../middleware/auth');
const { validateCandidate } = require('../middleware/validation');
const { sanitizeInput } = require('../middleware/sanitization');

const router = express.Router();

// Get all candidates
router.get('/', authenticateToken, async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ candidates });
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({ message: 'Server error while fetching candidates' });
  }
});

// Get specific candidate
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json({ candidate });
  } catch (error) {
    console.error('Get candidate error:', error);
    res.status(500).json({ message: 'Server error while fetching candidate' });
  }
});

// Create new candidate
router.post('/', authenticateToken, sanitizeInput, validateCandidate, async (req, res) => {
  try {
    const { name, email } = req.body;

    const candidate = new Candidate({
      name,
      email,
      createdBy: req.user._id
    });

    await candidate.save();
    await candidate.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Candidate created successfully',
      candidate
    });
  } catch (error) {
    console.error('Create candidate error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Candidate with this email already exists' });
    }
    res.status(500).json({ message: 'Server error while creating candidate' });
  }
});

// Update candidate (optional)
router.put('/:id', authenticateToken, sanitizeInput, validateCandidate, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    candidate.name = name;
    candidate.email = email;
    await candidate.save();
    await candidate.populate('createdBy', 'name email');

    res.json({
      message: 'Candidate updated successfully',
      candidate
    });
  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({ message: 'Server error while updating candidate' });
  }
});

// Delete candidate (optional)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Delete candidate error:', error);
    res.status(500).json({ message: 'Server error while deleting candidate' });
  }
});

module.exports = router;