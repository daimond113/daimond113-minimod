require('../server.js')
import * as discord from 'discord.js'
import { client } from './client'
const e = require('../commands/controlHelpChannels.js')

client.on('ready', () => {
	console.log('ready!')
	client.user.setActivity('to everyone', { type: 'LISTENING' })
})

const regex = [
	/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discord(app)?\.com\/invite)\/[^\s/]+?(?=\b)/i,
	/(https?:)?(\/\/)?([\w\.]*twitter.com)\/?/i,
	/^(?:(https?):\/\/)?(?:(?:www|m)\.)?(soundcloud\.com|snd\.sc)(\/?)(.*)$/i
]

client.on('message', async (message: discord.Message) => {
  if (message.author.id == client.user.id) return
	regex.forEach((element) => {
		if (element.test(message.content)) {
			message.channel.send(
				`<@${message.author
					.id}>, Sorry but that link is censored! Feel like it's a mistake? You can make a issue on <https://github.com/daimond113/daimond113-minimod/issues>`
			)
			message.delete()
		}
	})
	e.execute(message)
})

client.login(process.env.token)
