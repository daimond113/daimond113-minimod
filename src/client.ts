import { Client, Intents } from 'discord.js'
const client = new Client({
	ws: {
		intents: new Intents(Intents.ALL & ~(1 << 8))
	}
})

export {client}