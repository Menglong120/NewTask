-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 06, 2026 at 04:59 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
-- Table structure for table `tbl_departments`
--

CREATE TABLE `tbl_departments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_departments`
--

INSERT INTO `tbl_departments` (`id`, `name`, `description`, `created_on`, `updated_on`) VALUES
(1, 'IT', 'IT', '2026-04-22 17:09:23', '2026-04-22 17:09:23');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_issues`
--

CREATE TABLE `tbl_issues` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `progress` decimal(5,2) DEFAULT 0.00,
  `description` text DEFAULT NULL,
  `start_date` timestamp NULL DEFAULT NULL,
  `due_date` timestamp NULL DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status_id` bigint(20) UNSIGNED DEFAULT NULL,
  `priority_id` bigint(20) UNSIGNED DEFAULT NULL,
  `assignee` bigint(20) UNSIGNED DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `tracker_id` bigint(20) UNSIGNED DEFAULT NULL,
  `label_id` bigint(20) UNSIGNED DEFAULT NULL,
  `project_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_issues`
--

INSERT INTO `tbl_issues` (`id`, `name`, `progress`, `description`, `start_date`, `due_date`, `created_on`, `updated_on`, `status_id`, `priority_id`, `assignee`, `created_by`, `updated_by`, `tracker_id`, `label_id`, `project_id`) VALUES
(4, 'dfsgsfd', 0.00, '', '2026-04-30 17:00:00', '2026-05-01 17:00:00', '2026-04-30 15:46:34', '2026-04-30 15:46:34', 18, 17, 18, 1, 1, 17, 17, 6);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_issue_activity`
--

CREATE TABLE `tbl_issue_activity` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `issue_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `activity` text DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_issue_activity`
--

INSERT INTO `tbl_issue_activity` (`id`, `issue_id`, `user_id`, `title`, `activity`, `created_on`) VALUES
(1, 4, 1, 'Issue Action', 'created an new issue - dfsgsfd', '2026-04-30 15:46:34');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_issue_labels`
--

CREATE TABLE `tbl_issue_labels` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `project_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_issue_labels`
--

INSERT INTO `tbl_issue_labels` (`id`, `name`, `description`, `created_on`, `updated_on`, `project_id`) VALUES
(1, 'Frontend', 'Default Frontend label', '2026-04-29 15:38:09', '2026-04-29 15:38:09', 1),
(2, 'Backend', 'Default Backend label', '2026-04-29 15:38:09', '2026-04-29 15:38:09', 1),
(3, 'Design', 'Default Design label', '2026-04-29 15:38:09', '2026-04-29 15:38:09', 1),
(10, 'Frontend', 'Default Frontend label', '2026-04-29 15:42:32', '2026-04-29 15:42:32', 4),
(11, 'Backend', 'Default Backend label', '2026-04-29 15:42:32', '2026-04-29 15:42:32', 4),
(12, 'Design', 'Default Design label', '2026-04-29 15:42:32', '2026-04-29 15:42:32', 4),
(13, 'Frontend', 'Default Frontend label', '2026-04-29 16:33:56', '2026-04-29 16:33:56', 5),
(14, 'Backend', 'Default Backend label', '2026-04-29 16:33:56', '2026-04-29 16:33:56', 5),
(15, 'Design', 'Default Design label', '2026-04-29 16:33:56', '2026-04-29 16:33:56', 5),
(16, 'Frontend', 'Default Frontend label', '2026-04-30 15:34:02', '2026-04-30 15:34:02', 6),
(17, 'Backend', 'Default Backend label', '2026-04-30 15:34:02', '2026-04-30 15:34:02', 6),
(18, 'Design', 'Default Design label', '2026-04-30 15:34:02', '2026-04-30 15:34:02', 6);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_issue_notes`
--

CREATE TABLE `tbl_issue_notes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `issue_id` bigint(20) UNSIGNED DEFAULT NULL,
  `notes` longtext DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `noter` bigint(20) UNSIGNED NOT NULL
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
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `project_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_issue_priorities`
--

