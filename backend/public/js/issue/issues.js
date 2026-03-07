// const { emit } = require("nodemon");

(async function () {
    const cateId = localStorage.getItem('categoryID');
    await getAllIssues();
    await createIssueModal(cateId);
    
})();

let quill, subquill, editnotequill, issueIdForAct = 0;

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".btn-comment-note").addEventListener("click", async function () {
        let noteContent = '';
        startLoading('btn-add-issue-comment-note', 'btn-add-issue-note-text', 'btn-add-issue-note-spinner');
        noteContent = quill.root.innerHTML.trim();

        if (!noteContent) {
            Swal.fire({
                icon: "error",
                title: "Image too large!",
                text: "Please ensure all images are smaller than 500KB.",
                toast: true,
                position: "top-end",
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
            });
            stopLoading('btn-add-issue-comment-note', 'btn-add-issue-note-text', 'btn-add-issue-note-spinner', `Comment <i class='bx bx-send fs-7'></i>`);
            return;
        }

        const imgTags = noteContent.match(/<img[^>]+src="([^">]+)"/g) || [];
        let imgSize = 0;
        for (let imgTag of imgTags) {
            const base64Data = imgTag.match(/src="data:image\/[^;]+;base64,([^">]+)/);
            
            if (base64Data) {
                const decodedData = atob(base64Data[1]);
                const fileSize = decodedData.length;
                imgSize += fileSize;
                if (fileSize > 512000) { // 500KB limit
                    Swal.fire({
                        icon: "error",
                        title: "Image too large!",
                        text: "Please ensure all images are smaller than 500KB.",
                        toast: true,
                        position: "top-end",
                        timer: 3000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    });
                    stopLoading('btn-add-issue-comment-note', 'btn-add-issue-note-text', 'btn-add-issue-note-spinner', `Comment <i class='bx bx-send fs-7'></i>`);
                    return; // Stop save process
                }
            }
        }
        if(imgSize > 712000){
            Swal.fire({
                icon: "error",
                title: "Image too large!",
                text: "Please refresh page to try again. (Ensure total size is smaller than 700KB.)",
                toast: true,
                position: "top-end",
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
            });
            stopLoading('btn-add-issue-comment-note', 'btn-add-issue-note-text', 'btn-add-issue-note-spinner', `Comment <i class='bx bx-send fs-7'></i>`);
            return; // Stop save process
        }

        try {
            const issueId = this.dataset.issue;
            const response = await createIssueNote(issueId, noteContent);
            if (response.result) {
                getDetailIssueOffcanvas(issueId);
                quill.setContents([]);
                Swal.fire({
                    icon: "success",
                    title: "Noted something successfully!",
                    position: "top-end",
                    toast: true,
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    background: "#fff",
                });
                stopLoading('btn-add-issue-comment-note', 'btn-add-issue-note-text', 'btn-add-issue-note-spinner', `Comment <i class='bx bx-send fs-7'></i>`);
                createActivity("Issue Notes", "noted something new of ");
                createIssueActivity(issueId, "Noted", `Noted something on issue `);
                getDetailIssueOffcanvas(issueId);
            }
        } catch (error) {
            stopLoading('btn-add-issue-comment-note', 'btn-add-issue-note-text', 'btn-add-issue-note-spinner', `Comment <i class='bx bx-send fs-7'></i>`);
            return;
        }
    });
    document.querySelector(".btn-comment-subissue").addEventListener("click", async function () {
        startLoading('btn-add-sub-issue-comment', 'btn-add-sub-issue-comment-text', 'btn-add-sub-issue-comment-spinner');
        const commentContent = subquill.root.innerHTML.trim(); // Get content
    
        if (!commentContent) {
            stopLoading('btn-add-sub-issue-comment', 'btn-add-sub-issue-comment-text', 'btn-add-sub-issue-comment-spinner', 'Save');
            return;
        }
    
        const subIssueId = this.dataset.subissue; // Get subissue ID from button
    
        if (!subIssueId) {
            stopLoading('btn-add-sub-issue-comment', 'btn-add-sub-issue-comment-text', 'btn-add-sub-issue-comment-spinner', 'Save');
            return;
        }

        const response = await invokeChangeSubComment(
            subIssueId, 
            commentContent, 
            getAllIssues, 
            getDetailSubIssueOffcanvas, 
            subIssueId
        );

        if (response.result) {
            
            Swal.fire({
                icon: "success",
                title: "Comment saved successfully!",
                position: "top-end",
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                background: "#fff",
            });
            stopLoading('btn-add-sub-issue-comment', 'btn-add-sub-issue-comment-text', 'btn-add-sub-issue-comment-spinner', 'Save');
            createActivity("Sub-issue comments", "commented something on sub-issue of ");
            const subIssueRes = await fetchDetailSubIssue(subIssueId);
            if(subIssueRes !== null){
                createIssueActivity(issueIdForAct, "Noted", `Commented something on sub-issue ( ${subIssueRes.sub_issues.name} ) of issue `);
            }
        }
    });
});

function initializeQuill() {
    if (!quill) {
        quill = new Quill("#note-editor", {
            modules: {
                syntax: true,
                toolbar: "#toolbar-container",
            },
            placeholder: "Compose an epic...",
            theme: "snow",
        });

        quill.on("text-change", applyBootstrapToQuillImages);
    }
}

function applyBootstrapToQuillImages() {
    document.querySelectorAll(".ql-editor img").forEach((img) => {
        img.classList.add("img-fluid", "rounded");
    });
}

async function createIssueModal(cateId){
    const resCategory = await fetchDetailCategory(cateId);
    if(resCategory === null){
        document.getElementById('modal-main-compo').innerHTML = "";
    } else {
        document.getElementById('modal-main-compo').innerHTML = `
            <span class=" py-2 px-3 rounded-2" style="background-color:rgb(202, 229, 250) ;">
                <i class='bx bx-box fs-5 me-1'></i>
                ${resCategory.project.name}
            </span>
            <span class=" py-2 px-3 rounded-2 ms-2" id="createIssueCateId" data-id="${resCategory.category.id}" style="background-color:rgb(202, 229, 250) ;">
                <i class='bx bx-customize fs-5 me-1'></i>
                ${resCategory.category.name}
            </span>
        `;

        const projectId = resCategory.project.id;
        const resStatus = await fetchAllIssueStatus(projectId);
        const resPriority = await fetchAllPriority(projectId);
        const resTracker = await fetchAllTracker(projectId);
        const resLabel = await fetchAllLabel(projectId);
        const resMember = await fetchAllMember(projectId, '', '', '');

        let statusElement = resStatus.map(status => 
            `<li><a class="dropdown-item" onclick="selectProperties(this, 'createIssueStatusProp')" data-value="${status.id}">${status.name}</a></li>`
        ).join('');

        let priorityElement = resPriority.map(priority => 
            `<li><a class="dropdown-item" onclick="selectProperties(this, 'createIssuePriorityProp')" data-value="${priority.id}">${priority.name}</a></li>`
        ).join('');

        let trackerElement = resTracker.map(tracker => 
            `<li><a class="dropdown-item" onclick="selectProperties(this, 'createIssueTrackerProp')" data-value="${tracker.id}">${tracker.name}</a></li>`
        ).join('');

        let labelElement = resLabel.map(label => 
            `<li><a class="dropdown-item" onclick="selectProperties(this, 'createIssueLabelProp')" data-value="${label.id}">${label.name}</a></li>`
        ).join('');

        let memberElement = resMember !== null ? resMember.datas.map(assignee => 
            `<li><a class="dropdown-item" onclick="selectProperties(this, 'createIssueAssigneeProp')" data-value="${assignee.user.id}">${assignee.user.dis_name}</a></li>`
        ).join('') : '';

        document.getElementById('create-issue-property').innerHTML = `
            <div id="statusDropdown" class="dropdown me-1 mb-2">
                <button
                    class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center"
                    type="button" data-bs-toggle="dropdown">
                    <i class='bx bx-loader-alt'></i> <span class="ps-1" id="createIssueStatusProp" data-value="${resStatus[0].id}">${resStatus[0].name}</span>
                </button>
                <ul class="dropdown-menu modal-dropdown-menu">
                    <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${cateId}')"></li>
                    ${statusElement}
                </ul>
            </div>

            <div id="priorityDropdown" class="dropdown me-1 mb-2">
                <button
                    class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center"
                    type="button" data-bs-toggle="dropdown">
                    <i class='bx bx-flag'></i> <span class="ps-1" id="createIssuePriorityProp" data-value="${resPriority[0].id}">${resPriority[0].name}</span>
                </button>
                <ul class="dropdown-menu modal-dropdown-menu">
                    <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${cateId}')"></li>
                    ${priorityElement}
                </ul>
            </div>

            <div id="trackerDropdown" class="dropdown me-1 mb-2">
                <button
                    class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center"
                    type="button" data-bs-toggle="dropdown">
                    <i class='bx bx-target-lock'></i> <span class="ps-1" id="createIssueTrackerProp" data-value="${resTracker[0].id}">${resTracker[0].name}</span>
                </button>
                <ul class="dropdown-menu modal-dropdown-menu">
                    <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${cateId}')"></li>
                    ${trackerElement}
                </ul>
            </div>

            <div id="labelDropdown" class="dropdown me-1 mb-2">
                <button
                    class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center"
                    type="button" data-bs-toggle="dropdown">
                    <i class='bx bx-label'></i> <span class="ps-1" id="createIssueLabelProp" data-value="${resLabel[0].id}">${resLabel[0].name}</span>
                </button>
                <ul class="dropdown-menu modal-dropdown-menu">
                    <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${cateId}')"></li>
                    ${labelElement}
                </ul>
            </div>

            <div class="me-1 mb-2">
                <div class="input-group date">
                    <input type="text" class="form-control border-primary text-primary" id="createIssueStartDate"
                        placeholder="Select a date">
                    <button class="btn btn-date-icon border-primary" id="createIssueStartDateIcon">
                        <i class='bx bx-calendar-plus text-primary'></i>
                    </button>
                </div>
            </div>
            <div class="me-1 mb-2">
                <div class="input-group date">
                    <input type="text" class="form-control border-primary text-primary" id="createIssueDueDate"
                        placeholder="Select a date">
                    <button class="btn btn-date-icon border-primary" id="createIssueDueDateIcon">
                        <i class='bx bx-calendar-check text-primary'></i>
                    </button>
                </div>
            </div>
            <div class="dropdown me-1 mb-2">
                <button
                    class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center"
                    type="button" data-bs-toggle="dropdown">
                    <i class='bx bx-user-pin'></i>
                    <span class="ps-1" id="createIssueAssigneeProp" data-value="0">Assignee</span>
                </button>
                <ul class="dropdown-menu modal-dropdown-menu">
                    <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${cateId}')"></li>
                    ${memberElement}
                </ul>
            </div>
        `;

        $(document).ready(function () {
            $('#createIssueStartDate').datepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            }).on('changeDate', async function (e) {
                const selectedDate = $(this).val();
            });
    
            $('#createIssueStartDateIcon').click(function () {
                $('#createIssueStartDate').datepicker('show');
            });
        });
        $(document).ready(function () {
            $('#createIssueDueDate').datepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            }).on('changeDate', async function (e) {
                const selectedDate = $(this).val();
            });
            $('createIssueDueDateIcon').click(function () {
                $('#createIssueDueDate').datepicker('show');
            });
        });
    }
}

function onInputIssueProgress(element, showElement){
    const value = document.getElementById(element).value;
    document.getElementById(showElement).innerHTML = Number(value * 10) + '%';
}

async function updateIssueModal(issueId){
    const resIssue = await fetchDetailIssue(issueId);
    if(resIssue === null){
        document.getElementById('modal-update-main-compo').innerHTML = "";
    } else {
        document.getElementById('updateIssueNameValidate').classList.remove('d-flex');
        document.getElementById('updateIssueNameValidate').classList.add('d-none');
        document.getElementById('updateIssueName').classList.remove('border-danger');
        document.getElementById('modal-update-main-compo').innerHTML = `
            <span class=" py-2 px-3 rounded-2" style="background-color:rgb(202, 229, 250) ;">
                <i class='bx bx-box fs-5 me-1'></i>
                ${resIssue.project.name}
            </span>
            <span class=" py-2 px-3 rounded-2 ms-2" id="updateIssueCateId" data-id="${resIssue.issues.category.id}" data-issue="${resIssue.issues.id}" style="background-color:rgb(202, 229, 250) ;">
                <i class='bx bx-customize fs-5 me-1'></i>
                ${resIssue.issues.category.name}
            </span>
        `;
        document.getElementById('updateIssueName').value = resIssue.issues.name;
        document.getElementById('updateIssueDescription').value = resIssue.issues.description;

        const issueProgress = resIssue.issues.progress == 0 ? 0 : resIssue.issues.progress / 10;
        document.getElementById('updateIssueProgressModal').innerHTML = `
            <label for="updateIssueProgress" class="pe-3">Progress</label>
            <input type="range" class="form-range px-2" min="0" max="10" value="${issueProgress}" oninput="onInputIssueProgress('updateIssueProgress', 'issueProgressValue')" id="updateIssueProgress" />
            <span class="ps-3" id="issueProgressValue">${Number(resIssue.issues.progress)}%</span>
        `;

        const projectId = resIssue.project.id;
        const resStatus = await fetchAllIssueStatus(projectId);
        const resPriority = await fetchAllPriority(projectId);
        const resTracker = await fetchAllTracker(projectId);
        const resLabel = await fetchAllLabel(projectId);
        const resMember = await fetchAllMember(projectId, '', '', '');

        let statusElement = resStatus.map(status => 
            `<li><a class="dropdown-item" onclick="selectProperties(this, 'updateIssueStatusProp')" data-value="${status.id}">${status.name}</a></li>`
        ).join('');

        let priorityElement = resPriority.map(priority => 
            `<li><a class="dropdown-item" onclick="selectProperties(this, 'updateIssuePriorityProp')" data-value="${priority.id}">${priority.name}</a></li>`
        ).join('');

        let trackerElement = resTracker.map(tracker => 
            `<li><a class="dropdown-item" onclick="selectProperties(this, 'updateIssueTrackerProp')" data-value="${tracker.id}">${tracker.name}</a></li>`
        ).join('');

        let labelElement = resLabel.map(label => 
            `<li><a class="dropdown-item" onclick="selectProperties(this, 'updateIssueLabelProp')" data-value="${label.id}">${label.name}</a></li>`
        ).join('');

        let memberElement = resMember !== null ? resMember.datas.map(assignee => 
            `<li><a class="dropdown-item" onclick="selectProperties(this, 'updateIssueAssigneeProp')" data-value="${assignee.user.id}">${assignee.user.dis_name}</a></li>`
        ).join('') : '';

        document.getElementById('update-issue-property').innerHTML = `
            <div id="statusDropdown" class="dropdown me-1 mb-2">
                <button
                    class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center"
                    type="button" data-bs-toggle="dropdown">
                    <i class='bx bx-loader-alt'></i> <span class="ps-1" id="updateIssueStatusProp" data-value="${resIssue.issues.status.id}">${resIssue.issues.status.name}</span>
                </button>
                <ul class="dropdown-menu modal-dropdown-menu">
                    <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${issueId}')"></li>
                    ${statusElement}
                </ul>
            </div>

            <div id="priorityDropdown" class="dropdown me-1 mb-2">
                <button
                    class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center"
                    type="button" data-bs-toggle="dropdown">
                    <i class='bx bx-flag'></i> <span class="ps-1" id="updateIssuePriorityProp" data-value="${resIssue.issues.priority.id}">${resIssue.issues.priority.name}</span>
                </button>
                <ul class="dropdown-menu modal-dropdown-menu">
                    <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${issueId}')"></li>
                    ${priorityElement}
                </ul>
            </div>

            <div id="trackerDropdown" class="dropdown me-1 mb-2">
                <button
                    class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center"
                    type="button" data-bs-toggle="dropdown">
                    <i class='bx bx-target-lock'></i> <span class="ps-1" id="updateIssueTrackerProp" data-value="${resIssue.issues.tracker.id}">${resIssue.issues.tracker.name}</span>
                </button>
                <ul class="dropdown-menu modal-dropdown-menu">
                    <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${issueId}')"></li>
                    ${trackerElement}
                </ul>
            </div>

            <div id="labelDropdown" class="dropdown me-1 mb-2">
                <button
                    class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center"
                    type="button" data-bs-toggle="dropdown">
                    <i class='bx bx-label'></i> <span class="ps-1" id="updateIssueLabelProp" data-value="${resIssue.issues.label.id}">${resIssue.issues.label.name}</span>
                </button>
                <ul class="dropdown-menu modal-dropdown-menu">
                    <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${issueId}')"></li>
                    ${labelElement}
                </ul>
            </div>

            <div class="me-1 mb-2">
                <div class="input-group date">
                    <input type="text" class="form-control border-primary text-primary" id="updateIssueStartDate"
                        placeholder="Select a date">
                    <button class="btn btn-date-icon border-primary" id="updateIssueStartDateIcon">
                        <i class='bx bx-calendar-plus text-primary'></i>
                    </button>
                </div>
            </div>
            <div class="me-1 mb-2">
                <div class="input-group date">
                    <input type="text" class="form-control border-primary text-primary" id="updateIssueDueDate"
                        placeholder="Select a date">
                    <button class="btn btn-date-icon border-primary" id="updateIssueDueDateIcon">
                        <i class='bx bx-calendar-check text-primary'></i>
                    </button>
                </div>
            </div>
            <div class="dropdown me-1 mb-2">
                <button
                    class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center"
                    type="button" data-bs-toggle="dropdown">
                    <i class='bx bx-user-pin'></i>
                    <span class="ps-1" id="updateIssueAssigneeProp" data-value="${resIssue.issues.assignee.id == null ? 0 : resIssue.issues.assignee.id}">${resIssue.issues.assignee.id == null ? 'Assignee' : resIssue.issues.assignee.dis_name}</span>
                </button>
                <ul class="dropdown-menu modal-dropdown-menu">
                    <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${issueId}')"></li>
                    ${memberElement}
                </ul>
            </div>
        `;

        $(document).ready(function () {
            if(resIssue.issues.start_date !== null) {
                const dateObj = new Date(resIssue.issues.start_date);
                const start_date = dateObj.toLocaleDateString('en-CA'); 
                $('#updateIssueStartDate').val(start_date);
            }
            $('#updateIssueStartDate').datepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            });
            $('#updateIssueStartDateIcon').click(function () {
                $('#updateIssueStartDate').datepicker('show');
            });
        });
        $(document).ready(function () {
            if(resIssue.issues.due_date !== null) {
                const dateObj = new Date(resIssue.issues.due_date);
                const due_date = dateObj.toLocaleDateString('en-CA'); 
                $('#updateIssueDueDate').val(due_date);
            }
            $('#updateIssueDueDate').datepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            });
            $('updateIssueDueDateIcon').click(function () {
                $('#updateIssueDueDate').datepicker('show');
            });
        });
    }
}

