const handleResponses = require('../../utils/handleResponses');
const projectResource = require('../../resources/project');

const getAllProjects = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const search = req.query.search || '';
            const page = Number(req.query.page) || 0; // Default page is 1
            const perpage = Number(req.query.perpage) || 0;
            const data = await projectResource.getAllProjects(search, page, perpage, token);
            res.status(data.status).json(data.body);
        }
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const getProject = async (req, res) => {
    try{
        const data = await projectResource.getProject(req.params.id);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const createProject = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await projectResource.createProject(token, req.body);
            res.status(data.status).json(data.body);
        }
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const editProject = async (req, res) => {
    try{
        const data = await projectResource.editProject(req.params.id, req.body);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const editProjectStatus = async (req,res) =>{
     try{
        const data = await projectResource.editProjectStatus(req.params.id, req.body);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const deleteProject = async (req, res) => {
    try{
        const data = await projectResource.deleteProject(req.params.id);
        return res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

// Project Status
const getAllStatuses = async (req, res) => {
    try{
        const data = await projectResource.getAllStatuses(req.query.search, req.query.page, req.query.perpage);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse({err}));
    }
}

const createStatus = async (req, res) => {
    try{
        const data = await projectResource.createStatus(req.body);
        res.status(data.status).json(data.body);

    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const getStatus = async (req, res) => {    
    try{
        const data = await projectResource.getStatus(req.params.id);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const updateStatus = async (req, res) => {
    try{
        const data = await projectResource.updateStatus(req.params.id, req.body);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const deleteStatus = async (req, res) => {
    try{
        const data = await projectResource.deleteStatus(req.params.id);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

// Project Members
const getAllMembers = async (req, res) => {
    try{
        const data = await projectResource.getAllMembers(req.query.search, req.query.page, req.query.perpage, req.params.id);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const getMember = async (req, res) => {
    try{
        const data = await projectResource.getMember(req.params.id);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const addMember = async (req, res) => {
    try{
        const data = await projectResource.addMember(req.params.id ,req.body);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const removeMember = async (req, res) => {
    try{
        const data = await projectResource.removeMember(req.params.id);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

// Project resource
const getAllProjectResources = async (req, res) => {
    try{
        const data = await projectResource.getAllProjectResources(req.query.search, req.query.page, req.query.perpage, req.params.id);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const getProjectResource = async (req, res) => {
    try{
        const data = await projectResource.getProjectResource(req.params.id);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const createProjectResource = async (req, res) => {
    try{
        const data = await projectResource.createProjectResource(req.params.id, req.body);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const editProjectResource = async (req, res) => {
    try{
        const data = await projectResource.editProjectResource(req.params.id, req.body);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const deleteProjectResource = async (req, res) => {
    try{
        const data = await projectResource.deleteProjectResource(req.params.id);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

// Project resource file
const getAllProjectResourceFiles = async (req, res) => {
    try{
        const data = await projectResource.getAllProjectResourceFiles(req.query.search, req.query.page, req.query.perpage, req.params.id);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const getProjectResourceFile = async (req, res) => {
    try{
        const data = await projectResource.getProjectResourceFile(req.params.id);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const addProjectResourceFile = async (req, res) => {
    try{
        const data = await projectResource.addProjectResourceFile(req.params.id, req.files);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const updateProjectResourceFile = async (req, res) => {
    try{
        const data = await projectResource.updateProjectResourceFile(req.params.id, req.files);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const deleteProjectResourceFile = async (req, res) => {
    try{
        const data = await projectResource.deleteProjectResourceFile(req.params.id);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

// Project Activities
const getAllProjectActivity = async (req, res) => {
    try{
        const data = await projectResource.getAllProjectActivity(req.query.search, req.query.page, req.query.perpage, req.params.id);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const getProjectActivity = async (req, res) => {
    try{
        const data = await projectResource.getProjectActivity(req.params.id);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const createProjectActivity = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await projectResource.createProjectActivity(token, req.params.id, req.body);
            res.status(data.status).json(data.body);
        }
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const deleteProjectActivity = async (req, res) => {
    try{
        const data = await projectResource.deleteProjectActivity(req.params.id);
        res.status(data.status).json(data.body);
    }catch(err){
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

module.exports = {
    getAllProjects, getProject, createProject, editProject,editProjectStatus, deleteProject,
    getAllStatuses, createStatus, getStatus, updateStatus, deleteStatus,
    getAllMembers, addMember, removeMember, getMember,
    getAllProjectResources, getProjectResource, createProjectResource, editProjectResource, deleteProjectResource,
    getAllProjectResourceFiles, getProjectResourceFile, updateProjectResourceFile, addProjectResourceFile, deleteProjectResourceFile,
    getAllProjectActivity, getProjectActivity, createProjectActivity, deleteProjectActivity,
}