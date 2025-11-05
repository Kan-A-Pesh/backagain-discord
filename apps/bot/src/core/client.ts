import { Client } from "discord.js-selfbot-v13";

const client = new Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on("error", (error) => {
  console.error(error);
});

export default client;
