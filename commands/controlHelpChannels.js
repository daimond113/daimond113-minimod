const config = require('../config.json')
const discord = require('discord.js')
module.exports.execute = async (message) => {
	if (message.deleted) {
		return
	}
  if (message.channel.type !== 'text') {
		return
	}
	const A = await message.channel.messages.fetchPinned()
	if (A.size > 0) {
		A.forEach(async (item) => { 
			if (item.pinned == true) {
				if (message.content == `${config.prefix}close`) {
					if (message.channel.parent.name.toLowerCase() == 'occupied help channels') {
						item.unpin()
						const embed = new discord.MessageEmbed()
							.setColor('GREEN')
							.setTitle(`Free help channel!`)
							.setDescription(`This channel is now free for anyone, say a question!`)
						message.channel.send(embed)
						message.channel.setParent('799343688311767050')
					}
				}
			}
		})
	}
	if (message.channel.parent && message.channel.parent.name.toLowerCase() == 'free help channels') {
		message.pin()
		const embed = new discord.MessageEmbed()
			.setColor('GREEN')
			.setTitle(`${message.author.username} took this channel!`)
			.setDescription(
				`${message.author.toString()} you took this channel! Now wait until your question is answered! If it is, say ${config.prefix}close`
			)
			.setFooter(`Automatically closing this channel after ${config.noActivity / 60000} minutes!`)
		message.channel.send(embed)
		message.channel.setParent('799343757115785246')
	}
}
