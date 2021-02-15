require('../server')

import { TextChannel, MessageEmbed } from 'discord.js'
import { hasLinks } from './hasLinks'
import { createWelcomeImage } from './createWelcomeImage'
import { handleMessage as handleHelpMessage } from './helpChannelController'
import { hasBadWords } from './hasBadWords'
import { evalCmd } from './eval'
import { client } from './client'
import { reactionRole } from './reactionRoles'

client.on('ready', async () => {
	console.log('ready!')
	client.user.setActivity('to everyone', { type: 'LISTENING' })
  const channel = await client.channels.fetch('810627676217278524') as TextChannel
  channel.messages.fetch()
})

client.on('message', async (message) => {
	if (message.author.bot) return

  const args = message.content.slice(process.env.PREFIX.length).split(/ +/)
  const command = args.shift().toLowerCase()
  switch (command) {
    case 'eval':
      evalCmd(message, args)
      break;
    default: 
      break;
  }
  const haslinks = await hasLinks(message)
	if (haslinks) {
		return message.delete().then(() => {
			return message.reply(
				'you have sent a blacklisted link!\n' +
				'If that is not the case please report a issue at\n' +
				'<https://github.com/daimond113/daimond113-minimod/issues>'
			)
		})
	}

	/*if (hasBadWords(message.content)) {
		return message.delete().then(() => {
			return message.reply(
				'I\'ve detected a bad word in your message!\nPlease do not try to use bad words.\nFeel like this is an issue? Report it on https://github.com/daimond113/daimond113-minimod/issues'
			)
		})
  }*/

	handleHelpMessage(message)
})

client.on('messageReactionAdd', (reaction, user) => {
  reactionRole(reaction, user, false)
})

client.on('messageReactionRemove', (reaction, user) => {
  console.log('A')
  reactionRole(reaction, user, true)
})

client.on('guildMemberAdd', async (member) => {
	await member.guild.fetch()
	const channel = await client.channels.fetch('799343169753317397') as TextChannel
	channel.send(await createWelcomeImage(member))
})

client.login(process.env.TOKEN)
