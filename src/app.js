const libFs = require('fs');
const libPath = require('path');

const lodash = require('lodash');
const libEjs = require('ejs');
const Koa = require('koa');
const Router = require('koa-router');
const koaStatic = require('koa-static');
const koaLogger = require('koa-logger');

const storage = require('./lib/storage');
const tools = require('./lib/tools');

const DEFAULT_OPTIONS = {
	port: 3000,
	public_url: null,
	cache_templates: false
};

const CLIENT_DIR = libPath.resolve(__dirname, '../client');

function start(options = DEFAULT_OPTIONS) {
	options = lodash.merge({}, DEFAULT_OPTIONS, options);

	if (!options.public_url) {
		throw new Error(`PUBLIC_URL not provided, check your .env`);
	}

	if (!options.cache_templates) {
		console.error(`Warning: templates will not be cached`);
	}

	const app = new Koa();

	app.use(koaLogger());
	publicRouter(app, options);
	app.use(koaStatic(CLIENT_DIR));
	apiRouter(app, options);

	app.listen(options.port, () => {
		console.log(`Listening on ${options.port}`)
	});
}

function publicRouter(app, options) {
	const router = new Router({
		prefix: '/'
	});

	let indexTemplate = null;

	router.get('/', async (ctx, next) => {
		if (!indexTemplate) {
			const templateStr = await tools.readFileAsync(libPath.resolve(CLIENT_DIR, 'index.html.ejs'));
			indexTemplate = libEjs.compile(templateStr);
		}

		ctx.body = indexTemplate({
			publicUrl: options.public_url
		});

		if (!options.cache_templates) {
			indexTemplate = null;
		}
	});

	app.use(router.routes());
	app.use(router.allowedMethods());
}

function apiRouter(app, options) {
	const router = new Router({
		prefix: '/api'
	});

	router.get('/data', async (ctx, next) => {
		const data = await storage.loadData();
		ctx.body = data;
	});

	app.use(router.routes());
	app.use(router.allowedMethods());
}

module.exports = {
	start
};