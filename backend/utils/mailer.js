const nodemailer = require("nodemailer");

const sendEmail = async (email, password) => {
    try {
        let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "pteam480@gmail.com",
            pass: "vbla wnrp arhx oczd",
        },
        });

        let info = await transporter.sendMail({
            from: '"KOT" <pteam480@gmail.com>',
            to: email,
            subject: "Your Account Credentials",
            text: `Hello, your account has been created.\nEmail: ${email}\nPassword: ${password}\nGet start: https://kot.work.gd/user/login \nNote: Don't share your email and password with others.`,
            headers: {
                "X-Priority": "1",
                "Precedence": "bulk",
            },
        });
    } catch (error) {
        return;
    }
}

const sendEmailChangePass = async (email, password) => {
    try {
        let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "pteam480@gmail.com",
            pass: "vbla wnrp arhx oczd",
        },
        });

        let info = await transporter.sendMail({
            from: '"KOT" <pteam480@gmail.com>',
            to: email,
            subject: "Your Password Changed",
            text: `Hello, your password of the kot account has been changed.\nEmail: ${email}\nPassword: ${password}\nGet start: https://kot.work.gd/user/login \nNote: Don't share your email and password with others.`,
            headers: {
                "X-Priority": "1",
                "Precedence": "bulk",
            },
        });
    } catch (error) {
        return;
    }
}

const sendEmailRejectedChangePass = async (email) => {
    try {
        let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "pteam480@gmail.com",
            pass: "vbla wnrp arhx oczd",
        },
        });

        let info = await transporter.sendMail({
            from: '"KOT" <pteam480@gmail.com>',
            to: email,
            subject: "Your Password Changed Failed!",
            text: `Hello, your request to change your password was rejected because of something by adminstrator.\nPlease try again later.`,
            headers: {
                "X-Priority": "1",
                "Precedence": "bulk",
            },
        });
    } catch (error) {
        return;
    }
}

module.exports = {
    sendEmail,
    sendEmailChangePass,
    sendEmailRejectedChangePass
};