import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
};

export const assessmentRequests = sqliteTable("assessment_requests", {
  id: text("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  submitterEmail: text("submitter_email"),
  name: text("name").notNull(),
  organisation: text("organisation").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  clientType: text("client_type").notNull(),
  state: text("state").notNull(),
  district: text("district").notNull(),
  address: text("address").notNull(),
  area: text("area").notNull(),
  unit: text("unit").notNull(),
  ownership: text("ownership").notNull(),
  condition: text("condition").notNull(),
  water: text("water").notNull(),
  vegetation: text("vegetation").notNull(),
  objective: text("objective").notNull(),
  timeline: text("timeline").notNull(),
  budget: text("budget").notNull(),
  maintenance: text("maintenance").notNull(),
  reporting: text("reporting").notNull(),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("New"),
  internalNote: text("internal_note").notNull().default(""),
  ...timestamps,
});

export const partnerApplications = sqliteTable("partner_applications", {
  id: text("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  pathway: text("pathway").notNull(),
  name: text("name").notNull(),
  organisation: text("organisation").notNull(),
  location: text("location").notNull(),
  contact: text("contact").notNull(),
  capacity: text("capacity").notNull(),
  status: text("status").notNull().default("New"),
  ...timestamps,
});

export const portalMembers = sqliteTable("portal_members", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull().default(""),
  organisation: text("organisation").notNull().default(""),
  role: text("role").notNull(),
  status: text("status").notNull().default("Active"),
  ...timestamps,
});

export const portalAccessRequests = sqliteTable("portal_access_requests", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull().default(""),
  organisation: text("organisation").notNull().default(""),
  requestedRole: text("requested_role").notNull(),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("Pending"),
  ...timestamps,
});

export const nurseryInventory = sqliteTable("nursery_inventory", {
  id: text("id").primaryKey(),
  ownerEmail: text("owner_email").notNull(),
  batchCode: text("batch_code").notNull().unique(),
  species: text("species").notNull(),
  size: text("size").notNull(),
  available: integer("available").notNull().default(0),
  status: text("status").notNull().default("Review"),
  ...timestamps,
});

export const fieldReports = sqliteTable("field_reports", {
  id: text("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  reporterEmail: text("reporter_email").notNull(),
  taskCode: text("task_code").notNull(),
  projectName: text("project_name").notNull(),
  zone: text("zone").notNull(),
  species: text("species").notNull(),
  quantity: integer("quantity").notNull(),
  maintenanceNote: text("maintenance_note").notNull().default(""),
  issue: text("issue").notNull().default(""),
  status: text("status").notNull().default("Submitted"),
  ...timestamps,
});

export const contactMessages = sqliteTable("contact_messages", {
  id: text("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  name: text("name").notNull(),
  organisation: text("organisation").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("New"),
  ...timestamps,
});

export const siteContent = sqliteTable("site_content", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedBy: text("updated_by").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const mediaAssets = sqliteTable("media_assets", {
  id: text("id").primaryKey(),
  objectKey: text("object_key").notNull().unique(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  altText: text("alt_text").notNull().default(""),
  uploadedBy: text("uploaded_by").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
