const { query } = require('../config/db');

const countAllIssueInWeb = async () => {
    const sql = ` SELECT count(id) AS total FROM tbl_issues`;
    return await query(sql, []);
}

const percentageProjectProgress = async () => {
    const sql = ` 
        SELECT 
            tbl_project.id AS 'id',
            tbl_project.name AS 'name',
            tbl_project.created_on AS 'created_on',
            tbl_project.updated_on AS 'updated_on',
            tbl_project_status.id AS 'status_id',
            tbl_project_status.title AS 'status_title',

            COUNT(DISTINCT tbl_issues.id) AS 'total_issue',
            COUNT(DISTINCT tbl_sub_issues.id) AS 'total_sub_issue',

            -- FIX: Use MAX() because subquery returns 1 row per project
            COALESCE(MAX(issue_progress.total_progress), 0) AS 'total_issue_progress',

            COALESCE(SUM(tbl_sub_issues.progress), 0) AS 'total_sub_issue_progress'

        FROM tbl_project
        LEFT JOIN tbl_project_status ON tbl_project.status_id = tbl_project_status.id
        LEFT JOIN tbl_issues ON tbl_issues.project_id = tbl_project.id
        LEFT JOIN tbl_sub_issues ON tbl_sub_issues.issue_id = tbl_issues.id

        LEFT JOIN (
            SELECT 
                tbl_issues.project_id,
                SUM(tbl_issues.progress) AS total_progress
            FROM tbl_issues
            GROUP BY tbl_issues.project_id
        ) AS issue_progress ON issue_progress.project_id = tbl_project.id

        GROUP BY 
            tbl_project.id, 
            tbl_project.name,
            tbl_project.created_on,
            tbl_project.updated_on,
            tbl_project_status.id,
            tbl_project_status.title;

    `;
    return await query(sql, []);
};

const percentageProjectProgressUser = async (userId) => {
    const sql = ` 
                SELECT 
                tbl_project.id AS id,
                tbl_project.name AS name,
                tbl_project.created_on AS created_on,
                tbl_project.updated_on AS updated_on,
                tbl_project_status.id AS status_id,
                tbl_project_status.title AS status_title,

                COUNT(DISTINCT tbl_issues.id) AS total_issue,
                COUNT(DISTINCT tbl_sub_issues.id) AS total_sub_issue,

                -- FIX: Apply MAX() so it's allowed outside GROUP BY
                COALESCE(MAX(issue_progress.total_progress), 0) AS total_issue_progress,

                COALESCE(SUM(tbl_sub_issues.progress), 0) AS total_sub_issue_progress

            FROM tbl_project
            LEFT JOIN tbl_project_status ON tbl_project.status_id = tbl_project_status.id
            LEFT JOIN tbl_issues ON tbl_issues.project_id = tbl_project.id
            LEFT JOIN tbl_sub_issues ON tbl_sub_issues.issue_id = tbl_issues.id

            LEFT JOIN tbl_members ON tbl_members.project_id = tbl_project.id
            LEFT JOIN tbl_users ON tbl_users.id = tbl_members.user_id

            LEFT JOIN (
                SELECT 
                    tbl_issues.project_id,
                    SUM(tbl_issues.progress) AS total_progress
                FROM tbl_issues
                GROUP BY tbl_issues.project_id
            ) AS issue_progress ON issue_progress.project_id = tbl_project.id

            WHERE tbl_members.user_id = 2

            GROUP BY 
                tbl_project.id,
                tbl_project_status.id,
                tbl_project_status.title;

    `;
    return await query(sql, [userId]);
};

const countAllIssueInProject = async (projectId) => {
    const sql = `
        SELECT
            tbl_project.id AS 'id',
            tbl_project.name AS 'name',
            tbl_project.created_on AS 'created_on',
            tbl_project.updated_on AS 'updated_on',
            tbl_project_status.id AS 'status_id',
            tbl_project_status.title AS 'status_title',
            COUNT(DISTINCT tbl_issues.id) AS 'total_issue',
            COUNT(DISTINCT tbl_sub_issues.id) AS 'total_sub_issue'
        FROM tbl_project
        LEFT JOIN tbl_project_status ON tbl_project.status_id = tbl_project_status.id
        LEFT JOIN tbl_issues ON tbl_issues.project_id = tbl_project.id
        LEFT JOIN tbl_sub_issues ON tbl_sub_issues.issue_id = tbl_issues.id
        WHERE tbl_project.id = ?
        GROUP BY tbl_project.id
    `;
    return await query(sql, projectId);
}

