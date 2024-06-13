const play = require("play-dl");

class Music {
	constructor() {}

	getInfo = async (url) => {
		return await play.getInfo(url);
	};

	getStream = async (url) => {
		return await play(url, { filter: "audioonly" });
	};

	validateUrl = async (url) => {
		return await play.validate(url) === 'yt_video';
	};
}

module.exports = { Music };
