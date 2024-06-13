require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const commands = [
	{
		name: "play",
		description: "Se você me der a URL correta de um vídeo do YouTube, vou extrair o áudio e tocar a música para você.",
		options: [
			{
				name: "url",
				description: "URL do Youtube",
				type: ApplicationCommandOptionType.String,
				required: true
			}
		]
	},
	{
		name: "mode",
		description: "Posso alternar entre o modo linear e loop.",
		options: [
			{
				name: "mode",
				description: "Modo desejado",
				type: ApplicationCommandOptionType.String,
				choices: [
					{
						name: "linear",
						value: "linear"
					},
					{
						name: "loop",
						value: "loop"
					}
				],
				required: true
			}
		]
	},
	{
		name: "leave",
		description: "Hmpf!"
	},
	{
		name: "skip",
		description: "Vou pular a música pra você."
	}
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

const registerCommands = async () => {
	try {
		console.log("Registering commands...");
		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
		console.log("Commands Registered!");
	} catch (error) {
		console.error(`There was an error: ${error}`);
	}
};

module.exports = { registerCommands };
