let currentPage = 1;
let perPage = 5;
let totalEntries = 20;
let roleID = 0;

let projectDataCache = []; 


async function getProjectUser() {
   const projectData = await fetchProject();
    projectDataCache = projectData.datas; 
}

async function getAllUsers(page = 1, searchQuery = "") {
  try {
    const data = await fetchUsers(page, searchQuery);
    if (!data) return;

   await renderUsers(data.data.datas, page, perPage);

    if (data.data.paginate) {
      updatePagination(data.data.paginate, "pagination", "getAllUsers");
      updateEntriesInfo(data.data.paginate.page, data.data.paginate.perpage, data.data.paginate.total);
    } else {
      document.getElementById("pagination").innerHTML = "";
    }
  } catch (error) {
    return
  }
}


async function initializeData() {
  await getProjectUser();
  await getAllUsers(currentPage);
}

initializeData();



function searchAlluser(id) {
  search(id, getAllUsers);
}

function userUpdateRowsPerPage(id) {
  UpdateRowsPerPage(id, getAllUsers);
}

function selectRoles(id) {
  roleID = showByrole(id);
  getAllUsers(currentPage, "");
}

let idUser = "";

async function viewDetail(button) {
  const idUser = button.dataset.id;

  try {
    const response = await fetch(`${baseApiUrl}/api/user/${idUser}`, {
      method: "GET",
    });
    const result = await response.json();
    const user = result.data;

    const projectResponse = await fetch(
      `${baseApiUrl}/api/projects?search=&page=&perpage=`,
      {
        method: "GET",
      }
    );
    const projectData = await projectResponse.json();

    let projectName = [];
    projectData.data.datas.forEach((project) => {
      project.members.forEach((member) => {
        if (member.user.id === user.id) {
          projectName.push(project.name); 
        }
      });
    });

    const formattedDate = new Date(user.created_on).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    );

    const viewAvarta = document.getElementById("viewAvarta");
    const viewFullname = document.getElementById("fullnameDis");
    const viewDescrip = document.getElementById("descripDetail");
    const viewdetailUser = document.getElementById("showinfor");

    viewFullname.innerHTML = `<p class="fs-4">${user.first_name} ${user.last_name}</p>`;

    viewAvarta.innerHTML = `<img class="rounded-circle" src="/upload/${user.avarta}" alt="User avatar">`;
    
    viewDescrip.innerHTML = `<p>${user.description == null ? "No Description" : user.description}</p>`;

    viewdetailUser.innerHTML = `
      <div class="row">
        <div class="col-4"><p>Display Name :</p></div>
        <div class="col-8"><p>${user.display_name == null ? "No Display Name" : user.display_name }</p></div>
        <div class="col-4"><p>Email :</p></div>
        <div class="col-8"><p>${user.email}</p></div>
        <div class="col-4"><p>Role :</p></div>
        <div class="col-8"><p class="fw-bold">${user.role.name}</p></div>
        <div class="col-4"><p>Joined Date :</p></div>
        <div class="col-8"><p>${formattedDate}</p></div>
        <div class="col-4"><p>Handle Project :</p></div>
        <div class="col-8"><p>${projectName}</p></div>
      </div>
    `;

  } catch (error) {
    return
  }
}



async function getRoleUser(){
const selectRole = document.getElementById("editroles");

  try {
    const responseRole = await fetch(`${baseApiUrl}/api/roles`);
    const dataRoles = await responseRole.json();

    selectRole.innerHTML = "";

    dataRoles.data.forEach((role) => {
      if(role.id == 1){
        return;
      }
      let optionRole = `<option value="${role.id}">${role.name}</option>`;
      selectRole.innerHTML += optionRole;
    });
  } catch (error) {
    return
  }
}
getRoleUser();

  
function changePassword(button) {
  idUser = button.dataset.id;
  document.getElementById("getemail").value = button.dataset.display_name;
}

async function saveChangePassword() {
  startLoading('btn-save-change-pass',  'btn-save-change-pass-text', 'btn-save-change-pass-spinner');
  const passwordNew = document.querySelector('#changePw');
  const passwordNewValue = passwordNew.value;
  const invalidNewpass = document.getElementById("invalid-pass");
  let passwordtest = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#]{6,}$/;
  
  let isValid = true;
  if (!passwordtest.test(passwordNewValue)) {
    validateInvalid(passwordNew, invalidNewpass, 'Invalid password. Please try again');
    isValid = false;
  } else {
    validatevalid(passwordNew,invalidNewpass);
  }

  if(!isValid){
    stopLoading('btn-save-change-pass',  'btn-save-change-pass-text', 'btn-save-change-pass-spinner', 'Save');
    return;
  }

  const responsePassword = await fetch(`${baseApiUrl}/api/user/pass/${idUser}`,{
    method : 'PUT',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: passwordNewValue,
    }),
  })
  const dataPassword = await responsePassword.json();

  if (dataPassword.result === true) {
    getAllUsers();
    removeValidPassowrd()
    Swal.fire({
      icon: "success",
      title: "Changed password successfully!",
      position: "top-end",
      toast: true,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      background: "#fff",
    });
    stopLoading('btn-save-change-pass',  'btn-save-change-pass-text', 'btn-save-change-pass-spinner', 'Save');
    $("#changePasswordModal").modal("hide");
  }
  
}

function removeValidPassowrd(){
  const clearinput = document.querySelector('#changePw')
  const invalideupdate = document.getElementById('invalid-pass');
  clearData(clearinput,invalideupdate);
}

function edituser(button) {
  idUser = button.dataset.id;
  document.getElementById("editfname").value = button.dataset.first_name;
  document.getElementById("editlname").value = button.dataset.last_name;
  document.getElementById("editemail").value = button.dataset.email;
  document.getElementById("editusername").value = button.dataset.display_name;
  let rolename = button.dataset.role;
  let selectroleId = rolename;
  

  let editDropdown = document.getElementById("editroles");

  Array.from(editDropdown.options).forEach((role) => {
    if (role.text === selectroleId) {
      $(editDropdown).val(role.value).trigger("change");
    }
  });
  $(document).ready(function() {
    $('#editroles').select2({
     width: '100%',
     minimumResultsForSearch: Infinity, // Disable search box
     dropdownParent: $("#exampleModalEdit") 

    });  // Initialize Select2 on your dropdown
  });
}

async function editUser() {
  startLoading('btn-edit-account',  'btn-edit-account-text', 'btn-edit-account-spinner');
  let rolesValue = document.getElementById("editroles").value;
  try {
    const response = await fetch(`${baseApiUrl}/api/user/${idUser}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        new_role_id: rolesValue,
      }),
    });

    const data = await response.json();
    if (data.result === true) { 
      getAllUsers();
      Swal.fire({
        icon: "success",
        title: "Edit role is successfully",
        position: "top-end",
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff",
      });
      stopLoading('btn-edit-account',  'btn-edit-account-text', 'btn-edit-account-spinner', 'Save');
      $("#exampleModalEdit").modal("hide");
    }
  } catch (error) {
    stopLoading('btn-edit-account',  'btn-edit-account-text', 'btn-edit-account-spinner', 'Save');
  }
}

async function deleteUser(button) {
  deleteUserTable(button, `${baseApiUrl}/api/user`, getAllUsers)
}
