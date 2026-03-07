'use strict';

const socket = io();


function showNotification(data, getData) {

    const message = `Notification from "${data[getData]}"`;

    Swal.fire({
        icon: "success",
        title: message,
        position: "top-end",
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff",
    });
}

socket.on('receiveNotification', (data) => showNotification(data, 'forgotValue')); 



const getUserRole = async () => {
    const response = await fetch(`${baseApiUrl}/api/profile`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });

    const result = await response.json();
    return result.data[0].role.id;
}

(async function () {
    await getSidebar();
})();

async function getSidebar() {
    const userId = await getUserRole();
    if (userId == 1) {
        await readerSidebarMenu();
    } else if (userId == 2) {
        await readerSidebarMenuAdmin();
    } else {
        await readerSidebarMenuUser();
    }
}


async function readerSidebarMenu() {

    document.getElementById('web-sidebar-menu').innerHTML = `
        <li class="menu-header small text-uppercase mb-2">
            <span class="menu-header-text placeholder-glow"><span class="placeholder py-2 col-12 rounded-1"></span></span>
        </li>
        <li class="menu-item placeholder-glow d-flex">
            <span class="placeholder py-3 my-2 col-10 mx-auto rounded-1"></span>
        </li>
        <li class="menu-item placeholder-glow d-flex">
            <span class="placeholder py-3 my-2 col-10 mx-auto rounded-1"></span>
        </li>
        <li class="menu-item placeholder-glow d-flex">
            <span class="placeholder py-3 my-2 col-10 mx-auto rounded-1"></span>
        </li>
        <li class="menu-item placeholder-glow d-flex">
            <span class="placeholder py-3 my-2 col-10 mx-auto rounded-1"></span>
        </li>
        <li class="menu-item placeholder-glow d-flex">
            <span class="placeholder py-3 my-2 col-10 mx-auto rounded-1"></span>
        </li>
        
        <li class="menu-header small text-uppercase mb-2">
            <span class="menu-header-text placeholder-glow"><span class="placeholder py-2 col-12 rounded-1"></span></span>
        </li>
        <li class="menu-item placeholder-glow d-flex">
            <span class="placeholder py-3 my-2 col-10 mx-auto rounded-1"></span>
        </li>
        <li class="menu-item placeholder-glow d-flex">
            <span class="placeholder py-3 my-2 col-10 mx-auto rounded-1"></span>
        </li>
    `;

    let renderSideProject = '';
    const projectRes = await fetchProject();
    
    const side_page_active = sessionStorage.getItem('side_page_active');
    
    let side1 = side_page_active == 'side-1' ? 'active show open' : '';
    let side2 = side_page_active == 'side-2' ? 'active show open' : '';
    let side3 = side_page_active == 'side-3' ? 'active show open' : '';
    let side4 = side_page_active == 'side-4' ? 'active show open' : '';
    let side5 = side_page_active == 'side-5' ? 'active show open' : '';
    let side6 = side_page_active == 'side-6' ? 'active show open' : '';

    if (projectRes !== null) {
        for (const element of projectRes.datas) {
            let projectActive = '', cateActive = '';
            const projectActiveId = sessionStorage.getItem('project_active_id');
            if(projectActiveId == element.id){
                projectActive = sessionStorage.getItem(`project_active`) === '1' ? 'active open' : '';
            }
            const cateActiveId = sessionStorage.getItem('cate_active_id');
            if(cateActiveId == element.id){
                cateActive = sessionStorage.getItem('cate_active') === '1' ? 'active open' : '';
            }

            let renderSideCategory = '';
            const categoryRes = await fetchAllCategory(element.id);
            
            if (categoryRes !== null && Object.keys(categoryRes).length > 0) {
                categoryRes.categories.forEach((cate) => {
                    let cateItemActive = '';
                    const cateItemActiveId = sessionStorage.getItem('cate_item_active_id');
                    if(cateItemActiveId == cate.id){
                        cateItemActive = sessionStorage.getItem('cate_item_active') === '1' ? 'active open' : '';
                    }

                    // const isCategoryActive = sessionStorage.getItem(`category_active_${cate.id}`) === '1' ? 'active' : '';
                    
                    renderSideCategory += `
                        <li class="menu-item ${cateItemActive}" onclick="categoryMenuClicked(this)" data-id="${element.id}" id="category-${cate.id}" data-cateid="${cate.id}">
                            <a href="/pages/issuecategory" class="menu-link" onclick="sideCateClicked(event, '/pages/issuecategory')">
                                <div class="side-hide-overtext">${cate.name}</div>
                            </a>
                        </li>
                    `;
                });
            }

            renderSideProject += `
                <li class="menu-item ${projectActive}" id="project-menu-${element.id}">
                    <a class="menu-link menu-toggle">
                        <i class="menu-icon tf-icons bx bx-box"></i>
                        <div class="side-hide-overtext">${element.name}</div>
                    </a>
                    <ul class="menu-sub">
                        <li class="menu-item" id="project-menu-setting">
                            <a href="/pages/project-setting" class="menu-link setting-link" onclick="projectMenuClicked(this, event, '/pages/project-setting')" data-id="${element.id}" data-page="project-setting">
                                <i class='menu-icon tf-icons bx bx-cog'></i>
                                <div class="ps-2">Setting</div>
                            </a>
                        </li>
                        <li class="menu-item" id="project-menu-resource">
                            <a href="/pages/resource" class="menu-link" onclick="projectMenuClicked(this, event, '/pages/resource')" data-id="${element.id}" data-page="resource">
                                <i class='menu-icon tf-icons bx bx-book-bookmark'></i>
                                <div class="ps-2">Resource</div>
                            </a>
                        </li>
                        <li class="menu-item" id="project-menu-analytic">
                            <a href="/pages/analytic" class="menu-link" onclick="projectMenuClicked(this, event, '/pages/analytic')" data-id="${element.id}" data-page="analytic">
                                <i class='menu-icon tf-icons bx bx-line-chart'></i>
                                <div class="ps-2">Analytics</div>
                            </a>
                        </li>
                        <li class="menu-item" id="project-menu-activity">
                            <a href="/pages/activity" class="menu-link" onclick="projectMenuClicked(this, event, '/pages/activity')" data-id="${element.id}" data-page="activity">
                                <i class='menu-icon tf-icons bx bx-chart'></i>
                                <div class="ps-2">Activity</div>
                            </a>
                        </li>
                        <li class="menu-item ${cateActive}" id="cate-menu-${element.id}">
                            <a class="menu-link menu-toggle" data-id="${element.id}">
                                <i class='menu-icon tf-icons bx bx-customize'></i>
                                <div class="ps-2">Category</div>
                            </a>
                            <ul class="menu-sub">
                                ${renderSideCategory}
                                <li class="menu-item">
                                    <div class="ms-4 me-3">
                                        <button type="button" class="btn btn-primary w-100 px-3 text-white d-flex align-items-center"
                                            data-bs-target="#sideCategory" data-bs-toggle="modal"
                                            style="border-radius: 8px; font-size: 14px;" onclick="projectClickedOpen(${element.id})">
                                            <i class='menu-icon tf-icons bx bx-plus pe-4'></i>
                                            Add Category
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            `;
        }
    }

    document.getElementById('web-sidebar-menu').innerHTML = `
        <li class="menu-header small text-uppercase">
            <span class="menu-header-text">Work Control</span>
        </li>
        <li class="menu-item ${side1}">
            <a href="/pages/home" class="menu-link" onclick="removeDataOnStorage('1', event, '/pages/home')">
                <i class="menu-icon tf-icons bx bx-home-circle"></i>
                <div>Home</div>
            </a>
        </li>
        <li class="menu-item ${side2}">
            <a href="/pages/createproject" class="menu-link" onclick="removeDataOnStorage('2', event, '/pages/createproject')">
                <i class='menu-icon tf-icons bx bx-briefcase'></i>
                <div>Project</div>
            </a>
        </li>
        <li class="menu-item ${side3}">
            <a href="/pages/dashboard" class="menu-link" onclick="removeDataOnStorage('3', event, '/pages/dashboard')">
                <i class='menu-icon tf-icons bx bx-bar-chart'></i>
                <div>Dashboard</div>
            </a>
        </li>
        <li class="menu-item ${side4}">
            <a href="/pages/notifaction" class="menu-link" onclick="removeDataOnStorage('4', event, '/pages/notifaction')">
                <i class='menu-icon tf-icons bx bx-bell'></i>
                <div>Notification</div>
            </a>
        </li>
        <li class="menu-item ${side5}">
            <a href="/pages/status" class="menu-link" onclick="removeDataOnStorage('5', event, '/pages/status')">
                <i class='menu-icon tf-icons bx bx-stats pe-1'></i>
                <div>Status</div>
            </a>
        </li>
        
        <li class="menu-header small text-uppercase">
            <span class="menu-header-text text-primary">Workspace management</span>
        </li>
        
        <li class="menu-item ${side6}">
            <a href="/pages/tableuser" class="menu-link" onclick="removeDataOnStorage('6', event, '/pages/tableuser')">
                <i class='menu-icon tf-icons bx bx-user'></i>
                <div>All Users</div>
            </a>
        </li>
        ${renderSideProject}
    `;
}

