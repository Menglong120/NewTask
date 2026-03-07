let idstatus = "";
let statustest = /^.{2,255}$/;

//issue

async function getallStautsIssue() {
 let projectAllID = getProjectID();
    
  try {
    const response = await fetch(
      `${baseApiUrl}/api/projects/issue/statuses/${projectAllID}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    const disableUser = await setDisble();

    let showstatusissue = document.getElementById("showstatusissue");
    showstatusissue.innerHTML = "";

    if (!data.data || !data.data.statuses || data.data.statuses.length === 0) {
      showstatusissue.innerHTML = `
        <div class="m-auto w-100 text-center pb-2"> <svg fill="#808080" width="150px" height="150px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#a6a6a6" stroke-width="0.00032" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#f2f2f2" stroke-width="0.064"></g><g id="SVGRepo_iconCarrier"> <title>box-open-heart</title> <path d="M29.742 12.89c-0.002-0.012-0.010-0.022-0.012-0.034-0.014-0.057-0.032-0.106-0.055-0.152l0.002 0.004c-0.067-0.12-0.146-0.224-0.237-0.315l0 0-0.024-0.011c-0.077-0.040-0.169-0.078-0.264-0.11l-0.014-0.004-0.024-0.009-8-1.23c-0.035-0.006-0.075-0.009-0.116-0.009-0.414 0-0.75 0.336-0.75 0.75 0 0.375 0.275 0.686 0.635 0.741l0.004 0.001 3.464 0.533-8.351 1.446-8.35-1.446 3.464-0.533c0.366-0.054 0.643-0.366 0.643-0.742 0-0.414-0.336-0.75-0.75-0.75-0.043 0-0.085 0.004-0.126 0.011l0.004-0.001-8.028 1.241c-0.052 0.014-0.096 0.030-0.139 0.051l0.004-0.002c-0.053 0.018-0.099 0.040-0.143 0.066l0.003-0.002-0.023 0.011c-0.025 0.023-0.047 0.048-0.068 0.074l-0.001 0.001c-0.041 0.036-0.078 0.075-0.11 0.118l-0.001 0.002c-0.020 0.034-0.039 0.074-0.055 0.115l-0.002 0.005c-0.021 0.042-0.039 0.090-0.052 0.141l-0.001 0.005c-0.003 0.013-0.011 0.023-0.013 0.036l-1 6.751c-0.005 0.032-0.008 0.070-0.008 0.108 0 0.361 0.255 0.663 0.595 0.735l0.005 0.001 1.438 0.294c-0.019 0.054-0.033 0.117-0.037 0.182l-0 0.002v7.531c0 0 0 0.001 0 0.001 0 0.381 0.284 0.696 0.653 0.743l0.004 0 11.871 1.467c0.066 0.025 0.142 0.041 0.221 0.045l0.002 0c0.019 0 0.035-0.010 0.054-0.011l0.040 0.005 12-1.506c0.372-0.048 0.656-0.362 0.656-0.743 0-0 0-0.001 0-0.001v0-7.531c-0.005-0.067-0.018-0.13-0.039-0.19l0.002 0.005 1.438-0.294c0.345-0.072 0.6-0.373 0.6-0.734 0-0.039-0.003-0.076-0.009-0.113l0.001 0.004zM3.629 13.87l11.295 1.955-2.364 5.319-9.714-1.986zM4.75 21.078l8.1 1.657c0.045 0.010 0.097 0.015 0.149 0.015 0.304 0 0.566-0.18 0.685-0.44l0.002-0.005 1.564-3.52v10.366l-10.5-1.318zM27.25 27.834l-10.5 1.338v-10.388l1.564 3.52c0.12 0.264 0.382 0.445 0.686 0.445h0c0.054-0 0.105-0.006 0.156-0.017l-0.005 0.001 8.1-1.657zM19.441 21.145l-2.365-5.319 11.295-1.955 0.783 5.288zM15.385 10.802c0.138 0.153 0.336 0.248 0.557 0.248s0.419-0.095 0.556-0.247l0.001-0.001 3.6-3.991c0.723-0.658 1.174-1.602 1.174-2.652 0-0.29-0.034-0.572-0.099-0.841l0.005 0.024c-0.308-1.115-1.169-1.975-2.26-2.278l-0.023-0.005c-0.249-0.065-0.535-0.102-0.83-0.102-0.807 0-1.549 0.28-2.135 0.747l0.007-0.005c-0.528-0.393-1.194-0.629-1.915-0.629-0.911 0-1.734 0.378-2.321 0.985l-0.001 0.001c-0.611 0.592-0.991 1.42-0.991 2.337 0 0.952 0.409 1.808 1.061 2.403l0.003 0.002zM12.761 3.115c0.309-0.319 0.735-0.523 1.208-0.546l0.004-0 0.052-0.001c0.551 0.021 1.041 0.265 1.385 0.644l0.001 0.002c0.138 0.131 0.325 0.211 0.53 0.211s0.392-0.080 0.531-0.211l-0 0c0.386-0.46 0.961-0.751 1.604-0.751 0.152 0 0.301 0.016 0.444 0.047l-0.014-0.002c0.597 0.165 1.058 0.626 1.22 1.21l0.003 0.012c0.027 0.127 0.043 0.274 0.043 0.424 0 0.645-0.29 1.222-0.747 1.608l-0.003 0.003-3.080 3.415-3.082-3.415c-0.393-0.356-0.641-0.868-0.645-1.437v-0.001c0.023-0.477 0.227-0.902 0.545-1.211l0-0z"></path> </g></svg></div>
        <p class="text-center fw-bold" style="color:#808080 ;">No Data</p>
        `;
      return;
    }

    // const disableDelete = data.data.statuses.length === 1 ? "disabled" : "";
    // const disaleUserBtn = disableUser.data[0].role.id == 3 ? "disabled" : "";
    // let disableDelete = '';
    // if(data.data.statuses.length === 1){
    //   disableDelete = "disabled";
    // } else if(disableUser.data[0].role.id == 3){
    //   disableDelete = "disabled";
    // } else {
    //   disableDelete = "";
    // }

    const disableDelete = getDeleteStatus(data.data.statuses, disableUser.data[0].role.id);

    data.data.statuses.forEach((ele) => {
      showstatusissue.innerHTML += `
            <div class="status_defaul d-flex justify-content-between mb-3">
                <div>
                    <p class="m-0 p-2">${ele.name}</p>
                </div>
                <div class="d-flex py-1 pe-2 ">
                    <button type="button" class="btn btn-primary btn-sm me-2" data-id='${ele.id}' data-name='${ele.name}' onclick="updatestatusissue(this)" data-bs-toggle="modal" data-bs-target="#editStatusissue" >
                       <i class='bx bxs-edit'></i>
                    </button>
                    <!-- Button trigger modal -->
                    <button class="btn btn-danger btn-sm" type="button" data-id='${ele.id}' onclick="deletestatusissue(this)" data-bs-toggle="modal" data-bs-target="#exampleModal222"  ${disableDelete}>
                        <i class='bx bxs-trash '></i></i>
                    </button>
                    </div>
                   </div>`;
    });
  } catch (error) {
    return
  }
}
getallStautsIssue();


async function createstautsissue() {
  startLoading('btn-add-status-issue',  'btn-add-status-issue-text', 'btn-add-status-issue-spinner');
  const loadingObj = {
    btn : 'btn-add-status-issue',
    btnText : 'btn-add-status-issue-text',
    btnSpinner : 'btn-add-status-issue-spinner',
    text : 'Add Status'
  }
 let projectAllID = getProjectID();
  createItem(
    `${baseApiUrl}/api/projects/issue/status/${projectAllID}`,
    "#inputStautsissue",
    "invalid-statusissue",
    "Create status issue Successfully",
    statustest,
    "addStatusIssue",
    getallStautsIssue,
    loadingObj,
    'project',
    'have added a new status issue to'

  );
}

let idstatusIssue = "";
async function updatestatusissue(button) {
  idstatusIssue = button.dataset.id;
  document.getElementById("editstatusissue").value = button.dataset.name;
}

async function updatestatusissues() {
  startLoading('btn-update-status-issue',  'btn-update-status-issue-text', 'btn-update-status-issue-spinner');
  const loadingObj = {
    btn : 'btn-update-status-issue',
    btnText : 'btn-update-status-issue-text',
    btnSpinner : 'btn-update-status-issue-spinner',
    text : 'Update'
  }
  updateItem(
    `${baseApiUrl}/api/issue/status/${idstatusIssue}`,
    "#editstatusissue",
    "invalid-statuseditissue",
    "Update status issue Successully",
    statustest,
    "editStatusissue",
    getallStautsIssue,
    loadingObj,
    "project",
    "have edit a issue on"
  );
}

function deletestatusissue(button) {
  deleteItem(button, `${baseApiUrl}/api/issue/status`, getallStautsIssue,"project"," have deleted the issue on");
}

async function getallPrority() {
 let projectAllID = getProjectID();
    
  try {
    const response = await fetch(
      `${baseApiUrl}/api/projects/issue/priorities/${projectAllID}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    const disableUser = await setDisble();

    let showprority = document.getElementById("showPrority");
    showprority.innerHTML = "";

    if (
      !data.data ||
      !data.data.priorities ||
      data.data.priorities.length === 0
    ) {
      showprority.innerHTML = `
        <div class="m-auto w-100 text-center pb-2"> <svg fill="#808080" width="150px" height="150px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#a6a6a6" stroke-width="0.00032" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#f2f2f2" stroke-width="0.064"></g><g id="SVGRepo_iconCarrier"> <title>box-open-heart</title> <path d="M29.742 12.89c-0.002-0.012-0.010-0.022-0.012-0.034-0.014-0.057-0.032-0.106-0.055-0.152l0.002 0.004c-0.067-0.12-0.146-0.224-0.237-0.315l0 0-0.024-0.011c-0.077-0.040-0.169-0.078-0.264-0.11l-0.014-0.004-0.024-0.009-8-1.23c-0.035-0.006-0.075-0.009-0.116-0.009-0.414 0-0.75 0.336-0.75 0.75 0 0.375 0.275 0.686 0.635 0.741l0.004 0.001 3.464 0.533-8.351 1.446-8.35-1.446 3.464-0.533c0.366-0.054 0.643-0.366 0.643-0.742 0-0.414-0.336-0.75-0.75-0.75-0.043 0-0.085 0.004-0.126 0.011l0.004-0.001-8.028 1.241c-0.052 0.014-0.096 0.030-0.139 0.051l0.004-0.002c-0.053 0.018-0.099 0.040-0.143 0.066l0.003-0.002-0.023 0.011c-0.025 0.023-0.047 0.048-0.068 0.074l-0.001 0.001c-0.041 0.036-0.078 0.075-0.11 0.118l-0.001 0.002c-0.020 0.034-0.039 0.074-0.055 0.115l-0.002 0.005c-0.021 0.042-0.039 0.090-0.052 0.141l-0.001 0.005c-0.003 0.013-0.011 0.023-0.013 0.036l-1 6.751c-0.005 0.032-0.008 0.070-0.008 0.108 0 0.361 0.255 0.663 0.595 0.735l0.005 0.001 1.438 0.294c-0.019 0.054-0.033 0.117-0.037 0.182l-0 0.002v7.531c0 0 0 0.001 0 0.001 0 0.381 0.284 0.696 0.653 0.743l0.004 0 11.871 1.467c0.066 0.025 0.142 0.041 0.221 0.045l0.002 0c0.019 0 0.035-0.010 0.054-0.011l0.040 0.005 12-1.506c0.372-0.048 0.656-0.362 0.656-0.743 0-0 0-0.001 0-0.001v0-7.531c-0.005-0.067-0.018-0.13-0.039-0.19l0.002 0.005 1.438-0.294c0.345-0.072 0.6-0.373 0.6-0.734 0-0.039-0.003-0.076-0.009-0.113l0.001 0.004zM3.629 13.87l11.295 1.955-2.364 5.319-9.714-1.986zM4.75 21.078l8.1 1.657c0.045 0.010 0.097 0.015 0.149 0.015 0.304 0 0.566-0.18 0.685-0.44l0.002-0.005 1.564-3.52v10.366l-10.5-1.318zM27.25 27.834l-10.5 1.338v-10.388l1.564 3.52c0.12 0.264 0.382 0.445 0.686 0.445h0c0.054-0 0.105-0.006 0.156-0.017l-0.005 0.001 8.1-1.657zM19.441 21.145l-2.365-5.319 11.295-1.955 0.783 5.288zM15.385 10.802c0.138 0.153 0.336 0.248 0.557 0.248s0.419-0.095 0.556-0.247l0.001-0.001 3.6-3.991c0.723-0.658 1.174-1.602 1.174-2.652 0-0.29-0.034-0.572-0.099-0.841l0.005 0.024c-0.308-1.115-1.169-1.975-2.26-2.278l-0.023-0.005c-0.249-0.065-0.535-0.102-0.83-0.102-0.807 0-1.549 0.28-2.135 0.747l0.007-0.005c-0.528-0.393-1.194-0.629-1.915-0.629-0.911 0-1.734 0.378-2.321 0.985l-0.001 0.001c-0.611 0.592-0.991 1.42-0.991 2.337 0 0.952 0.409 1.808 1.061 2.403l0.003 0.002zM12.761 3.115c0.309-0.319 0.735-0.523 1.208-0.546l0.004-0 0.052-0.001c0.551 0.021 1.041 0.265 1.385 0.644l0.001 0.002c0.138 0.131 0.325 0.211 0.53 0.211s0.392-0.080 0.531-0.211l-0 0c0.386-0.46 0.961-0.751 1.604-0.751 0.152 0 0.301 0.016 0.444 0.047l-0.014-0.002c0.597 0.165 1.058 0.626 1.22 1.21l0.003 0.012c0.027 0.127 0.043 0.274 0.043 0.424 0 0.645-0.29 1.222-0.747 1.608l-0.003 0.003-3.080 3.415-3.082-3.415c-0.393-0.356-0.641-0.868-0.645-1.437v-0.001c0.023-0.477 0.227-0.902 0.545-1.211l0-0z"></path> </g></svg></div>
        <p class="text-center fw-bold" style="color:#808080 ;">No Data</p>
        `;
      return;
    }

    // const disableDelete = data.data.priorities.length === 1 ? "disabled" : "";
    // const disaleUserBtn = disableUser.data[0].role.id == 3 ? "disabled" : "";
    // const prioritiesCount = data.data.priorities.length;
    // let disableDelete = '';
    // if(data.data.priorities.length === 1){
    //   disableDelete = "disabled";
    // } else if(disableUser.data[0].role.id == 3){
    //   disableDelete = "disabled";
    // } else if (disableUser.data[0].role.id === 2 || prioritiesCount <= 3) {
    //      disableDelete = "disabled";
    // }
    // else {
    //   disableDelete = "";
    // }

    const disableDelete = getDeleteStatus(data.data.priorities, disableUser.data[0].role.id);


    data.data.priorities.forEach((ele) => {
      showprority.innerHTML += `
            <div class="status_defaul d-flex justify-content-between mb-3">
                <div>
                    <p class="m-0 p-2">${ele.name}</p>
                </div>
                <div class="d-flex py-1 pe-2">
                    <button type="button" class="btn btn-primary btn-sm me-2" data-id='${ele.id}' data-name='${ele.name}' onclick="updatePrority(this)" data-bs-toggle="modal" data-bs-target="#editPrority" >
                       <i class='bx bxs-edit'></i>
                    </button>
                    <!-- Button trigger modal -->
                    <button class="btn btn-danger btn-sm" type="button" data-id='${ele.id}' onclick="deletePrority(this)" data-bs-toggle="modal" data-bs-target="#exampleModal222"  ${disableDelete}>
                        <i class='bx bxs-trash'></i></i>
                    </button>
                    </div>
                   </div>`;
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
getallPrority();

async function createprority() {
  startLoading('btn-add-priority-issue', 'btn-update-label-issue-text', 'btn-add-priority-issue-spinner');
  const loadingObj = {
    btn : 'btn-add-priority-issue',
    btnText : 'btn-add-priority-issue-text',
    btnSpinner : 'btn-add-priority-issue-spinner',
    text : 'Add Priority'
  }
 let projectAllID = getProjectID();
  createItem(
    `${baseApiUrl}/api/projects/issue/priority/${projectAllID}`,
    "#inputprority",
    "invalid-prority",
    "Create prority Successfully",
    statustest,
    "addprority",
    getallPrority,
    loadingObj,
    "project",
    "have added a new prority to"
  );
}

let idPrority = "";
async function updatePrority(button) {
  idPrority = button.dataset.id;
  document.getElementById("editprority").value = button.dataset.name;
}

async function updateProritys() {
  startLoading('btn-update-priority-issue', 'btn-update-priority-issue-text', 'btn-update-priority-issue-spinner');
  const loadingObj = {
    btn : 'btn-update-priority-issue',
    btnText : 'btn-update-priority-issue-text',
    btnSpinner : 'btn-update-priority-issue-spinner',
    text : 'Update'
  }
  updateItem(
    `${baseApiUrl}/api/priority/${idPrority}`,
    "#editprority",
    "invalid-editprority",
    "Update prority Successully",
    statustest,
    "editPrority",
    getallPrority,
    loadingObj,
    "project",
    "have edit a prority on"
  );
}


function deletePrority(button) {
  deleteItem(button, `${baseApiUrl}/api/priority`, getallPrority,"project"," have deleted the prority on");
}

// label

async function getallLabel() {
 let projectAllID = getProjectID();
    
  try {
    const response = await fetch(
      `${baseApiUrl}/api/projects/issue/labels/${projectAllID}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const disableUser = await setDisble();

    const data = await response.json();
    let showLabel = document.getElementById("showLabel");
    showLabel.innerHTML = "";

    if (!data.data || !data.data.labels || data.data.labels.length === 0) {
      showLabel.innerHTML = `
        <div class="m-auto w-100 text-center pb-2"> <svg fill="#808080" width="150px" height="150px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#a6a6a6" stroke-width="0.00032" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#f2f2f2" stroke-width="0.064"></g><g id="SVGRepo_iconCarrier"> <title>box-open-heart</title> <path d="M29.742 12.89c-0.002-0.012-0.010-0.022-0.012-0.034-0.014-0.057-0.032-0.106-0.055-0.152l0.002 0.004c-0.067-0.12-0.146-0.224-0.237-0.315l0 0-0.024-0.011c-0.077-0.040-0.169-0.078-0.264-0.11l-0.014-0.004-0.024-0.009-8-1.23c-0.035-0.006-0.075-0.009-0.116-0.009-0.414 0-0.75 0.336-0.75 0.75 0 0.375 0.275 0.686 0.635 0.741l0.004 0.001 3.464 0.533-8.351 1.446-8.35-1.446 3.464-0.533c0.366-0.054 0.643-0.366 0.643-0.742 0-0.414-0.336-0.75-0.75-0.75-0.043 0-0.085 0.004-0.126 0.011l0.004-0.001-8.028 1.241c-0.052 0.014-0.096 0.030-0.139 0.051l0.004-0.002c-0.053 0.018-0.099 0.040-0.143 0.066l0.003-0.002-0.023 0.011c-0.025 0.023-0.047 0.048-0.068 0.074l-0.001 0.001c-0.041 0.036-0.078 0.075-0.11 0.118l-0.001 0.002c-0.020 0.034-0.039 0.074-0.055 0.115l-0.002 0.005c-0.021 0.042-0.039 0.090-0.052 0.141l-0.001 0.005c-0.003 0.013-0.011 0.023-0.013 0.036l-1 6.751c-0.005 0.032-0.008 0.070-0.008 0.108 0 0.361 0.255 0.663 0.595 0.735l0.005 0.001 1.438 0.294c-0.019 0.054-0.033 0.117-0.037 0.182l-0 0.002v7.531c0 0 0 0.001 0 0.001 0 0.381 0.284 0.696 0.653 0.743l0.004 0 11.871 1.467c0.066 0.025 0.142 0.041 0.221 0.045l0.002 0c0.019 0 0.035-0.010 0.054-0.011l0.040 0.005 12-1.506c0.372-0.048 0.656-0.362 0.656-0.743 0-0 0-0.001 0-0.001v0-7.531c-0.005-0.067-0.018-0.13-0.039-0.19l0.002 0.005 1.438-0.294c0.345-0.072 0.6-0.373 0.6-0.734 0-0.039-0.003-0.076-0.009-0.113l0.001 0.004zM3.629 13.87l11.295 1.955-2.364 5.319-9.714-1.986zM4.75 21.078l8.1 1.657c0.045 0.010 0.097 0.015 0.149 0.015 0.304 0 0.566-0.18 0.685-0.44l0.002-0.005 1.564-3.52v10.366l-10.5-1.318zM27.25 27.834l-10.5 1.338v-10.388l1.564 3.52c0.12 0.264 0.382 0.445 0.686 0.445h0c0.054-0 0.105-0.006 0.156-0.017l-0.005 0.001 8.1-1.657zM19.441 21.145l-2.365-5.319 11.295-1.955 0.783 5.288zM15.385 10.802c0.138 0.153 0.336 0.248 0.557 0.248s0.419-0.095 0.556-0.247l0.001-0.001 3.6-3.991c0.723-0.658 1.174-1.602 1.174-2.652 0-0.29-0.034-0.572-0.099-0.841l0.005 0.024c-0.308-1.115-1.169-1.975-2.26-2.278l-0.023-0.005c-0.249-0.065-0.535-0.102-0.83-0.102-0.807 0-1.549 0.28-2.135 0.747l0.007-0.005c-0.528-0.393-1.194-0.629-1.915-0.629-0.911 0-1.734 0.378-2.321 0.985l-0.001 0.001c-0.611 0.592-0.991 1.42-0.991 2.337 0 0.952 0.409 1.808 1.061 2.403l0.003 0.002zM12.761 3.115c0.309-0.319 0.735-0.523 1.208-0.546l0.004-0 0.052-0.001c0.551 0.021 1.041 0.265 1.385 0.644l0.001 0.002c0.138 0.131 0.325 0.211 0.53 0.211s0.392-0.080 0.531-0.211l-0 0c0.386-0.46 0.961-0.751 1.604-0.751 0.152 0 0.301 0.016 0.444 0.047l-0.014-0.002c0.597 0.165 1.058 0.626 1.22 1.21l0.003 0.012c0.027 0.127 0.043 0.274 0.043 0.424 0 0.645-0.29 1.222-0.747 1.608l-0.003 0.003-3.080 3.415-3.082-3.415c-0.393-0.356-0.641-0.868-0.645-1.437v-0.001c0.023-0.477 0.227-0.902 0.545-1.211l0-0z"></path> </g></svg></div>
        <p class="text-center fw-bold" style="color:#808080 ;">No Data</p>
        `;
      return;
    }

    // const disableDelete = data.data.labels.length === 1 ? "disabled" : "";
    // const disaleUserBtn = disableUser.data[0].role.id == 3 ? "disabled" : "";
    // let disableDelete = '';
    // if(data.data.labels.length === 1){
    //   disableDelete = "disabled";
    // } else if(disableUser.data[0].role.id == 3){
    //   disableDelete = "disabled";
    // } else {
    //   disableDelete = "";
    // }

     const disableDelete = getDeleteStatus(data.data.labels, disableUser.data[0].role.id);

    data.data.labels.forEach((ele) => {
      showLabel.innerHTML += `
            <div class="status_defaul d-flex justify-content-between mb-3">
                <div>
                    <p class="m-0 p-2">${ele.name}</p>
                </div>
                <div class="d-flex py-1 pe-2">
                    <button type="button" class="btn btn-primary btn-sm me-2" data-id='${ele.id}' data-name='${ele.name}' onclick="updateLabel(this)" data-bs-toggle="modal" data-bs-target="#editLabel-open" >
                       <i class='bx bxs-edit'></i>
                    </button>
                    <!-- Button trigger modal -->
                    <button class="btn btn-danger btn-sm" type="button" data-id='${ele.id}' onclick="deleteLabel(this)" data-bs-toggle="modal" data-bs-target="#exampleModal222"  ${disableDelete}>
                        <i class='bx bxs-trash'></i></i>
                    </button>
                    </div>
                   </div>`;
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
getallLabel();

async function createLabel() {
  startLoading('btn-add-label-issue', 'btn-add-label-issue-text', 'btn-add-label-issue-spinner');
  const loadingObj = {
    btn : 'btn-add-label-issue',
    btnText : 'btn-add-label-issue-text',
    btnSpinner : 'btn-add-label-issue-spinner',
    text : 'Add Label'
  }
 let projectAllID = getProjectID();
  createItem(
    `${baseApiUrl}/api/projects/issue/label/${projectAllID}`,
    "#inputLabel",
    "invalid-Label",
    "Create label Successfully",
    statustest,
    "addLabel-open",
    getallLabel,
    loadingObj,
    'project',
    'have added a new lable to'
  );
}


let idLabel = "";
async function updateLabel(button) {
  idLabel = button.dataset.id;
  document.getElementById("editlabel").value = button.dataset.name;
}

async function updateLabels() {
  startLoading('btn-update-label-issue', 'btn-update-label-issue-text', 'btn-update-label-issue-spinner');
  const loadingObj = {
    btn : 'btn-update-label-issue',
    btnText : 'btn-update-label-issue-text',
    btnSpinner : 'btn-update-label-issue-spinner',
    text : 'Update'
  }
  updateItem(
    `${baseApiUrl}/api/label/${idLabel}`,
    "#editlabel",
    "invalid-editLabel",
    "Update tracker Successully",
    statustest,
    "editLabel-open",
    getallLabel,
    loadingObj,
    "project",
    "have edit a label on"
  );
}

function deleteLabel(button) {
  deleteItem(button, `${baseApiUrl}/api/label`, getallLabel,"project", " have deleted the label on");
}

// tracker

async function getallTracker() {
 let projectAllID = getProjectID();
    
  try {
    const response = await fetch(
      `${baseApiUrl}/api/projects/issue/trackers/${projectAllID}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    const disableUser = await setDisble();

    let showTracker = document.getElementById("showTracker");
    showTracker.innerHTML = "";

    if (!data.data || !data.data.trackers || data.data.trackers.length === 0) {
      showTracker.innerHTML = `
        <div class="m-auto w-100 text-center pb-2"> <svg fill="#808080" width="150px" height="150px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#a6a6a6" stroke-width="0.00032" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#f2f2f2" stroke-width="0.064"></g><g id="SVGRepo_iconCarrier"> <title>box-open-heart</title> <path d="M29.742 12.89c-0.002-0.012-0.010-0.022-0.012-0.034-0.014-0.057-0.032-0.106-0.055-0.152l0.002 0.004c-0.067-0.12-0.146-0.224-0.237-0.315l0 0-0.024-0.011c-0.077-0.040-0.169-0.078-0.264-0.11l-0.014-0.004-0.024-0.009-8-1.23c-0.035-0.006-0.075-0.009-0.116-0.009-0.414 0-0.75 0.336-0.75 0.75 0 0.375 0.275 0.686 0.635 0.741l0.004 0.001 3.464 0.533-8.351 1.446-8.35-1.446 3.464-0.533c0.366-0.054 0.643-0.366 0.643-0.742 0-0.414-0.336-0.75-0.75-0.75-0.043 0-0.085 0.004-0.126 0.011l0.004-0.001-8.028 1.241c-0.052 0.014-0.096 0.030-0.139 0.051l0.004-0.002c-0.053 0.018-0.099 0.040-0.143 0.066l0.003-0.002-0.023 0.011c-0.025 0.023-0.047 0.048-0.068 0.074l-0.001 0.001c-0.041 0.036-0.078 0.075-0.11 0.118l-0.001 0.002c-0.020 0.034-0.039 0.074-0.055 0.115l-0.002 0.005c-0.021 0.042-0.039 0.090-0.052 0.141l-0.001 0.005c-0.003 0.013-0.011 0.023-0.013 0.036l-1 6.751c-0.005 0.032-0.008 0.070-0.008 0.108 0 0.361 0.255 0.663 0.595 0.735l0.005 0.001 1.438 0.294c-0.019 0.054-0.033 0.117-0.037 0.182l-0 0.002v7.531c0 0 0 0.001 0 0.001 0 0.381 0.284 0.696 0.653 0.743l0.004 0 11.871 1.467c0.066 0.025 0.142 0.041 0.221 0.045l0.002 0c0.019 0 0.035-0.010 0.054-0.011l0.040 0.005 12-1.506c0.372-0.048 0.656-0.362 0.656-0.743 0-0 0-0.001 0-0.001v0-7.531c-0.005-0.067-0.018-0.13-0.039-0.19l0.002 0.005 1.438-0.294c0.345-0.072 0.6-0.373 0.6-0.734 0-0.039-0.003-0.076-0.009-0.113l0.001 0.004zM3.629 13.87l11.295 1.955-2.364 5.319-9.714-1.986zM4.75 21.078l8.1 1.657c0.045 0.010 0.097 0.015 0.149 0.015 0.304 0 0.566-0.18 0.685-0.44l0.002-0.005 1.564-3.52v10.366l-10.5-1.318zM27.25 27.834l-10.5 1.338v-10.388l1.564 3.52c0.12 0.264 0.382 0.445 0.686 0.445h0c0.054-0 0.105-0.006 0.156-0.017l-0.005 0.001 8.1-1.657zM19.441 21.145l-2.365-5.319 11.295-1.955 0.783 5.288zM15.385 10.802c0.138 0.153 0.336 0.248 0.557 0.248s0.419-0.095 0.556-0.247l0.001-0.001 3.6-3.991c0.723-0.658 1.174-1.602 1.174-2.652 0-0.29-0.034-0.572-0.099-0.841l0.005 0.024c-0.308-1.115-1.169-1.975-2.26-2.278l-0.023-0.005c-0.249-0.065-0.535-0.102-0.83-0.102-0.807 0-1.549 0.28-2.135 0.747l0.007-0.005c-0.528-0.393-1.194-0.629-1.915-0.629-0.911 0-1.734 0.378-2.321 0.985l-0.001 0.001c-0.611 0.592-0.991 1.42-0.991 2.337 0 0.952 0.409 1.808 1.061 2.403l0.003 0.002zM12.761 3.115c0.309-0.319 0.735-0.523 1.208-0.546l0.004-0 0.052-0.001c0.551 0.021 1.041 0.265 1.385 0.644l0.001 0.002c0.138 0.131 0.325 0.211 0.53 0.211s0.392-0.080 0.531-0.211l-0 0c0.386-0.46 0.961-0.751 1.604-0.751 0.152 0 0.301 0.016 0.444 0.047l-0.014-0.002c0.597 0.165 1.058 0.626 1.22 1.21l0.003 0.012c0.027 0.127 0.043 0.274 0.043 0.424 0 0.645-0.29 1.222-0.747 1.608l-0.003 0.003-3.080 3.415-3.082-3.415c-0.393-0.356-0.641-0.868-0.645-1.437v-0.001c0.023-0.477 0.227-0.902 0.545-1.211l0-0z"></path> </g></svg></div>
        <p class="text-center fw-bold" style="color:#808080 ;">No Data</p>
        `;
      return;
    }

    // const disableDelete = data.data.trackers.length === 1 ? "disabled" : "";
    // const disaleUserBtn = disableUser.data[0].role.id == 3 ? "disabled" : "";
    // let disableDelete = '';
    // if(data.data.trackers.length === 1){
    //   disableDelete = "disabled";
    // } else if(disableUser.data[0].role.id == 3){
    //   disableDelete = "disabled";
    // } else {
    //   disableDelete = "";
    // }

    const disableDelete = getDeleteStatus(data.data.trackers, disableUser.data[0].role.id);

    data.data.trackers.forEach((ele) => {
      showTracker.innerHTML += `
            <div class="status_defaul d-flex justify-content-between mb-3">
                <div>
                    <p class="m-0 p-2">${ele.name}</p>
                </div>
                <div class="d-flex py-1 pe-2">
                    <button type="button" class="btn btn-primary btn-sm me-2" data-id='${ele.id}' data-name='${ele.name}' onclick="updateTracker(this)" data-bs-toggle="modal" data-bs-target="#editTracker-open" >
                       <i class='bx bxs-edit'></i>
                    </button>
                    <!-- Button trigger modal -->
                    <button class="btn btn-danger btn-sm" type="button" data-id='${ele.id}' onclick="deleteTracker(this)" data-bs-toggle="modal" data-bs-target="#exampleModal222"  ${disableDelete}>
                        <i class='bx bxs-trash'></i></i>
                    </button>
                    </div>
                   </div>`;
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
getallTracker();


async function createTracker() {
  startLoading('btn-add-tracker-issue', 'btn-add-tracker-issue-text', 'btn-add-tracker-issue-spinner');
  const loadingObj = {
    btn : 'btn-add-tracker-issue',
    btnText : 'btn-add-tracker-issue-text',
    btnSpinner : 'btn-add-tracker-issue-spinner',
    text : 'Add Tracker'
  }
 let projectAllID = getProjectID();
  createItem(
    `${baseApiUrl}/api/projects/issue/tracker/${projectAllID}`,
    "#inputracker",
    "invalid-tracker",
    "Create tracker Successfully",
    statustest,
    "addTracker-open",
    getallTracker,
    loadingObj,
    "project",
     "have added a new tracker to"

  );
}

let idTracker = "";
async function updateTracker(button) {
  idTracker = button.dataset.id;
  document.getElementById("editTracker").value = button.dataset.name;
}
async function updateTrackers() {
  startLoading('btn-update-tracker-issue', 'btn-update-tracker-issue-text', 'btn-update-tracker-issue-spinner');
  const loadingObj = {
    btn : 'btn-update-tracker-issue',
    btnText : 'btn-update-tracker-issue-text',
    btnSpinner : 'btn-update-tracker-issue-spinner',
    text : 'Update'
  }
  updateItem(
    `${baseApiUrl}/api/issue/tracker/${idTracker}`,
    "#editTracker",
    "invalid-edittracker",
    "Update tracker Successully",
    statustest,
    "editTracker-open",
    getallTracker,
    loadingObj,
    "project",
    "have edit a tracker on"
  );
}

function deleteTracker(button) {
  deleteItem(button, `${baseApiUrl}/api/issue/tracker`, getallTracker,"project", " have deleted the tracker on");
}

//category

async function getallCategory() {
 let projectAllID = getProjectID();
    
  try {
    const response = await fetch(
      `${baseApiUrl}/api/categories/${projectAllID}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const disableUser = await setDisble();
    const data = await response.json();

    let showCate = document.getElementById("showTCategory");
    showCate.innerHTML = "";

    if (
      !data.data ||
      !data.data.categories ||
      data.data.categories.length === 0
    ) {
      showCate.innerHTML = `
        <div class="m-auto w-100 text-center pb-2"> <svg fill="#808080" width="150px" height="150px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#a6a6a6" stroke-width="0.00032" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#f2f2f2" stroke-width="0.064"></g><g id="SVGRepo_iconCarrier"> <title>box-open-heart</title> <path d="M29.742 12.89c-0.002-0.012-0.010-0.022-0.012-0.034-0.014-0.057-0.032-0.106-0.055-0.152l0.002 0.004c-0.067-0.12-0.146-0.224-0.237-0.315l0 0-0.024-0.011c-0.077-0.040-0.169-0.078-0.264-0.11l-0.014-0.004-0.024-0.009-8-1.23c-0.035-0.006-0.075-0.009-0.116-0.009-0.414 0-0.75 0.336-0.75 0.75 0 0.375 0.275 0.686 0.635 0.741l0.004 0.001 3.464 0.533-8.351 1.446-8.35-1.446 3.464-0.533c0.366-0.054 0.643-0.366 0.643-0.742 0-0.414-0.336-0.75-0.75-0.75-0.043 0-0.085 0.004-0.126 0.011l0.004-0.001-8.028 1.241c-0.052 0.014-0.096 0.030-0.139 0.051l0.004-0.002c-0.053 0.018-0.099 0.040-0.143 0.066l0.003-0.002-0.023 0.011c-0.025 0.023-0.047 0.048-0.068 0.074l-0.001 0.001c-0.041 0.036-0.078 0.075-0.11 0.118l-0.001 0.002c-0.020 0.034-0.039 0.074-0.055 0.115l-0.002 0.005c-0.021 0.042-0.039 0.090-0.052 0.141l-0.001 0.005c-0.003 0.013-0.011 0.023-0.013 0.036l-1 6.751c-0.005 0.032-0.008 0.070-0.008 0.108 0 0.361 0.255 0.663 0.595 0.735l0.005 0.001 1.438 0.294c-0.019 0.054-0.033 0.117-0.037 0.182l-0 0.002v7.531c0 0 0 0.001 0 0.001 0 0.381 0.284 0.696 0.653 0.743l0.004 0 11.871 1.467c0.066 0.025 0.142 0.041 0.221 0.045l0.002 0c0.019 0 0.035-0.010 0.054-0.011l0.040 0.005 12-1.506c0.372-0.048 0.656-0.362 0.656-0.743 0-0 0-0.001 0-0.001v0-7.531c-0.005-0.067-0.018-0.13-0.039-0.19l0.002 0.005 1.438-0.294c0.345-0.072 0.6-0.373 0.6-0.734 0-0.039-0.003-0.076-0.009-0.113l0.001 0.004zM3.629 13.87l11.295 1.955-2.364 5.319-9.714-1.986zM4.75 21.078l8.1 1.657c0.045 0.010 0.097 0.015 0.149 0.015 0.304 0 0.566-0.18 0.685-0.44l0.002-0.005 1.564-3.52v10.366l-10.5-1.318zM27.25 27.834l-10.5 1.338v-10.388l1.564 3.52c0.12 0.264 0.382 0.445 0.686 0.445h0c0.054-0 0.105-0.006 0.156-0.017l-0.005 0.001 8.1-1.657zM19.441 21.145l-2.365-5.319 11.295-1.955 0.783 5.288zM15.385 10.802c0.138 0.153 0.336 0.248 0.557 0.248s0.419-0.095 0.556-0.247l0.001-0.001 3.6-3.991c0.723-0.658 1.174-1.602 1.174-2.652 0-0.29-0.034-0.572-0.099-0.841l0.005 0.024c-0.308-1.115-1.169-1.975-2.26-2.278l-0.023-0.005c-0.249-0.065-0.535-0.102-0.83-0.102-0.807 0-1.549 0.28-2.135 0.747l0.007-0.005c-0.528-0.393-1.194-0.629-1.915-0.629-0.911 0-1.734 0.378-2.321 0.985l-0.001 0.001c-0.611 0.592-0.991 1.42-0.991 2.337 0 0.952 0.409 1.808 1.061 2.403l0.003 0.002zM12.761 3.115c0.309-0.319 0.735-0.523 1.208-0.546l0.004-0 0.052-0.001c0.551 0.021 1.041 0.265 1.385 0.644l0.001 0.002c0.138 0.131 0.325 0.211 0.53 0.211s0.392-0.080 0.531-0.211l-0 0c0.386-0.46 0.961-0.751 1.604-0.751 0.152 0 0.301 0.016 0.444 0.047l-0.014-0.002c0.597 0.165 1.058 0.626 1.22 1.21l0.003 0.012c0.027 0.127 0.043 0.274 0.043 0.424 0 0.645-0.29 1.222-0.747 1.608l-0.003 0.003-3.080 3.415-3.082-3.415c-0.393-0.356-0.641-0.868-0.645-1.437v-0.001c0.023-0.477 0.227-0.902 0.545-1.211l0-0z"></path> </g></svg></div>
        <p class="text-center fw-bold" style="color:#808080 ;">No Data</p>
        `;
      return;
    }

    // const disableDelete = data.data.categories.length === 1 ? "disabled" : "";
    // const disaleUserBtn = disableUser.data[0].role.id == 3 ? "disabled" : "";
    let disableDelete = '';
    if(data.data.categories.length === 1){
      disableDelete = "disabled";
    } else if(disableUser.data[0].role.id == 3){
      disableDelete = "disabled";
    } else {
      disableDelete = "";
    }

    // const disableDelete = getDeleteStatus(data.data.categories, disableUser.data[0].role.id);

    data.data.categories.forEach((ele) => {
      showCate.innerHTML += `
            <div class="status_defaul d-flex justify-content-between mb-3">
                <div>
                    <p class="m-0 p-2">${ele.name}</p>
                </div>
                <div class="d-flex py-1 pe-2">
                    <button type="button" class="btn btn-primary btn-sm me-2" data-id='${ele.id}' data-name='${ele.name}' onclick="updateCate(this)" data-bs-toggle="modal" data-bs-target="#editCate-open" >
                       <i class='bx bxs-edit'></i>
                    </button>
                    <!-- Button trigger modal -->
                    <button class="btn btn-danger btn-sm" type="button" data-id='${ele.id}' onclick="deleteCate(this)" data-bs-toggle="modal" data-bs-target="#exampleModal222"  ${disableDelete}>
                        <i class='bx bxs-trash'></i></i>
                    </button>
                    </div>
                   </div>`;
    });
  } catch (error) {
    return;
  }
}
getallCategory();


async function createCategory() {
  startLoading('btn-add-category-issue', 'btn-add-category-issue-text', 'btn-add-category-issue-spinner');
  const loadingObj = {
    btn : 'btn-add-category-issue',
    btnText : 'btn-add-category-issue-text',
    btnSpinner : 'btn-add-category-issue-spinner',
    text : 'Add Category'
  }
  const projectID = getProjectID();
  createItem(
    `${baseApiUrl}/api/category/${projectID}`,
    "#inputCate",
    "invalid-Category",
    "Create category Successfully",
    statustest,
    "addCategory-open",
    getallCategory,
    loadingObj,
    "project",
     "have added a new category to"
  );
}

let idCategory = "";
async function updateCate(button) {
  idCategory = button.dataset.id;
  document.getElementById("editCate").value = button.dataset.name;
}
async function updateCates() {
  startLoading('btn-update-category-issue', 'btn-update-category-issue-text', 'btn-update-category-issue-spinner');
  const loadingObj = {
    btn : 'btn-update-category-issue',
    btnText : 'btn-update-category-issue-text',
    btnSpinner : 'btn-update-category-issue-spinner',
    text : 'Update'
  }
  updateItem(
    `${baseApiUrl}/api/category/${idCategory}`,
    "#editCate",
    "invalid-editCate",
    "Update category Successully",
    statustest,
    "editCate-open",
    getallCategory,
    loadingObj,"project", "have edit a category on"
  );
}

function deleteCate(button) {
  deleteItem(button, `${baseApiUrl}/api/category`, getallCategory,"project", " have deleted the category on");
}


document.addEventListener('click', (event) => {
  if (event.target.classList.contains('closebtn')) {
    clearProject();
  }
});

function clearProject() {
  clearData(document.querySelector("#inputStautsissue"),  document.getElementById("invalid-statusissue"));
  clearData(document.querySelector("#editstatusissue"),document.getElementById("invalid-statuseditissue"));
  clearData(document.querySelector("#inputprority"),document.getElementById("invalid-prority"));
  clearData(document.querySelector("#editprority"),document.getElementById("invalid-editprority"))
  clearData(document.querySelector("#inputLabel"),document.getElementById("invalid-Label"));
  clearData(document.querySelector("#editlabel"),document.getElementById("invalid-editLabel"));
  clearData(document.querySelector("#inputracker"),document.getElementById("invalid-tracker"));
  clearData(document.querySelector("#editTracker"),document.getElementById("invalid-edittracker"));
  clearData(document.querySelector("#inputCate"),document.getElementById("invalid-Category"));
  clearData(document.querySelector("#editCate"),document.getElementById("invalid-editCate"))
}