const { result, first } = require('lodash');
const { registerValidator, loginValidator } = require('../validations/auth');
const handleValidations = require('../utils/handleValidations');
const handleResponses = require('../utils/handleResponses');
const getDate = require('../utils/date');
const authUtils = require('../utils/auth');
const userModel = require('../models/userModel');
const helpers = require('../utils/helpers');
const { sendEmail } = require('../utils/mailer');

const register = async (body) => {
    const validationError = handleValidations(registerValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid Data", validationError, body);
    let validEmail = true;
    const userEmails = await userModel.getAllUserEmail();
    userEmails.forEach((element) => {
        if(body.email === element.email){
            validEmail = false;
            return;
        }
    })
    if(!validEmail) return handleResponses.errorResponse(401, 'Email registered already.', null, []);
    if(body.role_id == 1) return handleResponses.errorResponse(401, "Cannot register as super admin.", null, []);
    const password = await authUtils.hashPassword(body.password);
    let role_id = body.role_id == '' ? 3 : body.role_id;
    const insertRes = await userModel.createUser([   
        role_id, 
        body.firstname, 
        body.lastname, 
        body.dis_name,
        body.email, 
        password, 
        body.description,
    ])
    const userRes = await userModel.getUserWithRoleById(insertRes.insertId);
    const result = helpers.constructUserProfile(userRes[0], "");
    await sendEmail(body.email, body.password);
    return handleResponses.successResponse(200, 'Registered an account successfully', result, null);
}

const login = async (body) => {

    const validationError = handleValidations(loginValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid Data", validationError, body);

    const res = await userModel.getUserWithRoleByEmail(body.dis_name);
    if(res.length == 0){
        return handleResponses.errorResponse(401, 'Invalid Username', null, [])
    }
    if(res[0].role_id == 1) return handleResponses.errorResponse(401, 'Login Failed.', null, []);
    let decryptedPassword = await authUtils.comparePassword(body.password, res[0].password);
    if(decryptedPassword){
        let returnValue = [];
        const currentDate = getDate.getCurrentDate();
        await userModel.updateLastLogin([currentDate, res[0].id]);

        let rememberMe = false;
        if(body.rememberMe == 1){ rememberMe = true; }
        else if(body.rememberMe == 0){ rememberMe = false; }
        const maxAge = rememberMe == true ? 10 * 365 * 24 * 60 * 60 * 1000 : 3 * 24 * 60 * 60 * 1000
        const token = authUtils.generateToken(res[0].id, maxAge);
        
        returnValue.push(helpers.constructUserProfile(res[0], token));
        const cookie = {
            name: 'jwtToken',
            value: token,
            options: {
                // httpOnly: true,
                maxAge: maxAge,
                sameSite: 'Lax',
                // secure: true,
            },
        }
        return handleResponses.successResponse(200, 'Login Successfully', returnValue, cookie)
    }else{
        return handleResponses.errorResponse(401, 'Invalid Password', null, []);
    }
}

const loginSuperAdmin = async (body) => {

    const validationError = handleValidations(loginValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid Data", validationError, body);

    const res = await userModel.getUserWithRoleByEmail(body.dis_name);
    if(res.length == 0){
        return handleResponses.errorResponse(401, 'Invalid Username', null, [])
    }
    if(res[0].role_id != 1) return handleResponses.errorResponse(401, 'Login Failed.', null, []);
    let decryptedPassword = await authUtils.comparePassword(body.password, res[0].password);
    if(decryptedPassword){
        let returnValue = [];
        const currentDate = getDate.getCurrentDate();
        await userModel.updateLastLogin([currentDate, res[0].id]);

        let rememberMe = false;
        if(body.rememberMe == 1){ rememberMe = true; }
        else if(body.rememberMe == 0){ rememberMe = false; }
        const maxAge = rememberMe == true ? 10 * 365 * 24 * 60 * 60 * 1000 : 3 * 24 * 60 * 60 * 1000
        const token = authUtils.generateToken(res[0].id, maxAge);
        
        returnValue.push(helpers.constructUserProfile(res[0], token));
        const cookie = {
            name: 'jwtToken',
            value: token,
            options: {
                httpOnly: true,
                maxAge: maxAge,
                // sameSite: 'Lax',
                // secure: true,
            },
        }
        return handleResponses.successResponse(200, 'Login Successfully', returnValue, cookie)
    }else{
        return handleResponses.errorResponse(401, 'Invalid Password', null, []);
    }
}

const logout = async () => {
    const cookie = {
        name: 'jwtToken',
        value: '',
        options: {maxAge: 1},
    }
    return handleResponses.successResponse(200, 'Logout Successfully', [], cookie);
}

module.exports = {
    register,
    login,
    loginSuperAdmin,
    logout,
}