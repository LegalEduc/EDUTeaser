import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const barExamTypeEnum = pgEnum("bar_exam_type", [
  "judicial_exam",
  "bar_exam",
]);
export const instructorStatusEnum = pgEnum("instructor_status", [
  "applied",
  "consent_sent",
  "consented",
]);
export const noticeTargetEnum = pgEnum("notice_target", [
  "all",
  "consented_only",
]);

// instructors
export const instructors = pgTable("instructors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  residentNumber: varchar("resident_number", { length: 255 }).notNull(),
  barExamType: barExamTypeEnum("bar_exam_type").notNull(),
  barExamDetail: varchar("bar_exam_detail", { length: 100 }).notNull(),
  bio: text("bio").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  bankName: varchar("bank_name", { length: 30 }).notNull(),
  accountNumber: varchar("account_number", { length: 255 }).notNull(),
  accountHolder: varchar("account_holder", { length: 50 }).notNull(),
  parkingNeeded: boolean("parking_needed").notNull().default(false),
  carNumber: varchar("car_number", { length: 20 }),
  status: instructorStatusEnum("status").notNull().default("applied"),
  appliedAt: timestamp("applied_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// consent_settings
export const consentSettings = pgTable("consent_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  instructorId: uuid("instructor_id")
    .notNull()
    .references(() => instructors.id),
  lectureTopic: varchar("lecture_topic", { length: 200 }).notNull(),
  feeAmount: integer("fee_amount").notNull(),
  specialTerms: text("special_terms"),
  token: varchar("token", { length: 36 }).notNull().unique(),
  sentAt: timestamp("sent_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// consent_signatures
export const consentSignatures = pgTable("consent_signatures", {
  id: uuid("id").defaultRandom().primaryKey(),
  instructorId: uuid("instructor_id")
    .notNull()
    .references(() => instructors.id),
  consentSettingId: uuid("consent_setting_id")
    .notNull()
    .references(() => consentSettings.id),
  topicConfirmed: boolean("topic_confirmed").notNull(),
  feeAgreed: boolean("fee_agreed").notNull(),
  privacyAgreed: boolean("privacy_agreed").notNull(),
  residentIdAgreed: boolean("resident_id_agreed").notNull(),
  portraitAgreed: boolean("portrait_agreed").notNull().default(false),
  signedName: varchar("signed_name", { length: 50 }).notNull(),
  signedAt: timestamp("signed_at").notNull().defaultNow(),
  ipAddress: varchar("ip_address", { length: 45 }).notNull(),
  pdfUrl: text("pdf_url"),
});

// notices
export const notices = pgTable("notices", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  body: text("body").notNull(),
  target: noticeTargetEnum("target").notNull(),
  sentCount: integer("sent_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
