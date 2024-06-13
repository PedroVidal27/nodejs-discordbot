const play = require("play-dl");

class Music {
	constructor() {}

	getInfo = async (url) => {
		const videoInfo = await play.video_info(url);
		const myInfo = {
			thumbnailUrl: videoInfo.video_details.thumbnails[0].url,
			title: videoInfo.video_details.title
		}
		return myInfo
	};

	getStream = async (url) => {
		const stream = await play.stream(url);
		return {
			stream: stream.stream,
			type: stream.type
		};
	};

	validateUrl = async (url) => {
		return await play.validate(url) === 'yt_video';
	};
}

module.exports = { Music };
