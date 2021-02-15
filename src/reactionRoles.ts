import { client } from './client'

export async function reactionRole(reaction, user, deleted) {
  if (reaction.message.channel.id !== "810627676217278524") return
  const guild = await client.guilds.fetch(reaction.message.guild.id)
  const member = await guild.members.fetch(user.id)  
  console.log(reaction)
  let role
  switch (reaction.emoji.name) {
    case '😎':
      role = await guild.roles.fetch('810641538585067520')
      break;
    default:
    break
  }
  if (deleted) {
    member.roles.remove(role).catch((err) => {console.log(err.message)})
  }
  else {
    member.roles.add(role).catch((err) => {console.log(err.message)})
  }
}