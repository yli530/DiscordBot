const { 
    Client,
    Collection,
    GatewayIntentBits
} = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions
    ],
    restTimeOffset: 0
});
const prefix = '-';
const commandFiles = fs.readdirSync('./commands');
let commandList = [];

client.commands = new Collection();
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
    commandList.push(command.name);
}

client.music = undefined;

client.once('ready', () => {
    console.log("bot online");
})

client.on("messageCreate", async message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(commandList.includes(command)) {
        client.commands.get(command).execute(message, args, client);
    } else {
        message.reply(`no such command: ${command}`);
    }
});

client.login(token);