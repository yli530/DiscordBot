const ytSearch = require('yt-search');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'yts',
    description: "Search yt for relevant video",
    async execute(message, args, Client) {
        if(args.length < 1) {
            return message.reply('Need arguments')
        } else {
            const searchTerm = args.join(' ');
            const results = await ytSearch(searchTerm);
            const newEmbed = new EmbedBuilder()
                .setColor('#99ccee')
                .setTitle('Youtube Search')
                .setDescription(`Youtube search results for \"${searchTerm}\"`);

            const topFive = results.videos.slice(0, ((results.videos.length > 5) ? 5 : results.videos.length));
            if(topFive.length > 0) {
                for(const result of topFive) {
                    newEmbed.addFields({name: `${result.title}`, value: `views: ${result.views} \n url: ${result.url}`});
                }
                newEmbed.setThumbnail(topFive[0].thumbnail);
            } else {
                newEmbed.setDescription(`No results for \"${searchTerm}\"`)
            }
            message.reply({embeds: [newEmbed]});
        }
    }
}