const issueModels = require('../models/issueModel');
const projectModels = require('../models/projectModel');
const handleResponses = require('../utils/handleResponses');
const handleValidations = require('../utils/handleValidations');
const helperUtils = require('../utils/helpers');
const { issueItemValidator, issueValidator, updateIssueValidator, updateIssueItemValidator, dateValidator, noteValidator, issueActivityValidator } = require('../validations/issue');
const jwt = require('../utils/jwt');
const issue = require('../validations/issue');
const { activity } = require('../controllers/web/superadmin');
const { result } = require('lodash');
const { query } = require('../config/db');


// Issue_Labels
const createLabel = async (projectId, body) => {
    projectId = Number(projectId);
    const validationError = handleValidations(issueItemValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid Data", validationError, body);
    await issueModels.createLabel([projectId, body.name, body.description]);
    return handleResponses.successResponse(200, "Created a label successfully.", [], null);
}

const getAllLabels = async (projectId) => {
    projectId = Number(projectId);
    const labelRes = await issueModels.getAllLabels(projectId);
    let constructLabels = [], result = {};
    if(labelRes.length > 0){
        labelRes.forEach((element) => {
            constructLabels.push(helperUtils.constructIssueItem(element));
        })
        result = helperUtils.constructIssueItemWithProject(labelRes[0], constructLabels, "labels");
    }
    return handleResponses.successResponse(200, "Get all labels in this project successfully.", result, null);
}

const getLabel = async (labelId) => {
    labelId = Number(labelId);
    const labelRes = await issueModels.getLabelById(labelId);
    if(labelRes.length <= 0) return handleResponses.errorResponse(400, "Cannot get label details", null, []);
    const constructLabel = helperUtils.constructIssueItem(labelRes[0]);
    const result = helperUtils.constructIssueItemWithProject(labelRes[0], constructLabel, "label");
    return handleResponses.successResponse(200, "Get details of this label successfully.", result, null);
}

const editLabel = async (labelId, body) => {
    labelId = Number(labelId);
    const validationError = handleValidations(issueItemValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid Data", validationError, body);
    await issueModels.updateLabel([body.name, body.description, labelId]);
    return handleResponses.successResponse(200, "Edited this label successfully.", [], null);
}

const deleteLabel = async (labelId) => {
    labelId = Number(labelId);
    const labelUsage = await issueModels.isActiveLabel(labelId);
    if (labelUsage.isUsed){
         const projects = await issueModels.getIssueUsingLabel(labelId);
         return handleResponses.errorResponse( 400,  `Cannot delete: This label is assigned to ${labelUsage.count} issue(s).`, null, projects );
    }     
    await issueModels.deleteLabel(labelId);
    return handleResponses.successResponse(200, "Deleted this label successfully.", [], null);
}

// Issue_Priority
const createPriority = async (projectId, body) => {
    projectId = Number(projectId);
    const validationError = handleValidations(issueItemValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid Data", validationError, body);
    await issueModels.createPriority([projectId, body.name, body.description]);
    return handleResponses.successResponse(200, "Created a priority in this project successfully.", [], null);
}

const getAllPriorities = async (projectId) => {
    projectId = Number(projectId);
    const priorityRes = await issueModels.getAllPriorities(projectId);
    let constructPriority = [], result = {};
    if(priorityRes.length > 0){
        priorityRes.forEach((element) => {
            constructPriority.push(helperUtils.constructIssueItem(element));
        });
        result = helperUtils.constructIssueItemWithProject(priorityRes[0], constructPriority, "priorities");
    }
    return handleResponses.successResponse(200, "Get all priorities in this project successfully.", result, null);
}

const getPriority = async (priorityId) => {
    priorityId = Number(priorityId);
    const priorityRes = await issueModels.getPriorityById(priorityId);
    const constructPriority = helperUtils.constructIssueItem(priorityRes[0]);
    const result = helperUtils.constructIssueItemWithProject(priorityRes[0], constructPriority, "priority");
    return handleResponses.successResponse(200, "Get details this priority successfully.", result, null);
}

const editPriority = async (priorityId, body) => {
    priorityId = Number(priorityId);
    const validationError = handleValidations(issueItemValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid Data", validationError, body);
    await issueModels.updatePriority([body.name, body.description, priorityId]);
    return handleResponses.successResponse(200, "Edited this priority successfully.", [], null);
}

const deletePriority = async (priorityId) => {
    priorityId = Number(priorityId);
    const priorityUsage = await issueModels.isActivePriority(priorityId);
    if(priorityUsage.isUsed){
        const issues = await issueModels.getIssueUsingPriority(priorityId);
        return handleResponses.errorResponse( 400,  `Cannot delete: This status is assigned to ${priorityUsage.count} issue(s).`, null, issues  );
    }
    await issueModels.deletePriority(priorityId);
    return handleResponses.successResponse(200, "Deleted this priority successfully.", [], null);
}

// Issue_Status
const createStatus = async (projectId, body) => {
    projectId = Number(projectId);
    const validationError = handleValidations(issueItemValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid Data", validationError, body);
    await issueModels.createStatus([projectId, body.name, body.description]);
    return handleResponses.successResponse(200, "Created a status in this project successfully.", [], null);
}

const getAllStatus = async (projectId) => {
    projectId = Number(projectId);
    const statusRes = await issueModels.getAllStatus(projectId);
    let constructStatus = [], result = {};
    if(statusRes.length > 0) {
        statusRes.forEach((element) => {
            constructStatus.push(helperUtils.constructIssueItem(element));
        })
        result = helperUtils.constructIssueItemWithProject(statusRes[0], constructStatus, "statuses");
    }
    return handleResponses.successResponse(200, "Get all status in this project successfully.", result, null);
}

const getStatus = async (statusId) => {
    statusId = Number(statusId);
    const statusRes = await issueModels.getStatusById(statusId);
    const constructStatus = helperUtils.constructIssueItem(statusRes[0]);
    const result = helperUtils.constructIssueItemWithProject(statusRes[0], constructStatus, "status");
    return handleResponses.successResponse(200, "Get detail of this status successfully.", result, null);
}

const editStatus = async (statusId, body) => {
    statusId = Number(statusId);
    const validationError = handleValidations(issueItemValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid Data", validationError, body);
    await issueModels.updateStatus([body.name, body.description, statusId]);
    return handleResponses.successResponse(200, "Edited status successfully.", [], null);
}

const deleteStatus = async (statusId) => {
    statusId = Number(statusId);
    const statusUsage = await issueModels.isActiveStaus(statusId);
    if(statusUsage.isUsed){
       const issues = await issueModels.getIssueUsingStatus(statusId);
       return handleResponses.errorResponse( 400,  `Cannot delete: This status is assigned to ${statusUsage.count} issues(s).`, null, issues  );
    }
    await issueModels.deleteStatus(statusId);
    return handleResponses.successResponse(200, "Deleted status successfully.", [], null);
}

// Issue_Tracker
const createTracker = async (projectId, body) => {
    projectId = Number(projectId);
    const validationError = handleValidations(issueItemValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid data.", validationError, body);
    await issueModels.createTracker([projectId, body.name, body.description]);
    return handleResponses.successResponse(200, "Created a tracker for this project successfully.", [], null);
}

const getAllTrackers = async (projectId) => {
    projectId = Number(projectId);
    const trackerRes = await issueModels.getAllTrackers(projectId);
    let constructTracker = [], result = {};
    if(trackerRes.length > 0){
        trackerRes.forEach((element) => {
            constructTracker.push(helperUtils.constructIssueItem(element));
        });
        result = helperUtils.constructIssueItemWithProject(trackerRes[0], constructTracker, "trackers");
    }
    return handleResponses.successResponse(200, "Get all trackers in this project successfully.", result, null);
}

const getTracker = async (trackerId) => {
    trackerId = Number(trackerId);
    const trackerRes = await issueModels.getTrackerById(trackerId);
    const constructTracker = helperUtils.constructIssueItem(trackerRes[0]);
    const result = helperUtils.constructIssueItemWithProject(trackerRes[0], constructTracker, "tracker");
    return handleResponses.successResponse(200, "Get detail a tracker successfully.", result, null);
}

const editTracker = async (trackerId, body) => {
    trackerId = Number(trackerId);
    const validationError = handleValidations(issueItemValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid data.", validationError, body);
    await issueModels.updateTracker([body.name, body.description, trackerId]);
    return handleResponses.successResponse(200, "Edited a tracker successfully.", [], null);
}

const deleteTracker = async (trackerId) => {
    trackerId = Number(trackerId);
    const trackerUsage = await issueModels.isActiveTracker(trackerId);
    if(trackerUsage.isUsed){
        const issues = await issueModels.getIssueUsingTracker(trackerId);
        return handleResponses.errorResponse( 400,  `Cannot delete: This tracker is assigned to ${trackerUsage.count} issue(s).`, null, issues );
    }
    await issueModels.deleteTracker(trackerId);
    return handleResponses.successResponse(200, "Deleted a tracker successfully.", [], null);
}

// Issue
const createIssue = async (projectId, body, token) => {
    projectId = Number(projectId);
    const validationError = handleValidations(issueValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid data.", validationError, body);
    const decodedToken = await jwt.verifyToken(token);
    const start_date = body.start_date == "" || body.start_date == null ? null : body.start_date;
    const due_date = body.due_date == "" || body.due_date == null ? null : body.due_date;
    const assignee = body.assignee == "" || body.assignee == null ? null : Number(body.assignee);
    const label_id = body.label_id == "" || body.label_id == null ? null : Number(body.label_id);
    const status_id = body.status_id ? Number(body.status_id) : null;
    const priority_id = body.priority_id ? Number(body.priority_id) : null;
    const tracker_id = body.tracker_id ? Number(body.tracker_id) : null;
    const issueCreated = await issueModels.createIssue([projectId, body.name, body.description, start_date, due_date, status_id, priority_id, tracker_id, label_id, assignee, decodedToken.id, decodedToken.id]);
    if (!issueCreated.insertId) {
        return handleResponses.errorResponse(500, "Failed to create issue.", null, []);
    }
    const issueId = issueCreated.insertId;
    const issueRes = await issueModels.getIssueById(issueId);
    const result = helperUtils.constructIssueDetail(issueRes[0]);
    return handleResponses.successResponse(200, "Created an issue successfully.", result, null);
}

const getAllIssueInProject = async (search, page, perpage, projectId) => {
    projectId = Number(projectId);
    page = Number(page);
    perpage = Number(perpage);
    let resultTemp = [];
    const issueRes = await issueModels.getAllIssueByProjectId(search, page, perpage, projectId);
    if(issueRes.length <= 0) return handleResponses.errorResponse(200, "Cannot get issues data.", null, []);
    issueRes.forEach((element) => {
        resultTemp.push(helperUtils.constructIssue(element));
    });
    const countAllIssue = await issueModels.countAllIssueInProject(search, projectId);
    const totalPages = Math.ceil(countAllIssue[0].total / perpage);
    const constructWithPaginate = helperUtils.constructDataWithPaginate(resultTemp, countAllIssue[0].total, page, perpage, totalPages);
    const result = {
        project : {
            id : issueRes[0].project_id,
            name : issueRes[0].project_name
        },
        issues : constructWithPaginate
    }
    return handleResponses.successResponse(200, "Get all issues in a project successfully.", result, null);
}

const getIssue = async (issueId) => {
    issueId = Number(issueId);
    const issueRes = await issueModels.getIssueById(issueId);
    const resultTemp = helperUtils.constructIssueDetail(issueRes[0]);
    const result = {
        project : {
            id : issueRes[0].project_id,
            name : issueRes[0].project_name
        },
        issues : resultTemp
    }
    return handleResponses.successResponse(200, "Get detail a issue successfully.", result, null);
}

const deleteIssue = async (issueId) => {
    issueId = Number(issueId);
    await issueModels.deleteIssue(issueId);
    return handleResponses.successResponse(200, "Deleted an issue successfully.", [], null);
}

const editIssue = async (issueId, body, token) => {
    issueId = Number(issueId);
    const validationError = handleValidations(updateIssueValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid data.", validationError, body);
    const decodedToken = await jwt.verifyToken(token);
    const start_date = body.start_date == "" ? null : body.start_date;
    const due_date = body.due_date == "" ? null : body.due_date;
    const assignee = body.assignee == "" ? null : body.assignee;
    const progress = body.progress == "" ? 0.00 : body.progress;
    await issueModels.updateIssue([body.name, progress, body.description, start_date, due_date, body.status_id, body.priority_id, assignee, decodedToken.id, body.tracker_id, body.label_id, issueId]);
    return handleResponses.successResponse(200, "Edited a issue successfully.", [], null);
}

// Issue_edit work
const issueEditLabelOnly = async (issueId, body, token) => {
    issueId = Number(issueId);
    const validationError = handleValidations(updateIssueItemValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid data.", validationError, body);
    const decodedToken = await jwt.verifyToken(token);
    await issueModels.issueUpdateLabelOnly([body.item, decodedToken.id, issueId]);
    return handleResponses.successResponse(200, "Edited label of issue.", [], null);
}

const issueEditPriorityOnly = async (issueId, body, token) => {
    issueId = Number(issueId);
    const validationError = handleValidations(updateIssueItemValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid data.", validationError, body);
    const decodedToken = await jwt.verifyToken(token);
    await issueModels.issueUpdatePriorityOnly([body.item, decodedToken.id, issueId]);
    return handleResponses.successResponse(200, "Edited priority of issue.", [], null);
}

const issueEditStatusOnly = async (issueId, body, token) => {
    issueId = Number(issueId);
    const validationError = handleValidations(updateIssueItemValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid data.", validationError, body);
    const decodedToken = await jwt.verifyToken(token);
    await issueModels.issueUpdateStatusOnly([body.item, decodedToken.id, issueId]);
    return handleResponses.successResponse(200, "Edited status of issue.", [], null);
}

const issueEditTrackerOnly = async (issueId, body, token) => {
    issueId = Number(issueId);
    const validationError = handleValidations(updateIssueItemValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid data.", validationError, body);
    const decodedTokens = await jwt.verifyToken(token);
    await issueModels.issueUpdateTrackerOnly([body.item, decodedTokens.id, issueId]);
    return handleResponses.successResponse(200, "Edited tracker of issue.", [], null);
}

const issueEditStartDateOnly = async (issueId, body, token) => {
    issueId = Number(issueId);
    const validationError = handleValidations(dateValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid date format.", validationError, body);
    const decodedToken = await jwt.verifyToken(token);
    await issueModels.issueUpdateStartDateOnly([body.date, decodedToken.id, issueId]);
    return handleResponses.successResponse(200, "Edited start date of issue successfully.", [], null);
}

const issueEditDueDateOnly = async (issueId, body, token) => {
    issueId = Number(issueId);
    const validationError = handleValidations(dateValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid date format.", validationError, body);
    const decodedToken = await jwt.verifyToken(token);
    await issueModels.issueUpdateDueDateOnly([body.date, decodedToken.id, issueId]);
    return handleResponses.successResponse(200, "Edited due date of issue successfully.", [], null);
}

const issueEditProgressOnly = async (issueId, body, token) => {
    issueId = Number(issueId);
    const validationError = handleValidations(updateIssueItemValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid data.", validationError, body);
    const decodedToken = await jwt.verifyToken(token);
    const progress = Number(body.item);
    await issueModels.issueUpdateProgressOnly([progress, decodedToken.id, issueId]);
    return handleResponses.successResponse(200, "Edited progress of issue successfully.", [], null);
}

const issueEditAssignee = async (issueId, body, token) => {
    issueId = Number(issueId);
    const validationError = handleValidations(updateIssueItemValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid data.", validationError, body);
    const decodedToken = await jwt.verifyToken(token);
    const userId = Number(body.item);
    await issueModels.issueUpdateAssignee([userId, decodedToken.id, issueId]);
    return handleResponses.successResponse(200, "Edited assignee of issue successfully.", [], null);

}


// Issue_notes
const createIssueNote = async (issueId, body, token) => {
    issueId = Number(issueId);
    const validationError = handleValidations(noteValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid data.", validationError, body);
    // console.log(body);
    const decodedToken = await jwt.verifyToken(token);
    await issueModels.createIssueNote([issueId, body.notes, decodedToken.id]);
    return handleResponses.successResponse(200, "Noticed soomething on this issue successfully.", [], null);
}

const getAllNote = async (issueId) => {
    issueId = Number(issueId);
    let result = [];
    const noteRes = await issueModels.getAllNoteByIssueId(issueId);
    noteRes.forEach((element) => {
        result.push(helperUtils.constructIssueNote(element));
    })
    return handleResponses.successResponse(200, "Get all notes on this issue successfully.", result, null);
}

const getNoteById = async (noteId) => {
    noteId = Number(noteId);
    const noteRes = await issueModels.getNoteById(noteId);
    const result = helperUtils.constructIssueNote(noteRes[0]);
    return handleResponses.successResponse(200, "Get a note on this issue successfully.", result, null);
}

const editNote = async (noteId, body) => {
    noteId = Number(noteId);
    await issueModels.updateNote([body.note, noteId]);
    return handleResponses.successResponse(200, "Edited note successfully.", [], null);
}

const deleteNote = async (noteId) => {
    noteId = Number(noteId);
    await issueModels.deleteNote([noteId]);
    return handleResponses.successResponse(200, "Deleted note successfully.", [], null);
}

// Issue Activity

const issueCreateActivity = async (issueId, token, body) => {
    issueId = Number(issueId);
    const validationError = handleValidations(issueActivityValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid data.", validationError, body);
    const decodedToken = await jwt.verifyToken(token);
    await issueModels.createIssueActivity([issueId, decodedToken.id, body.title, body.activity]);
    return handleResponses.successResponse(200, "Created an issue activity successfully.", [], null);
}

const issueGetAllActivity = async (issueId) => {
    issueId = Number(issueId);
    let results = [];
    const activityRes = await issueModels.getAllIssueActivity(issueId);
    activityRes.forEach((activity) => {
        results.push(helperUtils.constructIssueActivity(activity));
    })
    return handleResponses.successResponse(200, "Get all issue activity successfully.", results, null);
}

const issueGetDetailActivity = async (activityId) => {
    activityId = Number(activityId);
    const activityRes = await issueModels.getDetailIssueActivity(activityId);
    if(activityRes.length === 0) return handleResponses.errorResponse(400, "Invalid activity.", activityRes, []);
    const result = helperUtils.constructIssueActivity(activityRes[0]);
    return handleResponses.successResponse(200, "Get detail issue activity successfully.", result, null);
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
    issueCreateActivity, issueGetAllActivity, issueGetDetailActivity,
}