INSERT INTO `tbl_issue_priorities` (`id`, `name`, `description`, `created_on`, `updated_on`, `project_id`) VALUES
(1, 'Low', 'Default Low priority', '2026-04-29 15:38:09', '2026-04-29 15:38:09', 1),
(2, 'Medium', 'Default Medium priority', '2026-04-29 15:38:09', '2026-04-29 15:38:09', 1),
(3, 'High', 'Default High priority', '2026-04-29 15:38:09', '2026-04-29 15:38:09', 1),
(10, 'Low', 'Default Low priority', '2026-04-29 15:42:32', '2026-04-29 15:42:32', 4),
(11, 'Medium', 'Default Medium priority', '2026-04-29 15:42:32', '2026-04-29 15:42:32', 4),
(12, 'High', 'Default High priority', '2026-04-29 15:42:32', '2026-04-29 15:42:32', 4),
(13, 'Low', 'Default Low priority', '2026-04-29 16:33:56', '2026-04-29 16:33:56', 5),
(14, 'Medium', 'Default Medium priority', '2026-04-29 16:33:56', '2026-04-29 16:33:56', 5),
(15, 'High', 'Default High priority', '2026-04-29 16:33:56', '2026-04-29 16:33:56', 5),
(16, 'Low', 'Default Low priority', '2026-04-30 15:34:02', '2026-04-30 15:34:02', 6),
(17, 'Medium', 'Default Medium priority', '2026-04-30 15:34:02', '2026-04-30 15:34:02', 6),
(18, 'High', 'Default High priority', '2026-04-30 15:34:02', '2026-04-30 15:34:02', 6);

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

--
-- Dumping data for table `tbl_issue_status`
--

INSERT INTO `tbl_issue_status` (`id`, `project_id`, `name`, `description`, `created_on`, `updated_on`) VALUES
(2, 1, 'To Do', 'Default To Do status', '2026-04-29 15:38:09', '2026-04-29 15:38:09'),
(3, 1, 'In Progress', 'Default In Progress status', '2026-04-29 15:38:09', '2026-04-29 15:38:09'),
(4, 1, 'Done', 'Default Done status', '2026-04-29 15:38:09', '2026-04-29 15:38:09'),
(11, 4, 'To Do', 'Default To Do status', '2026-04-29 15:42:32', '2026-04-29 15:42:32'),
(12, 4, 'In Progress', 'Default In Progress status', '2026-04-29 15:42:32', '2026-04-29 15:42:32'),
(13, 4, 'Done', 'Default Done status', '2026-04-29 15:42:32', '2026-04-29 15:42:32'),
(14, 5, 'To Do', 'Default To Do status', '2026-04-29 16:33:56', '2026-04-29 16:33:56'),
(15, 5, 'In Progress', 'Default In Progress status', '2026-04-29 16:33:56', '2026-04-29 16:33:56'),
(16, 5, 'Done', 'Default Done status', '2026-04-29 16:33:56', '2026-04-29 16:33:56'),
(17, 6, 'To Do', 'Default To Do status', '2026-04-30 15:34:02', '2026-04-30 15:34:02'),
(18, 6, 'In Progress', 'Default In Progress status', '2026-04-30 15:34:02', '2026-04-30 15:34:02'),
(19, 6, 'Done', 'Default Done status', '2026-04-30 15:34:02', '2026-04-30 15:34:02');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_issue_trackers`
--

CREATE TABLE `tbl_issue_trackers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `project_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_issue_trackers`
--

