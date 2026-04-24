const { query } = require('../config/db');
const { isDepartmentSchemaError } = require('../utils/dbCompat');

const createDepartment = async (values) => {
    const sql = "INSERT INTO `tbl_departments`(`name`, `description`) VALUES (?, ?)";
    return await query(sql, values);
}

const updateDepartment = async (values) => {
    const sql = "UPDATE `tbl_departments` SET `name` = ?, `description` = ? WHERE `id` = ?";
    return await query(sql, values);
}

const deleteDepartment = async (departmentId) => {
    const sql = "DELETE FROM `tbl_departments` WHERE `id` = ?";
    return await query(sql, [departmentId]);
}

const getDepartmentById = async (departmentId) => {
    const sql = "SELECT * FROM `tbl_departments` WHERE `id` = ?";
    return await query(sql, [departmentId]);
}

const getAllDepartments = async (search = '') => {
    const values = [];
    let sql = `
        SELECT
            tbl_departments.id,
            tbl_departments.name,
            tbl_departments.description,
            tbl_departments.created_on,
            tbl_departments.updated_on,
            COUNT(DISTINCT tbl_users.id) AS total_users,
            COUNT(DISTINCT tbl_project.id) AS total_projects
        FROM tbl_departments
        LEFT JOIN tbl_users
            ON tbl_users.department_id = tbl_departments.id
            AND tbl_users.status = 1
        LEFT JOIN tbl_project
            ON tbl_project.department_id = tbl_departments.id
    `;

    if (search.length > 0) {
        sql += " WHERE (tbl_departments.id = ? OR tbl_departments.name LIKE ?)";
        values.push(search, `%${search}%`);
    }

    sql += `
        GROUP BY
            tbl_departments.id,
            tbl_departments.name,
            tbl_departments.description,
            tbl_departments.created_on,
            tbl_departments.updated_on
        ORDER BY tbl_departments.name ASC
    `;

    try {
        return await query(sql, values);
    } catch (err) {
        if (isDepartmentSchemaError(err)) return [];
        throw err;
    }
}

const countDepartmentUsage = async (departmentId) => {
    const sql = `
        SELECT
            (SELECT COUNT(*) FROM tbl_users WHERE department_id = ? AND status = 1) AS total_users,
            (SELECT COUNT(*) FROM tbl_project WHERE department_id = ?) AS total_projects
    `;
    try {
        return await query(sql, [departmentId, departmentId]);
    } catch (err) {
        if (isDepartmentSchemaError(err)) return [{ total_users: 0, total_projects: 0 }];
        throw err;
    }
}

module.exports = {
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentById,
    getAllDepartments,
    countDepartmentUsage,
}
