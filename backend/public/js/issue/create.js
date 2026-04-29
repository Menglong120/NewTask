const createIssueNote = async function (issueId, note){
    const res = await fetch(`${baseApiUrl}/api/issue/note/${issueId}`,{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            notes : note
        }),
    });
    const datas = await res.json();
    return datas;
}

const createIssue = async function (projectId, data){
    const res = await fetch(`${baseApiUrl}/api/projects/issue/${projectId}`,{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name : data.name,
            description: data.description,
            start_date: data.start_date,
            due_date: data.due_date,
            status_id: data.status_id,
            priority_id: data.priority_id,
            tracker_id: data.tracker_id,
            label_id: data.label_id,
            assignee: data.assignee
        }),
    });
    const datas = await res.json();
    return datas;
}

const createSubIssue = async function (issueId, data) {
    const res = await fetch(`${baseApiUrl}/api/sub/issue/${issueId}`,{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name : data.name,
            description: data.description,
            progress: data.progress,
            start_date: data.start_date,
            due_date: data.due_date,
            comment: data.comment,
            status_id: data.status_id,
            priority_id: data.priority_id,
            tracker_id: data.tracker_id,
            label_id: data.label_id,
            assignee: data.assignee
        }),
    });
    const datas = await res.json();
    return datas;
}

const createIssueActivity = async function (issueId, title, activity) {
    const res = await fetch(`${baseApiUrl}/api/issue/activity/${issueId}`,{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: title,
            activity: activity
        })
    });
    const datas = await res.json();
    if(datas.result){
        return datas;
    } else {
        return null;
    }
}