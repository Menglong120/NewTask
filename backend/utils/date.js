const moment = require('moment');

const getCurrentDate = () => {
    return moment().format('YYYY-MM-DD HH:mm:ss');
};

module.exports = { getCurrentDate };