async function openUpdateIssueModal(issueId){
    await updateIssueModal(issueId);
    let modalUpdateIssue = document.getElementById('editIssue');
    let modal = new bootstrap.Modal(modalUpdateIssue);
    modal.show();
}

function onInputRequireString(inputId, validateId, validateLength, massage){
    const data = String(document.getElementById(inputId).value);
    if(data.length <= 0){
        document.getElementById(validateId).innerHTML = `<span>${massage.require}</span>`;
        document.getElementById(validateId).classList.add('d-flex');
        document.getElementById(validateId).classList.remove('d-none');
        document.getElementById(inputId).classList.add('border-danger');
        return;
    } else if (data.length > 0 && data.length < 2){
        document.getElementById(validateId).innerHTML = `<span>${massage.needdata}</span>`;
        document.getElementById(validateId).classList.add('d-flex');
        document.getElementById(validateId).classList.remove('d-none');
        document.getElementById(inputId).classList.add('border-danger');
        return;
    } else if (data.length > validateLength){
        document.getElementById(validateId).innerHTML = `<span>${massage.overdata}</span>`;
        document.getElementById(validateId).classList.add('d-flex');
        document.getElementById(validateId).classList.remove('d-none');
        return;
    } else {
        document.getElementById(validateId).innerHTML = '';
        document.getElementById(validateId).classList.remove('d-flex');
        document.getElementById(validateId).classList.add('d-none');
        document.getElementById(inputId).classList.remove('border-danger');
    }
}

async function createIssueClicked() {
    startLoading('btn-create-issue', 'btn-create-issue-text', 'btn-create-issue-spinner');
    const cateId = document.getElementById('createIssueCateId').dataset.id;
    const startDate = $('#createIssueStartDate').datepicker('getFormattedDate');
    const dueDate = $('#createIssueDueDate').datepicker('getFormattedDate');
    const assignee = document.getElementById('createIssueAssigneeProp').dataset.value == 0 ? "" : document.getElementById('createIssueAssigneeProp').dataset.value;
    const name = document.getElementById('createIssueName').value;
    if(name.length <= 0){
        document.getElementById('createIssueNameValidate').innerHTML = `<span>Issue name is required..!</span>`;
        document.getElementById('createIssueNameValidate').classList.add('d-flex');
        document.getElementById('createIssueNameValidate').classList.remove('d-none');
        document.getElementById('createIssueName').classList.add('border-danger');
        stopLoading('btn-create-issue', 'btn-create-issue-text', 'btn-create-issue-spinner', 'Save');
        return;
    } else if(name.length > 0 && name.length < 2){
        document.getElementById('createIssueNameValidate').innerHTML = `<span>Issue name need to be more than 1 characters!</span>`;
        document.getElementById('createIssueNameValidate').classList.add('d-flex');
        document.getElementById('createIssueNameValidate').classList.remove('d-none');
        document.getElementById('createIssueName').classList.add('border-danger');
        stopLoading('btn-create-issue', 'btn-create-issue-text', 'btn-create-issue-spinner', 'Save');
        return;
    } else if(name.length > 255){
        document.getElementById('createIssueNameValidate').innerHTML = `<span>Issue name cannot be more than 255 characters..!</span>`;
        document.getElementById('createIssueNameValidate').classList.add('d-flex');
        document.getElementById('createIssueNameValidate').classList.remove('d-none');
        stopLoading('btn-create-issue', 'btn-create-issue-text', 'btn-create-issue-spinner', 'Save');
        return;
    } else {
        document.getElementById('createIssueNameValidate').innerHTML = '';
        document.getElementById('createIssueNameValidate').classList.remove('d-flex');
        document.getElementById('createIssueNameValidate').classList.add('d-none');
        document.getElementById('createIssueName').classList.remove('border-danger');
    }
    const createIssueData = {
        name: name,
        description: String(document.getElementById('createIssueDescription').value),
        start_date: startDate,
        due_date: dueDate,
        status_id: document.getElementById('createIssueStatusProp').dataset.value,
        priority_id: document.getElementById('createIssuePriorityProp').dataset.value,
        tracker_id: document.getElementById('createIssueTrackerProp').dataset.value,
        label_id: document.getElementById('createIssueLabelProp').dataset.value,
        assignee: assignee,
    }
    const res = await createIssue(cateId, createIssueData);
    if(res.result){
        getAllIssues();
        createIssueModal(cateId);
        Swal.fire({
            icon: "success",
            title: "Created an issue successfully!",
            position: "top-end",
            toast: true,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            background: "#fff",
        });
        document.getElementById('createIssueName').value = '';
        document.getElementById('createIssueDescription').value = '';
        let modalCreateIssue = document.getElementById('createIssue');
        let modal = bootstrap.Modal.getInstance(modalCreateIssue);
        if (!modal) {
            modal = new bootstrap.Modal(modalCreateIssue); // Create a new instance if it doesn't exist
        }
        stopLoading('btn-create-issue', 'btn-create-issue-text', 'btn-create-issue-spinner', 'Save');
        modal.hide();
        createActivity("Issue Action", `created an new issue - ${name} of`);
    }
}

async function updateIssueClicked(){
    startLoading('btn-edit-issue', 'btn-edit-issue-text', 'btn-edit-issue-spinner');
    const issueId = document.getElementById('updateIssueCateId').dataset.issue;
    const startDate = $('#updateIssueStartDate').datepicker('getFormattedDate');
    const dueDate = $('#updateIssueDueDate').datepicker('getFormattedDate');
    const assignee = Number(document.getElementById('updateIssueAssigneeProp').dataset.value) == 0 ? "" : Number(document.getElementById('updateIssueAssigneeProp').dataset.value);
    const name = document.getElementById('updateIssueName').value;
    const progress = Number(document.getElementById('updateIssueProgress').value) === 0 ? 0 : Number(document.getElementById('updateIssueProgress').value) * 10;
    if(name.length <= 0){
        document.getElementById('updateIssueNameValidate').innerHTML = `<span>Issue name is required..!</span>`;
        document.getElementById('updateIssueNameValidate').classList.add('d-flex');
        document.getElementById('updateIssueNameValidate').classList.remove('d-none');
        document.getElementById('updateIssueName').classList.add('border-danger');
        return;
    } else if (name.length > 0 && name.length < 2){
        document.getElementById('updateIssueNameValidate').innerHTML = `<span>Issue name is need to be more than 1 characters!</span>`;
        document.getElementById('updateIssueNameValidate').classList.add('d-flex');
        document.getElementById('updateIssueNameValidate').classList.remove('d-none');
        document.getElementById('updateIssueName').classList.add('border-danger');
        return;
    } else if (name.length > 255){
        document.getElementById('updateIssueNameValidate').innerHTML = `<span>Issue name cannot be more than 255 characters..!</span>`;
        document.getElementById('updateIssueNameValidate').classList.add('d-flex');
        document.getElementById('updateIssueNameValidate').classList.remove('d-none');
        return;
    } else {
        document.getElementById('updateIssueNameValidate').innerHTML = '';
        document.getElementById('updateIssueNameValidate').classList.remove('d-flex');
        document.getElementById('updateIssueNameValidate').classList.add('d-none');
        document.getElementById('updateIssueName').classList.remove('border-danger');
    }
    const updateIssueData = {
        name: name,
        description: String(document.getElementById('updateIssueDescription').value),
        progress: progress,
        start_date: startDate,
        due_date: dueDate,
        status_id: Number(document.getElementById('updateIssueStatusProp').dataset.value),
        priority_id: Number(document.getElementById('updateIssuePriorityProp').dataset.value),
        tracker_id: Number(document.getElementById('updateIssueTrackerProp').dataset.value),
        label_id: Number(document.getElementById('updateIssueLabelProp').dataset.value),
        assignee: assignee,
    }
    const res = await updateIssue(issueId, updateIssueData);
    if(res.result){
        getAllIssues();
        getDetailIssueOffcanvas(issueId);
        updateIssueModal(issueId);
        Swal.fire({
            icon: "success",
            title: "Updated issue successfully!",
            position: "top-end",
            toast: true,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            background: "#fff",
        });
        document.getElementById('updateIssueName').value = '';
        document.getElementById('updateIssueDescription').value = '';
        let modalCreateIssue = document.getElementById('editIssue');
        let modal = bootstrap.Modal.getInstance(modalCreateIssue);
        if (!modal) {
            modal = new bootstrap.Modal(modalCreateIssue);
        }
        stopLoading('btn-edit-issue', 'btn-edit-issue-text', 'btn-edit-issue-spinner', 'Save');
        modal.hide();
        createActivity("Issue Action", `updated the issue - ${name} of `);
        createIssueActivity(issueId, "Update Issue", `Updated something of issue `);
    }
}

function selectProperties(element, btnPropertyValueId){
    let propertyName = element.textContent.trim();
    const value = element.dataset.value;
    document.getElementById(btnPropertyValueId).textContent = propertyName;
    document.getElementById(btnPropertyValueId).dataset.value = value;
}

