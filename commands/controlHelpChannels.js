const config = require('../config.json')
const discord = require('discord.js')
const occupiedID = "799343757115785246"
const avaliableID = "799343688311767050"

function handleFree(message, item) {
	if (message.channel.parentID == occupiedID) {
    if (item) {
		item.unpin()
    }
		const embed = new discord.MessageEmbed()
			.setColor('GREEN')
			.setTitle(`Free help channel!`)
			.setDescription(`This channel is now free for anyone, say a question!`)
		message.channel.send(embed)
		message.channel.setParent(avaliableID)
	}
}

async function handleExpired(message, o) {
	if (message.channel.parentID == occupiedID) {
		const A2 = await message.channel.messages.fetchPinned()
		if (A2.size > 0) {
			for (const item of A2) {
				if (item.pinned == true) {
					handleFree(message, item)
					clearInterval(o)
				}
			}
		} else {
			handleFree(message)
			clearInterval(o)
		}
	}
}

function isExpired(channel) {
  if (channel.lastMessage == undefined || channel.lastMessage == null) return true
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
	if (!message.channel.lastMessage) {
		return
	}
	let e = setInterval(() => {
		if (isExpired(message.channel)) {
			handleExpired(message, e)
		}
	}, 1000)
  let A = await message.channel.messages.fetchPinned()
	if (A.size > 0) {
		for (const item of A) {
			if (item.pinned == true) {
				if (message.content.toLowerCase() == `${config.prefix}close`) {
					handleFree(message, item)
					clearInterval(e)
				}
			}
		}
	} else {
		if (message.content.toLowerCase() == `${config.prefix}close`) {
			handleFree(message)
			clearInterval(e)
		}
	}

	if (message.channel.parent && message.channel.parentID == avaliableID) {
		message.pin()
		const embed = new discord.MessageEmbed()
			.setColor('GREEN')
			.setTitle(`${message.author.username} took this channel!`)
			.setDescription(
				`${message.author.toString()} you took this channel! Now wait until your question is answered! If it is, say ${config.prefix}close`
			)
			.setFooter(`Automatically closing this channel after ${config.noActivity / 60000} minutes of inactivity!`)
		message.channel.send(embed)
		message.channel.setParent(occupiedID)
	}
}