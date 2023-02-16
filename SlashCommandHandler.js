const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log(`Recarregando ${commands.length} comandos em slash.`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Recarregados ${data.length} comandos em slash.`);
	} catch (error) {
		console.error(error);
	}
})();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFile = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFile) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log("algum comando deu erro")
    }
}

client.on(Events.InteractionCreate, interaction => {
    if(!interaction.isChatInputCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);
    

    if(!command){
        console.error('Sem comandos na pasta')
        return;
    }

    try{
        command.execute(interaction);
    } catch (error){
        console.error(error)
        interaction.reply({content: 'O Bot teve algum erro'})
    }
})
