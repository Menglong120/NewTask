const jwt = require('../utils/jwt');
const handleResponses = require('../utils/handleResponses');
const handleValidations = require('../utils/handleValidations');
const helperUtils = require('../utils/helpers');
const projectModels = require('../models/projectModel');
const userModels = require('../models/userModel');
const fileUpload = require('../utils/fileUpload');
const { 
        projectValidator, statusValidator,projectStatusValidator,
        memberValidator, resourceValidator,
        activityValidator
    } = require('../validations/project');

const getAllProjects = async (search, page, perpage, token) => {
    const noPagination = (!page || page === '' || page == 0) && (!perpage || perpage === '' || perpage == 0) && (!search || search === '');
    let finalProjectRes = [];
    const decodedToken = await jwt.verifyToken(token);
    const userRes = await userModels.getUserById(decodedToken.id);
    let projectRes = [], countProjects = [];
    if(userRes[0].role_id == 1){
        if(noPagination){
            projectRes = await projectModels.getAllProjectsNoCheck('', null, null);
            countProjects = await projectModels.countProjectsNoCheck('');
            page = 1;
            perpage = countProjects[0].total;
        } else {
            page = Number(page);
            perpage = Number(perpage);
            projectRes = await projectModels.getAllProjectsNoCheck(search, page, perpage);
            countProjects = await projectModels.countProjectsNoCheck(search);
        }
    }else{
        if(noPagination){
            projectRes = await projectModels.getAllProjects('', null, null, decodedToken.id);
            countProjects = await projectModels.countProjects('', decodedToken.id);
            page = 1;
            perpage = countProjects[0].total;
        } else {
            page = Number(page);
            perpage = Number(perpage);
            projectRes = await projectModels.getAllProjects(search, page, perpage, decodedToken.id);
            countProjects = await projectModels.countProjects(search, decodedToken.id);
        }
    }
    const totalPages = Math.ceil(countProjects[0].total / perpage);
    for(let project of projectRes){
        let projectMember = [];
        let projectMemberTemp = await projectModels.getAllProjectMembers(project.id);
        projectMemberTemp.forEach((element) => {
            projectMember.push(helperUtils.constructProjectMembers(element));
        });
        finalProjectRes.push(helperUtils.constructProjects(project, projectMember));
    }
    const results = helperUtils.constructDataWithPaginate(
        finalProjectRes,
        countProjects[0].total,
        page,
        perpage,
        totalPages,
    )
    return handleResponses.successResponse(200, "Get all projects successfully.", results, null);
}

const getProject = async (projectId) => {
    let finalProjectRes = [];
    const projectRes = await projectModels.getAllProjectsById(projectId);
    for( i = 0; i < projectRes.length; i++ ){
        let projectMember = [];
        let projectMemberTemp = await projectModels.getAllProjectMembers(projectRes[i].id);
        projectMemberTemp.forEach((element) => {
            projectMember.push(helperUtils.constructProjectMembers(element));
        });
        finalProjectRes.push(helperUtils.constructProjects(projectRes[i], projectMember));
    }
    return handleResponses.successResponse(200, "Getted project details successfully.", finalProjectRes, null);
}

