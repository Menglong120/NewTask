async function createActivity(activityTitle,activityDescript) {
    const projectAllID = getProjectID();
      try{
          const response = await fetch(`${baseApiUrl}/api/projects/activity/${projectAllID}`,{
              method : 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  title : activityTitle,
                  activity : activityDescript
                })
          })
          const data = await response.json();
          
      }catch (error) {
         return
        }
  }