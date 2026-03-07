-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 29, 2025 at 06:22 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tms`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_issues`
--

CREATE TABLE `tbl_issues` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `progress` decimal(5,2) DEFAULT 0.00,
  `description` text DEFAULT NULL,
  `start_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `due_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status_id` bigint(20) UNSIGNED DEFAULT NULL,
  `priority_id` bigint(20) UNSIGNED DEFAULT NULL,
  `assignee` bigint(20) UNSIGNED DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `tracker_id` bigint(20) UNSIGNED DEFAULT NULL,
  `label_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_issue_categories`
--

CREATE TABLE `tbl_issue_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_issue_labels`
--

CREATE TABLE `tbl_issue_labels` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_issue_notes`
--

CREATE TABLE `tbl_issue_notes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `issue_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_issue_priorities`
--

CREATE TABLE `tbl_issue_priorities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_issue_status`
--

CREATE TABLE `tbl_issue_status` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_issue_trackers`
--

CREATE TABLE `tbl_issue_trackers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_members`
--

CREATE TABLE `tbl_members` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_notifications`
--

CREATE TABLE `tbl_notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED DEFAULT NULL,
  `sender_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `massage` varchar(1000) NOT NULL,
  `is_globle` tinyint(3) UNSIGNED DEFAULT NULL COMMENT '1 for release to globle & 2 for release to private',
  `type` varchar(50) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_notification_recipients`
--

CREATE TABLE `tbl_notification_recipients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_read` tinyint(4) NOT NULL COMMENT '1 for read & 2 for unread',
  `read_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_noti_recipient_notification`
--

CREATE TABLE `tbl_noti_recipient_notification` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `notification_id` bigint(20) UNSIGNED DEFAULT NULL,
  `noti_recipient_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_project`
--

CREATE TABLE `tbl_project` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `status_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_project_activities`
--

CREATE TABLE `tbl_project_activities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `actor` bigint(20) UNSIGNED DEFAULT NULL,
  `project_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `activity` text NOT NULL,
  `acted_on` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_project_files`
--

CREATE TABLE `tbl_project_files` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `resource_id` bigint(20) UNSIGNED DEFAULT NULL,
  `file` varchar(1000) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_project_resources`
--

CREATE TABLE `tbl_project_resources` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `note` text DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_project_status`
--

CREATE TABLE `tbl_project_status` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_roles`
--

CREATE TABLE `tbl_roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_sub_issues`
--

CREATE TABLE `tbl_sub_issues` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `progress` decimal(5,2) DEFAULT 0.00,
  `start_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `due_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `issue_comment` text DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `issue_id` bigint(20) UNSIGNED DEFAULT NULL,
  `priority_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status_id` bigint(20) UNSIGNED DEFAULT NULL,
  `label_id` bigint(20) UNSIGNED DEFAULT NULL,
  `tracker_id` bigint(20) UNSIGNED DEFAULT NULL,
  `assignee` bigint(20) UNSIGNED DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `dis_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avarta` varchar(500) DEFAULT 'default_photo.jpg',
  `description` varchar(1000) DEFAULT NULL,
  `last_login_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` tinyint(4) DEFAULT NULL COMMENT '1 for active & 2 for inactive',
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_settings`
--

CREATE TABLE `tbl_user_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `setting_key` varchar(255) NOT NULL,
  `setting_value` varchar(255) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_issues`
--
ALTER TABLE `tbl_issues`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ISSUE_CATEGORY_ID_FK` (`category_id`),
  ADD KEY `ISSUE_STATUS_ID_FK` (`status_id`),
  ADD KEY `ISSUE_PRIORITY_ID_FK` (`priority_id`),
  ADD KEY `ISSUE_ASSIGNEE_MEMBER_ID_FK` (`assignee`),
  ADD KEY `ISSUE_CREATEDBY_MEMBER_ID_FK` (`created_by`),
  ADD KEY `ISSUE_UPDATEDBY_MEMBER_ID_FK` (`updated_by`),
  ADD KEY `ISSUE_TRACKER_ID_FK` (`tracker_id`),
  ADD KEY `ISSUE_LABEL_ID_FK` (`label_id`);

--
-- Indexes for table `tbl_issue_categories`
--
ALTER TABLE `tbl_issue_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ISSUE_CATEGORY_PROJECT_ID_FK` (`project_id`);

--
-- Indexes for table `tbl_issue_labels`
--
ALTER TABLE `tbl_issue_labels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_issue_notes`
--
ALTER TABLE `tbl_issue_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ISSUEDOCUMENT_ISSUE_ID_FK` (`issue_id`);

--
-- Indexes for table `tbl_issue_priorities`
--
ALTER TABLE `tbl_issue_priorities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_issue_status`
--
ALTER TABLE `tbl_issue_status`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ISSUE_STATUS_PROJECT_ID_FK` (`project_id`);

--
-- Indexes for table `tbl_issue_trackers`
--
ALTER TABLE `tbl_issue_trackers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_members`
--
ALTER TABLE `tbl_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `MEMBER_PROJECT_ID_FK` (`project_id`),
  ADD KEY `MEMBER_USER_ID_FK` (`user_id`);