function sideCateClicked(event, url){
    event.preventDefault(); // Prevent the default link behavior
    window.location.replace(url);
}

function projectClickedOpen(projectId){
    const currentSideProjectId = localStorage.getItem('sideProjectID');
    if(currentSideProjectId !== null){
        localStorage.removeItem('sideProjectID');
    }
    localStorage.setItem('sideProjectID', projectId);
}

function removeDataOnStorage(pageVal, event, url){

    event.preventDefault(); // Prevent the default link behavior
    window.location.replace(url);

    sessionStorage.setItem('side_page_active', `side-${pageVal}`);

    const current_project_id = localStorage.getItem('projectID');
    if(current_project_id !== null){
        localStorage.removeItem('projectID');
    }
    const current_cate_id = localStorage.getItem('categoryID');
    if(current_cate_id !== null){
        localStorage.removeItem('categoryID');
    }
    const active = sessionStorage.getItem(`project_active`);
    if(active !== null) {
        sessionStorage.removeItem('project_active');
    }
    const active_id = sessionStorage.getItem('project_active_id');
    if(active_id !== null) {
        sessionStorage.removeItem('project_active_id');
    }
    const cate_active = sessionStorage.getItem('cate_active');
    if(cate_active !== null){
        sessionStorage.removeItem('cate_active');
    }
    const cate_active_id = sessionStorage.getItem('cate_active_id');
    if(cate_active_id !== null){
        sessionStorage.removeItem('cate_active_id')
    }
    const cate_item_active = sessionStorage.getItem('cate_item_active');
    if(cate_item_active !== null) {
        sessionStorage.removeItem('cate_item_active');
    }
    const cate_item_active_id = sessionStorage.getItem('cate_item_active_id');
    if(cate_item_active_id !== null) {
        sessionStorage.removeItem('cate_item_active_id');
    }
}

