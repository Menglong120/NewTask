const { update } = require('lodash');
const { query } = require('../config/db');

// Create
const createSubIssue = async (values) => {
    const sql = 'INSERT INTO `tbl_sub_issues`(`name`, `description`, `progress`, `start_date`, `due_date`, `issue_comment`, `priority_id`, `status_id`, `label_id`, `tracker_id`, `assignee`, `created_by`, `updated_by`, `issue_id`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
    return await query(sql, values);
}

// Update
const updateSubIssue = async (values) => {
    const sql = 'UPDATE `tbl_sub_issues` SET `name` = ?, `description` = ?, `progress` = ?, `start_date` = ?, `due_date` = ?, `issue_comment` = ?, `priority_id` = ?, `status_id` = ?, `label_id` = ?, `tracker_id` = ?, `assignee` = ?, `updated_by` = ? WHERE `id` = ?';
    return await query(sql, values); 
}

const subIssueUpdateProgress = async (values) => {
    const sql = 'UPDATE `tbl_sub_issues` SET `progress` = ?, `updated_by` = ? WHERE `id` = ?';
    return await query(sql, values);
}

const subIssueUpdateStartDate = async (values) => {
    const sql = 'UPDATE `tbl_sub_issues` SET `start_date` = ?, `updated_by` = ? WHERE `id` = ?';
    return await query(sql, values);
}

const subIssueUpdateDueDate = async (values) => {
    const sql = 'UPDATE `tbl_sub_issues` SET `due_date` = ?, `updated_by` = ? WHERE `id` = ?';
    return await query(sql, values);
}

const subIssueUpdateComment = async (values) => {
    const sql = 'UPDATE `tbl_sub_issues` SET `issue_comment` = ?, `updated_by` = ? WHERE `id` = ?';
    return await query(sql, values);
}

const subIssueUpdatePrority = async (values) => {
    const sql = 'UPDATE `tbl_sub_issues` SET `priority_id` = ?, `updated_by` = ? WHERE `id` = ?';
    return await query(sql, values);
}

const subIssueUpdateStatus = async (values) => {
    const sql = 'UPDATE `tbl_sub_issues` SET `status_id` = ?, `updated_by` = ? WHERE `id` = ?';
    return await query(sql, values);
}

const subIssueUpdateLabel = async (values) => {
    const sql = 'UPDATE `tbl_sub_issues` SET `label_id` = ?, `updated_by` = ? WHERE `id` = ?';
    return await query(sql, values);
}

const subIssueUpdateTracker = async (values) => {
    const sql = 'UPDATE `tbl_sub_issues` SET `tracker_id` = ?, `updated_by` = ? WHERE `id` = ?';
    return await query(sql, values);
}

const subIssueUpdateAssignee = async (values) => {
    const sql = 'UPDATE `tbl_sub_issues` SET `assignee` = ?, `updated_by` = ? WHERE `id` = ?';
    return await query(sql, values);
}