--
-- Indexes for table `tbl_notifications`
--
ALTER TABLE `tbl_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `NOTIFICATION_PROJECT_ID_FK` (`project_id`);

--
-- Indexes for table `tbl_notification_recipients`
--
ALTER TABLE `tbl_notification_recipients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_noti_recipient_notification`
--
ALTER TABLE `tbl_noti_recipient_notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `NOTIRECIPIENT_NOTI_NOTIFICATION_ID_FK` (`notification_id`),
  ADD KEY `NOTIRECIPIENT_NOTI_NOTIRECIPIENT_ID_FK` (`noti_recipient_id`);

--
-- Indexes for table `tbl_project`
--
ALTER TABLE `tbl_project`
  ADD PRIMARY KEY (`id`),
  ADD KEY `PROJECT_STATUS_ID_FK` (`status_id`);

--
-- Indexes for table `tbl_project_activities`
--
ALTER TABLE `tbl_project_activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `PROJECTACTIVITY_ACTORMEMBER_ID_FK` (`actor`),
  ADD KEY `PROJECTACTIVITY_PROJECT_ID_FK` (`project_id`);

--
-- Indexes for table `tbl_project_files`
--
ALTER TABLE `tbl_project_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `PROJECTFILE_RESOURCE_ID_FK` (`resource_id`);

--
-- Indexes for table `tbl_project_resources`
--
ALTER TABLE `tbl_project_resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `PROJECTRESOURCE_PROJECT_ID_FK` (`project_id`);

--
-- Indexes for table `tbl_project_status`
--
ALTER TABLE `tbl_project_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_roles`
--
ALTER TABLE `tbl_roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_sub_issues`
--
ALTER TABLE `tbl_sub_issues`
  ADD PRIMARY KEY (`id`),
  ADD KEY `SUBISSUE_ISSUE_ID_FK` (`issue_id`),
  ADD KEY `SUBISSUE_STATUS_ID_FK` (`status_id`),
  ADD KEY `SUBISSUE_PRIORITY_ID_FK` (`priority_id`),
  ADD KEY `SUBISSUE_ASSIGNEE_MEMBER_ID_FK` (`assignee`),
  ADD KEY `SUBISSUE_CREATEDBY_MEMBER_ID_FK` (`created_by`),
  ADD KEY `SUBISSUE_UPDATEDBY_MEMBER_ID_FK` (`updated_by`),
  ADD KEY `SUBISSUE_TRACKER_ID_FK` (`tracker_id`),
  ADD KEY `SUBISSUE_LABEL_ID_FK` (`label_id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `USER_ROLE_ID_FK` (`role_id`);

