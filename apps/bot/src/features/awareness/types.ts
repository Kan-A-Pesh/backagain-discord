import { Channel } from "discord.js-selfbot-v13";

export type ChannelType = "text" | "voice" | "thread" | "unknown";
export type ChannelTypes = ChannelType | ChannelTypes[];

export const getChannelType = (channel: Channel): ChannelTypes => {
  const types: ChannelTypes[] = [];

  if (channel.isText()) types.push("text");
  if (channel.isVoice()) types.push("voice");
  if (channel.isThread()) types.push("thread");

  return types.length > 1 ? types : types[0] || "unknown";
};

export const getChannelTypeLabel = (channel: Channel): string => {
  const types = getChannelType(channel);

  if (Array.isArray(types)) {
    return types.join(" & ");
  }

  return types;
};
