const ytdl = require("ytdl-core");

class Music {
	constructor() {}

	getInfo = async (url) => {
		return await ytdl.getInfo(url);
	};

	getStream = async (url) => {
		return await ytdl(url, { filter: "audioonly" });
	};

	validateUrl = (url) => {
		return ytdl.validateURL(url);
	};
}

module.exports = { Music };