async function getAllIssues() {
    
    document.getElementById('issue-content').innerHTML = `
        <div class="px-3">
            <div class="card-issue row gy-3 px-4">
              <div class="col-12 placeholder-glow d-flex justify-content-center">
                <span class="placeholder py-4 mb-2 col-12 rounded-2"></span>
              </div>
            </div>
        </div>
    `;

    const projectId = localStorage.getItem('projectID');
    const cateId = localStorage.getItem('categoryID');
    const search = '';
    const page = 1;
    const perpage = 0;

    if(projectId === null){
        window.location.href = '/pages/home';
        return;
    } else if (!projectId) {
        window.location.href = '/pages/home';
        return;
    }

    if(cateId === null){
        window.location.href = '/pages/home';
        return;
    } else if (!cateId) {
        window.location.href = '/pages/home';
        return;
    }

    try {

        const detailACategory = await fetchDetailACategory(cateId);
        if(detailACategory !== null){
            document.getElementById('project-standon').innerHTML = detailACategory.project.name;
            document.getElementById('cate-standon').innerHTML = detailACategory.category.name;
        }

        // Fetch all required data
        const resStatus = await fetchAllIssueStatus(projectId);
        const resPriority = await fetchAllPriority(projectId);
        const resTracker = await fetchAllTracker(projectId);
        const resLabel = await fetchAllLabel(projectId);
        const resMember = await fetchAllMember(projectId, '', '', '');
        const resIssues = await fetchAllIssues(cateId, search, page, perpage);
        

        const issueContent = document.getElementById('issue-content');
        let issueCard = '';
        let issueData = [];
        let subIssueData = [];

        if (resIssues !== null) {
            for (const element of resIssues.datas) {
                issueData.push({
                    id : element.id,
                    name : element.name,
                    startdate : element.start_date,
                    duedate : element.due_date
                });

                let statusElement = resStatus.map(status => `
                    <li>
                        <a class="dropdown-item ${element.status.id === status.id ? 'text-primary' : ''}" onclick="invokeStatusChange(this, null)" data-issue="${element.id}" data-value="${status.id}">
                            ${status.name}
                        </a>
                    </li>
                `).join('');

                let priorityElement = resPriority.map(priority => `
                    <li>
                        <a class="dropdown-item ${element.priority.id === priority.id ? 'text-primary' : ''}" onclick="invokePriorityChange(this, null)" data-issue="${element.id}" data-value="${priority.id}">
                            ${priority.name}
                        </a>
                    </li>
                `).join('');

                let trackerElement = resTracker.map(tracker => `
                    <li>
                        <a class="dropdown-item ${element.tracker.id === tracker.id ? 'text-primary' : ''}" onclick="invokeTrackerChange(this, null)" data-issue="${element.id}" data-value="${tracker.id}">
                            ${tracker.name}
                        </a>
                    </li>
                `).join('');

                let labelElement = resLabel.map(label => `
                    <li>
                        <a class="dropdown-item ${element.label.id === label.id ? 'text-primary' : ''}" onclick="invokeLabelChange(this, null)" data-issue="${element.id}" data-value="${label.id}">
                            ${label.name}
                        </a>
                    </li>
                `).join('');

                let memberElement = resMember !== null ? resMember.datas.map(assignee => `
                    <li>
                        <a class="dropdown-item ${element.assignee.id === assignee.user.id ? 'text-primary' : ''}" onclick="invokeAssigneeChange(this, null)" data-issue="${element.id}" data-member="${assignee.user.email}" data-value="${assignee.user.id}">
                            ${assignee.user.dis_name}
                        </a>
                    </li>
                `).join('') : '';

                let assignee = 'Assignee';
                if (element.assignee.email !== null) {
                   if(element.assignee.status == 1){
                     assignee = element.assignee.dis_name === '' || element.assignee.dis_name === null ? element.assignee.email : element.assignee.dis_name;
                   } 
                }

                let subIssueCards = '';
                let collapseButton = '';
                const resSubIssues = await fetchSubIssue(element.id, '', 1, '');
                if (resSubIssues !== null) {
                    // Generate collapse button for sub-issues
                    collapseButton = `
                        <button class="btn p-0" data-bs-toggle="collapse"
                                data-bs-target="#collapseIssueCard-${element.id}"
                                aria-expanded="false"
                                aria-controls="collapseIssueCard-${element.id}">
                            <i class='bx bx-chevron-right'></i>
                        </button>
                    `;

                    // Generate sub-issue cards
                    resSubIssues.datas.forEach(subIssue => {
                        subIssueData.push({
                            id : subIssue.id,
                            startdate : subIssue.start_date,
                            duedate : subIssue.due_date
                        });
                        
                        let subStatusElement = resStatus.map(status => `
                            <li>
                                <a class="dropdown-item ${subIssue.status.id === status.id ? 'text-primary' : ''}" onclick="invokeChangeSubStatus(this, getAllIssues, null, null)" data-subissue="${subIssue.id}" data-name="${status.name}" data-value="${status.id}">
                                    ${status.name}
                                </a>
                            </li>
                        `).join('');

                        let subPriorityElement = resPriority.map(priority => `
                            <li>
                                <a class="dropdown-item ${subIssue.priority.id === priority.id ? 'text-primary' : ''}" onclick="invokeChangeSubPriority(this, getAllIssues, null, null)" data-subissue="${subIssue.id}" data-name="${priority.name}" data-value="${priority.id}">
                                    ${priority.name}
                                </a>
                            </li>
                        `).join('');

                        let subTrackerElement = resTracker.map(tracker => `
                            <li>
                                <a class="dropdown-item ${subIssue.tracker.id === tracker.id ? 'text-primary' : ''}" onclick="invokeChangeSubTracker(this, getAllIssues, null, null)" data-subissue="${subIssue.id}" data-name="${tracker.name}" data-value="${tracker.id}">
                                    ${tracker.name}
                                </a>
                            </li>
                        `).join('');

                        let subLabelElement = resLabel.map(label => `
                            <li>
                                <a class="dropdown-item ${subIssue.label.id === label.id ? 'text-primary' : ''}" onclick="invokeChangeSubLabel(this, getAllIssues, null, null)" data-subissue="${subIssue.id}" data-name="${label.name}" data-value="${label.id}">
                                    ${label.name}
                                </a>
                            </li>
                        `).join('');

                        let subMemberElement = resMember !== null ? resMember.datas.map(assignee => `
                            <li>
                                <a class="dropdown-item ${subIssue.assignee.id === assignee.user.id ? 'text-primary' : ''}" onclick="invokeChangeSubAssignee(this, getAllIssues, null, null)" data-subissue="${subIssue.id}" data-member="${assignee.user.email}" data-value="${assignee.user.id}">
                                    ${assignee.user.dis_name}
                                </a>
                            </li>
                        `).join('') : '';

                        let subAssignee = 'Assignee';
                        if (subIssue.assignee.email != null) {
                            subAssignee = subIssue.assignee.dis_name == '' ? subIssue.assignee.email : subIssue.assignee.dis_name;
                        }

                        subIssueCards += `
                        <div class="card-sub-issue row gy-3 px-3" data-id="${subIssue.id}">
                            <div class="col-12 ">
                                <div class="card shadow-none card-sub-issue-offcavas h-auto">
                                <div class="row py-2 px-4 d-flex align-items-center">
                                    <div class="col-xl-5 col-12 h-100">
                                        <div class="px-1 h-100 d-flex justify-content-start align-items-center">
                                            <div class="d-flex align-items-center">
                                                <h5 class="sub_issue_name mb-0 fs-6 ps-2" id="sub_issue_name">${subIssue.name}</h5>
                                                </div>
                                                <div class="px-2"></div>
                                                <div class="progress col-3 ms-auto">
                                                <div class="progress-bar" role="progressbar" style="width: ${subIssue.progress}%; font-size: 8px;"
                                                    aria-valuenow="${subIssue.progress}" aria-valuemin="0" aria-valuemax="100">
                                                    ${Number(subIssue.progress)}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-xl-7 col-12 h-100 d-flex flex-wrap flex-md-nowrap justify-content-lg-end py-lg-0 py-2 justify-content-center align-items-center">
                                        <div id="statusDropdown-${subIssue.id}" class="dropdown">
                                            <button class="btn btn-status-${subIssue.id} btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center" data-issue="${subIssue.id}" type="button" data-bs-toggle="dropdown">
                                                <i class='bx bx-loader-alt'></i> ${subIssue.status.name == null ? "Status" : subIssue.status.name}
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li>
                                                    <input type="text" class="form-control mb-2 search-input search-input-status-${subIssue.id}" 
                                                        placeholder="Search" onkeyup="filterDropdown(this, '${subIssue.id}')">
                                                </li>
                                                ${subStatusElement}
                                            </ul>
                                        </div>
                                        
                                        <div id="priorityDropdown-${subIssue.id}" class="dropdown ms-1">
                                            <button class="btn btn-priority-${subIssue.id} btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center" data-issue="${subIssue.id}" type="button" data-bs-toggle="dropdown">
                                                <i class='bx bx-flag'></i> ${subIssue.priority.name == null ? "Priority" : subIssue.priority.name}
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li>
                                                    <input type="text" class="form-control mb-2 search-input search-input-priority-${subIssue.id}"
                                                        placeholder="Search" onkeyup="filterDropdown(this, '${subIssue.id}')">
                                                </li>
                                                ${subPriorityElement}
                                            </ul>
                                        </div>
                                        
                                        <div id="trackerDropdown-${subIssue.id}" class="dropdown ms-1">
                                            <button class="btn btn-tracker-${subIssue.id} btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown">
                                                <i class='bx bx-target-lock'></i> ${subIssue.tracker.name == null ? "Tracker" : subIssue.tracker.name}
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li>
                                                    <input type="text" class="form-control mb-2 search-input search-input-tracker-${subIssue.id}"
                                                        placeholder="Search" onkeyup="filterDropdown(this, '${subIssue.id}')">
                                                </li>
                                                ${subTrackerElement}
                                            </ul>
                                        </div>
                                        
                                        <div id="labelDropdown-${subIssue.id}" class="dropdown ms-1">
                                            <button class="btn btn-label-${subIssue.id} btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown">
                                                <i class='bx bx-label'></i> ${subIssue.label.name == null ? "Tracker" : subIssue.label.name}
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li>
                                                    <input type="text" class="form-control mb-2 search-input search-input-label-${subIssue.id}"
                                                        placeholder="Search" onkeyup="filterDropdown(this, '${subIssue.id}')">
                                                </li>
                                                ${subLabelElement}
                                            </ul>
                                        </div>
                                        
                                        <div class="ms-1">
                                            <div class="input-group date">
                                            <input type="text" class="form-control border-primary text-primary" id="sub-startdate-${subIssue.id}" placeholder="Select a date">
                                            <button class="btn btn-date-icon border-primary" id="sub-startdateIcon-${subIssue.id}">
                                                <i class='bx bx-calendar-plus text-primary'></i>
                                            </button>
                                            </div>
                                        </div>
                                        <div class="ms-1">
                                            <div class="input-group date">
                                            <input type="text" class="form-control border-primary text-primary" id="sub-duedate-${subIssue.id}" placeholder="Select a date">
                                            <button class="btn btn-date-icon border-primary" id="sub-duedateIcon-${subIssue.id}">
                                                <i class='bx bx-calendar-check text-primary' ></i>
                                            </button>
                                            </div>
                                        </div>
                                        <div id="assigneeDropdown-${subIssue.id}" class="dropdown ms-1">
                                            <button class="btn btn-sm btn-assignee-${subIssue.id} btn-outline-primary issue-item d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown">
                                                <i class='bx bx-user-pin'></i>
                                                ${subAssignee}
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li>
                                                    <input type="text" class="form-control mb-2 search-input search-input-assignee-${subIssue.id}"
                                                        placeholder="Search" onkeyup="filterDropdown(this, '${subIssue.id}')">
                                                </li>
                                                ${subMemberElement}
                                            </ul>
                                        </div>
                                        <div class="ms-2">
                                            <button class="btn px-0" type="button" data-bs-toggle="dropdown">
                                            <i class='bx bx-dots-horizontal-rounded'></i>
                                            </button>
                                            <ul class="dropdown-menu .action">
                                                <li><a class="dropdown-item" onclick="openUpdateSubIssueModal(${subIssue.id})"><i class='bx bx-edit-alt pe-2'></i> Edit</a></li>
                                                <li><a class="dropdown-item" href="#" onclick="deleteSubIssueButton(${subIssue.id}, ${element.id})"><i class='bx bx-trash pe-2'></i> Delete</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    `;
                    });
                }

                issueCard += `
                    <div class="card-issue row gy-3 px-3" data-id="${element.id}">
                    <div class="col-12 ">
                        <div class="card shadow-none card-issue-offcavas h-auto">
                        <div class="row py-2 px-4 d-flex align-items-center">
                            <div class="col-xl-5 col-12 h-100">
                                <div class="px-1 h-100 d-flex justify-content-start align-items-center">
                                    <div class="d-flex align-items-center">
                                        ${collapseButton}
                                        <h5 class="issue_name mb-0 fs-6 ps-2" id="issue_name">${element.name}</h5>
                                        </div>
                                        <div class="px-2"></div>
                                        <div class="progress col-3 ms-auto">
                                        <div class="progress-bar" role="progressbar" style="width: ${element.progress}%; font-size: 8px;"
                                            aria-valuenow="${element.progress}" aria-valuemin="0" aria-valuemax="100">
                                            ${Number(element.progress)}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-xl-7 col-12 h-100 d-flex flex-wrap flex-md-nowrap justify-content-lg-end py-lg-0 py-2 justify-content-center align-items-center">
                                <div id="statusDropdown-${element.id}" class="dropdown">
                                    <button class="btn btn-status-${element.id} btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center" data-issue="${element.id}" type="button" data-bs-toggle="dropdown">
                                        <i class='bx bx-loader-alt'></i> ${element.status.name == null ? "Status" : element.status.name}
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <input type="text" class="form-control mb-2 search-input search-input-status-${element.id}" 
                                                placeholder="Search" onkeyup="filterDropdown(this, '${element.id}')">
                                        </li>
                                        ${statusElement}
                                    </ul>
                                </div>
                                
                                <div id="priorityDropdown-${element.id}" class="dropdown ms-1">
                                    <button class="btn btn-priority-${element.id} btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center" data-issue="${element.id}" type="button" data-bs-toggle="dropdown">
                                        <i class='bx bx-flag'></i> ${element.priority.name == null ? "Priority" : element.priority.name}
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <input type="text" class="form-control mb-2 search-input search-input-priority-${element.id}"
                                                placeholder="Search" onkeyup="filterDropdown(this, '${element.id}')">
                                        </li>
                                        ${priorityElement}
                                    </ul>
                                </div>
                                
                                <div id="trackerDropdown-${element.id}" class="dropdown ms-1">
                                    <button class="btn btn-tracker-${element.id} btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown">
                                        <i class='bx bx-target-lock'></i> ${element.tracker.name == null ? "Tracker" : element.tracker.name}
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <input type="text" class="form-control mb-2 search-input search-input-tracker-${element.id}"
                                                placeholder="Search" onkeyup="filterDropdown(this, '${element.id}')">
                                        </li>
                                        ${trackerElement}
                                    </ul>
                                </div>
                                
                                <div id="labelDropdown-${element.id}" class="dropdown ms-1">
                                    <button class="btn btn-label-${element.id} btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown">
                                        <i class='bx bx-label'></i> ${element.label.name == null ? "Tracker" : element.label.name}
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <input type="text" class="form-control mb-2 search-input search-input-label-${element.id}"
                                                placeholder="Search" onkeyup="filterDropdown(this, '${element.id}')">
                                        </li>
                                        ${labelElement}
                                    </ul>
                                </div>
                                
                                <div class="ms-1">
                                    <div class="input-group date">
                                    <input type="text" class="form-control border-primary text-primary" id="startdate-${element.id}" placeholder="Select a date">
                                    <button class="btn btn-date-icon border-primary" id="startdateIcon-${element.id}">
                                        <i class='bx bx-calendar-plus text-primary'></i>
                                    </button>
                                    </div>
                                </div>
                                <div class="ms-1">
                                    <div class="input-group date">
                                    <input type="text" class="form-control border-primary text-primary" id="duedate-${element.id}" placeholder="Select a date">
                                    <button class="btn btn-date-icon border-primary" id="duedateIcon-${element.id}">
                                        <i class='bx bx-calendar-check text-primary' ></i>
                                    </button>
                                    </div>
                                </div>
                                <div id="assigneeDropdown-${element.id}" class="dropdown ms-1">
                                    <button class="btn btn-sm btn-assignee-${element.id} btn-outline-primary issue-item d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown">
                                        <i class='bx bx-user-pin'></i>
                                        ${assignee}
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <input type="text" class="form-control mb-2 search-input search-input-assignee-${element.id}"
                                                placeholder="Search" onkeyup="filterDropdown(this, '${element.id}')">
                                        </li>
                                        ${memberElement}
                                    </ul>
                                </div>
                                <div class="ms-2">
                                    <button class="btn px-0" type="button" data-bs-toggle="dropdown">
                                    <i class='bx bx-dots-horizontal-rounded'></i>
                                    </button>
                                    <ul class="dropdown-menu .action">
                                        <li><a class="dropdown-item" onclick="openUpdateIssueModal(${element.id})"><i class='bx bx-edit-alt pe-2'></i> Edit</a></li>
                                        <li><a class="dropdown-item" href="#" onclick="deleteIssueButton(${element.id})"><i class='bx bx-trash pe-2'></i> Delete</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="collapse" id="collapseIssueCard-${element.id}">
                        <div class="d-grid gap-2 px-4 py-2">
                            ${subIssueCards}
                        </div>
                    </div>
                `;
            }

        }

        if (issueCard.length > 0) {
            issueContent.innerHTML = issueCard;
            $(document).ready(function () {
                issueData.forEach(data => {
                    // Initialize start date picker
                    if (data.startdate !== null) {
                        const dateObj = new Date(data.startdate);
                        const start_date = dateObj.toLocaleDateString('en-CA');
                        $(`#startdate-${data.id}`).val(start_date);
                    }
                    $(`#startdate-${data.id}`).datepicker({
                        format: 'yyyy-mm-dd',
                        autoclose: true,
                        todayHighlight: true
                    }).on('changeDate', async function (e) {
                        const selectedDate = $(this).val();
                        await startDateChange(data.id, selectedDate, getAllIssues, null, null);
                        createActivity("Start Date", `updated the start date in an issue of `);
                        createIssueActivity(data.id, "Update Issue", `Updated start date of issue `);
                        getDetailIssueOffcanvas(data.id);
                    });

                    $(`#startdateIcon-${data.id}`).click(function () {
                        $(`#startdate-${data.id}`).datepicker('show');
                    });

                    // Initialize due date picker
                    if (data.duedate !== null) {
                        const dateObj = new Date(data.duedate);
                        const due_date = dateObj.toLocaleDateString('en-CA');
                        $(`#duedate-${data.id}`).val(due_date);
                    }
                    $(`#duedate-${data.id}`).datepicker({
                        format: 'yyyy-mm-dd',
                        autoclose: true,
                        todayHighlight: true
                    }).on('changeDate', async function (e) {
                        const selectedDate = $(this).val();
                        await dueDateChange(data.id, selectedDate, getAllIssues, null, null);
                        createActivity("Due Date", `updated the due date in an issue of `);
                        createIssueActivity(data.id, "Update Issue", `Updated due date of issue `);
                        getDetailIssueOffcanvas(data.id);
                    });

                    $(`#duedateIcon-${data.id}`).click(function () {
                        $(`#duedate-${data.id}`).datepicker('show');
                    });
                });

                subIssueData.forEach(data => {
                    // Initialize start date picker
                    if (data.startdate !== null) {
                        const dateObj = new Date(data.startdate);
                        const start_date = dateObj.toLocaleDateString('en-CA');
                        $(`#sub-startdate-${data.id}`).val(start_date);
                    }
                    $(`#sub-startdate-${data.id}`).datepicker({
                        format: 'yyyy-mm-dd',
                        autoclose: true,
                        todayHighlight: true
                    }).on('changeDate', async function (e) {
                        const selectedDate = $(this).val();
                        await invokeChangeSubStartDate(data.id, selectedDate, getAllIssues, null, null);
                        createActivity("Sub-issue start date ", `updated the start date of sub-issue- ${data.id} of`);
                        const subIssueResAct = await fetchDetailSubIssue(data.id);
                        if(subIssueResAct !== null) {
                            createIssueActivity(subIssueResAct.issue.id, "Update Sub Issue", `Updated start date of sub-issue ( ${subIssueResAct.sub_issues.name} ) of issue `);
                        }
                    });

                    $(`#sub-startdateIcon-${data.id}`).click(function () {
                        $(`#sub-startdate-${data.id}`).datepicker('show');
                    });

                    // Initialize due date picker
                    if (data.duedate !== null) {
                        const dateObj = new Date(data.duedate);
                        const due_date = dateObj.toLocaleDateString('en-CA');
                        $(`#sub-duedate-${data.id}`).val(due_date);
                    }
                    $(`#sub-duedate-${data.id}`).datepicker({
                        format: 'yyyy-mm-dd',
                        autoclose: true,
                        todayHighlight: true
                    }).on('changeDate', async function (e) {
                        const selectedDate = $(this).val();
                        await invokeChangeSubDueDate(data.id, selectedDate, getAllIssues, null, null);
                        createActivity("Sub-issue due date ", `updated the due date of sub-issue- ${data.id} of`);
                        const subIssueResAct = await fetchDetailSubIssue(data.id);
                        if(subIssueResAct !== null) {
                            createIssueActivity(subIssueResAct.issue.id, "Update Sub Issue", `Updated due date of sub-issue ( ${subIssueResAct.sub_issues.name} ) of issue `);
                        }
                    });

                    $(`#sub-duedateIcon-${data.id}`).click(function () {
                        $(`#sub-duedate-${data.id}`).datepicker('show');
                    });
                });
            });

            // Attach event listeners to issue cards
            $(".card-issue").on("click", async function (event) {
                if ($(event.target).closest(".btn, .dropdown, input, a").length > 0) {
                    return;
                }
                const issueId = $(this).data("id");
                getDetailIssueOffcanvas(issueId);
                const offcanvas = new bootstrap.Offcanvas(document.getElementById("issueDetailsOffcanvas"));
                offcanvas.show();
            });

            if(subIssueData.length > 0){
                $(".card-sub-issue").on("click", async function (event) {
                    if ($(event.target).closest(".btn, .dropdown, input, a").length > 0) {
                        return;
                    }
                    const subIssueId = $(this).data("id");
                    getDetailSubIssueOffcanvas(subIssueId);
                    const offcanvas = new bootstrap.Offcanvas(document.getElementById("subIssueDetailsOffcanvas"));
                    offcanvas.show();
                });
            }
        } else {
            issueContent.innerHTML = '';
        }
    } catch (error) {
        return;
        // console.error('Error fetching or rendering issues:', error);
    }
}

async function deleteIssueButton(issueId) {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this issue! ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    });
    if(result.isConfirmed) {
        const res = await deleteIssue(issueId);
        if(res !== null){
            await Swal.fire({
                title: "Deleted!",
                text: "Delete an issue sucessfully.",
                icon: "success",
            });
            getAllIssues();
            createActivity("Issue Action", 'deleted an issue of');
        }
    }
}

async function deleteSubIssueButton(subIssueId, issueId) {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this sub-issue! ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    });
    if(result.isConfirmed) {
        const subIssueResAct = await fetchDetailSubIssue(subIssueId);
        if(subIssueResAct !== null) {
            let subIssueName = subIssueResAct.sub_issues.name;
            const res = await deleteSubIssue(subIssueId);
            if(res !== null){
                await Swal.fire({
                    title: "Deleted!",
                    text: "Delete a sub-issue sucessfully.",
                    icon: "success",
                });
                getAllIssues();
                getDetailIssueOffcanvas(issueId);
                createActivity("Sub Issue Action", 'deleted an sub-issue of');
                createIssueActivity(issueId, "Delete Sub-Issue", `Deleted a sub-issue ( ${subIssueName} ) of issue `);
            }
        }
    }
}

async function deleteIssueNoteButton(noteId, issueId) {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this note! ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    });
    if(result.isConfirmed) {
        const res = await deleteIssueNote(noteId);
        if(res !== null){
            await Swal.fire({
                title: "Deleted!",
                text: "Delete a note sucessfully.",
                icon: "success",
            });
            getDetailIssueOffcanvas(issueId);
            createActivity("Issue Action", 'deleted a note of the issue of');
            createIssueActivity(issueId, "Delete Issue-Note", `Deleted a note of issue `);
        }
    }
}

