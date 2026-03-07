const { values } = require('lodash');
const { query } = require('../config/db');

// Create
const createStatus = async (values) => {
    const sql = "INSERT INTO `tbl_project_status`(`title`, `description`) VALUES (?, ?)";
    return await query(sql, values);
}

const createProject = async (values) => {
    const sql = "INSERT INTO `tbl_project`(`name`, `description`, `status_id`, `estimated_date`) VALUES (?,?,?,?)";
    return await query(sql, values);
}

const createProjectMember = async (values) => {
    const sql = "INSERT INTO `tbl_members`(`user_id`, `project_id`) VALUES (?,?)";
    return await query(sql, values);
}

const createProjectResource = async (values) => {
    const sql = "INSERT INTO `tbl_project_resources`(`project_id`, `title`, `note`) VALUES (?,?,?)";
    return await query(sql, values);
}

const createProjectActivity = async (values) => {
    const sql = "INSERT INTO `tbl_project_activities`(`actor`, `project_id`, `title`, `activity`) VALUES (?,?,?,?)";
    return await query(sql, values);
}

const addResourceFile = async (values) => {
    const sql = "INSERT INTO `tbl_project_files`(`resource_id`, `file`, `file_name`) VALUES (?,?,?)";
    return await query(sql, values);
}

// Update
const updateStatus = async (values) => {
    const sql = "UPDATE `tbl_project_status` SET `title`= ?,`description`= ? WHERE `id`= ?";
    return await query(sql, values);
}

const updateProject = async (values) => {
    const sql = "UPDATE `tbl_project` SET `name` = ?, `description` = ?, `estimated_date` = ?  WHERE `id` = ?";
    return await query(sql, values);
}

const updateProjectStatus = async (values) =>{
    const sql = "UPDATE `tbl_project` SET `status_id` = ? WHERE `id` = ?";
    return await query(sql, values);
}

const updateProjectResource = async (values) => {
    const sql = "UPDATE `tbl_project_resources` SET `title`= ?,`note`= ? WHERE `id` = ?";
    return await query(sql, values);
}

const updateResourceFile = async (values) => {
    const sql = "UPDATE `tbl_project_files` SET `file` = ?, `file_name` = ? WHERE `id` = ?";
    return await query(sql, values);
}

// Delete
const getProjectsUsingStatus = async (statusId) => {
    const sql = `SELECT id, name FROM tbl_project  WHERE status_id = ?`;
    const result = await query(sql, statusId);
    return result;
};
const isStatusUsed = async (statusId) => {
    const sql = "SELECT COUNT(*) AS count FROM tbl_project WHERE status_id = ?";
    const result = await query(sql, statusId);
    return {
        isUsed: result[0].count > 0,
        count: result[0].count
    };
}
const deleteStatus = async (statusId) => {
    const sql = "DELETE FROM tbl_project_status WHERE id = ?";
    return await query(sql, statusId); 
};

// const deleteStatus = async (values) => {
//     const sql = "DELETE FROM `tbl_project_status` WHERE `id` = ?";
//     return await query(sql, values);
// }

const deleteProject = async (values) => {
    const sql = "DELETE FROM `tbl_project` WHERE `id` = ?";
    return await query(sql, values);
}

const removeMember = async (values) => {
    const sql = "DELETE FROM `tbl_members` WHERE `id` = ?";
    return await query(sql, values);
}

const deleteProjectResource = async (values) => {
    const sql = "DELETE FROM `tbl_project_resources` WHERE `id` = ?";
    return await query(sql, values);
}

const deleteProjectActivity = async (values) => {
    const sql = "DELETE FROM `tbl_project_activities` WHERE `id` = ?";
    return await query(sql, values);
}

const deleteResourceFile = async (values) => {
    const sql = "DELETE FROM `tbl_project_files` WHERE `id` = ?";
    return await query(sql, values);
}

// Get
const getProjectStatus = async (values) => {
    const sql = "SELECT * FROM `tbl_project_status` WHERE `id` = ?";
    return await query(sql, values);
}

