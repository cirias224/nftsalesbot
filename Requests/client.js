const Discord = require("discord.js");
const colors = require("colors");
const client = new Discord.Client();
const { token, slug, listingChannel, saleChannel } = require("../config.json");

client.once("ready", async () => {
  console.log(`Logged into bot | ${client.user.tag}`.green);
});

client.on("disconnect", async () => {
  console.log(`Disconnected . . . Attempting to log back in . . .`.yellow);
  client.login(token);
});

module.exports = {
  client,
  Discord,
  slug,
  listingChannel,
  saleChannel,
};
