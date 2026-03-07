async function fetchUsers(page = 1, searchQuery = "") {
  try {
    const response = await fetch(
      `${baseApiUrl}/api/users?search=${searchQuery}&role=${roleID}&page=${page}&perpage=${perPage}`,
      { method: "GET" }
    );
    return await response.json();
  } catch (error) {
    return null;
  }
}

function getUserProjects(user) {
  let projectNames = [];

  projectDataCache.forEach((project) => {
    project.members?.forEach((member) => {
      if (member?.user?.id === user.id) {
        projectNames.push(project.name);
      }
    });
  });

  let maxProjectsToShow = 2;
  let displayProjects = projectNames.slice(0, maxProjectsToShow);
  let projectName =
    displayProjects.length > 0 ? displayProjects.join(", ") : "No Project";

  if (projectNames.length > maxProjectsToShow) {
    projectName += "...";
  }

  return projectName;
}

async function renderUsers(users, currentPage = 1, perPage = 5) {
  const dataUser = await setDisble();
  const userRole = dataUser.data[0].role.id;
  let isSuperAdmin;
  let isAdmin;
  let isUser;

 function createDeleteButton(user) {
    const disabledBtn = `<button type="button" class="btn w-100 border-0 bg-transparent d-flex btn-ed-outline disabled">
         <p class="m-0 fs-6 text-muted"><i class='bx bxs-trash pe-2'></i> Delete</p>
      </button>`;

    const activeBtn = `<button type="button" class="btn w-100 border-0 bg-transparent d-flex btn-ed-outline" 
      data-bs-toggle="modal" data-bs-target="#deleteModal123111" data-id='${user.id}' 
      onclick="deleteUser(this)">
      <p class="m-0 fs-6"><i class='bx bxs-trash pe-2'></i> Delete</p>
    </button>`;

     isSuperAdmin = user.role.id == 1;
     isAdmin = user.role.id == 2;
    if (userRole == 2) {
      return isSuperAdmin || isAdmin ? disabledBtn : activeBtn;
    } else {
      return user.role.id == 1 ? disabledBtn : activeBtn;
    }
  }

  function createEditButton(user) {
    const disabledBtnEdit = `<li style="border-bottom: #dfdfdf solid 0.5px;" class="btn-list-hover">
    <button type="button" class="btn w-100 border-0 bg-transparent d-flex btn-ed-outline" data-bs-toggle="modal" disabled onclick="edituser(this)">
      <p class="m-0 fs-6"><i class='bx bxs-edit pe-2'></i> Edit</p>
    </button>
  </li>`;

    const activeBtnEdit = `<button type="button" class="btn w-100 border-0 bg-transparent d-flex btn-ed-outline" data-bs-toggle="modal" data-id="${user.id}" data-first_name="${user.first_name}" data-last_name="${user.last_name}" data-display_name="${user.display_name}" data-email="${user.email}" data-role="${user.role.name}" data-bs-target="#exampleModalEdit" onclick="edituser(this)">
                    <p class="m-0 fs-6"><i class='bx bxs-edit pe-2'></i> Edit</p>
                  </button>`;

     isSuperAdmin = user.role.id == 1;
    isAdmin = user.role.id == 2;
    if (userRole == 2) {
      return isSuperAdmin || isAdmin ? disabledBtnEdit : activeBtnEdit;
    } else {
      return user.role.id == 1 ? disabledBtnEdit : activeBtnEdit;
    }
  }

  function createEditPasswordButton(user) {
    const disabledBtnEditPassword = `<li style="border-bottom: #dfdfdf solid 0.5px;" class="btn-list-hover">
                    <button type="button" class="btn w-100 border-0 bg-transparent d-flex btn-ed-outline d-flex justify-center align-items-center" data-bs-toggle="modal" data-bs-target="#changePasswordModal" disabled onclick="changePassword(this)">
                      <p class="m-0 fs-6"><i class='bx bxs-key pe-2'></i> Password</p>
                    </button>
                  </li>`;
    const activeBtnEditPassword = `<button type="button" class="btn w-100 border-0 bg-transparent d-flex btn-ed-outline d-flex justify-center align-items-center" data-id="${user.id}" data-email="${user.email}" data-display_name="${user.display_name}" data-bs-toggle="modal" data-bs-target="#changePasswordModal" onclick="changePassword(this)">
                      <p class="m-0 fs-6"><i class='bx bxs-key pe-2'></i> Password</p>
                    </button>`;

     isSuperAdmin = user.role.id == 1;
     isAdmin = user.role.id == 2;
     isUser = user.role.id == 3;
    if (userRole == 2) {
      return isSuperAdmin || isAdmin  || isUser ? disabledBtnEditPassword : activeBtnEditPassword;
    } else {
      return user.role.id == 1 ? disabledBtnEditPassword : activeBtnEditPassword;
    }
  }

  let allMember = document.getElementById("allUser");
  allMember.innerHTML = "";

 users.forEach((user,index) => {
    let projectName = getUserProjects(user);
    let deleteButton = createDeleteButton(user);
    let editButton = createEditButton(user);
    let editpassword = createEditPasswordButton(user);
      const rowNumber = (currentPage - 1) * perPage + (index + 1);

    allMember.innerHTML += `
        <tr>
          <td>${rowNumber}</td>
          <td><img class="rounded-circle" style="width:50px;height:50px" src="/upload/${user.avarta}" alt="User avatar"></td>
          <td>${user.first_name} ${user.last_name}</td>
          <td>${user.display_name}</td>
          <td>${user.email}</td>
          <td>${user.role.name}</td>
          <td style="width:280px">${projectName}</td>
          <td>
            <div class="dropdown dropstart">
              <button class="btn btn-outline border-0" type="button" data-bs-toggle="dropdown">
                <i class='bx bx-dots-horizontal-rounded'></i>
              </button>
              <ul class="dropdown-menu">
                <li style="border-bottom: #dfdfdf solid 0.5px;" class="btn-list-hover">
                  <button type="button" class="btn w-100 border-0 bg-transparent d-flex btn-ed-outline d-flex justify-center align-items-center" data-id="${user.id}" data-bs-toggle="modal" data-bs-target="#viewDetailModal" onclick="viewDetail(this)">
                    <p class="m-0 fs-6"><i class='bx bx-show pe-2'></i> View</p>
                  </button>
                </li>
                <li style="border-bottom: #dfdfdf solid 0.5px;" class="btn-list-hover">
                  ${editpassword}
                </li>
                <li style="border-bottom: #dfdfdf solid 0.5px;" class="btn-list-hover">
                 ${editButton}
                </li>
                <li class="btn-list-hover-delete">${deleteButton}</li>
              </ul>
            </div>
          </td>
        </tr>`;
  });
}

async function deleteUserTable(button, apiBaseUrl, getAllFunction) {
  const idUser = button.dataset.id;
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: " You want to delete it this user! ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const response = await fetch(`${apiBaseUrl}/${idUser}`, {
        method: "DELETE",
      });

      await response.json();
      getAllFunction();
      await Swal.fire({
        title: "Deleted!",
        text: "Delete user sucessfully",
        icon: "success",
      });
    }
  } catch (error) {
    return;
  }
}
