import { Message } from 'discord.js'

const DISALLOWED_DOMAINS = [
    'discord.gg',
    'discord.io',
    'discord.me',
    'discord.li',
    'discord.com/invite/',
    'discordapp.com/invite/',

    'twitter.com',
    'soundcloud.com',
    'snd.sc'
]

const regexes = DISALLOWED_DOMAINS.map(domain => (
    new RegExp(`(.+\\.)?${domain.replace('.', '\\.').replace('/', '\\/')}`, 'i')
))

export async function hasLinks(message: Message) {
  const user = await message.guild.members.fetch(message.author.id)
  if (
            user.roles.cache.some((role) => role.name.toLowerCase() == 'moderator') ||
            user.roles.cache.some((role) => role.name.toLowerCase() == 'owner')
        ) return
    const noSpaceAndTab = message.content.replace(/\s/ig, '')
    return regexes.some(regex => (
        noSpaceAndTab.match(regex)
    ))
}