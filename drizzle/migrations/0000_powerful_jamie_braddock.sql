CREATE TABLE `post` (
	`ex_id` integer PRIMARY KEY NOT NULL,
	`id` integer NOT NULL,
	`res_id` integer NOT NULL,
	`name` text NOT NULL,
	`mail` text,
	`message` text NOT NULL,
	`created_at` text NOT NULL,
	`ip_addr` text NOT NULL,
	`isDelete` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `threads`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `threads` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`created_at` text NOT NULL,
	`ip_addr` text NOT NULL,
	`isDelete` integer DEFAULT false NOT NULL
);
