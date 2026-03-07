const { values } = require('lodash');
const { query } = require('../config/db');

// Insert

const createUser = async (values) => {
    const sql = "INSERT INTO `tbl_users`(`role_id`, `first_name`, `last_name`,`dis_name`, `email`, `password`, `description`) VALUES (?, ?, ?, ?, ?, ?, ?)";
    return await query(sql, values);
};

const createRole = async (values) => {
    const sql = "INSERT INTO `tbl_roles`(`name`, `description`) VALUES (?, ?)";
    return await query(sql, values);
}

const createRequest = async (values) => {
    const sql = "INSERT INTO `tbl_user_request`(`user_id`, `request_type`, `request_description`, `status`) VALUES (?,?,?,?)";
    return await query(sql, values);
}

// Update

const updateRequestStatus = async (values) => {
    const sql = "UPDATE `tbl_user_request` SET `status` = ? WHERE `id` = ?";
    return await query(sql, values);
}

const updateLastLogin = async (values) => {
    const sql = "UPDATE `tbl_users` SET `last_login_on` = ? WHERE id = ?";
    return await query(sql, values);
};

const updateUserProfile = async (values) => {
    const sql = ` UPDATE tbl_users SET 
        first_name = ?, last_name = ?, dis_name = ?, email = ?, description = ?
        WHERE id = ?
    `;
    return await query(sql, values);
}

const updateUserProfileImage = async (values) => {
    const sql = "UPDATE `tbl_users` SET `avarta` = ? WHERE id = ?";
    return await query(sql, values);
}

const changePassword = async (values) => {
    const sql = "UPDATE `tbl_users` SET `password` = ? WHERE id = ?";
    return await query(sql, values);
}

const changeUserRole = async (values) => {
    const sql = "UPDATE `tbl_users` SET `role_id` = ? WHERE `id` = ?";
    return await query(sql, values);
}

const updateRole = async (values) => {
    const sql = "UPDATE `tbl_roles` SET `name` = ?, `description` = ? WHERE `id` = ?";
    return await query(sql, values);
}

// Get

const getAllUsers = async () => {
    const sql = "SELECT * FROM `tbl_users` ";
    return await query(sql, []);
};

