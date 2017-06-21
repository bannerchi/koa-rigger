#!/usr/bin/env node
var program = require('commander');

var pkg = require('../package.json');

program
	.version(pkg.version)
	.command('docs', 'Add api docs in your project')
	.command('init [name]', 'Init your project, Create a new project')
	.parse(process.argv);
