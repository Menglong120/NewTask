
const fetchDetailCategory = async function(cateId) {
    const res = await fetch(`${baseApiUrl}/api/category/${cateId}`, {
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

const fetchAllCategory = async function(projectId){
    const res = await fetch(`${baseApiUrl}/api/categories/${projectId}`,{
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

const createSideCategory = async function(projectId, value) {
    const res = await fetch(`${baseApiUrl}/api/category/${projectId}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            name: value,
            description: ''
        })
    });
    const datas = await res.json();
    if(datas.result){
        return datas;
    } else {
        return null;
    }
}