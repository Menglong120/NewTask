const express = require('express');
const issueController = require('../../controllers/api/issue');
const { requireProjectMember } = require('../../middleware/project');
const { checkLabel, checkPriority, checkStatus, checkTracker, checkIssue, checkNote, checkIssueLabelId, checkIssuePriorityId, checkIssueStatusId, checkIssueTrackerId } = require('../../middleware/issue');
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();

// Issue_Label
router.post('/projects/issue/label/:id', requireProjectMember, issueController.createLabel); // params project id
router.get('/projects/issue/labels/:id', requireProjectMember, issueController.getAllLabels); // params project id
router.get('/label/:id', requireAuth, checkLabel, issueController.getLabel); // params label id
router.put('/label/:id', requireAuth, checkLabel, issueController.editLabel); // params label id
router.delete('/label/:id', requireAuth, checkLabel, issueController.deleteLabel); // params label id

// Issue_Priority
router.post('/projects/issue/priority/:id', requireProjectMember, issueController.createPriority); // params project id
router.get('/projects/issue/priorities/:id', requireProjectMember, issueController.getAllPriorities); // params project id
router.get('/priority/:id', requireAuth, checkPriority, issueController.getPriority); // params priority id
router.put('/priority/:id', requireAuth, checkPriority, issueController.editPriority); // params priority id
router.delete('/priority/:id', requireAuth, checkPriority, issueController.deletePriority); // params priority id

// Issue_Status
router.post('/projects/issue/status/:id', requireProjectMember, issueController.createStatus); // params project id
router.get('/projects/issue/statuses/:id', requireProjectMember, issueController.getAllStatus); // params project id
router.get('/issue/status/:id', requireAuth, checkStatus, issueController.getStatus); // params status id
router.put('/issue/status/:id', requireAuth, checkStatus, issueController.editStatus); // params status id
router.delete('/issue/status/:id', requireAuth, checkStatus, issueController.deleteStatus); // params status id

// Issue_Tracker
router.post('/projects/issue/tracker/:id', requireProjectMember, issueController.createTracker); // params project id
router.get('/projects/issue/trackers/:id', requireProjectMember, issueController.getAllTrackers); // params project id
router.get('/issue/tracker/:id', requireAuth, checkTracker, issueController.getTracker); // params tracker id
router.put('/issue/tracker/:id', requireAuth, checkTracker, issueController.editTracker); // params tracker id
router.delete('/issue/tracker/:id', requireAuth, checkTracker, issueController.deleteTracker); // params tracker id

// Issue
router.post('/projects/issue/:id', requireProjectMember, issueController.createIssue); // params project id
router.get('/projects/issues/:id', requireProjectMember, issueController.getAllIssueInProject); // params project id
router.get('/issue/:id', requireAuth, checkIssue, issueController.getIssue); // params issue id
router.delete('/issue/:id', requireAuth, checkIssue, issueController.deleteIssue); // params issue id
router.put('/issue/:id', requireAuth, checkIssue, issueController.editIssue); // params issue id

// Issue Edit
router.put('/issue/edit/label/:id', requireAuth, checkIssue, checkIssueLabelId, issueController.issueEditLabelOnly); // params issue id
router.put('/issue/edit/priority/:id', requireAuth, checkIssue, checkIssuePriorityId, issueController.issueEditPriorityOnly); // params issue id
router.put('/issue/edit/status/:id', requireAuth, checkIssue, checkIssueStatusId, issueController.issueEditStatusOnly); // params issue id
router.put('/issue/edit/tracker/:id', requireAuth, checkIssue, checkIssueTrackerId, issueController.issueEditTrackerOnly); // params issue id
router.put('/issue/edit/startdate/:id', requireAuth, checkIssue, issueController.issueEditStartDateOnly); // params issue id
router.put('/issue/edit/duedate/:id', requireAuth, checkIssue, issueController.issueEditDueDateOnly); // params issue id
router.put('/issue/edit/progress/:id', requireAuth, checkIssue, issueController.issueEditProgressOnly); // params issue id
router.put('/issue/edit/assignee/:id', requireAuth, checkIssue, issueController.issueEditAssignee); // params issue id

// Issue_note
router.post('/issue/note/:id', requireAuth, checkIssue, issueController.createIssueNote); // params issue id
router.get('/issue/notes/:id', requireAuth, checkIssue, issueController.getAllNote); // params issue id
router.get('/issue/note/:id', requireAuth, checkNote, issueController.getNoteById); // params note id
router.put('/issue/note/:id', requireAuth, checkNote, issueController.editNote); // params note id
router.delete('/issue/note/:id', requireAuth, checkNote, issueController.deleteNote); // params note id

// Issue Activity
router.post('/issue/activity/:id', requireAuth, checkIssue, issueController.issueCreateActivity); // params issue id
router.get('/issue/activities/:id', requireAuth, checkIssue, issueController.issueGetAllActivity); // params issue id
router.get('/issue/activity/:id', requireAuth, issueController.issueGetDetailActivity); // params issue_activity id

module.exports = router;