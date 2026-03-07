const deleteIssue = async (issueId) => {
    const res = await fetch(`${baseApiUrl}/api/issue/${issueId}`,{
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    const datas = await res.json();
    if(datas.result){
        return datas;
    } else {
        return null;
    }
}

const deleteSubIssue = async (subIssueId) => {
    const res = await fetch(`${baseApiUrl}/api/sub/issue/${subIssueId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    const datas = await res.json();
    if(datas.result){
        return datas;
    } else {
        return null;
    }
}

const deleteIssueNote = async (noteId) => {
    const res = await fetch(`${baseApiUrl}/api/issue/note/${noteId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    const datas = await res.json();
    if(datas.result){
        return datas;
    } else {
        return null;
    }
}