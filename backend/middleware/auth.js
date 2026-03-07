const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwtToken;
     if(token){
        jwt.verify(token, 'kot secret', (err, decodedToken) => {
            if(err){
                res.status(400).json({
                    result: false,
                    msg: 'You need to login!',
                    data: []
                });
            }else{
                if(decodedToken){
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

const requireBothAdmin = (req, res, next) => {
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
                    const result = await userModel.getUserById(decodedToken.id);
                    if(result[0].role_id == 1 || result[0].role_id == 2){
                        next();
                    }else{
                        res.status(400).json({
                            result: false,
                            msg: 'You need to login as admin or super admin!',
                            data: []
                        });
                    }
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

const requireAdmin = (req, res, next) => {
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
                    const result = await userModel.getUserById(decodedToken.id);
                    if(result[0].role_id == 1){
                        next();
                    }else{
                        res.status(400).json({
                            result: false,
                            msg: 'You need to login as super admin!',
                            data: []
                        });
                    }
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

// Frontend

const requireCookie = (req, res, next) => {
    const token = req.cookies.jwtToken;
    // console.log("Token from cookie:", token);

    if (!token) {
        return res.redirect("/user/login");
    }
    next();

};


const protectRoute = async (req, res, next) => {

    const token = req.cookies.jwtToken;
        jwt.verify(token, 'kot secret', async (err, decodedToken) => {
            if(err){
                res.redirect("/user/login");
            }else{
                if(decodedToken){
                    const result = await userModel.getUserById(decodedToken.id);
                    if (result[0].role_id == 1) {
                       next();
                    }
                    else{
                        res.redirect("/pages/404");
                    }
                }
            }
        });
    }

const protectRouteAdmin = async(req,res ,next)=>{
    const token = req.cookies.jwtToken;
    jwt.verify(token, 'kot secret', async (err, decodedToken) => {
        if(err){
            res.redirect("/user/login");
        }else{
            if(decodedToken){
                const result = await userModel.getUserById(decodedToken.id);
                if (result[0].role_id == 1 || result[0].role_id == 2) {
                   next();
                }
                else{
                    res.redirect("/pages/404");
                }
            }
        }
    });
}

module.exports = {
    requireAuth,
    requireBothAdmin,
    requireAdmin,
    requireCookie,
    protectRoute,
    protectRouteAdmin
}