const handleResponses = require('../../utils/handleResponses');
const subIssueResources = require('../../resources/subIssue');
const { subIssueUpdateStatus } = require('../../models/subIssueModel');

const createSubIssue = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await subIssueResources.createSubIssue(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const getAllSubIssue = async (req, res) => {
    try{
        const data = await subIssueResources.getAllSubIssue(req.query.search, req.query.page, req.query.perpage, req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const getSubIssueById = async (req, res) => {
    try{
        const data = await subIssueResources.getSubIssueById(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const editSubIssue = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await subIssueResources.editSubIssue(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const deleteSubIssue = async (req, res) => {
    try{
        const data = await subIssueResources.deleteSubIssue(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const subIssueEditProgress = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await subIssueResources.subIssueEditProgress(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const subIssueEditStartDate = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await subIssueResources.subIssueEditStartDate(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const subIssueEditDueDate = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await subIssueResources.subIssueEditDueDate(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const subIssueEditComment = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await subIssueResources.subIssueEditComment(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const subIssueEditPriority = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await subIssueResources.subIssueEditPriority(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const subIssueEditStatus = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await subIssueResources.subIssueEditStatus(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const subIssueEditLabel = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await subIssueResources.subIssueEditLabel(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const subIssueEditTracker = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await subIssueResources.subIssueEditTracker(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const subIssueEditAssignee = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await subIssueResources.subIssueEditAssignee(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

module.exports = {
    createSubIssue, getAllSubIssue, getSubIssueById, editSubIssue, deleteSubIssue,
    subIssueEditProgress, subIssueEditStartDate, subIssueEditDueDate, 
    subIssueEditComment, subIssueEditPriority, subIssueEditStatus,
    subIssueEditLabel, subIssueEditTracker, subIssueEditAssignee
}