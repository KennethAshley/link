const fs = require('fs');
const hasSettings = () => fs.existsSync('./auth.json');

const getSettings = () => {
  return new Promise((resolve, reject) => {
    if (hasSettings()) {
      settings = require('./auth.json');

      resolve(settings);
    } else {
      reject('no settings');
    }
  });
};

module.exports = {
  hasSettings,
  getSettings,
};
