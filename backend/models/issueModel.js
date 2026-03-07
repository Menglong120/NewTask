const { values } = require('lodash');
const { query } = require('../config/db');

// Create
const createCategory = async (values) => {
    const sql = 'INSERT INTO `tbl_issue_categories`(`project_id`, `name`, `description`) VALUES (?,?,?)';
    return await query(sql, values);
}

const createLabel = async (values) => {
    const sql = 'INSERT INTO `tbl_issue_labels`(`project_id`, `name`, `description`) VALUES (?,?,?)';
    return await query(sql, values);
}

const createPriority = async (values) => {
    const sql = 'INSERT INTO `tbl_issue_priorities`(`project_id`,`name`, `description`) VALUES (?,?,?)';
    return await query(sql, values);
}

const createStatus = async (values) => {
    const sql = 'INSERT INTO `tbl_issue_status`(`project_id`, `name`, `description`) VALUES (?,?,?)';
    return await query(sql, values);
}

const createTracker = async (values) => {
    const sql = 'INSERT INTO `tbl_issue_trackers`(`project_id`, `name`, `description`) VALUES (?,?,?)';
    return await query(sql, values);
}

const createIssue = async (values) => {
    const sql = "INSERT INTO `tbl_issues`(`category_id`, `name`, `description`, `start_date`, `due_date`, `status_id`, `priority_id`, `tracker_id`, `label_id`, `assignee`, `created_by`, `updated_by`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
    return await query(sql, values);
}

const createIssueNote = async (values) => {
    const sql = "INSERT INTO `tbl_issue_notes`(`issue_id`, `notes`, `noter`) VALUES (?,?,?)";
    return await query(sql, values);
}

const createIssueActivity = async (values) => {
    const sql = "INSERT INTO `tbl_issue_activity`(`issue_id`, `user_id`, `title`, `activity`) VALUES (?,?,?,?)";
    return await query(sql, values);
}

// Update
const updateCategory = async (values) => { 
    const sql = 'UPDATE `tbl_issue_categories` SET `name` = ?, `description` = ? WHERE `id` = ?';
    return await query(sql, values);
}

const updateLabel = async (values) => {
    const sql = 'UPDATE `tbl_issue_labels` SET `name` = ?, `description` = ? WHERE `id` = ?';
    return await query(sql, values);
}

const updatePriority = async (values) => {
    const sql = 'UPDATE `tbl_issue_priorities` SET `name` = ?, `description` = ? WHERE `id` = ?';
    return await query(sql, values);
}

const updateStatus = async (values) => {
    const sql = 'UPDATE `tbl_issue_status` SET `name` = ?, `description` = ? WHERE `id` = ?';
    return await query(sql, values);
}

const updateTracker = async (values) => {
    const sql = 'UPDATE `tbl_issue_trackers` SET `name` = ?, `description` = ? WHERE `id` = ?';
    return await query(sql, values);
}

const updateIssue = async (values) => {
    const sql = "UPDATE `tbl_issues` SET `name`=?,`progress`=?,`description`=?,`start_date`=?,`due_date`=?,`status_id`=?,`priority_id`=?,`assignee`=?,`updated_by`=?,`tracker_id`=?,`label_id`=? WHERE `id` = ?";
    return await query(sql, values);
}

const updateNote = async (values) => {
    const sql = "UPDATE `tbl_issue_notes` SET `notes` = ? WHERE `id` = ?";
    return await query(sql, values);
}

const issueUpdateLabelOnly = async (values) => {
    const sql = "UPDATE `tbl_issues` SET `label_id` = ?, `updated_by` = ? WHERE `id` = ?";
    return await query(sql, values);
}

const issueUpdatePriorityOnly = async (values) => {
    const sql = "UPDATE `tbl_issues` SET `priority_id` = ?, `updated_by` = ? WHERE `id` = ?";
    return await query(sql, values);
}

