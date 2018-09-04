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
          - يجب ان يكون بوتك خالي من الاشياء الاباحيه
          - يجب ان لايحتوي على روابط تهكير او اخافة الاشخاص
          - عدم استعمال خاصية البرودكاست 
          - يجب ان تكون عربياً 
          -يجب ان يكون بوتك يشتغل 24 ساعة 
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
let log = client.channels.get('486547817909714954');
client.on('messageDelete', message => {
  let guild = message.guild;
  let contentofdeleted = message.cleanContent;
  let user = message.member.user;
  let embed = new Discord.RichEmbed()
  .setTitle(`لوق جديد !`)
  .addField(`اللوق : `, `♻ حذف رسالة`)
  .addField(`المرسل : `, `${user.tag} \n\ ${user.id}`)
  .addField(`الرسالة : `, `${contentofdeleted}`)
  .setColor('BLACK')
  .setThumbnail(user.avatarURL)
  if (log) {log.send(embed)}
});
client.on("guildBanAdd", (guild,user) => {
  let embed = new Discord.RichEmbed()
  .setTitle(`لوق جديد`)
  .addField(`اللوق : `, `باند`)
  .setColor('RANDOM')
  .addField(`الشخص : `, `${user.tag} \n\ ${user.id}`)
  if (log) {log.send(embed)}
})
client.on("guildBanRemove", (guild,user) => {
  let embed = new Discord.RichEmbed()
  .setTitle(`لوق جديد`)
  .addField(`اللوق : `, `فك الباند`)
  .setColor('RANDOM')
  .addField(`تم فك الباند من : `, `${user.tag} \n\ ${user.id}`)
  if (log) {log.send(embed)}
})
client.on("roleCreate", role => {
  let embed = new Discord.RichEmbed()
  .setTitle(`لوق جديد`)
  .addField(`اللوق : `, `انشاء رتبة`)
  .addField(`معلومات الرتبة : `, `اسم الرتبة : **${role.name}** \n\ لون الرتبة : **${role.color}** \n\ ايدي الرتبة : **${role.id}**`)
  .addField(`البرمشنات : `, `${role.permissions}`)
  .setColor('RANDOM')
  if (log) {log.send(embed)}
})

client.login(process.env.BOT_TOKEN);
