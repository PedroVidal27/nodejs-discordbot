require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const { playMusic, MusicPlayer } = require("./music-player");

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildVoiceStates
	]
});

const player = new MusicPlayer();

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === "play") {
		
	}

	if (interaction.commandName === "leave") {
		const connection = getVoiceConnection(interaction.guildId);
		connection.disconnect();
	}
});

client.login(process.env.TOKEN);