// Get
const getAllSubIssue = async (search, page, perpage, issueId) => {
    let values = [];
    let sql = ` SELECT
            sub_issues.id AS 'id',
            sub_issues.name AS 'name',
            sub_issues.description AS 'description',
            sub_issues.progress AS 'progress',
            sub_issues.start_date AS 'start_date',
            sub_issues.due_date AS 'due_date',
            sub_issues.issue_comment AS 'comment',
            sub_issues.created_on AS 'created_on',
            sub_issues.updated_on AS 'updated_on',

            i.id AS 'issue_id',
            i.name AS 'issue_name',
            i.description AS 'issue_description',

            p.id AS 'priority_id',
            p.name AS 'priority_name',
            p.description AS 'priority_description',

            s.id AS 'status_id',
            s.name AS 'status_name',
            s.description AS 'status_description',

            l.id AS 'label_id',
            l.name AS 'label_name',
            l.description AS 'label_description',

            t.id AS 'tracker_id',
            t.name AS 'tracker_name',
            t.description AS 'tracker_description',

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
            updater_role.name AS updater_role_name

            FROM tbl_sub_issues AS sub_issues
            LEFT JOIN tbl_issues AS i ON sub_issues.issue_id = i.id
            LEFT JOIN tbl_issue_priorities AS p ON sub_issues.priority_id = p.id
            LEFT JOIN tbl_issue_status AS s ON sub_issues.status_id = s.id
            LEFT JOIN tbl_issue_labels AS l ON sub_issues.label_id = l.id
            LEFT JOIN tbl_issue_trackers AS t ON sub_issues.tracker_id = t.id
            LEFT JOIN tbl_users AS a ON sub_issues.assignee = a.id
            LEFT JOIN tbl_roles AS a_role ON a.role_id = a_role.id
            LEFT JOIN tbl_users AS creator ON sub_issues.created_by = creator.id
            LEFT JOIN tbl_roles AS creator_role ON creator.role_id = creator_role.id
            LEFT JOIN tbl_users AS updater ON sub_issues.updated_by = updater.id
            LEFT JOIN tbl_roles AS updater_role ON updater.role_id = updater_role.id
            WHERE sub_issues.issue_id = ?
        `;
    values.push(issueId);
    if(search.length > 0){
        sql += ` AND (
                sub_issues.id = ? AND
                sub_issues.progress = ? AND
                sub_issues.start_date = ? AND
                sub_issues.due_date = ? AND
                sub_issues.created_on = ? AND
                sub_issues.updated_on = ? AND
                sub_issues.name = ? AND
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

const getSubIssueById = async (subIssueId) => {
    const sql = ` SELECT
            sub_issues.id AS 'id',
            sub_issues.name AS 'name',
            sub_issues.description AS 'description',
            sub_issues.progress AS 'progress',
            sub_issues.start_date AS 'start_date',
            sub_issues.due_date AS 'due_date',
            sub_issues.issue_comment AS 'comment',
            sub_issues.created_on AS 'created_on',
            sub_issues.updated_on AS 'updated_on',

            i.id AS 'issue_id',
            i.name AS 'issue_name',
            i.description AS 'issue_description',

            p.id AS 'priority_id',
            p.name AS 'priority_name',
            p.description AS 'priority_description',

            s.id AS 'status_id',
            s.name AS 'status_name',
            s.description AS 'status_description',

            l.id AS 'label_id',
            l.name AS 'label_name',
            l.description AS 'label_description',

            t.id AS 'tracker_id',
            t.name AS 'tracker_name',
            t.description AS 'tracker_description',

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
            updater_role.name AS updater_role_name

            FROM tbl_sub_issues AS sub_issues
            LEFT JOIN tbl_issues AS i ON sub_issues.issue_id = i.id
            LEFT JOIN tbl_issue_priorities AS p ON sub_issues.priority_id = p.id
            LEFT JOIN tbl_issue_status AS s ON sub_issues.status_id = s.id
            LEFT JOIN tbl_issue_labels AS l ON sub_issues.label_id = l.id
            LEFT JOIN tbl_issue_trackers AS t ON sub_issues.tracker_id = t.id
            LEFT JOIN tbl_users AS a ON sub_issues.assignee = a.id
            LEFT JOIN tbl_roles AS a_role ON a.role_id = a_role.id
            LEFT JOIN tbl_users AS creator ON sub_issues.created_by = creator.id
            LEFT JOIN tbl_roles AS creator_role ON creator.role_id = creator_role.id
            LEFT JOIN tbl_users AS updater ON sub_issues.updated_by = updater.id
            LEFT JOIN tbl_roles AS updater_role ON updater.role_id = updater_role.id
            WHERE sub_issues.id = ?
        `;
    return await query(sql, [subIssueId]); 
}

// Count
const countAllSubIssue = async (search, issueId) => {
    let values = [];
    let sql = ` SELECT
            count(sub_issues.id) AS 'total' FROM tbl_sub_issues AS sub_issues
             LEFT JOIN tbl_issues AS i ON sub_issues.issue_id = i.id
            LEFT JOIN tbl_issue_priorities AS p ON sub_issues.priority_id = p.id
            LEFT JOIN tbl_issue_status AS s ON sub_issues.status_id = s.id
            LEFT JOIN tbl_issue_labels AS l ON sub_issues.label_id = l.id
            LEFT JOIN tbl_issue_trackers AS t ON sub_issues.tracker_id = t.id
            LEFT JOIN tbl_users AS a ON sub_issues.assignee = a.id
            LEFT JOIN tbl_roles AS a_role ON a.role_id = a_role.id
            WHERE sub_issues.issue_id = ?
        `;
    values.push(issueId);
    if(search.length > 0){
        sql += ` AND (
                sub_issues.id = ? AND
                sub_issues.progress = ? AND
                sub_issues.start_date = ? AND
                sub_issues.due_date = ? AND
                sub_issues.created_on = ? AND
                sub_issues.updated_on = ? AND
                sub_issues.name = ? AND
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
const deleteSubIssue = async (subIssueId) => {
    const sql = 'DELETE FROM `tbl_sub_issues` WHERE `id` = ?';
    return await query(sql, [subIssueId]);
}

module.exports = {
    createSubIssue,

    updateSubIssue,
    subIssueUpdateProgress,
    subIssueUpdateStartDate,
    subIssueUpdateDueDate,
    subIssueUpdateComment,
    subIssueUpdatePrority,
    subIssueUpdateStatus,
    subIssueUpdateLabel,
    subIssueUpdateTracker,
    subIssueUpdateAssignee,

    getAllSubIssue, getSubIssueById,

    countAllSubIssue,

    deleteSubIssue,
}