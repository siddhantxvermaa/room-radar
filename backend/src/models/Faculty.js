const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  designation: { type: String, required: true, trim: true }, // e.g. "Professor & Academic Coordinator", "HOD", "Mentor"
  department: { type: String, required: true, trim: true },
  cabinNumber: { type: String, required: true, trim: true },
  building: { type: String, required: true, trim: true },
  floor: { type: Number, required: true },
  consultationHours: { type: String, default: '10:00 AM - 12:00 PM & 2:00 PM - 4:00 PM' },
  email: { type: String, trim: true },
  phone: { type: String, trim: true },
  avatarUrl: { type: String, default: '' },
  subjectsTaught: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);