const getAllProjectStatus = async (search, page, perpage) => {
    let values = [];
    let sql = 'SELECT * FROM `tbl_project_status`';
    if(search.length > 0){
        sql += 'WHERE (`id` = ? OR `title` LIKE ?)';
        values.push(search, `%${search}%`);
    }
    if(perpage != 0 && page != 0){
        sql += ' LIMIT ? OFFSET ?';
        values.push(perpage, (page - 1) * perpage);
    }
    return await query(sql, values);
}

const getProjectById = async (id) => {
    const sql = "SELECT * FROM `tbl_project` WHERE `id` = ?";
    return await query(sql, [id]);
}

const getAllProjects = async (search, page, perpage, id) => {
    let values = [];
    let sql = `SELECT 
            tbl_project.id AS 'id',
            tbl_project.name AS 'name',
            tbl_project.description AS 'description',
            tbl_project.created_on AS 'created_on',
            tbl_project.updated_on AS 'updated_on',
            tbl_project.estimated_date AS 'estimated_date',
            tbl_project_status.id AS 'status_id',
            tbl_project_status.title AS 'status_title',
            tbl_project_status.description AS 'status_description',
            tbl_project_status.created_on AS 'status_created_on',
            tbl_project_status.updated_on AS 'status_updated_on'
            FROM tbl_project
            LEFT JOIN tbl_project_status ON tbl_project_status.id = tbl_project.status_id
            LEFT JOIN tbl_members ON tbl_members.project_id = tbl_project.id
            INNER JOIN tbl_users ON tbl_users.id = tbl_members.user_id
            WHERE (tbl_members.user_id = ?)
        `;
    values.push(id);
    if(search && search.length > 0){
        sql += 'AND (`tbl_project`.`id` = ? OR `tbl_project`.`name` LIKE ?)';
        values.push(search, `%${search}%`);
    }
    sql += ` GROUP BY tbl_project.id`;
    if(perpage && page){
        sql += ' LIMIT ? OFFSET ?';
        values.push(perpage, (page - 1) * perpage);
    }
    return await query(sql, values);
}

const getAllProjectsNoCheck = async (search, page, perpage) => {
    let values = [];
    let sql = `SELECT 
            tbl_project.id AS 'id',
            tbl_project.name AS 'name',
            tbl_project.description AS 'description',
            tbl_project.created_on AS 'created_on',
            tbl_project.updated_on AS 'updated_on',
            tbl_project.estimated_date AS 'estimated_date',
            tbl_project_status.id AS 'status_id',
            tbl_project_status.title AS 'status_title',
            tbl_project_status.description AS 'status_description',
            tbl_project_status.created_on AS 'status_created_on',
            tbl_project_status.updated_on AS 'status_updated_on'
            FROM tbl_project
            LEFT JOIN tbl_project_status ON tbl_project_status.id = tbl_project.status_id
            LEFT JOIN tbl_members ON tbl_members.project_id = tbl_project.id
            INNER JOIN tbl_users ON tbl_users.id = tbl_members.user_id
        `;
    if(search && search.length > 0){
        sql += 'AND (`tbl_project`.`id` = ? OR `tbl_project`.`name` LIKE ?)';
        values.push(search, `%${search}%`);
    }
    sql += ` GROUP BY tbl_project.id`;
    if(page && perpage){
        sql += ' LIMIT ? OFFSET ?';
        values.push(perpage, (page - 1) * perpage);
    }
    return await query(sql, values);
}

const getAllProjectsById = async (id) => {
    let sql = `SELECT 
            tbl_project.id AS 'id',
            tbl_project.name AS 'name',
            tbl_project.description AS 'description',
            tbl_project.created_on AS 'created_on',
            tbl_project.updated_on AS 'updated_on',
            tbl_project_status.id AS 'status_id',
            tbl_project_status.title AS 'status_title',
            tbl_project_status.description AS 'status_description',
            tbl_project_status.created_on AS 'status_created_on',
            tbl_project_status.updated_on AS 'status_updated_on'
            FROM tbl_project
            INNER JOIN tbl_project_status ON tbl_project_status.id = tbl_project.status_id
            WHERE tbl_project.id = ?
        `;
    return await query(sql, [id]);
}

