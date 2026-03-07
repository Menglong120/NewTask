const authResource = require('../../resources/auth');
const handleResponses = require('../../utils/handleResponses');

const register = async (req, res) => {
    try{
        const data = await authResource.register(req.body);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const login = async (req, res) => {    
    try{
        const data = await authResource.login(req.body);
        if(data.cookie){
            res.cookie(data.cookie.name, data.cookie.value, data.cookie.options);
        }
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const loginSuperAdmin = async (req, res) => {
    try{
        const data = await authResource.loginSuperAdmin(req.body);
        if(data.cookie) {
            res.cookie(data.cookie.name, data.cookie.value, data.cookie.options);
        }
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const logout = async (req, res) => {
    try{
        const data = await authResource.logout();
        if(data.cookie){
            res.cookie(data.cookie.name, data.cookie.value, data.cookie.options);
        }
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
};

module.exports = {
    register,
    login,
    loginSuperAdmin,
    logout,
}