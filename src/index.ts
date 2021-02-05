require('../server')

import { Client, Message } from 'discord.js'
import { hasLinks } from './hasLinks'
import { createWelcomeImage } from './createWelcomeImage'
import { handleMessage as handleHelpMessage } from './helpChannelController'

const client = new Client()

client.on('ready', () => {
	console.log('ready!')
	client.user.setActivity('to everyone', { type: 'LISTENING' })
})

client.on('message', async (message: Message) => {
	if (message.author.bot) return

	if (hasLinks(message)) {
		return message.delete().then(() => {
			return message.reply(
				'you have sent a blacklisted link!\n' +
				'If that is not the case please report a issue at\n' +
				'<https://github.com/daimond113/daimond113-minimod/issues>'
			)
		})
	}

	if (message.content === 'bot.luka.test') {
		message.channel.send(await createWelcomeImage(message.member))
	}

	handleHelpMessage(message)
})



client.login(process.env.TOKEN)
