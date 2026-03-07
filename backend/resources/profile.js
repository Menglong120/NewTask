const { editProfileValidator, changePasswordValidator } = require('../validations/profile');
const handleValidations = require('../utils/handleValidations');
const handleResponses = require('../utils/handleResponses');
const jwt = require('../utils/jwt');
const helpers = require('../utils/helpers');
const fileUpload = require('../utils/fileUpload');
const userModel = require('../models/userModel');
const authUtils = require('../utils/auth');

const getProfile = async (token) => {
    let profileValue = [];
    const decodedToken = await jwt.verifyToken(token);
    let res = await userModel.getUserWithRoleById(decodedToken.id);
    profileValue.push(helpers.constructUserProfile(res[0], token));
    return handleResponses.successResponse(200, 'Getted a user profile successfully.', profileValue, null);
}

const editProfile = async (token, body) => {
    const validationError = handleValidations(editProfileValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid Data", validationError, body);
     
    const decodedToken = await jwt.verifyToken(token);
    const resUser = await userModel.getUserById(decodedToken.id);
    let email = '';
    if(resUser[0].role_id == 3) email = resUser[0].email;
    else email = body.email;
    await userModel.updateUserProfile([body.firstname, body.lastname, body.disname, email, body.description, decodedToken.id]);
    return handleResponses.successResponse(200, "User profile updated.", [], null);
}

const editProfileImage = async (token, file) => {
    const decodedToken = await jwt.verifyToken(token);
    if(!file) return handleResponses.errorResponse(404, "File not found", null, []);

    const currentUserData = await userModel.getUserById(decodedToken.id);
    const uploadedFileName = await fileUpload.updateImageFile(file.image, currentUserData[0].avarta, './public/upload/', "default_photo.jpg");
    userModel.updateUserProfileImage([uploadedFileName, decodedToken.id]);
    return handleResponses.successResponse(200, "User profile Image updated.", [], null);
}

const changePassword = async (token, body) => {
    const validationError = handleValidations(changePasswordValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid Data", validationError, body);

    const decodedToken = await jwt.verifyToken(token);
    const resUser = await userModel.getUserById(decodedToken.id);
    const decryptedPassword = await authUtils.comparePassword(body.old_pass, resUser[0].password);
    if(decryptedPassword){
        const password = await authUtils.hashPassword(body.renew_pass);
        userModel.changePassword([password, decodedToken.id]);
        return handleResponses.successResponse(200, "Password changed.", [], null);
    }else{
        return handleResponses.errorResponse(401, 'Invalid Password', null, []);
    }
}

module.exports = {
    getProfile,
    editProfile,
    editProfileImage,
    changePassword,
}