const { get } = require('lodash');
const issueResource = require('../../resources/issue');
const handleResponses = require('../../utils/handleResponses');


// Issue_Label
const createLabel = async (req, res) => {
    try{
        const data = await issueResource.createLabel(req.params.id, req.body);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const getAllLabels = async (req, res) => {
    try{
        const data = await issueResource.getAllLabels(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const getLabel = async (req, res) => {
    try{
        const data = await issueResource.getLabel(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const editLabel = async (req, res) => {
    try{
        const data = await issueResource.editLabel(req.params.id, req.body);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const deleteLabel = async (req, res) => {
    try{
        const data = await issueResource.deleteLabel(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

// Issue_Priority
const createPriority = async (req, res) => {
    try{
        const data = await issueResource.createPriority(req.params.id, req.body);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const getAllPriorities = async (req, res) => {
    try{
        const data = await issueResource.getAllPriorities(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const getPriority = async (req, res) => {
    try{
        const data = await issueResource.getPriority(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const editPriority = async (req, res) => {
    try{
        const data = await issueResource.editPriority(req.params.id, req.body);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const deletePriority = async (req, res) => {
    try{
        const data = await issueResource.deletePriority(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

// Issue_Status
const createStatus = async (req, res) => {
    try{
        const data = await issueResource.createStatus(req.params.id, req.body);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const getAllStatus = async (req, res) => {
    try{
        const data = await issueResource.getAllStatus(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const getStatus = async (req, res) => {
    try{
        const data = await issueResource.getStatus(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const editStatus = async (req, res) => {
    try{
        const data = await issueResource.editStatus(req.params.id, req.body);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const deleteStatus = async (req, res) => {
    try{
        const data = await issueResource.deleteStatus(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

// Issue_Tracker
const createTracker = async (req, res) => {
    try{
        const data = await issueResource.createTracker(req.params.id, req.body);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const getAllTrackers = async (req, res) => {
    try{
        const data = await issueResource.getAllTrackers(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const getTracker = async (req, res) => {
    try{
        const data = await issueResource.getTracker(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const editTracker = async (req, res) => {
    try{
        const data = await issueResource.editTracker(req.params.id, req.body);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const deleteTracker = async (req, res) => {
    try{
        const data = await issueResource.deleteTracker(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

// Issue
const createIssue = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await issueResource.createIssue(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const getAllIssueInProject = async (req, res) => {
    try{
        const data = await issueResource.getAllIssueInProject(req.query.search, req.query.page, req.query.perpage, req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const getIssue = async (req, res) => {
    try{
        const data = await issueResource.getIssue(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const deleteIssue = async (req, res) => {
    try{
        const data = await issueResource.deleteIssue(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const editIssue = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await issueResource.editIssue(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

// Issue_edit work
const issueEditLabelOnly = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await issueResource.issueEditLabelOnly(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const issueEditPriorityOnly = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await issueResource.issueEditPriorityOnly(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const issueEditStatusOnly = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await issueResource.issueEditStatusOnly(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const issueEditTrackerOnly = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await issueResource.issueEditTrackerOnly(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const issueEditStartDateOnly = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await issueResource.issueEditStartDateOnly(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const issueEditDueDateOnly = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await issueResource.issueEditDueDateOnly(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const issueEditProgressOnly = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await issueResource.issueEditProgressOnly(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const issueEditAssignee = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await issueResource.issueEditAssignee(req.params.id, req.body, token);
            res.status(data.status).json(data.body)
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

// Issue_note
const createIssueNote = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await issueResource.createIssueNote(req.params.id, req.body, token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const getAllNote = async (req, res) => {
    try{
        const data = await issueResource.getAllNote(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const getNoteById = async (req, res) => {
    try{
        const data = await issueResource.getNoteById(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const editNote = async (req, res) => {
    try{
        const data = await issueResource.editNote(req.params.id, req.body);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const deleteNote = async (req, res) => {
    try{
        const data = await issueResource.deleteNote(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

// Issue Activity

const issueCreateActivity = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await issueResource.issueCreateActivity(req.params.id, token, req.body);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const issueGetAllActivity = async (req, res) => {
    try {
        const data = await issueResource.issueGetAllActivity(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const issueGetDetailActivity = async (req, res) => {
    try {
        const data = await issueResource.issueGetDetailActivity(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

module.exports = {
    createLabel, getAllLabels, getLabel, editLabel, deleteLabel,
    createPriority, getAllPriorities, getPriority, editPriority, deletePriority,
    createStatus, getAllStatus, getStatus, editStatus, deleteStatus,
    createTracker, getAllTrackers, getTracker, editTracker, deleteTracker,
    createIssue, getAllIssueInProject, getIssue, deleteIssue, editIssue,
    createIssueNote, getAllNote, getNoteById, editNote, deleteNote,
    issueEditLabelOnly, issueEditPriorityOnly, issueEditStatusOnly, issueEditAssignee,
    issueEditTrackerOnly, issueEditStartDateOnly, issueEditDueDateOnly, issueEditProgressOnly,
    issueCreateActivity, issueGetAllActivity, issueGetDetailActivity
}