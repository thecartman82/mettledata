const libFs = require('fs');
const libPath = require('path');

const lodash = require('lodash');
const libEjs = require('ejs');
const Koa = require('koa');
const Router = require('koa-router');
const koaStatic = require('koa-static');
const koaLogger = require('koa-logger');
const koaLess = require('koa-less');

const storage = require('./lib/storage');
const tools = require('./lib/tools');

const DEFAULT_OPTIONS = {
	port: 3000,
	public_url: null,
	enable_cache: false
};

const CLIENT_DIR = libPath.resolve(__dirname, '../client');

function start(options = DEFAULT_OPTIONS) {
	options = lodash.merge({}, DEFAULT_OPTIONS, options);

	if (!options.public_url) {
		throw new Error(`PUBLIC_URL not provided, check your .env`);
	}

	if (!options.enable_cache) {
		console.error(`Warning: data and templates will not be cached`);
	}

	const app = new Koa();

	app.use(koaLogger());

	initRouter(app, options);

	app.use(koaLess(CLIENT_DIR, {
		force: !options.enable_cache
	}));
	app.use(koaStatic(CLIENT_DIR));

	app.listen(options.port, () => {
		console.log(`Listening on ${options.port}`)
	});
}

function initRouter(app, options) {
	const router = new Router({
		prefix: '/'
	});

	const _cache = options.cache_templates ? {} : null;

	router.get('/', async (ctx, next) => {
		let indexTemplate = _cache && _cache.indexTemplate;
		if (!indexTemplate) {
			const templateStr = await tools.readFileAsync(libPath.resolve(CLIENT_DIR, 'index.html.ejs'));
			indexTemplate = libEjs.compile(templateStr);
			if (_cache) {
				_cache.indexTemplate = indexTemplate;
			}
		}

		let data = _cache && _cache.data;
		if (!data) {
			data = JSON.stringify(await storage.loadDataJSON());
			if (_cache) {
				_cache.data = data;
			}
		}

		ctx.body = indexTemplate({
			publicUrl: options.public_url,
			dataJSON: data
		});
	});

	app.use(router.routes());
	app.use(router.allowedMethods());
}

module.exports = {
	start
};