async function fetchProject(search = "") {
  const res = await fetch(`${baseApiUrl}/api/projects?search=${search}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const apiRes = await res.json();
  if (apiRes.result) {
    return apiRes.data;
  } else {
    return null;
  }
}


const fetchAllProjects = async function(search, page, perpage) {
    const res = await fetch(`${baseApiUrl}/api/projects?search=${search}&page=${page}&perpage=${perpage}`, {
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