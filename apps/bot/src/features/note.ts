import { CustomStatus } from "discord.js-selfbot-v13";
import client from "../core/client";
import { CronJob } from "cron";
import { isDev } from "../utils/is-dev";
import { statuses } from "@repo/database";
import { db } from "@repo/database";
import { asc, desc, eq, sql } from "drizzle-orm";


client.on("messageCreate", async (message) => {
  if (!message.cleanContent.startsWith("!bio")) return;

  const statusText = message.cleanContent.replace("!bio ", "").trim();

  if (statusText.length > 120) {
    await message.reply("🤭 Oops... the status text must be less than 120 characters");
    return;
  }

  // Check if user already has a pending status submission
  const existingSubmission = await db
    .select()
    .from(statuses)
    .where(sql`${statuses.requester}->>'id' = ${message.author.id}`)
    .limit(1);

  if (existingSubmission.length > 0) {
    await message.reply("you already submited your request");
    return;
  }

  // Send webhook notification (non-blocking)
  try {
    if (process.env.UPDATE_WEBHOOK_URL) {
      await fetch(process.env.UPDATE_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: `New status submission: ${statusText}`
        })
      });
    }
  } catch (error) {
    console.error("Failed to send webhook notification:", error);
  }

  await db.insert(statuses).values({
    status: statusText,
    requester: { id: message.author.id, username: message.author.username, displayName: message.author.displayName }
  });
  await message.reply("ok. your request has been noted.\ncheck https://discord.kan-a-pesh.fr to see your place in the queue.");
  await message.react("👍");
});

async function setCustomStatus() {
  const nextStatus = await db.select().from(statuses).orderBy(asc(statuses.createdAt)).limit(1);

  let statusText = nextStatus[0]?.status || "💡 DM me '!bio <text>' to change my status";
  const emoji = statusText.trim().match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g)?.[0];
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
