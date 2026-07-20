CREATE TABLE `assessment_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`submitter_email` text,
	`name` text NOT NULL,
	`organisation` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`client_type` text NOT NULL,
	`state` text NOT NULL,
	`district` text NOT NULL,
	`address` text NOT NULL,
	`area` text NOT NULL,
	`unit` text NOT NULL,
	`ownership` text NOT NULL,
	`condition` text NOT NULL,
	`water` text NOT NULL,
	`vegetation` text NOT NULL,
	`objective` text NOT NULL,
	`timeline` text NOT NULL,
	`budget` text NOT NULL,
	`maintenance` text NOT NULL,
	`reporting` text NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'New' NOT NULL,
	`internal_note` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `assessment_requests_reference_unique` ON `assessment_requests` (`reference`);--> statement-breakpoint
CREATE TABLE `field_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`reporter_email` text NOT NULL,
	`task_code` text NOT NULL,
	`project_name` text NOT NULL,
	`zone` text NOT NULL,
	`species` text NOT NULL,
	`quantity` integer NOT NULL,
	`maintenance_note` text DEFAULT '' NOT NULL,
	`issue` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'Submitted' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `field_reports_reference_unique` ON `field_reports` (`reference`);--> statement-breakpoint
CREATE TABLE `nursery_inventory` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_email` text NOT NULL,
	`batch_code` text NOT NULL,
	`species` text NOT NULL,
	`size` text NOT NULL,
	`available` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'Review' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `nursery_inventory_batch_code_unique` ON `nursery_inventory` (`batch_code`);--> statement-breakpoint
CREATE TABLE `partner_applications` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`pathway` text NOT NULL,
	`name` text NOT NULL,
	`organisation` text NOT NULL,
	`location` text NOT NULL,
	`contact` text NOT NULL,
	`capacity` text NOT NULL,
	`status` text DEFAULT 'New' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `partner_applications_reference_unique` ON `partner_applications` (`reference`);--> statement-breakpoint
CREATE TABLE `portal_access_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`organisation` text DEFAULT '' NOT NULL,
	`requested_role` text NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'Pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `portal_access_requests_email_unique` ON `portal_access_requests` (`email`);--> statement-breakpoint
CREATE TABLE `portal_members` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`organisation` text DEFAULT '' NOT NULL,
	`role` text NOT NULL,
	`status` text DEFAULT 'Active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `portal_members_email_unique` ON `portal_members` (`email`);