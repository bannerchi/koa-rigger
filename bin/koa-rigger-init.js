#!/usr/bin/env node
var program = require('commander'),
	chalk = require('chalk');

program.parse(process.argv);
var names = program.args;

if (!names.length) {
	console.error(chalk.red('name required'));
	process.exit(1);
}
if (names.length > 1) {
	console.error(chalk.red('only one name required'));
	process.exit(1);
}
var scaffold = require('../lib/scaffold');

scaffold.init(names[0]);