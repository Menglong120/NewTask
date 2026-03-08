const { result } = require('lodash');
const userModels = require('../models/userModel');

const checkUser = async (req, res, next) => {
    const userRes = await userModels.getUserById(req.params.id);
    if (userRes.length <= 0) {
        return res.status(400).json({
            result: false,
            msg: "User not found.",
            data: []
        });
    }
    next();
}

const checkUserRole = async (req, res, next) => {
    const roleId = Number(req.query.role)

    // If role is missing or not a number, skip role check (or default to 0)
    if (isNaN(roleId)) {
        return next();
    }

    const roleRes = await userModels.getRoleById(roleId);
    if (roleRes.length <= 0 && roleId !== 0) {
        return res.status(400).json({
            result: false,
            msg: "Role not found.",
            data: []
        });
    }
    next();
}

module.exports = {
    checkUser,
    checkUserRole
};