const ytdl = require("ytdl-core");
const { createAudioResource, joinVoiceChannel, createAudioPlayer, AudioPlayerStatus } = require("@discordjs/voice");

class MusicPlayer {
	constructor() {
		this.playerList = [];
	}

	debug = async (guildId) => {
		const playerIndex = this.playerList.findIndex((player) => player.guildId === guildId);
		console.log(this.playerList[playerIndex]);
	};

	newPlayer = async (guildId) => {
		const playerIndex = this.playerList.findIndex((player) => player.guildId === guildId);
		//if we find the player, we don't need to create one
		if (playerIndex != -1) {
			return;
		}
		this.playerList.push(createAudioPlayer());
	};

	deletePlayer = async (guildId) => {
		const playerIndex = this.playerList.findIndex((player) => player.guildId === guildId);
		// if we can't find the player, we don't need to remove it
		if (playerIndex === -1) {
			return;
		}
		this.playerList.splice(playerIndex, 1);
	};

	playMusic = async (client, interaction) => {
		const guildId = client.guildId;
		const playerIndex = this.playerList.findIndex((player) => player.guildId === guildId);
		if (playerIndex != -1) {
			const player = this.playerList[playerIndex].player;
			const guild = await client.guilds.fetch(guildId);
			console.log(guild);
			const guildMember = await guild.members.fetch(interaction.user.id);
			const connection = joinVoiceChannel({
				channelId: guildMember.voice.channelId,
				guildId: guildId,
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

			player.on(AudioPlayerStatus.Playing, () => {
				console.log("Playing!");
				return;
			});
			player.on(AudioPlayerStatus.Idle, async () => {
				console.log("Not playing");
				const guild = await client.guilds.fetch(interaction.guildId);
				const guildMember = await guild.members.fetch(interaction.user.id);
				const connection = joinVoiceChannel({
					channelId: guildMember.voice.channelId,
					guildId: guildId,
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
			});
			return;
		}
		this.newPlayer(guildId);
		this.playMusic(client, interaction);
	};

	addToPlaylist = async (interaction) => {};
}

module.exports = { MusicPlayer };
