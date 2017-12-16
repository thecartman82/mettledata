const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:/{[]} \t"\'\\/,._-0123456789';
// Decided by fair role of dice
const CYPHER = 'УΜфшгΔγуτμжαΨоΙьUтиδΟΕςηΒιНsцОЙхΡσюЦΦЫаΓСtВЧΩсυРЖΤЪЗοИябπχпнщлГΑКзλАΞϑΠερЛνβΣoLЩΖеΧБМψШвξФмωΗрёkэΥЕъПθΘТчйЮЁЬЯДыдΝκζΚХφΛкЭe';

const ENC_TABLE = {};
const DEC_TABLE = {};

for (let i = 0; i < ALPHABET.length; i++) {
	ENC_TABLE[ALPHABET[i]] = CYPHER[i];
	DEC_TABLE[CYPHER[i]] = ALPHABET[i];
}

function convert(str, table) {
	const res = [];
	for (let i = 0; i < str.length; i++) {
		const char = str[i];
		res.push(table[char] || char);
	}
	return res.join('');
}

function encrypt(str) {
	return convert(str, ENC_TABLE);
}

function decrypt(str) {
	return convert(str, DEC_TABLE);
}

module.exports = {
	encrypt,
	decrypt
};