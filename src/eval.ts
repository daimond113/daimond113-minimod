import { Message } from 'discord.js'
import { inspect } from 'util'

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

export function evalCmd(message: Message, args) {
  if (message.author.id != process.env.OWNER_ID) return
  try { 
    const code = args.join(" ");
    let evaled = eval(code);
 
    if (typeof evaled !== "string")
      evaled = inspect(evaled);
 
      message.channel.send(clean(evaled), {code:"js"}).catch((er) => {console.log(er.message)})
    } 
  catch (err) {
      message.channel.send(`\`3RR0R\` \`\`\`js\n${clean(err)}\n\`\`\``).catch((er) => {console.log(er.message)})
    }
}