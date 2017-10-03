const Discord = require('discord.js');
const embed = new Discord.RichEmbed();
const client = new Discord.Client();
const prompt = require('./prompt');
const jsonfile = require('jsonfile');
const auth = require('./auth.js');

let settings;
let recipient;

const promptUser = () => {
  prompt().then((result) => {
    if (result.save) {
      jsonfile.writeFileSync('./auth.json', result, {spaces: 2})
    }

    return result;
  }).then((result) => {
    recipient = result.recipient;
    client.login(result.token);

    doDaThang();
  });
};

const getMessage = (message) => {
  if (message.channel.id !== recipient) {
    embed.setColor(0x00AE86);

    if (message.content) {
      embed.setDescription(message.content);
    }

    if (message.author) {
      embed.setAuthor(message.author.username, message.author.avatarURL);
    }

    if (message.attachments.array().length > 0) {
      message.attachments.every(attachement => {
        embed.setImage(attachement.url);
      });
    }

    client.channels.get(recipient).send({embed});
  }
};

const doDaThang = () => {
  client.on('message', getMessage);
  client.on('ready', () => {
    console.log('😉');
  });
};

const shazam = () => {
  if (auth.hasSettings()) {
    auth.getSettings().then(settings => {
      recipient = settings.recipient;
      client.login(settings.token);

      doDaThang();
    });

  } else {
    promptUser();
  }
};

shazam();
