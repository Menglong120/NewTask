let resources = [];
let quill;

let noteContent;
let idResource = '';

async function getAllResource() {
    const projectAllID = getProjectID();
    try {
        const response = await fetch(`${baseApiUrl}/api/projects/resources/${projectAllID}?search&perpage=&page=`, {
            method: 'GET'
        });
        const data = await response.json();
        resources = data.data.datas;

        let showDefault = document.getElementById('defaultResource');
        let showQuill = document.getElementById('quillResource');

        if (resources.length === 0) {
            showQuill.innerHTML = '';
            showDefault.innerHTML = `
                <div>
                    <div class="mt-5">
                        <h4 class="text-black">Create Resource</h4>
                        <p>Public note in one project to share issue problem.</p>
                    </div>
                    <div class="image-resource">
                        <div>
                            <img src="/img/task-management-process.png" alt="">
                        </div>
                    </div>
                    <div class="btn-create-resource d-flex justify-content-center my-3">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createResource1">
                            Create Resource
                        </button>
                    </div>
                </div>
            `;
        } else {
            showQuill.classList.add('d-block');
            showQuill.classList.remove('d-none');
            showQuill.innerHTML = `
                <div class="row bg-transparent">
                    <div class="col-12 col-lg-3 ps-0">
                        <div class="card shadow-sm px-2">
                            <div class="card-header d-flex justify-content-between align-items-center px-2">
                                <h5 class="text-dark fw-semibold m-0 p-0 resource-hide-overtext">${data.data.datas[0].project.name}</h5>
                                <button type="button" class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#createResource1">
                                    <i class='bx bx-plus'></i>
                                </button>
                            </div>
                            <div class="card-body px-3">
                                <div id="showTitle" class="mt-1">
                                
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-lg-9 custom-text shadow-sm border-0">
                        <div id="toolbar-container" class="border-0 px-0">
                            <span class="ql-formats pb-2">
                                <select class="ql-font font-comstom me-3"></select>
                                <select class="ql-size font-comstom"></select>
                            </span>
                            <span class="ql-formats border-left-costom pb-2">
                                <button class="ql-bold "></button>
                                <button class="ql-italic "></button>
                                <button class="ql-underline "></button>
                                <button class="ql-strike "></button>
                            </span>
                            <span class="ql-formats border-left-costom pb-2">
                                <select class="ql-color "></select>
                                <select class="ql-background "></select>
                            </span>
                            <span class="ql-formats border-left-costom pb-2">
                                <button class="ql-header " value="1"></button>
                                <button class="ql-header " value="2"></button>
                                <button class="ql-header"  value="3"></button>
                            </span>
                            <span class="ql-formats border-left-costom pb-2">
                                <button class="ql-list " value="ordered"></button>
                                <button class="ql-list " value="bullet"></button>
                                <button class="ql-indent " value="-1"></button>
                                <button class="ql-indent " value="+1"></button>
                            </span>
                            <span class="ql-formats border-left-costom pb-2">
                                <button class="ql-direction " value="rtl"></button>
                                <select class="ql-align "></select>
                            </span>
                             <span class="ql-formats border-left-costom pb-2">
                                <button class="ql-image" ></button>
                             </span>
                        </div>
                        <div data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-root-margin="0px 0px -40%"
                            data-bs-smooth-scroll="true" class="p-3 rounded-2" tabindex="0">
                            <div class="d-flex justify-content-between">
                                <div class="">
                                    <div>
                                    <input type="text" id="noteTitle" class="fs-4 fw-bold bg-transparent border-0 pt-0 mt-0 d-none" placeholder="Untitle"
                                        style="outline: none;">
                                        </div>
                                         <div class="invalid-feedback" id="invalid-noteTitle">
                                             Please fill in your email!
                                         </div>
                                </div>
                            </div>
                            <div id="editor" class="d-none"></div>
                            <div class="modal-footer border-0">
                                <button class="btn btn-primary px-4 d-none" id="btn-save-note" onclick="saveNote()">
                                    <div id="btn-save-note-spinner" class="spinner-border text-white spinner-border-sm me-2 d-none" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    <span id="btn-save-note-text">Save</span>
                                </button>
                            </div>
                            <div class="border-top showBorder d-none"></div>
                            <h5 class="text-dark fw-bold m-0 pt-4 d-none" id="allFile">All File Upload</h5>
                            <div id="showFiles"></div>
                        </div>
                    </div>
                </div>
            `;
                quill = new Quill("#editor", {
                    theme: "snow",
                    modules: {
                        toolbar: "#toolbar-container",
                    },
                });
        }

        let showTitles = document.getElementById('showTitle');
        showTitles.innerHTML = "";

        resources.forEach((res, index) => {
            showTitles.innerHTML += `
                <div class="title-resource d-flex justify-content-between mt-1">
                    <div class="title-hover">
                        <div>
                            <a href="javascript:void(0)" class="m-0 note-title fw-medium" data-id="${res.id}" data-index="${index}" onclick="showNote(event, ${index})">
                                <div class="d-flex">
                                    <i class='bx bx-notepad me-2' ></i>
                                    <p class="text-dark resource-title-hide-overtext">${res.title}</p>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div class="dropdown">
                        <button style="margin-top: -5px;" class="btn btn-outline border-0 px-0 mb-0" type="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class='bx bx-dots-horizontal-rounded'></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li style="border-bottom: #dfdfdf solid 0.5px; class="btn-list-hover ">
                                <button style="margin-top: -5px;" type="button"
                                    class="btn w-100 border-0 bg-transparent d-flex btn-ed-outline" data-bs-toggle="modal"
                                    data-bs-target="#editResource" data-id="${res.id}" data-title="${res.title}" onclick="editResource(this)">
                                    <p class="m-0 fs-6 py-1">
                                        <i class='bx bx-edit pe-1' style="margin-top: -5px;"></i> Rename
                                    </p>
                                </button>
                            </li>
                            <li style="border-bottom: #dfdfdf solid 0.5px; class="btn-list-hover ">
                                <button style="margin-top: -5px;" type="button"
                                    class="btn w-100 border-0 bg-transparent d-flex btn-ed-outline" data-bs-toggle="modal" data-bs-target="#modalScrollable"
                                       data-id="${res.id}" data-index="${index}" onclick="viewDetailNote(event, ${index})">
                                    <p class="m-0 fs-6 py-1">
                                        <i class="bx bx-show pe-1" style="margin-top: -5px;"></i> View Detail
                                    </p>
                                </button>
                            </li>
                            <li style="border-bottom: #dfdfdf solid 0.5px; class="btn-list-hover ">
                                <button style="margin-top: -5px;" type="button"
                                    class="btn w-100 border-0 bg-transparent d-flex btn-ed-outline" data-bs-toggle="modal"
                                    data-bs-target="#createLink" data-id="${res.id}" onclick="file(this)">
                                    <p class="m-0 fs-6 py-1">
                                    <i class='bx bxs-file-export pe-1' style="margin-top: -5px;"></i>Upload File
                                    </p>
                                </button>
                            </li>
                            <li class="btn-list-hover-delete">
                                <button type="button" class="btn w-100 border-0 bg-transparent d-flex btn-ed-outline"
                                    data-bs-toggle="modal" data-bs-target="#deleteModal123111" data-id="${res.id}" onclick="deleleResource(this)">
                                    <p class="m-0 fs-6 py-1"><i class='bx bx-trash' style="margin-top: -5px;"></i> Delete</p>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            `;


        });

    } catch (error) {
        return;
    }
}

