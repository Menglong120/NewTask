const express = require('express');
const analystController = require('../../controllers/api/analyst');
const { requireAdmin, requireAuth } = require('../../middleware/auth');

const router = express.Router();

router.get('/analyst/dashboard/issues', requireAdmin, analystController.countTotalIssueInWeb);
router.get('/analyst/dashboard/allprogress', requireAuth, analystController.percentageProjectProgress);
router.get('/analyst/project/total/:id', requireAuth, analystController.totalDataInProject);
router.get('/analyst/project/issue/status/:id', requireAuth, analystController.countIssueInStatus);
router.get('/analyst/project/issue/priority/:id', requireAuth, analystController.countIssueInPriority);
router.get('/analyst/project/issue/month/:id', requireAuth, analystController.countIssueByStatusInMonth);
router.get('/analyst/project/issue/assignee/:id', requireAuth, analystController.countIssueWithAssignee);

module.exports = router;