const getAllMembersById = async (id) => {
    const sql = "SELECT * FROM `tbl_members` WHERE id = ?";
    return await query(sql, [id]);
}

const getAllProjectMembers = async (projectId) => {
    const sql = `SELECT
        tbl_members.id AS 'id',
        tbl_members.project_id AS 'project_id',
        tbl_members.created_on AS 'created_on',
        tbl_users.id AS 'user_id',
        tbl_users.first_name AS 'user_first_name',
        tbl_users.last_name AS 'user_last_name',
        tbl_users.dis_name AS 'user_dis_name',
        tbl_users.email AS 'user_email',
        tbl_users.avarta AS 'user_avarta',
        tbl_users.description AS 'user_description',
        tbl_users.status AS 'user_status',
        tbl_users.created_on AS 'user_created_on',
        tbl_users.updated_on AS 'user_updated_on',
        tbl_roles.id AS 'user_role_id',
        tbl_roles.name AS 'user_role_name',
        tbl_roles.description AS 'user_role_description',
        tbl_roles.created_on AS 'user_role_created_on',
        tbl_roles.updated_on AS 'user_role_updated_on'
        FROM tbl_members
        INNER JOIN tbl_users ON tbl_users.id = tbl_members.user_id
        INNER JOIN tbl_roles ON tbl_roles.id = tbl_users.role_id
        WHERE tbl_members.project_id = ? GROUP BY tbl_members.id
    `;
    return await query(sql, [projectId]);
}

const getAllMembersByUserId = async (userId) => {
    const sql = 'SELECT * FROM `tbl_members` WHERE user_id = ?';
    return await query(sql, [userId]);
}

