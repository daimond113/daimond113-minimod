require('../server.js')
import * as discord from 'discord.js'
import { client } from './client'

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
	/*if (message.content == 'secretRules') {
		const embed = new discord.MessageEmbed().setColor('GREEN').setTitle('Rules').setDescription(`
        1. Don't ping staff for no reason! You can find a channel for that in "Free Help Channels"
        2. DO NOT be toxic!
        3. Bypassing the filter will get you punished from a warn to a ban depending on what's bypassed
        4. English is the only language allowed!
        5. DO NOT post NSFW that will result in a insta-ban
        6. Attempting to use alternative accounts or leaving and joining back to bypass punishments will result in a perma-ban.
        7. Advertising in any form will result in a punishment
        8. Respect discord's ToS you can find it here: https://discordapp.com/terms
            `)
		let chanle = message.guild.channels.cache.get('799342852702077018') as discord.TextChannel
		chanle.send(embed)
    }*/ //just used for rules
	regex.forEach((element) => {
		if (element.test(message.content)) {
			message.channel.send(
				`<@${message.author
					.id}>, Sorry but that link is censored! Feel like it's a mistake? You can make a issue on <https://github.com/daimond113/daimond113-minimod/issues>`
			)
			message.delete()
		}
	})
})

client.login(process.env.token)
