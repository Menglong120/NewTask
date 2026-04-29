
const fetchAllIssues = async function (projectId, search, page, perpage){
    const res = await fetch(`${baseApiUrl}/api/projects/issues/${projectId}?search=${search}&page=${page}&perpage=${perpage}`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    const datas = await res.json();
    if(datas.result){
        return datas.data.issues;
    } else {
        return null;
    }
}

const fetchDetailProject = async function (projectId){
    const res = await fetch(`${baseApiUrl}/api/project/${projectId}`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    const datas = await res.json();
    if(datas.result){
        return datas.data;
    } else {
        return null;
    }
}

const fetchDetailIssue = async function (issueId) {
    const res = await fetch(`${baseApiUrl}/api/issue/${issueId}`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    const datas = await res.json();
    if(datas.result){
        return datas.data;
    } else {
        return null;
    }
}

const fetchAllIssueStatus = async function (projectId) {
    const res = await fetch(`${baseApiUrl}/api/projects/issue/statuses/${projectId}`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    const datas = await res.json();
    if(datas.result){
        return datas.data.statuses;
    } else {
        return [];
    }
}

const fetchAllPriority = async function (projectId) {
    const res = await fetch(`${baseApiUrl}/api/projects/issue/priorities/${projectId}`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    const datas = await res.json();
    if(datas.result){
        return datas.data.priorities;
    } else {
        return [];
    }
}

const fetchAllTracker = async function (projectId) {
    const res = await fetch(`${baseApiUrl}/api/projects/issue/trackers/${projectId}`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    const datas = await res.json();
    if(datas.result){
        return datas.data.trackers;
    } else {
        return [];
    }
}

const fetchAllLabel = async function (projectId) {
    const res = await fetch(`${baseApiUrl}/api/projects/issue/labels/${projectId}`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    const datas = await res.json();
    if(datas.result){
        return datas.data.labels;
    } else {
        return [];
    }
}

const fetchAllMember = async function (projectId, search, page, perpage) {
    const res = await fetch(`${baseApiUrl}/api/projects/members/${projectId}?search=${search}&page=${page}&perpage=${perpage}`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    const resMember = await res.json();
    if(resMember.result){
        return resMember.data;
    } else {
        return null;
    }
}

const fetchIssueNotes = async function (issueId) {
    const res = await fetch(`${baseApiUrl}/api/issue/notes/${issueId}`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    const datas = await res.json();
    if(datas.result){
        return datas.data;
    } else {
        return [];
    }
}

const fetchIssueNoteDetails = async function (noteId) {
    const res = await fetch(`${baseApiUrl}/api/issue/note/${noteId}`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    const datas = await res.json();
    if(datas.result){
        return datas.data;
    } else {
        return null;
    }
}

const fetchSubIssue = async function (issueId, search, page, perpage) {
    const res = await fetch(`${baseApiUrl}/api/sub/issues/${issueId}?search=${search}&page=${page}&perpage=${perpage}`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    if(res){
        const datas = await res.json();
        if(datas.result){
            return datas.data.sub_issues;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

const fetchDetailSubIssue = async function (subIssueId){
    const res = await fetch(`${baseApiUrl}/api/sub/issue/${subIssueId}`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    if(res){
        const datas = await res.json();
        if(datas.result){
            return datas.data;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

const fetchAllIssueActivity = async function (issueId){
    const res = await fetch(`${baseApiUrl}/api/issue/activities/${issueId}`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    if(res){
        const datas = await res.json();
        if(datas.result){
            return datas.data;
        } else {
            return [];
        }
    } else {
        return [];
    }
}

// category support has been removed from issue flows.
