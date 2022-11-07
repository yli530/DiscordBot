const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: "List of all command",
    async execute(message, args, Client) {
        const newEmbed = new EmbedBuilder()
        .setColor('#99ccee')
        .setTitle('Help')
        .setDescription('List of all the commands');
        
        for(const command of Client.commands) {
            newEmbed.addFields({name: '-' + command[1].name, value: String(command[1].description), inline: true});
        }

        message.channel.send({embeds: [newEmbed]});
    }
}