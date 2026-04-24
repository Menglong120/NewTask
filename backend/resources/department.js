const departmentModel = require('../models/departmentModel');
const handleResponses = require('../utils/handleResponses');

const getAllDepartments = async (search = '') => {
    const departments = await departmentModel.getAllDepartments(search);
    return handleResponses.successResponse(200, "Get all departments successfully.", departments, null);
}

const createDepartment = async (body) => {
    if (!body?.name || String(body.name).trim().length < 2) {
        return handleResponses.errorResponse(400, "Department name must be at least 2 characters.", null, body);
    }

    await departmentModel.createDepartment([String(body.name).trim(), body.description || null]);
    return handleResponses.successResponse(200, "Created department successfully.", [], null);
}

const updateDepartment = async (departmentId, body) => {
    const checkDepartment = await departmentModel.getDepartmentById(Number(departmentId));
    if (checkDepartment.length <= 0) {
        return handleResponses.errorResponse(404, "Department not found.", null, []);
    }

    if (!body?.name || String(body.name).trim().length < 2) {
        return handleResponses.errorResponse(400, "Department name must be at least 2 characters.", null, body);
    }

    await departmentModel.updateDepartment([String(body.name).trim(), body.description || null, Number(departmentId)]);
    return handleResponses.successResponse(200, "Updated department successfully.", [], null);
}

const deleteDepartment = async (departmentId) => {
    const numericDepartmentId = Number(departmentId);
    const checkDepartment = await departmentModel.getDepartmentById(numericDepartmentId);
    if (checkDepartment.length <= 0) {
        return handleResponses.errorResponse(404, "Department not found.", null, []);
    }

    const usage = await departmentModel.countDepartmentUsage(numericDepartmentId);
    if ((usage[0]?.total_users || 0) > 0 || (usage[0]?.total_projects || 0) > 0) {
        return handleResponses.errorResponse(
            400,
            "Cannot delete a department that is assigned to users or projects.",
            null,
            usage[0]
        );
    }

    await departmentModel.deleteDepartment(numericDepartmentId);
    return handleResponses.successResponse(200, "Deleted department successfully.", [], null);
}

module.exports = {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
}
