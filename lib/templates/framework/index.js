const cluster = require('cluster')
const app = require('./server/app')
const config = require('config')
// Code to run if we're in the master process or if we are not in debug mode/ running tests

if ((cluster.isMaster) &&
	(process.execArgv.indexOf('--debug') < 0) &&
	(process.env.NODE_ENV!=='test') && (process.env.NODE_ENV!=='development') &&
	(process.execArgv.indexOf('--singleProcess')<0)) {
	console.log('for real!');
	// Count the machine's CPUs
	var cpuCount = require('os').cpus().length;

	// Create a worker for each CPU
	for (var i = 0; i < cpuCount; i += 1) {
		console.log('forking ', i);
		cluster.fork();
	}

	// Listen for dying workers
	cluster.on('exit', function (worker) {
		// Replace the dead worker, we're not sentimental
		console.log('Worker ' + worker.id + ' died :(');
		cluster.fork();
	});

// Code to run if we're in a worker process
} else {
	app.listen(config.port)
}
