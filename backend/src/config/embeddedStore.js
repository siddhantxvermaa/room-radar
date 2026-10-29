const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'campus_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let db = {
  rooms: [],
  faculty: [],
  issues: [],
  users: []
};

// Load existing data from file if present
function loadData() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(content);
    } catch (e) {
      console.warn('Could not parse local campus_db.json, re-initializing...');
    }
  }
}

// Persist data to file
function saveData() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving local campus_db.json:', e);
  }
}

loadData();

function generateId() {
  return 'local_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Helper to attach vacancy method to room object
function attachRoomMethods(room) {
  if (!room) return null;
  const clone = { ...room };
  clone.checkCurrentVacancy = function (targetDay, targetTime) {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = targetDay || days[now.getDay()];
    
    let timeStr = targetTime;
    if (!timeStr) {
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      timeStr = `${hours}:${minutes}`;
    }

    if (this.statusOverride && this.statusOverride.isOccupied !== null) {
      if (this.statusOverride.overrideUntil && new Date() < new Date(this.statusOverride.overrideUntil)) {
        return {
          isVacant: !this.statusOverride.isOccupied,
          activeClass: this.statusOverride.isOccupied ? 'Occupied (Reported by Student)' : null,
          source: 'override'
        };
      }
    }

    const activeSlot = (this.schedule || []).find(slot => {
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
  return clone;
}

const RoomStore = {
  find: async (filter = {}) => {
    let result = db.rooms.map(attachRoomMethods);
    if (filter.building) {
      result = result.filter(r => r.building === filter.building);
    }
    if (filter.floor !== undefined) {
      result = result.filter(r => Number(r.floor) === Number(filter.floor));
    }
    result.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));
    return result;
  },
  findById: async (id) => {
    const room = db.rooms.find(r => String(r._id) === String(id));
    return attachRoomMethods(room);
  },
  create: async (data) => {
    const newRoom = {
      _id: generateId(),
      capacity: 60,
      type: 'Classroom',
      schedule: [],
      statusOverride: { isOccupied: null, overrideUntil: null },
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    db.rooms.push(newRoom);
    saveData();
    return attachRoomMethods(newRoom);
  },
  findByIdAndUpdate: async (id, update, options) => {
    const idx = db.rooms.findIndex(r => String(r._id) === String(id));
    if (idx === -1) return null;
    db.rooms[idx] = { ...db.rooms[idx], ...update, updatedAt: new Date() };
    saveData();
    return attachRoomMethods(db.rooms[idx]);
  },
  findByIdAndDelete: async (id) => {
    const idx = db.rooms.findIndex(r => String(r._id) === String(id));
    if (idx === -1) return null;
    const deleted = db.rooms.splice(idx, 1)[0];
    saveData();
    return deleted;
  },
  countDocuments: async () => db.rooms.length,
  deleteMany: async () => {
    db.rooms = [];
    saveData();
  },
  insertMany: async (items) => {
    const mapped = items.map(item => ({
      _id: item._id || generateId(),
      capacity: 60,
      type: 'Classroom',
      schedule: [],
      statusOverride: { isOccupied: null, overrideUntil: null },
      ...item,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    db.rooms.push(...mapped);
    saveData();
    return mapped.map(attachRoomMethods);
  }
};

const FacultyStore = {
  find: async (filter = {}) => {
    let result = [...db.faculty];
    if (filter.department && filter.department !== 'All') {
      result = result.filter(f => f.department === filter.department);
    }
    if (filter.building && filter.building !== 'All') {
      result = result.filter(f => f.building === filter.building);
    }
    if (filter.$or) {
      result = result.filter(f => {
        const q = (filter.$or[0].name?.$regex || '').toLowerCase();
        if (!q) return true;
        return (
          f.name.toLowerCase().includes(q) ||
          f.designation.toLowerCase().includes(q) ||
          f.cabinNumber.toLowerCase().includes(q) ||
          f.department.toLowerCase().includes(q) ||
          (f.subjectsTaught || []).some(s => s.toLowerCase().includes(q))
        );
      });
    }
    return result;
  },
  findById: async (id) => db.faculty.find(f => String(f._id) === String(id)) || null,
  distinct: async (field) => [...new Set(db.faculty.map(f => f[field]).filter(Boolean))],
  create: async (data) => {
    const item = { _id: generateId(), subjectsTaught: [], ...data, createdAt: new Date() };
    db.faculty.push(item);
    saveData();
    return item;
  },
  findByIdAndUpdate: async (id, update) => {
    const idx = db.faculty.findIndex(f => String(f._id) === String(id));
    if (idx === -1) return null;
    db.faculty[idx] = { ...db.faculty[idx], ...update, updatedAt: new Date() };
    saveData();
    return db.faculty[idx];
  },
  findByIdAndDelete: async (id) => {
    const idx = db.faculty.findIndex(f => String(f._id) === String(id));
    if (idx === -1) return null;
    const deleted = db.faculty.splice(idx, 1)[0];
    saveData();
    return deleted;
  },
  deleteMany: async () => { db.faculty = []; saveData(); },
  insertMany: async (items) => {
    const mapped = items.map(item => ({ _id: generateId(), ...item, createdAt: new Date() }));
    db.faculty.push(...mapped);
    saveData();
    return mapped;
  }
};

const IssueStore = {
  find: async (filter = {}) => {
    let result = [...db.issues];
    if (filter.category && filter.category !== 'All') {
      result = result.filter(i => i.category === filter.category);
    }
    if (filter.$or) {
      result = result.filter(i => {
        const q = (filter.$or[0].issueTitle?.$regex || '').toLowerCase();
        if (!q) return true;
        return (
          i.issueTitle.toLowerCase().includes(q) ||
          i.responsibleAuthority.toLowerCase().includes(q) ||
          i.designatedPerson.toLowerCase().includes(q) ||
          (i.description || '').toLowerCase().includes(q)
        );
      });
    }
    return result;
  },
  distinct: async (field) => [...new Set(db.issues.map(i => i[field]).filter(Boolean))],
  create: async (data) => {
    const item = { _id: generateId(), actionSteps: [], requiredDocuments: [], ...data, createdAt: new Date() };
    db.issues.push(item);
    saveData();
    return item;
  },
  findByIdAndUpdate: async (id, update) => {
    const idx = db.issues.findIndex(i => String(i._id) === String(id));
    if (idx === -1) return null;
    db.issues[idx] = { ...db.issues[idx], ...update, updatedAt: new Date() };
    saveData();
    return db.issues[idx];
  },
  findByIdAndDelete: async (id) => {
    const idx = db.issues.findIndex(i => String(i._id) === String(id));
    if (idx === -1) return null;
    const deleted = db.issues.splice(idx, 1)[0];
    saveData();
    return deleted;
  },
  deleteMany: async () => { db.issues = []; saveData(); },
  insertMany: async (items) => {
    const mapped = items.map(item => ({ _id: generateId(), ...item, createdAt: new Date() }));
    db.issues.push(...mapped);
    saveData();
    return mapped;
  }
};

const UserStore = {
  findOne: async (filter) => {
    const user = db.users.find(u => u.email.toLowerCase() === filter.email.toLowerCase());
    if (!user) return null;
    return {
      ...user,
      comparePassword: async (candidatePassword) => bcrypt.compare(candidatePassword, user.password)
    };
  },
  findById: async (id) => {
    const user = db.users.find(u => String(u._id) === String(id));
    if (!user) return null;
    return {
      select: (fields) => {
        const { password, ...rest } = user;
        return rest;
      },
      ...user
    };
  },
  create: async (data) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const newUser = {
      _id: generateId(),
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      role: data.role || 'student',
      createdAt: new Date()
    };
    db.users.push(newUser);
    saveData();
    return newUser;
  }
};

module.exports = {
  RoomStore,
  FacultyStore,
  IssueStore,
  UserStore,
  isEmbedded: true
};