function viewDetailNote(event, index) {
    let button = event.currentTarget;
    idResource = button.dataset.id;

    noteContent = resources[index].note;
    let noteTitle = document.getElementById("TitleView");
    let noteContentElement = document.getElementById("noteContentView");

    // Populate the modal or section with the note details
    if (noteTitle && noteContentElement) {
        noteTitle.value = resources[index].title;
        noteContentElement.innerHTML = noteContent;
    }
}
async function showNote(event, index) {
    let button = event.currentTarget;
    idResource = button.dataset.id;

    noteContent = resources[index].note;
    let noteTitle = document.getElementById("noteTitle");
    quill.root.innerHTML = noteContent;
    noteTitle.value = resources[index].title;
    noteTitle.classList.remove('d-none');

    let elementsToShow = [
        noteTitle,
        document.getElementById('btn-save-note'),
        document.getElementById('editor'),
        document.getElementById('allFile'),
        document.querySelector('.showBorder'),
    ];

    elementsToShow.forEach(el => el.classList.remove('d-none'));


    let fileContainer = document.getElementById("showFiles");
    fileContainer.innerHTML = "";

    try {

        const response = await fetch(`${baseApiUrl}/api/projects/resources/files/${idResource}?search&page&perpage`);


        const data = await response.json();

        if(data.data.file.datas[0].id === null){
            fileContainer.innerHTML = '<div class="mt-3">No files available.<div>';
            return
        }

        if (data.data.file.datas.length > 0) {

            data.data.file.datas.forEach(file => {
                let fileUrl = `/storage/${file.file_name}`; 
                
                fileContainer.innerHTML += `
                    <div class="file-item d-flex justify-content-between align-items-center my-3 pe-4">
                        <a href="${fileUrl}" target="_blank">
                            <i class='bx bx-file'></i> ${file.file_name_show}
                        </a>
                        <div>
                        <button class="btn btn-primary btn-sm" data-bs-toggle="modal"
                                data-bs-target="#editLink" data-id="${file.id}" 
                                data-file_name="${file.file_name}" data-file_name_show="${file.file_name_show}" onclick="editFile(this)">
                                <i class='bx bxs-edit'></i>
                        </button>
                         <button class="btn btn-success btn-sm" data-file_name="${file.file_name}" onclick="downloadFile(this)">
                            <i class='bx bx-cloud-download'></i>
                        </button>
                        <button class="btn btn-danger btn-sm" data-id="${file.id}"  onclick="deleteFiles(this)">
                            <i class="bx bx-trash"></i>
                        </button>
                        </div>
                    </div>
                `;
            });
        } else {
            fileContainer.innerHTML = `<p>No files uploaded.</p>`;
        }

    } catch (error) {
        return;
    }
}

