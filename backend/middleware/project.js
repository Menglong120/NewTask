const jwt = require('jsonwebtoken');
const userModels = require('../models/userModel');
const projectModels = require('../models/projectModel');

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

        const userRes = await userModels.getUserById(decodedToken.id);
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

const getProjectOrError = async (projectId) => {
    const projectRes = await projectModels.getProjectById(projectId);
    if (!projectRes || projectRes.length <= 0) {
        return {
            error: {
                status: 400,
                body: {
                    result: false,
                    msg: 'This project is not existed..!',
                    data: []
                }
            }
        };
    }

    return { project: projectRes[0] };
};

const isProjectMember = async (projectId, userId) => {
    const memberRes = await projectModels.getAllProjectMembers(projectId);
    return memberRes.some((member) => Number(member.user_id) === Number(userId));
};

const requireProjectAccess = async (req, res, next, { manage = false } = {}) => {
    try {
        const user = await getDecodedUser(req);
        const { project, error } = await getProjectOrError(req.params.id);

        if (error) {
            return res.status(error.status).json(error.body);
        }

        if (Number(user.role_id) !== 1) {
            const allowed = await isProjectMember(req.params.id, user.id);
            if (!allowed) {
                return res.status(400).json({
                    result: false,
                    msg: 'You are not allowed to access this project.',
                    data: []
                });
            }
        }

        if (manage && Number(user.role_id) !== 1 && Number(user.role_id) !== 2) {
            return res.status(400).json({
                result: false,
                msg: 'You are not allowed to do this action (Only team leader can do).',
                data: []
            });
        }

        req.currentUser = user;
        req.currentProject = project;
        next();
    } catch (error) {
        res.status(error.status || 400).json(error.body || {
            result: false,
            msg: 'You need to login!',
            data: []
        });
    }
};

const requireProjectMember = (req, res, next) => requireProjectAccess(req, res, next);

const requireProjectMemberAdmin = (req, res, next) => requireProjectAccess(req, res, next, { manage: true });

const checkProject = async (req, res, next) => {
    const { error } = await getProjectOrError(req.params.id);
    if (error) {
        return res.status(error.status).json(error.body);
    }
    next();
};

const checkMemberAddToProject = async (req, res, next) => {
    const projectId = Number(req.params.id);
    const projectRes = await projectModels.getProjectById(projectId);
    if (!projectRes || projectRes.length <= 0) {
        return res.status(400).json({
            result: false,
            msg: 'This project is not existed..!',
            data: []
        });
    }

    const members = JSON.parse(req.body.user_id || '[]').map(Number);
    const existingMembers = await projectModels.getAllProjectMembers(projectId);
    const existingMemberIds = new Set(existingMembers.map((member) => Number(member.user_id)));

    for (const memberId of members) {
        const userRes = await userModels.getUserById(memberId);
        if (!userRes || userRes.length <= 0) {
            return res.status(400).json({
                result: false,
                msg: `User id ${memberId} cannot found.`,
                data: []
            });
        }

        if (existingMemberIds.has(memberId)) {
            return res.status(400).json({
                result: false,
                msg: `${userRes[0].email} - added in this project already.`,
                data: []
            });
        }
    }

    next();
};

const checkMemberProjectByMemberId = async (req, res, next) => {
    try {
        const user = await getDecodedUser(req);
        const memberId = Number(req.params.id);
        const memberRes = await projectModels.getAllMembersById(memberId);

        if (!memberRes || memberRes.length <= 0) {
            return res.status(400).json({
                result: false,
                msg: 'Invalid member id.',
                data: []
            });
        }

        if (Number(user.role_id) !== 1) {
            const allowed = await isProjectMember(memberRes[0].project_id, user.id);
            if (!allowed) {
                return res.status(400).json({
                    result: false,
                    msg: 'You are not allowed to access this project.',
                    data: []
                });
            }
        }

        req.currentUser = user;
        next();
    } catch (error) {
        res.status(error.status || 400).json(error.body || {
            result: false,
            msg: 'You need to login!',
            data: []
        });
    }
};

const checkProjectResource = async (req, res, next) => {
    try {
        const user = await getDecodedUser(req);
        const resourceRes = await projectModels.getProjectResourceById(req.params.id);
        if (!resourceRes || resourceRes.length <= 0) {
            return res.status(400).json({
                result: false,
                msg: 'This resource is not existed..!',
                data: []
            });
        }

        if (Number(user.role_id) !== 1) {
            const allowed = await isProjectMember(resourceRes[0].project_id, user.id);
            if (!allowed) {
                return res.status(400).json({
                    result: false,
                    msg: 'You are not allowed to access this project.',
                    data: []
                });
            }
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

const checkProjectResourceFile = async (req, res, next) => {
    try {
        const user = await getDecodedUser(req);
        const fileRes = await projectModels.getResourceFile(req.params.id);
        if (!fileRes || fileRes.length <= 0) {
            return res.status(400).json({
                result: false,
                msg: "Resource file id is invalid..!",
                error: null,
                data: []
            });
        }

        const resourceRes = await projectModels.getProjectResourceById(fileRes[0].resource_id);
        if (!resourceRes || resourceRes.length <= 0) {
            return res.status(400).json({
                result: false,
                msg: 'This resource is not existed..!',
                data: []
            });
        }

        if (Number(user.role_id) !== 1) {
            const allowed = await isProjectMember(resourceRes[0].project_id, user.id);
            if (!allowed) {
                return res.status(400).json({
                    result: false,
                    msg: 'You are not allowed to access this project.',
                    data: []
                });
            }
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

const checkProjectActivity = async (req, res, next) => {
    try {
        const user = await getDecodedUser(req);
        const activityRes = await projectModels.getProjectActivityById(req.params.id);
        if (!activityRes || activityRes.length <= 0) {
            return res.status(400).json({
                result: false,
                msg: "This activity is not existed..!",
                data: []
            });
        }

        if (Number(user.role_id) !== 1) {
            const allowed = await isProjectMember(activityRes[0].project_id, user.id);
            if (!allowed) {
                return res.status(400).json({
                    result: false,
                    msg: 'You are not allowed to access this project.',
                    data: []
                });
            }
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

module.exports = {
    requireProjectMember,
    requireProjectMemberAdmin,
    checkProject,
    checkMemberAddToProject,
    checkMemberProjectByMemberId,
    checkProjectResource,
    checkProjectResourceFile,
    checkProjectActivity,
};
