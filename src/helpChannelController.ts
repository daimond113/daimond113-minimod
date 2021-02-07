import { Collection, Message, MessageEmbed, Snowflake, TextChannel } from 'discord.js'

const {
    CATEGORY_FREE_ID,
    CATEGORY_TAKEN_ID,
    PREFIX,
    HELP_INACTIVITY_TIME
} = process.env

const HELP_CATEGORIES = new Set([CATEGORY_FREE_ID, CATEGORY_TAKEN_ID])
const CLOSE_COMMAND = `${PREFIX}close`

const channels = new Collection<Snowflake, {
    channel: TextChannel,
    timeout?: NodeJS.Timeout,
    originalMessage?: Message,
    infoMessage?: Message
}>()

export async function handleMessage(msg: Message) {
    if (!HELP_CATEGORIES.has((msg.channel as TextChannel).parentID)) return

    const isChannelClaimed = channels.has(msg.channel.id)

    try {
        if (isChannelClaimed) {
            const channelInfo = channels.get(msg.channel.id)
            if (!channelInfo.timeout) return

            if (
                msg.content.toLowerCase() === CLOSE_COMMAND &&
                msg.author.id === channelInfo.originalMessage.author.id
            ) {
                clearTimeout(channelInfo.timeout)
                return closeChannel(msg.channel as TextChannel)
            }

            clearTimeout(channelInfo.timeout)
            channelInfo.timeout = setTimeout(closeChannel, Number(HELP_INACTIVITY_TIME), channelInfo.channel)
        } else {
            channels.set(msg.channel.id, { channel: msg.channel as TextChannel })

            const embed = new MessageEmbed()
                .setAuthor(msg.member.displayName, msg.author.displayAvatarURL())
                .setTitle('Channel Claimed')
                .setDescription(
                    'This channel has been claimed\n' +
                    `Say \`${CLOSE_COMMAND}\` to close.`
                )
                .setFooter(`Closes after ${Number(HELP_INACTIVITY_TIME) / 60000} minutes of inactivity`)

            const infoMessage = await msg.channel.send(embed)
                .catch(e => {
                    channels.delete(msg.channel.id)
                    throw e
                });

            (msg.channel as TextChannel).setParent(CATEGORY_TAKEN_ID).catch(console.error)

            channels.set(msg.channel.id, {
                channel: msg.channel as TextChannel,
                timeout: setTimeout(
                    closeChannel,
                    Number(HELP_INACTIVITY_TIME),
                    msg.channel as TextChannel
                ),
                originalMessage: msg,
                infoMessage
            })

            msg.pin().catch(console.error)
        }
    } catch (e) {
        await msg.channel.send(
            ':x: An error occurred\n```\n' + e.message + '\n```'
        ).catch(console.error)
    }
}

function closeChannel(channel: TextChannel) {
    const channelInfo = channels.get(channel.id)
    if (!channelInfo) return

    channels.delete(channel.id)

    !channelInfo.originalMessage.deleted &&
        channelInfo.originalMessage?.unpin().catch(console.error)

    !channelInfo.infoMessage.deleted &&
        channelInfo.infoMessage?.edit('*Closed*', { embed: null }).catch(console.error)

    channel.setParent(CATEGORY_FREE_ID).catch(console.error)

    const embed = new MessageEmbed()
        .setTitle('Free Channel')
        .setDescription('Send a message to claim this channel')

    channel.send(embed)
}