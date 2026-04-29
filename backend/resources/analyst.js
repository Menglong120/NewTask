const handleResponses = require('../utils/handleResponses');
const handleValidations = require('../utils/handleValidations');
const helperUtils = require('../utils/helpers');
const jwt = require('../utils/jwt');
const analystModel = require('../models/analystModel');
const issueModel = require('../models/issueModel');
const userModel = require('../models/userModel');
// const project = require('../validations/project');
const { result, last } = require('lodash');
const issue = require('../validations/issue');

const countAllIssueInWeb = async () => {
    const countIssue = await analystModel.countAllIssueInWeb();
    if(countIssue.length <= 0) return handleResponses.errorResponse(200, "No issues in website..!", null, countIssue);
    return handleResponses.successResponse(200, "Get total issue in website successfully.", countIssue, null);
}

const percentageProjectProgress = async (token) => {

    const decodedToken = await jwt.verifyToken(token);
    let getAllProjectDatas;
    const userRes = await userModel.getUserById(decodedToken.id);
    if(userRes[0].role_id != 1){
        getAllProjectDatas = await analystModel.percentageProjectProgressUser(Number(decodedToken.id));
    } else {
        getAllProjectDatas = await analystModel.percentageProjectProgress();
    }
    let result = [];
    getAllProjectDatas.forEach((element) => {
        
        const issueCompleted = element.total_issue > 0 ? element.total_issue_progress / element.total_issue : 0;
        const subIssueCompleted = element.total_sub_issue > 0 ? element.total_sub_issue_progress / element.total_sub_issue : 0;
        let projectCompleted = 0;
        if(subIssueCompleted === 0){
            projectCompleted = issueCompleted;
        } else if(subIssueCompleted > 0){
            projectCompleted = Number(((issueCompleted + subIssueCompleted) / 2).toFixed(2));
        }
        result.push({
            id : element.id,
            name : element.name,
            progress : projectCompleted,
            status : {
                id : element.status_id,
                title : element.status_title,
            },
            issue : {
                total : element.total_issue,
                progress : issueCompleted.toFixed(2)
            },
            sub_issue : {
                total : element.total_sub_issue,
                progress : subIssueCompleted.toFixed(2)
            },
            created_on : element.created_on,
            updated_on : element.updated_on
        })
    })
    return handleResponses.successResponse(200, "Get all completed percentages of projects successfully.", result, null); 
}

const totalDataInProject = async (projectId) => {
    const res = await analystModel.countAllIssueInProject([projectId]);
    const result = {
        id : res[0].id,
        name : res[0].name,
        total : {
            issue : res[0].total_issue,
            sub_issue : res[0].total_sub_issue
        },
        created_on : res[0].created_on,
        updated_on : res[0].updated_on
    }
    return handleResponses.successResponse(200, "Get all completed percentages of projects successfully.", result, null);
}

const countIssueInStatus = async (projectId) => {
    const res = await analystModel.countIssueInStatus([projectId]);
    if(res.length <= 0) return handleResponses.errorResponse(200, "No issues in this project.", null, res);
    let resData = [];
    res.forEach((element) => {
        resData.push({
            id : element.issue_status_id,
            name : element.issue_status_name,
            total_issues : element.total_issue
        });
    })
    const result = {
        project : {
            id : res[0].id,
            name : res[0].name,
            status : {
                id : res[0].status_id,
                title : res[0].status_id
            },
            created_on : res[0].created_on,
            updated_on : res[0].updated_on
        },
        issue_status : resData
    }
    return handleResponses.successResponse(200, "Get elements of issue in each status successfully.", result, null);
}

const countIssueInPriority = async (projectId) => {
    const res = await analystModel.countIssueInPriority([projectId]);
    if(res.length <= 0) return handleResponses.errorResponse(200, "No issues in this project.", null, res);
    let resData = [];
    res.forEach((element) => {
        resData.push({
            id : element.issue_priority_id,
            name : element.issue_priority_name,
            total_issues : element.total_issue
        });
    })
    const result = {
        project : {
            id : res[0].id,
            name : res[0].name,
            status : {
                id : res[0].status_id,
                title : res[0].status_id
            },
            created_on : res[0].created_on,
            updated_on : res[0].updated_on
        },
        issue_priority : resData
    }
    return handleResponses.successResponse(200, "Get elements of issue in each priority successfully.", result, null);
}

const countIssueByStatusInMonth = async (projectId) => {
    const res = await analystModel.countIssueByStatusInMonth([projectId]);
    if ( res.length <= 0 ) return handleResponses.successResponse(200, "No issue in this project.", [], null);
    const statusRes = await issueModel.getAllStatus(projectId);
    if( statusRes.length <= 0 ) return handleResponses.successResponse(200, "No issue-status in this project.", [], null);
    const result = helperUtils.formatDataForChart(res, statusRes);
    return handleResponses.successResponse(200, "Get total of issues in each month of status successfully.", result, null);
}

const countIssueWithAssignee = async (projectId) => {
    const res = await analystModel.countIssueWithAssignee(projectId);
    if(res.length <= 0) return handleResponses.successResponse(200, "No issue in this project.", [], null);
    let result = [];
    res.forEach((element) => {
        
        result.push({
            total : element.total_issue,
            status : {
                id : element.issue_status_id,
                name : element.issue_status_name
            },
            assignee : {
                id : element.user_id,
                first_name : element.first_name,
                last_name : element.last_name,
                dis_name : element.dis_name,
                email : element.email,
                avarta : element.avarta,
                issuename : element.issue_names,
                mainissueid : element.issue_categories_id,
                mainissue :element.issue_categories_name,
                startdate : element.start_date,
                duedate : element.due_date,
                progress : element.progress,
                role : {
                    id : element.role_id,
                    name : element.role_name
                }
            }
        });
    })
    const finalRes = {
        project : {
            id : res[0].id,
            name : res[0].name,
            created_on : res[0].created_on,
            updated_on : res[0].updated_on
        },
        issue : result
    }
    return handleResponses.successResponse(200, "Get total issues in each status of a member.", finalRes, null);
}

module.exports = {
    countAllIssueInWeb,
    percentageProjectProgress,
    totalDataInProject,
    countIssueInStatus,
    countIssueInPriority,
    countIssueByStatusInMonth,
    countIssueWithAssignee,
}