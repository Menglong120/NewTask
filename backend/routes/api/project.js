const express = require('express');
const projectController = require('../../controllers/api/project');
const { requireAuth, requireBothAdmin } = require('../../middleware/auth');
const { requireProjectMember, requireProjectMemberAdmin,
    checkProject, checkMemberAddToProject,
    checkMemberProjectByMemberId, checkProjectResource, checkProjectResourceFile,
    checkProjectActivity,
} = require('../../middleware/project');

const router = express.Router();

// Project
router.get('/projects', requireAuth, projectController.getAllProjects);
router.get('/project/:id', requireProjectMember, projectController.getProject);
router.post('/project', requireBothAdmin, projectController.createProject);
router.put('/project/:id', requireProjectMember, projectController.editProject);
router.put('/projectstatus/:id', requireProjectMember, projectController.editProjectStatus);
router.delete('/project/:id', requireProjectMember, projectController.deleteProject);

// Project Status
router.get('/projects/status', requireAuth, projectController.getAllStatuses);
router.get('/projects/status/:id', requireBothAdmin, projectController.getStatus);
router.post('/projects/status', requireBothAdmin, projectController.createStatus);
router.put('/projects/status/:id', requireBothAdmin, projectController.updateStatus);
router.delete('/projects/status/:id', requireBothAdmin, projectController.deleteStatus);

// Project Members
router.get('/projects/members/:id', checkProject, requireProjectMember, projectController.getAllMembers); // params project id
router.get('/projects/member/:id', requireAuth, checkMemberProjectByMemberId, projectController.getMember); // params member id
router.post('/projects/member/:id', checkProject, requireProjectMemberAdmin, checkMemberAddToProject, projectController.addMember); // params project id
router.delete('/projects/member/:id', requireBothAdmin, checkMemberProjectByMemberId, projectController.removeMember); // params member id 

// Project Resource
router.get('/projects/resources/:id', requireProjectMember, projectController.getAllProjectResources); // params project id
router.get('/projects/resource/:id', requireAuth, checkProjectResource, projectController.getProjectResource); // params resource id
router.post('/projects/resource/:id', requireProjectMember, projectController.createProjectResource); // params project id
router.put('/projects/resource/:id', requireAuth, checkProjectResource, projectController.editProjectResource) // params resource id
router.delete('/projects/resource/:id', requireAuth, checkProjectResource, projectController.deleteProjectResource); // params resource id

// Project Resource File
router.get('/projects/resources/files/:id', requireAuth, checkProjectResource, projectController.getAllProjectResourceFiles); // params resource id
router.get('/projects/resources/file/:id', requireAuth, checkProjectResourceFile, projectController.getProjectResourceFile); // params file id
router.post('/projects/resources/file/:id', requireAuth, checkProjectResource, projectController.addProjectResourceFile); // params resource id
router.put('/projects/resources/file/:id', requireAuth, checkProjectResourceFile, projectController.updateProjectResourceFile); // params file id
router.delete('/projects/resources/file/:id', requireAuth, checkProjectResourceFile, projectController.deleteProjectResourceFile) // params file id

// Project Activity
router.get('/projects/activities/:id', requireProjectMember, projectController.getAllProjectActivity); // params project id
router.get('/projects/activity/:id', requireAuth, checkProjectActivity, projectController.getProjectActivity); // params activity id
router.post('/projects/activity/:id', requireProjectMember, projectController.createProjectActivity); // params project id
router.delete('/projects/activity/:id', requireBothAdmin, checkProjectActivity, projectController.deleteProjectActivity); // params activity id

module.exports = router;