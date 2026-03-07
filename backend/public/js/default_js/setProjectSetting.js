async function setCreateProject(url,title) {
    
    const responseSet = await fetch(url ,{
        method : 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body : JSON.stringify({
            name : title,
            description : " "
        })
    });
    const dataSet = await responseSet.json();
    

}