const Discord = require("discord.js")
const SlashCommands = require("../Handlers/slashCommands")
const config = require("../config")
const { ActivityType } = require("discord.js")

module.exports = async bot => {

await SlashCommands(bot)

    console.log(`${bot.user.tag} est bien en ligne`)
    console.log(`> [INVITE]: https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot%20applications.commands`)
    bot.user.setStatus('dnd');

    bot.user.setActivity("xvqh 🔪", {
      type: ActivityType.Competing,
      url : "https://twitch.tv/emilioottv"
    });
}