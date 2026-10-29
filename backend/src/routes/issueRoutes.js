const express = require('express');
const router = express.Router();
const { getModels } = require('../models/modelProvider');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/issues
// @desc    Get all student guidance issues with optional category and search filter
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { IssueRule } = getModels();
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { issueTitle: { $regex: search, $options: 'i' } },
        { responsibleAuthority: { $regex: search, $options: 'i' } },
        { designatedPerson: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const issues = await IssueRule.find(filter);
    const categories = await IssueRule.distinct('category');

    res.json({
      success: true,
      count: issues.length,
      categories,
      issues
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/issues
// @desc    Add new issue guidance rule (Admin/CR)
// @access  Private
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { IssueRule } = getModels();
    const issue = await IssueRule.create(req.body);
    res.status(201).json({ success: true, issue });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/issues/:id
// @desc    Update issue rule (Admin/CR)
// @access  Private
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { IssueRule } = getModels();
    const updated = await IssueRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Issue rule not found' });
    }
    res.json({ success: true, issue: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/issues/:id
// @desc    Delete issue rule (Admin/CR)
// @access  Private
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { IssueRule } = getModels();
    const deleted = await IssueRule.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Issue rule not found' });
    }
    res.json({ success: true, message: 'Issue rule deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
