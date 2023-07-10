require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const fs = require("fs");
const ytdl = require("ytdl-core");
const { join } = require("node:path");
const { getVoiceConnection, createAudioResource, joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior } = require("@discordjs/voice");

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildVoiceStates
	]
});

const player = createAudioPlayer();

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === "play") {
		const guild = await client.guilds.fetch(interaction.guildId);
		const guildMember = await guild.members.fetch(interaction.user.id);
		const connection = joinVoiceChannel({
			channelId: guildMember.voice.channelId,
			guildId: interaction.guildId,
			adapterCreator: guild.voiceAdapterCreator
		});
		const stream = await ytdl(interaction.options.get("youtube-link").value, { filter: "audioonly" });
		const resource = createAudioResource(stream, { seek: 0, volume: 1 });
		console.log(resource);
		player.play(resource);
		player.on("error", (error) => {
			console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
			player.play(getNextResource());
		});
		connection.subscribe(player);
	}

	if (interaction.commandName === "leave") {
		const connection = getVoiceConnection(interaction.guildId);
		connection.disconnect();
	}
});

client.login(process.env.TOKEN);
