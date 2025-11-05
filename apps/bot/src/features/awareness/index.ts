import { generateText } from "ai";
import { createAnnaTools } from "./tools";
import { getSystemPrompt } from "./prompt";
import client from "../../core/client";
import { openrouter } from "@/src/utils/openrouter";

client.on("messageCreate", async (message) => {
  // Respond if mentioned
  if (!message.cleanContent.startsWith("!ai")) return;

  try {
    // Get the last 50 messages in the channel for context
    const messages = await message.channel.messages
      .fetch({ limit: 50 })
      .then((msgs) =>
        msgs.map(
          (m) =>
            ({
              role: (m.author.id === client.user?.id ? "assistant" : "user") as
                | "assistant"
                | "user",
              id: m.id,
              annotations: [
                {
                  userId: m.author.username,
                  messageId: m.id,
                  channelId: m.channel.id,
                  contentLength: m.content.length,
                  timestamp: m.createdAt.toISOString(),
                },
              ],
              createdAt: m.createdAt,
              content: `ID:${m.id} - Author:${m.author.username} - Content:${m.cleanContent}`,
            }) as const,
        ),
      );

    const users = [
      {
        id: message.author.id,
        username: message.author.username || "",
        displayName: message.author.displayName || "",
      },
      {
        id: message.client.user?.id || "",
        username: message.client.user?.username || "",
        displayName: message.client.user?.displayName || "",
      },
    ];

    const systemPrompt = getSystemPrompt({
      users: users || [],
    });

    const payload = [
      {
        role: "system" as const,
        content: systemPrompt,
      },
      ...messages.reverse(),
    ];

    console.debug({
      messages: payload.length,
      users: users?.length,
    });

    // Create tools with context
    const contextualTools = createAnnaTools({
      message: message,
      channel: message.channel,
      userId: message.author.id,
      users: users || [],
    });

    const { text, toolResults, steps } = await generateText({
      model: openrouter("google/gemini-2.5-flash"),
      temperature: 0.7,
      maxOutputTokens: 300,
      tools: contextualTools,
      messages: payload,
      toolChoice: "required",
    });

    console.log("AI response generated", {
      userId: message.author.id,
      responseLength: text?.length || 0,
      toolCallsCount: toolResults?.length || 0,
      stepsCount: steps?.length || 0,
    });
  } catch (error) {
    console.error("Error processing message", { error });
    await message.reply(
      "Hey! I'm having a bit of trouble processing that right now 😅",
    );
  }
});
