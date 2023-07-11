const ytdl = require("ytdl-core");
const { createAudioResource, joinVoiceChannel, createAudioPlayer } = require("@discordjs/voice");

class MusicPlayer {
	constructor() {
		playerList = [];
	}

	newPlayer = async (guildId) => {
		const playerIndex = playerList.findIndex((player) => player.playerId === interaction.guildId);
		if (playerIndex != undefined) {
			playerList.push({
				player: createAudioPlayer(),
				playerId: guildId
			});
			return;
		}
		playerList[playerIndex] = {
			player: createAudioPlayer(),
			playerId: guildId
		};
	};

	playMusic = async (interaction) => {
		const playerIndex = playerList.findIndex((player) => player.playerId === interaction.guildId);
		if (playerIndex != undefined) {
			if (playerList[playerIndex].state.status === "playing") {
				//add to playlist
				return;
			}
		}
		const guild = await client.guilds.fetch(interaction.guildId);
		const guildMember = await guild.members.fetch(interaction.user.id);
		const connection = joinVoiceChannel({
			channelId: guildMember.voice.channelId,
			guildId: interaction.guildId,
			adapterCreator: guild.voiceAdapterCreator
		});
		const stream = await ytdl(interaction.options.get("youtube-link").value, { filter: "audioonly" });
		const resource = createAudioResource(stream, { seek: 0, volume: 1 });
		player.play(resource);
		player.on("error", (error) => {
			console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
			player.play(getNextResource());
		});
		connection.subscribe(player);
	};
}

module.exports = { MusicPlayer };
