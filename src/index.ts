require('../server')

import { Client, TextChannel, Intents } from 'discord.js'
import { hasLinks } from './hasLinks'
import { createWelcomeImage } from './createWelcomeImage'
import { handleMessage as handleHelpMessage } from './helpChannelController'

const client = new Client({
	ws: {
		intents: new Intents(Intents.ALL & ~(1 << 8))
	}
})

client.on('ready', () => {
	console.log('ready!')
	client.user.setActivity('to everyone', { type: 'LISTENING' })
})

client.on('message', async (message) => {
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

	handleHelpMessage(message)
})

client.on('guildMemberAdd', async (member) => {
	await member.guild.fetch()
	const channel = await client.channels.fetch('806936473005064206') as TextChannel
	channel.send(await createWelcomeImage(member))
})

client.login(process.env.TOKEN)
