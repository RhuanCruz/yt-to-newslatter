import { pgTable, text, timestamp, boolean, integer, primaryKey, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// BETTER AUTH TABLES (Required by Better Auth)
// ============================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  // Additional field from Better Auth config
  credits: integer("credits").default(0),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// ============================================
// APPLICATION TABLES
// ============================================

// User Notification Preferences (Onboarding - Tela 1)
export const userNotificationPreferences = pgTable("user_notification_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  notificationType: text("notification_type").notNull(), // 'email' | 'whatsapp'
  notificationValue: text("notification_value").notNull(), // email address or phone number
  enabled: boolean("enabled").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// YouTube Channels Cache
export const youtubeChannels = pgTable("youtube_channels", {
  id: uuid("id").defaultRandom().primaryKey(),
  channelId: text("channel_id").notNull().unique(), // YouTube channel ID
  channelName: text("channel_name").notNull(),
  channelUrl: text("channel_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  description: text("description"),
  subscriberCount: integer("subscriber_count"),
  videoCount: integer("video_count"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// User Channel Subscriptions (N:N relationship)
export const userChannelSubscriptions = pgTable(
  "user_channel_subscriptions",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    channelId: uuid("channel_id")
      .notNull()
      .references(() => youtubeChannels.id, { onDelete: "cascade" }),
    subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.channelId] }),
  })
);

// Video Summaries (Lista de resumos - Tela 3)
export const videoSummaries = pgTable("video_summaries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  channelId: uuid("channel_id")
    .notNull()
    .references(() => youtubeChannels.id, { onDelete: "cascade" }),
  videoId: text("video_id").notNull(), // YouTube video ID
  videoTitle: text("video_title").notNull(),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  publishedAt: timestamp("published_at").notNull(),
  summaryContent: text("summary_content").notNull(), // AI-generated summary
  isRead: boolean("is_read").notNull().default(false), // For "Read" badge
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================
// RELATIONS
// ============================================

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  notificationPreferences: many(userNotificationPreferences),
  channelSubscriptions: many(userChannelSubscriptions),
  videoSummaries: many(videoSummaries),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const userNotificationPreferencesRelations = relations(
  userNotificationPreferences,
  ({ one }) => ({
    user: one(user, {
      fields: [userNotificationPreferences.userId],
      references: [user.id],
    }),
  })
);

export const youtubeChannelsRelations = relations(youtubeChannels, ({ many }) => ({
  userSubscriptions: many(userChannelSubscriptions),
  videoSummaries: many(videoSummaries),
}));

export const userChannelSubscriptionsRelations = relations(
  userChannelSubscriptions,
  ({ one }) => ({
    user: one(user, {
      fields: [userChannelSubscriptions.userId],
      references: [user.id],
    }),
    channel: one(youtubeChannels, {
      fields: [userChannelSubscriptions.channelId],
      references: [youtubeChannels.id],
    }),
  })
);

export const videoSummariesRelations = relations(videoSummaries, ({ one }) => ({
  user: one(user, {
    fields: [videoSummaries.userId],
    references: [user.id],
  }),
  channel: one(youtubeChannels, {
    fields: [videoSummaries.channelId],
    references: [youtubeChannels.id],
  }),
}));
