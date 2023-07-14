require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const commands = [
	{
		name: "play",
		description: "Play music from YouTube!",
		options: [
			{
				name: "youtube-link",
				description: "YouTube link",
				type: ApplicationCommandOptionType.String,
				required: true
			}
		]
	},
	{
		name: "leave",
		description: "Bye bye!"
	},
	{
		name: "skip",
		description: "Skip to the next music!"
	}
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
	try {
		console.log("Registering commands...");
		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
		console.log("Commands Registered!");
	} catch (error) {
		console.error(`There was an error: ${error}`);
	}
})();
