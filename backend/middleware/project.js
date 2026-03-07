const jwt = require('jsonwebtoken');
const userModels = require('../models/userModel');
const projectModels = require('../models/projectModel');
const { result } = require('lodash');

const requireProjectMember = (req, res, next) => {
    const token = req.cookies.jwtToken;
    if(token){
        jwt.verify(token, 'kot secret', async (err, decodedToken) => {
            if(err){
                res.status(400).json({
                    result: false,
                    msg: 'You need to login!',
                    data: []
                });
            }else{
                if(decodedToken){
                    const memberRes = await projectModels.getAllProjectMembers(req.params.id);
                    if(memberRes.length <= 0){
                        return res.status(400).json({
                            result: false,
                            msg: 'This project is not existed.',
                            data: []
                        })
                    }
                    let userCheck = false;
                    memberRes.forEach((element) => {
                        if(element.user_id == decodedToken.id){
                            userCheck = true;
                        }
                    })
                    if(!userCheck){
                        const userRes = await userModels.getUserById(decodedToken.id);
                        if(userRes[0].role_id == 1){
                            return next();
                        }
                        return res.status(400).json({
                            result: false,
                            msg: 'You are not in this project.',
                            data: []
                        })
                    }
                    next();
                }
            }
        });
    }else{
        res.status(400).json({
            result: false,
            msg: 'You need to login!',
            data: []
        });
    }
}

const requireProjectMemberAdmin = (req, res, next) => {
    const token = req.cookies.jwtToken;
    if(token){
        jwt.verify(token, 'kot secret', async (err, decodedToken) => {
            if(err){
                res.status(400).json({
                    result: false,
                    msg: 'You need to login!',
                    data: []
                });
            }else{
                if(decodedToken){
                    const memberRes = await projectModels.getAllProjectMembers(req.params.id);
                    if(memberRes.length <= 0){
                        return res.status(400).json({
                            result: false,
                            msg: 'This project is not existed.',
                            data: []
                        })
                    }
                    const userRes = await userModels.getUserById(decodedToken.id);
                    if(userRes[0].role_id == 1){
                        return next();
                    }
                    let userCheck = false;
                    memberRes.forEach((element) => {
                        if(element.user_id == decodedToken.id){
                            userCheck = true;
                        }
                    })
                    if(!userCheck){
                        return res.status(400).json({
                            result: false,
                            msg: 'You are not in this project.',
                            data: []
                        })
                    } else {
                        if(userRes[0].role_id != 2){
                            return res.status(400).json({
                                result: false,
                                msg: 'You are not allowed to do this action (Only admin can do)..!',
                                data: []
                            })
                        }
                    }
                    next();
                }
            }
        });
    }else{
        res.status(400).json({
            result: false,
            msg: 'You need to login!',
            data: []
        });
    }
}

const checkProject = async (req, res, next) => {
    const projectCheck = await projectModels.getProjectById(req.params.id);
    if(projectCheck.length <= 0) {
        return res.status(400).json({
            result: false,
            msg: 'This project is not existed..!',
            data: []
        })
    }else{
        next();
    }
}

const checkMemberAddToProject = async (req, res, next) => {
    projectId = JSON.parse(req.params.id);
    const members = JSON.parse(req.body.user_id);
    let userCheck = false;
    let errUser = [];
    for( i = 0; i < members.length; i++ ){
        const userRes = await userModels.getUserById(members[i]);
        if(userRes.length <= 0) { userCheck = true; errUser.push(members[i]) }
    }
    if(userCheck){
        return res.status(400).json({
            result: false,
            msg: 'User id ' + errUser + ' cannot found.',
            data: []
        })
    } else {
        const memberRes = await projectModels.getAllProjectMembers(req.params.id);
        let memberCheck = false;
        let errId = [];
        for( i = 0; i < members.length; i++){
            memberRes.forEach((element) => {
                if(element.user_id == members[i]){
                    memberCheck = true;
                    errId.push(element.user_email);
                }
            })
        }
        if(memberCheck) {
            return res.status(400).json({
                result: false,
                msg: errId + ' - added in this project already.',
                data: []
            })
        }            
    }
    next();
}

const checkMemberProjectByMemberId = (req, res, next) => {
    const token = req.cookies.jwtToken;
    jwt.verify(token, 'kot secret', async (err, decodedToken) => {
        if(decodedToken){
            const memberId = req.params.id;
            const memberRes = await projectModels.getAllMembersById(memberId);
            if(memberRes.length <= 0) {
                return res.status(400).json({
                    result: false,
                    msg: 'Invalid member id.',
                    data: []
                })
            }
            let memberCheck = true;
            const memberResByUser = await projectModels.getAllMembersByUserId(decodedToken.id);
            for( i = 0; i < memberResByUser.length; i++ ){
                if( memberResByUser[i].project_id == memberRes[0].project_id ){
                    memberCheck = false;
                }
            }
            if(memberCheck){
                const userRes = await userModels.getUserById(decodedToken.id);
                    if(userRes[0].role_id == 1){
                        return next();
                    }
                return res.status(400).json({
                    result: false,
                    msg: 'You are not in this project.',
                    data: []
                })
            }   
            next();
        }
    });
}

const checkProjectResource = async (req, res, next) => {
    const resourceCheck = await projectModels.getProjectResourceById(req.params.id);
    if(resourceCheck.length > 0){
        next();
    } else {
        res.status(400).json({
            result: false,
            msg: 'This resource is not existed..!',
            data: []
        });
    }
}

const checkProjectResourceFile = async (req, res, next) => {
    const fileRes = await projectModels.getResourceFile(req.params.id);
    if(fileRes.length <= 0){
        return res.status(400).json({
            result : false,
            msg : "Resource file id is invalid..!",
            error : null,
            data : []
        })
    }
    next();
}

const checkProjectActivity = async (req, res, next) => {
    const activityCheck = await projectModels.getProjectActivityById(req.params.id);
    if(activityCheck.length <= 0){
        return res.status(400).json({
            result: false,
            msg: "This activity is not existed..!",
            data: []
        })
    }
    next();
}

module.exports = {
    requireProjectMember,
    requireProjectMemberAdmin,
    checkProject,
    checkMemberAddToProject,
    checkMemberProjectByMemberId,
    checkProjectResource,
    checkProjectResourceFile,
    checkProjectActivity,
}