'use strict';

require('shelljs/global');

var fs = require('fs'),
	shell = require('shelljs'),
	chalk = require('chalk'),
	Alphabet = require('alphabetjs');

var data = {};

function capitaliseFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function camelCase(str) {
	var parts = str.split(/[\-_ \s]/);
	if(parts.length > 1) {
		str = str.toLowerCase();
		str = null;
		for (var i = 0; i < parts.length; i++) {
			str = (str ? str + capitaliseFirstLetter(parts[i]) : parts[i]);
		}
	}
	else {
		// Enforce lowerCamelCase if UpperCamelCase is input
		str = str.charAt(0).toLowerCase() + str.slice(1);
	}
	return str;
}

/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */
function write(path, str) {
	fs.writeFile(path, str);
	console.log(chalk.cyan('   create:'), path);
}

/**
 * Read template files
 *
 * @param {String} path
 */
function readTemplate(path) {
	var template = fs.readFileSync(__dirname + '/templates/' + path, 'utf8');
	for (var index in data) {
		template = template.split('__' + index + '__').join(data[index]);
	}
	return template;
}

function scanHumanFiles(is_write_csv){
	var pkg = require(process.cwd() + '/package.json');

	var root = './server';
	var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
	var all_paths = readDir(root,[]);
	is_write_csv = is_write_csv || false;

	var repeat_error = false;

	var all_rows = '';
	var tmp_code = [];
	for (var i in all_paths){
		var js_file = fs.readFileSync(all_paths[i], 'utf8');
		//var arr_errors = js_file.match(/error:\{[^\b]*?\}/g);
		var arr_code = js_file.match(/code\s?\:\s?\d+/g);
		var arr_code_msg = js_file.match(/code\s?\:\s?\d+\,[\n|\t|\s]*msg\s?\:\s?[^\b]*?\}/g);

		if(arr_code && arr_code_msg){
			for(var j in arr_code_msg){
				if(arr_code_msg[j].indexOf(arr_code[j]) !== -1){
					var line = null;
					var err_msg = arr_code_msg[j].replace(/\n|\t/g, "").replace("}", "");
					if(tmp_code.toString().indexOf(arr_code[j]) === -1){
						tmp_code.push(arr_code[j]);

						var command = "grep -n " + '"' + arr_code[j] + '" ' + all_paths[i];
						var out_line = exec(command, {silent:true}).stdout;
						out_line = out_line.replace(/\s/g, "");
						var arr_out_line = out_line.split(":");
						line = arr_out_line[0];
					} else {
						repeat_error = true;
						console.log(chalk.yellow.bold("You code: ") + chalk.red.bold(arr_code[j]) + chalk.yellow.bold(" is repeat, please change it"));
					}
					console.log(chalk.cyan(all_paths[i] + " line:" + line));
					console.log(chalk.red("error message:" + err_msg + "\n"));

					all_rows += all_paths[i] + " line:" + line + ';' + err_msg + '\n';
				}
			}

		}
	}

	if(is_write_csv === true){
		if(repeat_error){
			return console.log(chalk.red.bold("Csv save fail,because you have repeat code in you program,please change them and try again."));
		}
		fs.writeFile(homeDir + "/" + pkg.name +'_sec.csv', all_rows, {flag:'a', encoding:'utf8'}, function(err){
			if (err) {
				console.log(chalk.red(err.stack));
			} else {
				console.log(chalk.green("csv saved ! please open ~/"+pkg.name+"_sec.csv"));
			}

		});
	}
}
/**
 * fetch all js files
 * @param path
 * @param arr
 * @returns {*}
 */
function readDir(path, arr){
	var all_files = fs.readdirSync(path);
	for (var i in all_files){
		if(all_files[i].indexOf(".js") === -1){
			var first_leaf = path + '/'+ all_files[i];
			readDir(first_leaf, arr);
		} else {
			arr.push(path + '/' + all_files[i]);
		}
	}
	return arr;
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */
function mkdir(path, fn) {
	shell.mkdir('-p', path);
	shell.chmod(755, path);
	console.log(chalk.cyan('   create:'), path);
	if (fn) fn();
}

function buildDirectoryStructure() {
	var serverPath = './server';
    var name = data.name;
	mkdir(serverPath);
	mkdir(serverPath + '/controllers', function() {
		write(serverPath + '/controllers/' + name + 'Controller.js', readTemplate('controller.js'));
	});

	mkdir(serverPath + '/routes', function() {
		write(serverPath + '/routes/route.js', readTemplate('routes.js'));
	});

	mkdir(serverPath + '/models');

	mkdir(serverPath + '/models/resource');

	mkdir(serverPath + '/models/resourceAdapter', function () {
		write(serverPath + '/models/resourceAdapter/adapterFactory.js', readTemplate('adapterFactory.js'))
	});

	mkdir(serverPath + '/models/resourceAdapter/adapter');

}

function init(name) {
	cp('-R', __dirname + '/templates/framework', './' + name);

	console.log(chalk.cyan(Alphabet("KOA2",'stereo')));
	console.log(chalk.cyan.bold("Build you project success, enjoy it!"));
	console.log(chalk.blue("Don't forget run `npm install`"));
}

exports.packages = function(name, options) {

	var pkg = require(process.cwd() + '/package.json');
	var camelName = camelCase(name);

	data = {
		pkgName: name,
		name: camelName,
		class: capitaliseFirstLetter(camelName),
		author: (typeof options.author === 'string' ? options.author : 'vidaxl'),
		version:  pkg.version
	};

	console.log(chalk.blue.bold('Start to auto create you project, enjoy it'));

	buildDirectoryStructure();
};

exports.addDocs = function(){
	mkdir('./docs', function(){
		write('./docs/services.js', readTemplate('services.js'));
		write('./docs/models.js', readTemplate('models.js'));
	});
};

exports.scanAllErrorCode = function(is_write_csv){
	scanHumanFiles(is_write_csv);
};

exports.init = function(name){
		init(name);
};