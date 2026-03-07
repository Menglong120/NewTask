
let idstatus = "";
let statustest = /^.{2,255}$/;
async function createstauts() {
  startLoading('btn-create-status-project',  'btn-create-status-project-text', 'btn-create-status-project-spinner');
  const createStauts = document.querySelector("#inputStauts");
  const statusValue = createStauts.value;
  const invalidestatus = document.getElementById("invalid-status");
  let isValid = true;
  if (!statustest.test(statusValue)) {
    validateInvalid(
      createStauts,
      invalidestatus,
      "Invalid input. Plase Try again"
    );
    isValid = false;
  } else {
    validatevalid(createStauts, invalidestatus);
  }
  if (!isValid) {
    stopLoading('btn-create-status-project',  'btn-create-status-project-text', 'btn-create-status-project-spinner', 'Add Status');
    return;
  }
  try {
    const respone = await fetch(`${baseApiUrl}/api/projects/status`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: statusValue,
      }),
    });
    const data = await respone.json();
    if (data.result === true) {
      clearData(createStauts, invalidestatus);
      getallStauts();
      Swal.fire({
        icon: "success",
        title: "Create status Successfully",
        position: "top-end",
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff",
      });
      stopLoading('btn-create-status-project',  'btn-create-status-project-text', 'btn-create-status-project-spinner', 'Add Status');
      $("#addStatus").modal("hide");
    }
  } catch (error) {
    stopLoading('btn-create-status-project',  'btn-create-status-project-text', 'btn-create-status-project-spinner', 'Add Status');
  }
}

async function getallStauts() {
  try {
    const response = await fetch(
      `${baseApiUrl}/api/projects/status?search=&page=&perpage=`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    let showstatus = document.getElementById("showstatus");
    showstatus.innerHTML = "";

    const dataUser = await setDisble();

    // const disableDelete = data.data.datas.length === 1 ? "disabled" : "";
    // const disableUser = dataUser.data[0].role.id == 2 ? "disabled" : " ";

    const statusCount = data.data.datas.length;
    const userRoleId = dataUser?.data?.[0]?.role?.id;

    // Delete button should be DISABLED if ANY of these is true
    const shouldDisableDelete = 
      statusCount === 1 || 
      userRoleId === 2 || 
      statusCount <= 4;

    const disabledAttr = shouldDisableDelete ? "disabled" : "";

    if (!data.data.datas || data.data.datas.length === 0) {
      showstatus.innerHTML = "<p>No statuses available.</p>";
      return;
    }
    

    data.data.datas.forEach((ele) => {
      showstatus.innerHTML += `
                 <div class="status_defaul d-flex justify-content-between mb-3">
                     <div>
                         <p class="m-0 p-2">${ele.title}</p>
                     </div>
                     <div class="d-flex py-1 pe-2">
                         <button type="button" class="btn btn-primary btn-sm me-2" data-id='${ele.id}' data-title='${ele.title}' onclick="updateText(this)" data-bs-toggle="modal" data-bs-target="#editStatus" >
                             <i class='bx bxs-edit'></i>
                         </button>
                         <!-- Button trigger modal -->
                         <button class="btn btn-danger btn-sm" type="button" data-id='${ele.id}' onclick="deletestatus(this)" data-bs-toggle="modal" data-bs-target="#exampleModal222"  ${disabledAttr}>
                             <i class='bx bxs-trash'></i></i>
                         </button>
                         </div>
                        </div>`;
    });
  } catch (error) {
    return;
  }
}

getallStauts();
async function updateText(button) {
  idstatus = button.dataset.id;
  document.getElementById("editstatus").value = button.dataset.title;
}

async function updatestatus() {
  startLoading('btn-update-status-project',  'btn-update-status-project-text', 'btn-update-status-project-spinner');
  const editStauts = document.querySelector("#editstatus");
  const editValue = editStauts.value;
  const invalidedit = document.getElementById("invalid-edit");

  let isValid = true;
  if (!statustest.test(editValue)) {
    validateInvalid(editStauts, invalidedit, 'Invalid input. Plase Try again');
    isValid = false;
  } else {
    validatevalid(editStauts, invalidedit);
  }
  if (!isValid) {
    stopLoading('btn-update-status-project',  'btn-update-status-project-text', 'btn-update-status-project-spinner', 'Update');
    return;
  }

  try {
    const response = await fetch(
      `${baseApiUrl}/api/projects/status/${idstatus}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editValue,
        }),
      }
    );

    const data = await response.json();
    if (data.result === true) {
      $("#editStatus").modal("hide");
      Swal.fire({
        icon: "success",
        title: "Edit status Successfully",
        position: "top-end",
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff",
      });
      stopLoading('btn-update-status-project',  'btn-update-status-project-text', 'btn-update-status-project-spinner', 'Update');
      clearData(editStauts, invalidedit);
      getallStauts();
    }
  } catch (error) {
    // stopLoading('btn-update-status-project',  'btn-update-status-project-text', 'btn-update-status-project-spinner', 'Update');
    console.error(error);
    
  }
}

async function deletestatus(button) {
  idstatus = button.dataset.id;
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this status!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const response = await fetch(
        `${baseApiUrl}/api/projects/status/${idstatus}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (data.result === true) {
        getallStauts();
        await Swal.fire({
          title: "Deleted!",
          text: data.msg || "Status has been deleted successfully.",
          icon: "success",
        });
      } else {
        let errorMessage = data.msg || "Failed to delete status";
        if (data.data && data.data.length > 0) {
          
          const projectNames = data.data.map(p => p.name).join(', ');
          errorMessage += `<br><br><strong>Projects using this status:</strong><br>${projectNames}`;
        }
        
        await Swal.fire({
          title: "Cannot Delete!",
          html: errorMessage, 
          icon: "error",
          width: '600px' 
        });
      }
    }
  } catch (error) {
    console.error("Delete error:", error);
    await Swal.fire({
      title: "Error",
      text: "Something went wrong. Please try again later.",
      icon: "error",
    });
  }
}



document.addEventListener('click', (event) => {
  if (event.target.classList.contains('closebtn')) {
    clearProject();
  }
});

function clearProject() {
  clearData(document.querySelector("#inputStauts"),  document.getElementById("invalid-status"));
  clearData(document.querySelector("#editstatus"),document.getElementById("invalid-edit"));
}