const issueUpdateStatusOnly = async (values) => {
    const sql = "UPDATE `tbl_issues` SET `status_id` = ?, `updated_by` = ? WHERE `id` = ?";
    return await query(sql, values);
}

const issueUpdateTrackerOnly = async (values) => {
    const sql = "UPDATE `tbl_issues` SET `tracker_id` = ?, `updated_by` = ? WHERE `id` = ?";
    return await query(sql, values);
}

const issueUpdateStartDateOnly = async (values) => {
    const sql = "UPDATE `tbl_issues` SET `start_date` = ?, `updated_by` = ? WHERE `id` = ?";
    return await query(sql, values);
}

const issueUpdateDueDateOnly = async (values) => {
    const sql = "UPDATE `tbl_issues` SET `due_date` = ?, `updated_by` = ? WHERE `id` = ?";
    return await query(sql, values);
}

const issueUpdateProgressOnly = async (values) => {
    const sql = "UPDATE `tbl_issues` SET `progress` = ?, `updated_by` = ? WHERE `id` = ?";
    return await query(sql, values);
}

const issueUpdateAssignee = async (values) => {
    const sql = "UPDATE `tbl_issues` SET `assignee` = ?, `updated_by` = ? WHERE `id` = ?";
    return await query(sql, values);
}

// Get
const getAllCategory = async (projectId) => {
    const sql = `SELECT 
            tbl_issue_categories.id AS 'id',
            tbl_issue_categories.name AS 'name',
            tbl_issue_categories.description AS 'description',
            tbl_issue_categories.created_on AS 'created_on',
            tbl_issue_categories.updated_on AS 'updated_on',
            tbl_project.id AS 'project_id',
            tbl_project.name AS 'project_name',
            tbl_project.description AS 'project_description',
            tbl_project.created_on AS 'project_created_on',
            tbl_project.updated_on AS 'project_updated_on'
            FROM tbl_issue_categories
            LEFT JOIN tbl_project ON tbl_project.id = tbl_issue_categories.project_id
            WHERE tbl_issue_categories.project_id = ?
        `;
    return await query(sql, [projectId]);
}

const getCategoryById = async (categoryId) => {
    const sql = `SELECT
            tbl_issue_categories.id AS 'id',
            tbl_issue_categories.name AS 'name',
            tbl_issue_categories.description AS 'description',
            tbl_issue_categories.created_on AS 'created_on',
            tbl_issue_categories.updated_on AS 'updated_on',
            tbl_project.id AS 'project_id',
            tbl_project.name AS 'project_name',
            tbl_project.description AS 'project_description',
            tbl_project.created_on AS 'project_created_on',
            tbl_project.updated_on AS 'project_updated_on'
            FROM tbl_issue_categories
            LEFT JOIN tbl_project ON tbl_project.id = tbl_issue_categories.project_id
            WHERE tbl_issue_categories.id = ?
        `;
    return await query(sql, [categoryId]);
}

const getAllLabels = async (projectId) => {
    const sql = ` SELECT
            tbl_issue_labels.id AS 'id',
            tbl_issue_labels.name AS 'name',
            tbl_issue_labels.description AS 'description',
            tbl_issue_labels.created_on AS 'created_on',
            tbl_issue_labels.updated_on AS 'updated_on',
            tbl_project.id AS 'project_id',
            tbl_project.name AS 'project_name',
            tbl_project.description AS 'project_description',
            tbl_project.created_on AS 'project_created_on',
            tbl_project.updated_on AS 'project_updated_on'
            FROM tbl_issue_labels
            INNER JOIN tbl_project ON tbl_project.id = tbl_issue_labels.project_id
            WHERE tbl_issue_labels.project_id = ?
        `;
    return await query(sql, [projectId]);
}

