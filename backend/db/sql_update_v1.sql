-- Create Table User Roles Data
INSERT INTO `tbl_roles`
    (`name`, `description`) VALUES 
    ('Super Admin','A person who control on whole website.'),
    ('Admin','A person who can do more on website feature.'),
    ('User','A person who is a normal user.');

-- Create an super admin account
INSERT INTO `tbl_users`
    (`role_id`, `first_name`, `last_name`, `dis_name`, `email`, `password`,
     `avarta`, `description`, `status`) 
     VALUES (1,'Ant','Kot','KOT','kot@gmail.com',
     '$2b$10$JnQEKPqcv8DpLSXF.0i5zONjzRwHIGNOvdZzptYVcK3EtrEUHGhcW','','',1);

-- Create project status
INSERT INTO `tbl_project_status`(`title`, `description`) VALUES 
('To Start', 'Project is going to work.'),
('In Progress', 'Project is on working.'),
('Done', 'Project has been completed.'),
('Closed', 'Project closed.');

-- Mon 10 Feb 2025

ALTER TABLE `tbl_issue_labels` 
    ADD COLUMN project_id BIGINT UNSIGNED NOT NULL;

ALTER TABLE `tbl_issue_labels` 
    ADD CONSTRAINT `ISSUELABEL_PROJECT_ID_FK` 
    FOREIGN KEY (`project_id`) 
    REFERENCES `tbl_project` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE `tbl_issue_priorities`
    ADD COLUMN project_id BIGINT UNSIGNED NOT NULL;

ALTER TABLE `tbl_issue_priorities`
    ADD CONSTRAINT `ISSUEPRIORITY_PROJECT_ID_FK`
    FOREIGN KEY (`project_id`) 
    REFERENCES `tbl_project` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `tbl_issue_trackers`
    ADD COLUMN project_id BIGINT UNSIGNED NOT NULL;

ALTER TABLE `tbl_issue_trackers`
    ADD CONSTRAINT `ISSUETRACKER_PROJECT_ID_FK`
    FOREIGN KEY (`project_id`)
    REFERENCES `tbl_project` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;


-- Tue 11 Feb 2025
ALTER TABLE tbl_issues MODIFY due_date TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE tbl_issues MODIFY due_date TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE tbl_issues MODIFY COLUMN start_date TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE tbl_issues DROP FOREIGN KEY ISSUE_ASSIGNEE_MEMBER_ID_FK;
ALTER TABLE tbl_issues DROP FOREIGN KEY ISSUE_CREATEDBY_MEMBER_ID_FK;
ALTER TABLE tbl_issues DROP FOREIGN KEY ISSUE_UPDATEDBY_MEMBER_ID_FK;

-- 

ALTER TABLE tbl_issues 
    ADD CONSTRAINT ISSUE_ASSIGNEE_USER_ID_FK FOREIGN KEY (assignee) 
    REFERENCES tbl_users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE tbl_issues 
    ADD CONSTRAINT ISSUE_CREATEDBY_USER_ID_FK FOREIGN KEY (created_by)
    REFERENCES tbl_users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE tbl_issues 
    ADD CONSTRAINT ISSUE_UPDATEDBY_USER_ID_FK FOREIGN KEY (updated_by)
    REFERENCES tbl_users(id) ON DELETE CASCADE ON UPDATE CASCADE;


-- Wed 12 Feb 2025
ALTER TABLE tbl_issue_notes DROP COLUMN title;

ALTER TABLE tbl_issue_notes 
    ADD COLUMN noter BIGINT UNSIGNED NOT NULL;

ALTER TABLE tbl_issue_notes
    ADD CONSTRAINT ISSUENOTE_NOTER_USER_ID_FK FOREIGN KEY (noter)
    REFERENCES tbl_users(id) ON DELETE CASCADE ON UPDATE CASCADE;





-- Fri 14 Feb 2025

ALTER TABLE tbl_sub_issues MODIFY due_date TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE tbl_sub_issues MODIFY COLUMN start_date TIMESTAMP NULL DEFAULT NULL;

-- 

ALTER TABLE tbl_sub_issues DROP FOREIGN KEY SUBISSUE_ASSIGNEE_MEMBER_ID_FK;
ALTER TABLE tbl_sub_issues DROP FOREIGN KEY SUBISSUE_CREATEDBY_MEMBER_ID_FK;
ALTER TABLE tbl_sub_issues DROP FOREIGN KEY SUBISSUE_UPDATEDBY_MEMBER_ID_FK;

-- 

ALTER TABLE tbl_sub_issues 
    ADD CONSTRAINT SUBISSUE_ASSIGNEE_USER_ID_FK FOREIGN KEY (assignee) 
    REFERENCES tbl_users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE tbl_sub_issues 
    ADD CONSTRAINT SUBISSUE_CREATEDBY_USER_ID_FK FOREIGN KEY (created_by)
    REFERENCES tbl_users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE tbl_sub_issues 
    ADD CONSTRAINT SUBISSUE_UPDATEDBY_USER_ID_FK FOREIGN KEY (updated_by)
    REFERENCES tbl_users(id) ON DELETE CASCADE ON UPDATE CASCADE;


-- 27 Feb 2025
ALTER TABLE tbl_issue_notes MODIFY notes LONGTEXT;



-- 12 Mar 2025

CREATE TABLE `tbl_user_request` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `request_type` VARCHAR(50) NOT NULL,
    `request_description` TEXT,
    `status` TINYINT DEFAULT 1 COMMENT '1 for pending, 2 for approved, 3 for rejected',
    `created_on` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_on` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE tbl_user_request
    ADD CONSTRAINT USER_REQUEST_USER_ID_FK FOREIGN KEY (user_id)
    REFERENCES tbl_users(id) ON DELETE CASCADE ON UPDATE CASCADE;


-- 15 Mar 2025

ALTER TABLE tbl_project_resources MODIFY note LONGTEXT;

CREATE TABLE `tbl_issue_activity` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `issue_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `title` VARCHAR(255),
    `activity` TEXT,
    `created_on` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE `tbl_issue_activity`
    ADD CONSTRAINT `ISSUE_ACTIVITY_ISSUE_ID_FK` FOREIGN KEY (`issue_id`)
    REFERENCES `tbl_issues`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `tbl_issue_activity`
    ADD CONSTRAINT `ISSUE_ACTIVITY_USER_ID_FK` FOREIGN KEY (`user_id`)
    REFERENCES `tbl_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


-- 23 Mar 2025
ALTER TABLE `tbl_project_files` ADD COLUMN `file_name` VARCHAR(1000); 


-- 22 Apr 2026
CREATE TABLE `tbl_departments` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `created_on` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_on` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE `tbl_users`
    ADD COLUMN `department_id` BIGINT UNSIGNED NULL AFTER `role_id`;

ALTER TABLE `tbl_users`
    ADD CONSTRAINT `USER_DEPARTMENT_ID_FK` FOREIGN KEY (`department_id`)
    REFERENCES `tbl_departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `tbl_project`
    ADD COLUMN `department_id` BIGINT UNSIGNED NULL AFTER `status_id`;

ALTER TABLE `tbl_project`
    ADD CONSTRAINT `PROJECT_DEPARTMENT_ID_FK` FOREIGN KEY (`department_id`)
    REFERENCES `tbl_departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
