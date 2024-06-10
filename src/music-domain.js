const play = require("play-dl");

class Music {
	constructor() {}

	getInfo = async (url) => {
		return await play.getInfo(url);
	};

	getStream = async (url) => {
		return await play(url, { filter: "audioonly" });
	};

	validateUrl = (url) => {
		return play.validateURL(url);
	};
}

module.exports = { Music };
