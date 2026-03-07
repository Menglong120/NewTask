
// var baseApiUrl = `https://kot.work.gd`;

var baseApiUrl = `http://localhost:3030`;

function getProjectID() {
    projectAllID = localStorage.getItem('projectID');
    if(projectAllID === null){
      window.location.href = '/pages/home';
        return;
    }
    return projectAllID
}
