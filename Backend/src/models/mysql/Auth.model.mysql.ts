import {
  mysqlTable,
  varchar,
  mysqlEnum,
  boolean,
  MySqlEnumColumn,
  timestamp,
} from "drizzle-orm/mysql-core";

export const User = mysqlTable("users", {
  id_user: varchar("id_user", { length: 225 }).primaryKey(),
  username: varchar("username", { length: 225 }).notNull(),
  displayname: varchar("displayname", { length: 225 }).notNull(),
  email: varchar("email", { length: 225 }).notNull(),
  password: varchar("password", { length: 225 }).notNull(),
  img_profile: varchar("img_profile", { length: 225 }).notNull(),
  id_provider: varchar("id_provider", { length: 225 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const DetailUser = mysqlTable("detail_user", {
  id_detail: varchar("id_detail", { length: 225 }).primaryKey(),
  id_user: varchar("id_user", { length: 225 })
    .notNull()
    .references(() => User.id_user),
  bio: varchar("bio", { length: 225 }).notNull(),
  website: varchar("website", { length: 225 }),
});

export const EmailVerify = mysqlTable("email_verify", {
  id_verify: varchar("id_verify", { length: 225 }).primaryKey(),
  email: varchar("email", { length: 225 }).notNull(),
  code_verify: varchar("code_verify", { length: 225 }).notNull(),
  is_valid: boolean("is_valid").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  expires_at: timestamp("expires_at").notNull(),
});

export const ResetPassword = mysqlTable("reset_password", {
  id_verify: varchar("id_verify", { length: 225 }).primaryKey(),
  email: varchar("email", { length: 225 }).notNull(),
  code_verify: varchar("code_verify", { length: 225 }).notNull(),
  is_valid: boolean("is_valid").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  expires_at: timestamp("expires_at").notNull(),
});

export const Login = mysqlTable("login", {
  id_login: varchar("id_login", { length: 225 }).primaryKey(),
  id_user: varchar("id_user", { length: 225 })
    .notNull()
    .references(() => User.id_user),
  refresh_token: varchar("refresh_token", { length: 225 }).notNull(),
  id_device: varchar("id_device", { length: 225 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  expires_at: timestamp("expires_at").notNull(),
  type_device: mysqlEnum("type_device", ["IOS", "ANDROID", "WEB"]),
});

// RELATION TABLE TO TABLE