function filterDropdown(inputElement, issueId) {
    let filter = inputElement.value.trim().toLowerCase();
    let dropdownMenu = inputElement.closest(".dropdown-menu");
    let items = dropdownMenu.querySelectorAll("a.dropdown-item");

    items.forEach(item => {
        let text = item.textContent.trim().toLowerCase();
        if (text.includes(filter)) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
}

async function openUpdateSubIssueModal(subIssueId){
    await updateSubIssueModal(subIssueId);
    let modalUpdateIssue = document.getElementById('editSubIssue');
    let modal = new bootstrap.Modal(modalUpdateIssue);
    modal.show();
}

async function openEditIssueNoteModal(issueNoteId){
    const resNote = await fetchIssueNoteDetails(issueNoteId);
    if(resNote !== null){
        const issueId = resNote.issue.id;
        const resIssue = await fetchDetailIssue(issueId);
        document.getElementById('issue-note-prop').innerHTML = `
            <span class=" py-2 px-3 rounded-2" style="background-color:rgb(202, 229, 250) ;">
                    <i class='bx bx-box fs-5 me-1'></i>
                    ${resIssue.project.name}
                </span>
                <span class=" py-2 px-3 rounded-2 ms-2" style="background-color:rgb(202, 229, 250) ;">
                    <i class='bx bx-customize fs-5 me-1'></i>
                    ${resIssue.issues.category.name}
                </span>
                <span class=" py-2 px-3 rounded-2 ms-2" id="editIssueNote" data-note="${resNote.id}" style="background-color:rgb(202, 229, 250) ;">
                    <i class='bx bx-task fs-5 me-1'></i>
                    ${resIssue.issues.name}
                </span>
        `;    
    }
    if (!editnotequill) {
        editnotequill = new Quill("#editnote-editor", {
            modules: {
                syntax: true,
                toolbar: "#notetoolbar-container",
            },
            placeholder: "Compose an epic...",
            theme: "snow",
        });
    }
    editnotequill.root.innerHTML = resNote.notes;
    document.getElementById('btn-editIssueNote').dataset.id = resNote.id;
    document.getElementById('btn-editIssueNote').dataset.issue = resNote.issue.id;

    let editIssueNoteModal = document.getElementById('editIssueNote');
    let modal = new bootstrap.Modal(editIssueNoteModal);
    modal.show();
}

async function editIssueNoteClicked(){
    startLoading('btn-editIssueNote', 'btn-edit-issue-note-text', 'btn-edit-issue-note-spinner');
    const updatedNote = editnotequill.root.innerHTML.trim();
    const noteId = document.querySelector("#btn-editIssueNote").dataset.id;
    const issueId = document.querySelector("#btn-editIssueNote").dataset.issue;
    const respone = await updateIssueNote(noteId, updatedNote);
    if(respone !== null){
        getDetailIssueOffcanvas(issueId);
        let modalEditIssueNote = document.getElementById('editIssueNote');
        let modal = bootstrap.Modal.getInstance(modalEditIssueNote);
        if (!modal) {
            modal = new bootstrap.Modal(modalEditIssueNote); // Create a new instance if it doesn't exist
        }
        stopLoading('btn-editIssueNote', 'btn-edit-issue-note-text', 'btn-edit-issue-note-spinner', 'Save')
        modal.hide();
        createActivity("Issue Action", 'updated a note in the issue of');
        createIssueActivity(issueId, "Edit Issue-Note", `Edited a note of issue `);
        getDetailIssueOffcanvas(issueId);
    }
}

async function getDetailIssueOffcanvas(issueId) {

    document.getElementById('issue-category').innerHTML = `
        <div class="d-flex justify-content-start placeholder-glow w-100">
          <span class="placeholder col-5 rounded-1"></span>
        </div>
    `;
    document.getElementById('issue-name').innerHTML = `
        <div class="d-flex justify-content-start placeholder-glow w-100">
          <span class="placeholder col-5 rounded-1"></span>
        </div>
    `;
    document.getElementById('issue-des').innerHTML = `
        <div class="d-flex justify-content-start placeholder-glow w-100">
          <span class="placeholder col-12 rounded-1"></span>
        </div>
    `;

    document.getElementById('subIssue-section').innerHTML = `
        <div class="card row shadow-none" style="height: 40px;">
          <div class="col-lg-5 col-12 h-100">
            <div class="px-1 h-100 d-flex justify-content-start align-items-center">
                <div class="d-flex align-items-center">
                <div class="d-flex justify-content-start placeholder-glow" style="width: 15px;">
                  <span class="placeholder col-12 rounded-1"></span>
                </div>
                <h5 class="issue_name mb-0 fs-6 ps-2" id="issue_name">
                  <div class="d-flex justify-content-start placeholder-glow" style="width: 80px;">
                    <span class="placeholder col-12 rounded-1"></span>
                  </div>
                </h5>
                </div>
                <div class="px-2"></div>
                <div class="progress col-3">
                  <div class="d-flex justify-content-start placeholder-glow" style="width: 80px;">
                    <span class="placeholder col-12 rounded-1"></span>
                  </div>
                </div>
            </div>
          </div>
          <div class="col-lg-7 col-12 h-100 d-flex justify-content-end align-items-center">
            <div id="statusDropdown" class="dropdown">
              <div class="d-flex justify-content-start placeholder-glow" style="width: 80px;">
                <span class="placeholder col-12 rounded-1" style="padding-block: 13px;"></span>
              </div>
            </div>
            <div class="dropdown ms-1">
              <div class="d-flex justify-content-start placeholder-glow" style="width: 80px;">
                <span class="placeholder col-12 rounded-1" style="padding-block: 13px;"></span>
              </div>
            </div>
            <div id="trackerDropdown" class="dropdown ms-1">
              <div class="d-flex justify-content-start placeholder-glow" style="width: 80px;">
                <span class="placeholder col-12 rounded-1" style="padding-block: 13px;"></span>
              </div>
            </div>
            <div class="ms-2">
              <div class="d-flex justify-content-start placeholder-glow" style="width: 20px;">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
          </div>
        </div>
    `;

    document.getElementById('issue-properties').innerHTML = `
        <div class="row px-4 gy-3">
            <div class="py-2 col-4 d-flex align-items-center">
              <div class="issue-component">
                <i class='bx bx-user-circle fs-6' ></i>
                <span class="fs-6 ps-1">Created by</span>
              </div>
            </div>
            <div class="py-2 col-8 d-flex justify-content-start align-items-center">
              <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
            <div class="py-2 col-4 d-flex align-items-center">
              <div class="issue-component">
                <i class='bx bx-user-circle fs-6' ></i>
                <span class="fs-6 ps-1">Updated by</span>
              </div>
            </div>
            <div class="py-2 col-8 d-flex justify-content-start align-items-center">
              <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
            <div class="py-2 col-4 d-flex align-items-center">
              <div class="issue-component">
                <i class='bx bx-loader-alt fs-6' ></i>
                <span class="fs-6 ps-1">Status</span>
              </div>
            </div>
            <div class="py-2 col-8 d-flex justify-content-start align-items-center">
              <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
            <div class="py-2 col-4 d-flex align-items-center">
              <div class="issue-component">
                <i class='bx bx-flag fs-6' ></i>
                <span class="fs-6 ps-1">Priority</span>
              </div>
            </div>
            <div class="py-2 col-8 d-flex justify-content-start align-items-center">
              <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
            <div class="py-2 col-4 d-flex align-items-center">
              <div class="issue-component">
                <i class='bx bx-target-lock fs-6' ></i>
                <span class="fs-6 ps-1">Tracker</span>
              </div>
            </div>
            <div class="py-2 col-8 d-flex justify-content-start align-items-center">
              <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
            <div class="py-2 col-4 d-flex align-items-center">
              <div class="issue-component">
                <i class='bx bx-label fs-6'></i>
                <span class="fs-6 ps-1">Label</span>
              </div>
            </div>
            <div class="py-2 col-8 d-flex justify-content-start align-items-center">
              <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
            <div class="py-2 col-4 d-flex align-items-center">
              <div class="issue-component">
                <i class='bx bx-calendar-plus fs-6' ></i>
                <span class="fs-6 ps-1">Start Date</span>
              </div>
            </div>
            <div class="py-2 col-8 d-flex justify-content-start align-items-center">
              <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
            <div class="py-2 col-4 d-flex align-items-center">
              <div class="issue-component">
                <i class='bx bx-calendar-check fs-6' ></i>
                <span class="fs-6 ps-1">Due Date</span>
              </div>
            </div>
            <div class="py-2 col-8 d-flex justify-content-start align-items-center">
              <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
            <div class="py-2 col-4 d-flex align-items-center">
              <div class="issue-component">
                <i class='bx bx-user-pin fs-6' ></i>
                <span class="fs-6 ps-1">Assignee</span>
              </div>
            </div>
            <div class="py-2 col-8 d-flex justify-content-start align-items-center">
              <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
            <div class="py-2 col-4 d-flex align-items-center">
              <div class="issue-component">
                <i class='bx bx-git-commit fs-6'></i>
                <span class="fs-6 ps-1">Progress</span>
              </div>
            </div>
            <div class="py-2 col-8 d-flex justify-content-start align-items-center">
              <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
        </div>
    `;

    document.getElementById('issue-activity').innerHTML = `
        <div class="issue-activity-container d-flex" data-id="">
            <div>
                <div class="actor-img">
                <div class="d-flex justify-content-start placeholder-glow" style="width: 50px; height: 50px;">
                    <span class="placeholder w-100 h-100 rounded-circle"></span>
                </div>
                </div>
            </div>
            <div class="w-100 d-flex flex-column ps-2 pe-3 pt-2">
            <div class="w-100 d-flex justify-content-between">
                <div class="d-flex ms-3 justify-content-start placeholder-glow w-100">
                <span class="placeholder col-3 rounded-1"></span>
                </div>
            </div>
            <div class="w-100 ms-3 mt-2 px-2 pb-2 d-flex issue-activity-content">
                <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-11 rounded-1"></span>
                </div>
            </div>
            </div>
        </div>
    `;

    document.querySelector('.issue-notes-sec').classList.add('d-none');

    const resIssue = await fetchDetailIssue(issueId);
    if(resIssue !== null){
        issueIdForAct = issueId;
        const issueData = resIssue.issues, projectData = resIssue.project;
        document.getElementById('issue-category').innerHTML = issueData.category.name;
        document.getElementById('issue-name').innerHTML = issueData.name;
        document.getElementById('issue-des').innerHTML = `<p>${issueData.description}</p>`;

        const projectId = projectData.id;
        const resStatus = await fetchAllIssueStatus(projectId);
        const resPriority = await fetchAllPriority(projectId);
        const resTracker = await fetchAllTracker(projectId);
        const resLabel = await fetchAllLabel(projectId);
        const resMember = await fetchAllMember(projectId, '', '', '');

        const subIssues = await fetchSubIssue(issueId, '', '', '');
        let subIssueCard = '';
        if(subIssues !== null){
            
            subIssues.datas.forEach((element) => {

                let subStatusElement = resStatus.map(status => `
                    <li>
                        <a class="dropdown-item ${element.status.id === status.id ? 'text-primary' : ''}" onclick="invokeChangeSubStatus(this, getAllIssues, getDetailIssueOffcanvas, ${issueId})" data-subissue="${element.id}" data-name="${status.name}" data-value="${status.id}">
                            ${status.name}
                        </a>
                    </li>
                `).join('');
    
                let subTrackerElement = resTracker.map(tracker => `
                    <li>
                        <a class="dropdown-item ${element.tracker.id === tracker.id ? 'text-primary' : ''}" onclick="invokeChangeSubTracker(this, getAllIssues, getDetailIssueOffcanvas, ${issueId})" data-subissue="${element.id}" data-name="${tracker.name}" data-value="${tracker.id}">
                            ${tracker.name}
                        </a>
                    </li>
                `).join('');
    
                let subMemberElement = resMember !== null ? resMember.datas.map(assignee => `
                    <li>
                        <a class="dropdown-item ${element.assignee.id === assignee.user.id ? 'text-primary' : ''}" onclick="invokeChangeSubAssignee(this, getAllIssues, getDetailIssueOffcanvas, ${issueId})" data-subissue="${element.id}" data-member="${assignee.user.email}" data-value="${assignee.user.id}">
                            ${assignee.user.dis_name}
                        </a>
                    </li>
                `).join('') : '';
    
                let subAssignee = 'Assignee';
                if (element.assignee.email !== null) {
                    subAssignee = element.assignee.dis_name == '' || element.assignee.dis_name == null ? element.assignee.email : element.assignee.dis_name;
                }

                subIssueCard += `
                    <div class="card row shadow-none" style="height: 40px;">
                        <div class="col-lg-5 col-12 h-100">
                        <div class="px-1 h-100 d-flex justify-content-start align-items-center">
                            <div class="d-flex align-items-center">
                            <i class='bx bx-radio-circle-marked pe-1 text-primary'></i>
                            <h5 class="issue_name mb-0 fs-6 ps-2" id="issue_name">${element.name}</h5>
                            </div>
                            <div class="px-2"></div>
                            <div class="progress col-3">
                            <div class="progress-bar" role="progressbar" style="width: ${element.progress}%; font-size: 8px;"
                                aria-valuenow="${element.progress}" aria-valuemin="0" aria-valuemax="100">
                                ${Number(element.progress)}%
                            </div>
                            </div>
                        </div>
                        </div>
                        <div class="col-lg-7 col-12 h-100 d-flex justify-content-end align-items-center">
                        <div id="statusDropdown" class="dropdown">
                            <button class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown">
                                <i class='bx bx-loader-alt'></i> ${element.status.name}
                            </button>
                            <ul class="dropdown-menu">
                                <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${element.id}')"></li>
                                ${subStatusElement}
                            </ul>
                        </div>
                        <div class="dropdown ms-1">
                            <button class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown">
                                <i class='bx bx-user-pin'></i> ${subAssignee}
                            </button>
                            <ul class="dropdown-menu">
                                <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${element.id}')"></li>
                                ${subMemberElement}
                            </ul>
                        </div>
                        <div id="trackerDropdown" class="dropdown ms-1">
                            <button class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown">
                                <i class='bx bx-target-lock'></i> ${element.tracker.name}
                            </button>
                            <ul class="dropdown-menu">
                                <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${element.id}')"></li>
                                ${subTrackerElement}
                            </ul>
                        </div>
                        <div class="ms-2">
                            <button class="btn px-0" type="button" data-bs-toggle="dropdown">
                            <i class='bx bx-dots-horizontal-rounded'></i>
                            </button>
                            <ul class="dropdown-menu .action">
                                <li><a class="dropdown-item cursor-pointer sub-issue-off-detail" data-id="${element.id}"><i class='bx bx-bullseye pe-2'></i> Details</a></li>
                                <li><a class="dropdown-item cursor-pointer" onclick="openUpdateSubIssueModal(${element.id})"><i class='bx bx-edit-alt pe-2'></i> Edit</a></li>
                                <li><a class="dropdown-item cursor-pointer" onclick="deleteSubIssueButton(${element.id}, ${issueId})"><i class='bx bx-trash pe-2'></i> Delete</a></li>
                            </ul>
                        </div>
                        </div>
                    </div>
                `;
            })
        }
        document.getElementById('subIssue-section').innerHTML = subIssueCard;

        let statusElement = resStatus.map(status => 
            `<li><a class="dropdown-item ${issueData.status.id === status.id ? 'text-primary' : ''}" onclick="invokeStatusChange(this, '${issueId}')" data-issue="${issueId}" data-value="${status.id}">${status.name}</a></li>`
        ).join('');

        let priorityElement = resPriority.map(priority => 
            `<li><a class="dropdown-item ${issueData.priority.id === priority.id ? 'text-primary' : ''}" onclick="invokePriorityChange(this, '${issueId}')" data-issue="${issueId}" data-value="${priority.id}">${priority.name}</a></li>`
        ).join('');

        let trackerElement = resTracker.map(tracker => 
            `<li><a class="dropdown-item ${issueData.tracker.id === tracker.id ? 'text-primary' : ''}" onclick="invokeTrackerChange(this, '${issueId}')" data-issue="${issueId}" data-value="${tracker.id}">${tracker.name}</a></li>`
        ).join('');

        let labelElement = resLabel.map(label => 
            `<li><a class="dropdown-item ${issueData.label.id === label.id ? 'text-primary' : ''}" onclick="invokeLabelChange(this, '${issueId}')" data-issue="${issueId}" data-value="${label.id}">${label.name}</a></li>`
        ).join('');

        let memberElement = resMember !== null ? resMember.datas.map(assignee => 
            
            `<li><a class="dropdown-item ${issueData.assignee.id === assignee.user.id ? 'text-primary' : ''}" onclick="invokeAssigneeChange(this, '${issueId}')" data-issue="${issueId}" data-member="${assignee.user.email}" data-value="${assignee.user.id}">${assignee.user.dis_name == null ? "No Assignee" : assignee.user.dis_name}</a></li>`
        ).join('') : '';
        console.log(resMember.datas);
        
        const issueProgress = issueData.progress == 0 ? 0 : issueData.progress / 10;

        const issue_properties = `
            <div class="row px-4 gy-3">
                <div class="py-0 col-4 d-flex align-items-center">
                    <div class="issue-component">
                        <i class='bx bx-user-circle fs-6' ></i>
                        <span class="fs-6 ps-1">Created by</span>
                    </div>
                    </div>
                    <div class="py-0 col-8 d-flex justify-content-start align-items-center">
                    <button class="btn btn-property disabled issue-item d-flex align-items-center justify-content-between" data-issue="" type="button" data-bs-toggle="dropdown">
                        <span>${issueData.creator.dis_name}</span>
                    </button>
                </div>
                <div class="py-0 col-4 d-flex align-items-center">
                    <div class="issue-component">
                        <i class='bx bx-user-circle fs-6' ></i>
                        <span class="fs-6 ps-1">Updated by</span>
                    </div>
                    </div>
                    <div class="py-0 col-8 d-flex justify-content-start align-items-center">
                    <button class="btn btn-property disabled issue-item d-flex align-items-center justify-content-between" data-issue="" type="button" data-bs-toggle="dropdown">
                        <span>${issueData.updater.dis_name}</span>
                    </button>
                </div>
                <div class="py-0 col-4 d-flex align-items-center">
                    <div class="issue-component">
                    <i class='bx bx-loader-alt fs-6' ></i>
                    <span class="fs-6 ps-1">Status</span>
                    </div>
                </div>
                <div class="py-0 col-8 d-flex justify-content-start align-items-center">
                    <div id="statusDropdown" class="dropdown w-100">
                        <button class="btn btn-property issue-item d-flex align-items-center justify-content-between" data-issue="" type="button" data-bs-toggle="dropdown">
                            <span>${issueData.status.name}</span>
                            <span class="dropdown-icon"><i class='bx bx-chevron-down' ></i></span>
                        </button>
                        <ul class="dropdown-menu py-1 px-2">
                            <li>
                                <input type="text" class="form-control mb-2 search-input"
                                    placeholder="Search" onkeyup="filterDropdown(this, '${issueId}')">
                            </li>
                            ${statusElement}
                        </ul>
                    </div>
                </div>
                <div class="py-0 col-4 d-flex align-items-center">
                    <div class="issue-component">
                    <i class='bx bx-flag fs-6' ></i>
                    <span class="fs-6 ps-1">Priority</span>
                    </div>
                </div>
                <div class="py-0 col-8 d-flex justify-content-start align-items-center">
                    <div id="priorityDropdown" class="dropdown w-100">
                        <button class="btn btn-property issue-item d-flex align-items-center justify-content-between" data-issue="" type="button" data-bs-toggle="dropdown">
                            <span>${issueData.priority.name}</span>
                            <span class="dropdown-icon"><i class='bx bx-chevron-down' ></i></span>
                        </button>
                        <ul class="dropdown-menu py-1 px-2">
                            <li>
                                <input type="text" class="form-control mb-2 search-input" 
                                    placeholder="Search" onkeyup="filterDropdown(this, '${issueId}')">
                            </li>
                            ${priorityElement}
                        </ul>
                    </div>
                </div>
                <div class="py-0 col-4 d-flex align-items-center">
                    <div class="issue-component">
                    <i class='bx bx-target-lock fs-6' ></i>
                    <span class="fs-6 ps-1">Tracker</span>
                    </div>
                </div>
                <div class="py-0 col-8 d-flex justify-content-start align-items-center">
                    <div id="trackerDropdown" class="dropdown w-100">
                        <button class="btn btn-property issue-item d-flex align-items-center justify-content-between" data-issue="" type="button" data-bs-toggle="dropdown">
                            <span>${issueData.tracker.name}</span>
                            <span class="dropdown-icon"><i class='bx bx-chevron-down' ></i></span>
                        </button>
                        <ul class="dropdown-menu py-1 px-2">
                            <li>
                                <input type="text" class="form-control mb-2 search-input" 
                                    placeholder="Search" onkeyup="filterDropdown(this, '${issueId}')">
                            </li>
                            ${trackerElement}
                        </ul>
                    </div>
                </div>
                <div class="py-0 col-4 d-flex align-items-center">
                    <div class="issue-component">
                    <i class='bx bx-label fs-6'></i>
                    <span class="fs-6 ps-1">Label</span>
                    </div>
                </div>
                <div class="py-0 col-8 d-flex justify-content-start align-items-center">
                    <div id="labelDropdown" class="dropdown w-100">
                        <button class="btn btn-property issue-item d-flex align-items-center justify-content-between" data-issue="" type="button" data-bs-toggle="dropdown">
                            <span>${issueData.label.name}</span>
                            <span class="dropdown-icon"><i class='bx bx-chevron-down' ></i></span>
                        </button>
                        <ul class="dropdown-menu py-1 px-2">
                            <li>
                                <input type="text" class="form-control mb-2 search-input" 
                                    placeholder="Search" onkeyup="filterDropdown(this, '${issueId}')">
                            </li>
                            ${labelElement}
                        </ul>
                    </div>
                </div>
                <div class="py-0 col-4 d-flex align-items-center">
                    <div class="issue-component">
                    <i class='bx bx-calendar-plus fs-6' ></i>
                    <span class="fs-6 ps-1">Start Date</span>
                    </div>
                </div>
                <div class="py-0 col-8 d-flex justify-content-start align-items-center">
                    <div class="input-group date">
                        <input type="text" class="form-control border-0 text-primary" id="startdate" placeholder="Select a date">
                        <button class="btn btn-date-icon" id="startdateIcon">
                            <i class='bx bx-calendar-plus'></i>
                        </button>
                    </div>
                </div>
                <div class="py-0 col-4 d-flex align-items-center">
                    <div class="issue-component">
                    <i class='bx bx-calendar-check fs-6' ></i>
                    <span class="fs-6 ps-1">Due Date</span>
                    </div>
                </div>
                <div class="py-0 col-8 d-flex justify-content-start align-items-center">
                    <div class="input-group date">
                        <input type="text" class="form-control border-0 text-primary" id="duedate" placeholder="Select a date">
                        <button class="btn btn-date-icon" id="duedateIcon">
                            <i class='bx bx-calendar-check' ></i>
                        </button>
                    </div>
                </div>
                <div class="py-0 col-4 d-flex align-items-center">
                    <div class="issue-component">
                    <i class='bx bx-user-pin fs-6' ></i>
                    <span class="fs-6 ps-1">Assignee</span>
                    </div>
                </div>
                <div class="py-0 col-8 d-flex justify-content-start align-items-center">
                    <div id="assigneeDropdown" class="dropdown w-100">
                        <button class="btn btn-property issue-item d-flex align-items-center justify-content-between" data-issue="" type="button" data-bs-toggle="dropdown">
                            <span>${issueData.assignee.dis_name}</span>
                            <span class="dropdown-icon"><i class='bx bx-chevron-down' ></i></span>
                        </button>
                        <ul class="dropdown-menu py-1 px-2">
                            <li>
                                <input type="text" class="form-control mb-2 search-input" 
                                placeholder="Search" onkeyup="filterDropdown(this, '${issueId}')">
                            </li>
                            ${memberElement}
                        </ul>
                    </div>
                </div>
                <div class="py-0 col-4 d-flex align-items-center">
                    <div class="issue-component">
                    <i class='bx bx-git-commit fs-6'></i>
                    <span class="fs-6 ps-1">Progress</span>
                    </div>
                </div>
                <div class="py-0 col-8 d-flex justify-content-start align-items-center">
                    <div class="d-flex align-items-center w-100">
                        <input type="range" class="form-range px-2" min="0" max="10" value="${issueProgress}" oninput="onInputDetailIssueProgress(${issueId}, 'updateDetailIssueProgress')" id="updateDetailIssueProgress" />
                        <span class="ps-3" id="issueDetailProgressValue">${Number(issueData.progress)}%</span>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('issue-properties').innerHTML = issue_properties;

        const resNotes = await fetchIssueNotes(issueId);
        let noteElement = '';
        if(resNotes.length > 0) {
            resNotes.forEach((note) => {
                const noterName = note.noter.disname === "" || note.noter.disname === null ? note.noter.fistname + ' ' + note.noter.lastname : note.noter.disname;
                const notedDateObj = new Date(note.updated_on);
                const notedDate = notedDateObj.toLocaleDateString('en-CA'); 
                noteElement += `
                    <div class="note-container d-flex" data-id="${note.id}">
                        <div>
                            <div class="noter-img">
                                <img src="/upload/${note.noter.avarta}" class="img-fluid rounded" alt="user-image">
                            </div>
                        </div>
                        <div class="w-100 d-flex flex-column ps-2 pe-3">
                            <div class="w-100 d-flex justify-content-between">
                                <span class="ms-3 fs-6 fw-semibold">
                                    ${noterName} <span><i class='bx bx-minus fs-8'></i></span> 
                                    <span class="fw-light fs-7"> ( ${notedDate} )</span>
                                </span>
                                <div class="btn ms-auto p-0">
                                    <button class="border-none bg-transparent" style="border: 0;" data-bs-toggle="dropdown"><i class='bx bx-dots-horizontal-rounded fs-4'></i></button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" onclick="openEditIssueNoteModal(${note.id})"><i class='bx bx-edit-alt pe-2'></i> Edit</a></li>
                                        <li><a class="dropdown-item" onclick="deleteIssueNoteButton(${note.id}, ${issueId})"><i class='bx bx-trash pe-2'></i> Delete</a></li>
                                    </ul>    
                                </div>
                            </div>
                            <div class="w-100 ms-3 mt-2 px-2 pb-2 note-content">
                                ${note.notes}
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        document.getElementById('issue-notes').innerHTML = noteElement;
        document.querySelector('.issue-notes-sec').classList.remove('d-none');
        document.querySelector('.btn-comment-note').dataset.issue = issueId;

        const resActivity = await fetchAllIssueActivity(issueId);
        let activityElement = '';
        if(resActivity.length > 0){
            const today = new Date();
            const todayFormatted = today.toLocaleDateString('en-CA'); // Format: YYYY-MM-DD

            // Filter activities created today
            const todayActivities = resActivity.filter((activity) => {
                const actedDateObj = new Date(activity.created_on);
                const actedDate = actedDateObj.toLocaleDateString('en-CA'); // Format: YYYY-MM-DD
                return actedDate === todayFormatted; // Keep only activities created today
            });
            // resActivity.forEach((activity) => {
            if(todayActivities.length > 0){
                todayActivities.forEach((activity) => {
                    const actorName = activity.actor.dis_name === "" || activity.actor.dis_name === null ? activity.actor.first_name + " " + activity.actor.last_name : activity.actor.dis_name;
                    const actedDateObj = new Date(activity.created_on);
                    const actedDate = actedDateObj.toLocaleDateString('en-CA'); 
                    activityElement += `
                        <div class="issue-activity-container d-flex" data-id="">
                            <div>
                                <div class="actor-img">
                                    <img src="/upload/${activity.actor.avarta}" class="img-fluid rounded-circle" alt="user-image">
                                </div>
                            </div>
                            <div class="w-100 d-flex flex-column ps-2 pe-3">
                            <div class="w-100 d-flex justify-content-between">
                                <span class="ms-3 fs-6 fw-semibold">
                                    ${actorName} <span><i class='bx bx-minus fs-8'></i></span> 
                                    <span class="fw-light fs-7"> ( ${actedDate} )</span>
                                </span>
                            </div>
                            <div class="w-100 ms-3 mt-2 px-2 pb-2 d-flex issue-activity-content">
                                <p>
                                    <span class="fs-6 fw-semibold">${activity.title}</span>
                                    <span class="px-1">~</span>
                                    <span class="fs-6 fw-normal">${activity.activity} ( ${issueData.name} ).</span>
                                </p>
                            </div>
                            </div>
                        </div>
                    `;
                })
            } else {
                activityElement = `
                    <div class="m-auto text-center w-100 pb-2 mt-5"> 
                        <svg fill="#808080" width="50px" height="50px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#a6a6a6" stroke-width="0.00032" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#f2f2f2" stroke-width="0.064"></g>
                            <g id="SVGRepo_iconCarrier"> <title>box-open-heart</title> <path d="M29.742 12.89c-0.002-0.012-0.010-0.022-0.012-0.034-0.014-0.057-0.032-0.106-0.055-0.152l0.002
                            0.004c-0.067-0.12-0.146-0.224-0.237-0.315l0 0-0.024-0.011c-0.077-0.040-0.169-0.078-0.264-0.11l-0.014-0.004-0.024-0.009-8-1.23c-0.035-0.006-0.075-0.009-0.116-0.009-0.414 
                            0-0.75 0.336-0.75 0.75 0 0.375 0.275 0.686 0.635 0.741l0.004 0.001 3.464 0.533-8.351 1.446-8.35-1.446 3.464-0.533c0.366-0.054 0.643-0.366 0.643-0.742 0-0.414-0.336-0.75-0.75-0.75-0.043 0-0.085 
                            0.004-0.126 0.011l0.004-0.001-8.028 1.241c-0.052 0.014-0.096 0.030-0.139 0.051l0.004-0.002c-0.053 0.018-0.099 0.040-0.143 0.066l0.003-0.002-0.023 0.011c-0.025 0.023-0.047 0.048-0.068 0.074l-0.001
                            0.001c-0.041 0.036-0.078 0.075-0.11 0.118l-0.001 0.002c-0.020 0.034-0.039 0.074-0.055 0.115l-0.002 0.005c-0.021 0.042-0.039 0.090-0.052 0.141l-0.001 0.005c-0.003 0.013-0.011 0.023-0.013 0.036l-1
                            6.751c-0.005 0.032-0.008 0.070-0.008 0.108 0 0.361 0.255 0.663 0.595 0.735l0.005 0.001 1.438 0.294c-0.019 0.054-0.033 0.117-0.037 0.182l-0 0.002v7.531c0 0 0 0.001 0 0.001 0 0.381 0.284 0.696 0.653 
                            0.743l0.004 0 11.871 1.467c0.066 0.025 0.142 0.041 0.221 0.045l0.002 0c0.019 0 0.035-0.010 0.054-0.011l0.040 0.005 12-1.506c0.372-0.048 0.656-0.362 0.656-0.743 0-0 0-0.001 0-0.001v0-7.531c-0.005-0.067-0.018-0.13-0.039-0.19l0.002 
                            0.005 1.438-0.294c0.345-0.072 0.6-0.373 0.6-0.734 0-0.039-0.003-0.076-0.009-0.113l0.001 0.004zM3.629 13.87l11.295 1.955-2.364 5.319-9.714-1.986zM4.75 21.078l8.1 1.657c0.045 0.010 0.097 0.015 0.149 0.015 0.304 0 
                            0.566-0.18 0.685-0.44l0.002-0.005 1.564-3.52v10.366l-10.5-1.318zM27.25 27.834l-10.5 1.338v-10.388l1.564 3.52c0.12 0.264 0.382 0.445 0.686 0.445h0c0.054-0 0.105-0.006 0.156-0.017l-0.005 0.001 8.1-1.657zM19.441 
                            21.145l-2.365-5.319 11.295-1.955 0.783 5.288zM15.385 10.802c0.138 0.153 0.336 0.248 0.557 0.248s0.419-0.095 0.556-0.247l0.001-0.001 3.6-3.991c0.723-0.658 1.174-1.602 1.174-2.652 0-0.29-0.034-0.572-0.099-0.841l0.005 
                            0.024c-0.308-1.115-1.169-1.975-2.26-2.278l-0.023-0.005c-0.249-0.065-0.535-0.102-0.83-0.102-0.807 0-1.549 0.28-2.135 0.747l0.007-0.005c-0.528-0.393-1.194-0.629-1.915-0.629-0.911 0-1.734 0.378-2.321 0.985l-0.001 0.001c-0.611 
                            0.592-0.991 1.42-0.991 2.337 0 0.952 0.409 1.808 1.061 2.403l0.003 0.002zM12.761 3.115c0.309-0.319 0.735-0.523 1.208-0.546l0.004-0 0.052-0.001c0.551 0.021 1.041 0.265 1.385 0.644l0.001 0.002c0.138 0.131 0.325 0.211 0.53 
                            0.211s0.392-0.080 0.531-0.211l-0 0c0.386-0.46 0.961-0.751 1.604-0.751 0.152 0 0.301 0.016 0.444 0.047l-0.014-0.002c0.597 0.165 1.058 0.626 1.22 1.21l0.003 0.012c0.027 0.127 0.043 0.274 0.043 0.424 0 0.645-0.29 1.222-0.747 
                            1.608l-0.003 0.003-3.080 3.415-3.082-3.415c-0.393-0.356-0.641-0.868-0.645-1.437v-0.001c0.023-0.477 0.227-0.902 0.545-1.211l0-0z"></path> 
                            </g>
                        </svg>
                    </div>
                    <p class="text-center fs-6 fw-semibold" style="color:#808080 ;">No Activity</p>
                `;
            }
        } else {
            activityElement = `
                <div class="m-auto text-center w-100 pb-2 mt-5"> 
                    <svg fill="#808080" width="50px" height="50px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#a6a6a6" stroke-width="0.00032" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#f2f2f2" stroke-width="0.064"></g>
                        <g id="SVGRepo_iconCarrier"> <title>box-open-heart</title> <path d="M29.742 12.89c-0.002-0.012-0.010-0.022-0.012-0.034-0.014-0.057-0.032-0.106-0.055-0.152l0.002
                         0.004c-0.067-0.12-0.146-0.224-0.237-0.315l0 0-0.024-0.011c-0.077-0.040-0.169-0.078-0.264-0.11l-0.014-0.004-0.024-0.009-8-1.23c-0.035-0.006-0.075-0.009-0.116-0.009-0.414 
                         0-0.75 0.336-0.75 0.75 0 0.375 0.275 0.686 0.635 0.741l0.004 0.001 3.464 0.533-8.351 1.446-8.35-1.446 3.464-0.533c0.366-0.054 0.643-0.366 0.643-0.742 0-0.414-0.336-0.75-0.75-0.75-0.043 0-0.085 
                         0.004-0.126 0.011l0.004-0.001-8.028 1.241c-0.052 0.014-0.096 0.030-0.139 0.051l0.004-0.002c-0.053 0.018-0.099 0.040-0.143 0.066l0.003-0.002-0.023 0.011c-0.025 0.023-0.047 0.048-0.068 0.074l-0.001
                         0.001c-0.041 0.036-0.078 0.075-0.11 0.118l-0.001 0.002c-0.020 0.034-0.039 0.074-0.055 0.115l-0.002 0.005c-0.021 0.042-0.039 0.090-0.052 0.141l-0.001 0.005c-0.003 0.013-0.011 0.023-0.013 0.036l-1
                         6.751c-0.005 0.032-0.008 0.070-0.008 0.108 0 0.361 0.255 0.663 0.595 0.735l0.005 0.001 1.438 0.294c-0.019 0.054-0.033 0.117-0.037 0.182l-0 0.002v7.531c0 0 0 0.001 0 0.001 0 0.381 0.284 0.696 0.653 
                         0.743l0.004 0 11.871 1.467c0.066 0.025 0.142 0.041 0.221 0.045l0.002 0c0.019 0 0.035-0.010 0.054-0.011l0.040 0.005 12-1.506c0.372-0.048 0.656-0.362 0.656-0.743 0-0 0-0.001 0-0.001v0-7.531c-0.005-0.067-0.018-0.13-0.039-0.19l0.002 
                         0.005 1.438-0.294c0.345-0.072 0.6-0.373 0.6-0.734 0-0.039-0.003-0.076-0.009-0.113l0.001 0.004zM3.629 13.87l11.295 1.955-2.364 5.319-9.714-1.986zM4.75 21.078l8.1 1.657c0.045 0.010 0.097 0.015 0.149 0.015 0.304 0 
                         0.566-0.18 0.685-0.44l0.002-0.005 1.564-3.52v10.366l-10.5-1.318zM27.25 27.834l-10.5 1.338v-10.388l1.564 3.52c0.12 0.264 0.382 0.445 0.686 0.445h0c0.054-0 0.105-0.006 0.156-0.017l-0.005 0.001 8.1-1.657zM19.441 
                         21.145l-2.365-5.319 11.295-1.955 0.783 5.288zM15.385 10.802c0.138 0.153 0.336 0.248 0.557 0.248s0.419-0.095 0.556-0.247l0.001-0.001 3.6-3.991c0.723-0.658 1.174-1.602 1.174-2.652 0-0.29-0.034-0.572-0.099-0.841l0.005 
                         0.024c-0.308-1.115-1.169-1.975-2.26-2.278l-0.023-0.005c-0.249-0.065-0.535-0.102-0.83-0.102-0.807 0-1.549 0.28-2.135 0.747l0.007-0.005c-0.528-0.393-1.194-0.629-1.915-0.629-0.911 0-1.734 0.378-2.321 0.985l-0.001 0.001c-0.611 
                         0.592-0.991 1.42-0.991 2.337 0 0.952 0.409 1.808 1.061 2.403l0.003 0.002zM12.761 3.115c0.309-0.319 0.735-0.523 1.208-0.546l0.004-0 0.052-0.001c0.551 0.021 1.041 0.265 1.385 0.644l0.001 0.002c0.138 0.131 0.325 0.211 0.53 
                         0.211s0.392-0.080 0.531-0.211l-0 0c0.386-0.46 0.961-0.751 1.604-0.751 0.152 0 0.301 0.016 0.444 0.047l-0.014-0.002c0.597 0.165 1.058 0.626 1.22 1.21l0.003 0.012c0.027 0.127 0.043 0.274 0.043 0.424 0 0.645-0.29 1.222-0.747 
                         1.608l-0.003 0.003-3.080 3.415-3.082-3.415c-0.393-0.356-0.641-0.868-0.645-1.437v-0.001c0.023-0.477 0.227-0.902 0.545-1.211l0-0z"></path> 
                        </g>
                    </svg>
                </div>
                <p class="text-center fs-6 fw-semibold" style="color:#808080 ;">No Activity</p>
            `;
        }

        document.getElementById('issue-activity').innerHTML = activityElement;
        document.getElementById('issueAllActivityOffcanvasLink').dataset.issue = issueId;
        document.getElementById('issueAllActivityOffcanvasLink').dataset.issuename = issueData.name;

        $(document).ready(function () {
            if(issueData.start_date !== null) {
                const dateObj = new Date(issueData.start_date);
                const start_date = dateObj.toLocaleDateString('en-CA'); 
                $(`#startdate`).val(start_date);
            }
            $(`#startdate`).datepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            }).on('changeDate', async function (e) {
                const selectedDate = $(this).val();
                await startDateChange(issueData.id, selectedDate, getAllIssues, getDetailIssueOffcanvas, issueId);
                createActivity("Start Date", `updated the start date in an issue of `);
                createIssueActivity(issueData.id, "Update Issue", `Updated start date of issue `);
                getDetailIssueOffcanvas(issueData.id);
            });
    
            $(`#startdateIcon`).click(function () {
                $(`#startdate`).datepicker('show');
            });
        });

        $(document).ready(function () {
            if(issueData.due_date !== null) {
                const dateObj = new Date(issueData.due_date);
                const due_date = dateObj.toLocaleDateString('en-CA'); 
                $(`#duedate`).val(due_date);
            }
            $(`#duedate`).datepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            }).on('changeDate', async function (e) {
                const selectedDate = $(this).val();
                await dueDateChange(issueData.id, selectedDate, getAllIssues, getDetailIssueOffcanvas, issueId);
                createActivity("Due Date", `updated the due date in an issue of `);
                createIssueActivity(issueData.id, "Update Issue", `Updated due date of issue `);
                getDetailIssueOffcanvas(issueData.id);
            });
            $(`#duedateIcon`).click(function () {
                $(`#duedate`).datepicker('show');
            });
        });
        initializeQuill();
        createSubIssueModal(issueId);
        if(subIssueCard !== ''){
            $(".sub-issue-off-detail").on("click", async function (event) {
                const subIssueId = $(this).data("id");
                getDetailSubIssueOffcanvas(subIssueId);
                const offcanvas = new bootstrap.Offcanvas(document.getElementById("subIssueDetailsOffcanvas"));
                offcanvas.show();
            });
        }
    }
}

