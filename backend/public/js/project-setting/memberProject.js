let currentPage = 1;
let perPage = 5;
let totalEntries = 20;

async function getAllMember(page = 1, searchQuery = "") {
  currentPage = page;
  const projectAllID = getProjectID();
  try {
    const response = await fetch(
      `${baseApiUrl}/api/projects/members/${projectAllID}?search=${searchQuery}&page=${page}&perpage=${perPage}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    

    const dataUser = await setDisble();
    const userRole = dataUser.data[0].role.id;

    let showmember = document.getElementById("showmember");
    showmember.innerHTML = "";
    let btnAdd = document.querySelector(".btnAdd");

    const disableBtn = userRole == 3 ? "disabled" : "";

    const displayTable = data.data.datas.forEach((ele,index) => {
      const formattedDate = new Date(ele.created_on).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }
      );

      const isSuperAdmin = ele.user.role.id == 1;
      const isAdmin = ele.user.role.id == 2;
      
      const disableallbtn = `<button type="button" class="btn btn-danger btn-sm text-center ms-2" disabled>
                   <i class='bx bxs-trash'></i>
                 </button>`
      
      const memberName = (ele.user.first_name && ele.user.last_name) 
                    ? `${ele.user.first_name} ${ele.user.last_name}`.trim()
                    : ele.user.dis_name || ele.user.first_name || ele.user.last_name || ele.user.email || "Member";           
      const activeBtn = `<button type="button" class="btn btn-danger btn-sm text-center ms-2" 
                   data-bs-toggle="modal" data-bs-target="#exampleModal2" data-id="${ele.id}" data-name="${memberName}" onclick="deleteMemeber(this)" ${disableBtn || ''}>
                   <i class='bx bxs-trash'></i>
                 </button>`
      
      let deleteButton;
      
      if (userRole == 2) {
          deleteButton = (isSuperAdmin || isAdmin) ? disableallbtn  : activeBtn;
      } else {
          deleteButton = (isSuperAdmin) ? disableallbtn : activeBtn;
      }

      const rowNumber = (currentPage - 1) * perPage + (index + 1);


      showmember.innerHTML += `
        <tr>
            <td>${rowNumber}</td>
            <td><img class="avarta_users_admin me-2" src="/upload/${ele.user.avarta}" alt=""></td>
            <td>${ele.user.first_name} ${ele.user.last_name}</td>
            <td>${ele.user.dis_name || "No Display Name"}</td>
            <td data-user-id="${ele.user.id}"> ${ele.user.email}</td>
            <td>${ele.user.role.name}</td>
            <td>${formattedDate}</td>
            <td>
              ${deleteButton} 
            </td>
        </tr>
      `;
    });

    if (userRole == 3) {
      btnAdd.classList.add("d-none");
      displayTable;
    } else {
      displayTable;
    }

    if (data.data.paginate) {
      let paginate = {
        page: data.data.paginate.page || 1, // Default to page 1 if missing
        pages:
          data.data.paginate.pages ||
          Math.ceil(data.data.paginate.total / data.data.paginate.perpage) ||
          1, // Ensure pages count
        perpage: data.data.paginate.perpage || perPage, // Default to perPage
        total: data.data.paginate.total || totalEntries, // Default to totalEntries
      };

      updateEntriesInfo(paginate.page, paginate.perpage, paginate.total);
      updatePagination(data.data.paginate, "pagination", "getAllMember");
    } else {
      document.getElementById("pagination").innerHTML = "";
    }
  } catch (error) {
    return
  }
}

getAllMember(currentPage);

function searchAllmember(id) {
  search(id, getAllMember);
}

function updateRemoveButtons() {
  let formRows = document.querySelectorAll("#form-container .form-row");
  let removeButtons = document.querySelectorAll("#form-container .remove-btn");

  if (formRows.length === 1) {
    removeButtons.forEach((btn) => btn.classList.add("d-none"));
  } else {
    removeButtons.forEach((btn) => btn.classList.remove("d-none"));
  }
}

function addmore() {
  let formContainer = document.getElementById("form-container");
  let newFormRow = document.createElement("div");
  newFormRow.classList.add("row", "g-2", "mb-2");
  newFormRow.innerHTML = `
  <div class="col-8 ">
    <select class="form-select name-add" name="select-name[]" autocomplete="off">
      <option selected disabled>Select Name</option>
    </select>
    <div class="invalid-feedback invalid-select">
        Please fill in your password!
       </div>
  </div>
  <div class="col-4">
   <div class="d-flex">
      <input type="text" class="form-control role-input" disabled>
    <div>
   <button type="button" class="border-0 bg-transparent fs-5 ps-2 text-danger pt-1 remove-btn">
      <i class='bx bx-user-x'></i>
   </button>
  </div>
 </div>
  </div>
`;

  formContainer.appendChild(newFormRow);
  loadUsers();
  newFormRow
    .querySelector(".remove-btn")
    .addEventListener("click", function () {
      newFormRow.remove();
      updateRemoveButtons();
    });

  updateRemoveButtons();
}

function updateRemoveButtons() {
  let removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach((btn, index) => {
    btn.style.visibility = removeButtons.length > 1 ? "visible" : "hidden";
  });
}

// Ensure the initial button visibility is set on page load
document.addEventListener("DOMContentLoaded", updateRemoveButtons);

async function getAllExistingMembers() {
  const existingUserIds = new Set();
  const projectAllID = getProjectID();

  try {
    const initialResponse = await fetch(
      `${baseApiUrl}/api/projects/members/${projectAllID}?page=&perpage=${perPage}`
    );
    const initialData = await initialResponse.json();
    const totalRecords = initialData.data.paginate.total;
    const totalPages = Math.ceil(totalRecords / perPage);

    initialData.data.datas.forEach((member) => {
      existingUserIds.add(member.user.id.toString());
    });
    for (let page = 2; page <= totalPages; page++) {
        const response = await fetch(
          `${baseApiUrl}/api/projects/members/${projectAllID}?page=${page}&perpage=${perPage}`
        );
        const data = await response.json();

        data.data.datas.forEach((member) => {
          existingUserIds.add(member.user.id.toString());
        });
    }

    return existingUserIds;
  } catch (error) {
    return existingUserIds;
  }
}
async function loadUsers() {
  try {
    const allExistingUsers = await getAllExistingMembers();

    const response = await fetch(
      `${baseApiUrl}/api/users?search&role=&page=&perpage=`
    );
    const data = await response.json();

    
    const userMap = {};
    
    data.data.datas.forEach((user) => {
      if (user.id != 1) { 
        userMap[user.id] = {
          name: `${user.first_name} ${user.last_name}`,
          role: user.role?.name || "No Role",
        };
      }
    });

    const userSelects = $(".name-add"); 
    userSelects.each(function () {
      const userSelect = $(this);
      const previousSelectedValue = userSelect.val();
      userSelect
        .empty()
        .append("<option selected disabled>Select Name</option>");

      Object.keys(userMap).forEach((userId) => {
        if (!allExistingUsers.has(userId)) {
          const option = new Option(
            userMap[userId].name,
            userId,
            false,
            userId === previousSelectedValue
          );
          userSelect.append(option);
        }
      });

      userSelect.select2({
        placeholder: "Select Name",
        allowClear: true,
        width: "100%",
        dropdownParent: $("#addMember"),
      });

      // Fix: Use `select2:select` event instead of normal `change`
      userSelect.on("select2:select", function (e) {
        const selectedUserId = e.params.data.id; // Get selected ID

        const row = userSelect.closest(".row");
        const roleInput = row.find(".role-input");
        if (!roleInput.length) {
          return;
        }

        // Assign role value
        roleInput.val(userMap[selectedUserId]?.role || "");
      });
    });
  } catch (error) {
   return
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getAllMember();
});

function addMemberModalOpen() {
  $("#addMember").modal("show");
  loadUsers();
}

async function addNewMember() {
  startLoading('btn-add-member-project',  'btn-add-member-project-text', 'btn-add-member-project-spinner');
  const selects = document.querySelectorAll(".name-add");
  const selectedUserIds = [];
  const selectedUserNames  = [];
  let isValid = false;

  selects.forEach((select) => {
    select.classList.remove("is-invalid", "is-valid");
    const feedbackElement =
      select.parentElement.querySelector(".invalid-select");
    if (feedbackElement) {
      feedbackElement.style.display = "none";
    }
  });

  selects.forEach((select) => {
    const feedbackElement =
      select.parentElement.querySelector(".invalid-select");

    if (!select.value || select.value === "Select Name") {
      isValid = true;
      validateInvalid(select, feedbackElement, "Please select a member");
    } else {
      validatevalid(select, feedbackElement);
      selectedUserIds.push(select.value);
      selectedUserNames.push(select.options[select.selectedIndex].text);
    }
  });
  if (isValid) {
    stopLoading('btn-add-member-project',  'btn-add-member-project-text', 'btn-add-member-project-spinner', 'Add Member');
    return;
  }

  const uniqueIds = new Set(selectedUserIds);
  if (uniqueIds.size !== selectedUserIds.length) {
    const firstSelect = selects[0];
    const feedbackElement =
      firstSelect.parentElement.querySelector(".invalid-select");
    validateInvalid(
      firstSelect,
      feedbackElement,
      "Please avoid selecting the same member multiple times"
    );
    stopLoading('btn-add-member-project',  'btn-add-member-project-text', 'btn-add-member-project-spinner', 'Add Member');
    return;
  }
  const projectAllID = getProjectID();

  try {
    const response = await fetch(
      `${baseApiUrl}/api/projects/member/${projectAllID}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: JSON.stringify(selectedUserIds),
        }),
      }
    );

    const data = await response.json();

    if (data.result === true) {
      closeclear();
      getAllMember();

      const countMember = selectedUserIds.length;
      const memberText  = countMember === 1 ? "member" : "members";
      let namesDisplay = "";
      if (countMember === 1) {  
        namesDisplay = selectedUserNames[0];
      } else if (countMember === 2) {  
        namesDisplay = selectedUserNames.join(" and ");
      } else {
        namesDisplay = selectedUserNames.slice(0, -1).join(", ") + ", and " + selectedUserNames[selectedUserNames.length - 1];
      }

      Swal.fire({
        icon: "success",
        title: "Add new member Successfully",
        position: "top-end",
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff",
      });
      stopLoading('btn-add-member-project',  'btn-add-member-project-text', 'btn-add-member-project-spinner', 'Add Member');
      createActivity("on project", `Have added <strong>${namesDisplay}</strong> to project`);
      $("#addMember").modal("hide");
    } else {
      stopLoading('btn-add-member-project',  'btn-add-member-project-text', 'btn-add-member-project-spinner', 'Add Member');
      return;
    }
  } catch (error) {
    stopLoading('btn-add-member-project',  'btn-add-member-project-text', 'btn-add-member-project-spinner', 'Add Member');
    return;
  }
}

// document.addEventListener("DOMContentLoaded", loadUsers);

function closeclear() {
  const formContainer = document.getElementById("form-container");
  formContainer.innerHTML = "";
  const defaultFormRow = document.createElement("div");
  defaultFormRow.classList.add("form-row", "mb-3");
  defaultFormRow.innerHTML = addmore();
  loadUsers();
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((message) => message.remove());
}

document
  .getElementById("addMember")
  .addEventListener("hidden.bs.modal", function () {
    closeclear();
  });

let removeMember = "";

async function deleteMemeber(button) {
  removeMember = button.dataset.id;
  const memberName = button.dataset.name || "Member";

  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this member from this project!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const response = await fetch(
        `${baseApiUrl}/api/projects/member/${removeMember}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
console.log("DELETE RESPONSE:", data);

      getAllMember();
      await Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
      createActivity("on project", `Have removed <strong>${memberName}</strong> from project`);
    }
  } catch (error) {
    return
  }
}
