require('../server.js')
import * as discord from 'discord.js'
import { client } from './client'
const e = require('../commands/controlHelpChannels.js')
const Canvas = require('canvas')
const widthTo = 3.2

Canvas.registerFont('./Roboto-Bold.ttf', { family: 'Roboto' })

async function GiveImage(member, msg1, msg2) {
	const canvas = Canvas.createCanvas(1000, 300)
	const ctx = canvas.getContext('2d')
	const background = await Canvas.loadImage('./Back.png')
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
	ctx.strokeStyle = '#f2f2f2'
	ctx.strokeRect(0, 0, canvas.width, canvas.height)

	ctx.font = '32px "Roboto"'
	ctx.fillStyle = '#000'
	ctx.fillText(msg1, canvas.width / widthTo, canvas.height / 3.5)

	ctx.font = '32px "Roboto"'
	ctx.fillStyle = '#000'
	ctx.fillText('------------------------------------------------', canvas.width / widthTo, canvas.height / 2.7)

	ctx.font = '32px "Roboto"'
	ctx.fillStyle = '#000'
	ctx.fillText(
		msg2,
		canvas.width / widthTo,
		canvas.height / 2.15
	)
	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({format: 'png', dynamic: false, size: 4096}))
	ctx.drawImage(avatar, 65, canvas.height / 2 - 100, 200, 200)
	const attachment = new discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png')
  return attachment
}

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

client.on('guildMemberAdd', async (member) => {
  const guild = client.guilds.cache.get('799341812686127134')
      const img = await GiveImage(
    member, 
    `Welcome to ${member.guild.name}!`, 
    'We hope you will have a great experience here\nand meet lots of nice people!'
    ).catch(erro => {
      console.log(erro)
    }) as discord.MessageAttachment
  const embed = new discord.MessageEmbed()
  .setTitle(`Hey! ${member.user.username}`)
  .setAuthor(member.user.username, member.user.displayAvatarURL({format: 'png', dynamic: true, size: 4096}))
  .setColor('GREEN')
  .setDescription(`You're the ${guild.memberCount} member!`)
  .attachFiles([img])
  .setImage(`attachment://${img.name}`)
  const a = await guild.channels.cache.get('799343169753317397') as discord.TextChannel
  a.send(embed)
})

client.login(process.env.token)
