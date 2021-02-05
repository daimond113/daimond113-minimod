import { Collection, Message, Snowflake, TextChannel } from 'discord.js'

const CATEGORY_FREE_ID = "807336770323873852"
const CATEGORY_TAKEN_ID = "807336718637858886"

const CHANNEL_TIMEOUT = 10 * 1000

const timeouts = new Collection<Snowflake, {
    infoMsg: Message,
    claimMessage: Message,
    timeout: NodeJS.Timeout
}>()

export async function handleMessage(message: Message) {
    if (message.content === '!close') {
        if ((message.channel as TextChannel).parentID === CATEGORY_TAKEN_ID) {
            timeoutHandler(message.channel as TextChannel)
        }
        return
    }

    if (
        (message.channel as TextChannel).parentID === CATEGORY_FREE_ID ||
        (message.channel as TextChannel).parentID === CATEGORY_TAKEN_ID
    ) {
        let msg: Message
        let claimMessage: Message

        if (timeouts.has(message.channel.id)) {
            const timeout = timeouts.get(message.channel.id)
            msg = timeout.infoMsg
            claimMessage = timeout.claimMessage

            clearTimeout(timeout.timeout)
        } else {
            msg = await message.channel.send({
                embed: {
                    title: 'Channel has been claimed',
                    description: `${message.author} has claimed this channel`,
                    footer: {
                        text: `Channel will close after ${CHANNEL_TIMEOUT / (60 * 1000)} minutes of inactivity`
                    }
                }
            })

            claimMessage = message

            await (message.channel as TextChannel).setParent(CATEGORY_TAKEN_ID)
        }

        if (timeouts.has(message.channel.id)) {
            message.unpin().catch(() => { })
            claimMessage.delete().catch(() => { })
            msg.delete().catch(() => { })

            return message.channel.send(
                '***Warn:** Ignore this warning*\n' +
                '*`channel_already_claimed`*'
            )
                .then(msg => new Promise(r => setTimeout(r, 5000, msg)))
                .then(msg => (msg as Message).delete())
                .catch(() => { })
        }

        message.pin().catch(() => { })

        timeouts.set(message.channel.id, {
            timeout: setTimeout(timeoutHandler, CHANNEL_TIMEOUT, message.channel),
            infoMsg: msg,
            claimMessage
        })
    }
}

async function timeoutHandler(channel: TextChannel) {
    const { infoMsg, claimMessage } = timeouts.get(channel.id)
    await Promise.all([
        claimMessage.unpin().catch(() => { }),
        infoMsg.edit('*Expired*', { embed: null })
    ])

    timeouts.delete(channel.id)

    await channel.setParent(CATEGORY_FREE_ID)
    await channel.send({
        embed: {
            title: 'Channel is free!',
            description: 'Type a message to claim this channel.'
        }
    })
}