INSERT INTO `tbl_issue_trackers` (`id`, `name`, `description`, `created_on`, `updated_on`, `project_id`) VALUES
(1, 'Bug Tracker', 'Default Bug Tracker', '2026-04-29 15:38:09', '2026-04-29 15:38:09', 1),
(2, 'Feature Tracker', 'Default Feature Tracker', '2026-04-29 15:38:09', '2026-04-29 15:38:09', 1),
(3, 'Task Tracker', 'Default Task Tracker', '2026-04-29 15:38:09', '2026-04-29 15:38:09', 1),
(10, 'Bug Tracker', 'Default Bug Tracker', '2026-04-29 15:42:32', '2026-04-29 15:42:32', 4),
(11, 'Feature Tracker', 'Default Feature Tracker', '2026-04-29 15:42:32', '2026-04-29 15:42:32', 4),
(12, 'Task Tracker', 'Default Task Tracker', '2026-04-29 15:42:32', '2026-04-29 15:42:32', 4),
(13, 'Bug Tracker', 'Default Bug Tracker', '2026-04-29 16:33:56', '2026-04-29 16:33:56', 5),
(14, 'Feature Tracker', 'Default Feature Tracker', '2026-04-29 16:33:56', '2026-04-29 16:33:56', 5),
(15, 'Task Tracker', 'Default Task Tracker', '2026-04-29 16:33:56', '2026-04-29 16:33:56', 5),
(16, 'Bug Tracker', 'Default Bug Tracker', '2026-04-30 15:34:02', '2026-04-30 15:34:02', 6),
(17, 'Feature Tracker', 'Default Feature Tracker', '2026-04-30 15:34:02', '2026-04-30 15:34:02', 6),
(18, 'Task Tracker', 'Default Task Tracker', '2026-04-30 15:34:02', '2026-04-30 15:34:02', 6);

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

--
-- Dumping data for table `tbl_members`
--

INSERT INTO `tbl_members` (`id`, `project_id`, `user_id`, `created_on`) VALUES
(26, 5, 21, '2026-04-29 16:33:56'),
(27, 5, 19, '2026-04-29 16:33:56'),
(28, 6, 20, '2026-04-30 15:34:02'),
(29, 6, 18, '2026-04-30 15:34:02');

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
  `department_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_project`
--

INSERT INTO `tbl_project` (`id`, `status_id`, `department_id`, `name`, `description`, `start_date`, `end_date`, `created_on`, `updated_on`) VALUES
(1, 1, 1, 'Testing Project', NULL, '2026-04-29', '2026-05-29', '2026-04-29 15:38:09', '2026-04-29 15:38:09'),
(4, 1, 1, 'New Project', NULL, '2026-04-28', '2026-04-29', '2026-04-29 15:42:32', '2026-04-29 15:42:32'),
(5, 1, 1, 'Add Member', NULL, '2026-04-28', '2026-04-29', '2026-04-29 16:33:56', '2026-04-29 16:33:56'),
(6, 2, 1, 'Testing', NULL, '2026-04-30', '2026-05-01', '2026-04-30 15:34:02', '2026-04-30 15:34:02');

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
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `file_name` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_project_resources`
--

CREATE TABLE `tbl_project_resources` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `note` longtext DEFAULT NULL,
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

--
-- Dumping data for table `tbl_project_status`
--

INSERT INTO `tbl_project_status` (`id`, `title`, `description`, `created_on`, `updated_on`) VALUES
(1, 'To Start', NULL, '2025-03-06 02:16:38', '2025-11-14 08:30:28'),
(2, 'In Progress', 'Project is on working.', '2025-03-06 02:16:38', '2025-03-06 02:16:38'),
(3, 'Done', 'Project has been completed.', '2025-03-06 02:16:38', '2025-03-06 02:16:38'),
(11, 'Close', NULL, '2025-11-14 02:59:23', '2025-11-15 01:15:07');

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

--
-- Dumping data for table `tbl_roles`
--

INSERT INTO `tbl_roles` (`id`, `name`, `description`, `created_on`, `updated_on`) VALUES
(1, 'Super Admin', 'A person who control on whole website.', '2025-03-06 02:16:38', '2025-03-06 02:16:38'),
(2, 'Admin', 'A person who can do more on website feature.', '2025-03-06 02:16:38', '2025-03-06 02:16:38'),
(3, 'User', 'A person who is a normal user.', '2025-03-06 02:16:38', '2025-03-06 02:16:38');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_sub_issues`
--

