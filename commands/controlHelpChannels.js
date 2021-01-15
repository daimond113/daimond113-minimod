const config = require('../config.json')
const discord = require('discord.js')

function handleFree(message, item) {
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

const channels = {}

async function handleExpired(message, o) {
	if (message.channel.parent.name.toLowerCase() == 'occupied help channels') {
		const A2 = await message.channel.messages.fetchPinned()
		if (A2.size > 0) {
			A2.forEach(async (item) => {
				if (item.pinned == true) {
					handleFree(message, item)
          clearInterval(o)
				}
			})
		}
	}
}


function isExpired(channel) {
  const expiresAt = channel.lastMessage.createdAt.getTime() + config.noActivity
  return (expiresAt - Date.now()) <= 0
}

module.exports.execute = async (message) => {
	if (message.deleted) {
		return
	}
	if (message.channel.type !== 'text') {
		return
	}
	const A = await message.channel.messages.fetchPinned()
  let e = setInterval(() => {
  if (isExpired(message.channel)) {
    handleExpired(message, e)
  }
  }, 1000)
	if (A.size > 0) {
		A.forEach(async (item) => {
			if (item.pinned == true) {
				if (message.content.toLowerCase() == `${config.prefix}close`) {
					handleFree(message, item)
          clearInterval(e)
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
  console.log(message.channel.parent.name.toLowerCase() == 'occupied help channel')
}
