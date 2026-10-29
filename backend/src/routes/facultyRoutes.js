const express = require('express');
const router = express.Router();
const { getModels } = require('../models/modelProvider');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/faculty
// @desc    Get all faculty with optional search query & department filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { Faculty } = getModels();
    const { search, department, building } = req.query;
    const filter = {};

    if (department && department !== 'All') {
      filter.department = department;
    }
    if (building && building !== 'All') {
      filter.building = building;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { cabinNumber: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { subjectsTaught: { $regex: search, $options: 'i' } }
      ];
    }

    const facultyList = await Faculty.find(filter);
    const departments = await Faculty.distinct('department');
    const buildings = await Faculty.distinct('building');

    res.json({
      success: true,
      count: facultyList.length,
      departments,
      buildings,
      faculty: facultyList
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/faculty/:id
// @desc    Get single faculty details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { Faculty } = getModels();
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }
    res.json({ success: true, faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/faculty
// @desc    Add new faculty cabin entry (Admin/CR)
// @access  Private
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { Faculty } = getModels();
    const faculty = await Faculty.create(req.body);
    res.status(201).json({ success: true, faculty });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/faculty/:id
// @desc    Update faculty details (Admin/CR)
// @access  Private
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { Faculty } = getModels();
    const updated = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }
    res.json({ success: true, faculty: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/faculty/:id
// @desc    Delete faculty entry (Admin/CR)
// @access  Private
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { Faculty } = getModels();
    const deleted = await Faculty.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }
    res.json({ success: true, message: 'Faculty removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
