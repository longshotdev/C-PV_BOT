const { Role } = require("discord.js");
const { v4: uuidv4 } = require("uuid");
const wash = require("washyourmouthoutwithsoap");
const PREFIX = ".";
const SUPPORT_CATEGORY = "715433875165413397"; // THIS IS SNOWFLAKE FOR SUPPORT CATEGORY.
module.exports = async (Bot, message) => {
  // check for slurs

  // check if command
  const command = message.content.slice(PREFIX.length).trim().split(/ +/g);
  const args = message.content
    .slice(PREFIX.length)
    .trim()
    .split(/ +/g)
    .reverse();
  args.pop();
  args.reverse();
  /* 
        To anyone reading this you may ask, why are you using a switch statement `I ThOugHt u wErE sUPeR SuPEr smarTttT`.
        Simple answer is that this Bot isn't hosted on multiple servers and has only a couple use cases, I don't want to
        spend weeks making an organized system or copy it from my private bot. Seriously it takes away the fun and tbh it's
        probably easier to read this.
    */
  switch (command[0].toLowerCase()) {
    case "eval":
      evaluate();
      break;
    case "test":
      commandTest();
      break;
    case "createticket":
      createTicket();
      break;
    case "deleteticket":
      deleteTicket();
      break;
    case "gettickets":
      getTicket();
      break;
    default:
      if (wash.check("en", message.content)) {
        message.delete();
        // TODO: make stuff here?;
      }
      break;
  }

  function commandTest() {
    message.channel.send("hola");
  }
  function createTicket() {
    // aight lets combine all their args into a sentence for sending
    let supportMessage = args.join(" ");
    console.log(
      `[DEBUG] User: ${message.author.username} sent message:\n${supportMessage}`
    );
    // create the role. and store it in an ID. lets have an enmap cause why not? lol
    let supportID = uuidv4();
    message.guild.roles
      .create({
        data: {
          name: supportID,
          color: "BLUE",
        },
        reason: `Support Ticket Role for: ${message.author.username}.`,
      })
      .then((role) => {
        let roleID = role.id;

        message.member.roles.add(
          roleID,
          `Support Ticket Role for: ${message.author.username}.`
        ); // using snowflake
        // TODO: ^^ CHANGE TO ASYNC PLEASE.
        message.guild.channels
          .create(`SUPPORT-${supportID}`, {
            type: "text",
            topic: `Support Room for SUPPORT-${supportID}`,
            parent: SUPPORT_CATEGORY,
            permissionOverwrites: [
              {
                id: message.author.id,
                allow: ["VIEW_CHANNEL"],
              },
              {
                id: message.guild.id,
                deny: ["VIEW_CHANNEL"],
              },
            ],
          })
          .then(async (channel) => {
            await channel.send(`SUPPORT TICKET: ${supportID}`);
            await channel.send(`Info: \n\`${supportMessage}\``);
            Bot.support.set(supportID, {
              id: supportID,
              user: `${message.author.username}#${message.author.discriminator} | (${message.author.id})`,
              date: new Date(),
              channel: channel.id,
              role: roleID,
            });
          });
      });
  }
  async function deleteTicket() {
    const supportTicket = Bot.support.get(args[0]);
    if (!supportTicket)
      return message.channel.send(
        `Support Ticket: \`${args[0]}\` does not exist.`
      );
    const roleToDelete = await message.guild.roles.fetch(supportTicket.role);
    roleToDelete.delete();
    const channelToDelete = await message.guild.channels.resolve(
      supportTicket.channel
    );
    channelToDelete.delete();
    Bot.support.delete(args[0]);
    message.channel.send("Removed " + args[0]);
  }
  function getTicket() {
    message.channel.send(
      `\`\`\`asciidoc${Bot.support
        .fetchEverything()
        .map(
          (c) =>
            `${c.id}\n--------------------------\nChannel ID: ${c.channel}\nRole ID: ${c.role}\n\n`
        )}\`\`\``,
      { split: { char: "\u200b" } }
    );
  }
  function evaluate() {
    if (message.author.id != message.guild.ownerID) return;
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), { code: "xl" });
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
};
const clean = (text) => {
  if (typeof text === "string")
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
};