const getLabelById = async (labelId) => {
    const sql = ` SELECT
            tbl_issue_labels.id AS 'id',
            tbl_issue_labels.name AS 'name',
            tbl_issue_labels.description AS 'description',
            tbl_issue_labels.created_on AS 'created_on',
            tbl_issue_labels.updated_on AS 'updated_on',
            tbl_project.id AS 'project_id',
            tbl_project.name AS 'project_name',
            tbl_project.description AS 'project_description',
            tbl_project.created_on AS 'project_created_on',
            tbl_project.updated_on AS 'project_updated_on'
            FROM tbl_issue_labels
            INNER JOIN tbl_project ON tbl_project.id = tbl_issue_labels.project_id
            WHERE tbl_issue_labels.id = ?
        `;
    return await query(sql, [labelId]);
}

const getAllPriorities = async (projectId) => {
    const sql = ` SELECT
            tbl_issue_priorities.id AS 'id',
            tbl_issue_priorities.name AS 'name',
            tbl_issue_priorities.description AS 'description',
            tbl_issue_priorities.created_on AS 'created_on',
            tbl_issue_priorities.updated_on AS 'updated_on',
            tbl_project.id AS 'project_id',
            tbl_project.id AS 'project_id',
            tbl_project.name AS 'project_name',
            tbl_project.description AS 'project_description',
            tbl_project.created_on AS 'project_created_on',
            tbl_project.updated_on AS 'project_updated_on'
            FROM tbl_issue_priorities
            INNER JOIN tbl_project ON tbl_project.id = tbl_issue_priorities.project_id
            WHERE tbl_issue_priorities.project_id = ?
        `;
    return await query(sql, [projectId]);
}

const getPriorityById = async (priorityId) => {
    const sql = ` SELECT
            tbl_issue_priorities.id AS 'id',
            tbl_issue_priorities.name AS 'name',
            tbl_issue_priorities.description AS 'description',
            tbl_issue_priorities.created_on AS 'created_on',
            tbl_issue_priorities.updated_on AS 'updated_on',
            tbl_project.id AS 'project_id',
            tbl_project.id AS 'project_id',
            tbl_project.name AS 'project_name',
            tbl_project.description AS 'project_description',
            tbl_project.created_on AS 'project_created_on',
            tbl_project.updated_on AS 'project_updated_on'
            FROM tbl_issue_priorities
            INNER JOIN tbl_project ON tbl_project.id = tbl_issue_priorities.project_id
            WHERE tbl_issue_priorities.id = ?
        `;
    return await query(sql, [priorityId]);
}

const getAllStatus = async (projectId) => {
    const sql = ` SELECT
            tbl_issue_status.id AS 'id',
            tbl_issue_status.name AS 'name',
            tbl_issue_status.description AS 'description',
            tbl_issue_status.created_on AS 'created_on',
            tbl_issue_status.updated_on AS 'updated_on',
            tbl_project.id AS 'project_id',
            tbl_project.id AS 'project_id',
            tbl_project.name AS 'project_name',
            tbl_project.description AS 'project_description',
            tbl_project.created_on AS 'project_created_on',
            tbl_project.updated_on AS 'project_updated_on'
            FROM tbl_issue_status
            INNER JOIN tbl_project ON tbl_project.id = tbl_issue_status.project_id
            WHERE tbl_issue_status.project_id = ?
        `;
    return await query(sql, [projectId]);
}

const getStatusById = async (statusId) => {
    const sql = ` SELECT
            tbl_issue_status.id AS 'id',
            tbl_issue_status.name AS 'name',
            tbl_issue_status.description AS 'description',
            tbl_issue_status.created_on AS 'created_on',
            tbl_issue_status.updated_on AS 'updated_on',
            tbl_project.id AS 'project_id',
            tbl_project.id AS 'project_id',
            tbl_project.name AS 'project_name',
            tbl_project.description AS 'project_description',
            tbl_project.created_on AS 'project_created_on',
            tbl_project.updated_on AS 'project_updated_on'
            FROM tbl_issue_status
            INNER JOIN tbl_project ON tbl_project.id = tbl_issue_status.project_id
            WHERE tbl_issue_status.id = ?
        `;
    return await query(sql, [statusId]);
}

