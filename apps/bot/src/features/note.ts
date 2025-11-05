import { CustomStatus } from "discord.js-selfbot-v13";
import client from "../core/client";
import { CronJob } from "cron";
import { isDev } from "../utils/is-dev";
import { statuses } from "@repo/database";
import { db } from "@repo/database";
import { desc, eq } from "drizzle-orm";


client.on("messageCreate", async (message) => {
  if (!message.cleanContent.startsWith("!bio")) return;

  const statusText = message.cleanContent.replace("!bio ", "").trim();

  if (statusText.length > 120) {
    await message.reply("🤭 Oops... the status text must be less than 120 characters");
    return;
  }

  await db.insert(statuses).values({
    status: statusText,
    requester: { id: message.author.id, username: message.author.username, displayName: message.author.displayName }
  });
  await message.reply("ok. your request has been noted.\ncheck https://discord.kan-a-pesh.fr to see your place in the queue.");
  await message.react("👍");
});

async function setCustomStatus() {
  const nextStatus = await db.select().from(statuses).orderBy(desc(statuses.createdAt)).limit(1);

  let statusText = nextStatus[0]?.status || "💡 DM me '!bio <text>' to change my status";
  const emoji = statusText.trim().match(/\p{Emoji}/u)?.[0];
  const custom = new CustomStatus(client)

  if (emoji) {
    statusText = statusText.replace(emoji, "").trim();
    custom.setEmoji(emoji);
  }

  custom.setState(statusText);

  client.user!.setPresence({
    status: "online",
    activities: [custom]
  });

  if (nextStatus[0]?.id) {
    await db.delete(statuses).where(eq(statuses.id, nextStatus[0]!.id));
  }

  console.log("Changed status to ", emoji, statusText);
}

CronJob.from({
  start: true,
  cronTime: isDev ? "*/1 * * * *" : "*/30 * * * *",
  // (DEV) every 1 minute
  // (PROD) every 30 minutes
  onTick: setCustomStatus
});

setCustomStatus();