const countIssueInStatus = async (projectId) => {
    const sql = `
        SELECT 
            tbl_project.id AS 'id',
            tbl_project.name AS 'name',
            tbl_project.created_on AS 'created_on',
            tbl_project.updated_on AS 'updated_on',
            tbl_project_status.id AS 'status_id',
            tbl_project_status.title AS 'status_title', 
            COUNT(DISTINCT tbl_issues.id) AS 'total_issue',
            tbl_issue_status.id AS 'issue_status_id',
            tbl_issue_status.name AS 'issue_status_name'
        FROM tbl_project
        LEFT JOIN tbl_project_status ON tbl_project.status_id = tbl_project_status.id
        LEFT JOIN tbl_issue_status ON tbl_issue_status.project_id = tbl_project.id
        LEFT JOIN tbl_issues ON tbl_issues.status_id = tbl_issue_status.id
        WHERE tbl_project.id = ? 
        GROUP BY tbl_project.id, tbl_issue_status.id
    `;
    return await query(sql, projectId);
}

const countIssueInPriority = async (projectId) => {
    const sql = `
        SELECT 
            tbl_project.id AS 'id',
            tbl_project.name AS 'name',
            tbl_project.created_on AS 'created_on',
            tbl_project.updated_on AS 'updated_on',
            tbl_project_status.id AS 'status_id',
            tbl_project_status.title AS 'status_title', 
            COUNT(DISTINCT tbl_issues.id) AS 'total_issue',
            tbl_issue_priorities.id AS 'issue_priority_id',
            tbl_issue_priorities.name AS 'issue_priority_name'
        FROM tbl_project
        LEFT JOIN tbl_project_status ON tbl_project.status_id = tbl_project_status.id
        LEFT JOIN tbl_issue_priorities ON tbl_issue_priorities.project_id = tbl_project.id
        LEFT JOIN tbl_issues ON tbl_issues.priority_id = tbl_issue_priorities.id
        WHERE tbl_project.id = ? 
        GROUP BY tbl_project.id, tbl_issue_priorities.id
    `;
    return await query(sql, projectId);
}

const countIssueByStatusInMonth = async (projectId) => {
    const sql = `
        SELECT 
            MONTHNAME(CONCAT(YEAR(NOW()), '-', m.month, '-01')) AS month_name,
            tbl_issue_status.name AS status_name,
            tbl_issue_status.id AS status_id,
            COUNT(tbl_issues.id) AS count
        FROM 
            (SELECT 1 AS month UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL 
            SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL 
            SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL 
            SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12) m
        LEFT JOIN tbl_issues 
            ON MONTH(tbl_issues.updated_on) = m.month 
            AND YEAR(tbl_issues.updated_on) = YEAR(NOW())
        LEFT JOIN tbl_issue_status 
            ON tbl_issues.status_id = tbl_issue_status.id
        LEFT JOIN tbl_project
            ON tbl_issue_status.project_id = tbl_project.id
        WHERE tbl_project.id = ?
        GROUP BY m.month, tbl_issue_status.id
        ORDER BY m.month;
    `;
    return await query(sql, projectId);
}

const countIssueWithAssignee = async (projectId) => {
    const sql = `
        SELECT 
            tbl_project.id AS 'id',
            tbl_project.name AS 'name',
            tbl_project.created_on AS 'created_on',
            tbl_project.updated_on AS 'updated_on', 

            tbl_issues.id AS issue_ids,
            tbl_issues.name AS issue_names,
            tbl_issues.start_date AS 'start_date',
            tbl_issues.due_date AS 'due_date',
            tbl_issues.progress AS 'progress',

            tbl_issue_status.id AS 'issue_status_id',
            tbl_issue_status.name AS 'issue_status_name',

            
            

            tbl_users.id AS 'user_id',
            tbl_users.first_name AS 'user_first_name',
            tbl_users.last_name AS 'user_last_name',
            tbl_users.dis_name AS 'dis_name',
            tbl_users.email AS 'email',
            tbl_users.avarta AS 'avarta',
            tbl_roles.id AS 'role_id',
            tbl_roles.name AS 'role_name'

        FROM tbl_users
        LEFT JOIN tbl_issues ON tbl_users.id = tbl_issues.assignee
        LEFT JOIN tbl_issue_status ON tbl_issues.status_id = tbl_issue_status.id
        
        LEFT JOIN tbl_project ON tbl_issue_status.project_id = tbl_project.id
        LEFT JOIN tbl_roles ON tbl_users.role_id = tbl_roles.id
        
        WHERE tbl_project.id = ?
        ORDER BY tbl_users.id;
    `;
    return await query(sql, projectId);
}

module.exports = {
    countAllIssueInWeb,
    percentageProjectProgress,
    percentageProjectProgressUser,
    countAllIssueInProject,
    countIssueInStatus,
    countIssueInPriority,
    countIssueByStatusInMonth,
    countIssueWithAssignee,
}