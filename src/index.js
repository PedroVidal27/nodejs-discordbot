require("dotenv").config();
const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

const { musicReactions } = require("./bot-reactions");
const { registerCommands } = require("./register-commands");
const { MusicPlayer } = require("./music-player");

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

registerCommands();

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === "play") {
		music.playMusic(interaction);
	}

	if (interaction.commandName === "mode") {
		music.changeMode(interaction);
	}

	if (interaction.commandName === "leave") {
		music.deletePlayer(interaction);
		const connection = getVoiceConnection(interaction.guildId);
		if (connection) {
			connection.destroy();
			const leaveVoiceChannelEmbed = new EmbedBuilder()
				.setTitle("Hmpf!")
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

	if (interaction.commandName === "leaveAllServers") {
		const guilds = await client.guilds.fetch(); // Fetch all guilds the bot is a member of
		guilds.forEach(async (guild) => {
			try {
				const guildLeave = await client.guilds.fetch(guild.id);
				console.log(guildLeave);
				await guildLeave.leave();
			} catch (error) {
				console.error(`Failed to leave guild: ${guild.name}`, error);
			}
		});
	}
});

client.login(process.env.TOKEN);