function projectMenuClicked(item, event, url) {

    event.preventDefault(); // Prevent the default link behavior
    window.location.replace(url);

    const side_page_active = sessionStorage.getItem('side_page_active');
    if(side_page_active !== null) {
        sessionStorage.removeItem('side_page_active');
    }

    const projectId = item.dataset.id;
    const current_project_id = localStorage.getItem('projectID');
    if(current_project_id !== null){
        localStorage.removeItem('projectID');
    }
    localStorage.setItem('projectID', projectId);
    const projectElement = document.getElementById(`project-menu-${projectId}`);

    const active = sessionStorage.getItem(`project_active`);
    const active_id = sessionStorage.getItem('project_active_id');
    if(active !== null) {
        const active_element = document.getElementById(`project-menu-${active_id}`);
        if(active == 1){
            active_element.classList.remove("active", "open");
        }
    }
    const cate_active = sessionStorage.getItem('cate_active');
    const cate_active_id = sessionStorage.getItem('cate_active_id');
    if(cate_active !== null){
        const active_cate_element = document.getElementById(`cate-menu-${cate_active_id}`);
        if(cate_active == 1) {
            active_cate_element.classList.remove("active", "open");
            sessionStorage.setItem('cate_active', '0');
        }
    }
    const cate_item_active = sessionStorage.getItem('cate_item_active');
    const cate_item_active_id = sessionStorage.getItem('cate_item_active_id');
    if(cate_item_active !== null) {
        const active_cate_item = document.getElementById(`category-${cate_item_active_id}`);
        if(cate_item_active == 1){
            active_cate_item.classList.remove("active", "open");
            sessionStorage.setItem('cate_item_active', '0');
        }
    }
    
    projectElement.classList.add("active", "open");
    sessionStorage.setItem(`project_active`, '1');
    sessionStorage.setItem(`project_active_id`, `${projectId}`);
    // readerSidebarMenu();
}

