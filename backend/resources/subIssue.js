const subIssueModels = require('../models/subIssueModel');
const handleResponses = require('../utils/handleResponses');
const handleValidations = require('../utils/handleValidations');
const helperUtils = require('../utils/helpers');
const jwt = require('../utils/jwt');
const { subIssueValidator } = require('../validations/subIssue');
const { updateIssueItemValidator, dateValidator } = require('../validations/issue');

const createSubIssue = async (issueId, body, token) => {
    issueId = Number(issueId);
    const validationError = handleValidations(subIssueValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid data.", validationError, body);
    const decodedToken = await jwt.verifyToken(token);
    const start_date = body.start_date == "" ? null : body.start_date;
    const due_date = body.due_date == "" ? null : body.due_date;
    const assignee = body.assignee == "" ? null : body.assignee;
    const progress = body.progress == "" ? 0.00 : body.progress;
    await subIssueModels.createSubIssue([body.name, body.description, progress, start_date, due_date, body.comment, body.priority_id, body.status_id, body.label_id, body.tracker_id, assignee, decodedToken.id, null, issueId]);
    return handleResponses.successResponse(200, "Created a sub issue successfully.", [], null);
}

const getAllSubIssue = async (search, page, perpage, issueId) => {
    issueId = Number(issueId);
    page = Number(page);
    perpage = Number(perpage);
    let resultTemp = [];
    const subIssueRes = await subIssueModels.getAllSubIssue(search, page, perpage, issueId);
    if(subIssueRes.length <= 0) {
        return handleResponses.errorResponse(200, "No sub issue found.", null, []);
    }
    subIssueRes.forEach((element) => {
        resultTemp.push(helperUtils.constructIssueDetail(element));
    });
    const countAllSubIssue = await subIssueModels.countAllSubIssue(search, issueId);
    const totalPages = Math.ceil(countAllSubIssue[0].total / perpage);
    const constructWithPaginate = helperUtils.constructDataWithPaginate(resultTemp, countAllSubIssue[0].total, page, perpage, totalPages);
    const result = {
        issue : {
            id : subIssueRes[0].issue_id,
            name : subIssueRes[0].issue_name,
            description : subIssueRes[0].issue_description
        },
        sub_issues : constructWithPaginate
    }
    return handleResponses.successResponse(200, "Get all sub-issues of this issue successfully.", result, null);
}

const getSubIssueById = async (subIssueId) => {
    subIssueId = Number(subIssueId);
    const subIssueRes = await subIssueModels.getSubIssueById(subIssueId);
    const resultTemp = helperUtils.constructSubIssueDetail(subIssueRes[0]);
    const result = {
        issue : {
            id : subIssueRes[0].issue_id,
            name : subIssueRes[0].issue_name,
            description : subIssueRes[0].issue_description
        },
        sub_issues : resultTemp
    }
    return handleResponses.successResponse(200, "Get detail of sub-issue successfully.", result, null);
}

const editSubIssue = async (subIssueId, body, token) => {
    subIssueId = Number(subIssueId);
    const validationError = handleValidations(subIssueValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid data.", validationError, body);
    const decodedToken = await jwt.verifyToken(token);
    const start_date = body.start_date == "" ? null : body.start_date;
    const due_date = body.due_date == "" ? null : body.due_date;
    const assignee = body.assignee == "" ? null : body.assignee;
    const progress = body.progress == "" ? 0.00 : body.progress;
    await subIssueModels.updateSubIssue([body.name, body.description, progress, start_date, due_date, body.comment, body.priority_id, body.status_id, body.label_id, body.tracker_id, assignee, decodedToken.id, subIssueId]);
    return handleResponses.successResponse(200, "Edited sub-issue of this issue successfully.", [], null);
}

const deleteSubIssue = async (subIssueId) => {
    subIssueId = Number(subIssueId);
    await subIssueModels.deleteSubIssue(subIssueId);
    return handleResponses.successResponse(200, "Deleted sub-issue of this issue successfully.", [], null);
}

const subIssueEditProgress = async (subIssueId, body, token) => {
    subIssueId = Number(subIssueId);
    const validationError = handleValidations(updateIssueItemValidator(body));
    if(validationError) return handleResponses.errorResponse(200, "Invalid data.", validationError, body);
    const decodedToken = jwt.verifyToken(token);
    await subIssueModels.subIssueUpdateProgress([body.item, decodedToken.id, subIssueId]);
    return handleResponses.successResponse(200, "Edited sub-issue progress successfully.", [], null);
}

const subIssueEditStartDate = async (subIssueId, body, token) => {
    subIssueId = Number(subIssueId);
    const validationError = handleValidations(dateValidator(body));
    if(validationError) return handleResponses.errorResponse(200, "Invalid data.", validationError, body);
    const decodedToken = await jwt.verifyToken(token);
    await subIssueModels.subIssueUpdateStartDate([body.date, decodedToken.id, subIssueId]);
    return handleResponses.successResponse(200, "Edited start date of this sub-issue successfully.", [], null);
}

const subIssueEditDueDate = async (subIssueId, body, token) => {
    subIssueId = Number(subIssueId);
    const validationError = handleValidations(dateValidator(body));
    if(validationError) return handleResponses.errorResponse(200, "Invalid data.", validationError, body);
    const decodedToken = await jwt.verifyToken(token);
    await subIssueModels.subIssueUpdateDueDate([body.date, decodedToken.id, subIssueId]);
    return handleResponses.successResponse(200, "Edited due date of this sub-issue successfully.", [], null);
}

const subIssueEditComment = async (subIssueId, body, token) => {
    subIssueId = Number(subIssueId);
    const decodedToken = await jwt.verifyToken(token);
    await subIssueModels.subIssueUpdateComment([body.comment, decodedToken.id, subIssueId]);
    return handleResponses.successResponse(200, "Edited comment of this sub-issue successfllully.", [], null);
}

const subIssueEditPriority = async (subIssueId, body, token) => {
    subIssueId = Number(subIssueId);
    const validationError = handleValidations(updateIssueItemValidator(body));
    if(validationError) return handleResponses.errorResponse(200, "Invalid data.", validationError, body);
    const decodedToken = await jwt.verifyToken(token);
    const priority = Number(body.item);
    await subIssueModels.subIssueUpdatePrority([priority, decodedToken.id, subIssueId]);
    return handleResponses.successResponse(200, "Edited priority of this sub-issue successfully.", [], null);
}

const subIssueEditStatus = async (subIssueId, body, token) => {
    subIssueId = Number(subIssueId);
    const validationError = handleValidations(updateIssueItemValidator(body));
    if(validationError) return handleResponses.errorResponse(200, "Invalid data.", validationError, body);
    const decodedToken = await jwt.verifyToken(token);
    const status = Number(body.item);
    await subIssueModels.subIssueUpdateStatus([status, decodedToken.id, subIssueId]);
    return handleResponses.successResponse(200, "Edited status of this sub-issue successfully.", [], null);
}

const subIssueEditLabel = async (subIssueId, body, token) => {
    subIssueId = Number(subIssueId);
    const validationError = handleValidations(updateIssueItemValidator(body));
    if(validationError) return handleResponses.errorResponse(200, "Invalid data.", validationError, null);
    const decodedToken = await jwt.verifyToken(token);
    const label = Number(body.item);
    await subIssueModels.subIssueUpdateLabel([label, decodedToken.id, subIssueId]);
    return handleResponses.successResponse(200, "Edited label of this sub-issue successfully.", [], null);
}

const subIssueEditTracker = async (subIssueId, body, token) => {
    subIssueId = Number(subIssueId);
    const validationError = handleValidations(updateIssueItemValidator(body));
    if(validationError) return handleResponses.errorResponse(200, "Invalid data.", validationError, null);
    const decodedToken = await jwt.verifyToken(token);
    const tracker = Number(body.item);
    await subIssueModels.subIssueUpdateTracker([tracker, decodedToken.id, subIssueId]);
    return handleResponses.successResponse(200, "Edited tracker of this sub-issue successfully.", [], null);
}

const subIssueEditAssignee = async (subIssueId, body, token) => {
    subIssueId = Number(subIssueId);
    const validationError = handleValidations(updateIssueItemValidator(body));
    if(validationError) return handleResponses.errorResponse(200, "Invalid data.", validationError, null);
    const decodedToken = await jwt.verifyToken(token);
    const assignee = Number(body.item);
    await subIssueModels.subIssueUpdateAssignee([assignee, decodedToken.id, subIssueId]);
    return handleResponses.successResponse(200, "Assigned a member successfully.", [], null);
}

module.exports = {
    createSubIssue, getAllSubIssue, getSubIssueById, editSubIssue, deleteSubIssue, 
    subIssueEditProgress, subIssueEditStartDate, subIssueEditDueDate, 
    subIssueEditComment, subIssueEditPriority, subIssueEditStatus,
    subIssueEditLabel, subIssueEditTracker, subIssueEditAssignee
}