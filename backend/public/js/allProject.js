let projectId = "";
function calculateDate(estimateOn) {
  const estDate = new Date(estimateOn);
  const today = new Date();

  estDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = estDate.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}


let currentFilters = {
  search: "",
  status: "",
  progress: "",
  dueDate: ""
};

function initializeFilters() {
  const searchInput = document.getElementById('projectSearchInput');
  const statusFilter = document.getElementById('statusFilter');
  const progressFilter = document.getElementById('progressFilter');
  const dueDateFilter = document.getElementById('dueDateFilter');
  const clearFiltersBtn = document.getElementById('clearFilters');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentFilters.search = e.target.value.trim();
      applyFilters();
    });
  }

  // Select2 works with normal change events — only if initialized FIRST
  if (statusFilter) {
    $(statusFilter).on("change", function () {
      currentFilters.status = this.value;
      applyFilters();
    });
  }

  if (progressFilter) {
    $(progressFilter).on("change", function () {
      currentFilters.progress = this.value;
      applyFilters();
    });
  }

  if (dueDateFilter) {
    $(dueDateFilter).on("change", function () {
      currentFilters.dueDate = this.value;
      applyFilters();
    });
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      currentFilters = { search: "", status: "", progress: "", dueDate: "" };

      if (searchInput) searchInput.value = "";
      $("#statusFilter").val("").trigger("change");
      $("#progressFilter").val("").trigger("change");
      $("#dueDateFilter").val("").trigger("change");

      applyFilters();
    });
  }
}


function applyFilters() {
  getAllproject(currentFilters);
}