async function issueAllActivityOffcanvasOpen(btn) {

    const issueId = btn.dataset.issue;
    const name = btn.dataset.issuename;
    document.getElementById('issueAllActivityOffcanvasName').innerHTML = name;
  
    const resActivity = await fetchAllIssueActivity(issueId);
    let activityElement = '';
  
    if (resActivity.length > 0) {
      const groupedActivities = resActivity.reduce((acc, activity) => {
        const date = new Date(activity.created_on).toLocaleDateString('en-CA'); // Format: YYYY-MM-DD
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(activity);
        return acc;
      }, {});
  
      const today = new Date().toLocaleDateString('en-CA');
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayFormatted = yesterday.toLocaleDateString('en-CA');
  
      const sortedDates = Object.keys(groupedActivities).sort((a, b) => new Date(b) - new Date(a));
  
      sortedDates.forEach((date) => {
        let dateLabel;
        if (date === today) {
          dateLabel = 'Today';
        } else if (date === yesterdayFormatted) {
          dateLabel = 'Yesterday';
        } else {
            const dateObj = new Date(date);
            dateLabel = dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        }
  
        activityElement += `<div class="date-label fs-6 fw-semibold my-2">${dateLabel}</div>`;
  
        groupedActivities[date].forEach((activity) => {
            const actorName = activity.actor.dis_name || `${activity.actor.first_name} ${activity.actor.last_name}`;
            const actedDateObj = new Date(activity.created_on);
            const actedTime = actedDateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            activityElement += `
                <div class="issue-activity-container d-flex" data-id="">
                <div>
                    <div class="actor-img">
                    <img src="/upload/${activity.actor.avarta}" class="img-fluid rounded" alt="user-image">
                    </div>
                </div>
                <div class="w-100 d-flex flex-column ps-2 pe-3">
                    <div class="w-100 d-flex justify-content-between">
                    <span class="ms-3 fs-6 fw-semibold">
                        ${actorName} <span><i class='bx bx-minus fs-8'></i></span> 
                        <span class="fw-light fs-7"> ( ${actedTime} )</span>
                    </span>
                    </div>
                    <div class="w-100 ms-3 mt-2 px-2 pb-2 d-flex issue-activity-content">
                        <p>
                            <span class="fs-6 fw-semibold">${activity.title}</span>
                            <span class="px-1">~</span>
                            <span class="fs-6 fw-normal">${activity.activity} ( ${name} ).</span>
                        </p>
                    </div>
                </div>
                </div>
            `;
        });
      });
    } else {
      activityElement = `
        <div class="w-100 d-flex flex-column justify-content-center align-items-center">
            <div class="text-center w-100 pb-2 mt-5"> 
                <svg fill="#808080" width="150px" height="150px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#a6a6a6" stroke-width="0.00032" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#f2f2f2" stroke-width="0.064"></g>
                    <g id="SVGRepo_iconCarrier"> <title>box-open-heart</title> <path d="M29.742 12.89c-0.002-0.012-0.010-0.022-0.012-0.034-0.014-0.057-0.032-0.106-0.055-0.152l0.002
                        0.004c-0.067-0.12-0.146-0.224-0.237-0.315l0 0-0.024-0.011c-0.077-0.040-0.169-0.078-0.264-0.11l-0.014-0.004-0.024-0.009-8-1.23c-0.035-0.006-0.075-0.009-0.116-0.009-0.414 
                        0-0.75 0.336-0.75 0.75 0 0.375 0.275 0.686 0.635 0.741l0.004 0.001 3.464 0.533-8.351 1.446-8.35-1.446 3.464-0.533c0.366-0.054 0.643-0.366 0.643-0.742 0-0.414-0.336-0.75-0.75-0.75-0.043 0-0.085 
                        0.004-0.126 0.011l0.004-0.001-8.028 1.241c-0.052 0.014-0.096 0.030-0.139 0.051l0.004-0.002c-0.053 0.018-0.099 0.040-0.143 0.066l0.003-0.002-0.023 0.011c-0.025 0.023-0.047 0.048-0.068 0.074l-0.001
                        0.001c-0.041 0.036-0.078 0.075-0.11 0.118l-0.001 0.002c-0.020 0.034-0.039 0.074-0.055 0.115l-0.002 0.005c-0.021 0.042-0.039 0.090-0.052 0.141l-0.001 0.005c-0.003 0.013-0.011 0.023-0.013 0.036l-1
                        6.751c-0.005 0.032-0.008 0.070-0.008 0.108 0 0.361 0.255 0.663 0.595 0.735l0.005 0.001 1.438 0.294c-0.019 0.054-0.033 0.117-0.037 0.182l-0 0.002v7.531c0 0 0 0.001 0 0.001 0 0.381 0.284 0.696 0.653 
                        0.743l0.004 0 11.871 1.467c0.066 0.025 0.142 0.041 0.221 0.045l0.002 0c0.019 0 0.035-0.010 0.054-0.011l0.040 0.005 12-1.506c0.372-0.048 0.656-0.362 0.656-0.743 0-0 0-0.001 0-0.001v0-7.531c-0.005-0.067-0.018-0.13-0.039-0.19l0.002 
                        0.005 1.438-0.294c0.345-0.072 0.6-0.373 0.6-0.734 0-0.039-0.003-0.076-0.009-0.113l0.001 0.004zM3.629 13.87l11.295 1.955-2.364 5.319-9.714-1.986zM4.75 21.078l8.1 1.657c0.045 0.010 0.097 0.015 0.149 0.015 0.304 0 
                        0.566-0.18 0.685-0.44l0.002-0.005 1.564-3.52v10.366l-10.5-1.318zM27.25 27.834l-10.5 1.338v-10.388l1.564 3.52c0.12 0.264 0.382 0.445 0.686 0.445h0c0.054-0 0.105-0.006 0.156-0.017l-0.005 0.001 8.1-1.657zM19.441 
                        21.145l-2.365-5.319 11.295-1.955 0.783 5.288zM15.385 10.802c0.138 0.153 0.336 0.248 0.557 0.248s0.419-0.095 0.556-0.247l0.001-0.001 3.6-3.991c0.723-0.658 1.174-1.602 1.174-2.652 0-0.29-0.034-0.572-0.099-0.841l0.005 
                        0.024c-0.308-1.115-1.169-1.975-2.26-2.278l-0.023-0.005c-0.249-0.065-0.535-0.102-0.83-0.102-0.807 0-1.549 0.28-2.135 0.747l0.007-0.005c-0.528-0.393-1.194-0.629-1.915-0.629-0.911 0-1.734 0.378-2.321 0.985l-0.001 0.001c-0.611 
                        0.592-0.991 1.42-0.991 2.337 0 0.952 0.409 1.808 1.061 2.403l0.003 0.002zM12.761 3.115c0.309-0.319 0.735-0.523 1.208-0.546l0.004-0 0.052-0.001c0.551 0.021 1.041 0.265 1.385 0.644l0.001 0.002c0.138 0.131 0.325 0.211 0.53 
                        0.211s0.392-0.080 0.531-0.211l-0 0c0.386-0.46 0.961-0.751 1.604-0.751 0.152 0 0.301 0.016 0.444 0.047l-0.014-0.002c0.597 0.165 1.058 0.626 1.22 1.21l0.003 0.012c0.027 0.127 0.043 0.274 0.043 0.424 0 0.645-0.29 1.222-0.747 
                        1.608l-0.003 0.003-3.080 3.415-3.082-3.415c-0.393-0.356-0.641-0.868-0.645-1.437v-0.001c0.023-0.477 0.227-0.902 0.545-1.211l0-0z"></path> 
                    </g>
                </svg>
            </div>
            <p class="text-center fs-6 fw-semibold" style="color:#808080;">No Activity</p>
        </div>
      `;
    }
  
    document.getElementById('issueActivityOffcanvasContent').innerHTML = activityElement;

    const offcanvas = new bootstrap.Offcanvas(document.getElementById("issueAllActivityOffcanvas"));
    offcanvas.show();
}

