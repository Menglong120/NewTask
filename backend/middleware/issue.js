const jwt = require('jsonwebtoken');
const issueModel = require('../models/issueModel');
const subIssueModel = require('../models/subIssueModel');
const projectModel = require('../models/projectModel');
const userModel = require('../models/userModel');

const getDecodedUser = (req) => new Promise((resolve, reject) => {
    const token = req.cookies.jwtToken;
    if (!token) {
        return reject({
            status: 400,
            body: {
                result: false,
                msg: 'You need to login!',
                data: []
            }
        });
    }

    jwt.verify(token, 'kot secret', async (err, decodedToken) => {
        if (err) {
            return reject({
                status: 400,
                body: {
                    result: false,
                    msg: 'You need to login!',
                    data: []
                }
            });
        }

        const userRes = await userModel.getUserById(decodedToken.id);
        if (!userRes || userRes.length <= 0) {
            return reject({
                status: 404,
                body: {
                    result: false,
                    msg: 'User not found.',
                    data: []
                }
            });
        }

        resolve(userRes[0]);
    });
});

const canAccessProject = async (projectId, user) => {
    const projectRes = await projectModel.getProjectById(projectId);
    if (!projectRes || projectRes.length <= 0) {
        return {
            status: 400,
            body: {
                result: false,
                msg: 'This project is not existed..!',
                data: []
            }
        };
    }

    if (Number(user.role_id) === 1) {
        return null;
    }

    const memberRes = await projectModel.getAllProjectMembers(projectId);
    const isMember = memberRes.some((member) => Number(member.user_id) === Number(user.id));
    if (isMember) {
        return null;
    }

    return {
        status: 400,
        body: {
            result: false,
            msg: 'You are not allowed to access this project.',
            data: []
        }
    };
};

const guardProjectAccess = async (req, res, next, getProjectId) => {
    try {
        const user = await getDecodedUser(req);
        const projectId = await getProjectId();
        const denied = await canAccessProject(projectId, user);
        if (denied) {
            return res.status(denied.status).json(denied.body);
        }
        next();
    } catch (error) {
        res.status(error.status || 400).json(error.body || {
            result: false,
            msg: 'You need to login!',
            data: []
        });
    }
};


const checkLabel = async (req, res, next) => {
    const labelRes = await issueModel.getLabelById(req.params.id);
    if(labelRes.length <= 0){
        return res.status(400).json({
            result : false,
            msg : "Invalid label id",
            data : []
        });
    }

    return guardProjectAccess(req, res, next, async () => labelRes[0].project_id);
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

    return guardProjectAccess(req, res, next, async () => priorityRes[0].project_id);
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

    return guardProjectAccess(req, res, next, async () => statusRes[0].project_id);
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

    return guardProjectAccess(req, res, next, async () => trackerRes[0].project_id);
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

    return guardProjectAccess(req, res, next, async () => {
        return issueRes[0].project_id;
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
