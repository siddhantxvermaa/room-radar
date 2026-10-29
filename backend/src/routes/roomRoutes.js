const express = require('express');
const router = express.Router();
const { getModels } = require('../models/modelProvider');
const { calculateProximity } = require('../utils/proximity');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/rooms/nearest
// @desc    Get rooms sorted by vacancy and proximity to student's location
// @access  Public
router.get('/nearest', async (req, res) => {
  try {
    const { Room } = getModels();
    const { building = 'Block B', floor = 0, day, time } = req.query;
    const rooms = await Room.find({});

    const ranked = calculateProximity(building, parseInt(floor, 10), rooms, day, time);
    
    // Summary statistics
    const totalRooms = ranked.length;
    const vacantCount = ranked.filter(r => r.isVacant).length;
    const occupiedCount = totalRooms - vacantCount;

    res.json({
      success: true,
      userLocation: { building, floor: parseInt(floor, 10) },
      stats: { totalRooms, vacantCount, occupiedCount },
      rooms: ranked
    });
  } catch (error) {
    console.error('Error fetching nearest rooms:', error);
    res.status(500).json({ success: false, message: 'Server error fetching rooms' });
  }
});

// @route   GET /api/rooms
// @desc    Get all rooms (optional query params)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { Room } = getModels();
    const { building, floor } = req.query;
    const filter = {};
    if (building) filter.building = building;
    if (floor !== undefined) filter.floor = Number(floor);

    const rooms = await Room.find(filter);
    res.json({ success: true, count: rooms.length, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/rooms/:id
// @desc    Get single room with complete timetable
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { Room } = getModels();
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    const vacancyInfo = room.checkCurrentVacancy ? room.checkCurrentVacancy() : { isVacant: true };
    res.json({ success: true, room, currentStatus: vacancyInfo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/rooms/:id/toggle-status
// @desc    Crowdsourced / Student quick report (Occupied / Empty toggle with 45m expiry)
// @access  Public
router.post('/:id/toggle-status', async (req, res) => {
  try {
    const { Room } = getModels();
    const { isOccupied, durationMinutes = 45, reportedBy = 'Student' } = req.body;
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const expiry = new Date(Date.now() + durationMinutes * 60 * 1000);
    const updatedStatus = {
      isOccupied: Boolean(isOccupied),
      overrideUntil: expiry,
      lastUpdatedBy: reportedBy
    };

    const updated = await Room.findByIdAndUpdate(req.params.id, { statusOverride: updatedStatus }, { new: true });
    res.json({
      success: true,
      message: `Room status updated to ${isOccupied ? 'Occupied' : 'Vacant'} until ${expiry.toLocaleTimeString()}`,
      room: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/rooms
// @desc    Add a new classroom (Admin/CR)
// @access  Private (Admin/CR)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { Room } = getModels();
    const { roomNumber, building, floor, capacity, type, schedule } = req.body;
    const newRoom = await Room.create({
      roomNumber,
      building,
      floor,
      capacity,
      type,
      schedule: schedule || []
    });
    res.status(201).json({ success: true, room: newRoom });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/rooms/:id
// @desc    Update classroom details or timetable (Admin/CR)
// @access  Private (Admin/CR)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { Room } = getModels();
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedRoom) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, room: updatedRoom });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/rooms/:id
// @desc    Delete classroom (Admin/CR)
// @access  Private (Admin/CR)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { Room } = getModels();
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