async function onInputDetailIssueProgress(issueId, element){
    const value = document.getElementById(element).value;
    const res = await progressChange(
        issueId,
        Number(value * 10),
        getAllIssues,
        getDetailIssueOffcanvas,
        issueId
    );
    if(res.result){
        createActivity("Issue Action", 'updated issue progress value of ');
        createIssueActivity(issueId, "Update Issue", `Updated progress to < ${Number(value * 10)}% > of issue `);
        getDetailIssueOffcanvas(issueId);
    }
}

async function invokeStatusChange(item, fetchParams){
    if(fetchParams === null){
        const res = await statusChange(
            item,
            getAllIssues,
            null,
            null
        );
        if( res.result ) {
            createActivity("Issue Action", 'updated issue status of ');
            createIssueActivity(item.dataset.issue, "Update Issue", `Updated status of issue `);
            getDetailIssueOffcanvas(item.dataset.issue);
        }
    } else {
        const res = await statusChange(
            item,
            getAllIssues,
            getDetailIssueOffcanvas,
            fetchParams
        );
        if( res.result ) {
            createActivity("Issue Action", 'updated issue status of ');
            createIssueActivity(item.dataset.issue, "Update Issue", `Updated status of issue `);
            getDetailIssueOffcanvas(item.dataset.issue);
        }
    }
}

async function invokePriorityChange(item, fetchParams){
    if(fetchParams === null){
        const res = await priorityChange(
            item,
            getAllIssues,
            null,
            null
        );
        if(res.result) {
            createActivity("Issue Action", 'updated issue priority of');
            createIssueActivity(item.dataset.issue, "Update Issue", `Updated priority of issue `);
            getDetailIssueOffcanvas(item.dataset.issue);
        }
    } else {
        const res = await priorityChange(
            item,
            getAllIssues,
            getDetailIssueOffcanvas,
            fetchParams
        );
        if(res.result) {
            createActivity("Issue Action", 'updated issue priority of');
            createIssueActivity(item.dataset.issue, "Update Issue", `Updated priority of issue `);
            getDetailIssueOffcanvas(item.dataset.issue);
        }
    }
}

async function invokeTrackerChange(item, fetchParams){
    if(fetchParams === null){
        const res = await trackerChange(
            item,
            getAllIssues,
            null,
            null
        );
        if(res.result) {
            createActivity("Issue Action", 'updated issue tracker of');
            createIssueActivity(item.dataset.issue, "Update Issue", `Updated tracker of issue `);
            getDetailIssueOffcanvas(item.dataset.issue);
        }
    } else {

        const res = await trackerChange(
            item,
            getAllIssues,
            getDetailIssueOffcanvas,
            fetchParams
        );
        if(res.result) {
            createActivity("Issue Action", 'updated issue tracker of');
            createIssueActivity(item.dataset.issue, "Update Issue", `Updated tracker of issue `);
            getDetailIssueOffcanvas(item.dataset.issue);
        }
    }
}

async function invokeLabelChange(item, fetchParams){
    if(fetchParams === null){
        const res = await labelChange(
            item,
            getAllIssues,
            null,
            null
        );
        if(res.result) {
            createActivity("Issue Action", 'updated issue label of');
            createIssueActivity(item.dataset.issue, "Update Issue", `Updated label of issue `);
            getDetailIssueOffcanvas(item.dataset.issue);
        }
    } else {
        const res = await labelChange(
            item,
            getAllIssues,
            getDetailIssueOffcanvas,
            fetchParams
        );
        if(res.result) {
            createActivity("Issue Action", 'updated issue lebel of');
            createIssueActivity(item.dataset.issue, "Update Issue", `Updated label of issue `);
            getDetailIssueOffcanvas(item.dataset.issue);
        }
    }
}

async function invokeAssigneeChange(item, fetchParams){
    if(fetchParams === null){
        const res = await assigneeChange(
            item,
            getAllIssues,
            null,
            null
        );
        if(res.result) {
            createActivity("Issue Action", 'updated issue assignee of');
            createIssueActivity(item.dataset.issue, "Issue Assignee", `Assigned < ${item.dataset.member} > to issue `);
            getDetailIssueOffcanvas(item.dataset.issue);
        }
    } else {
        const res = await assigneeChange(
            item,
            getAllIssues,
            getDetailIssueOffcanvas,
            fetchParams
        );
        if(res.result) {
            createActivity("Issue Action", 'updated issue assignee of');
            createIssueActivity(item.dataset.issue, "Issue Assignee", `Assigned < ${item.dataset.member} > to issue `);
            getDetailIssueOffcanvas(item.dataset.issue);
        }
    }
}

async function updateSubIssueModal(subIssueId){
    const resDetailSubIssue = await fetchDetailSubIssue(subIssueId);
    if(resDetailSubIssue !== null){
        const resDetailIssue = await fetchDetailIssue(resDetailSubIssue.issue.id);
        document.getElementById('update_subIssue_modal_prop_head').innerHTML = `
            <span class=" py-2 px-3 rounded-2" style="background-color:rgb(202, 229, 250) ;">
                <i class='bx bx-box fs-5 me-1'></i>
                ${resDetailIssue.project.name}
            </span>
            <span class=" py-2 px-3 rounded-2 ms-2" style="background-color:rgb(202, 229, 250) ;">
                <i class='bx bx-customize fs-5 me-1'></i>
                ${resDetailIssue.issues.category.name}
            </span>
            <span class=" py-2 px-3 rounded-2 ms-2" id="updateSubIssue-subIssue" data-issue="${resDetailSubIssue.issue.id}" data-subissue="${resDetailSubIssue.sub_issues.id}" style="background-color:rgb(202, 229, 250) ;">
                <i class='bx bx-task fs-5 me-1'></i>
                ${resDetailSubIssue.issue.name}
            </span>
        `;
        const subIssueData = resDetailSubIssue.sub_issues;

        document.getElementById('updateSubIssueName').value = subIssueData.name;
        document.getElementById('updateSubIssueDescription').value = subIssueData.description;

        const subIssueProgress = subIssueData.progress == 0 ? 0 : subIssueData.progress / 10;
        document.getElementById('updateSubIssueProgressModal').innerHTML = `
            <label for="updateIssueProgress" class="pe-3">Progress</label>
            <input type="range" class="form-range px-2" min="0" max="10" value="${subIssueProgress}" oninput="onInputIssueProgress('updateSubIssueProgress', 'subIssueProgressValue')" id="updateSubIssueProgress" />
            <span class="ps-3" id="subIssueProgressValue">${Number(subIssueData.progress)}%</span>
        `;
        document.getElementById('subIssueComment').value = subIssueData.comment;
        const projectId = resDetailIssue.project.id;
        const resStatus = await fetchAllIssueStatus(projectId);
        const resPriority = await fetchAllPriority(projectId);
        const resTracker = await fetchAllTracker(projectId);
        const resLabel = await fetchAllLabel(projectId);
        const resMember = await fetchAllMember(projectId, '', '', '');

        let statusElement = resStatus.map(status => 
            `<li><a class="dropdown-item" onclick="selectProperties(this, 'updateSubIssueStatusProp')" data-value="${status.id}">${status.name}</a></li>`
        ).join('');

        let priorityElement = resPriority.map(priority => 
            `<li><a class="dropdown-item" onclick="selectProperties(this, 'updateSubIssuePriorityProp')" data-value="${priority.id}">${priority.name}</a></li>`
        ).join('');

        let trackerElement = resTracker.map(tracker => 
            `<li><a class="dropdown-item" onclick="selectProperties(this, 'updateSubIssueTrackerProp')" data-value="${tracker.id}">${tracker.name}</a></li>`
        ).join('');

        let labelElement = resLabel.map(label => 
            `<li><a class="dropdown-item" onclick="selectProperties(this, 'updateSubIssueLabelProp')" data-value="${label.id}">${label.name}</a></li>`
        ).join('');

        let memberElement = resMember !== null ? resMember.datas.map(assignee => 
            `<li><a class="dropdown-item" onclick="selectProperties(this, 'updateSubIssueAssigneeProp')" data-value="${assignee.user.id}">${assignee.user.email}</a></li>`
        ).join('') : '';

        let assignee = 'Assingee';
        if(subIssueData.assignee.email !== null){
            assignee = subIssueData.assignee.dis_name == "" ? subIssueData.assignee.email : subIssueData.assignee.dis_name;
        }

        document.getElementById('update_sub_issue_prop').innerHTML = `
            <div id="statusDropdown" class="dropdown me-1 mb-2">
                <button
                    class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center"
                    type="button" data-bs-toggle="dropdown">
                    <i class='bx bx-loader-alt'></i> <span class="ps-1" id="updateSubIssueStatusProp" data-value="${subIssueData.status.id}">${subIssueData.status.name}</span>
                </button>
                <ul class="dropdown-menu modal-dropdown-menu">
                    <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${subIssueId}')"></li>
                    ${statusElement}
                </ul>
            </div>

            <div id="priorityDropdown" class="dropdown me-1 mb-2">
                <button
                    class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center"
                    type="button" data-bs-toggle="dropdown">
                    <i class='bx bx-flag'></i> <span class="ps-1" id="updateSubIssuePriorityProp" data-value="${subIssueData.priority.id}">${subIssueData.priority.name}</span>
                </button>
                <ul class="dropdown-menu modal-dropdown-menu">
                    <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${subIssueId}')"></li>
                    ${priorityElement}
                </ul>
            </div>

            <div id="trackerDropdown" class="dropdown me-1 mb-2">
                <button
                    class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center"
                    type="button" data-bs-toggle="dropdown">
                    <i class='bx bx-target-lock'></i> <span class="ps-1" id="updateSubIssueTrackerProp" data-value="${subIssueData.tracker.id}">${subIssueData.tracker.name}</span>
                </button>
                <ul class="dropdown-menu modal-dropdown-menu">
                    <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${subIssueId}')"></li>
                    ${trackerElement}
                </ul>
            </div>

            <div id="labelDropdown" class="dropdown me-1 mb-2">
                <button
                    class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center"
                    type="button" data-bs-toggle="dropdown">
                    <i class='bx bx-label'></i> <span class="ps-1" id="updateSubIssueLabelProp" data-value="${subIssueData.label.id}">${subIssueData.label.name}</span>
                </button>
                <ul class="dropdown-menu modal-dropdown-menu">
                    <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${subIssueId}')"></li>
                    ${labelElement}
                </ul>
            </div>

            <div class="me-1 mb-2">
                <div class="input-group date">
                    <input type="text" class="form-control border-primary text-primary" id="updateSubIssueStartDate"
                        placeholder="Select a date">
                    <button class="btn btn-date-icon border-primary" id="updateSubIssueStartDateIcon">
                        <i class='bx bx-calendar-plus text-primary'></i>
                    </button>
                </div>
            </div>
            <div class="me-1 mb-2">
                <div class="input-group date">
                    <input type="text" class="form-control border-primary text-primary" id="updateSubIssueDueDate"
                        placeholder="Select a date">
                    <button class="btn btn-date-icon border-primary" id="updateSubIssueDueDateIcon">
                        <i class='bx bx-calendar-check text-primary'></i>
                    </button>
                </div>
            </div>
            <div class="dropdown me-1 mb-2">
                <button
                    class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center"
                    type="button" data-bs-toggle="dropdown">
                    <i class='bx bx-user-pin'></i>
                    <span class="ps-1" id="updateSubIssueAssigneeProp" data-value="${subIssueData.assignee.id == null ? 0 : subIssueData.assignee.id}">${assignee}</span>
                </button>
                <ul class="dropdown-menu modal-dropdown-menu">
                    <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${subIssueId}')"></li>
                    ${memberElement}
                </ul>
            </div>
        `;

        $(document).ready(function () {
            if(subIssueData.start_date !== null) {
                const dateObj = new Date(subIssueData.start_date);
                const start_date = dateObj.toLocaleDateString('en-CA'); 
                $('#updateSubIssueStartDate').val(start_date);
            }
            $('#updateSubIssueStartDate').datepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            });
    
            $('#updateSubIssueStartDateIcon').click(function () {
                $('#createSubIssueStartDate').datepicker('show');
            });

            if(subIssueData.due_date !== null) {
                const dateObj = new Date(subIssueData.due_date);
                const due_date = dateObj.toLocaleDateString('en-CA'); 
                $('#updateSubIssueDueDate').val(due_date);
            }
            $('#updateSubIssueDueDate').datepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            });

            $('#updateSubIssueDueDateIcon').click(function () {
                $('#createSubIssueDueDate').datepicker('show');
            });
        });
    }
}

