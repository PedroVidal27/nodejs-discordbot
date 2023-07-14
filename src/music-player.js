const ytdl = require("ytdl-core");
const { EmbedBuilder } = require("discord.js");
const { createAudioResource, joinVoiceChannel, createAudioPlayer, AudioPlayerStatus } = require("@discordjs/voice");

class MusicPlayer {
	constructor(client) {
		this.players = [];
		this.playlists = [];
		this.client = client;
	}

	debug = async (interaction) => {
		this.playNextMusic(interaction);
	};

	addToPlaylist = async (interaction) => {
		const playlistIndex = this.playlists.findIndex((playlist) => playlist.id === interaction.guildId);
		if (playlistIndex != -1) {
			const playlist = this.playlists[playlistIndex].playlist;
			const musicInfo = await ytdl.getInfo(interaction.options.get("youtube-link").value);
			playlist.push(interaction.options.get("youtube-link").value);
			const addMusicEmbed = new EmbedBuilder()
				.setTitle(musicInfo.videoDetails.title)
				.setThumbnail(musicInfo.videoDetails.thumbnails[0].url)
				.setDescription("Música Adicionada à Playlist")
				.setColor("#ffff00")
				.setFooter({
					text: "❤️"
				});
			interaction.reply({ embeds: [addMusicEmbed] });
			return;
		}
		this.playlists.push({
			playlist: [],
			id: interaction.guildId
		});
		this.addToPlaylist(interaction);
		return;
	};

	newPlayer = async (interaction) => {
		const playerIndex = this.players.findIndex((player) => player.id === guildId);
		//if we find the player, we don't need to create one
		if (playerIndex != -1) {
			return;
		}
		this.players.push({ player: createAudioPlayer(), id: interaction.guildId });
	};

	deletePlayer = async (guildId) => {
		const playerIndex = this.players.findIndex((player) => player.id === guildId);
		// if we can't find the player, we don't need to remove it
		if (playerIndex === -1) {
			return;
		}
		this.players.splice(playerIndex, 1);
	};

	playNextMusic = async (interaction, isAutoSkipping) => {
		const playerIndex = this.players.findIndex((player) => player.id === interaction.guildId);
		const playlistIndex = this.playlists.findIndex((playlist) => playlist.id === interaction.guildId);
		if (playerIndex === -1) {
			console.log("Player not found!");
			return;
		}
		if (playlistIndex === -1) {
			console.log("Playlist not found!");
			return;
		}
		const player = this.players[playerIndex].player;
		const playlist = this.playlists[playlistIndex].playlist;
		const nextMusic = playlist.pop();
		const musicInfo = await ytdl.getInfo(nextMusic);
		const nextMusicEmbed = new EmbedBuilder()
			.setTitle(musicInfo.videoDetails.title)
			.setThumbnail(musicInfo.videoDetails.thumbnails[0].url)
			.setDescription("Próxima Música da Playlist!")
			.setColor("#ffff00")
			.setFooter({
				text: "❤️"
			});
		const stream = await ytdl(nextMusic, { filter: "audioonly" });
		const resource = createAudioResource(stream, { seek: 0, volume: 1 });
		player.play(resource);
		if (isAutoSkipping) {
			const channel = await this.client.channels.fetch(interaction.channelId);
			channel.send({ embeds: [nextMusicEmbed] });
			return;
		}
		interaction.reply({ embeds: [nextMusicEmbed] });
		return;
	};

	playMusic = async (interaction) => {
		const playerIndex = this.players.findIndex((player) => player.id === interaction.guildId);
		if (playerIndex != -1) {
			const player = this.players[playerIndex].player;
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
				player.play(resource);
				const musicStartsEmbed = new EmbedBuilder()
					.setTitle(musicInfo.videoDetails.title)
					.setThumbnail(musicInfo.videoDetails.thumbnails[0].url)
					.setDescription("Música Iniciada!")
					.setColor("#ffff00")
					.setFooter({
						text: "❤️"
					});
				interaction.reply({ embeds: [musicStartsEmbed] });
				player.on("error", (error) => {
					console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
					player.play(getNextResource());
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

	buildPlayerEmbed = (musicInfo) => {
		const musicProgress = new EmbedBuilder()
			.setTitle(musicInfo.videoDetails.title)
			.setThumbnail(musicInfo.videoDetails.thumbnails[0].url)
			.setDescription("Música Adicionada!")
			.setColor("#ffff00")
			.setFooter({
				text: "❤️"
			});
		return musicProgress;
	};
}

module.exports = { MusicPlayer };
