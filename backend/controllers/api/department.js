const departmentResource = require('../../resources/department');
const handleResponses = require('../../utils/handleResponses');

const getAllDepartments = async (req, res) => {
    try {
        const data = await departmentResource.getAllDepartments(req.query.search || '');
        res.status(data.status).json(data.body);
    } catch (err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const createDepartment = async (req, res) => {
    try {
        const data = await departmentResource.createDepartment(req.body);
        res.status(data.status).json(data.body);
    } catch (err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const updateDepartment = async (req, res) => {
    try {
        const data = await departmentResource.updateDepartment(req.params.id, req.body);
        res.status(data.status).json(data.body);
    } catch (err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const deleteDepartment = async (req, res) => {
    try {
        const data = await departmentResource.deleteDepartment(req.params.id);
        res.status(data.status).json(data.body);
    } catch (err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

module.exports = {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
}