const getAllTrackers = async (projectId) => {
    const sql = ` SELECT
            tbl_issue_trackers.id AS 'id',
            tbl_issue_trackers.name AS 'name',
            tbl_issue_trackers.description AS 'description',
            tbl_issue_trackers.created_on AS 'created_on',
            tbl_issue_trackers.updated_on AS 'updated_on',
            tbl_project.id AS 'project_id',
            tbl_project.id AS 'project_id',
            tbl_project.name AS 'project_name',
            tbl_project.description AS 'project_description',
            tbl_project.created_on AS 'project_created_on',
            tbl_project.updated_on AS 'project_updated_on'
            FROM tbl_issue_trackers
            INNER JOIN tbl_project ON tbl_project.id = tbl_issue_trackers.project_id
            WHERE tbl_issue_trackers.project_id = ?
        `;
    return await query(sql, [projectId]);
}

const getTrackerById = async (trackerId) => {
    const sql = ` SELECT
            tbl_issue_trackers.id AS 'id',
            tbl_issue_trackers.name AS 'name',
            tbl_issue_trackers.description AS 'description',
            tbl_issue_trackers.created_on AS 'created_on',
            tbl_issue_trackers.updated_on AS 'updated_on',
            tbl_project.id AS 'project_id',
            tbl_project.id AS 'project_id',
            tbl_project.name AS 'project_name',
            tbl_project.description AS 'project_description',
            tbl_project.created_on AS 'project_created_on',
            tbl_project.updated_on AS 'project_updated_on'
            FROM tbl_issue_trackers
            INNER JOIN tbl_project ON tbl_project.id = tbl_issue_trackers.project_id
            WHERE tbl_issue_trackers.id = ?
        `;
    return await query(sql, [trackerId]);
}

