const Discord = require('discord.js');
const ms = require("ms");

    /**
    * @param {Discord.Client} client - the discord's client
    * @param {object} options - options of the package
    */

module.exports = async function(client, options) {

    class Giveaway {
        constructor(client, options = {}) {
          this.botPrefix = (options && options.prefix) || '!';
          this.startCmd = (options && options.startCmd) || 'giveawaystart';
          this.giveawayRole = (options && options.giveawayRole) || null;
          this.embedColor = (options && options.embedColor) || '#7aefe0';
          this.reactEmote = (options && options.reactEmote) || `✅`
        }
      }

      var giveawayBot = new Giveaway(client, options);

      giveawayBot.log = (msg) => {
          const loggableMsg = msg.split("\n").map(function(e) {return '[Giveaway] ' + e}).join("\n")
          console.log(loggableMsg)
      }

      async function start() {
        if (typeof giveawayBot.giveawayRole !== 'string' && giveawayBot.giveawayRole !== null) throw new TypeError(`giveawayRole must be a string`);
        giveawayBot.log("Started.")
        client.on("message", async message => {
            if(!message.content.startsWith(giveawayBot.botPrefix)) return;
            const msgArray = message.content.slice(giveawayBot.botPrefix.length).split(" ")
            const command = msgArray[0]
            const args = msgArray.slice(1)
            switch(command) {
              case giveawayBot.helpCmd:
                giveawayBot.help(message);
                break;
              case giveawayBot.startCmd:
                giveawayBot.start(message, args);
                break;
              default:
                giveawayBot.log("Not matching command.")
                break;
            }

        })
      }
      if(client.readyTimestamp) {
        start()
      } else {
      client.on("ready", () => {
      start() 
      })
      }

      giveawayBot.help = (message) => {
          
      }

      giveawayBot.rollIt = (randomNumber, values) => {
        for (let i = 0; i < randomNumber; i++) { 
          if(i == randomNumber - 1) {
            return values.next();
          } else {
            values.next()
          }
        }
      }

      giveawayBot.start = (message, args) => {
          let doesHaveRole
          if(giveawayBot.giveawayRole == null) {
            doesHaveRole = true
          } else {
            doesHaveRole = message.member.roles.find(r => r.id === giveawayBot.giveawayRole)
          }
          if(!doesHaveRole) return message.reply("you don't have the required role to do that.")
          giveawayBot.log("Starting a giveaway.")
          const channel = message.channel,
                time = ms(args[0]),
                item = args.slice(1).join(" ");
          if(isNaN(time)) return message.reply("make sure to provide correct time.").then(msg => msg.delete(5000))
          if(item == undefined || item == null || item.length < 1) return message.reply("you didn't specify what do you want to give away.").then(msg => msg.delete(5000))
          giveawayBot.log(`Giveaway details:\n  Channel: ${message.channel.id}\n  Author: ${message.author.id}\n  Time: ${time}\n  Item: ${item}`)
          const embed = new Discord.RichEmbed()
          .setColor(giveawayBot.embedColor)
          .setTitle(item)
          .setDescription(`Ends in: ${ms(time)}`)
          .setAuthor(message.author.tag, message.author.displayAvatarURL)
          .setTimestamp()
          .addField(`React with the ${giveawayBot.reactEmote} emote`, `to take part in this giveaway.`)
          .setFooter(client.user.username, client.user.displayAvatarURL)
          message.channel.send(embed).then(async msg => {
            await msg.react(giveawayBot.reactEmote)
          const timeInterval = setInterval(function() {
            console.log(ms(msg.embeds[0].description.slice(9)))
            if(ms(msg.embeds[0].description.slice(9)) <= 5000) {
              const embed2 = new Discord.RichEmbed()
            .setColor(giveawayBot.embedColor)
          .setTitle(item)
          .setDescription(`Ended.`)
          .setAuthor(message.author.tag, message.author.displayAvatarURL)
          .setTimestamp(msg.embeds[0].timestamp)
          .setFooter(client.user.username, client.user.displayAvatarURL)
            msg.edit(embed2)
              clearInterval(timeInterval)
            } else {
            const embed2 = new Discord.RichEmbed()
            .setColor(giveawayBot.embedColor)
          .setTitle(item)
          .setDescription(`Ends in: ${ms(ms(msg.embeds[0].description.slice(9)) - 5000)}`)
          .setAuthor(message.author.tag, message.author.displayAvatarURL)
          .setTimestamp(msg.embeds[0].timestamp)
          .addField(`React with the ${giveawayBot.reactEmote} emote`, `to take part in this giveaway.`)
          .setFooter(client.user.username, client.user.displayAvatarURL)
            msg.edit(embed2)
            }
          }, 5000)
          setTimeout(function() {
            msg.channel.fetchMessage(msg.id).then(mesg => {
            const reactions = mesg.reactions.find(reaction => reaction.emoji.name == giveawayBot.reactEmote)
            giveawayBot.log(`Reaction count: ${reactions.count}.`)
            const randomNumber = Math.floor(Math.random() * (reactions.count - 1)) + 1;
            let values = reactions.users.filter(user => user !== client.user).values()
            const winner = giveawayBot.rollIt(randomNumber, values).value
            if(winner == undefined) return mesg.channel.send("No one reacted to the message, so no one wins.");
            mesg.channel.send(`The winner of \`${item}\` is... <@${winner.id}>!`)
            })
          }, time)
        })
      }

      return giveawayBot;
}