function downloadFile(button) {
    let fileName = button.getAttribute('data-file_name');
    let fileUrl = `/storage/${fileName}`;
    
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}




async function saveNote() {
    startLoading('btn-save-note',  'btn-save-note-text', 'btn-save-note-spinner');
    const noteTitleValue = document.querySelector("#noteTitle").value; 
    const noteContent = quill.root.innerHTML;
    let InvalidTitle = document.getElementById('invalid-noteTitle');
    let isValid = true;


if (noteTitleValue === '') {
    validateInvalid(noteTitle, InvalidTitle, 'Please Input Title.');
    isValid = false;
} else {
    validatevalid(noteTitle, InvalidTitle);
}

if (!isValid) {
    stopLoading('btn-save-note', 'btn-save-note-text', 'btn-save-note-spinner', 'Save');
    return;
  }

    const imgTags = noteContent.match(/<img[^>]+src="([^">]+)"/g) || [];

    for (let imgTag of imgTags) {
        const base64Data = imgTag.match(/src="data:image\/[^;]+;base64,([^">]+)/);
        
        if (base64Data) {

            const decodedData = atob(base64Data[1]);
            const fileSize = decodedData.length; 

            if (fileSize > 712000) { // 50KB limit
                Swal.fire({
                    icon: "error",
                    title: "Image too large!",
                    text: "Please ensure all images are smaller than 700KB.",
                    toast: true,
                    position: "top-end",
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                stopLoading('btn-save-note', 'btn-save-note-text', 'btn-save-note-spinner', 'Save');
                return; // Stop save process
            }
        }
    }

    try {
        const response = await fetch(`${baseApiUrl}/api/projects/resource/${idResource}`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: noteTitleValue,
                note: noteContent
            }),
        });

        const data = await response.json();

        if (data.result === true) {
            getAllResource(); 
            Swal.fire({
                icon: "success",
                title: "Saved successfully!",
                position: "top-end",
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                background: "#fff",
            });
            stopLoading('btn-save-note',  'btn-save-note-text', 'btn-save-note-spinner', 'Save');
            createActivity("on resource note","Have been add new file resourece to")
        }
    } catch (error) {
        stopLoading('btn-save-note',  'btn-save-note-text', 'btn-save-note-spinner', 'Save');
    }
}


