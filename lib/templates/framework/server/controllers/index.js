const config = require('config');

module.exports = async (ctx) => {
	const title = {
		apiName: config.apiName,
		version: config.version
	};
	ctx.body = {
		title
	}
};