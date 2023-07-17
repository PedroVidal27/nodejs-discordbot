const ytdl = require("ytdl-core");
const { EmbedBuilder } = require("discord.js");
const { createAudioResource, joinVoiceChannel, createAudioPlayer, AudioPlayerStatus } = require("@discordjs/voice");
const { musicReactions } = require("./bot-reactions");

class MusicPlayer {
	constructor(client) {
		this.players = [];
		this.client = client;
	}

	addToPlaylist = async (interaction) => {
		const playerIndex = this.players.findIndex((player) => player.id === interaction.guildId);
		if (playerIndex != -1) {
			const playlist = this.players[playerIndex].playlist;
			const musicInfo = await ytdl.getInfo(interaction.options.get("youtube-link").value);
			playlist.push(interaction.options.get("youtube-link").value);
			const addMusicEmbed = new EmbedBuilder()
				.setTitle(musicInfo.videoDetails.title)
				.setThumbnail(musicInfo.videoDetails.thumbnails[0].url)
				.setDescription(musicReactions.addMusic[Math.floor(Math.random() * musicReactions.addMusic.length)])
				.setColor("#ffff00")
				.setFooter({
					text: "(・`ω´・)"
				});
			interaction.reply({ embeds: [addMusicEmbed] });
			return;
		}
		this.newPlayer();
		this.addToPlaylist(interaction);
		return;
	};

	newPlayer = async (interaction) => {
		const playerIndex = this.players.findIndex((player) => player.id === guildId);
		//if we find the player, we don't need to create one
		if (playerIndex != -1) {
			return;
		}
		this.players.push({ player: createAudioPlayer(), playlist: [], id: interaction.guildId, mode: "linear" });
	};

	deletePlayer = async (interaction) => {
		const playerIndex = this.players.findIndex((player) => player.id === interaction.guildId);
		// if we can't find the player, we don't need to remove it
		if (playerIndex === -1) {
			return;
		}
		this.players.splice(playerIndex, 1);
	};

	playNextMusic = async (interaction, isAutoSkipping) => {
		const playerIndex = this.players.findIndex((player) => player.id === interaction.guildId);
		if (playerIndex === -1) {
			console.error("Player not found!");
			return;
		}
		const player = this.players[playerIndex].player;
		const playlist = this.players[playerIndex].playlist;
		const nextMusic = playlist[1];
		const currentMusic = playlist.shift();
		if (this.players[playerIndex].mode === "loop") {
			playlist.push(currentMusic);
		}
		const musicInfo = await ytdl.getInfo(nextMusic);
		const stream = await ytdl(nextMusic, { filter: "audioonly" });
		const resource = createAudioResource(stream, { seek: 0, volume: 1 });
		player.play(resource);
		if (isAutoSkipping) {
			const channel = await this.client.channels.fetch(interaction.channelId);
			const nextMusicEmbed = new EmbedBuilder()
				.setTitle(musicInfo.videoDetails.title)
				.setThumbnail(musicInfo.videoDetails.thumbnails[0].url)
				.setDescription(musicReactions.nextMusic[Math.floor(Math.random() * musicReactions.nextMusic.length)])
				.setColor("#ffff00")
				.setFooter({
					text: "(//ω//)"
				});
			channel.send({ embeds: [nextMusicEmbed] });
			return;
		}
		const skipEmbed = new EmbedBuilder()
			.setTitle(musicInfo.videoDetails.title)
			.setThumbnail(musicInfo.videoDetails.thumbnails[0].url)
			.setDescription(musicReactions.skipMusic[Math.floor(Math.random() * musicReactions.skipMusic.length)])
			.setColor("#ffff00")
			.setFooter({
				text: "ヽ(｀⌒´メ)ノ"
			});
		interaction.reply({ embeds: [skipEmbed] });
		return;
	};

	playMusic = async (interaction) => {
		const playerIndex = this.players.findIndex((player) => player.id === interaction.guildId);
		if (playerIndex != -1) {
			const player = this.players[playerIndex].player;
			const playlist = this.players[playerIndex].playlist;
			if (player.state.status === "playing") {
				this.addToPlaylist(interaction);
				return;
			}
			if (player.state.status === "idle") {
				const connection = joinVoiceChannel({
					channelId: interaction.member.voice.channel.id,
					guildId: interaction.guildId,
					adapterCreator: interaction.guild.voiceAdapterCreator
				});
				const musicInfo = await ytdl.getInfo(interaction.options.get("youtube-link").value);
				const stream = await ytdl(interaction.options.get("youtube-link").value, { filter: "audioonly" });
				const resource = createAudioResource(stream, { seek: 0, volume: 1 });
				playlist.push(interaction.options.get("youtube-link").value);
				player.play(resource);
				const musicStartsEmbed = new EmbedBuilder()
					.setTitle(musicInfo.videoDetails.title)
					.setThumbnail(musicInfo.videoDetails.thumbnails[0].url)
					.setDescription(musicReactions.startMusic[Math.floor(Math.random() * musicReactions.startMusic.length)])
					.setColor("#ffff00")
					.setFooter({
						text: "(￣ε￣＠)"
					});
				interaction.reply({ embeds: [musicStartsEmbed] });
				player.on("error", (error) => {
					console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
					this.playNextMusic(interaction, true);
				});
				player.on(AudioPlayerStatus.Idle, () => {
					this.playNextMusic(interaction, true);
				});
				connection.subscribe(player);
				return;
			}
			return;
		}
		this.newPlayer(interaction);
		this.playMusic(interaction);
	};
}

module.exports = { MusicPlayer };
