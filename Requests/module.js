const request = require("request");
const colors = require("colors");
const client = require("./client.js");
let previousSale = "",
  previousListing = "";
const weiToEth = 1000000000000000000;
const getEthVal = function (wei) {
  return wei / weiToEth;
};

async function getSales(slug, salesChannel) {
  const uri = `https://api.opensea.io/api/v1/events?collection_slug=${slug}&event_type=successful&only_opensea=true&offset=0&limit=20`;
  try {
    request.get(uri, async (err, res, body) => {
      if (res) {
        let data = JSON.parse(body);
        let token = data.asset_events[0].asset.token_id;
        let asset = data.asset_events[0].asset;
        if (token !== "") {
          if (token !== previousSale) {
            previousSale = token;
            console.log(`New sale found in ${slug}!`.green);
            let embed = new client.Discord.MessageEmbed()
              .setAuthor(
                asset.name,
                asset.collection.image_url,
                asset.permalink
              )
              .setColor("GREEN")
              .addField(
                "Amount",
                getEthVal(data.asset_events[0].total_price) + " Ξ",
                true
              )
              .addField(
                "buyer",
                `[${data.asset_events[0].transaction.from_account.user == null ? "Un-named" : data.asset_events[0].transaction.from_account.user.username}](https://opensea.io/${data.asset_events[0].transaction.from_account.address})`,
                true
              )
              .addField(
                "Seller",
                `[${data.asset_events[0].seller.user.username}](https://opensea.io/${data.asset_events[0].seller.address})`,
                true
              )
              .setImage(data.asset_events[0].asset.image_url)
              .setFooter("The Hares")
              .setTimestamp();
            client.client.channels.cache.get(client.saleChannel).send(embed);
          } else {
            console.log("No new sale found . . . ".yellow);
          }
        }
      }
    });
  } catch (e) {
    return console.log("Error");
  }
}

async function getListings(slug, listingChannel) {
  const uri = `https://api.opensea.io/api/v1/events?collection_slug=${slug}&event_type=created&only_opensea=true&offset=0&limit=20`;
  try {
    request.get(uri, async (err, res, body) => {
      if (res) {
        let data = JSON.parse(body);
        let asset = data.asset_events[0].asset;
        let token = data.asset_events[0].asset.token_id;
        let user = data.asset_events[0].seller.user.username;
        if (token !== "") {
          if (token !== previousListing) {
            previousListing = token;
            console.log(`New listing in ${slug}!`.green);
            let embed = new client.Discord.MessageEmbed()
              .setAuthor(
                asset.name,
                asset.collection.image_url,
                asset.permalink
              )
              .setColor("YELLOW")
              .addField(
                "Amount",
                `${getEthVal(data.asset_events[0].starting_price)} Ξ`,
                true
              )
              .addField("Seller", `[${user}](https://opensea.io/${user})`, true)
              .setImage(asset.image_url)
              .setFooter("The Hares")
              .setTimestamp();
            client.client.channels.cache.get(client.listingChannel).send(embed);
          } else {
            console.log("No new listings found . . .".yellow);
          }
        }
      }
    });
  } catch (e) {}
}

module.exports = {
  getSales,
  getListings,
  colors,
};
