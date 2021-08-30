const bot = require("./Requests/client.js");
const requests = require("./Requests/module.js");
const colors = require("colors");
const { token, slug, listingChannel, saleChannel } = require("./config.json");
bot.client.login(token).then(async () => {
  requests.getSales(slug, saleChannel);
  requests.getListings(slug, listingChannel);

  setInterval(async () => {
    console.log(`Checking tokens`.yellow);
    requests.getSales(slug, saleChannel);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    requests.getListings(slug, listingChannel);
  }, 30000);
});
