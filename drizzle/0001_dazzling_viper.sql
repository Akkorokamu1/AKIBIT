CREATE TABLE `enquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`business` varchar(160) NOT NULL,
	`projectType` enum('Landing page','Business website','Web app','App design','Not sure yet') NOT NULL,
	`businessUrl` varchar(2000),
	`brief` text NOT NULL,
	`privacyNoticeVersion` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`notificationStatus` enum('pending','accepted','failed') NOT NULL DEFAULT 'pending',
	CONSTRAINT `enquiries_id` PRIMARY KEY(`id`)
);