const getAllIssueByCatId = async (search, page, perpage, categoryId) => {
    let values = [];
    let sql = ` SELECT
                i.id AS id,
                i.name AS name,
                i.description AS description,
                i.progress AS progress,
                i.start_date AS start_date,
                i.due_date AS due_date,
                i.created_on AS created_on,
                i.updated_on AS updated_on,

                -- Category Info
                c.id AS category_id,
                c.name AS category_name,

                -- Status Info
                s.id AS status_id,
                s.name AS status_name,

                -- Priority Info
                p.id AS priority_id,
                p.name AS priority_name,

                -- Assignee Info
                a.id AS assignee_id,
                a.first_name AS assignee_firstname,
                a.last_name AS assignee_lastname,
                a.dis_name AS assignee_disname,
                a.status AS assignee_status,
                a.email AS assignee_email,
                a.avarta AS assignee_avarta,
                a_role.id AS assignee_role_id,
                a_role.name AS assignee_role_name,

                -- Created By Info
                creator.id AS creator_id,
                creator.first_name AS creator_firstname,
                creator.last_name AS creator_lastname,
                creator.dis_name AS creator_disname,
                creator.email AS creator_email,
                creator.avarta AS creator_avarta,
                creator_role.id AS creator_role_id,
                creator_role.name AS creator_role_name,


                -- Updated By Info
                updater.id AS updater_id,
                updater.first_name AS updater_firstname,
                updater.last_name AS updater_lastname,
                updater.dis_name AS updater_disname,
                updater.email AS updater_email,
                updater.avarta AS updater_avarta,
                updater_role.id AS updater_role_id,
                updater_role.name AS updater_role_name,

                -- Tracker Info
                t.id AS tracker_id,
                t.name AS tracker_name,

                -- Label Info
                l.id AS label_id,
                l.name AS label_name,

                -- Project
                pro.id AS project_id,
                pro.name AS project_name

            FROM tbl_issues AS i
            LEFT JOIN tbl_issue_categories AS c ON i.category_id = c.id
            LEFT JOIN tbl_project AS pro ON c.project_id = pro.id
            LEFT JOIN tbl_issue_status AS s ON i.status_id = s.id
            LEFT JOIN tbl_issue_priorities AS p ON i.priority_id = p.id
            LEFT JOIN tbl_users AS a ON i.assignee = a.id
            LEFT JOIN tbl_roles AS a_role ON a.role_id = a_role.id
            LEFT JOIN tbl_users AS creator ON i.created_by = creator.id
            LEFT JOIN tbl_roles AS creator_role ON creator.role_id = creator_role.id
            LEFT JOIN tbl_users AS updater ON i.updated_by = updater.id
            LEFT JOIN tbl_roles AS updater_role ON updater.role_id = updater_role.id
            LEFT JOIN tbl_issue_trackers AS t ON i.tracker_id = t.id
            LEFT JOIN tbl_issue_labels AS l ON i.label_id = l.id

            WHERE i.category_id = ?
        `;
    values.push(categoryId)
    if(search.length > 0){
        sql += ` AND (
                i.id = ? AND
                i.progress = ? AND
                i.start_date = ? AND
                i.due_date = ? AND
                i.created_on = ? AND
                i.updated_on = ? AND
                i.name = ? AND
                s.name = ? AND
                p.name = ? AND
                a.first_name = ? AND
                a.last_name = ? AND
                a.dis_name = ? AND
                t.name = ? AND
                l.name = ?                
            )`;
        values.push(search, search, search, search, search, search
                    `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`
                    `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    if(perpage != 0 && page != 0) {
        sql += ' LIMIT ? OFFSET ?';
        values.push(Number(perpage), (Number(page) - 1) * Number(perpage));
    }
    return await query(sql, values);
}

const getIssueById = async (issueId) => {
    const sql = ` SELECT
                i.id AS id,
                i.name AS name,
                i.description AS description,
                i.progress AS progress,
                i.start_date AS start_date,
                i.due_date AS due_date,
                i.created_on AS created_on,
                i.updated_on AS updated_on,

                -- Category Info
                c.id AS category_id,
                c.name AS category_name,
                c.description AS category_description,

                -- Status Info
                s.id AS status_id,
                s.name AS status_name,
                s.description AS status_description,

                -- Priority Info
                p.id AS priority_id,
                p.name AS priority_name,
                p.description AS priority_description,

                -- Assignee Info
                a.id AS assignee_id,
                a.first_name AS assignee_firstname,
                a.last_name AS assignee_lastname,
                a.dis_name AS assignee_disname,
                a.email AS assignee_email,
                a.avarta AS assignee_avarta,
                a_role.id AS assignee_role_id,
                a_role.name AS assignee_role_name,

                -- Created By Info
                creator.id AS creator_id,
                creator.first_name AS creator_firstname,
                creator.last_name AS creator_lastname,
                creator.dis_name AS creator_disname,
                creator.email AS creator_email,
                creator.avarta AS creator_avarta,
                creator_role.id AS creator_role_id,
                creator_role.name AS creator_role_name,


                -- Updated By Info
                updater.id AS updater_id,
                updater.first_name AS updater_firstname,
                updater.last_name AS updater_lastname,
                updater.dis_name AS updater_disname,
                updater.email AS updater_email,
                updater.avarta AS updater_avarta,
                updater_role.id AS updater_role_id,
                updater_role.name AS updater_role_name,

                -- Tracker Info
                t.id AS tracker_id,
                t.name AS tracker_name,
                t.description AS tracker_description,

                -- Label Info
                l.id AS label_id,
                l.name AS label_name,
                l.description AS label_description,

                -- Project
                pro.id AS project_id,
                pro.name AS project_name

            FROM tbl_issues AS i
            LEFT JOIN tbl_issue_categories AS c ON i.category_id = c.id
            LEFT JOIN tbl_project AS pro ON c.project_id = pro.id
            LEFT JOIN tbl_issue_status AS s ON i.status_id = s.id
            LEFT JOIN tbl_issue_priorities AS p ON i.priority_id = p.id
            LEFT JOIN tbl_users AS a ON i.assignee = a.id
            LEFT JOIN tbl_roles AS a_role ON a.role_id = a_role.id
            LEFT JOIN tbl_users AS creator ON i.created_by = creator.id
            LEFT JOIN tbl_roles AS creator_role ON creator.role_id = creator_role.id
            LEFT JOIN tbl_users AS updater ON i.updated_by = updater.id
            LEFT JOIN tbl_roles AS updater_role ON updater.role_id = updater_role.id
            LEFT JOIN tbl_issue_trackers AS t ON i.tracker_id = t.id
            LEFT JOIN tbl_issue_labels AS l ON i.label_id = l.id

            WHERE i.id = ?;
        `;
    return await query(sql, [issueId]);
}

const getAllNoteByIssueId = async (issueId) => {
    const sql = ` SELECT 
            tbl_issue_notes.id AS 'id',
            tbl_issue_notes.notes AS 'notes',
            tbl_issue_notes.created_on AS 'created_on',
            tbl_issue_notes.updated_on AS 'updated_on',
            tbl_issues.id AS 'issue_id',
            tbl_issues.name AS 'issue_name',
            tbl_issues.description AS 'issue_description',
            tbl_users.id AS 'user_id',
            tbl_users.first_name AS 'user_first_name',
            tbl_users.last_name AS 'user_last_name',
            tbl_users.dis_name AS 'user_dis_name',
            tbl_users.email AS 'user_email',
            tbl_users.avarta AS 'user_avarta'
            FROM tbl_issue_notes
            LEFT JOIN tbl_issues ON tbl_issue_notes.issue_id = tbl_issues.id
            LEFT JOIN tbl_users ON tbl_issue_notes.noter = tbl_users.id
            WHERE tbl_issue_notes.issue_id = ?
        `;
    return await query(sql, [issueId]);
}

const getNoteById = async (noteId) => {
    const sql = ` SELECT 
            tbl_issue_notes.id AS 'id',
            tbl_issue_notes.notes AS 'notes',
            tbl_issue_notes.created_on AS 'created_on',
            tbl_issue_notes.updated_on AS 'updated_on',
            tbl_issues.id AS 'issue_id',
            tbl_issues.name AS 'issue_name',
            tbl_issues.description AS 'issue_description',
            tbl_users.id AS 'user_id',
            tbl_users.first_name AS 'user_first_name',
            tbl_users.last_name AS 'user_last_name',
            tbl_users.dis_name AS 'user_dis_name',
            tbl_users.email AS 'user_email',
            tbl_users.avarta AS 'user_avarta'
            FROM tbl_issue_notes
            LEFT JOIN tbl_issues ON tbl_issue_notes.issue_id = tbl_issues.id
            LEFT JOIN tbl_users ON tbl_issue_notes.noter = tbl_users.id
            WHERE tbl_issue_notes.id = ?
        `;
    return await query(sql, [noteId]);
}

const getAllIssueActivity = async (issueId) => {
    const sql = `
        SELECT
            tbl_issue_activity.id AS 'id',
            tbl_issue_activity.title AS 'title',
            tbl_issue_activity.activity AS 'activity',
            tbl_issue_activity.created_on As 'created_on',
            tbl_issues.id AS 'issue_id',
            tbl_issues.name AS 'issue_name',
            tbl_issues.description AS 'issue_description',
            tbl_users.id AS 'user_id',
            tbl_users.first_name AS 'user_first_name',
            tbl_users.last_name AS 'user_last_name',
            tbl_users.dis_name AS 'user_dis_name',
            tbl_users.email AS 'user_email',
            tbl_users.avarta AS 'user_avarta'
        FROM tbl_issue_activity
        LEFT JOIN tbl_issues ON tbl_issue_activity.issue_id = tbl_issues.id
        LEFT JOIN tbl_users ON tbl_issue_activity.user_id = tbl_users.id
        WHERE tbl_issue_activity.issue_id = ?
    `;
    return await query(sql, [issueId]);
}

const getDetailIssueActivity = async (activityId) => {
    const sql = `
        SELECT
            tbl_issue_activity.id AS 'id',
            tbl_issue_activity.title AS 'title',
            tbl_issue_activity.activity AS 'activity',
            tbl_issue_activity.created_on As 'created_on',
            tbl_issues.id AS 'issue_id',
            tbl_issues.name AS 'issue_name',
            tbl_issues.description AS 'issue_description',
            tbl_users.id AS 'user_id',
            tbl_users.first_name AS 'user_first_name',
            tbl_users.last_name AS 'user_last_name',
            tbl_users.dis_name AS 'user_dis_name',
            tbl_users.email AS 'user_email',
            tbl_users.avarta AS 'user_avarta'
        FROM tbl_issue_activity
        LEFT JOIN tbl_issues ON tbl_issue_activity.issue_id = tbl_issues.id
        LEFT JOIN tbl_users ON tbl_issue_activity.user_id = tbl_users.id
        WHERE tbl_issue_activity.id = ?
    `;
    return await query(sql, [activityId]);
}

// Count
const countAllIssueInCat = async (search, categoryId) => {
    let values = [];
    let sql = `SELECT count(i.id) AS 'total' 
            FROM tbl_issues AS i
            LEFT JOIN tbl_issue_categories AS c ON i.category_id = c.id
            LEFT JOIN tbl_issue_status AS s ON i.status_id = s.id
            LEFT JOIN tbl_issue_priorities AS p ON i.priority_id = p.id
            LEFT JOIN tbl_users AS a ON i.assignee = a.id
            LEFT JOIN tbl_issue_trackers AS t ON i.tracker_id = t.id
            LEFT JOIN tbl_issue_labels AS l ON i.label_id = l.id
            WHERE i.category_id = ?
        `;
    values.push(categoryId);
    if(search.length > 0){
        sql += ` AND (
                i.id = ? AND
                i.progress = ? AND
                i.start_date = ? AND
                i.due_date = ? AND
                i.created_on = ? AND
                i.updated_on = ? AND
                i.name = ? AND
                s.name = ? AND
                p.name = ? AND
                a.first_name = ? AND
                a.last_name = ? AND
                a.dis_name = ? AND
                t.name = ? AND
                l.name = ?                
            )`;
        values.push(search, search, search, search, search, search
                    `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`
                    `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    return await query(sql, values);
}

// Delete

// category active

const getIssueUsingCategory = async (categoryId) => {
    const sql = `SELECT id, name FROM tbl_issues WHERE category_id = ? `;
    const result = await query(sql,categoryId);
    return result;
}

const isActiveCategory = async(categoryId) => {
    const sql = "SELECT COUNT(*) AS count FROM tbl_issues WHERE category_id = ? "
    const result = await query(sql, categoryId);
   return {
        isUsed: result[0].count > 0,
        count: result[0].count
   }; 
}
const deleteCategory = async (categoryId) => {
    const sql = 'DELETE FROM tbl_issue_categories WHERE `id` = ?';
    return await query(sql, [categoryId]);
}

// label active
const getIssueUsingLabel = async (labelId) =>{
    const sql = "SELECT id, name FROM tbl_issues WHERE `label_id` = ?";
    const result = await query(sql,labelId);
    return result;
}

const isActiveLabel = async(labelId) => {
    const sql = "SELECT COUNT(*) AS count FROM tbl_issues WHERE label_id = ? "
    const result = await query(sql, labelId);
    return {
        isUsed: result[0].count > 0,
        count: result[0].count
    }; 
}
const deleteLabel = async (labelId) => {
    const sql = 'DELETE FROM `tbl_issue_labels` WHERE `id` = ?';
    return await query(sql, [labelId]);
}

// priority active
const getIssueUsingPriority = async(priorityId) =>{
    const sql = "SELECT id, name FROM tbl_issues WHERE priority_id = ?"
    const result = await query(sql,priorityId);
    return result;
}

const isActivePriority = async(priorityId) => {
    const sql = "SELECT COUNT(*) AS count FROM tbl_issues WHERE priority_id = ? "
    const result = await query(sql, priorityId);
    return {
        isUsed: result[0].count > 0,
        count: result[0].count
    }; 
}

const deletePriority = async (priorityId) => {
    const sql = 'DELETE FROM `tbl_issue_priorities` WHERE `id` = ?';
    return await query(sql, [priorityId]);
}

//status active 
const getIssueUsingStatus = async(statusId) =>{
    const sql = "SELECT id, name FROM tbl_issues WHERE status_id = ?"
    const result = await query(sql,statusId);
    return result;
}

const isActiveStaus = async(statusId) => {
    const sql = "SELECT COUNT(*) AS count FROM tbl_issues WHERE status_id = ? "
    const result = await query(sql, statusId);
    return {
        isUsed: result[0].count > 0,
        count: result[0].count
    }; 
}

const deleteStatus = async (statusId) => {
    const sql = 'DELETE FROM `tbl_issue_status` WHERE `id` = ?';
    return await query(sql, [statusId]);
}

//tracker active
const getIssueUsingTracker = async(trackerId) => {
    const sql = "SELECT id, name FROM  tbl_issues WHERE tracker_id = ?"
    const result = await query(sql,trackerId);
    return result;
}

const isActiveTracker = async(trackerId) => {
    const sql = "SELECT COUNT(*) AS count FROM tbl_issues WHERE tracker_id = ? "
    const result = await query(sql, trackerId);
    return {
        isUsed: result[0].count > 0,
        count: result[0].count   
    }; 
}
const deleteTracker = async (trackerId) => {
    const sql = 'DELETE FROM `tbl_issue_trackers` WHERE `id` = ?';
    return await query(sql, [trackerId]);
}


const deleteIssue = async (issueId) => {
    const sql = 'DELETE FROM `tbl_issues` WHERE `id` = ?';
    return await query(sql, [issueId]);
}

const deleteNote = async (noteId) => {
    const sql = 'DELETE FROM `tbl_issue_notes` WHERE `id` = ?';
    return await query(sql, [noteId]);
}

module.exports = {
    createCategory, 
    createLabel,
    createPriority,
    createStatus,
    createTracker,
    createIssue,
    createIssueNote,
    createIssueActivity,

    updateCategory,
    updateLabel,
    updatePriority,
    updateStatus,
    updateTracker,
    updateIssue,
    updateNote,
    issueUpdateLabelOnly,
    issueUpdatePriorityOnly,
    issueUpdateStatusOnly,
    issueUpdateTrackerOnly,
    issueUpdateStartDateOnly,
    issueUpdateDueDateOnly,
    issueUpdateProgressOnly,
    issueUpdateAssignee,

    getAllCategory, getCategoryById,
    getAllLabels, getLabelById,
    getAllPriorities, getPriorityById,
    getAllStatus, getStatusById,
    getAllTrackers, getTrackerById,
    getAllIssueByCatId, getIssueById,
    getAllNoteByIssueId, getNoteById,
    getAllIssueActivity, getDetailIssueActivity,

    deleteCategory,
    deleteLabel,
    deletePriority,
    deleteStatus,
    deleteTracker,
    deleteIssue,
    deleteNote,

    isActiveStaus,
    isActiveTracker,
    isActivePriority,
    isActiveLabel,
    isActiveCategory,

    getIssueUsingCategory,
    getIssueUsingLabel,
    getIssueUsingPriority,
    getIssueUsingStatus,
    getIssueUsingTracker,

    countAllIssueInCat,
}