const updateStatusOnly = async function (issueId, statusId) {
    const res = await fetch(`${baseApiUrl}/api/issue/edit/status/${issueId}`,{
        method : 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            item : statusId
        }),
    });
    const data = await res.json();
    return data;
}

const updatePriorityOnly = async function (issueId, priorityId) {
    const res = await fetch(`${baseApiUrl}/api/issue/edit/priority/${issueId}`,{
        method : 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            item : priorityId
        }),
    });
    const data = await res.json();
    return data;
}

const updateTrackerOnly = async function (issueId, trackerId) {
    const res = await fetch(`${baseApiUrl}/api/issue/edit/tracker/${issueId}`,{
        method : 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            item : trackerId
        }),
    });
    const data = await res.json();
    return data;
}

const updateLabelOnly = async function (issueId, labelId) {
    const res = await fetch(`${baseApiUrl}/api/issue/edit/label/${issueId}`,{
        method : 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            item : labelId
        }),
    });
    const data = await res.json();
    return data;
}

const updateAssigneeOnly = async function (issueId, userId){
    const res = await fetch(`${baseApiUrl}/api/issue/edit/assignee/${issueId}`,{
        method : 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            item : userId
        }),
    });
    const data = await res.json();
    return data;
}

const updateStartDate = async function (issueId, startDate) {
    const res = await fetch(`${baseApiUrl}/api/issue/edit/startdate/${issueId}`, {
        method : 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            date : startDate
        }),
    });
    const data = await res.json();
    return data;
}

const updateDueDate = async function (issueId, dueDate) {
    const res = await fetch(`${baseApiUrl}/api/issue/edit/duedate/${issueId}`, {
        method : 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            date : dueDate
        }),
    });
    const data = await res.json();
    return data;
}

const updateProgress = async function (issueId, progress){
    const res = await fetch(`${baseApiUrl}/api/issue/edit/progress/${issueId}`, {
        method : 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            item : progress
        }),
    });
    const data = await res.json();
    return data;
}

// invoke
async function progressChange(issueId, progress, fetchFunc, fetchFunc2, fetchParams){
    issueId = Number(issueId);
    progress = Number(progress);
    const res = await updateProgress(issueId, progress);
    if(res.result){
        await fetchFunc();
        fetchParams === null ? '' : await fetchFunc2(fetchParams);
    }
    return res;
}

async function statusChange(item, fetchFunc, fetchFunc2, fetchParams) {
    const statusId = item.dataset.value;
    const issueId = item.dataset.issue;
    const res = await updateStatusOnly(issueId, statusId);
    if(res.result){
        await fetchFunc();
        fetchParams === null ? '' : await fetchFunc2(fetchParams);
    }
    return res;
}
async function priorityChange(item, fetchFunc, fetchFunc2, fetchParams) {
    const priorityId = item.dataset.value;
    const issueId = item.dataset.issue;
    const res = await updatePriorityOnly(issueId, priorityId);
    if(res.result){
        await fetchFunc();
        fetchParams === null ? '' : await fetchFunc2(fetchParams);
    }
    return res;
}
async function trackerChange(item, fetchFunc, fetchFunc2, fetchParams) {
    const trackerId = item.dataset.value;
    const issueId = item.dataset.issue;
    const res = await updateTrackerOnly(issueId, trackerId);
    if(res.result){
        await fetchFunc();
        fetchParams === null ? '' : await fetchFunc2(fetchParams);    
    }
    return res;
}
async function labelChange(item, fetchFunc, fetchFunc2, fetchParams) {
    const labelId = item.dataset.value;
    const issueId = item.dataset.issue;
    const res = await updateLabelOnly(issueId, labelId);
    if(res.result){
        await fetchFunc();
        fetchParams === null ? '' : await fetchFunc2(fetchParams);    
    }
    return res;
}
async function assigneeChange(item, fetchFunc, fetchFunc2, fetchParams) {
    const userId = item.dataset.value;
    const issueId = item.dataset.issue;
    // console.log("user : " + userId + ", issue : " + issueId);
    const res = await updateAssigneeOnly(issueId, userId);
    if(res.result){
        await fetchFunc();
        fetchParams === null ? '' : await fetchFunc2(fetchParams);    
    }
    return res;
}

async function startDateChange(issueId, date, fetchFunc, fetchFunc2, fetchParams) {
    const res = await updateStartDate(issueId, date);
    if(res.result){
        await fetchFunc();
        fetchParams === null ? '' : await fetchFunc2(fetchParams);    }
}