async function createSubIssueModal(issueId){
    const resDetailIssue = await fetchDetailIssue(issueId);
    if(resDetailIssue !== null){
        document.getElementById('create_subIssue_modal_prop_head').innerHTML = `
            <span class=" py-2 px-3 rounded-2" style="background-color:rgb(202, 229, 250) ;">
                <i class='bx bx-box fs-5 me-1'></i>
                ${resDetailIssue.project.name}
            </span>
            <span class=" py-2 px-3 rounded-2 ms-2" style="background-color:rgb(202, 229, 250) ;">
                <i class='bx bx-customize fs-5 me-1'></i>
                ${resDetailIssue.issues.category.name}
            </span>
            <span class=" py-2 px-3 rounded-2 ms-2" id="createSubIssue-issue" data-subissue="${resDetailIssue.issues.id}" style="background-color:rgb(202, 229, 250) ;">
                <i class='bx bx-task fs-5 me-1'></i>
                ${resDetailIssue.issues.name}
            </span>
        `;

        const projectId = resDetailIssue.project.id;
        const resStatus = await fetchAllIssueStatus(projectId);
        const resPriority = await fetchAllPriority(projectId);
        const resTracker = await fetchAllTracker(projectId);
        const resLabel = await fetchAllLabel(projectId);
        const resMember = await fetchAllMember(projectId, '', '', '');

        let statusElement = resStatus.map(status => 
            `<li><a class="dropdown-item" onclick="selectProperties(this, 'createSubIssueStatusProp')" data-value="${status.id}">${status.name}</a></li>`
        ).join('');

        let priorityElement = resPriority.map(priority => 
            `<li><a class="dropdown-item" onclick="selectProperties(this, 'createSubIssuePriorityProp')" data-value="${priority.id}">${priority.name}</a></li>`
        ).join('');

        let trackerElement = resTracker.map(tracker => 
            `<li><a class="dropdown-item" onclick="selectProperties(this, 'createSubIssueTrackerProp')" data-value="${tracker.id}">${tracker.name}</a></li>`
        ).join('');

        let labelElement = resLabel.map(label => 
            `<li><a class="dropdown-item" onclick="selectProperties(this, 'createSubIssueLabelProp')" data-value="${label.id}">${label.name}</a></li>`
        ).join('');

        let memberElement = resMember !== null ? resMember.datas.map(assignee => 
            `<li><a class="dropdown-item" onclick="selectProperties(this, 'createSubIssueAssigneeProp')" data-value="${assignee.user.id}">${assignee.user.dis_name}</a></li>`
        ).join('') : '';

        document.getElementById('create_sub_issue_prop').innerHTML = `
            <div id="statusDropdown" class="dropdown me-1 mb-2">
                <button
                    class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center"
                    type="button" data-bs-toggle="dropdown">
                    <i class='bx bx-loader-alt'></i> <span class="ps-1" id="createSubIssueStatusProp" data-value="${resStatus[0].id}">${resStatus[0].name}</span>
                </button>
                <ul class="dropdown-menu modal-dropdown-menu">
                    <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${issueId}')"></li>
                    ${statusElement}
                </ul>
            </div>

            <div id="priorityDropdown" class="dropdown me-1 mb-2">
                <button
                    class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center"
                    type="button" data-bs-toggle="dropdown">
                    <i class='bx bx-flag'></i> <span class="ps-1" id="createSubIssuePriorityProp" data-value="${resPriority[0].id}">${resPriority[0].name}</span>
                </button>
                <ul class="dropdown-menu modal-dropdown-menu">
                    <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${issueId}')"></li>
                    ${priorityElement}
                </ul>
            </div>

            <div id="trackerDropdown" class="dropdown me-1 mb-2">
                <button
                    class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center"
                    type="button" data-bs-toggle="dropdown">
                    <i class='bx bx-target-lock'></i> <span class="ps-1" id="createSubIssueTrackerProp" data-value="${resTracker[0].id}">${resTracker[0].name}</span>
                </button>
                <ul class="dropdown-menu modal-dropdown-menu">
                    <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${issueId}')"></li>
                    ${trackerElement}
                </ul>
            </div>

            <div id="labelDropdown" class="dropdown me-1 mb-2">
                <button
                    class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center"
                    type="button" data-bs-toggle="dropdown">
                    <i class='bx bx-label'></i> <span class="ps-1" id="createSubIssueLabelProp" data-value="${resLabel[0].id}">${resLabel[0].name}</span>
                </button>
                <ul class="dropdown-menu modal-dropdown-menu">
                    <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${issueId}')"></li>
                    ${labelElement}
                </ul>
            </div>

            <div class="me-1 mb-2">
                <div class="input-group date">
                    <input type="text" class="form-control border-primary text-primary" id="createSubIssueStartDate"
                        placeholder="Select a date">
                    <button class="btn btn-date-icon border-primary" id="createSubIssueStartDateIcon">
                        <i class='bx bx-calendar-plus text-primary'></i>
                    </button>
                </div>
            </div>
            <div class="me-1 mb-2">
                <div class="input-group date">
                    <input type="text" class="form-control border-primary text-primary" id="createSubIssueDueDate"
                        placeholder="Select a date">
                    <button class="btn btn-date-icon border-primary" id="createSubIssueDueDateIcon">
                        <i class='bx bx-calendar-check text-primary'></i>
                    </button>
                </div>
            </div>
            <div class="dropdown me-1 mb-2">
                <button
                    class="btn btn-sm btn-outline-primary issue-item d-flex align-items-center justify-content-center"
                    type="button" data-bs-toggle="dropdown">
                    <i class='bx bx-user-pin'></i>
                    <span class="ps-1" id="createSubIssueAssigneeProp" data-value="0">Assignee</span>
                </button>
                <ul class="dropdown-menu modal-dropdown-menu">
                    <li><input type="text" class="form-control mb-2 search-input" placeholder="Search" onkeyup="filterDropdown(this, '${issueId}')"></li>
                    ${memberElement}
                </ul>
            </div>
        `;

        $(document).ready(function () {
            $('#createSubIssueStartDate').datepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            });
    
            $('#createSubIssueStartDateIcon').click(function () {
                $('#createSubIssueStartDate').datepicker('show');
            });

            $('#createSubIssueDueDate').datepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            });

            $('#createSubIssueDueDateIcon').click(function () {
                $('#createSubIssueDueDate').datepicker('show');
            });
        });

    }
}

async function createSubIssueClicked() {
    startLoading('btn-create-subissue', 'btn-create-subissue-text', 'btn-create-subissue-spinner');
    const issueId = document.getElementById('createSubIssue-issue').dataset.subissue;
    // console.log(issueId);
    const startDate = $('#createSubIssueStartDate').datepicker('getFormattedDate');
    const dueDate = $('#createSubIssueDueDate').datepicker('getFormattedDate');
    const assignee = document.getElementById('createSubIssueAssigneeProp').dataset.value == 0 ? "" : document.getElementById('createSubIssueAssigneeProp').dataset.value;
    
    // console.log(assignee);
    const name = document.getElementById('createSubIssueName').value;
    if(name.length <= 0){
        document.getElementById('createSubIssueNameValidate').innerHTML = `<span>Issue name is required..!</span>`;
        document.getElementById('createSubIssueNameValidate').classList.add('d-flex');
        document.getElementById('createSubIssueNameValidate').classList.remove('d-none');
        document.getElementById('createSubIssueName').classList.add('border-danger');
        stopLoading('btn-create-subissue', 'btn-create-subissue-text', 'btn-create-subissue-spinner', 'Save');
        return;
    } else if(name.length > 0 && name.length < 2){
        document.getElementById('createSubIssueNameValidate').innerHTML = `<span>Issue name need to be more than 1 characters!</span>`;
        document.getElementById('createSubIssueNameValidate').classList.add('d-flex');
        document.getElementById('createSubIssueNameValidate').classList.remove('d-none');
        document.getElementById('createSubIssueName').classList.add('border-danger');
        stopLoading('btn-create-subissue', 'btn-create-subissue-text', 'btn-create-subissue-spinner', 'Save');
        return;
    } else if (name.length > 255){
        document.getElementById('createSubIssueNameValidate').innerHTML = `<span>Issue name cannot be more than 255 characters..!</span>`;
        document.getElementById('createSubIssueNameValidate').classList.add('d-flex');
        document.getElementById('createSubIssueNameValidate').classList.remove('d-none');
        stopLoading('btn-create-subissue', 'btn-create-subissue-text', 'btn-create-subissue-spinner', 'Save');
        return;
    } else {
        document.getElementById('createSubIssueNameValidate').innerHTML = '';
        document.getElementById('createSubIssueNameValidate').classList.remove('d-flex');
        document.getElementById('createSubIssueNameValidate').classList.add('d-none');
        document.getElementById('createSubIssueName').classList.remove('border-danger');
    }
    const createIssueData = {
        name: name,
        description: String(document.getElementById('createSubIssueDescription').value),
        progress: '',
        start_date: startDate,
        due_date: dueDate,
        comment: '',
        status_id: Number(document.getElementById('createSubIssueStatusProp').dataset.value),
        priority_id: Number(document.getElementById('createSubIssuePriorityProp').dataset.value),
        tracker_id: Number(document.getElementById('createSubIssueTrackerProp').dataset.value),
        label_id: Number(document.getElementById('createSubIssueLabelProp').dataset.value),
        assignee: assignee,
    }
    const res = await createSubIssue(issueId, createIssueData);
    if(res.result){
        getAllIssues();
        getDetailIssueOffcanvas(issueId);
        Swal.fire({
            icon: "success",
            title: "Created an sub-issue successfully!",
            position: "top-end",
            toast: true,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            background: "#fff",
        });
        document.getElementById('createSubIssueName').value = '';
        document.getElementById('createSubIssueDescription').value = '';
        let modalCreateSubIssue = document.getElementById('createSubIssue');
        let modal = bootstrap.Modal.getInstance(modalCreateSubIssue);
        if (!modal) {
            modal = new bootstrap.Modal(modalCreateSubIssue); // Create a new instance if it doesn't exist
        }
        stopLoading('btn-create-subissue', 'btn-create-subissue-text', 'btn-create-subissue-spinner', 'Save');
        modal.hide();
        createActivity("Issue Action", 'created a new sub-issue of ');
        createIssueActivity(issueId, "Create Sub-Issue", `Created a sub-issue ( ${name} ) in issue `);
    }
}

async function updateSubIssueClicked() {
    startLoading('btn-update-subissue', 'btn-update-subissue-text', 'btn-update-subissue-spinner');
    const subIssueId = document.getElementById('updateSubIssue-subIssue').dataset.subissue;
    const issueId = document.getElementById('updateSubIssue-subIssue').dataset.issue;
    const startDate = $('#updateSubIssueStartDate').datepicker('getFormattedDate');
    const dueDate = $('#updateSubIssueDueDate').datepicker('getFormattedDate');
    const assignee = document.getElementById('updateSubIssueAssigneeProp').dataset.value == 0 ? "" : document.getElementById('updateSubIssueAssigneeProp').dataset.value;
    const name = document.getElementById('updateSubIssueName').value;
    const progress = document.getElementById('updateSubIssueProgress').value == 0 ? 0 : (Number(document.getElementById('updateSubIssueProgress').value) * 10);
    if(name.length <= 1){
        document.getElementById('updateSubIssueNameValidate').innerHTML = `<span>Issue name is required..!</span>`;
        document.getElementById('updateSubIssueNameValidate').classList.add('d-flex');
        document.getElementById('updateSubIssueNameValidate').classList.remove('d-none');
        document.getElementById('updateSubIssueName').classList.add('border-danger');
        stopLoading('btn-update-subissue', 'btn-update-subissue-text', 'btn-update-subissue-spinner', 'Save');
        return;
    } else if(name.length > 0 && name.length < 2){
        document.getElementById('updateSubIssueNameValidate').innerHTML = `<span>Issue name need to be more than 1 characters!</span>`;
        document.getElementById('updateSubIssueNameValidate').classList.add('d-flex');
        document.getElementById('updateSubIssueNameValidate').classList.remove('d-none');
        document.getElementById('updateSubIssueName').classList.add('border-danger');
        stopLoading('btn-update-subissue', 'btn-update-subissue-text', 'btn-update-subissue-spinner', 'Save');
        return;
    } else if (name.length > 255){
        document.getElementById('updateSubIssueNameValidate').innerHTML = `<span>Issue name cannot be more than 255 characters..!</span>`;
        document.getElementById('updateSubIssueNameValidate').classList.add('d-flex');
        document.getElementById('updateSubIssueNameValidate').classList.remove('d-none');
        stopLoading('btn-update-subissue', 'btn-update-subissue-text', 'btn-update-subissue-spinner', 'Save');
        return;
    } else {
        document.getElementById('updateSubIssueNameValidate').innerHTML = '';
        document.getElementById('updateSubIssueNameValidate').classList.remove('d-flex');
        document.getElementById('updateSubIssueNameValidate').classList.add('d-none');
        document.getElementById('updateSubIssueName').classList.remove('border-danger');
    }
    const updateSubIssueData = {
        name: name,
        description: String(document.getElementById('updateSubIssueDescription').value),
        progress: progress,
        start_date: startDate,
        due_date: dueDate,
        comment: document.getElementById('subIssueComment').value,
        status_id: Number(document.getElementById('updateSubIssueStatusProp').dataset.value),
        priority_id: Number(document.getElementById('updateSubIssuePriorityProp').dataset.value),
        tracker_id: Number(document.getElementById('updateSubIssueTrackerProp').dataset.value),
        label_id: Number(document.getElementById('updateSubIssueLabelProp').dataset.value),
        assignee: assignee,
    }
    // console.log(updateSubIssueData);
    const res = await editSubIssue(subIssueId, updateSubIssueData);
    if(res.result){
        getAllIssues();
        getDetailIssueOffcanvas(issueId);
        getDetailSubIssueOffcanvas(subIssueId);
        Swal.fire({
            icon: "success",
            title: "Updated sub-issue successfully!",
            position: "top-end",
            toast: true,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            background: "#fff",
        });
        document.getElementById('updateSubIssueName').value = '';
        document.getElementById('updateSubIssueDescription').value = '';
        let modalUpdateSubIssue = document.getElementById('editSubIssue');
        let modal = bootstrap.Modal.getInstance(modalUpdateSubIssue);
        if (!modal) {
            modal = new bootstrap.Modal(modalUpdateSubIssue);
        }
        stopLoading('btn-update-subissue', 'btn-update-subissue-text', 'btn-update-subissue-spinner', 'Save');
        modal.hide();
        createActivity("Sub Issue Action", 'updated on the sub-issue of ');
        createIssueActivity(issueId, "Update Sub-Issue", `Updated a sub-issue ( ${name} ) of issue `);
    }
}