const createProject = async (token, body) => {
    let finalProjectRes = [];
    const validationError = handleValidations(projectValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid Data", validationError, body);
    const decodedToken = await jwt.verifyToken(token);
    const projectCreated = await projectModels.createProject([
        body.name, 
        body.description || null, 
        body.status_id, 
        body.start_date || null, 
        body.end_date || null
    ]);
    const projectId = projectCreated.insertId;
    await projectModels.createProjectMember([decodedToken.id, projectId, 1]);
    
    if (body.members && Array.isArray(body.members)) {
        for (let userId of body.members) {
            if (userId !== decodedToken.id) {
                await projectModels.createProjectMember([userId, projectId, 2]);
            }
        }
    }

    // Auto-create default items
    const issueModels = require('../models/issueModel');
    
    // Default Statuses
    const statuses = ['To Do', 'In Progress', 'Done'];
    for (let status of statuses) {
        await issueModels.createStatus([projectId, status, `Default ${status} status`]);
    }
    
    // Default Labels
    const labels = ['Frontend', 'Backend', 'Design'];
    for (let label of labels) {
        await issueModels.createLabel([projectId, label, `Default ${label} label`]);
    }
    
    // Default Priorities
    const priorities = ['Low', 'Medium', 'High'];
    for (let priority of priorities) {
        await issueModels.createPriority([projectId, priority, `Default ${priority} priority`]);
    }
    
    // Default Trackers
    const trackers = ['Bug Tracker', 'Feature Tracker', 'Task Tracker'];
    for (let tracker of trackers) {
        await issueModels.createTracker([projectId, tracker, `Default ${tracker}`]);
    }
    
    // Default Categories
    const categories = ['UI/UX', 'API', 'Database'];
    for (let category of categories) {
        await issueModels.createCategory([projectId, category, `Default ${category} category`]);
    }
    const projectRes = await projectModels.getAllProjectsById(projectId);
    for( i = 0; i < projectRes.length; i++ ){
        let projectMember = [];
        let projectMemberTemp = await projectModels.getAllProjectMembers(projectRes[i].id);
        projectMemberTemp.forEach((element) => {
            projectMember.push(helperUtils.constructProjectMembers(element));
        });
        finalProjectRes.push(helperUtils.constructProjects(projectRes[i], projectMember));
    }
    return handleResponses.successResponse(200, "Created a project successfully.", finalProjectRes, null);
}

const editProject = async (id, body) => {
    const validationError = handleValidations(projectValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid Data", validationError, body);
    await projectModels.updateProject([
        body.name, 
        body.description || null, 
        body.start_date || null, 
        body.end_date || null, 
        id
    ]);
    return handleResponses.successResponse(200, "Project updated successfully.", [], null);
}

const editProjectStatus = async (id, body) => {
    const validationError = handleValidations(projectStatusValidator(body));
    if (validationError)
        return handleResponses.errorResponse(400, "Invalid Data", validationError, body);

    await projectModels.updateProjectStatus([body.status_id, id]);
    return handleResponses.successResponse(200, "Project Status updated successfully.", [], null);
};


const deleteProject = async (projectId) => {    
    await projectModels.deleteProject([projectId]);
    return handleResponses.successResponse(200, "Project deleted successfully.", [], null);
}

// Project Status
const getAllStatuses = async (search = '', page = 1, perpage = 10) => {
    page = Number(page);
    perpage = Number(perpage);
    const statusRes = await projectModels.getAllProjectStatus(search, page, perpage);
    const countProjectStatus = await projectModels.countProjectStatus(search, page, perpage);
    const totalPages = Math.ceil(countProjectStatus[0].total / perpage);
    const results = helperUtils.constructDataWithPaginate(
        statusRes, 
        countProjectStatus[0].total, 
        page, 
        perpage, 
        totalPages
    );
    return handleResponses.successResponse(200, "Get all statuses data successfully.", results, null)
}

const createStatus = async (body) => {
    const validationError = handleValidations(statusValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid Data..!", validationError, body);
    await projectModels.createStatus([body.title, body.description]);
    return handleResponses.successResponse(200, "Status created successfully", [], null);
}

const getStatus = async (id) => {
    const res = await projectModels.getProjectStatus([id]);
    return handleResponses.successResponse(200, "Get a status data successfully.", res, null);
}

const updateStatus = async (id, body) => {
    const validationError = handleValidations(statusValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid Data..!", validationError, body);
    const statusCheck = await projectModels.getProjectStatus([id]);
    if(statusCheck.length <= 0) return handleResponses.errorResponse(400, "Invalid id..!", null, body);
    await projectModels.updateStatus([body.title, body.description, id]);
    return handleResponses.successResponse(200, "Status updated successfully.", [], null);
}

const deleteStatus = async (id) => {
    const statusCheck = await projectModels.getProjectStatus([id]);
    if(statusCheck.length <= 0) return handleResponses.errorResponse(400, "Invalid id..!", null, []);

    const statusUsage = await projectModels.isStatusUsed([id]);
    if (statusUsage.isUsed) {
        const projects = await projectModels.getProjectsUsingStatus([id]);
        return handleResponses.errorResponse( 400,  `Cannot delete: This status is assigned to ${statusUsage.count} project(s).`, null, projects  );
    }

    await projectModels.deleteStatus([id]);    
    return handleResponses.successResponse(200, "Deleted a status data successfully.", [], null);
}

// Project members
const getAllMembers = async ( search = '', page = 1, perpage = 10, projectId) => {
    page = Number(page);
    perpage = Number(perpage);
    let projectMember = [];
    let projectMemberTemp = await projectModels.getAllProjectMembersPaginate(search, page, perpage, projectId);
    projectMemberTemp.forEach((element) => {
        projectMember.push(helperUtils.constructProjectMembers(element));
    });
    const membersCount = await projectModels.countProjectMembers(search, projectId);
    const totalPages = Math.ceil(membersCount[0].total / perpage);
    const results = helperUtils.constructDataWithPaginate(
        projectMember, 
        membersCount[0].total, 
        page, 
        perpage, 
        totalPages
    );
    return handleResponses.successResponse(200, "Get all members successfully.", results, null);
}

const getMember = async (memberId) => {
    const projectMemberRes = await projectModels.getAllProjectMemberbyId(memberId);
    const result = helperUtils.constructProjectMembers(projectMemberRes[0]);
    return handleResponses.successResponse(200, "Get a member of the project successfully.", result, null);
}

const addMember = async (projectId ,body) => {
    const validationError = handleValidations(memberValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid Data..!", validationError, body);
    projectId = JSON.parse(projectId);
    const members = JSON.parse(body.user_id).map(Number);
    for(i = 0; i < members.length; i++){
        await projectModels.createProjectMember([members[i], projectId]);
    }
    return handleResponses.successResponse(200, "Added members successfully.", [], null);
}

const removeMember = async (memberId) => {
    await projectModels.removeMember([memberId]);
    return handleResponses.successResponse(200, "Removed a member successfully.", [], null);
}

// Project resource
const getAllProjectResources = async (search, page, perpage, projectId) => {
    page = Number(page);
    perpage = Number(perpage);
    projectId = Number(projectId);
    let resources = [];
    const resourcesRes = await projectModels.getAllProjectResources(search, page, perpage, projectId);
    resourcesRes.forEach((element) => {
        resources.push(helperUtils.constructProjectResource(element));
    });
    const countProjectResources = await projectModels.countProjectResources(search, projectId);
    const totalPages = Math.ceil(countProjectResources[0].total / perpage);
    const result = helperUtils.constructDataWithPaginate(
        resources,
        countProjectResources[0].total,
        page,
        perpage,
        totalPages,
    )
    return handleResponses.successResponse(200, "Get all resources of this project successfully.", result, null);
}

const getProjectResource = async (resourceId) => {
    const resourcesRes = await projectModels.getProjectResource(resourceId);
    const result = helperUtils.constructProjectResource(resourcesRes[0]);
    return handleResponses.successResponse(200, "Get details of a resource of this project successfully.", result, null);
}

const createProjectResource = async (projectId, body) => {
    const validationError = handleValidations(resourceValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid Data..!", validationError, body);
    await projectModels.createProjectResource([projectId, body.title, body.note]);
    return handleResponses.successResponse(200, "Created a resource of project successfully.", [], null);
}

const editProjectResource = async (resourceId, body) => {
    resourceId = Number(resourceId);
    const validationError = handleValidations(resourceValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid Data..!", validationError, body);
    await projectModels.updateProjectResource([body.title, body.note, resourceId]);
    return handleResponses.successResponse(200, "Edited a resource of project successfully.", [], null);
}

const deleteProjectResource = async (resourceId) => {
    resourceId = Number(resourceId);
    await projectModels.deleteProjectResource([resourceId]);
    return handleResponses.successResponse(200, "Deleted a resource of project successfully.", [], null);
}

// Project Resource File
const getAllProjectResourceFiles = async (search, page, perpage, resourceId) => {
    resourceId = Number(resourceId);
    page = Number(page);
    perpage = Number(perpage);
    let constructFile = [];
    const reFileRes = await projectModels.getAllResourceFiles(search, page, perpage, resourceId);
    reFileRes.forEach((element) => {
        constructFile.push(helperUtils.constructResourceFile(element));
    })
    const countResourceFiles = await projectModels.countResourceFile(search, resourceId);
    const totalPages = Math.ceil(countResourceFiles[0].total / perpage);
    const resultPaginate = helperUtils.constructDataWithPaginate(
        constructFile,
        countResourceFiles[0].total,
        page,
        perpage,
        totalPages,
    )
    const resourcesRes = await projectModels.getProjectResource(resourceId);
    const result = helperUtils.constructProjectResourceFile(resourcesRes[0], resultPaginate);
    return handleResponses.successResponse(200, "Get all file in this resource successfully.", result, null);
}

const getProjectResourceFile = async (fileId) => {
    fileId = Number(fileId);
    const fileRes = await projectModels.getResourceFile(fileId);
    const result = helperUtils.constructDetailResourceFile(fileRes[0]);
    return handleResponses.successResponse(200, "Get detail a file of this resource successfully.", result, null);
}
 
const addProjectResourceFile = async ( resourceId, file) => {
    resourceId = Number(resourceId);
    const uploadedFileName = await fileUpload.uploadFile(file.resource_file, './public/storage/')
    await projectModels.addResourceFile([resourceId, uploadedFileName, file.resource_file.name]);
    return handleResponses.successResponse(200, "Added a file to this project successfully.", [], null);
} 

const updateProjectResourceFile = async (fileId, file) => {
    fileId = Number(fileId);
    const fileRes = await projectModels.getResourceFile(fileId);
    const old_file = fileRes[0].file;
    const updatedFileName = await fileUpload.updateFile(file.new_file, old_file, './public/storage/', null);
    await projectModels.updateResourceFile([updatedFileName, file.new_file.name, fileId]);
    return handleResponses.successResponse(200, "Updated a file of this resource successfully.", [], null);
}

const deleteProjectResourceFile = async (fileId) => {
    fileId = Number(fileId);
    const fileRes = await projectModels.getResourceFile(fileId);
    const file = fileRes[0].file;
    fileUpload.deleteFile(file, './public/storage/', null);
    await projectModels.deleteResourceFile([fileId]);
    return handleResponses.successResponse(200, "Deleted a file from this resource successfully.", [], null);
}

// Project Activities
const getAllProjectActivity = async (search = '', page = 1, perpage = 10, projectId) => {
    page = Number(page);
    perpage = Number(perpage);
    projectId = Number(projectId);
    let resultsTemp = [];
    const activityRes = await projectModels.getAllProjectActivity(search, page, perpage, projectId);
    activityRes.forEach((element) => {
        resultsTemp.push(helperUtils.constructProjectActivity(element));
    })
    const activityCount = await projectModels.countProjectActivity(search, projectId);
    const totalPages = Math.ceil(activityCount[0].total / perpage);
    const results = helperUtils.constructDataWithPaginate(
        resultsTemp, 
        activityCount[0].total, 
        page, 
        perpage, 
        totalPages
    );
    return handleResponses.successResponse(200, "Get all activities of this project successfully.", results, null);
}

const getProjectActivity = async (activityId) => {
    activityId = Number(activityId);
    const activityRes = await projectModels.getDetailProjectActivity(activityId);
    const results = helperUtils.constructProjectActivity(activityRes[0]);
    return handleResponses.successResponse(200, "Get detail an activity successfully.", results, null);
}

const createProjectActivity = async (token, projectId, body) => {
    const validationError = handleValidations(activityValidator(body));
    if(validationError) return handleResponses.errorResponse(400, "Invalid Data..!", validationError, body);
    const decodedToken = await jwt.verifyToken(token);
    const userRes = await userModels.getUserWithRoleById(decodedToken.id);
    if(userRes[0].role_id == 1){
        return handleResponses.successResponse(200, "Actor is a superadmin. So we don't have to take the activity.", [], null);
    } else {
        const memberId = await projectModels.getMemberIdByUserProjectId(decodedToken.id, projectId);
        if(!memberId) return handleResponses.errorResponse(400, "Invalid member.", null, []);
        await projectModels.createProjectActivity([memberId[0].id, projectId, body.title, body.activity]);
        return handleResponses.successResponse(200, "Activity saved successfully.", [], null);
    }   
}

const deleteProjectActivity = async (activityId) => {
    activityId = Number(activityId);
    await projectModels.deleteProjectActivity([activityId]);
    return handleResponses.successResponse(200, "An activity was deleted successfully.", [], null);
}

module.exports = {
    getAllProjects, getProject, createProject, editProject,editProjectStatus, deleteProject,
    getAllStatuses, createStatus, getStatus, updateStatus, deleteStatus,
    getAllMembers, addMember, removeMember, getMember,
    getAllProjectResources, getProjectResource, createProjectResource, editProjectResource, deleteProjectResource,
    getAllProjectResourceFiles, getProjectResourceFile, updateProjectResourceFile, addProjectResourceFile, deleteProjectResourceFile,
    getAllProjectActivity, getProjectActivity, createProjectActivity, deleteProjectActivity
}