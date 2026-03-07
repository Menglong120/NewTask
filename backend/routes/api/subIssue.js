const express = require('express');
const subIssueController = require('../../controllers/api/subIssue');
const { requireAuth } = require('../../middleware/auth');
const { checkIssue, checkSubIssue } = require('../../middleware/issue');

const router = express.Router();

router.post('/sub/issue/:id', requireAuth, checkIssue, subIssueController.createSubIssue ); // params issue id
router.get('/sub/issues/:id', requireAuth, checkIssue, subIssueController.getAllSubIssue); // params issue id
router.get('/sub/issue/:id', requireAuth, checkSubIssue, subIssueController.getSubIssueById); // params sub-issue id
router.put('/sub/issue/:id', requireAuth, checkSubIssue, subIssueController.editSubIssue); // params sub-issue id
router.delete('/sub/issue/:id', requireAuth, checkSubIssue, subIssueController.deleteSubIssue); // params sub-issue id

router.put('/sub/issue/progress/:id', requireAuth, checkSubIssue, subIssueController.subIssueEditProgress); // params sub-issue id
router.put('/sub/issue/startdate/:id', requireAuth, checkSubIssue, subIssueController.subIssueEditStartDate); // params sub-issue id
router.put('/sub/issue/duedate/:id', requireAuth, checkSubIssue, subIssueController.subIssueEditDueDate); // params sub-issue id
router.put('/sub/issue/comment/:id', requireAuth, checkSubIssue, subIssueController.subIssueEditComment); // params sub-issue id
router.put('/sub/issue/priority/:id', requireAuth, checkSubIssue, subIssueController.subIssueEditPriority); // params sub-issue id
router.put('/sub/issue/status/:id', requireAuth, checkSubIssue, subIssueController.subIssueEditStatus); // params sub-issue id
router.put('/sub/issue/label/:id', requireAuth, checkSubIssue, subIssueController.subIssueEditLabel); // params sub-issue id
router.put('/sub/issue/tracker/:id', requireAuth, checkSubIssue, subIssueController.subIssueEditTracker); // params sub-issue id
router.put('/sub/issue/assignee/:id', requireAuth, checkSubIssue, subIssueController.subIssueEditAssignee); // params sub-issue id

module.exports = router;