function projectSearch() {
  const searchInput = document.querySelector('input[type="search"]');
  
  if (!searchInput) return;
  searchInput.addEventListener('input', (e) => {
    const searchValue = e.target.value.trim();
    
      getAllproject(searchValue);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  projectSearch();
  getAllproject(); 
}); 


async function getAllproject(filters = {}) {
  document.getElementById('showAllproject').innerHTML = `
  
    <div class="col-lg-4 col-md-6 col-12 g-4">
      <div class="card card-project">
          <div class="bg-white rounded-2">
              <div class="row card-header d-flex py-3 justify-content-between align-items-center">
                  <div class="col-8 placeholder-glow">
                    <span class="placeholder py-3 mb-2 col-8 rounded-pill"></span>
                  </div>
                  <div class="col-4 placeholder-glow d-flex justify-content-end">
                    <span class="placeholder mb-2 col-1 rounded-2"></span>
                  </div>
              </div>
              <div class="mx-0 row card-body bg-white pt-1">
                  <div class="col-12 placeholder-glow">
                    <span class="placeholder mb-4 col-5 rounded-2"></span>
                  </div>
                  <div class="col-12 placeholder-glow">
                    <span class="placeholder mb-4 col-12 rounded-2"></span>
                  </div>
                  <div class="col-12 placeholder-glow">
                    <span class="placeholder col-12 rounded-2"></span>
                  </div>
              </div>
              <div class="mx-0 row card-footer bg-white border-0 pt-0 d-flex justify-content-between align-items-center">
                  <div class="col-6 placeholder-glow">
                    <span class="placeholder mb-2 col-5 rounded-circle" style="width: 30px; height: 30px;"></span>
                  </div>
                  <div class="col-6 d-flex justify-content-end placeholder-glow">
                    <span class="placeholder mb-2 col-8 rounded-2"></span>
                  </div>
              </div>
          </div>
      </div>
    </div>

    <div class="col-lg-4 col-md-6 col-12 g-4">
      <div class="card card-project">
          <div class="bg-white rounded-2">
              <div class="row card-header d-flex py-3 justify-content-between align-items-center">
                  <div class="col-8 placeholder-glow">
                    <span class="placeholder py-3 mb-2 col-8 rounded-pill"></span>
                  </div>
                  <div class="col-4 placeholder-glow d-flex justify-content-end">
                    <span class="placeholder mb-2 col-1 rounded-2"></span>
                  </div>
              </div>
              <div class="mx-0 row card-body bg-white pt-1">
                  <div class="col-12 placeholder-glow">
                    <span class="placeholder mb-4 col-5 rounded-2"></span>
                  </div>
                  <div class="col-12 placeholder-glow">
                    <span class="placeholder mb-4 col-12 rounded-2"></span>
                  </div>
                  <div class="col-12 placeholder-glow">
                    <span class="placeholder col-12 rounded-2"></span>
                  </div>
              </div>
              <div class="mx-0 row card-footer bg-white border-0 pt-0 d-flex justify-content-between align-items-center">
                  <div class="col-6 placeholder-glow">
                    <span class="placeholder mb-2 col-5 rounded-circle" style="width: 30px; height: 30px;"></span>
                  </div>
                  <div class="col-6 d-flex justify-content-end placeholder-glow">
                    <span class="placeholder mb-2 col-8 rounded-2"></span>
                  </div>
              </div>
          </div>
      </div>
    </div>

    <div class="col-lg-4 col-md-6 col-12 g-4">
      <div class="card card-project">
          <div class="bg-white rounded-2">
              <div class="row card-header d-flex py-3 justify-content-between align-items-center">
                  <div class="col-8 placeholder-glow">
                    <span class="placeholder py-3 mb-2 col-8 rounded-pill"></span>
                  </div>
                  <div class="col-4 placeholder-glow d-flex justify-content-end">
                    <span class="placeholder mb-2 col-1 rounded-2"></span>
                  </div>
              </div>
              <div class="mx-0 row card-body bg-white pt-1">
                  <div class="col-12 placeholder-glow">
                    <span class="placeholder mb-4 col-5 rounded-2"></span>
                  </div>
                  <div class="col-12 placeholder-glow">
                    <span class="placeholder mb-4 col-12 rounded-2"></span>
                  </div>
                  <div class="col-12 placeholder-glow">
                    <span class="placeholder col-12 rounded-2"></span>
                  </div>
              </div>
              <div class="mx-0 row card-footer bg-white border-0 pt-0 d-flex justify-content-between align-items-center">
                  <div class="col-6 placeholder-glow">
                    <span class="placeholder mb-2 col-5 rounded-circle" style="width: 30px; height: 30px;"></span>
                  </div>
                  <div class="col-6 d-flex justify-content-end placeholder-glow">
                    <span class="placeholder mb-2 col-8 rounded-2"></span>
                  </div>
              </div>
          </div>
      </div>
    </div>
  
  `;
 try {
    const response = await fetchProject(filters.search || "");
    const data = response.datas;    
    const dataUser = await setDisble();

    let showProject = document.getElementById('showAllproject');
    showProject.innerHTML = "";

    if (data.length === 0) {
      showProject.innerHTML = `
          <div class="d-flex flex-column align-items-center justify-content-center mt-5">
              <div class="m-auto w-100 text-center pb-2 mt-3">
                  <svg fill="#808080" width="150px" height="150px" ... ></svg>
              </div>
              <p class="text-center fw-bold" style="color:#808080 ;">No Data</p>
          </div>`;
      return;
    }

    const disabledBtn = dataUser.data[0].role.id == 3 ? "disabled" : "";

    const responseProject = await fetch(
      `${baseApiUrl}/api/analyst/dashboard/allprogress`,
      {
        method: "GET",
      }
    );

    
    // Status filter
    const order = ["To Start", "In Progress", "Done", "Close"];
    const dataProject = await responseProject.json();
    const sortedData = dataProject.data.sort((a, b) => order.indexOf(a.status.title) - order.indexOf(b.status.title));
    
    const progressMap = new Map(sortedData.map((p) => [p.id, p.progress]));
    const issueMap = new Map(
      dataProject.data.map((p) => [
        p.id,
        {
          issue: Number(p.issue.total),
          subIssue: Number(p.sub_issue.total),
        },
      ])
    );

     let filtered = [...data];
    if (filters.status) {
      filtered = filtered.filter(p => 
        p.status.title.toLowerCase() === filters.status.toLowerCase()
      );
    }
    
    // Progress filter
    if (filters.progress) {
      filtered = filtered.filter(p => {
        const progressValue = progressMap.get(p.id) || 0;
        if (filters.progress === "0") return progressValue === 0;
        if (filters.progress === "100") return progressValue === 100;
        if (filters.progress.includes("-")) {
          const [min, max] = filters.progress.split("-").map(Number);
          return progressValue >= min && progressValue <= max;
        }
        return true;
      });
    }
    

    // due date filter
    if (filters.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(pro => {
        const estDate = new Date(pro.estimated_date);
        estDate.setHours(0, 0, 0, 0);
        const diff = Math.floor((estDate - today) / (1000 * 60 * 60 * 24));
        
        switch (filters.dueDate) {
          case "overdue": return diff < 0;
          case "today": return diff === 0;
          case "week": return diff >= 0 && diff <= 7;
          case "month": return diff >= 0 && diff <= 30;
          default: return true;
        }
      });
    }
    

    if (filtered.length === 0) {
      showProject.innerHTML = `
        <div class="text-center mt-5">
          <i class="bi bi-filter-circle" style="font-size: 110px; color:#888;"></i>
          <p class="fw-bold text-secondary">No projects match your filters</p>
           <button id="clearFilters" class="btn btn-outline-danger btn-sm" onclick="document.getElementById('clearFilters').click()">
              <i class="bi bi-x-circle"></i> Clear All Filters
           </button>
        </div>`;
      return;
    }

     filtered.sort((a, b) =>  order.indexOf(a.status.title) - order.indexOf(b.status.title));
    
    let projectHtml = "";

    filtered.forEach((pro) => {
      let memberAvatars = "";
      let maxDisplay = 1;
      const issueData = issueMap.get(pro.id) || { issue: 0, subIssue: 0 };
      const totalIssue = issueData.issue;

      const daysRemaining = calculateDate(pro.estimated_date);
      let displayText = '';
      let textColorClass = '';

      //display due date
      if (daysRemaining > 0) {
        displayText = `${daysRemaining} days remaining`;
        textColorClass = 'text-primary';
      } else if (daysRemaining === 0) {
        displayText = 'Due today';
        textColorClass = 'text-warning'; 
      } else {
        displayText = `${Math.abs(daysRemaining)} days overdue`;
        textColorClass = 'text-danger'; 
      }

      //profile member
      pro.members.forEach((member, index) => {
        if (index < maxDisplay) {
          memberAvatars += `<img src="/upload/${member.user.avarta}" alt="Member Avatar" class="rounded-circle me-1" width="40" height="40">`;
        }
      });

      if (pro.members.length > maxDisplay) {
        let extraMembers = pro.members.length - maxDisplay;
        memberAvatars += `
                 <div class="avatar-group">
                      <span class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                          style="width: 30px; height: 30px; font-size: 10px;">
                          +${extraMembers}
                      </span>
                 </div>
              `;
      }

      let memberID = pro.members.map((mem) => mem.user.id).join(",");

      //progress color
      let progress = progressMap.get(pro.id) || 0;       
      const getStatusClass = (status, progress) => {
        if (progress >= 100) {
          return "btn-success"; 
        } else if (progress >= 50 && progress < 100) {
          return "btn-info"; 
        } else if (progress > 0 && progress < 50) {
          return "btn-primary custom-to-start"; 
        } else if (progress === 0) {
          return "btn-secondary"; 
        }

        switch (status) {
          case "Close":
            case "Closed" :
              return "btn-secondary";
          case "In Progress":
            case "In progress" :   
             return "btn-info";
          case "Done":
            case "done" :
              return "btn-success";
          case "To Start":
            case "To start" :
              return "btn-primary custom-to-start";
          default:
              return "btn-primary";
        }
      };

      // Set progress bar color
      let progressColor = progress < 30 ? "bg-danger" : progress < 70  ? "bg-warning"  : "bg-success";

       const estDateObj = new Date(pro.estimated_date);
      const estDateLocal = new Date(estDateObj.getTime() - estDateObj.getTimezoneOffset() * 60000) .toISOString().split('T')[0];
      
      projectHtml += `
          <div class="col-lg-4 col-md-6 col-12 g-4">
              <div class="card card-project">
                  <div class="bg-white rounded-2">
                      <div class="d-flex px-3 py-3 justify-content-between align-items-center">
                          <div>
                            <button type="button" class="btn py-1 ${getStatusClass( pro.status.title)} rounded-pill" disabled >${pro.status.title}</button>
                          </div>
                          <div class="dropdown">
                              <i class='bx bx-dots-vertical-rounded down cursor' id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" ></i>
                                <ul class="dropdown-menu">
                                  <li style="border-bottom: #dfdfdf solid 0.5px;" class="btn-list-hover">
                                    <button type="button" data-id=${pro.id} data-name="${pro.name}" data-description="${pro.description}" data-status="${pro.status.title}" data-estimated_date="${estDateLocal}" data-members="${memberID}" class="btn w-100 border-0 bg-transparent d-flex btn-ed-outline" onclick="editProject(this)"
                                      data-bs-toggle="modal" data-bs-target="#exampleModalEdit" ${disabledBtn}>
                                      <p class="m-0 fs-6 py-1">
                                        <i class='bx bxs-edit pe-2'></i> Edit
                                      </p>
                                    </button>
                              </li>
                              <li style="border-bottom: #dfdfdf solid 0.5px; width:180px !important;" class="btn-list-hover">
                                <button type="button" data-id=${pro.id} data-status="${pro.status.title}" data-members="${memberID}" class="btn w-100 border-0 bg-transparent d-flex btn-ed-outline" onclick="editProjectStatus(this)"
                                  data-bs-toggle="modal" data-bs-target="#exampleModalEditStatus" ${disabledBtn}>
                                  <p class="m-0 fs-6 py-1">
                                    <i class='bx bxs-edit pe-2'></i> Update Status
                                  </p>
                                </button>
                              </li>
                              <li class="btn-list-hover-delete">
                                <button type="button" class="btn w-100 border-0 bg-transparent d-flex btn-ed-outline"
                                  data-bs-toggle="modal" data-id=${pro.id} data-bs-target="#deleteModalA1" onclick="deleteProject(this)" ${disabledBtn}>
                                  <p class="m-0 fs-6 py-1"><i class='bx bxs-trash pe-2' ></i> Delete</p>
                                </button>
                              </li>
                            </ul>
                          </div>
                      </div>
                      <div class="card-body pt-1">
                          <h6 class="fs-5 fw-bold"><a href="#" data-id=${pro.id} data-page="analytic" onclick="linkProjectPage(this, event)">${ pro.name}</a></h6>
                          <div class="showDes"><p class="${pro.description ? "" : "no-description"} mb-2">${pro.description}</p></div>
                          <div class="d-flex justify-content-between align-items-center">
                            <p class="mb-0 text-primary">Progress</p>
                            <div class="small-profile avatar-group d-flex justify-content-end cursor-pointer" data-id=${pro.id} onclick="linkProjectPageMember(this,event)">
                                ${memberAvatars}
                            </div>
                        </div>
                          <div class="progress mt-2">
                              <div class="progress-bar ${progressColor}" role="progressbar" style="width: 0%; transition: width 1s ease-in-out;" data-progress="${progress}">${parseInt(progress)}%
                              </div>
                          </div>
                      </div>
                      <div class="card-footer border-0 pt-0 d-flex justify-content-between align-items-center">
                         <div class="small-profile avatar-group d-flex justify-content-end">
                              <p class="mb-0 text-primary fw-semibold">Total Issue : ${totalIssue}</p>
                          </div>

                         <p class="mb-0 border bg-grey px-3 py-1 rounded-pill">
                            <span class="${textColorClass} fw-semibold">${displayText}</span>
                        </p>
                      </div>
                  </div>
              </div>
          </div>`;
    });

    showProject.innerHTML = projectHtml;

    document.querySelectorAll(".progress-bar").forEach((bar) => {
      let progressValue = bar.getAttribute("data-progress");
      bar.style.width = `${progressValue}%`;
    });

  } catch (error) {
    document.getElementById('showAllproject').innerHTML = '';
  }
}

// document.addEventListener('DOMContentLoaded', () => {
//   initializeFilters();
//   getAllproject();
// });

$(document).ready(function () {
  $("#statusFilter").select2({ width: "100%", minimumResultsForSearch: Infinity });
  $("#progressFilter").select2({ width: "100%", minimumResultsForSearch: Infinity });
  $("#dueDateFilter").select2({ width: "100%", minimumResultsForSearch: Infinity });

  initializeFilters();  
  getAllproject();
});


async function linkProjectPageSidebar(item) {

  const side_page_active = sessionStorage.getItem('side_page_active');
  if (side_page_active !== null) {
    sessionStorage.removeItem('side_page_active');
  }

  const projectId = item.dataset.id;

  const current_project_id = localStorage.getItem('projectID');
  if (current_project_id !== null) {
    localStorage.removeItem('projectID');
  }
  localStorage.setItem('projectID', projectId);

  const projectElement = document.getElementById(`project-menu-${projectId}`);

  const active = sessionStorage.getItem('project_active');
  const active_id = sessionStorage.getItem('project_active_id');
  if (active !== null) {
    const active_element = document.getElementById(`project-menu-${active_id}`);
    if (active === "1") {
      active_element?.classList.remove("active", "open");
    }
  }

  const cate_active = sessionStorage.getItem('cate_active');
  const cate_active_id = sessionStorage.getItem('cate_active_id');
  if (cate_active !== null) {
    const active_cate_element = document.getElementById(`cate-menu-${cate_active_id}`);
    if (cate_active == 1) {
      active_cate_element?.classList.remove("active", "open");
      sessionStorage.setItem('cate_active', '0');
    }
  }

  const cate_item_active = sessionStorage.getItem('cate_item_active');
  const cate_item_active_id = sessionStorage.getItem('cate_item_active_id');
  if (cate_item_active !== null) {
    const active_cate_item = document.getElementById(`category-${cate_item_active_id}`);
    if (cate_item_active == 1) {
      active_cate_item?.classList.remove("active", "open");
      sessionStorage.setItem('cate_item_active', '0');
    }
  }

  projectElement.classList.add("active", "open");
  sessionStorage.setItem('project_active', '1');
  sessionStorage.setItem('project_active_id', projectId);
}


async function linkProjectPage(item, event) {
  event.preventDefault();
  await linkProjectPageSidebar(item);
  window.location.href = "/pages/analytic";
}

async function linkProjectPageMember(item, event) {
  event.preventDefault();
  await linkProjectPageSidebar(item);
  window.location.href = "/pages/project-setting";
}


async function getStatusSelect() {
  const responseStatus = await fetch(
    `${baseApiUrl}/api/projects/status?search=&page=&perpage=`,
    {
      method: "GET",
    }
  );

  const dataStatus = await responseStatus.json();
  const selectStatus = document.getElementById("select-status");
  const editStatus = document.getElementById("editStatus");

  if (selectStatus && editStatus) {
    selectStatus.innerHTML = "";
    editStatus.innerHTML = "";

    dataStatus.data.datas.forEach((sta) => {
      let option = `<option value="${sta.id}">${sta.title}</option>`;
      selectStatus.innerHTML += option;
      editStatus.innerHTML += option;
    });
  }
}

async function getMemberSelect() {
  const responseMember = await fetch(
    `${baseApiUrl}/api/users?search&role=&page=&perpage=`,
    {
      method: "GET",
    }
  );
  const dataMember = await responseMember.json();

  const selectMember = document.getElementById("add-Member");

  selectMember.innerHTML = "";

  const resProfile = await fetch(`${baseApiUrl}/api/profile`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
  });
  const ownProfile = await resProfile.json();

  const filteredMembers = dataMember.data.datas.filter((mem) => {
    return mem.role.id != 1;
  });

  console.log(filteredMembers);
  

  filteredMembers.forEach((mem) => {
    if(mem.id !== ownProfile.data[0].id){
      let optionMember = `<option value="${mem.id}">${mem.display_name}</option>`;
      selectMember.innerHTML += optionMember;
    }
  });
}

