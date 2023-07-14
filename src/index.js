require("dotenv").config();
const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
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

const music = new MusicPlayer(client);
const musicProgress = new EmbedBuilder()
	.setTitle("Música!")
	.setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhtLA6Pz4nNbkTG3WrDrWFfp3BEmhL3kadFEmtauw64w&s")
	.setDescription("Lallala teste")
	.setColor("#ff0000")
	.setFooter({
		text: "Himari!",
		iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhtLA6Pz4nNbkTG3WrDrWFfp3BEmhL3kadFEmtauw64w&s"
	});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === "play") {
		music.playMusic(interaction);
	}

	if (interaction.commandName === "leave") {
		music.debug(interaction);
	}

	if (interaction.commandName === "skip") {
		music.playNextMusic(interaction, false);
	}
});

client.login(process.env.TOKEN);