const getAllProjectMembersPaginate = async (search, page, perpage, projectId) => {
    let values = [];
    let sql = `SELECT
        tbl_members.id AS 'id',
        tbl_members.project_id AS 'project_id',
        tbl_members.created_on AS 'created_on',
        tbl_users.id AS 'user_id',
        tbl_users.first_name AS 'user_first_name',
        tbl_users.last_name AS 'user_last_name',
        tbl_users.dis_name AS 'user_dis_name',
        tbl_users.email AS 'user_email',
        tbl_users.avarta AS 'user_avarta',
        tbl_users.description AS 'user_description',
        tbl_users.status AS 'user_status',
        tbl_users.created_on AS 'user_created_on',
        tbl_users.updated_on AS 'user_updated_on',
        tbl_roles.id AS 'user_role_id',
        tbl_roles.name AS 'user_role_name',
        tbl_roles.description AS 'user_role_description',
        tbl_roles.created_on AS 'user_role_created_on',
        tbl_roles.updated_on AS 'user_role_updated_on'
        FROM tbl_members
        INNER JOIN tbl_users ON tbl_users.id = tbl_members.user_id
        INNER JOIN tbl_roles ON tbl_roles.id = tbl_users.role_id
        WHERE tbl_members.project_id = ? 
        AND status = 1
    `;
    values.push(projectId);

    if (search.length > 0) {
        sql += ` AND (
            tbl_members.id = ? OR 
            tbl_users.first_name LIKE ? OR 
            tbl_users.last_name LIKE ? OR 
            tbl_users.dis_name LIKE ? OR 
            tbl_users.email LIKE ? OR 
            tbl_roles.name LIKE ?
        )`;
        values.push(search, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    sql += ` GROUP BY tbl_members.id`;
    if(perpage != 0 && page != 0) {
        sql += ' LIMIT ? OFFSET ?';
        values.push(Number(perpage), (Number(page) - 1) * Number(perpage));
    }

    return await query(sql, values);
};

const getAllProjectMemberbyId = async (memberId) => {
    const sql = `SELECT
        tbl_members.id AS 'id',
        tbl_members.project_id AS 'project_id',
        tbl_members.created_on AS 'created_on',
        tbl_users.id AS 'user_id',
        tbl_users.first_name AS 'user_first_name',
        tbl_users.last_name AS 'user_last_name',
        tbl_users.dis_name AS 'user_dis_name',
        tbl_users.email AS 'user_email',
        tbl_users.avarta AS 'user_avarta',
        tbl_users.description AS 'user_description',
        tbl_users.status AS 'user_status',
        tbl_users.created_on AS 'user_created_on',
        tbl_users.updated_on AS 'user_updated_on',
        tbl_roles.id AS 'user_role_id',
        tbl_roles.name AS 'user_role_name',
        tbl_roles.description AS 'user_role_description',
        tbl_roles.created_on AS 'user_role_created_on',
        tbl_roles.updated_on AS 'user_role_updated_on'
        FROM tbl_members
        INNER JOIN tbl_users ON tbl_users.id = tbl_members.user_id
        INNER JOIN tbl_roles ON tbl_roles.id = tbl_users.role_id
        WHERE tbl_members.id = ? GROUP BY tbl_members.id
    `;
    return await query(sql, [memberId]);
};

const getMemberIdByUserProjectId = async (userId, projectId) => {
    const sql = 'SELECT id FROM tbl_members WHERE user_id = ? AND project_id = ?';
    return await query(sql, [userId, projectId]);
};

const getAllProjectResources = async (search, page, perpage, projectId) => {
    let values = [];
    let sql = ` SELECT
            tbl_project_resources.id AS 'id',
            tbl_project_resources.title AS 'title',
            tbl_project_resources.note AS 'note',
            tbl_project_resources.created_on AS 'created_on',
            tbl_project_resources.updated_on AS 'updated_on',
            tbl_project.id AS 'project_id',
            tbl_project.name AS 'project_name',
            tbl_project.description AS 'project_description',
            tbl_project.created_on AS 'project_created_on',
            tbl_project.updated_on AS 'project_updated_on',
            tbl_project_status.id AS 'project_status_id',
            tbl_project_status.title AS 'project_status_title',
            tbl_project_status.description AS 'project_status_description',
            tbl_project_status.created_on AS 'project_status_created_on',
            tbl_project_status.updated_on AS 'project_status_updated_on'
            FROM tbl_project_resources
            INNER JOIN tbl_project ON tbl_project.id = tbl_project_resources.project_id
            INNER JOIN tbl_project_status ON tbl_project_status.id = tbl_project.status_id
            WHERE tbl_project_resources.project_id = ?
        `;
    values.push(projectId);
    if (search.length > 0) {
        sql += ` AND (
            tbl_project_resources.id = ? OR 
            tbl_project_resources.title LIKE ?
        )`;
        values.push(search, `%${search}%`);
    }
    sql += ` GROUP BY tbl_project_resources.id`;
    if(perpage != 0 && page != 0) {
        sql += ' LIMIT ? OFFSET ?';
        values.push(Number(perpage), (Number(page) - 1) * Number(perpage));
    }

    return await query(sql, values);
}

const getProjectResource = async (resourceId) => {
    let sql = ` SELECT
            tbl_project_resources.id AS 'id',
            tbl_project_resources.title AS 'title',
            tbl_project_resources.note AS 'note',
            tbl_project_resources.created_on AS 'created_on',
            tbl_project_resources.updated_on AS 'updated_on',
            tbl_project.id AS 'project_id',
            tbl_project.name AS 'project_name',
            tbl_project.description AS 'project_description',
            tbl_project.created_on AS 'project_created_on',
            tbl_project.updated_on AS 'project_updated_on',
            tbl_project_status.id AS 'project_status_id',
            tbl_project_status.title AS 'project_status_title',
            tbl_project_status.description AS 'project_status_description',
            tbl_project_status.created_on AS 'project_status_created_on',
            tbl_project_status.updated_on AS 'project_status_updated_on'
            FROM tbl_project_resources
            INNER JOIN tbl_project ON tbl_project.id = tbl_project_resources.project_id
            INNER JOIN tbl_project_status ON tbl_project_status.id = tbl_project.status_id
            WHERE tbl_project_resources.id = ? GROUP BY tbl_project_resources.id
        `;
    return await query(sql, [resourceId]);
}

const getProjectResourceById = async (resourceId) => {
    const sql = "SELECT * FROM `tbl_project_resources` WHERE `id` = ?";
    return await query(sql, [resourceId]);
}

const getAllResourceFiles = async (search, page, perpage, resourceId) => {
    let values = [];
    let sql = ` SELECT
        tbl_project_resources.id AS 'id',
        tbl_project_resources.title AS 'title',
        tbl_project_resources.note AS 'note',
        tbl_project.id AS 'project_id',
        tbl_project.name AS 'project_name',
        tbl_project_files.id AS 'file_id',
        tbl_project_files.file AS 'file',
        tbl_project_files.file_name AS 'filename',
        tbl_project_files.created_on AS 'file_created_on',
        tbl_project_files.updated_on AS 'file_updated_on'
        FROM tbl_project_resources
        LEFT JOIN tbl_project ON tbl_project.id = tbl_project_resources.project_id
        LEFT JOIN tbl_project_files ON tbl_project_files.resource_id = tbl_project_resources.id
        WHERE tbl_project_resources.id = ?
    `;
    values.push(resourceId);
    if(search.length > 0){
        sql += ` AND (
                tbl_project.files.id = ? AND
                tbl_project.files.file LIKE ? )`
        values.push(search, `%${search}%`);
    }
    sql += ` GROUP BY tbl_project_files.id`;
    if(page !== 0 && perpage !== 0){
        sql += ' LIMIT ? OFFSET ?';
        values.push(perpage, (page - 1) * perpage);
    }
    return await query(sql, values);
}

const getResourceFile = async (fileId) => {
    const sql = `SELECT
            tbl_project_files.id AS 'id',
            tbl_project_files.file AS 'file',
            tbl_project_files.file_name AS 'filename',
            tbl_project_files.created_on AS 'created_on',
            tbl_project_files.updated_on AS 'updated_on',
            tbl_project_resources.id AS 'resource_id',
            tbl_project_resources.title AS 'resource_title',
            tbl_project_resources.note AS 'resource_note',
            tbl_project_resources.created_on AS 'resource_created_on',
            tbl_project_resources.updated_on AS 'resource_updated_on'
            FROM tbl_project_files
            INNER JOIN tbl_project_resources ON tbl_project_resources.id = tbl_project_files.resource_id
            WHERE tbl_project_files.id = ?
        `;
    return await query(sql, [fileId]);
}

const getAllProjectActivity = async (search, page, perpage, projectId) => {
    let values = [];
    let sql = ` SELECT
            tbl_project_activities.id AS 'id',
            tbl_project_activities.title AS 'title',
            tbl_project_activities.activity AS 'activity',
            tbl_project_activities.acted_on AS 'acted_on',
            tbl_members.id AS 'member_actor_id',
            tbl_members.created_on AS 'member_created_on',
            tbl_users.id AS 'user_id',
            tbl_users.first_name AS 'user_first_name',
            tbl_users.last_name AS 'user_last_name',
            tbl_users.dis_name AS 'user_dis_name',
            tbl_users.email AS 'user_email',
            tbl_users.avarta AS 'user_avarta',
            tbl_users.description AS 'user_description',
            tbl_users.status AS 'user_status',
            tbl_users.created_on AS 'user_created_on',
            tbl_users.updated_on AS 'user_updated_on',
            tbl_roles.id AS 'user_role_id',
            tbl_roles.name AS 'user_role_name',
            tbl_roles.description AS 'user_role_description',
            tbl_roles.created_on AS 'user_role_created_on',
            tbl_roles.updated_on AS 'user_role_updated_on',
            tbl_project.id AS 'project_id',
            tbl_project.name AS 'project_name'
            FROM tbl_project_activities
            INNER JOIN tbl_members ON tbl_members.id = tbl_project_activities.actor
            INNER JOIN tbl_users ON tbl_users.id = tbl_members.user_id
            INNER JOIN tbl_roles ON tbl_roles.id = tbl_users.role_id
            INNER JOIN tbl_project ON tbl_project.id = tbl_project_activities.project_id
            WHERE tbl_project_activities.project_id = ?
        `;
    values.push(projectId);
    if (search.length > 0) {
        sql += ` AND (
            tbl_project_activities.id = ? OR 
            tbl_members.id = ? OR 
            tbl_project_activities.title LIKE ? OR 
            tbl_users.first_name LIKE ? OR 
            tbl_users.last_name LIKE ? OR 
            tbl_users.dis_name LIKE ? OR 
            tbl_users.email LIKE ? OR 
        )`;
        values.push(search, search, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    sql += ` GROUP BY tbl_project_activities.id ORDER BY tbl_project_activities.id`;
    if(perpage != 0 && page != 0) {
        sql += ' LIMIT ? OFFSET ?';
        values.push(Number(perpage), (Number(page) - 1) * Number(perpage));
    }
    return await query(sql, values);
}

const getDetailProjectActivity = async (activityId) => {
    let sql = ` SELECT
            tbl_project_activities.id AS 'id',
            tbl_project_activities.title AS 'title',
            tbl_project_activities.activity AS 'activity',
            tbl_project_activities.acted_on AS 'acted_on',
            tbl_members.id AS 'member_actor_id',
            tbl_members.created_on AS 'member_created_on',
            tbl_users.id AS 'user_id',
            tbl_users.first_name AS 'user_first_name',
            tbl_users.last_name AS 'user_last_name',
            tbl_users.dis_name AS 'user_dis_name',
            tbl_users.email AS 'user_email',
            tbl_users.avarta AS 'user_avarta',
            tbl_users.description AS 'user_description',
            tbl_users.status AS 'user_status',
            tbl_users.created_on AS 'user_created_on',
            tbl_users.updated_on AS 'user_updated_on',
            tbl_roles.id AS 'user_role_id',
            tbl_roles.name AS 'user_role_name',
            tbl_roles.description AS 'user_role_description',
            tbl_roles.created_on AS 'user_role_created_on',
            tbl_roles.updated_on AS 'user_role_updated_on',
            tbl_project.id AS 'project_id',
            tbl_project.name AS 'project_name'
            FROM tbl_project_activities
            INNER JOIN tbl_members ON tbl_members.id = tbl_project_activities.actor
            INNER JOIN tbl_users ON tbl_users.id = tbl_members.user_id
            INNER JOIN tbl_roles ON tbl_roles.id = tbl_users.role_id
            INNER JOIN tbl_project ON tbl_project.id = tbl_project_activities.project_id
            WHERE tbl_project_activities.id = ? GROUP BY tbl_project_activities.id
        `;
    return await query(sql, [activityId]);
}

const getProjectActivityById = async (activityId) => {
    const sql = 'SELECT * FROM `tbl_project_activities` WHERE `id` = ?';
    return await query(sql, [activityId]);
}

// Count
const countProjectStatus = async (search, page, perpage) => {
    let values = [];
    let sql = 'SELECT COUNT(`id`) AS `total` FROM `tbl_project_status`';
    if(search.length > 0){
        sql += ' WHERE (`id` = ? OR `title` LIKE ?)';
        values.push(search, `%${search}%`);
    }
    return await query(sql, values);
}

const countProjects = async (search, userId) => {
    let values = [];
    let sql = `
            SELECT COUNT(tbl_project.id) AS 'total' 
            FROM tbl_project
            LEFT JOIN tbl_members ON tbl_members.project_id = tbl_project.id
            WHERE tbl_members.user_id = ?
        `;
    values.push(userId);
    if(search.length > 0){
        sql += 'AND (`tbl_project`.`id` = ? OR `tbl_project`.`name` LIKE ?)';
        values.push(search, `%${search}%`);
    }
    return await query(sql, values);
}

const countProjectsNoCheck = async (search) => {
    let values = [];
    let sql = `
            SELECT COUNT(tbl_project.id) AS 'total' 
            FROM tbl_project
        `;
    if(search.length > 0){
        sql += 'WHERE (`tbl_project`.`id` = ? OR `tbl_project`.`name` LIKE ?)';
        values.push(search, `%${search}%`);
    }
    return await query(sql, values);
}

const countProjectMembers = async (search, projectId) => {
    let values = [];
    let sql = `
            SELECT 
                COUNT(tbl_members.id) AS 'total'
            FROM tbl_members
            INNER JOIN tbl_users ON tbl_users.id = tbl_members.user_id
            INNER JOIN tbl_roles ON tbl_roles.id = tbl_users.role_id
            WHERE tbl_members.project_id = ?
        `;
    values.push(projectId);
    if (search.length > 0) {
        sql += ` AND (
            tbl_members.id = ? OR 
            tbl_users.first_name LIKE ? OR 
            tbl_users.last_name LIKE ? OR 
            tbl_users.dis_name LIKE ? OR 
            tbl_users.email LIKE ? OR 
            tbl_roles.name LIKE ?
        )`;
        values.push(search, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    return await query(sql, values);
}

const countProjectResources = async (search, projectId) => {
    let values = [];
    let sql = ` SELECT 
                COUNT(tbl_project_resources.id) AS 'total'
                FROM tbl_project_resources
                INNER JOIN tbl_project ON tbl_project.id = tbl_project_resources.project_id
                WHERE tbl_project_resources.project_id = ?
        `;
    values.push(projectId);
    if (search.length > 0) {
        sql += ` AND (
            tbl_project_resources.id = ? OR 
            tbl_project_resources.title LIKE ? OR 
        )`;
        values.push(search, `%${search}%`);
    }
    return await query(sql, values);
}

const countProjectActivity = async (search, projectId) => {
    let values = [];
    let sql = ` SELECT
            COUNT(tbl_project_activities.id) AS 'total'
            FROM tbl_project_activities
            INNER JOIN tbl_members ON tbl_members.id = tbl_project_activities.actor
            INNER JOIN tbl_users ON tbl_users.id = tbl_members.user_id
            INNER JOIN tbl_project ON tbl_project.id = tbl_project_activities.project_id
            WHERE tbl_project_activities.project_id = ?
        `;
    values.push(projectId);
    if (search.length > 0) {
        sql += ` AND (
            tbl_project_activities.id = ? OR 
            tbl_members.id = ? OR 
            tbl_project_activities.title LIKE ? OR 
            tbl_users.first_name LIKE ? OR 
            tbl_users.last_name LIKE ? OR 
            tbl_users.dis_name LIKE ? OR 
            tbl_users.email LIKE ? OR 
        )`;
        values.push(search, search, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    return await query(sql, values);
}

const countResourceFile = async (search, resourceId) => {
    let values = [];
    let sql = ` SELECT
            COUNT(tbl_project_files.id) AS 'total'
            FROM tbl_project_files
            INNER JOIN tbl_project_resources ON tbl_project_resources.id = tbl_project_files.resource_id
            WHERE tbl_project_files.resource_id = ?
        `;
    values.push(resourceId);
    if(search.length > 0){
        sql += ` AND (
                tbl_project.files.id = ? AND
                tbl_project.files.file LIKE ? )`
        values.push(search, `%${search}%`);
    }
    return await query(sql, values);
}

module.exports = {
    createStatus, 
    createProject, 
    createProjectMember,
    createProjectResource,
    createProjectActivity,
    addResourceFile,

    updateStatus, 
    updateProject, 
    updateProjectStatus,
    updateProjectResource,
    updateResourceFile,
    
    isStatusUsed,
    getProjectsUsingStatus,

    deleteStatus, 
    deleteProject, 
    removeMember, 
    deleteProjectResource,
    deleteProjectActivity,
    deleteResourceFile,

    getProjectStatus, 
    getAllProjectStatus, 
    getProjectById, 
    getAllProjects, 
    getAllProjectsNoCheck, 
    getAllProjectsById,
    getAllMembersById, 
    getAllProjectMembers, 
    getAllProjectMembersPaginate,
    getAllMembersByUserId, 
    getAllProjectMemberbyId, 
    getAllProjectResources,
    getProjectResource, 
    getProjectResourceById,
    getMemberIdByUserProjectId,
    getAllProjectActivity,
    getProjectActivityById,
    getDetailProjectActivity,
    getAllResourceFiles,
    getResourceFile,

    countProjectStatus, 
    countProjects, 
    countProjectsNoCheck,
    countProjectMembers, 
    countProjectResources,
    countProjectActivity,
    countResourceFile,
}