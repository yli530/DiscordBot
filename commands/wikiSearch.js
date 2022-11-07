const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ws',
    description: 'Search wikipedia for the top 5 most relevant pages',
    async execute(message, args, Client) {
        if(args.length == 0) {
            return message.reply('You need to specify what to search')
        }
        const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
        const newEmbed = new EmbedBuilder().setColor('Aqua');
        const searchQuery = args.join(' ');
        newEmbed.setTitle("Search results for: " + searchQuery);
        const data = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=5&srsearch=${searchQuery}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                for(const result of data.query.search) {
                    const summaryString = result.snippet.replace(/\<[\s\S]*?\>/g, "");
                    summaryString.slice(0, (summaryString.length > 100) ? 100 : summaryString.length);
                    newEmbed
                        .addFields({name: result.title, value: `[${summaryString}](http://en.wikipedia.org/?curid=${result.pageid})`});
                }
                return data;
            })
            .then((data) => {
                if(data.query.search.length > 0) {
                    message.reply({embeds: [newEmbed]})
                } else {
                    newEmbed.addFields({name: 'No results found', value: '\u200B'});
                    message.reply({embeds: [newEmbed]})
                }
                return data;
            })
            .catch((error) => console.log(error));
    }
}