const getAllUsersWithDetails = async (search, role, page, perpage) => {
    let values = [];
    let sql = ` 
        SELECT 
            tbl_users.id AS 'id',
            tbl_users.first_name AS 'first_name',
            tbl_users.last_name AS 'last_name',
            tbl_users.dis_name AS 'dis_name',
            tbl_users.email AS 'email',
            tbl_users.password AS 'password',
            tbl_users.avarta AS 'avarta',
            tbl_users.description AS 'description',
            tbl_users.last_login_on AS 'last_login_on',
            tbl_users.status AS 'status',
            tbl_users.created_on AS 'created_on',
            tbl_users.updated_on AS 'updated_on',
            tbl_roles.id AS 'role_id',
            tbl_roles.name AS 'role_name',
            tbl_roles.description AS 'role_description',
            tbl_roles.created_on AS 'role_created_on',
            tbl_roles.updated_on AS 'role_updated_on'
        FROM tbl_users
        INNER JOIN tbl_roles ON tbl_roles.id = tbl_users.role_id WHERE tbl_users.status = 1
    `;
    if(search.length > 0 && role == 0){
        sql += ` AND (
            tbl_users.id = ? OR tbl_roles.id = ? OR
            tbl_users.first_name LIKE ? OR 
            tbl_users.last_name LIKE ? OR 
            tbl_users.dis_name LIKE ? OR 
            tbl_users.email LIKE ? OR 
            tbl_users.status LIKE ? OR
            tbl_roles.name LIKE ?
        )`;
        values.push(search, search, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    if(role !== 0){
        sql += `AND tbl_roles.id = ?`;
        values.push(role);
        if(search.length > 0){
            sql += ` AND (
                tbl_users.id = ? OR
                tbl_users.first_name LIKE ? OR 
                tbl_users.last_name LIKE ? OR 
                tbl_users.dis_name LIKE ? OR 
                tbl_users.email LIKE ? OR 
                tbl_users.status LIKE ? OR
                tbl_roles.name LIKE ?
            )`;
            values.push(search, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }
    }
    if(perpage !== 0 && page != 0){
        sql += ' LIMIT ? OFFSET ?';
        values.push(perpage, (page - 1) * perpage);
    }
    return await query(sql, values);
}

const getUserById = async (userId) => {
    const sql = "SELECT * FROM `tbl_users` WHERE id = ?";
    return await query(sql, [userId]);
};

const getUserByRole = async (role) => {
    const sql = "SELECT * FROM `tbl_users` WHERE `role_id` = ?";
    return await query(sql, [role]);
};

const getAllUserEmail = async () => {
    const sql = "SELECT `email` FROM `tbl_users`";
    return await query(sql, []);
};

const getUserWithRoleById = async (userId) => {
    const sql = `
        SELECT 
            tbl_users.id AS 'id',
            tbl_users.first_name AS 'first_name',
            tbl_users.last_name AS 'last_name',
            tbl_users.dis_name AS 'dis_name',
            tbl_users.email AS 'email',
            tbl_users.password AS 'password',
            tbl_users.avarta AS 'avarta',
            tbl_users.description AS 'description',
            tbl_users.last_login_on AS 'last_login_on',
            tbl_users.status AS 'status',
            tbl_users.created_on AS 'created_on',
            tbl_users.updated_on AS 'updated_on',
            tbl_roles.id AS 'role_id',
            tbl_roles.name AS 'role_name',
            tbl_roles.description AS 'role_description',
            tbl_roles.created_on AS 'role_created_on',
            tbl_roles.updated_on AS 'role_updated_on'
        FROM tbl_users
        INNER JOIN tbl_roles ON tbl_roles.id = tbl_users.role_id
        WHERE tbl_users.id = ?;
    `
    return await query(sql, [userId]);
}

const getUserWithRoleByEmail = async (dis_name) => {
    const sql = `
        SELECT 
            tbl_users.id AS 'id',
            tbl_users.first_name AS 'first_name',
            tbl_users.last_name AS 'last_name',
            tbl_users.dis_name AS 'dis_name',
            tbl_users.email AS 'email',
            tbl_users.password AS 'password',
            tbl_users.avarta AS 'avarta',
            tbl_users.description AS 'description',
            tbl_users.last_login_on AS 'last_login_on',
            tbl_users.status AS 'status',
            tbl_users.created_on AS 'created_on',
            tbl_users.updated_on AS 'updated_on',
            tbl_roles.id AS 'role_id',
            tbl_roles.name AS 'role_name',
            tbl_roles.description AS 'role_description',
            tbl_roles.created_on AS 'role_created_on',
            tbl_roles.updated_on AS 'role_updated_on'
        FROM tbl_users
        INNER JOIN tbl_roles ON tbl_roles.id = tbl_users.role_id
        WHERE tbl_users.dis_name = ?
        AND tbl_users.status = 1;
    `;
    return await query(sql, [dis_name]);
};

const getRoleById = async (roleId) => {
    const sql = "SELECT * FROM tbl_roles WHERE id = ?";
    return await query(sql, [roleId]);
};


const getAllRole = async () => {
    const sql = "SELECT * FROM tbl_roles";
    return await query(sql, []);
}

const getAllRequest = async () => {
    const sql = `
        SELECT 
            tbl_user_request.id AS 'id',
            tbl_user_request.request_type AS 'type',
            tbl_user_request.request_description AS 'description',
            tbl_user_request.status,
            tbl_user_request.created_on,
            tbl_user_request.updated_on,
            tbl_users.id AS 'user_id',
            tbl_users.first_name AS 'first_name',
            tbl_users.last_name AS 'last_name',
            tbl_users.dis_name AS 'dis_name',
            tbl_users.email AS 'email',
            tbl_users.avarta AS 'avarta',
            tbl_roles.id AS 'role_id',
            tbl_roles.name AS 'role_name'
        FROM tbl_user_request
        LEFT JOIN tbl_users ON tbl_user_request.user_id = tbl_users.id
        LEFT JOIN tbl_roles ON tbl_users.role_id = tbl_roles.id    
    `;
    return await query(sql, []);
}

const getRequest = async (requestId) => {
    const sql = `
        SELECT 
            tbl_user_request.id AS 'id',
            tbl_user_request.request_type AS 'type',
            tbl_user_request.request_description AS 'description',
            tbl_user_request.status,
            tbl_user_request.created_on,
            tbl_user_request.updated_on,
            tbl_users.id AS 'user_id',
            tbl_users.first_name AS 'first_name',
            tbl_users.last_name AS 'last_name',
            tbl_users.dis_name AS 'dis_name',
            tbl_users.email AS 'email',
            tbl_users.avarta AS 'avarta',
            tbl_roles.id AS 'role_id',
            tbl_roles.name AS 'role_name'
        FROM tbl_user_request
        LEFT JOIN tbl_users ON tbl_user_request.user_id = tbl_users.id
        LEFT JOIN tbl_roles ON tbl_users.role_id = tbl_roles.id
        WHERE tbl_user_request.id = ? 
    `;
    return await query(sql, requestId);
}

// Counts
const countAllUsers = async (search, role) => {
    let values = [];
    let sql = ` 
        SELECT 
            COUNT(tbl_users.id) AS 'total'
        FROM tbl_users
        INNER JOIN tbl_roles ON tbl_roles.id = tbl_users.role_id
    `;
    if(search.length > 0 && role <= 0){
        sql += ` WHERE (
            tbl_users.id = ? OR tbl_roles.id = ? OR
            tbl_users.first_name LIKE ? OR 
            tbl_users.last_name LIKE ? OR 
            tbl_users.dis_name LIKE ? OR 
            tbl_users.email LIKE ? OR 
            tbl_users.status LIKE ? OR
            tbl_roles.name LIKE ?
        )`;
        values.push(search, search, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    if(role !== 0){
        sql += ` WHERE tbl_roles.id = ?`;
        values.push(role);
        if(search.length > 0){
            sql += ` AND (
                tbl_users.id = ? OR
                tbl_users.first_name LIKE ? OR 
                tbl_users.last_name LIKE ? OR 
                tbl_users.dis_name LIKE ? OR 
                tbl_users.email LIKE ? OR 
                tbl_users.status LIKE ? OR
                tbl_roles.name LIKE ?
            )`;
            values.push(search, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }
    }
    return await query(sql, values);
}

// Delete
// const deleteUserById = async (userId) => {
//     const sql = "DELETE FROM tbl_users WHERE id = ?";
//     return await query(sql, [userId]);
// }

const deleteUserById = async (userId) => {
  const sql = "UPDATE `tbl_users` SET status = 2 WHERE id = ?";
  return await query(sql, [userId]);
};


const deleteRoleById = async (roleId) => {
    const sql = "DELETE FROM tbl_roles WHERE id = ?";
    return await query(sql, [roleId]);
}

module.exports = { 
    createUser, 
    createRole,
    createRequest,
    updateRequestStatus,
    updateLastLogin, 
    updateUserProfile,
    updateUserProfileImage,
    changePassword,
    changeUserRole,
    updateRole,
    getAllUsers,
    getAllUsersWithDetails,
    getUserById,
    getUserByRole,
    getAllUserEmail,
    getUserWithRoleById,
    getUserWithRoleByEmail,
    getRoleById,
    getAllRole,
    getAllRequest,
    getRequest,
    countAllUsers,
    deleteUserById,
    deleteRoleById
};