CREATE TABLE `tbl_sub_issues` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `progress` decimal(5,2) DEFAULT 0.00,
  `start_date` timestamp NULL DEFAULT NULL,
  `due_date` timestamp NULL DEFAULT NULL,
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
  `department_id` bigint(20) UNSIGNED DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `dis_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avarta` varchar(500) DEFAULT 'default_photo.jpg',
  `description` varchar(1000) DEFAULT NULL,
  `last_login_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` tinyint(4) DEFAULT 1 COMMENT '1 for active & 2 for inactive',
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`id`, `role_id`, `department_id`, `first_name`, `last_name`, `dis_name`, `email`, `password`, `avarta`, `description`, `last_login_on`, `status`, `created_on`, `updated_on`) VALUES
(1, 1, NULL, 'NSM', 'Tech', 'nsm.tech', 'kot@gmail.com', '$2b$10$psO0Ssrf1mmmEV5.SdoA7.nLrZSKVLzLStShYvNlY/L10XSqE91qu', '1762743493718.jpg', 'I\'m super admin control all the works.', '2026-04-21 15:06:29', 1, '2025-03-06 02:16:38', '2026-04-21 15:06:29'),
(2, 2, NULL, 'Bo', 'Long', 'bo.menglong', 'long@gmail.com', '$2b$10$Qg7ZpVmjkUTCuvJIbDpZoeAb.rhaU0b64Potfg3GBgydjay/YvsiO', '1762743646850.jpg', 'Hi i\'m admin!!', '2026-04-22 16:03:55', 1, '2025-03-07 02:38:57', '2026-04-22 16:03:55'),
(3, 3, NULL, 'Choun', 'Mann', 'choun.mann', 'mann3@gmail.com', '$2b$10$9JGXVRZrGT1B.PkJ3dyWF.EGmVD5LLZ76Z2AXSb.D72wUNiimjh6W', '1762746688375.jpg', 'KOT\n', '2026-04-22 16:07:09', 1, '2025-03-07 02:39:40', '2026-04-22 16:07:09'),
(4, 2, NULL, 'Long', 'Cute', 'long.cute', 'longcutie@gmail.com', '$2b$10$waCmELiegqkcZ/AsPYk5MeLRmHYyYmzG4FQnsjW8jbXWBWGld6F9m', 'default_photo.jpg', NULL, '2025-11-13 09:51:31', 1, '2025-03-09 08:22:26', '2025-11-13 09:51:31'),
(5, 3, NULL, 'Set', 'Cutie', 'set.cute', 'sethcutie@gmail.com', '$2b$10$MVHRKUit3BBdNMyyAKNWW.N8vb5jiB89JYizQxI.PkPoixCJQBcEO', 'default_photo.jpg', NULL, '2025-11-13 09:51:33', 1, '2025-03-09 17:37:43', '2025-11-13 09:51:33'),
(6, 2, NULL, 'Meow', 'Meow', 'meow.meow', 'meow@gmail.com', '$2b$10$10CbdP5q8bokgwx83Djw4.flMUEpez9S7eU7hBuzY.H8O7lw849Xi', 'default_photo.jpg', NULL, '2025-11-15 07:03:51', 1, '2025-03-09 18:01:56', '2025-11-15 07:03:51'),
(7, 3, NULL, 'lay', 'heng', 'lay.heng', 'heng@gmail.com', '$2b$10$qTA6kRRWNM.rLXySxSpZBOnvdUk.WGAlJJCnl5pTf1AnwPc7LP8jS', 'default_photo.jpg', NULL, '2025-11-13 09:51:36', 1, '2025-03-11 03:32:08', '2025-11-13 09:51:36'),
(9, 3, NULL, 'Choun', 'Mann', 'choun.mann1', 'bonglop202@gmail.com', '$2b$10$6OvN1pOYyuKLgajA0uNrge5O7ET1fmD4cWM/Btq0c8lq7OaOx9qOG', 'default_photo.jpg', NULL, '2026-04-22 15:36:50', 1, '2025-03-16 16:41:34', '2026-04-22 15:36:50'),
(10, 3, NULL, 'Pi', 'seth', 'pi.set', 'seth@gmail.com', '$2b$10$/LNmre/y1dYjby8we07ZNu7iXwmQjjv9lOKQnrwmffDhSuDSFH2fm', 'default_photo.jpg', NULL, '2026-04-22 15:36:50', 1, '2025-03-18 00:57:00', '2026-04-22 15:36:50'),
(13, 3, NULL, 'Video', 'Test', 'video.test', 'videotest123@gmail.com', '$2b$10$VBhni5qEiffrrmMLTTA0VOOdfLE5NqPOOaw0Jo5A47Ef9nJtD3b5C', 'default_photo.jpg', NULL, '2025-11-13 09:51:42', 1, '2025-03-23 17:46:16', '2025-11-13 09:51:42'),
(14, 3, NULL, 'Tep', 'Piseth', 'tep.piseth', 'teppiseth54@gmail.com', '$2b$10$MiZEnaWHIOuREAv1SpSOMusZaZd./tkKflOYMrrxBJXoxojEoZ8nO', 'default_photo.jpg', NULL, '2026-04-22 15:36:50', 1, '2025-03-24 12:40:16', '2026-04-22 15:36:50'),
(18, 3, NULL, 'Test', 'User', 'test.user', 'testuser@gmail.com', '$2b$10$iHkqjVff8bDf3LIM.sn5H.f6LDLVdegFRc91lOZ2/uoYel8ZZPxsC', 'default_photo.jpg', NULL, '2026-04-22 15:36:50', 1, '2025-11-12 01:39:22', '2026-04-22 15:36:50'),
(19, 2, NULL, 'NSM', 'TECH', 'nsm.tech1', 'nsmtech1@gmail.com', '$2b$10$SVwUz.C5gzJ2Bq5F75YnoOSVk.Ua7a61xWp9QgzabRjZ/tUv7aDpu', 'default_photo.jpg', NULL, '2025-11-13 02:13:22', 1, '2025-11-12 04:02:23', '2025-11-13 02:13:22'),
(20, 3, NULL, 'Chunnn', 'Mannn', 'chunn.mann', 'mann09@gmail.com', '$2b$10$T67fDYPBALV9sKIssIXq3.BMzcq3E/RsGjDTZc0jdZrurrYw2VOO.', 'default_photo.jpg', '', '2026-04-22 16:06:39', 1, '2025-11-13 02:34:18', '2026-04-22 16:06:39'),
(21, 2, NULL, 'Lyly', 'kimi', 'lyly.kimi', 'lylykimi@gmail.com', '$2b$10$Kjla84ojhShyQNqPwYXWLu/KoJyVHpMSvUnQhlBSiBtNsnRHs/fGe', 'default_photo.jpg', NULL, '2025-11-13 09:51:49', 1, '2025-11-13 06:48:04', '2025-11-13 09:51:49'),
(22, 3, NULL, 'admin', 'admin', 'admin.admin', 'admin@gmail.com', '$2b$10$k5ZtfB5pP2ZbdCEmj3AKe.Qbo4VuycaRqiRIrp/r7zg0543O5yaxi', 'default_photo.jpg', NULL, '2025-11-15 01:13:46', 1, '2025-11-15 01:13:46', '2025-11-15 01:13:46');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_request`
--

CREATE TABLE `tbl_user_request` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `request_type` varchar(50) NOT NULL,
  `request_description` text DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1 COMMENT '1 for pending, 2 for approved, 3 for rejected',
  `created_on` timestamp NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user_request`
