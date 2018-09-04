const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const sql = require('sqlite');
sql.open("./botslist.sqlite")
const helpers = JSON.parse(fs.readFileSync("./helpers.json", "utf8"));


let prefix = '$',
    prefix2 = '$'
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

  if (msg.content === prefix + 'ping') {
    msg.channel.send('Pinging...').then(sent => {
      sent.edit(`Pong! Took ${sent.createdTimestamp - msg.createdTimestamp}ms`);
  });
  }
    
  let command = msg.content.toLowerCase().split(' ')[0];
	command = command.slice(prefix.length)

  let args = msg.content.split(" ").slice(1);

  if (command == 'apply' || command == 'تقديم') {
    if (msg.member.roles.has('486544621799735296')) return msg.reply(`انت مقدم بالفعل`)
    if (msg.channel.id !== '486543640420941824') return msg.reply(`لا يمكنك التقديم هنا توجه الى روم \n\ <#486543640420941824>`)
    let message = msg;
    if (!args[0]) return msg.reply(`بدا تقديمك على رتبة Helper`)
     let answer = args.join(" ")
          msg.reply(`تقديمك يعني موافقتك على الشروط الآتية
          - يجب ان تكون عندك خبرة في سيرفرات ماين كرافت
          - يجت ان يكون كان عندك سيرفر او انت كنت سويت سيرفر او تعرف تسوي سيرفر
          - يجب عليك مراقبة السيرفر و الاهتمام بيه
          - يجب ان تكون عربياً 
          - يجب ان تحترم الناس
          ✅ | موافق ومعي اياها كلها
          ❎ | لا يبوي كنسل .. شروطكم صعبة
          `).then(m => {
            m.react('✅')
            m.react('❎')
            m.awaitReactions((reaction, user) => user.id == msg.author.id, {time: 60000, maxEmojis: 1})
            .then(result => {
              var reaction = result.firstKey();
             if (reaction == '✅' || reaction == '❎') {
               if (reaction == '✅') {
               msg.reply(`لقد تم تقديمك
               تقديمك لا يعني بالضرورة قبولك
               
               في حال ادخال معلومات غير صحيحة .. سوف يتم عقابك
               `)
               msg.member.addRole('486545218343272449').catch(console.error);
               msg.guild.channels.get('486543822109802498').send(`
               تقديم جديد
               \`المقدم\`
               <@!${msg.author.id}> 
                 \` معلومات التقديم \`
                 ${args.join(" ")}
                 ------------------
                 للقبول
                 $accept <@!${msg.author.id}>
               `).then(m => {
                 m.react('✅')
                 m.react('❎')
                 m.awaitReactions((reaction, user) => user.id == msg.author.id, {maxEmojis: 1})
                 .then(result => {
                  var reaction = result.firstKey();
                 if (reaction == '✅') {
                   msg.member.addRole('486545483641257996')
                   msg.guild.channels.get('486544182756769812').send(`Done .. `)
                   msg.member.send(`
                   مبروووووووووووووووووووك
                   لقد تم قبولك الان انت ديفلوبر 
                   وبوتك بالسيرفر
                   `)
                 }
                 if (reaction == '❎') {
                   m.delete();
                 }
                 });
               })
               }
               if (reaction == '❎') {
                 msg.reply(`لقد تم كنسل تقديمك .. `).then(m => m.delete(5000))
                 msg.delete();
               }
               
             }
            });
          })
        }
        let ownerrole = msg.guild.roles.find('name', '✿『 SatanMC l Owner 』✿');
        if (command == '$accept') {
          if (!msg.member.roles.has(ownerrole)) return;
          let person = msg.mentions.members.first()
          if (!person) return msg.reply(`عليك بمنشن احد الاشخاص`)
          if (!person.roles.has('486546573917028377')) return msg.reply(`هذا الشخص ليس مقدم`)
          msg.reply(`تم قبول الشخص بنجاح`)
          person.addRole('486546714094993408').catch(console.error);
        }
        if (command == '$bot') {
        sql.get(`SELECT * FROM botslist WHERE botname = "${args.join(" ")}" AND guildId = "${msg.guild.id}"`).then(row => {
          if (!row) { msg.reply(`خطأ : لم اجد البوت المطلوب`)}
          if (row) {
            let embed = new Discord.RichEmbed()
            .setTitle(`${row.botname}`)
            .addField(`البريفكس : `, `${row.botprefix}`)
            .addField(`المميزات`, `${row.botf}`)
            .setThumbnail(msg.guild.iconURL)
            .setColor('RANDOM')
            msg.channel.send(embed);
          }        
        })
        }
      if (command == '$kick') {
        if (!msg.member.hasPermission("MANAGE_GUILD")) return;
        let person = msg.mentions.members.first()
        if (!person) return msg.reply(`امممم .. منشن احد الاشخاص`)
        if (person.kickable) {
          person.kick().catch(console.error);
        }
        if (!person.kickable) return msg.reply(`ما اقدر اطرد الحب ذا....`)
      }
});