getAllResource();


async function file(button) {
    idResource = button.dataset.id
}


async function uploadFile() {
    startLoading('btn-upload-file', 'btn-upload-file-text', 'btn-upload-file-spinner');
    let fileInput = document.getElementById("fileInput");
    let file = fileInput.files[0];
    let InvalidFile = document.getElementById('invalid-file');
    let isValid =true;

    if (!file) {
        validateInvalid(fileInput, InvalidFile, 'Please choose a file.');
        isValid = false;
    } else {
        validatevalid(fileInput, InvalidFile);
    }
    
    if (!isValid) {
        stopLoading('btn-upload-file', 'btn-upload-file-text', 'btn-upload-file-spinner', 'Upload');
        return;
    }

    if(!file){
        stopLoading('btn-upload-file', 'btn-upload-file-text', 'btn-upload-file-spinner', 'Upload');
        return;
    }

    let formData = new FormData();
    formData.append("resource_file", file);
    try {
        const response = await fetch(`${baseApiUrl}/api/projects/resources/file/${idResource}`, {
            method: "POST",
            body: formData, 
        });

        const data = await response.json();

        if (data.result === true) {
            Swal.fire({
                icon: "success",
                title: "File uploaded successfully!",
                position: "top-end",
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                background: "#fff",
            });
            clearProject();
            $('#createLink').modal('hide');
            stopLoading('btn-upload-file', 'btn-upload-file-text', 'btn-upload-file-spinner', 'Upload');
            getAllResource(); 
            createActivity("on resource","has added a new file resource to")
            fileInput.value = ""; 
        } else {
            stopLoading('btn-upload-file', 'btn-upload-file-text', 'btn-upload-file-spinner', 'Upload');
        }
    } catch (error) {
        stopLoading('btn-upload-file', 'btn-upload-file-text', 'btn-upload-file-spinner', 'Upload');
    }
}

let idFile;

 function editFile(button){
    idFile = button.dataset.id;
    let fileName = button.dataset.file_name_show;

    document.getElementById('fileEditLabel').textContent = fileName;   
}

async function editFiles(){
    startLoading('btn-edit-file',  'btn-edit-file-text', 'btn-edit-file-spinner');
    let fileEdit = document.getElementById("fileEdit");
    let file = fileEdit.files[0];
    let invalidfileEdit = document.getElementById('invalid-editfile');
    let isValid = true;

    if (!file) {
        validateInvalid(fileEdit, invalidfileEdit, 'Please choose a file.');
        isValid = false;
    } else {
        validatevalid(fileEdit, invalidfileEdit);
    }
    
    if (!isValid) {
        stopLoading('btn-edit-file',  'btn-edit-file-text', 'btn-edit-file-spinner', 'Update');
        return;
    }


    if(!file){
        stopLoading('btn-edit-file',  'btn-edit-file-text', 'btn-edit-file-spinner', 'Update');
        return;
    }

    let formData = new FormData();
    formData.append("new_file", file);

    try{
        const responseFile = await fetch(`${baseApiUrl}/api/projects/resources/file/${idFile}`,{
            method: "PUT",
            body : formData
        })
        const data = await responseFile.json();

        if (data.result === true) {
            Swal.fire({
                icon: "success",
                title: "File uploaded successfully!",
                position: "top-end",
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                background: "#fff",
            });
            clearProject();
            stopLoading('btn-edit-file',  'btn-edit-file-text', 'btn-edit-file-spinner', 'Update');
            $('#editLink').modal('hide');
            getAllResource(); 
            createActivity("on resource","has edited the resource file on")
            fileEdit.value = ""; 
        }

    }catch (error) {
        stopLoading('btn-edit-file',  'btn-edit-file-text', 'btn-edit-file-spinner', 'Update');
        return;
    }
    
}

async function deleteFiles(button) {
    idFile = button.dataset.id;
    try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You want to delete this project!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        });
    
       if(result.isConfirmed){
        const response = await fetch(`${baseApiUrl}/api/projects/resources/file/${idFile}`,{
          method : 'DELETE',
        })
        await response.json();
        getAllResource();
        await Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
        createActivity("on resource"," has deleted the resource note file on")
       }
        
    
      }catch (error) {
        return;
      }
}