--

INSERT INTO `tbl_user_request` (`id`, `user_id`, `request_type`, `request_description`, `status`, `created_on`, `updated_on`) VALUES
(1, 2, 'Request new password', 'User long@gmail.com forgot password and requested for new password.', 2, '2025-03-16 17:53:08', '2025-03-16 17:54:32');

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
-- Indexes for table `tbl_departments`
--
ALTER TABLE `tbl_departments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_issues`
--
ALTER TABLE `tbl_issues`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ISSUE_STATUS_ID_FK` (`status_id`),
  ADD KEY `ISSUE_PRIORITY_ID_FK` (`priority_id`),
  ADD KEY `ISSUE_ASSIGNEE_MEMBER_ID_FK` (`assignee`),
  ADD KEY `ISSUE_CREATEDBY_MEMBER_ID_FK` (`created_by`),
  ADD KEY `ISSUE_UPDATEDBY_MEMBER_ID_FK` (`updated_by`),
  ADD KEY `ISSUE_TRACKER_ID_FK` (`tracker_id`),
  ADD KEY `ISSUE_LABEL_ID_FK` (`label_id`),
  ADD KEY `ISSUE_PROJECT_ID_FK` (`project_id`);

--
-- Indexes for table `tbl_issue_activity`
--
ALTER TABLE `tbl_issue_activity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ISSUE_ACTIVITY_ISSUE_ID_FK` (`issue_id`),
  ADD KEY `ISSUE_ACTIVITY_USER_ID_FK` (`user_id`);

--
-- Indexes for table `tbl_issue_labels`
--
ALTER TABLE `tbl_issue_labels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ISSUELABEL_PROJECT_ID_FK` (`project_id`);

--
-- Indexes for table `tbl_issue_notes`
--
ALTER TABLE `tbl_issue_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ISSUEDOCUMENT_ISSUE_ID_FK` (`issue_id`),
  ADD KEY `ISSUENOTE_NOTER_USER_ID_FK` (`noter`);

--
-- Indexes for table `tbl_issue_priorities`
--
ALTER TABLE `tbl_issue_priorities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ISSUEPRIORITY_PROJECT_ID_FK` (`project_id`);

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `ISSUETRACKER_PROJECT_ID_FK` (`project_id`);

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
  ADD KEY `PROJECT_STATUS_ID_FK` (`status_id`),
  ADD KEY `PROJECT_DEPARTMENT_ID_FK` (`department_id`);

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
  ADD KEY `USER_ROLE_ID_FK` (`role_id`),
  ADD KEY `USER_DEPARTMENT_ID_FK` (`department_id`);

--
-- Indexes for table `tbl_user_request`
--
ALTER TABLE `tbl_user_request`
  ADD PRIMARY KEY (`id`),
  ADD KEY `USER_REQUEST_USER_ID_FK` (`user_id`);

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
-- AUTO_INCREMENT for table `tbl_departments`
--
ALTER TABLE `tbl_departments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_issues`
--
ALTER TABLE `tbl_issues`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_issue_activity`
--
ALTER TABLE `tbl_issue_activity`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_issue_labels`
--
ALTER TABLE `tbl_issue_labels`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `tbl_issue_notes`
--
ALTER TABLE `tbl_issue_notes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_issue_priorities`
--
ALTER TABLE `tbl_issue_priorities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `tbl_issue_status`
--
ALTER TABLE `tbl_issue_status`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `tbl_issue_trackers`
--
ALTER TABLE `tbl_issue_trackers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `tbl_members`
--
ALTER TABLE `tbl_members`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tbl_roles`
--
ALTER TABLE `tbl_roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_sub_issues`
--
ALTER TABLE `tbl_sub_issues`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `tbl_user_request`
--
ALTER TABLE `tbl_user_request`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  ADD CONSTRAINT `ISSUE_ASSIGNEE_USER_ID_FK` FOREIGN KEY (`assignee`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ISSUE_CREATEDBY_USER_ID_FK` FOREIGN KEY (`created_by`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ISSUE_LABEL_ID_FK` FOREIGN KEY (`label_id`) REFERENCES `tbl_issue_labels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ISSUE_PRIORITY_ID_FK` FOREIGN KEY (`priority_id`) REFERENCES `tbl_issue_priorities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ISSUE_PROJECT_ID_FK` FOREIGN KEY (`project_id`) REFERENCES `tbl_project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ISSUE_STATUS_ID_FK` FOREIGN KEY (`status_id`) REFERENCES `tbl_issue_status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ISSUE_TRACKER_ID_FK` FOREIGN KEY (`tracker_id`) REFERENCES `tbl_issue_trackers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ISSUE_UPDATEDBY_USER_ID_FK` FOREIGN KEY (`updated_by`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_issue_activity`
--
ALTER TABLE `tbl_issue_activity`
  ADD CONSTRAINT `ISSUE_ACTIVITY_ISSUE_ID_FK` FOREIGN KEY (`issue_id`) REFERENCES `tbl_issues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ISSUE_ACTIVITY_USER_ID_FK` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_issue_labels`
--
ALTER TABLE `tbl_issue_labels`
  ADD CONSTRAINT `ISSUELABEL_PROJECT_ID_FK` FOREIGN KEY (`project_id`) REFERENCES `tbl_project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_issue_notes`
--
ALTER TABLE `tbl_issue_notes`
  ADD CONSTRAINT `ISSUEDOCUMENT_ISSUE_ID_FK` FOREIGN KEY (`issue_id`) REFERENCES `tbl_issues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ISSUENOTE_NOTER_USER_ID_FK` FOREIGN KEY (`noter`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_issue_priorities`
--
ALTER TABLE `tbl_issue_priorities`
  ADD CONSTRAINT `ISSUEPRIORITY_PROJECT_ID_FK` FOREIGN KEY (`project_id`) REFERENCES `tbl_project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_issue_status`
--
ALTER TABLE `tbl_issue_status`
  ADD CONSTRAINT `ISSUE_STATUS_PROJECT_ID_FK` FOREIGN KEY (`project_id`) REFERENCES `tbl_project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_issue_trackers`
--
ALTER TABLE `tbl_issue_trackers`
  ADD CONSTRAINT `ISSUETRACKER_PROJECT_ID_FK` FOREIGN KEY (`project_id`) REFERENCES `tbl_project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
  ADD CONSTRAINT `PROJECT_DEPARTMENT_ID_FK` FOREIGN KEY (`department_id`) REFERENCES `tbl_departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `PROJECT_STATUS_ID_FK` FOREIGN KEY (`status_id`) REFERENCES `tbl_project_status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_project_activities`
--
ALTER TABLE `tbl_project_activities`
  ADD CONSTRAINT `PROJECTACTIVITY_ACTORMEMBER_ID_FK` FOREIGN KEY (`actor`) REFERENCES `tbl_members` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `PROJECTACTIVITY_PROJECT_ID_FK` FOREIGN KEY (`project_id`) REFERENCES `tbl_project` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

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
  ADD CONSTRAINT `SUBISSUE_ASSIGNEE_USER_ID_FK` FOREIGN KEY (`assignee`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `SUBISSUE_CREATEDBY_USER_ID_FK` FOREIGN KEY (`created_by`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `SUBISSUE_ISSUE_ID_FK` FOREIGN KEY (`issue_id`) REFERENCES `tbl_issues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `SUBISSUE_LABEL_ID_FK` FOREIGN KEY (`label_id`) REFERENCES `tbl_issue_labels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `SUBISSUE_PRIORITY_ID_FK` FOREIGN KEY (`priority_id`) REFERENCES `tbl_issue_priorities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `SUBISSUE_STATUS_ID_FK` FOREIGN KEY (`status_id`) REFERENCES `tbl_issue_status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `SUBISSUE_TRACKER_ID_FK` FOREIGN KEY (`tracker_id`) REFERENCES `tbl_issue_trackers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `SUBISSUE_UPDATEDBY_USER_ID_FK` FOREIGN KEY (`updated_by`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD CONSTRAINT `USER_DEPARTMENT_ID_FK` FOREIGN KEY (`department_id`) REFERENCES `tbl_departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `USER_ROLE_ID_FK` FOREIGN KEY (`role_id`) REFERENCES `tbl_roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_user_request`
--
ALTER TABLE `tbl_user_request`
  ADD CONSTRAINT `USER_REQUEST_USER_ID_FK` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_user_settings`
--
ALTER TABLE `tbl_user_settings`
  ADD CONSTRAINT `USERSETTING_USER_ID_FK` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
