const libFs = require('fs');

async function readFileAsync(path) {
	return new Promise((resolve, reject) => {
		libFs.readFile(path, 'utf8', (err, str) => {
			if (err) {
				return reject(err);
			}

			return resolve(str);
		});
	});
}

module.exports = {
	readFileAsync
};