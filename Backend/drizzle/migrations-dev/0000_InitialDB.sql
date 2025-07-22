CREATE TABLE `detail_user` (
	`id_detail` varchar(225) NOT NULL,
	`id_user` varchar(225) NOT NULL,
	`bio` varchar(225) NOT NULL,
	`website` varchar(225),
	CONSTRAINT `detail_user_id_detail` PRIMARY KEY(`id_detail`)
);
--> statement-breakpoint
CREATE TABLE `email_verify` (
	`id_verify` varchar(225) NOT NULL,
	`email` varchar(225) NOT NULL,
	`code_verify` varchar(225) NOT NULL,
	`is_valid` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`expires_at` timestamp NOT NULL,
	CONSTRAINT `email_verify_id_verify` PRIMARY KEY(`id_verify`)
);
--> statement-breakpoint
CREATE TABLE `login` (
	`id_login` varchar(225) NOT NULL,
	`id_user` varchar(225) NOT NULL,
	`refresh_token` varchar(225) NOT NULL,
	`id_device` varchar(225) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`expires_at` timestamp NOT NULL,
	`type_device` enum('IOS','ANDROID','WEB'),
	CONSTRAINT `login_id_login` PRIMARY KEY(`id_login`)
);
--> statement-breakpoint
CREATE TABLE `reset_password` (
	`id_verify` varchar(225) NOT NULL,
	`email` varchar(225) NOT NULL,
	`code_verify` varchar(225) NOT NULL,
	`is_valid` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`expires_at` timestamp NOT NULL,
	CONSTRAINT `reset_password_id_verify` PRIMARY KEY(`id_verify`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id_user` varchar(225) NOT NULL,
	`username` varchar(225) NOT NULL,
	`displayname` varchar(225) NOT NULL,
	`email` varchar(225) NOT NULL,
	`password` varchar(225) NOT NULL,
	`img_profile` varchar(225) NOT NULL,
	`id_provider` varchar(225),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id_user` PRIMARY KEY(`id_user`)
);
--> statement-breakpoint
ALTER TABLE `detail_user` ADD CONSTRAINT `detail_user_id_user_users_id_user_fk` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `login` ADD CONSTRAINT `login_id_user_users_id_user_fk` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE no action ON UPDATE no action;