function categoryMenuClicked(item) {

    const side_page_active = sessionStorage.getItem('side_page_active');
    if(side_page_active !== null) {
        sessionStorage.removeItem('side_page_active');
    }

    const cateId = item.dataset.cateid;
    localStorage.setItem('categoryID', cateId);
    const projectId = item.dataset.id;
    localStorage.setItem('projectID', projectId);

    const cateElement = document.getElementById(`cate-menu-${projectId}`);
    const projectElement = document.getElementById(`project-menu-${projectId}`);
    const cateItemElement = document.getElementById(`category-${projectId}`);

    const active = sessionStorage.getItem(`project_active`);
    const active_id = sessionStorage.getItem('project_active_id');
    if(active !== null) {
        const active_element = document.getElementById(`project-menu-${active_id}`);
        if(active == 1){
            active_element.classList.remove("active", "open");
        }
    }
    const cate_active = sessionStorage.getItem('cate_active');
    const cate_active_id = sessionStorage.getItem('cate_active_id');
    if(cate_active !== null){
        const active_cate_element = document.getElementById(`cate-menu-${cate_active_id}`);
        if(cate_active == 1) {
            active_cate_element.classList.remove("active", "open");
            sessionStorage.setItem('cate_active', '0');
        }
    }
    const cate_item_active = sessionStorage.getItem('cate_item_active');
    const cate_item_active_id = sessionStorage.getItem('cate_item_active_id');
    if(cate_item_active !== null) {
        const active_cate_item = document.getElementById(`category-${cate_item_active_id}`);
        if(cate_item_active == 1){
            active_cate_item.classList.remove("active", "open");
            sessionStorage.setItem('cate_item_active', '0');
        }
    }

    projectElement.classList.add("active", "open");
    sessionStorage.setItem(`project_active`, '1');
    sessionStorage.setItem(`project_active_id`, `${projectId}`);

    cateElement.classList.add("active", "open");
    sessionStorage.setItem('cate_active', '1');
    sessionStorage.setItem('cate_active_id', `${projectId}`);

    cateItemElement.classList.add("active", "open");
    sessionStorage.setItem('cate_item_active', '1');
    sessionStorage.setItem('cate_item_active_id', `${cateId}`);
    // readerSidebarMenu();
}

