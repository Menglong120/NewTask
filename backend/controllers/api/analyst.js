const handleResponses = require('../../utils/handleResponses');
const analystResource = require('../../resources/analyst');

const countTotalIssueInWeb = async (req, res) => {
    try{
        const data = await analystResource.countAllIssueInWeb();
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const percentageProjectProgress = async (req, res) => {
    try{
        const token = req.cookies.jwtToken;
        if(token){
            const data = await analystResource.percentageProjectProgress(token);
            res.status(data.status).json(data.body);
        }
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const totalDataInProject = async (req, res) => {
    try{
        const data = await analystResource.totalDataInProject(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const countIssueInStatus = async (req, res) => {
    try{
        const data = await analystResource.countIssueInStatus(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
} 

const countIssueInPriority = async (req, res) => {
    try{
        const data = await analystResource.countIssueInPriority(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const countIssueInCategory = async (req, res) => {
    try{
        const data = await analystResource.countIssueInCategory(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const countIssueByStatusInMonth = async (req, res) => {
    try{
        const data = await analystResource.countIssueByStatusInMonth(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

const countIssueWithAssignee = async (req, res) => {
    try{
        const data = await analystResource.countIssueWithAssignee(req.params.id);
        res.status(data.status).json(data.body);
    } catch(err) {
        res.status(400).json(handleResponses.catchErrorResponse(err));
    }
}

module.exports = {
    countTotalIssueInWeb,
    percentageProjectProgress,
    totalDataInProject,
    countIssueInStatus,
    countIssueInPriority,
    countIssueInCategory,
    countIssueByStatusInMonth,
    countIssueWithAssignee
}