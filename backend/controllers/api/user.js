const userResource = require('../../resources/user');
const handleResponse = require('../../utils/handleResponses');

const getAllUsers = async (req, res) => {
    try {
        const data = await userResource.getAllUsers(req.query.search, req.query.role, req.query.page, req.query.perpage);
        res.status(data.status).json(data.body);
    }catch(err) {
        res.status(400).json(handleResponse.catchErrorResponse(err));
    }
}

const getUser = async (req, res) => {
    try{
        const data = await userResource.getUser(req.params.id);
        res.status(data.status).json(data.body);
    }catch(err) {
        res.status(400).json(handleResponse.catchErrorResponse(err));
    }
}

const changeUserPassword = async (req, res) => {
    try{
        const data = await userResource.changeUserPassword(req.params.id, req.body);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponse.catchErrorResponse(err));
    }
}

const deleteUser = async (req, res) => {
    try{
        const data = await userResource.deleteUser(req.params.id);
        res.status(data.status).json(data.body);
    }catch(err) {
        res.status(400).json(handleResponse.catchErrorResponse(err));
    }
}  

const changeRole = async (req, res) => {
    try{
        const data = await userResource.changeRole(req.params.id, req.body);
        res.status(data.status).json(data.body);
    }catch(err) {
        res.status(400).json(handleResponse.catchErrorResponse(err));
    }
}

// User role
const createRole = async (req, res) => {
    try{
        const data = await userResource.createRole(req.body);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponse.catchErrorResponse(err));
    }
}

const getAllRoles = async (req, res) => {
    try{
        const data = await userResource.getAllRoles();
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponse.catchErrorResponse(err));
    }
}

const editRole = async (req, res) => {
    try{
        const data = await userResource.editRole(req.params.id, req.body);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponse.catchErrorResponse(err));
    }
}

const deleteRole = async (req, res) => {
    try{
        const data = await userResource.deleteRole(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponse.catchErrorResponse(err));
    }
}

// User Requests
const getAllRequest = async (req, res) => { 
    try{
        const data = await userResource.getAllRequest();
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponse.catchErrorResponse(err));
    }
}

const sendRequest = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await userResource.sendRequest(token, req.body);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponse.catchErrorResponse(err));
    }
}

const updateRequest = async (req, res) => {
    try{
        const data = await userResource.updateRequest(req.params.id, req.body);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponse.catchErrorResponse(err));
    }
}

module.exports = {
    getAllUsers,
    getUser,
    deleteUser,
    changeRole,
    changeUserPassword,
    createRole,
    getAllRoles,
    editRole,
    deleteRole,
    sendRequest,
    getAllRequest,
    updateRequest
}