const signsuperadmin = (req, res) => {
    res.render('pages/signinsuperadmin', { currentPage: 'signinsuperadmin' });
};

const homesuperadmin = (req, res) => {
    res.render('pages/home');
};

const setting = (req, res) => {
    res.render('pages/setting',{ currentPage: 'setting' });
};

const changpassword = (req, res) => {
    res.render('pages/changepassword',{ currentPage: 'changpassword' });
};

const project = (req, res) => {
    res.render('pages/project-setting');
};

const tableuser = (req, res) => {
    res.render('pages/table-user');
};

const createproject = (req, res) => {
    res.render('pages/allproject');
};

const activity = (req, res) => {
    res.render('pages/activity');
};

const resource = (req,res) =>{
    res.render('pages/resource');
}
const dashboard = (req,res) =>{
    res.render('pages/dashboard');
}

const analytic = (req,res) =>{
    res.render('pages/analytic',{currentPage : 'analytic'});
}

const notifaction = (req,res)=>{
    res.render('pages/notifaction');
}


const issuesInCategory = (req, res) => {
    res.render('pages/issuescategory', { currentPage : 'issuescategory'});
}

const status = (req, res) => {
    res.render('pages/status', { currentPage : 'status'});
}

const page404 = (req ,res) =>{
    res.render('pages/error-404')
}
const index = (req ,res) =>{
    res.render('index')
}

module.exports = {
    signsuperadmin,
    homesuperadmin,
    setting,
    changpassword,
    project,
    tableuser,
    createproject,
    activity,
    resource,
    dashboard,
    analytic,
    issuesInCategory,
    status,
    page404,
    notifaction,
    index
};