function createProjectOpen() {
  $("#createProject").modal("show");
  getStatusSelect();
  getMemberSelect();
}

async function createProject() {
  startLoading(
    "btn-create-project",
    "btn-create-project-text",
    "btn-create-project-spinner"
  );
  const projectName = document.querySelector("#proName");
  const projectNameValue = projectName.value.trim();
  const projectInvalid = document.getElementById("invalid-proName");

  const description = document.querySelector("#Project-message");
  const descriptionValue = description.value;

  const statusName = document.querySelector("#select-status");
  const statusNameValue = $(statusName).val();
  const statusInvalid = document.getElementById("invalid-selectProject");
  const isDefaultstatus = statusName.selectedOptions[0]?.disabled || false;

  const estdate = document.querySelector("#est-date");
  const estdateValue = estdate.value;
  const estdateInvalid = document.getElementById("invalid-est");

  const addMember = document.querySelector("#add-Member");
  const addMemberValue = $(addMember).val();
  const addMemberInvalid = document.getElementById("invalid-addMember");
  const isDefaultmember = addMember.selectedOptions[0]?.disabled || false;

  let isValid = true;

  if (projectNameValue === "" || projectNameValue.length < 2) {
    validateInvalid(projectName, projectInvalid, "Please input Project Name must be at least 2 letters.");
    isValid = false;
  } else {
    validatevalid(projectName, projectInvalid);
  }

  if (statusNameValue === "" || isDefaultstatus) {
    validateInvalid(statusName, statusInvalid, "Please select a valid status");
    isValid = false;
  } else {
    validatevalid(statusName, statusInvalid);
  }

   if (estdateValue === "" ) {
    validateInvalid(estdate, estdateInvalid, "Please select a valid Estimate Date");
    isValid = false;
  } else {
    validatevalid(estdate, estdateInvalid);
  }


  if (addMemberValue === "" || isDefaultmember) {
    validateInvalid(addMember, addMemberInvalid, "Please select a member");
    isValid = false;
  } else {
    validatevalid(addMember, addMemberInvalid);
  }

  if (!isValid) {
    stopLoading(
      "btn-create-project",
      "btn-create-project-text",
      "btn-create-project-spinner",
      "Add Project"
    );
    return;
  }

  try {
    const response = await fetch(`${baseApiUrl}/api/project`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: projectNameValue,
        description: descriptionValue,
        status_id: statusNameValue,
        estimated_date : estdateValue,
      }),
    });
    const data = await response.json();
    const addprojectId = data.data[0].id;

    if (data.result == true) {
      clearProject();
      await getAllproject();
      Swal.fire({
        icon: "success",
        title: "Create new project Successfully",
        position: "top-end",
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff",
      });
      stopLoading(
        "btn-create-project",
        "btn-create-project-text",
        "btn-create-project-spinner",
        "Add Project"
      );
      $("#createProject").modal("hide");
      //status
      await setCreateProject(
        `${baseApiUrl}/api/projects/issue/status/${addprojectId}`,
        "Done"
      );
      await setCreateProject(
        `${baseApiUrl}/api/projects/issue/status/${addprojectId}`,
        "To start"
      );
      await setCreateProject(
        `${baseApiUrl}/api/projects/issue/status/${addprojectId}`,
        "In progress"
      );

      //label
      await setCreateProject(
        `${baseApiUrl}/api/projects/issue/label/${addprojectId}`,
        "Starting"
      );
      await setCreateProject(
        `${baseApiUrl}/api/projects/issue/label/${addprojectId}`,
        "Developing"
      );
      await setCreateProject(
        `${baseApiUrl}/api/projects/issue/label/${addprojectId}`,
        "Testing"
      );

      //prority
      await setCreateProject(
        `${baseApiUrl}/api/projects/issue/priority/${addprojectId}`,
        "High"
      );
      await setCreateProject(
        `${baseApiUrl}/api/projects/issue/priority/${addprojectId}`,
        "Medium"
      );
      await setCreateProject(
        `${baseApiUrl}/api/projects/issue/priority/${addprojectId}`,
        "Low"
      );

      //tracker
      await setCreateProject(
        `${baseApiUrl}/api/projects/issue/tracker/${addprojectId}`,
        "Bug"
      );
      await setCreateProject(
        `${baseApiUrl}/api/projects/issue/tracker/${addprojectId}`,
        "Erorr"
      );
      await setCreateProject(
        `${baseApiUrl}/api/projects/issue/tracker/${addprojectId}`,
        "Feature"
      );

      //category
      await setCreateProject(
        `${baseApiUrl}/api/category/${addprojectId}`,
        "Develop",
        " "
      );
      await setCreateProject(
        `${baseApiUrl}/api/category/${addprojectId}`,
        "Design",
        " "
      );
      await setCreateProject(
        `${baseApiUrl}/api/category/${addprojectId}`,
        "Test",
        " "
      );
      await setCreateProject(
        `${baseApiUrl}/api/category/${addprojectId}`,
        "Support",
        " "
      );

      let newUser = addMemberValue;
      try {
        const projectResponse = await fetch(
          `${baseApiUrl}/api/projects/member/${addprojectId}`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: JSON.stringify(newUser) }),
          }
        );

        await projectResponse.json();
        
        await getAllproject();
        await getSidebar();
      } catch (error) {
        stopLoading('btn-create-project',  'btn-create-project-text', 'btn-create-project-spinner', 'Add Project');
      }
    }
  } catch (error) {
    stopLoading('btn-create-project',  'btn-create-project-text', 'btn-create-project-spinner', 'Add Project');
  }
}

