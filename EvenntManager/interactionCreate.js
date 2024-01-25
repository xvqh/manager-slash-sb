const Discord = require("discord.js")
const config = require("../config")
const fs = require("fs")

module.exports = async (bot, interaction) => {
        if (interaction.type === Discord.InteractionType.ApplicationCommand) {
            const command = bot.commands.get(interaction.commandName);
            if (command) {
                command.run(bot, interaction, interaction.options);
            } else {
                console.error(`Commande non trouvée: ${interaction.commandName}`);
            }
        }
    }