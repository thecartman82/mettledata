const libFs = require('fs');
const libPath = require('path');

const libYaml = require('js-yaml');

const crypto = require('./crypto');
const tools = require('./tools');

const DATA_PATH = libPath.resolve(__dirname, '../../data/data.enc.json');
const MASTER_PATH = libPath.resolve(__dirname, '../../data/data.yaml');

async function loadDataJSON() {
	const jsonEncStr = await tools.readFileAsync(DATA_PATH);
	const jsonStr = crypto.decrypt(jsonEncStr);
	return jsonStr;
}

// TODO: Convert everything to async?
function loadDataSync() {
	const jsonEncStr = libFs.readFileSync(DATA_PATH, 'utf8');
	const jsonStr = crypto.decrypt(jsonEncStr);
	return JSON.parse(jsonStr);
}

function loadMasterSync() {
	const yaml = libFs.readFileSync(MASTER_PATH, 'utf8');
	return libYaml.safeLoad(yaml);
}

function writeDataSync(data) {
	const jsonStr = JSON.stringify(data);
	const jsonEncStr = crypto.encrypt(jsonStr);
	libFs.writeFileSync(DATA_PATH, jsonEncStr, 'utf8');
}

function writeMasterSync(data) {
	const yaml = libYaml.safeDump(data);
	libFs.writeFileSync(MASTER_PATH, yaml, 'utf8');
}

module.exports = {
	DATA_PATH,
	MASTER_PATH,

	loadDataJSON,
	loadDataSync,
	loadMasterSync,
	writeDataSync,
	writeMasterSync
};