async function readerSidebarMenuAdmin() {

    document.getElementById('web-sidebar-menu').innerHTML = `
        <li class="menu-header small text-uppercase mb-2">
            <span class="menu-header-text placeholder-glow"><span class="placeholder py-2 col-12 rounded-1"></span></span>
        </li>
        <li class="menu-item placeholder-glow d-flex">
            <span class="placeholder py-3 my-2 col-10 mx-auto rounded-1"></span>
        </li>
        <li class="menu-item placeholder-glow d-flex">
            <span class="placeholder py-3 my-2 col-10 mx-auto rounded-1"></span>
        </li>
        <li class="menu-item placeholder-glow d-flex">
            <span class="placeholder py-3 my-2 col-10 mx-auto rounded-1"></span>
        </li>
        <li class="menu-item placeholder-glow d-flex">
            <span class="placeholder py-3 my-2 col-10 mx-auto rounded-1"></span>
        </li>
        
        <li class="menu-header small text-uppercase mb-2">
            <span class="menu-header-text placeholder-glow"><span class="placeholder py-2 col-12 rounded-1"></span></span>
        </li>
        <li class="menu-item placeholder-glow d-flex">
            <span class="placeholder py-3 my-2 col-10 mx-auto rounded-1"></span>
        </li>
        <li class="menu-item placeholder-glow d-flex">
            <span class="placeholder py-3 my-2 col-10 mx-auto rounded-1"></span>
        </li>
    `;

    let renderSideProject = '';
    const projectRes = await fetchProject();

    const side_page_active = sessionStorage.getItem('side_page_active');
    
    let side1 = side_page_active == 'side-1' ? 'active show open' : '';
    let side2 = side_page_active == 'side-2' ? 'active show open' : '';
    let side3 = side_page_active == 'side-3' ? 'active show open' : '';
    let side4 = side_page_active == 'side-4' ? 'active show open' : '';
    let side5 = side_page_active == 'side-5' ? 'active show open' : '';

    if (projectRes !== null) {
        for (const element of projectRes.datas) {
            let projectActive = '', cateActive = '';
            const projectActiveId = sessionStorage.getItem('project_active_id');
            if(projectActiveId == element.id){
                projectActive = sessionStorage.getItem(`project_active`) === '1' ? 'active open' : '';
            }
            const cateActiveId = sessionStorage.getItem('cate_active_id');
            if(cateActiveId == element.id){
                cateActive = sessionStorage.getItem('cate_active') === '1' ? 'active open' : '';
            }

            let renderSideCategory = '';
            const categoryRes = await fetchAllCategory(element.id);
            
            if (categoryRes !== null && Object.keys(categoryRes).length > 0) {
                categoryRes.categories.forEach((cate) => {
                    let cateItemActive = '';
                    const cateItemActiveId = sessionStorage.getItem('cate_item_active_id');
                    if(cateItemActiveId == cate.id){
                        cateItemActive = sessionStorage.getItem('cate_item_active') === '1' ? 'active open' : '';
                    }

                    // const isCategoryActive = sessionStorage.getItem(`category_active_${cate.id}`) === '1' ? 'active' : '';
                    
                    renderSideCategory += `
                        <li class="menu-item ${cateItemActive}" onclick="categoryMenuClicked(this)" data-id="${element.id}" id="category-${cate.id}" data-cateid="${cate.id}">
                            <a href="/pages/issuecategory" class="menu-link" onclick="sideCateClicked(event, '/pages/issuecategory')">
                                <div class="side-hide-overtext">${cate.name}</div>
                            </a>
                        </li>
                    `;
                });
            }

            renderSideProject += `
                <li class="menu-item ${projectActive}" id="project-menu-${element.id}">
                    <a class="menu-link menu-toggle">
                        <i class="menu-icon tf-icons bx bx-box"></i>
                        <div class="side-hide-overtext">${element.name}</div>
                    </a>
                    <ul class="menu-sub">
                        <li class="menu-item" id="project-menu-setting">
                            <a href="/pages/project-setting" class="menu-link setting-link" onclick="projectMenuClicked(this, event, '/pages/project-setting')" data-id="${element.id}" data-page="project-setting">
                                <i class='menu-icon tf-icons bx bx-cog'></i>
                                <div class="ps-2">Setting</div>
                            </a>
                        </li>
                        <li class="menu-item" id="project-menu-resource">
                            <a href="/pages/resource" class="menu-link" onclick="projectMenuClicked(this, event, '/pages/resource')" data-id="${element.id}" data-page="resource">
                                <i class='menu-icon tf-icons bx bx-book-bookmark'></i>
                                <div class="ps-2">Resource</div>
                            </a>
                        </li>
                        <li class="menu-item" id="project-menu-analytic">
                            <a href="/pages/analytic" class="menu-link" onclick="projectMenuClicked(this, event, '/pages/analytic')" data-id="${element.id}" data-page="analytic">
                                <i class='menu-icon tf-icons bx bx-line-chart'></i>
                                <div class="ps-2">Analytics</div>
                            </a>
                        </li>
                        <li class="menu-item" id="project-menu-activity">
                            <a href="/pages/activity" class="menu-link" onclick="projectMenuClicked(this, event, '/pages/activity')" data-id="${element.id}" data-page="activity">
                                <i class='menu-icon tf-icons bx bx-chart'></i>
                                <div class="ps-2">Activity</div>
                            </a>
                        </li>
                        <li class="menu-item ${cateActive}" id="cate-menu-${element.id}">
                            <a class="menu-link menu-toggle" data-id="${element.id}">
                                <i class='menu-icon tf-icons bx bx-customize'></i>
                                <div class="ps-2">Category</div>
                            </a>
                            <ul class="menu-sub">
                                ${renderSideCategory}
                                <li class="menu-item">
                                    <div class="ms-4 me-3">
                                        <button type="button" class="btn btn-primary w-100 px-3 text-white d-flex align-items-center"
                                            data-bs-target="#sideCategory" data-bs-toggle="modal"
                                            style="border-radius: 8px; font-size: 14px;" onclick="projectClickedOpen(${element.id})">
                                            <i class='menu-icon tf-icons bx bx-plus pe-4'></i>
                                            Add Category
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            `;
        }
    }

    document.getElementById('web-sidebar-menu').innerHTML = `
        <li class="menu-header small text-uppercase">
            <span class="menu-header-text text-primary">Work Control</span>
        </li>
        <li class="menu-item ${side1}">
            <a href="/pages/home" class="menu-link" onclick="removeDataOnStorage('1', event, '/pages/home')">
                <i class="menu-icon tf-icons bx bx-home-circle"></i>
                <div>Home</div>
            </a>
        </li>
        <li class="menu-item ${side2}">
            <a href="/pages/createproject" class="menu-link" onclick="removeDataOnStorage('2', event, '/pages/createproject')">
                <i class='menu-icon tf-icons bx bx-briefcase'></i>
                <div>Project</div>
            </a>
        </li>
        <li class="menu-item ${side3}">
            <a href="/pages/notifaction" class="menu-link" onclick="removeDataOnStorage('3', event, '/pages/notifaction')">
                <i class='menu-icon tf-icons bx bx-bell'></i>
                <div>Notification</div>
            </a>
        </li>
        <li class="menu-item ${side4}">
            <a href="/pages/status" class="menu-link" onclick="removeDataOnStorage('4', event, '/pages/status')">
                <i class='menu-icon tf-icons bx bx-stats pe-1'></i>
                <div>Status</div>
            </a>
        </li>
        
        <li class="menu-header small text-uppercase color-primary">
            <span class="menu-header-text text-primary">Workspace management</span>
        </li>
        <li class="menu-item ${side5}">
            <a href="/pages/tableuser" class="menu-link" onclick="removeDataOnStorage('5', event, '/pages/tableuser')">
                <i class='menu-icon tf-icons bx bx-user'></i>
                <div>All Users</div>
            </a>
        </li>
        ${renderSideProject}
    `;
}



