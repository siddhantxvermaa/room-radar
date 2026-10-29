const mongoose = require('mongoose');
const embedded = require('../config/embeddedStore');

let useMongo = false;

function setUseMongo(val) {
  useMongo = val;
}

const getModels = () => {
  if (useMongo && mongoose.connection.readyState === 1) {
    return {
      Room: require('./Room'),
      Faculty: require('./Faculty'),
      IssueRule: require('./IssueRule'),
      User: require('./User'),
      isEmbedded: false
    };
  } else {
    return {
      Room: embedded.RoomStore,
      Faculty: embedded.FacultyStore,
      IssueRule: embedded.IssueStore,
      User: embedded.UserStore,
      isEmbedded: true
    };
  }
};

module.exports = {
  getModels,
  setUseMongo
};