--
-- Indexes for table `tbl_user_settings`
--
ALTER TABLE `tbl_user_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `USERSETTING_USER_ID_FK` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_issues`
--
ALTER TABLE `tbl_issues`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_issue_categories`
--
ALTER TABLE `tbl_issue_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_issue_labels`
--
ALTER TABLE `tbl_issue_labels`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_issue_notes`
--
ALTER TABLE `tbl_issue_notes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_issue_priorities`
--
ALTER TABLE `tbl_issue_priorities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_issue_status`
--
ALTER TABLE `tbl_issue_status`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_issue_trackers`
--
ALTER TABLE `tbl_issue_trackers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_members`
--
ALTER TABLE `tbl_members`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_notifications`
--
ALTER TABLE `tbl_notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_notification_recipients`
--
ALTER TABLE `tbl_notification_recipients`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_noti_recipient_notification`
--
ALTER TABLE `tbl_noti_recipient_notification`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_project`
--
ALTER TABLE `tbl_project`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_project_activities`
--
ALTER TABLE `tbl_project_activities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_project_files`
--
ALTER TABLE `tbl_project_files`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_project_resources`
--
ALTER TABLE `tbl_project_resources`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_project_status`
--
ALTER TABLE `tbl_project_status`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_roles`
--
ALTER TABLE `tbl_roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_sub_issues`
--
ALTER TABLE `tbl_sub_issues`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_user_settings`
--
ALTER TABLE `tbl_user_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_issues`
--
ALTER TABLE `tbl_issues`
  ADD CONSTRAINT `ISSUE_ASSIGNEE_MEMBER_ID_FK` FOREIGN KEY (`assignee`) REFERENCES `tbl_members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ISSUE_CATEGORY_ID_FK` FOREIGN KEY (`category_id`) REFERENCES `tbl_issue_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ISSUE_CREATEDBY_MEMBER_ID_FK` FOREIGN KEY (`created_by`) REFERENCES `tbl_members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ISSUE_LABEL_ID_FK` FOREIGN KEY (`label_id`) REFERENCES `tbl_issue_labels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ISSUE_PRIORITY_ID_FK` FOREIGN KEY (`priority_id`) REFERENCES `tbl_issue_priorities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ISSUE_STATUS_ID_FK` FOREIGN KEY (`status_id`) REFERENCES `tbl_issue_status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ISSUE_TRACKER_ID_FK` FOREIGN KEY (`tracker_id`) REFERENCES `tbl_issue_trackers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ISSUE_UPDATEDBY_MEMBER_ID_FK` FOREIGN KEY (`updated_by`) REFERENCES `tbl_members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_issue_categories`
--
ALTER TABLE `tbl_issue_categories`
  ADD CONSTRAINT `ISSUE_CATEGORY_PROJECT_ID_FK` FOREIGN KEY (`project_id`) REFERENCES `tbl_project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_issue_notes`
--
ALTER TABLE `tbl_issue_notes`
  ADD CONSTRAINT `ISSUEDOCUMENT_ISSUE_ID_FK` FOREIGN KEY (`issue_id`) REFERENCES `tbl_issues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_issue_status`
--
ALTER TABLE `tbl_issue_status`
  ADD CONSTRAINT `ISSUE_STATUS_PROJECT_ID_FK` FOREIGN KEY (`project_id`) REFERENCES `tbl_project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_members`
--
ALTER TABLE `tbl_members`
  ADD CONSTRAINT `MEMBER_PROJECT_ID_FK` FOREIGN KEY (`project_id`) REFERENCES `tbl_project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `MEMBER_USER_ID_FK` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_notifications`
--
ALTER TABLE `tbl_notifications`
  ADD CONSTRAINT `NOTIFICATION_PROJECT_ID_FK` FOREIGN KEY (`project_id`) REFERENCES `tbl_project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_noti_recipient_notification`
--
ALTER TABLE `tbl_noti_recipient_notification`
  ADD CONSTRAINT `NOTIRECIPIENT_NOTI_NOTIFICATION_ID_FK` FOREIGN KEY (`notification_id`) REFERENCES `tbl_notifications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `NOTIRECIPIENT_NOTI_NOTIRECIPIENT_ID_FK` FOREIGN KEY (`noti_recipient_id`) REFERENCES `tbl_notification_recipients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_project`
--
ALTER TABLE `tbl_project`
  ADD CONSTRAINT `PROJECT_STATUS_ID_FK` FOREIGN KEY (`status_id`) REFERENCES `tbl_project_status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_project_activities`
--
ALTER TABLE `tbl_project_activities`
  ADD CONSTRAINT `PROJECTACTIVITY_ACTORMEMBER_ID_FK` FOREIGN KEY (`actor`) REFERENCES `tbl_members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `PROJECTACTIVITY_PROJECT_ID_FK` FOREIGN KEY (`project_id`) REFERENCES `tbl_project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_project_files`
--
ALTER TABLE `tbl_project_files`
  ADD CONSTRAINT `PROJECTFILE_RESOURCE_ID_FK` FOREIGN KEY (`resource_id`) REFERENCES `tbl_project_resources` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_project_resources`
--
ALTER TABLE `tbl_project_resources`
  ADD CONSTRAINT `PROJECTRESOURCE_PROJECT_ID_FK` FOREIGN KEY (`project_id`) REFERENCES `tbl_project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_sub_issues`
--
ALTER TABLE `tbl_sub_issues`
  ADD CONSTRAINT `SUBISSUE_ASSIGNEE_MEMBER_ID_FK` FOREIGN KEY (`assignee`) REFERENCES `tbl_members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `SUBISSUE_CREATEDBY_MEMBER_ID_FK` FOREIGN KEY (`created_by`) REFERENCES `tbl_members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `SUBISSUE_ISSUE_ID_FK` FOREIGN KEY (`issue_id`) REFERENCES `tbl_issues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `SUBISSUE_LABEL_ID_FK` FOREIGN KEY (`label_id`) REFERENCES `tbl_issue_labels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `SUBISSUE_PRIORITY_ID_FK` FOREIGN KEY (`priority_id`) REFERENCES `tbl_issue_priorities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `SUBISSUE_STATUS_ID_FK` FOREIGN KEY (`status_id`) REFERENCES `tbl_issue_status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `SUBISSUE_TRACKER_ID_FK` FOREIGN KEY (`tracker_id`) REFERENCES `tbl_issue_trackers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `SUBISSUE_UPDATEDBY_MEMBER_ID_FK` FOREIGN KEY (`updated_by`) REFERENCES `tbl_members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD CONSTRAINT `USER_ROLE_ID_FK` FOREIGN KEY (`role_id`) REFERENCES `tbl_roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_user_settings`
--
ALTER TABLE `tbl_user_settings`
  ADD CONSTRAINT `USERSETTING_USER_ID_FK` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