async function readerSidebarMenuUser() {
    document.getElementById('web-sidebar-menu').innerHTML = `
        <li class="menu-header small text-uppercase mb-2">
            <span class="menu-header-text placeholder-glow"><span class="placeholder py-2 col-12 rounded-1"></span></span>
        </li>
        <li class="menu-item placeholder-glow d-flex">
            <span class="placeholder py-3 my-2 col-10 mx-auto rounded-1"></span>
        </li>
        <li class="menu-item placeholder-glow d-flex">
            <span class="placeholder py-3 my-2 col-10 mx-auto rounded-1"></span>
        </li>
        <li class="menu-item placeholder-glow d-flex">
            <span class="placeholder py-3 my-2 col-10 mx-auto rounded-1"></span>
        </li>
        
        <li class="menu-header small text-uppercase mb-2">
            <span class="menu-header-text placeholder-glow"><span class="placeholder py-2 col-12 rounded-1"></span></span>
        </li>
        <li class="menu-item placeholder-glow d-flex">
            <span class="placeholder py-3 my-2 col-10 mx-auto rounded-1"></span>
        </li>
    `;

    let renderSideProject = '';
    const projectRes = await fetchProject();

    const side_page_active = sessionStorage.getItem('side_page_active');
    
    let side1 = side_page_active == 'side-1' ? 'active show open' : '';
    let side2 = side_page_active == 'side-2' ? 'active show open' : '';
    let side3 = side_page_active == 'side-3' ? 'active show open' : '';
    
    if (projectRes !== null) {
        for (const element of projectRes.datas) {
            let projectActive = '', cateActive = '';
            const projectActiveId = sessionStorage.getItem('project_active_id');
            if(projectActiveId == element.id){
                projectActive = sessionStorage.getItem(`project_active`) === '1' ? 'active open' : '';
            }
            const cateActiveId = sessionStorage.getItem('cate_active_id');
            if(cateActiveId == element.id){
                cateActive = sessionStorage.getItem('cate_active') === '1' ? 'active open' : '';
            }

            let renderSideCategory = '';
            const categoryRes = await fetchAllCategory(element.id);
            
            if (categoryRes !== null && Object.keys(categoryRes).length > 0) {
                categoryRes.categories.forEach((cate) => {
                    let cateItemActive = '';
                    const cateItemActiveId = sessionStorage.getItem('cate_item_active_id');
                    if(cateItemActiveId == cate.id){
                        cateItemActive = sessionStorage.getItem('cate_item_active') === '1' ? 'active open' : '';
                    }

                    // const isCategoryActive = sessionStorage.getItem(`category_active_${cate.id}`) === '1' ? 'active' : '';
                    
                    renderSideCategory += `
                        <li class="menu-item ${cateItemActive}" onclick="categoryMenuClicked(this)" data-id="${element.id}" id="category-${cate.id}" data-cateid="${cate.id}">
                            <a href="/pages/issuecategory" class="menu-link" onclick="sideCateClicked(event, '/pages/issuecategory')">
                                <div class="side-hide-overtext">${cate.name}</div>
                            </a>
                        </li>
                    `;
                });
            }

            renderSideProject += `
                <li class="menu-item ${projectActive}" id="project-menu-${element.id}">
                    <a class="menu-link menu-toggle">
                        <i class="menu-icon tf-icons bx bx-box"></i>
                        <div class="side-hide-overtext">${element.name}</div>
                    </a>
                    <ul class="menu-sub">
                        <li class="menu-item" id="project-menu-setting">
                            <a href="/pages/project-setting" class="menu-link setting-link" onclick="projectMenuClicked(this, event, '/pages/project-setting')" data-id="${element.id}" data-page="project-setting">
                                <i class='menu-icon tf-icons bx bx-cog'></i>
                                <div class="ps-2">Setting</div>
                            </a>
                        </li>
                        <li class="menu-item" id="project-menu-resource">
                            <a href="/pages/resource" class="menu-link" onclick="projectMenuClicked(this, event, '/pages/resource')" data-id="${element.id}" data-page="resource">
                                <i class='menu-icon tf-icons bx bx-book-bookmark'></i>
                                <div class="ps-2">Resource</div>
                            </a>
                        </li>
                        <li class="menu-item" id="project-menu-analytic">
                            <a href="/pages/analytic" class="menu-link" onclick="projectMenuClicked(this, event, '/pages/analytic')" data-id="${element.id}" data-page="analytic">
                                <i class='menu-icon tf-icons bx bx-line-chart'></i>
                                <div class="ps-2">Analytics</div>
                            </a>
                        </li>
                        <li class="menu-item ${cateActive}" id="cate-menu-${element.id}">
                            <a class="menu-link menu-toggle" data-id="${element.id}">
                                <i class='menu-icon tf-icons bx bx-customize'></i>
                                <div class="ps-2">Category</div>
                            </a>
                            <ul class="menu-sub">
                                ${renderSideCategory}
                                <li class="menu-item">
                                    <div class="ms-4 me-3">
                                        <button type="button" class="btn btn-primary w-100 px-3 text-white d-flex align-items-center"
                                            data-bs-target="#sideCategory" data-bs-toggle="modal"
                                            style="border-radius: 8px; font-size: 14px;" onclick="projectClickedOpen(${element.id})">
                                            <i class='menu-icon tf-icons bx bx-plus pe-4'></i>
                                            Add Category
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            `;
        }
    }

    document.getElementById('web-sidebar-menu').innerHTML = `
        <li class="menu-header small text-uppercase">
            <span class="menu-header-text">Work Control</span>
        </li>
        <li class="menu-item ${side1}">
            <a href="/pages/home" class="menu-link" onclick="removeDataOnStorage('1', event, '/pages/home')">
                <i class="menu-icon tf-icons bx bx-home-circle"></i>
                <div>Home</div>
            </a>
        </li>
        <li class="menu-item ${side2}">
            <a href="/pages/createproject" class="menu-link" onclick="removeDataOnStorage('2', event, '/pages/createproject')">
                <i class='menu-icon tf-icons bx bx-briefcase'></i>
                <div>Project</div>
            </a>
        </li>
        <li class="menu-item ${side3}">
            <a href="/pages/notifaction" class="menu-link" onclick="removeDataOnStorage('3', event, '/pages/notifaction')">
                <i class='menu-icon tf-icons bx bx-bell'></i>
                <div>Notification</div>
            </a>
        </li>
        
        <li class="menu-header small text-uppercase">
            <span class="menu-header-text">Workspace management</span>
        </li>
        ${renderSideProject}
    `;
}

