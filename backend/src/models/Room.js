const mongoose = require('mongoose');

const scheduleSlotSchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: { type: String, required: true }, // Format "HH:mm" (24h)
  endTime: { type: String, required: true },   // Format "HH:mm" (24h)
  course: { type: String, default: 'Class / Lecture' },
  faculty: { type: String, default: 'Staff' }
});

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, trim: true },
  building: { type: String, required: true, trim: true },
  floor: { type: Number, required: true },
  capacity: { type: Number, default: 60 },
  type: {
    type: String,
    enum: ['Classroom', 'Lecture Hall', 'Seminar Hall', 'Lab'],
    default: 'Classroom'
  },
  schedule: [scheduleSlotSchema],
  statusOverride: {
    isOccupied: { type: Boolean, default: null }, // null = follow schedule, true = force occupied, false = force vacant
    overrideUntil: { type: Date, default: null },
    lastUpdatedBy: { type: String, default: 'System' }
  }
}, { timestamps: true });

// Check if currently occupied based on given day and time (default current)
roomSchema.methods.checkCurrentVacancy = function (targetDay, targetTime) {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const day = targetDay || days[now.getDay()];
  
  let timeStr = targetTime;
  if (!timeStr) {
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeStr = `${hours}:${minutes}`;
  }

  // Check manual/crowdsourced override first if active
  if (this.statusOverride && this.statusOverride.isOccupied !== null) {
    if (this.statusOverride.overrideUntil && new Date() < new Date(this.statusOverride.overrideUntil)) {
      return {
        isVacant: !this.statusOverride.isOccupied,
        activeClass: this.statusOverride.isOccupied ? 'Occupied (Reported by Student)' : null,
        source: 'override'
      };
    }
  }

  // Check master timetable schedule
  const activeSlot = this.schedule.find(slot => {
    return slot.dayOfWeek.toLowerCase() === day.toLowerCase() &&
           timeStr >= slot.startTime &&
           timeStr < slot.endTime;
  });

  return {
    isVacant: !activeSlot,
    activeClass: activeSlot ? `${activeSlot.course} (${activeSlot.faculty})` : null,
    source: 'schedule'
  };
};

module.exports = mongoose.model('Room', roomSchema);
