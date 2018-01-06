require('dotenv').config();

const Discord = require('discord.js');
const User = new Discord.Client();
const jsonfile = require('jsonfile');
const Bot = require('./Bot');
const channelMap = require('./testChannels.json');
const _ = require('lodash');

let recipients = [];
let userSearch = /\<(.*?)\>/g;

const getMessage = (message) => {
  let hasMentions = message.mentions.users.array().length > 0;

  const embed = new Discord.RichEmbed();
  let recipientId = channelMap[message.channel.id];

  if (message.author.bot) return;

  embed.setColor(0x00AE86);

  if (message.content && hasMentions) {
    let newContent = message.content.replace(userSearch, (match, offset, string) => {
      let username = message.mentions.users.find('id', offset.substring(1)).username;

      return `**@${username}**`;
    });

    embed.setDescription(newContent);

  } else {
    embed.setDescription(message.content);
  }

  if (message.author) {
    embed.setAuthor(message.author.username, message.author.avatarURL);
  }

  if (message.attachments && message.attachments.array().length > 0) {
    message.attachments.every(attachment => {
      embed.setImage(attachment.url);
    });
  }

  recipients.forEach(recipient => {
    if (recipientId == recipient.id) {
      recipient.send({embed})
    }
  });
};

const setRecipients = (identifiers) =>   {
  Bot(identifiers).then(channels => {
    recipients = channels;
  }).catch(err => {
    console.log(err)
  });
};

const channelCheck = (message) => {
  let messageChannelId = message.channel.id.toString();

  Object.keys(channelMap).forEach(channel => {
    if (channel === messageChannelId) {
      getMessage(message);
    }
  });
};

const init = (settings) => {
  let identifiers = Object.values(channelMap);
  User.login(process.env.USER_TOKEN);
  User.on('message', channelCheck);

  setRecipients(identifiers);
};

init();
