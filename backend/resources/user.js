const userModels = require('../models/userModel');
const jwt = require('../utils/jwt');
const handleResponse = require('../utils/handleResponses');
const handleValidations = require('../utils/handleValidations');
const helperUtils = require('../utils/helpers');
const authUtils = require('../utils/auth');
const { sendEmailChangePass, sendEmailRejectedChangePass } = require('../utils/mailer');
const { changeUserPassValidator } = require('../validations/profile');
const { userRequestValidator, updateRequestValidator } = require('../validations/auth');
const { result } = require('lodash');
const { request } = require('express');

const getAllUsers = async (search, role, page, perpage) => {
    page = Number(page);
    perpage = Number(perpage);
    role = Number(role);
    let resultTemp = [];
    const userRes = await userModels.getAllUsersWithDetails(search, role, page, perpage);
    userRes.forEach((element) => {
        resultTemp.push(helperUtils.constructUserProfile(element, null));
    });
    const userCount = await userModels.countAllUsers(search, role);
    const totalPages = Math.ceil(userCount[0].total / perpage);
    const results = helperUtils.constructDataWithPaginate(
        resultTemp,
        userCount[0].total,
        page,
        perpage,
        totalPages
    );
    return handleResponse.successResponse(200, "Get all users successfully.", results, null);
}

const getUser = async (userId) => {
    userId = Number(userId);
    const userRes = await userModels.getUserWithRoleById(userId);
    const result = helperUtils.constructUserProfile(userRes[0], null);
    return handleResponse.successResponse(200, "Get a user successfully.", result, null);
}

const changeUserPassword = async (userId, body) => {
    userId = Number(userId);
    const validationError = handleValidations(changeUserPassValidator(body));
    if(validationError) return handleResponse.errorResponse(400, "Invalid Data", validationError, body);
    const password = await authUtils.hashPassword(body.password);
    await userModels.changePassword([password, userId]);
    const userRes = await userModels.getUserById(userId);
    await sendEmailChangePass(userRes[0].email, body.password);
    return handleResponse.successResponse(200, "Changed a user password successfully.", [], null);
}

const deleteUser = async (userId) => {
    userId = Number(userId);
    await userModels.deleteUserById(userId);
    return handleResponse.successResponse(200, "Delete a user successfully.", [], null);
}

const changeRole = async (userId, body) => {
    userId = Number(userId);
    roleId = Number(body.new_role_id);
    const roleRes = await userModels.getRoleById(roleId);
    if(roleRes.length <= 0){
        return handleResponse.errorResponse(400, "Invalid role id..!", null, []);
    }
    await userModels.changeUserRole([roleId, userId]);
    return handleResponse.successResponse(200, "User profile updated.", [], null);
}

// User role
const createRole = async (body) => {
    await userModels.createRole([body.name, body.description]);
    return handleResponse.successResponse(200, "Created a role.", [], null);
}

const getAllRoles = async () => {
    const roleRes = await userModels.getAllRole();
    return handleResponse.successResponse(200, "Get all roles successfully.", roleRes, null);
}

const editRole = async (roleId, body) => {
    roleId = Number(roleId);
    const checkRole = await userModels.getRoleById(roleId);
    if(checkRole <= 0) return handleResponse.errorResponse(400, "Invalid role id.", null, []);
    await userModels.updateRole([body.name, body.description, roleId]);
    return handleResponse.successResponse(200, "Edited role successfully.", [], null);
}

const deleteRole = async (roleId) => {
    roleId = Number(roleId);
    const checkRole = await userModels.getRoleById(roleId);
    if(checkRole <= 0) return handleResponse.errorResponse(400, "Invalid role id.", null, []);
    await userModels.deleteRoleById(roleId);
    return handleResponse.successResponse(200, "Deleted role successfully.", [], null);
}

// User Request
const getAllRequest = async () => {
    const requestRes = await userModels.getAllRequest();
    let result = [];
    requestRes.forEach((element) => {
        result.push({
            id : element.id,
            type : element.type,
            description : element.description,
            status : element.status,
            status_comment : '1 for pending, 2 for approved, 3 for rejected',
            user : {
                id : element.user_id,
                first_name : element.first_name,
                last_name : element.last_name,
                dis_name : element.dis_name,
                email : element.email,
                avarta : element.avarta,
                role : {
                    id : element.role_id,
                    name : element.role_name
                }
            },
            created_on : element.created_on,
            updated_on : element.updated_on
        })
    })
    return handleResponse.successResponse(200, "Get all requests successfully.", result, null);
}

const sendRequest = async (token, body) => {
    const validationError = handleValidations(userRequestValidator(body));
    if(validationError) return handleResponse.errorResponse(400, "Invalid Data", validationError, body);
    const decodedToken = await jwt.verifyToken(token); 
    const userRes = await userModels.getUserById(decodedToken.id);
    if(userRes[0].email !== body.email) return handleResponse.errorResponse(200, "Ivalid email", null, []);
    const values = [
        decodedToken.id,
        'Request new password',
        `User ${body.email} forgot password and requested for new password.`,
        1
    ];
    await userModels.createRequest(values);
    return handleResponse.successResponse(200, "Requested new password to admin successfully.", [], null);
}

const updateRequest = async ( requestId, body ) => {
    requestId = Number(requestId);
    const validationError = handleValidations(updateRequestValidator(body));
    if(validationError) return handleResponse.errorResponse(400, "Invalid Data", validationError, body);
    const userRes = await userModels.getRequest(requestId);
    if(body.status == 2){
        const defPassword = "NewPass$$" + Date.now();
        const password = await authUtils.hashPassword(String(defPassword));
        await userModels.changePassword([password, userRes[0].user_id]);
        await sendEmailChangePass(userRes[0].email, defPassword);
    } else if(body.status == 3){
        await sendEmailRejectedChangePass(userRes[0].email);
    } else {
        return handleResponse.errorResponse(402, "Invalid status id.", null, []);
    }
    await userModels.updateRequestStatus([body.status, requestId]);
    return handleResponse.successResponse(200, "Updated request status successfully.", [], null);
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