async function dueDateChange(issueId, date, fetchFunc, fetchFunc2, fetchParams) {
    const res = await updateDueDate(issueId, date);
    if(res.result){
        await fetchFunc();
        fetchParams === null ? '' : await fetchFunc2(fetchParams);    }
}

// Issue Note
const updateIssueNote = async function(noteId, note){
    const res = await fetch(`${baseApiUrl}/api/issue/note/${noteId}`,{
        method : 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            note : note
        }),
    });
    const response = await res.json();
    if(response.result){
        return response;
    } else {
        return null;
    }
}

// Issue
async function updateIssue(issueId, data){
    const res = await fetch(`${baseApiUrl}/api/issue/${issueId}`,{
        method : 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name : data.name,
            description : data.description,
            progress : data.progress,
            start_date : data.start_date,
            due_date : data.due_date,
            status_id : data.status_id,
            priority_id : data.priority_id,
            tracker_id : data.tracker_id,
            label_id : data.label_id,
            assignee : data.assignee
        })
    });
    const datas = await res.json();
    return datas;
}



// Sub issue
const updateSubAssignee = async (subIssueId, userId) => {
    const res = await fetch(`${baseApiUrl}/api/sub/issue/assignee/${subIssueId}`,{
        method : 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            item : userId
        }),
    });
    const data = await res.json();
    return data;
}

const updateSubTracker = async (subIssueId, trackerId) => {
    const res = await fetch(`${baseApiUrl}/api/sub/issue/tracker/${subIssueId}`,{
        method : 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            item : trackerId
        }),
    });
    const data = await res.json();
    return data;
}

const updateSubLabel = async (subIssueId, labelId) => {
    const res = await fetch(`${baseApiUrl}/api/sub/issue/label/${subIssueId}`,{
        method : 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            item : labelId
        }),
    });
    const data = await res.json();
    return data;
}

const updateSubStatus = async (subIssueId, statusId) => {
    const res = await fetch(`${baseApiUrl}/api/sub/issue/status/${subIssueId}`,{
        method : 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            item : statusId
        }),
    });
    const data = await res.json();
    return data;
}

const updateSubPriority = async (subIssueId, propertyId) => {
    const res = await fetch(`${baseApiUrl}/api/sub/issue/priority/${subIssueId}`,{
        method : 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            item : propertyId
        }),
    });
    const data = await res.json();
    return data;
}

const updateSubComment = async (subIssueId, comments) => {
    const res = await fetch(`${baseApiUrl}/api/sub/issue/comment/${subIssueId}`,{
        method : 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            comment : comments
        }),
    });
    const data = await res.json();
    return data;
}

const updateSubDueDate = async (subIssueId, due_date) => {
    const res = await fetch(`${baseApiUrl}/api/sub/issue/duedate/${subIssueId}`,{
        method : 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            date : due_date
        }),
    });
    const data = await res.json();
    return data;
}

const updateSubStartDate = async (subIssueId, start_date) => {
    const res = await fetch(`${baseApiUrl}/api/sub/issue/startdate/${subIssueId}`,{
        method : 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            date : start_date
        }),
    });
    const data = await res.json();
    return data;
}

const updateSubProgress = async (subIssueId, progress) => {
    const res = await fetch(`${baseApiUrl}/api/sub/issue/progress/${subIssueId}`,{
        method : 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            item : progress
        }),
    });
    const data = await res.json();
    return data;
}

// Invoke
async function invokeChangeSubAssignee(item, fetchFunc, fetchFunc2, fetchParams) {
    const userId = item.dataset.value;
    const subIssueId = item.dataset.subissue;
    const email = item.dataset.email;
    // console.log(item);
    const res = await updateSubAssignee(subIssueId, userId);
    if(res.result){
        await fetchFunc();
        fetchParams === null ? '' : await fetchFunc2(fetchParams);
        const subIssueRes = await fetchDetailSubIssue(subIssueId);
        if(subIssueRes !== null){
            createIssueActivity(subIssueRes.issue.id, "Sub-Issue Assignee", `Assigned < ${email} > to sub-issue ( ${subIssueRes.sub_issues.name} ) of issue `);
        }
    }
}

