const Discord = require('discord.js');
const Bot = new Discord.Client();

Bot.login(process.env.BOT_TOKEN);

module.exports = (identifiers) => {
  return new Promise((resolve, reject) => {
    Bot.on('ready', () => {
      let guilds = Bot.guilds;
      let guild = guilds.find('name', 'Crypto Picks');
      let channels = identifiers.map(channel => {
        return guild.channels.find('id', channel);
      });

      if (channels && channels.length > 0) {
        resolve(channels);
      } else {
        reject('no channel');
      }
    });
  });
};
