import { db } from "@/db";
import {
  userNotificationPreferences,
  youtubeChannels,
  userChannelSubscriptions,
  videoSummaries,
} from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

// ============================================
// USER NOTIFICATION PREFERENCES
// ============================================

export async function getUserNotificationPreference(userId: string) {
  const preferences = await db
    .select()
    .from(userNotificationPreferences)
    .where(eq(userNotificationPreferences.userId, userId))
    .limit(1);

  return preferences[0] || null;
}

export async function saveNotificationPreference(
  userId: string,
  type: "email" | "whatsapp",
  value: string
) {
  // Check if preference already exists
  const existing = await getUserNotificationPreference(userId);

  if (existing) {
    // Update existing preference
    await db
      .update(userNotificationPreferences)
      .set({
        notificationType: type,
        notificationValue: value,
        updatedAt: new Date(),
      })
      .where(eq(userNotificationPreferences.userId, userId));
  } else {
    // Insert new preference
    await db.insert(userNotificationPreferences).values({
      userId,
      notificationType: type,
      notificationValue: value,
      enabled: true,
    });
  }
}

// ============================================
// YOUTUBE CHANNELS
// ============================================

export async function getOrCreateChannel(channelData: {
  channelId: string;
  channelName: string;
  channelUrl: string;
  thumbnailUrl?: string;
  description?: string;
}) {
  // Check if channel exists
  const existing = await db
    .select()
    .from(youtubeChannels)
    .where(eq(youtubeChannels.channelId, channelData.channelId))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  // Create new channel
  const [newChannel] = await db
    .insert(youtubeChannels)
    .values(channelData)
    .returning();

  return newChannel;
}

export async function getUserChannels(userId: string) {
  const channels = await db
    .select({
      id: youtubeChannels.id,
      channelId: youtubeChannels.channelId,
      channelName: youtubeChannels.channelName,
      channelUrl: youtubeChannels.channelUrl,
      thumbnailUrl: youtubeChannels.thumbnailUrl,
      description: youtubeChannels.description,
      subscribedAt: userChannelSubscriptions.subscribedAt,
    })
    .from(userChannelSubscriptions)
    .innerJoin(
      youtubeChannels,
      eq(userChannelSubscriptions.channelId, youtubeChannels.id)
    )
    .where(eq(userChannelSubscriptions.userId, userId))
    .orderBy(desc(userChannelSubscriptions.subscribedAt));

  return channels;
}

export async function addChannelSubscription(
  userId: string,
  channelData: {
    channelId: string;
    channelName: string;
    channelUrl: string;
    thumbnailUrl?: string;
    description?: string;
  }
) {
  // Get or create the channel
  const channel = await getOrCreateChannel(channelData);

  // Check if subscription already exists
  const existing = await db
    .select()
    .from(userChannelSubscriptions)
    .where(
      and(
        eq(userChannelSubscriptions.userId, userId),
        eq(userChannelSubscriptions.channelId, channel.id)
      )
    )
    .limit(1);

  if (existing[0]) {
    return { channel, alreadySubscribed: true };
  }

  // Create subscription
  await db.insert(userChannelSubscriptions).values({
    userId,
    channelId: channel.id,
  });

  return { channel, alreadySubscribed: false };
}

export async function removeChannelSubscription(
  userId: string,
  channelId: string
) {
  await db
    .delete(userChannelSubscriptions)
    .where(
      and(
        eq(userChannelSubscriptions.userId, userId),
        eq(userChannelSubscriptions.channelId, channelId)
      )
    );
}

// ============================================
// VIDEO SUMMARIES
// ============================================

export async function getChannelSummaries(channelId: string, userId: string) {
  const summaries = await db
    .select()
    .from(videoSummaries)
    .where(
      and(
        eq(videoSummaries.channelId, channelId),
        eq(videoSummaries.userId, userId)
      )
    )
    .orderBy(desc(videoSummaries.publishedAt));

  return summaries;
}

export async function createVideoSummary(data: {
  userId: string;
  channelId: string;
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  thumbnailUrl?: string;
  publishedAt: Date;
  summaryContent: string;
}) {
  const [summary] = await db.insert(videoSummaries).values(data).returning();

  return summary;
}

export async function markSummaryAsRead(summaryId: string, userId: string) {
  await db
    .update(videoSummaries)
    .set({ isRead: true, updatedAt: new Date() })
    .where(
      and(
        eq(videoSummaries.id, summaryId),
        eq(videoSummaries.userId, userId)
      )
    );
}

export async function markSummaryAsUnread(summaryId: string, userId: string) {
  await db
    .update(videoSummaries)
    .set({ isRead: false, updatedAt: new Date() })
    .where(
      and(
        eq(videoSummaries.id, summaryId),
        eq(videoSummaries.userId, userId)
      )
    );
}

export async function getSummaryById(summaryId: string, userId: string) {
  const [summary] = await db
    .select()
    .from(videoSummaries)
    .where(
      and(
        eq(videoSummaries.id, summaryId),
        eq(videoSummaries.userId, userId)
      )
    )
    .limit(1);

  return summary || null;
}
