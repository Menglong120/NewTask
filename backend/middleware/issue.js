const jwt = require('jsonwebtoken');
const issueModel = require('../models/issueModel');
const subIssueModel = require('../models/subIssueModel');
const projectModel = require('../models/projectModel');
const userModel = require('../models/userModel');
const { result } = require('lodash');

const checkCategory = async (req, res, next) => {
    const categoryRes = await issueModel.getCategoryById(req.params.id);
    if(categoryRes.length <= 0){
        return res.status(400).json({
            result : false,
            msg : "Invalid category id",
            data : []
        });
    }
    const token = req.cookies.jwtToken;
    jwt.verify(token, 'kot secret', async (err, decodedToken) => {
        const memberRes = await projectModel.getAllProjectMembers(categoryRes[0].project_id);

        let userCheck = false;
        memberRes.forEach((element) => {
            if(element.user_id == decodedToken.id){
                userCheck = true;
            }
        })
        if(!userCheck){
            const userRes = await userModel.getUserById(decodedToken.id);
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
    });
}

const checkLabel = async (req, res, next) => {
    const labelRes = await issueModel.getLabelById(req.params.id);
    if(labelRes.length <= 0){
        return res.status(400).json({
            result : false,
            msg : "Invalid label id",
            data : []
        });
    }
    const token = req.cookies.jwtToken;
    jwt.verify(token, 'kot secret', async (err, decodedToken) => {
        const memberRes = await projectModel.getAllProjectMembers(labelRes[0].project_id);

        let userCheck = false;
        memberRes.forEach((element) => {
            if(element.user_id == decodedToken.id){
                userCheck = true;
            }
        })
        if(!userCheck){
            const userRes = await userModel.getUserById(decodedToken.id);
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
    });
}

const checkPriority = async (req, res, next) => {
    const priorityRes = await issueModel.getPriorityById(req.params.id);
    if(priorityRes.length <= 0){
        return res.status(400).json({
            result : false,
            msg : "Invalid priority id",
            data : []
        });
    }
    const token = req.cookies.jwtToken;
    jwt.verify(token, 'kot secret', async (err, decodedToken) => {
        const memberRes = await projectModel.getAllProjectMembers(priorityRes[0].project_id);

        let userCheck = false;
        memberRes.forEach((element) => {
            if(element.user_id == decodedToken.id){
                userCheck = true;
            }
        })
        if(!userCheck){
            const userRes = await userModel.getUserById(decodedToken.id);
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
    });
}

const checkStatus = async (req, res, next) => {
    const statusRes = await issueModel.getStatusById(req.params.id);
    if(statusRes.length <= 0){
        return res.status(400).json({
            result : false,
            msg : "Invalid status id",
            data : []
        });
    }
    const token = req.cookies.jwtToken;
    jwt.verify(token, 'kot secret', async (err, decodedToken) => {
        const memberRes = await projectModel.getAllProjectMembers(statusRes[0].project_id);

        let userCheck = false;
        memberRes.forEach((element) => {
            if(element.user_id == decodedToken.id){
                userCheck = true;
            }
        })
        if(!userCheck){
            const userRes = await userModel.getUserById(decodedToken.id);
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
    });
}

const checkTracker = async (req, res, next) => {
    const trackerRes = await issueModel.getTrackerById(req.params.id);
    if(trackerRes.length <= 0){
        return res.status(400).json({
            result : false,
            msg : "Invalid tracker id",
            data : []
        });
    }
    const token = req.cookies.jwtToken;
    jwt.verify(token, 'kot secret', async (err, decodedToken) => {
        const memberRes = await projectModel.getAllProjectMembers(trackerRes[0].project_id);

        let userCheck = false;
        memberRes.forEach((element) => {
            if(element.user_id == decodedToken.id){
                userCheck = true;
            }
        })
        if(!userCheck){
            const userRes = await userModel.getUserById(decodedToken.id);
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
    });
}

const checkIssue = async (req, res, next) => {
    const issueRes = await issueModel.getIssueById(req.params.id);
    if(issueRes.length <= 0){
        return res.status(400).json({
            result : false,
            msg : "Invalid issue id",
            data : []
        });
    }
    const token = req.cookies.jwtToken;
    jwt.verify(token, 'kot secret', async (err, decodedToken) => {
        const catRes = await issueModel.getCategoryById(issueRes[0].category_id);
        const memberRes = await projectModel.getAllProjectMembers(catRes[0].project_id);

        let userCheck = false;
        memberRes.forEach((element) => {
            if(element.user_id == decodedToken.id){
                userCheck = true;
            }
        })
        if(!userCheck){
            const userRes = await userModel.getUserById(decodedToken.id);
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
    });
}

const checkNote = async (req, res, next) => {
    const noteRes = await issueModel.getNoteById(req.params.id);
    if(noteRes.length <= 0){
        return res.status(400).json({
            result : false,
            msg : "Invalid note id",
            data : []
        });
    }
    next();
}

const checkIssueLabelId = async (req, res, next) => {
    const labelRes = await issueModel.getLabelById(req.body.item);
    if(labelRes.length <= 0){
        return res.status(400).json({
            result : false,
            msg : "Invalid label id",
            data : []
        });
    }
    next();
}

const checkIssuePriorityId = async (req, res, next) => {
    const priorityRes = await issueModel.getPriorityById(req.body.item);
    if(priorityRes.length <= 0){
        return res.status(400).json({
            result : false,
            msg : "Invalid priority id",
            data : []
        });
    }
    next();
}

const checkIssueStatusId = async (req, res, next) => {
    const statusRes = await issueModel.getStatusById(req.body.item);
    if(statusRes.length <= 0){
        return res.status(400).json({
            result : false,
            msg : "Invalid status id",
            data : []
        });
    }
    next();
}

const checkIssueTrackerId = async (req, res, next) => {
    const trackerRes = await issueModel.getTrackerById(req.body.item);
    if(trackerRes.length <= 0){
        return res.status(400).json({
            result : false,
            msg : "Ivalid tracker id",
            data : []
        })
    }
    next();
}

const checkSubIssue = async (req, res, next) => {
    const subIssueRes = await subIssueModel.getSubIssueById(req.params.id);
    if(subIssueRes.length <= 0){
        return res.status(400).json({
            result : false,
            msg : "Invalid sub-issue id",
            data : []
        })
    }
    next();
}

module.exports = {
    checkCategory,
    checkLabel,
    checkPriority,
    checkStatus,
    checkTracker,
    checkIssue,
    checkNote,
    checkIssueLabelId,
    checkIssuePriorityId,
    checkIssueStatusId,
    checkIssueTrackerId,
    checkSubIssue,
}