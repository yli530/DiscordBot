const { TwitterApi } = require('twitter-api-v2');
const { EmbedBuilder } = require('discord.js');
const { twtKey, twtSecret, accessTok, accessSecret} = require('../config.json');

module.exports = {
    name: "twtr",
    description: "search for a twitter user by their twitter username",
    async execute(message, args, Client) {
        if(args.length != 1) {
            return message.reply('twitter handles should be 1 word');
        }
        const twitterClient = new TwitterApi({
            appKey: twtKey,
            appSecret: twtSecret,
            accessToken: accessTok,
            accessSecret: accessSecret
        });

        for await(const handle of args) {
            const newEmbed = new EmbedBuilder().setColor('#1DA1F2');
            let user = undefined;
            if(handle.length < 16) {
                let temp = await twitterClient.v2.usersByUsernames(handle, {'user.fields': ['profile_image_url', 'description', 'public_metrics']});
                if(!temp.errors) {
                    user = temp.data[0];
                }
            }
            if(user) {
                newEmbed
                    .setAuthor({name: '@' + user.username})
                    .setTitle(user.name)
                    .setURL(`https://twitter.com/i/user/${user.id}`)
                    .addFields([
                        {name: 'Followers', value: String(user.public_metrics.followers_count), inline: true},
                        {name: '\u200B', value: '\u200B', inline:true},
                        {name: 'Tweets ', value: String(user.public_metrics.tweet_count), inline: true},
                        {name: '\u200B', value: '\u200B' },
                    ]);

                const Tweets = await twitterClient.v2.userTimeline(user.id, { exclude: ['replies', 'retweets'], max_results: 5, 'tweet.fields': 'created_at'});
                const last3Tweets = Tweets.tweets.slice(2);
                for(const tweet of last3Tweets) {
                    const tweetTime = parseDate(tweet.created_at);
                    const tweetText = tweet.text.substring(0,100) + '...'
                    newEmbed.addFields([{name: `<t:${tweetTime}:f>`, value: `[${tweetText}](https://twitter.com/i/web/status/${tweet.id})`}]);
                }
                await newEmbed.setThumbnail(user.profile_image_url);
                newEmbed.setTimestamp();
            } else {
                newEmbed.setTitle(`@${handle} can't be found`);
            }
            message.reply({embeds: [newEmbed]});
        }
    }
}

function parseDate(dateString) {
    //parse twitter date string format: yyyy-mm-ddThh-mm-ss.sssZ
    const date = new Date(dateString);
    return Math.floor(date.getTime() / 1000);
}