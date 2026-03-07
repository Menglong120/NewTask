const { result } = require('lodash');
const profileResource = require('../../resources/profile');
const handleResponses = require('../../utils/handleResponses');

const getProfile = async (req, res) => {
    try {
        const token = req.cookies.jwtToken;
        if(token){
            const data = await profileResource.getProfile(token);
            res.status(data.status).json(data.body);
        }
    }catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const editProfile = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await profileResource.editProfile(token, req.body);
            res.status(data.status).json(data.body);
        }
    }catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const editProfileImage = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await profileResource.editProfileImage(token, req.files);
            res.status(data.status).json(data.body);
        }
    }catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const changePassword = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await profileResource.changePassword(token, req.body);
            res.status(data.status).json(data.body);
        }
    }catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

module.exports = {
    getProfile,
    editProfile,
    editProfileImage,
    changePassword,
}