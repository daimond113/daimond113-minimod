require('./server.js')
const discord = require('discord.js')
const {client} = require('./client.js').client
const e = require('./commands/controlHelpChannels.js')
const Filter = require('bad-words')
const filter = new Filter()
const items = process.env.BADWORDS.split(',')
filter.addWords(...items)


client.on('ready', () => {
	console.log('ready!')
	client.user.setActivity('to everyone', { type: 'LISTENING' })
})

const regex = [
	/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discord(app)?\.com\/invite)\/[^\s/]+?(?=\b)/i,
	/(https?:)?(\/\/)?([\w\.]*twitter.com)\/?/i,
	/^(?:(https?):\/\/)?(?:(?:www|m)\.)?(soundcloud\.com|snd\.sc)(\/?)(.*)$/i
]

client.on('message', async (message) => {
  if (message.author.id == client.user.id) return
  if (filter.isProfane(message.content)){
    message.channel.send(`${message.author.toString()}, hey! I found a bad word in your message please do not continiue to use bad words.`)
    return message.delete()
  }
	for (const element of regex) {
		if (element.test(message.content)) {
      if (message.member.roles.cache.find(role => role.name.toLowerCase() == "owner")) return
			message.channel.send(
				`<@${message.author
					.id}>, Sorry but that link is censored! Feel like it's a mistake? You can make a issue on <https://github.com/daimond113/daimond113-minimod/issues>`
			)
			message.delete()
		}
	}
	e.execute(message)
})

client.on('guildMemberAdd', async (member) => {
  const embed = new discord.MessageEmbed()
  .setTitle(`Welcome, ${member.user.username}`)
  .setAuthor(member.user.username, member.user.displayAvatarURL({format: 'png', dynamic: true, size: 4096}))
  .setColor('GREEN')
  .setDescription(`
  Welcome to ${member.guild.name}! We hope you will have a great experience here!`)
  const a = await client.guilds.cache.get('799341812686127134').channels.cache.get('799343169753317397')
  a.send(embed)
})


client.login(process.env.token)
