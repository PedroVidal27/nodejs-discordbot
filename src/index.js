require("dotenv").config();
const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
const { MusicPlayer } = require("./music-player");
const { getVoiceConnection } = require("@discordjs/voice");
const { musicReactions } = require("./bot-reactions");

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildVoiceStates
	]
});

const music = new MusicPlayer(client);

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === "play") {
		music.playMusic(interaction);
	}

	if (interaction.commandName === "leave") {
		music.deletePlayer(interaction);
		const connection = getVoiceConnection(interaction.guildId);
		if (connection) {
			connection.destroy();
			const leaveVoiceChannelEmbed = new EmbedBuilder()
				.setTitle("Hmpf!")
				.setThumbnail(musicInfo.videoDetails.thumbnails[0].url)
				.setDescription(musicReactions.leave[Math.floor(Math.random() * musicReactions.leave.length)])
				.setColor("#ffff00")
				.setFooter({
					text: "ヽ(｀Д´)ﾉ"
				});
			interaction.reply({ embeds: [leaveVoiceChannelEmbed] });
		}
	}

	if (interaction.commandName === "skip") {
		music.playNextMusic(interaction, false);
	}
});

client.login(process.env.TOKEN);
