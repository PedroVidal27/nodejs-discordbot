const { EmbedBuilder } = require("discord.js");
const { createAudioResource, joinVoiceChannel, createAudioPlayer, AudioPlayerStatus } = require("@discordjs/voice");

const { musicReactions } = require("./bot-reactions");
const { Music } = require("./music-domain");

class MusicPlayer {
	constructor(client) {
		this.players = [];
		this.client = client;
		this.music = new Music();
	}

	addToPlaylist = async (interaction) => {
		const playerIndex = this.players.findIndex((player) => player.id === interaction.guildId);
		if (playerIndex != -1) {
			const playlist = this.players[playerIndex].playlist;
			const musicInfo = await this.music.getInfo(interaction.options.get("url").value);
			playlist.push(interaction.options.get("url").value);
			const addMusicEmbed = new EmbedBuilder()
				.setTitle(musicInfo.title)
				.setThumbnail(musicInfo.thumbnailUrl)
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

	newPlayer = (interaction) => {
		const playerIndex = this.players.findIndex((player) => player.id === guildId);
		//if we find the player, we don't need to create one
		if (playerIndex != -1) {
			return;
		}
		this.players.push({ player: createAudioPlayer(), playlist: [], id: interaction.guildId, mode: "loop" });
	};

	deletePlayer = (interaction) => {
		const playerIndex = this.players.findIndex((player) => player.id === interaction.guildId);
		// if we can't find the player, we don't need to remove it
		if (playerIndex === -1) {
			return;
		}
		this.players.splice(playerIndex, 1);
	};

	changeMode = (interaction) => {
		const mode = interaction.options.get("mode").value;
		const playerIndex = this.players.findIndex((player) => player.id === interaction.guildId);
		this.players[playerIndex].mode = mode;
		if (mode === "linear") {
			const changeModeEmbed = new EmbedBuilder()
				.setTitle("A vida não é linear...")
				.setDescription(musicReactions.changeModeLinear[Math.floor(Math.random() * musicReactions.changeModeLinear.length)])
				.setColor("#ffff00")
				.setFooter({
					text: "┐(￣ヘ￣;)┌ "
				});
			interaction.reply({ embeds: [changeModeEmbed] });
		}
		if (mode === "loop") {
			const changeModeEmbed = new EmbedBuilder()
				.setTitle("Round n' Round")
				.setDescription(musicReactions.changeModeLoop[Math.floor(Math.random() * musicReactions.changeModeLoop.length)])
				.setColor("#ffff00")
				.setFooter({
					text: "(¬_¬)"
				});
			interaction.reply({ embeds: [changeModeEmbed] });
		}
		if (mode === "random") {
			const changeModeEmbed = new EmbedBuilder()
				.setTitle("RANDOOOOM!!!")
				.setDescription(musicReactions.changeModeLoop[Math.floor(Math.random() * musicReactions.changeModeLoop.length)])
				.setColor("#ffff00")
				.setFooter({
					text: "(｀ε´)"
				});
			interaction.reply({ embeds: [changeModeEmbed] });
		}
		return;
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
		if (this.players[playerIndex].mode === ("loop" || "random")) {
			playlist.push(currentMusic);
		}
		const musicInfo = await this.music.getInfo(nextMusic);
		const stream = await this.music.getStream(nextMusic);
		const resource = createAudioResource(stream.stream, {
            inputType: stream.type
        });
		player.play(resource);
		if (isAutoSkipping) {
			const channel = await this.client.channels.fetch(interaction.channelId);
			const nextMusicEmbed = new EmbedBuilder()
				.setTitle(musicInfo.title)
				.setThumbnail(musicInfo.thumbnailUrl)
				.setDescription(musicReactions.nextMusic[Math.floor(Math.random() * musicReactions.nextMusic.length)])
				.setColor("#ffff00")
				.setFooter({
					text: "(//ω//)"
				});
			channel.send({ embeds: [nextMusicEmbed] });
			return;
		}
		const skipEmbed = new EmbedBuilder()
			.setTitle(musicInfo.title)
			.setThumbnail(musicInfo.thumbnailUrl)
			.setDescription(musicReactions.skipMusic[Math.floor(Math.random() * musicReactions.skipMusic.length)])
			.setColor("#ffff00")
			.setFooter({
				text: "ヽ(｀⌒´メ)ノ"
			});
		interaction.reply({ embeds: [skipEmbed] });
		return;
	};

	playMusic = async (interaction) => {
		const musicInvalidEmbed = new EmbedBuilder()
								  .setTitle("Ei!!!")
								  .setDescription(musicReactions.invalidYoutubeURL[Math.floor(Math.random() * musicReactions.invalidYoutubeURL.length)])
								  .setColor("#ff0000")
								  .setFooter({text: "(ノ｀Д´)ノ彡┻━┻"});

		const invalidUrl = () => {
			interaction.reply({ embeds: [musicInvalidEmbed] });
			return;
		}

		const playerIndex = this.players.findIndex((player) => player.id === interaction.guildId);
		if (playerIndex != -1) {
			const player = this.players[playerIndex].player;
			const playlist = this.players[playerIndex].playlist;
			if (player.state.status === "playing") {
				if (!this.music.validateUrl(interaction.options.get("url").value)) invalidUrl();
				this.addToPlaylist(interaction);
				return;
			}
			if (player.state.status === "idle") {
				if (!this.music.validateUrl(interaction.options.get("url").value)) invalidUrl();
					const connection = joinVoiceChannel({
						channelId: interaction.member.voice.channel.id,
						guildId: interaction.guildId,
						adapterCreator: interaction.guild.voiceAdapterCreator
					});
					const musicInfo = await this.music.getInfo(interaction.options.get("url").value);
					const stream = await this.music.getStream(interaction.options.get("url").value);
					const resource = createAudioResource(stream.stream, {
						inputType: stream.type
					});
					playlist.push(interaction.options.get("url").value);
					player.play(resource);
					const musicStartsEmbed = new EmbedBuilder()
						.setTitle(musicInfo.title)
						.setThumbnail(musicInfo.thumbnailUrl)
						.setDescription(musicReactions.startMusic[Math.floor(Math.random() * musicReactions.startMusic.length)])
						.setColor("#ffff00")
						.setFooter({
							text: "(￣ε￣＠)"
						});
					interaction.reply({ embeds: [musicStartsEmbed] });
					player.on("error", (error) => {
						console.error(`Error: ${error}`);
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