client.on("roleCreate", role => {
  client.setTimeout(() => {
    role.guild.fetchAuditLogs({
        limit: 1,
        type: 30
      })
      .then(audit => {
        let exec = audit.entries.map(a => a.executor.username)
        try {

          let log = role.guild.channels.find('name', 'log');
          if (!log) return;
          let embed = new Discord.RichEmbed()
            .setColor('RANDOM')
            .setTitle('➕ RoleCreated')
            .addField('Role Name', role.name, true)
            .addField('Role ID', role.id, true)
            .addField('By', exec, true)
            .setTimestamp()
          log.send(embed).catch(e => {
            console.log(e);
          });
        } catch (e) {
          console.log(e);
        }
      })
  }, 1000)
})

client.on("roleDelete", role => {
  client.setTimeout(() => {
    role.guild.fetchAuditLogs({
        limit: 1,
        type: 30
      })
      .then(audit => {
        let exec = audit.entries.map(a => a.executor.username)
        try {

          let log = role.guild.channels.find('name', 'log');
          if (!log) return;
          let embed = new Discord.RichEmbed()
            .setColor('RANDOM')            
            .setTitle('❌ RoleDeleted')
            .addField('Role Name:', role.name, true)
            .addField('Role ID:', role.id, true)
            .addField('By:', exec, true)
            .setTimestamp()
          log.send(embed).catch(e => {
            console.log(e);
          });
        } catch (e) {
          console.log(e);
        }
      })
  }, 1000)
})


  client.on("roleUpdate", (re,updated) => {
    client.setTimeout(() => {
      re.guild.fetchAuditLogs({
          limit: 1,
          type: 30
        })
        .then(audit => {
          let exec = audit.entries.map(a => a.executor.username)
          try {
  
            let log = re.guild.channels.find('name', 'log');
            if (!log) return;
            let embed = new Discord.RichEmbed()
              .setColor('BLACK')
              .setTitle("✏  Role Name Updated")
              .addField("Old",`${re.name}`,true)
              .addField("New",`${updated.name}`,true )
              .addField("Role id",`${re.id}`,true )
              .addField('By', exec, true)
              .setTimestamp()
            log.send(embed).catch(e => {
              console.log(e);
            });
          } catch (e) {
            console.log(e);
          }
        })
    }, 1000)
  })

client.on("channelCreate",  cc => {
  const channel = cc.guild.channels.find("name", "log")
  if(channel) {
  var embed = new Discord.RichEmbed()
  .setTitle(cc.guild.name)
  .setDescription(`***Channel Created Name : *** **${cc.name}** ⬅️`)
  .setColor(`RANDOM`)
  .setTimestamp(); 
  channel.sendEmbed(embed)
  }
  });

client.on("channelDelete",  dc => {
  const channel = dc.guild.channels.find("name", "log")
  if(channel) {
  var embed = new Discord.RichEmbed()
  .setTitle(dc.guild.name)
  .setDescription(`***Channel Deleted Name : *** **${dc.name}** ⬅️`)
  .setColor(`RANDOM`)
  .setTimestamp();
  channel.sendEmbed(embed)
  }
  });
  
  
  
client.on('messageUpdate', (message, newMessage) => {
    if (message.content === newMessage.content) return;
    if (!message || !message.id || !message.content || !message.guild || message.author.bot) return;
    const channel = message.guild.channels.find('name', 'log');
    if (!channel) return;

    let embed = new Discord.RichEmbed()
       .setAuthor(`${message.author.tag}`, message.author.avatarURL)
       .setColor('RANDOM')
       .setDescription(`✏ **Message Edited
Sender <@${message.author.id}>                                                                                                                         Edited In** <#${message.channel.id}>\n\nBefore Edited:\n \`${message.cleanContent}\`\n\nAfter Edited:\n \`${newMessage.cleanContent}\``)
       .setTimestamp();
     channel.send({embed:embed});


});