function onInputRequireString(inputId, validateId, validateLength, massage){
    const data = String(document.getElementById(inputId).value);
    const inputEl = document.getElementById(inputId);
    if(data.length <= 0){
        document.getElementById(validateId).innerHTML = `<span>${massage.require}</span>`;
        document.getElementById(validateId).classList.add('d-flex');
        document.getElementById(validateId).classList.remove('d-none');
        document.getElementById(inputId).classList.add('border-danger');
        return;
    } else if (data.length < 2){
        document.getElementById(validateId).innerHTML = `<span>${massage.needdata}</span>`;
        document.getElementById(validateId).classList.add('d-flex');
        document.getElementById(validateId).classList.remove('d-none');
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
        inputEl.parentElement.classList.remove('invalid')
    }
}

async function createSideCate() {
    startLoading('btn-side-create-category', 'btn-side-create-category-text', 'btn-side-create-category-spinner');
    const projectId = localStorage.getItem('sideProjectID');
    const name = document.getElementById('inputSideCate').value;
    if(name.length <= 0){
        document.getElementById('invalid-Side-Category').innerHTML = `<span>Category name is required..!</span>`;
        document.getElementById('invalid-Side-Category').classList.add('d-flex');
        document.getElementById('invalid-Side-Category').classList.remove('d-none');
        document.getElementById('inputSideCate').classList.add('border-danger');
        stopLoading('btn-side-create-category', 'btn-side-create-category-text', 'btn-side-create-category-spinner', 'Create Category');
        return;
    } else if (name.length < 2) {
        document.getElementById('invalid-Side-Category').innerHTML = `<span>Category name must be more than 1 character!</span>`;
        document.getElementById('invalid-Side-Category').classList.add('d-flex');
        document.getElementById('invalid-Side-Category').classList.remove('d-none');
        stopLoading('btn-side-create-category', 'btn-side-create-category-text', 'btn-side-create-category-spinner', 'Create Category');
        return;
    } else if (name.lengthf > 255){
        document.getElementById('invalid-Side-Category').innerHTML = `<span>Category name cannot be more than 255 characters..!</span>`;
        document.getElementById('invalid-Side-Category').classList.add('d-flex');
        document.getElementById('invalid-Side-Category').classList.remove('d-none');
        stopLoading('btn-side-create-category', 'btn-side-create-category-text', 'btn-side-create-category-spinner', 'Create Category');
        return;
    } else {
        document.getElementById('invalid-Side-Category').innerHTML = '';
        document.getElementById('invalid-Side-Category').classList.remove('d-flex');
        document.getElementById('invalid-Side-Category').classList.add('d-none');
        document.getElementById('inputSideCate').classList.remove('border-danger');
    }
    const res = await createSideCategory(projectId, name);
    if(res.result){
        createActivity("Category", "created a new category");
        getSidebar();
        Swal.fire({
            icon: "success",
            title: "Created an category successfully!",
            position: "top-end",
            toast: true,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            background: "#fff",
        });
        document.getElementById('inputSideCate').value = '';
        let modalCreateIssue = document.getElementById('sideCategory');
        let modal = bootstrap.Modal.getInstance(modalCreateIssue);
        if (!modal) {
            modal = new bootstrap.Modal(modalCreateIssue);
        }
        stopLoading('btn-side-create-category', 'btn-side-create-category-text', 'btn-side-create-category-spinner', 'Create Category');
        modal.hide();
    }
}