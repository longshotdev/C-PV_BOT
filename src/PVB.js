const { Client } = require("discord.js");
const EventStore = require("./stores/EventStore");
const Enmap = require("enmap");
const EReady = require("./events/Ready");
const EMessage = require("./events/Message");
module.exports.run = async () => {
  const Bot = new Client();

  // bind all events
  Bot.on("ready", () => EReady(Bot));
  Bot.on("message", (msg) => EMessage(Bot, msg));
  Bot.support = new Enmap({
    name: "support",
  });
  Bot.login(process.env.token);
};
