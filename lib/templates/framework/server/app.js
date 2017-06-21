const path = require('path')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const koaStatic = require('koa-static')
const koaLogger = require('koa-logger')
const config = require('config')
const koaSwagger = require('koa2-swagger-ui')

const routers = require('./routes/index')

const app = new Koa();

// log middleware
app.use(koaLogger());

// ctx.body parse middleware
app.use(bodyParser());

// static middleware
app.use(koaStatic(
	path.join(__dirname, './../static')
));

app.use(routers.routes()).use(routers.allowedMethods());

// swagger docs
app.use(koaSwagger({
	swaggerOptions: {
		url: config.baseUrl + ':' + config.port + '/swagger.json' // example path to json
	}
}));

// error handler
app.on('error', (err, ctx) => {
	console.error(err)
});
module.exports = app;
console.log(` server is start at port ${config.port}`);

