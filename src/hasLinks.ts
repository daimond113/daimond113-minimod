import type { Message } from 'discord.js'

const DISALLOWED_DOMAINS = [
    'discord.gg',
    'discord.io',
    'discord.me',
    'discord.li',
    'discord.com',
    'discordapp.com',

    'twitter.com',
    'soundcloud.com',
    'snd.sc'
]

const regexes = DISALLOWED_DOMAINS.map(domain => (
    new RegExp(`(.+\\.)?${domain.replace('.', '\\.')}`, 'i')
))

export function hasLinks(message: Message) {
    return regexes.some(regex => (
        message.content.match(regex)
    ))
}