const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins();
const NotifySend = require('node-notifier').NotifySend;

var defaultTasks = ['devServe', 'watch'];

gulp.task('env:development', function () {
	process.env.NODE_ENV = 'development';
});

gulp.task('devServe', ['env:development'], function () {
	plugins.nodemon({
		script: 'index.js',
		ext: 'html js',
		env: {'NODE_ENV': 'development'},
		ignore: ['node_modules/', 'logs/', '.DS_Store', '**/.DS_Store'],
		nodeArgs: ['--inspect'],
		stdout: false
	}).on('readable', function () {
		this.stdout.on('data', function (chunk) {
			if (/Mean app started/.test(chunk)) {
				setTimeout(function () {
					plugins.livereload.reload();
				}, 500);
			}
			process.stdout.write(chunk);
		});
		this.stderr.pipe(process.stderr);
	}).on('restart', function () {
		var notifier = new NotifySend();
		notifier.notify({
			title: 'koa2-backend',
			message: 'system loading success!',
			time: 2
		});
	});
});

gulp.task('watch', function () {
	plugins.livereload.listen({interval: 500});
});

gulp.task('development', defaultTasks);