async function invokeChangeSubTracker(item, fetchFunc, fetchFunc2, fetchParams) {
    const trackerId = item.dataset.value;
    const subIssueId = item.dataset.subissue;
    const res = await updateSubTracker(subIssueId, trackerId);
    if(res.result){
        await fetchFunc();
        fetchParams === null ? '' : await fetchFunc2(fetchParams);
        const subIssueRes = await fetchDetailSubIssue(subIssueId);
        if(subIssueRes !== null){
            createIssueActivity(subIssueRes.issue.id, "Update Sub-Issue", `Updated tracker of sub-issue ( ${subIssueRes.sub_issues.name} ) of issue `);
        }
    }
}

async function invokeChangeSubLabel(item, fetchFunc, fetchFunc2, fetchParams) {
    const labelId = item.dataset.value;
    const subIssueId = item.dataset.subissue;
    const res = await updateSubLabel(subIssueId, labelId);
    if(res.result){
        await fetchFunc();
        fetchParams === null ? '' : await fetchFunc2(fetchParams);
        const subIssueRes = await fetchDetailSubIssue(subIssueId);
        if(subIssueRes !== null){
            createIssueActivity(subIssueRes.issue.id, "Update Sub-Issue", `Updated label of sub-issue ( ${subIssueRes.sub_issues.name} ) of issue `);
        }
    }
}

async function invokeChangeSubStatus(item, fetchFunc, fetchFunc2, fetchParams) {
    const statusId = item.dataset.value;
    const subIssueId = item.dataset.subissue;
    const res = await updateSubStatus(subIssueId, statusId);
    if(res.result){
        await fetchFunc();
        fetchParams === null ? '' : await fetchFunc2(fetchParams);
        const subIssueRes = await fetchDetailSubIssue(subIssueId);
        if(subIssueRes !== null){
            createIssueActivity(subIssueRes.issue.id, "Update Sub-Issue", `Updated status of sub-issue ( ${subIssueRes.sub_issues.name} ) of issue `);
        }
    }
}

async function invokeChangeSubPriority(item, fetchFunc, fetchFunc2, fetchParams) {
    const priorityId = item.dataset.value;
    const subIssueId = item.dataset.subissue;
    const res = await updateSubPriority(subIssueId, priorityId);
    if(res.result){
        await fetchFunc();
        fetchParams === null ? '' : await fetchFunc2(fetchParams);
        const subIssueRes = await fetchDetailSubIssue(subIssueId);
        if(subIssueRes !== null){
            createIssueActivity(subIssueRes.issue.id, "Update Sub-Issue", `Updated priority of sub-issue ( ${subIssueRes.sub_issues.name} ) of issue `);
        }
    }
}

async function invokeChangeSubComment(subIssueId, comment, fetchFunc, fetchFunc2, fetchParams) {
    subIssueId = Number(subIssueId);
    const res = await updateSubComment(subIssueId, comment);
    if(res.result){
        await fetchFunc();
        fetchParams === null ? '' : await fetchFunc2(fetchParams);
    }
    return res;
}

async function invokeChangeSubDueDate(subIssueId, due_date, fetchFunc, fetchFunc2, fetchParams) {
    subIssueId = Number(subIssueId);
    const res = await updateSubDueDate(subIssueId, due_date);
    if(res.result){
        await fetchFunc();
        fetchParams === null ? '' : await fetchFunc2(fetchParams);
    }
}

async function invokeChangeSubStartDate(subIssueId, start_date, fetchFunc, fetchFunc2, fetchParams) {
    subIssueId = Number(subIssueId);
    const res = await updateSubStartDate(subIssueId, start_date);
    if(res.result){
        await fetchFunc();
        fetchParams === null ? '' : await fetchFunc2(fetchParams);
    }
}

async function invokeChangeSubProgress(subIssueId, progress, fetchFunc, fetchFunc2, fetchParams) {
    subIssueId = Number(subIssueId);
    const res = await updateSubProgress(subIssueId, progress);
    if(res.result){
        await fetchFunc();
        fetchParams === null ? '' : await fetchFunc2(fetchParams);
    }
    return res;
}

// Edit sub issue
const editSubIssue = async (subIssueId, data) => {
    subIssueId = Number(subIssueId);
    const res = await fetch(`${baseApiUrl}/api/sub/issue/${subIssueId}`,{
        method : 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name : data.name,
            description : data.description,
            progress : data.progress,
            start_date : data.start_date,
            due_date : data.due_date,
            comment : data.comment,
            status_id : data.status_id,
            priority_id : data.priority_id,
            tracker_id : data.tracker_id,
            label_id : data.label_id,
            assignee : data.assignee
        })
    });
    const datas = await res.json();
    return datas;
}