client.on('messageDelete', message => {
    if (!message || !message.id || !message.content || !message.guild || message.author.bot) return;
    const channel = message.guild.channels.find('name', 'log');
    if (!channel) return;
    
    let embed = new Discord.RichEmbed()
       .setAuthor(`${message.author.tag}`, message.author.avatarURL)
       .setColor('RANDOM')
       .setDescription(`🗑️ **Message Deleted**
**Sender <@${message.author.id}>                                                                                                                        Deleted In** <#${message.channel.id}>\n\n \`${message.cleanContent}\``)
       .setTimestamp();
     channel.send({embed:embed});

});

client.on('guildMemberAdd', member => {
    if (!member || !member.id || !member.guild) return;
    const guild = member.guild;
	
    const channel = member.guild.channels.find('name', 'log');
    if (!channel) return;
    let memberavatar = member.user.avatarURL
    const fromNow = moment(member.user.createdTimestamp).fromNow();
    const isNew = (new Date() - member.user.createdTimestamp) < 900000 ? '🆕' : '';
    
    let embed = new Discord.RichEmbed()
       .setAuthor(`${member.user.tag}`, member.user.avatarURL)
	   .setThumbnail(memberavatar)
       .setColor('GREEN')
       .setDescription(`📥 <@${member.user.id}> **Joined To The Server**\n\n`)
       .setTimestamp();
     channel.send({embed:embed});
});

client.on('guildMemberRemove', member => {
    if (!member || !member.id || !member.guild) return;
    const guild = member.guild;
	
    const channel = member.guild.channels.find('name', 'log');
    if (!channel) return;
    let memberavatar = member.user.avatarURL
    const fromNow = moment(member.joinedTimestamp).fromNow();
    
    let embed = new Discord.RichEmbed()
       .setAuthor(`${member.user.tag}`, member.user.avatarURL)
	   .setThumbnail(memberavatar)
       .setColor('RED')
       .setDescription(`📤 <@${member.user.id}> **Leave From Server**\n\n`)
       .setTimestamp();
     channel.send({embed:embed});
});

client.on('voiceStateUpdate', (oldM, newM) => {
  let m1 = oldM.serverMute;
  let m2 = newM.serverMute;

  let d1 = oldM.serverDeaf;
  let d2 = newM.serverDeaf;

  let ch = oldM.guild.channels.find('name', 'log')
  if(!ch) return;

    oldM.guild.fetchAuditLogs()
    .then(logs => {

      let user = logs.entries.first().executor

    if(m1 === false && m2 === true) {
       let embed = new Discord.RichEmbed()
       .setAuthor(`${newM.user.tag}`, newM.user.avatarURL)
       .setDescription(`${newM} has muted in server`)
       .setFooter(`By : ${user}`)

       ch.send(embed)
    }
    if(m1 === true && m2 === false) {
       let embed = new Discord.RichEmbed()
       .setAuthor(`${newM.user.tag}`, newM.user.avatarURL)
       .setDescription(`${newM} has unmuted in server`)
       .setFooter(`By : ${user}`)
       .setTimestamp()

       ch.send(embed)
    }
    if(d1 === false && d2 === true) {
       let embed = new Discord.RichEmbed()
       .setAuthor(`${newM.user.tag}`, newM.user.avatarURL)
       .setDescription(`${newM} has deafened in server`)
       .setFooter(`By : ${user}`)
       .setTimestamp()

       ch.send(embed)
    }
    if(d1 === true && d2 === false) {
       let embed = new Discord.RichEmbed()
       .setAuthor(`${newM.user.tag}`, newM.user.avatarURL)
       .setDescription(`${newM} has undeafened in server`)
       .setFooter(`By : ${user}`)
       .setTimestamp()

       ch.send(embed)
    }
  })
});



  client.on("guildBanAdd", (guild, member) => {
  client.setTimeout(() => {
    guild.fetchAuditLogs({
        limit: 1,
        type: 22
      })
      .then(audit => {
        let exec = audit.entries.map(a => a.executor.username);
        try {
          let log = guild.channels.find('name', 'log');
          if (!log) return;
          client.fetchUser(member.id).then(myUser => {
          let embed = new Discord.RichEmbed()
        .setAuthor(exec)
        .setThumbnail(myUser.avatarURL)
        .addField('- Banned User:',`**${myUser.username}**`,true)
        .addField('- Banned By:',`**${exec}**`,true)
        .setFooter(myUser.username,myUser.avatarURL)
            .setTimestamp();
          log.send(embed).catch(e => {
            console.log(e);
          });
          });
        } catch (e) {
          console.log(e);
        }
      });
  }, 1000);
});

client.login(process.env.BOT_TOKEN);
