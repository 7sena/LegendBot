const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const prefix = '$';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

  if (msg.content === prefix + 'ping') {
    msg.channel.send('Pinging...').then(sent => {
      sent.edit(`Pong! Took ${sent.createdTimestamp - msg.createdTimestamp}ms`);
    }
  });


client.login(process.env.BOT_TOKEN);
