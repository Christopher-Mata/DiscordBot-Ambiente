// Allowes for Env var
require("dotenv").config();

// Discord.js Libraries that are needed
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v10");
const {Client, GatewayIntentBits, Collection} = require("discord.js");
const {Player} = require("discord-player");

// Node.js packages that are needed one for file the other for path
// Loads all the commands from the command folder
const fs = require("node:fs");
const path = require("node:path");

// Discord Client for bot
const client = new Client({
    intents: [GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildVoiceStates]
})

// List of all commands
const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for(const file of commandFiles)
{
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// Add the player on the client
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

client.on("ready", () => {

    // Set the client user's presence
    client.user.setPresence({ 
        status: 'online', 
        activities: [
            { 
                name: 'Great Music! \uD83D\uDD18' 
            }
        ], 
    });

    // Get all ids of the servers
    const guild_ids = client.guilds.cache.map(guild => guild.id);


    const rest = new REST({version: '9'}).setToken(process.env.TOKEN);
    for (const guildId of guild_ids)
    {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), 
            {body: commands})
        .then(() => console.log('Successfully updated commands for guild ' + guildId))
        .catch(console.error);
    }
});

client.on("interactionCreate", async interaction => {
   
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try
    {
        await command.execute({client, interaction});
    }
    catch(error)
    {
        console.error(error);
        await interaction.reply({content: "There was an error executing this command"});
    }
});

client.login(process.env.TOKEN);