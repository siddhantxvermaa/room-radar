const mongoose = require('mongoose');

const issueRuleSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Academic', 'Examination', 'Administrative', 'Hostel / Facilities', 'Fee & Accounts', 'Mentorship & Career'],
    required: true
  },
  issueTitle: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  responsibleAuthority: { type: String, required: true }, // e.g., "Academic Coordinator", "Head of Department (HOD)", "Proctor"
  designatedPerson: { type: String, required: true },    // Specific faculty/staff name
  cabinNumber: { type: String, required: true },
  building: { type: String, required: true },
  floor: { type: Number, required: true },
  visitingHours: { type: String, default: '11:00 AM - 1:00 PM & 3:00 PM - 4:30 PM' },
  actionSteps: [{ type: String }],
  requiredDocuments: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('IssueRule', issueRuleSchema);
