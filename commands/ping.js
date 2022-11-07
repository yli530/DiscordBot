module.exports = {
    name: 'ping',
    description: "Ping Pong",
    async execute(message, args, Client) {
        return message.reply("pong");
    }
}