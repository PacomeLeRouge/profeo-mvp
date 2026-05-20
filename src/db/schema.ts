import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { SUBJECTS } from "@/lib/subjects";

export const userRoleEnum = pgEnum("user_role", ["student", "tutor"]);

export const subjectEnum = pgEnum("subject", [...SUBJECTS]);

export const formatEnum = pgEnum("lesson_format", [
  "Online",
  "In-person",
  "Both",
]);

export const requestStatusEnum = pgEnum("request_status", [
  "Pending",
  "Confirmed",
  "Declined",
]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: userRoleEnum("role"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const studentProfiles = pgTable("student_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  age: integer("age"),
  educationLevel: text("education_level").notNull(),
  institution: text("institution").notNull(),
  subjectsOfInterest: subjectEnum("subjects_of_interest").array().notNull(),
  contactEmail: text("contact_email").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const tutorProfiles = pgTable("tutor_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  age: integer("age"),
  subjects: subjectEnum("subjects").array().notNull(),
  hourlyRate: integer("hourly_rate").notNull(),
  format: formatEnum("format").notNull(),
  bio: text("bio").notNull(),
  availability: text("availability").notNull(),
  educationLevel: text("education_level").notNull(),
  institution: text("institution").notNull(),
  contactEmail: text("contact_email").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const lessonRequests = pgTable("lesson_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentUserId: text("student_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tutorProfileId: uuid("tutor_profile_id")
    .notNull()
    .references(() => tutorProfiles.id, { onDelete: "cascade" }),
  tutorName: text("tutor_name").notNull(),
  studentName: text("student_name").notNull(),
  studentContactEmail: text("student_contact_email").notNull(),
  tutorContactEmail: text("tutor_contact_email").notNull(),
  subject: subjectEnum("subject").notNull(),
  status: requestStatusEnum("status").default("Pending").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