async function getDetailSubIssueOffcanvas(subIssueId) {

    document.getElementById('subissue-issue').innerHTML = `
        <div class="d-flex justify-content-start placeholder-glow w-100">
          <span class="placeholder col-5 rounded-1"></span>
        </div>
    `;
    document.getElementById('subissue-name').innerHTML = `
        <div class="d-flex justify-content-start placeholder-glow w-100">
          <span class="placeholder col-5 rounded-1"></span>
        </div>
    `;
    document.getElementById('subissue-des').innerHTML = `
        <div class="d-flex justify-content-start placeholder-glow w-100">
          <span class="placeholder col-12 rounded-1"></span>
        </div>
    `;

    document.getElementById('subissue-properties').innerHTML = `
        <div class="row px-4 gy-3">
            <div class="py-2 col-4 d-flex align-items-center">
              <div class="issue-component">
                <i class='bx bx-user-circle fs-6' ></i>
                <span class="fs-6 ps-1">Created by</span>
              </div>
            </div>
            <div class="py-2 col-8 d-flex justify-content-start align-items-center">
              <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
            <div class="py-2 col-4 d-flex align-items-center">
              <div class="issue-component">
                <i class='bx bx-user-circle fs-6' ></i>
                <span class="fs-6 ps-1">Updated by</span>
              </div>
            </div>
            <div class="py-2 col-8 d-flex justify-content-start align-items-center">
              <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
            <div class="py-2 col-4 d-flex align-items-center">
              <div class="issue-component">
                <i class='bx bx-loader-alt fs-6' ></i>
                <span class="fs-6 ps-1">Status</span>
              </div>
            </div>
            <div class="py-2 col-8 d-flex justify-content-start align-items-center">
              <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
            <div class="py-2 col-4 d-flex align-items-center">
              <div class="issue-component">
                <i class='bx bx-flag fs-6' ></i>
                <span class="fs-6 ps-1">Priority</span>
              </div>
            </div>
            <div class="py-2 col-8 d-flex justify-content-start align-items-center">
              <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
            <div class="py-2 col-4 d-flex align-items-center">
              <div class="issue-component">
                <i class='bx bx-target-lock fs-6' ></i>
                <span class="fs-6 ps-1">Tracker</span>
              </div>
            </div>
            <div class="py-2 col-8 d-flex justify-content-start align-items-center">
              <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
            <div class="py-2 col-4 d-flex align-items-center">
              <div class="issue-component">
                <i class='bx bx-label fs-6'></i>
                <span class="fs-6 ps-1">Label</span>
              </div>
            </div>
            <div class="py-2 col-8 d-flex justify-content-start align-items-center">
              <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
            <div class="py-2 col-4 d-flex align-items-center">
              <div class="issue-component">
                <i class='bx bx-calendar-plus fs-6' ></i>
                <span class="fs-6 ps-1">Start Date</span>
              </div>
            </div>
            <div class="py-2 col-8 d-flex justify-content-start align-items-center">
              <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
            <div class="py-2 col-4 d-flex align-items-center">
              <div class="issue-component">
                <i class='bx bx-calendar-check fs-6' ></i>
                <span class="fs-6 ps-1">Due Date</span>
              </div>
            </div>
            <div class="py-2 col-8 d-flex justify-content-start align-items-center">
              <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
            <div class="py-2 col-4 d-flex align-items-center">
              <div class="issue-component">
                <i class='bx bx-user-pin fs-6' ></i>
                <span class="fs-6 ps-1">Assignee</span>
              </div>
            </div>
            <div class="py-2 col-8 d-flex justify-content-start align-items-center">
              <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
            <div class="py-2 col-4 d-flex align-items-center">
              <div class="issue-component">
                <i class='bx bx-git-commit fs-6'></i>
                <span class="fs-6 ps-1">Progress</span>
              </div>
            </div>
            <div class="py-2 col-8 d-flex justify-content-start align-items-center">
              <div class="d-flex justify-content-start placeholder-glow w-100">
                <span class="placeholder col-12 rounded-1"></span>
              </div>
            </div>
        </div>
    `;

    document.querySelector('.subissue-note').classList.add('d-none');

    const resSubIssue = await fetchDetailSubIssue(subIssueId);
    // console.log(resSubIssue);
    if(resSubIssue !== null){
        const subIssueData = resSubIssue.sub_issues, issueData = resSubIssue.issue;
        issueIdForAct = issueData.id;
        const resIssue = await fetchDetailIssue(issueData.id);
        const projectData = resIssue.project;
        document.querySelector('#subissue-issue').innerHTML = issueData.name;
        document.querySelector('#subissue-name').innerHTML = subIssueData.name;
        document.querySelector('#subissue-des').innerHTML = `<p>${subIssueData.description}</p>`;

        const projectId = projectData.id;
        const resStatus = await fetchAllIssueStatus(projectId);
        const resPriority = await fetchAllPriority(projectId);
        const resTracker = await fetchAllTracker(projectId);
        const resLabel = await fetchAllLabel(projectId);
        const resMember = await fetchAllMember(projectId, '', '', '');

        let statusElement = resStatus.map(status => 
            `<li><a class="dropdown-item ${subIssueData.status.id === status.id ? 'text-primary' : ''}" onclick="invokeChangeSubStatus(this, getAllIssues, getDetailSubIssueOffcanvas, ${subIssueId})" data-subissue="${subIssueId}" data-name="${status.name}" data-value="${status.id}">${status.name}</a></li>`
        ).join('');

        let priorityElement = resPriority.map(priority => 
            `<li><a class="dropdown-item ${subIssueData.priority.id === priority.id ? 'text-primary' : ''}" onclick="invokeChangeSubPriority(this, getAllIssues, getDetailSubIssueOffcanvas, ${subIssueId})" data-subissue="${subIssueId}" data-name="${priority.name}" data-value="${priority.id}">${priority.name}</a></li>`
        ).join('');

        let trackerElement = resTracker.map(tracker => 
            `<li><a class="dropdown-item ${subIssueData.tracker.id === tracker.id ? 'text-primary' : ''}" onclick="invokeChangeSubTracker(this, getAllIssues, getDetailSubIssueOffcanvas, ${subIssueId})" data-subissue="${subIssueId}" data-name="${tracker.name}" data-value="${tracker.id}">${tracker.name}</a></li>`
        ).join('');

        let labelElement = resLabel.map(label => 
            `<li><a class="dropdown-item ${subIssueData.label.id === label.id ? 'text-primary' : ''}" onclick="invokeChangeSubLabel(this, getAllIssues, getDetailSubIssueOffcanvas, ${subIssueId})" data-subissue="${subIssueId}" data-name="${label.name}" data-value="${label.id}">${label.name}</a></li>`
        ).join('');

        let memberElement = resMember !== null ? resMember.datas.map(assignee => 
            `<li><a class="dropdown-item ${subIssueData.assignee.id === assignee.user.id ? 'text-primary' : ''}" onclick="invokeChangeSubAssignee(this, getAllIssues, getDetailSubIssueOffcanvas, ${subIssueId})" data-subissue="${subIssueId}" data-member="${assignee.user.email}" data-value="${assignee.user.id}">${assignee.user.email}</a></li>`
        ).join('') : '';
        
        const issueProgress = subIssueData.progress == 0 ? 0 : subIssueData.progress / 10;

        const subissue_properties = `
            <div class="row px-4 gy-3">
                <div class="py-0 col-4 d-flex align-items-center">
                    <div class="issue-component">
                        <i class='bx bx-user-circle fs-6' ></i>
                        <span class="fs-6 ps-1">Created by</span>
                    </div>
                    </div>
                    <div class="py-0 col-8 d-flex justify-content-start align-items-center">
                    <button class="btn btn-property disabled issue-item d-flex align-items-center justify-content-between" data-issue="" type="button" data-bs-toggle="dropdown">
                        <span>${subIssueData.creator.dis_name}</span>
                    </button>
                </div>
                <div class="py-0 col-4 d-flex align-items-center">
                    <div class="issue-component">
                        <i class='bx bx-user-circle fs-6' ></i>
                        <span class="fs-6 ps-1">Updated by</span>
                    </div>
                    </div>
                    <div class="py-0 col-8 d-flex justify-content-start align-items-center">
                    <button class="btn btn-property disabled issue-item d-flex align-items-center justify-content-between" data-issue="" type="button" data-bs-toggle="dropdown">
                        <span>${subIssueData.updater.email == null || subIssueData.updater.email == '' ? "updater" : subIssueData.updater.email}</span>
                    </button>
                </div>
                <div class="py-0 col-4 d-flex align-items-center">
                    <div class="issue-component">
                    <i class='bx bx-loader-alt fs-6' ></i>
                    <span class="fs-6 ps-1">Status</span>
                    </div>
                </div>
                <div class="py-0 col-8 d-flex justify-content-start align-items-center">
                    <div "statusDropdown" class="dropdown w-100">
                        <button class="btn btn-property issue-item d-flex align-items-center justify-content-between" data-issue="" type="button" data-bs-toggle="dropdown">
                            <span>${subIssueData.status.name}</span>
                            <span class="dropdown-icon"><i class='bx bx-chevron-down' ></i></span>
                        </button>
                        <ul class="dropdown-menu py-1 px-2">
                            <li>
                                <input type="text" class="form-control mb-2 search-input"
                                    placeholder="Search" onkeyup="filterDropdown(this, '${subIssueId}')">
                            </li>
                            ${statusElement}
                        </ul>
                    </div>
                </div>
                <div class="py-0 col-4 d-flex align-items-center">
                    <div class="issue-component">
                    <i class='bx bx-flag fs-6' ></i>
                    <span class="fs-6 ps-1">Priority</span>
                    </div>
                </div>
                <div class="py-0 col-8 d-flex justify-content-start align-items-center">
                    <div id="priorityDropdown" class="dropdown w-100">
                        <button class="btn btn-property issue-item d-flex align-items-center justify-content-between" data-issue="" type="button" data-bs-toggle="dropdown">
                            <span>${subIssueData.priority.name}</span>
                            <span class="dropdown-icon"><i class='bx bx-chevron-down' ></i></span>
                        </button>
                        <ul class="dropdown-menu py-1 px-2">
                            <li>
                                <input type="text" class="form-control mb-2 search-input" 
                                    placeholder="Search" onkeyup="filterDropdown(this, '${subIssueId}')">
                            </li>
                            ${priorityElement}
                        </ul>
                    </div>
                </div>
                <div class="py-0 col-4 d-flex align-items-center">
                    <div class="issue-component">
                    <i class='bx bx-target-lock fs-6' ></i>
                    <span class="fs-6 ps-1">Tracker</span>
                    </div>
                </div>
                <div class="py-0 col-8 d-flex justify-content-start align-items-center">
                    <div id="trackerDropdown" class="dropdown w-100">
                        <button class="btn btn-property issue-item d-flex align-items-center justify-content-between" data-issue="" type="button" data-bs-toggle="dropdown">
                            <span>${subIssueData.tracker.name}</span>
                            <span class="dropdown-icon"><i class='bx bx-chevron-down' ></i></span>
                        </button>
                        <ul class="dropdown-menu py-1 px-2">
                            <li>
                                <input type="text" class="form-control mb-2 search-input" 
                                    placeholder="Search" onkeyup="filterDropdown(this, '${subIssueId}')">
                            </li>
                            ${trackerElement}
                        </ul>
                    </div>
                </div>
                <div class="py-0 col-4 d-flex align-items-center">
                    <div class="issue-component">
                    <i class='bx bx-label fs-6'></i>
                    <span class="fs-6 ps-1">Label</span>
                    </div>
                </div>
                <div class="py-0 col-8 d-flex justify-content-start align-items-center">
                    <div id="labelDropdown" class="dropdown w-100">
                        <button class="btn btn-property issue-item d-flex align-items-center justify-content-between" data-issue="" type="button" data-bs-toggle="dropdown">
                            <span>${subIssueData.label.name}</span>
                            <span class="dropdown-icon"><i class='bx bx-chevron-down' ></i></span>
                        </button>
                        <ul class="dropdown-menu py-1 px-2">
                            <li>
                                <input type="text" class="form-control mb-2 search-input" 
                                    placeholder="Search" onkeyup="filterDropdown(this, '${subIssueId}')">
                            </li>
                            ${labelElement}
                        </ul>
                    </div>
                </div>
                <div class="py-0 col-4 d-flex align-items-center">
                    <div class="issue-component">
                    <i class='bx bx-calendar-plus fs-6' ></i>
                    <span class="fs-6 ps-1">Start Date</span>
                    </div>
                </div>
                <div class="py-0 col-8 d-flex justify-content-start align-items-center">
                    <div class="input-group date">
                        <input type="text" class="form-control border-0 text-primary" id="sub-startdate" placeholder="Select a date">
                        <button class="btn btn-date-icon" id="sub-startdateIcon">
                            <i class='bx bx-calendar-plus'></i>
                        </button>
                    </div>
                </div>
                <div class="py-0 col-4 d-flex align-items-center">
                    <div class="issue-component">
                    <i class='bx bx-calendar-check fs-6' ></i>
                    <span class="fs-6 ps-1">Due Date</span>
                    </div>
                </div>
                <div class="py-0 col-8 d-flex justify-content-start align-items-center">
                    <div class="input-group date">
                        <input type="text" class="form-control border-0 text-primary" id="sub-duedate" placeholder="Select a date">
                        <button class="btn btn-date-icon" id="sub-duedateIcon">
                            <i class='bx bx-calendar-check' ></i>
                        </button>
                    </div>
                </div>
                <div class="py-0 col-4 d-flex align-items-center">
                    <div class="issue-component">
                    <i class='bx bx-user-pin fs-6' ></i>
                    <span class="fs-6 ps-1">Assignee</span>
                    </div>
                </div>
                <div class="py-0 col-8 d-flex justify-content-start align-items-center">
                    <div id="statusDropdown" class="dropdown w-100">
                        <button class="btn btn-property issue-item d-flex align-items-center justify-content-between" data-issue="" type="button" data-bs-toggle="dropdown">
                            <span>${subIssueData.assignee.email == null || subIssueData.assignee.email == '' ? "Assignee" : subIssueData.assignee.email}</span>
                            <span class="dropdown-icon"><i class='bx bx-chevron-down' ></i></span>
                        </button>
                        <ul class="dropdown-menu py-1 px-2">
                            <li>
                                <input type="text" class="form-control mb-2 search-input" 
                                placeholder="Search" onkeyup="filterDropdown(this, '${subIssueId}')">
                            </li>
                            ${memberElement}
                        </ul>
                    </div>
                </div>
                <div class="py-0 col-4 d-flex align-items-center">
                    <div class="issue-component">
                    <i class='bx bx-git-commit fs-6'></i>
                    <span class="fs-6 ps-1">Progress</span>
                    </div>
                </div>
                <div class="py-0 col-8 d-flex justify-content-start align-items-center">
                    <div class="d-flex align-items-center w-100">
                        <input type="range" class="form-range px-2" min="0" max="10" value="${issueProgress}" oninput="onInputDetailSubIssueProgress(${subIssueId}, 'updateDetailSubIssueProgress')" id="updateDetailSubIssueProgress" />
                        <span class="ps-3" id="issueDetailProgressValue">${Number(subIssueData.progress)}%</span>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('subissue-properties').innerHTML = subissue_properties;
        document.getElementById('subcomment-editor').innerHTML = subIssueData.comment;
        document.querySelector('.btn-comment-subissue').dataset.subissue = subIssueData.id;
        document.querySelector('.subissue-note').classList.remove('d-none');

        $(document).ready(function () {
            // Initialize start date picker
            if (subIssueData.start_date !== null) {
                const dateObj = new Date(subIssueData.start_date);
                const start_date = dateObj.toLocaleDateString('en-CA');
                $(`#sub-startdate`).val(start_date);
            }
            $(`#sub-startdate`).datepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            }).on('changeDate', async function (e) {
                const selectedDate = $(this).val();
                await invokeChangeSubStartDate(subIssueData.id, selectedDate, getAllIssues, getDetailSubIssueOffcanvas, subIssueId);
                createActivity("Start Date", 'updated sub issue start date of ');
                createIssueActivity(issueData.id, "Update Sub-Issue", `Updated start date of sub-issue ( ${subIssueData.name} ) of issue `);
            });

            $(`#sub-startdateIcon`).click(function () {
                $(`#sub-startdate`).datepicker('show');
            });

            // Initialize due date picker
            if (subIssueData.due_date !== null) {
                const dateObj = new Date(subIssueData.due_date);
                const due_date = dateObj.toLocaleDateString('en-CA');
                $(`#sub-duedate`).val(due_date);
            }
            $(`#sub-duedate`).datepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            }).on('changeDate', async function (e) {
                const selectedDate = $(this).val();
                await invokeChangeSubDueDate(subIssueData.id, selectedDate, getAllIssues, getDetailSubIssueOffcanvas, subIssueId);
                createActivity("Due Date", 'updated sub issue due date of ');
                createIssueActivity(issueData.id, "Update Sub-Issue", `Updated due date of sub-issue ( ${subIssueData.name} ) of issue `);
            });

            $(`#sub-duedateIcon`).click(function () {
                $(`#sub-duedate`).datepicker('show');
            });

            subquill = new Quill("#subcomment-editor", {
                modules: {
                    syntax: true,
                    toolbar: "#subissuetoolbar-container",
                },
                placeholder: "Compose an epic...",
                theme: "snow",
            });
        });
    }
}

async function onInputDetailSubIssueProgress(subIssueId, element){
    const value = document.getElementById(element).value;
    const res = await invokeChangeSubProgress(
        subIssueId,
        Number(value * 10),
        getAllIssues,
        getDetailSubIssueOffcanvas,
        subIssueId
    );
    if(res.result){
        createActivity("Sub Issue Action", 'updated sub-issue progress of');
        const subIssueRes = await fetchDetailSubIssue(subIssueId);
        if(subIssueRes !== null){
            createIssueActivity(subIssueRes.issue.id, "Update Sub-Issue", `Updated sub-issue ( ${subIssueRes.sub_issues.name} ) progress to < ${Number(value * 10)}% > of issue `);
        }
    }
}

