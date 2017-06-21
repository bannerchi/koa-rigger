#!/usr/bin/env node
var program = require('commander');

program.parse(process.argv);

var scaffold = require('../lib/scaffold');

scaffold.addDocs();