async function createResource() {
    startLoading('btn-create-resource',  'btn-create-resource-text', 'btn-create-resource-spinner');
    const projectAllID = getProjectID();
    const title = document.querySelector('#titleResource');
    const titleValue = title.value.trim();
    const invalidResource = document.getElementById('invalid-resource');

    let isValid = true;

    if(titleValue === ''){
        validateInvalid(title, invalidResource, 'Invalid Resource. Please try again.');
        stopLoading('btn-create-resource',  'btn-create-resource-text', 'btn-create-resource-spinner', `Create`);
        isValid = false;
    }
    else{
        validatevalid(title, invalidResource);
    }
    if(!isValid){
        stopLoading('btn-create-resource',  'btn-create-resource-text', 'btn-create-resource-spinner', `Create`);
        return;
    }

    try{
        const response = await fetch(`${baseApiUrl}/api/projects/resource/${projectAllID}`,{
            method : 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body : JSON.stringify({
                title : titleValue,

            })
        })
        const data = await response.json();

        if(data.result === true){
            getAllResource();
            clearProject();
            let showDefault = document.getElementById('defaultResource');
            showDefault.classList.add('d-none');
            $('#createResource1').modal('hide');
            Swal.fire({
                icon: "success",
                title: "Create Resource Successfully",
                position: "top-end",
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                background: "#fff",
            });
            createActivity("on resource","has added a new note resource to")
            stopLoading('btn-create-resource',  'btn-create-resource-text', 'btn-create-resource-spinner', `Create`);
        }
    }catch (error) {
        return;
    }
}

async function editResource(button) {
    idResource = button.dataset.id;
    document.getElementById('editresource').value = button.dataset.title;
    
}

async function editResources() {
    startLoading('btn-edit-resource',  'btn-edit-resource-text', 'btn-edit-resource-spinner');
    const titleedit = document.querySelector('#editresource');
    const titleeditValue = titleedit.value;
    const invalideditResource = document.getElementById('invalid-editresource');

    let isValid = true;

    if(titleeditValue === ''){
        validateInvalid(titleedit, invalideditResource, 'Invalid Resource. Please try again.');
        stopLoading('btn-edit-resource',  'btn-edit-resource-text', 'btn-edit-resource-spinner', 'Update');
        isValid = false;
    }
    else{
        validatevalid(titleedit, invalideditResource);
    }
    if(!isValid){
        stopLoading('btn-edit-resource',  'btn-edit-resource-text', 'btn-edit-resource-spinner', 'Update');
        return;
    }

    try {
        const response = await fetch(`${baseApiUrl}/api/projects/resource/${idResource}`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: titleeditValue
            }),
        });

        const data = await response.json();

        if (data.result === true) {
            getAllResource(); 
            clearProject();
            $('#editResource').modal('hide');
            Swal.fire({
                icon: "success",
                title: "Edit Rescource successfully!",
                position: "top-end",
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                background: "#fff",
            });
            stopLoading('btn-edit-resource',  'btn-edit-resource-text', 'btn-edit-resource-spinner', 'Update');
            createActivity("on resource","has edited the resource noted on")
        }
    } catch (error) {
        return;
    }
}


async function deleleResource(button) {
    idResource = button.dataset.id;
    try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You want to delete this project!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        });
    
       if(result.isConfirmed){
        const response = await fetch(`${baseApiUrl}/api/projects/resource/${idResource}`,{
          method : 'DELETE',
        })
        await response.json();
        getAllResource();
        window.location.reload();
        
        await Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
        reateActivity("on resource"," has deleted the resource noted")
       }
        
    }catch (error) {
        return;
    }
}

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('closebtn')) {
      clearProject();
    }
});
  
function clearProject() {
    clearData(document.querySelector("#titleResource"), document.getElementById("invalid-resource"));
    clearData(document.querySelector("#editresource"), document.getElementById("invalid-editresource"));
    clearData(document.getElementById("fileInput"),document.getElementById("invalid-file"));
    clearData(document.getElementById("fileEdit"),document.getElementById('invalid-editfile'));
}
  
