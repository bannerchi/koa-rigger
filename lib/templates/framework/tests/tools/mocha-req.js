const path = require('path')
process.env.NODE_ENV = 'test';
const appRoot = path.join(__dirname, '../../');
require(appRoot + 'index.js');
require('./util').preload(appRoot + '/server', 'model');