async function editProject(button) {
 await getStatusSelect();
  projectId = button.dataset.id;

   localStorage.setItem('projectID', projectId);

  let projectName = button.dataset.name;
  let projectDescription = button.dataset.description;
   let projectEstDate = button.dataset.estimated_date;
  if (projectEstDate.includes('T')) {
    projectEstDate = projectEstDate.split('T')[0];
  }

  document.getElementById("editProname").value = projectName;
  document.getElementById("Editmessage").value = projectDescription;
  document.getElementById("updateEst-date").value = projectEstDate || "";
  
}

async function editProjects() {
  startLoading(
    "btn-update-project",
    "btn-update-project-text",
    "btn-update-project-spinner"
  );
  const editName = document.querySelector("#editProname");
  const editNameValue = editName.value.trim();
  const editnameInvalid = document.getElementById("invalid-editproName");
  const editDesciption = document.getElementById("Editmessage");
  const editDesciptionValue = editDesciption.value.trim();
  const editEstDate = document.querySelector("#updateEst-date");
  const editEstValue = editEstDate.value;
  const editEstInvalid = document.getElementById("invalid-UpdateEst");
  
  
  let isValid = true;
  
  if (editNameValue === "") {
    validateInvalid(editName, editnameInvalid, "Please input Project Name");
    isValid = false;
  } else {
    validatevalid(editName, editnameInvalid);
  }
  
  if(editEstValue === ""){
    validateInvalid(editEstDate,editEstInvalid,"Please Chooes Estimate Date");
    isValid = false;
  }else{
    validatevalid(editEstDate,editEstInvalid);
  }

  if (!isValid) {
    stopLoading(
      "btn-update-project",
      "btn-update-project-text",
      "btn-update-project-spinner",
      'Update'
    );
    return;
  }

  try {
    const response = await fetch(`${baseApiUrl}/api/project/${projectId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: editNameValue,
        description: editDesciptionValue,
        estimated_date : editEstValue
      }),
    });

    const data = await response.json();

    if (data.result === true) {
      await createActivity("project", `updated project`);
      getAllproject();
      clearProject();
      stopLoading(
        "btn-update-project",
        "btn-update-project-text",
        "btn-update-project-spinner",
        'Update'
      );
      $("#exampleModalEdit").modal("hide");
      Swal.fire({
        icon: "success",
        title: "Edit project Successfully",
        position: "top-end",
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff",
      });
      localStorage.removeItem('projectID', projectId);
    }
  } catch (error) {
    stopLoading(
      "btn-update-project",
      "btn-update-project-text",
      "btn-update-project-spinner",
      'Update'
    );
  }
}

async function editProjectStatus(params) {
  await getStatusSelect();

  projectId = params.dataset.id;
  let projectStatus = params.dataset.status.trim();

  let statusDropdown = document.getElementById("editStatus");
  localStorage.setItem('projectID', projectId);

  Array.from(statusDropdown.options).forEach((option) => {
    if (option.text.trim() === projectStatus) {
      statusDropdown.value = option.value;
    }
  });

  $(statusDropdown).trigger("change");
  
}


async function saveEditProjectStatus() {
  const editStatus = document.getElementById("editStatus");
  const editstatusValue = editStatus.value;
   let isValid = true;

   if (!isValid) {
    stopLoading(
      "btn-update-project",
      "btn-update-project-text",
      "btn-update-project-spinner",
      'Update'
    );
    return;
  }

   try {
    const response = await fetch(`${baseApiUrl}/api/projectstatus/${projectId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
       status_id: editstatusValue,
      }),
    });

    const data = await response.json();

    if (data.result === true) {
      await createActivity("project", `updated project status on project`);
      getAllproject();
      clearProject();
      stopLoading(
        "btn-update-project",
        "btn-update-project-text",
        "btn-update-project-spinner",
        'Update'
      );
      $("#exampleModalEditStatus").modal("hide");
      Swal.fire({
        icon: "success",
        title: "Edit project status Successfully",
        position: "top-end",
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff",
      });
      localStorage.removeItem('projectID', projectId);
    }
  } catch (error) {
    stopLoading(
      "btn-update-project",
      "btn-update-project-text",
      "btn-update-project-spinner",
      'Update'
    );
  }
}

async function deleteProject(button) {
  projectId = button.dataset.id;

  try {
    localStorage.setItem('projectID', projectId);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this project!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await createActivity("project", "delete");
      const response = await fetch(`${baseApiUrl}/api/project/${projectId}`, {
        method: "DELETE",
      });

      await response.json();


      getAllproject();

      await Swal.fire({
        title: "Deleted!",
        text: "Project has been deleted.",
        icon: "success",
      });

      localStorage.removeItem('projectID');
    }else{
      localStorage.removeItem('projectID');
    }
  } catch (error) {
    return;
  }
}

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("closebtn")) {
    clearProject();
    localStorage.removeItem('projectID');
  }
});

function clearProject() {
  clearData(document.querySelector("#proName"),document.getElementById("invalid-proName"));
  clearData(document.querySelector("#Project-message"), null);
  clearData(document.querySelector("#add-Member"), document.getElementById("invalid-addMember"));
  clearData(document.querySelector("#updateEst-date"),document.getElementById("invalid-est"));
}
