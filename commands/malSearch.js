const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { EmbedBuilder } = require('discord.js');
const {malClient} = require('../config.json');
const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];


module.exports = {
    name: 'mal',
    description: 'Search MAL for anime',
    async execute(message, args, Client) {
        console.log(args);
        if(args.length < 2) {
            return message.reply('You need more arguments');
        }
        const type = args[0].toLowerCase();
        if(type != 'anime' && type != 'manga') {
            return message.reply("Argument 1 needs to specify {anime} or {manga}");
        }

        //Send a request
        const query = args.slice(1, args.length).join(' ');;
        const body = await fetch(`https://api.myanimelist.net/v2/${type}?q=${query}&limit=5`, {
            headers: {'X-MAL-CLIENT-ID': malClient}
        })
        const json = await body.json();
        const data = json.data;

        //putting data in embed
        const newEmbed = new EmbedBuilder().setColor('Blue');
        newEmbed.setTitle(`MAL Search Results for ${query}`);
        let counter = 0;
        data.forEach(element => {
            newEmbed.addFields({name: reactions[counter++] + element.node.title, value: `[Link](https://myanimelist.net/${type}/${element.node.id})`});
        });
        if(data.length == 0) {
            newEmbed.setDescription("None found");
        }

        //adding reactions to embed
        const reply = await message.reply({embeds: [newEmbed]});
        for(let i = 0; i < data.length; i++) {
            reply.react(reactions[i]);
        }

        const filter = (reaction, user) => {
            return reactions.includes(reaction.emoji.name) && user.id === message.author.id;
        }

        const editedEmbed = new EmbedBuilder().setColor('Red');
        
        const index = await reply.awaitReactions({filter, max: 1, time: 30000, errors: ['time']})
            .then(collected => {
                const index = reactions.indexOf(collected.first().emoji.name);
                return index;
            }).catch(error => {
                console.log("time ran out");
                return -1;
            })

        if(index == -1) return;
        editedEmbed
            .setTitle(data[index].node.title)
            .setAuthor({name: 'Click me for mal page', url: `https://myanimelist.net/${type}/${data[index].node.id}`, color: 'blue'})
            .setImage(data[index].node.main_picture.medium);

        reply.edit({embeds:[editedEmbed]});
    }
}