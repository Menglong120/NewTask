document.addEventListener('DOMContentLoaded', async function () {
    await getTopbar();
});


async function getProfile() {
    try {
        const response = await fetch(`${baseApiUrl}/api/profile`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        window.sessionStorage.setItem('Userid',result.data[0].id)
        
        return result.data[0]; // Return the entire profile data
        
    } catch (error) {
       return
    }
}

async function getTopbar() {
    try {
        const profile = await getProfile();
        const roleId = profile.role.id;

        if (roleId == 1 || roleId == 2) {
            await renderTopber(profile);
        } else {
            await renderTopUser(profile);

        }
    } catch (error) {
       return
    }
}

async function renderTopber(user) {
    let showName = document.getElementById('showName');
    let showProfile = document.getElementById('navProfile');
    let showProfiledown = document.getElementById('dropdownProfile');
    let createBtn = document.getElementById('createButton');
    if (createBtn) {
        createBtn.classList.remove('d-none');
    }
    const btnAddmember = document.querySelector('.addMemberUser');
    
    if(btnAddmember){
        btnAddmember.classList.remove('d-none');
    }

    showName.innerHTML = `
        <span class="fw-semibold d-block">${user.first_name} ${user.last_name}</span>
        <small class="text-muted">${user.role.name}</small>
    `;

    showProfile.innerHTML = `
        <img src="/upload/${user.avarta}" alt class="w-px-40 h-auto rounded-circle" />
    `;

    showProfiledown.innerHTML = `
        <img src="/upload/${user.avarta}" alt class="w-px-40 h-auto rounded-circle" />
    `;
}

async function renderTopUser(user) {

    let showName = document.getElementById('showName');
    let showProfile = document.getElementById('navProfile');
    let showProfiledown = document.getElementById('dropdownProfile');

    showName.innerHTML = `
        <span class="fw-semibold d-block">${user.first_name} ${user.last_name}</span>
        <small class="text-muted">${user.role.name}</small>
    `;

    showProfile.innerHTML = `
        <img src="/upload/${user.avarta}" alt class="w-px-40 h-auto rounded-circle" />
    `;

    showProfiledown.innerHTML = `
        <img src="/upload/${user.avarta}" alt class="w-px-40 h-auto rounded-circle" />
    `;
}


async function notifactionOntopbar() {

    const dataUser = await setDisble(); 

    if(dataUser.data[0].role.id == 1){

    const dataNotification = await fetchResqest();

    const showNotifaction = document.getElementById('notifactionShow');
    showNotifaction.innerHTML = '';

    // If there are no notifications at all, show "No Data" message
    if (dataNotification.data.length === 0) {
        showNotifaction.innerHTML = `
            <div class="m-auto border-top-0 w-100 text-center pb-2 mt-5"> <svg fill="#808080" width="70px" height="70px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#a6a6a6" stroke-width="0.00032" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#f2f2f2" stroke-width="0.064"></g><g id="SVGRepo_iconCarrier"> <title>box-open-heart</title> <path d="M29.742 12.89c-0.002-0.012-0.010-0.022-0.012-0.034-0.014-0.057-0.032-0.106-0.055-0.152l0.002 0.004c-0.067-0.12-0.146-0.224-0.237-0.315l0 0-0.024-0.011c-0.077-0.040-0.169-0.078-0.264-0.11l-0.014-0.004-0.024-0.009-8-1.23c-0.035-0.006-0.075-0.009-0.116-0.009-0.414 0-0.75 0.336-0.75 0.75 0 0.375 0.275 0.686 0.635 0.741l0.004 0.001 3.464 0.533-8.351 1.446-8.35-1.446 3.464-0.533c0.366-0.054 0.643-0.366 0.643-0.742 0-0.414-0.336-0.75-0.75-0.75-0.043 0-0.085 0.004-0.126 0.011l0.004-0.001-8.028 1.241c-0.052 0.014-0.096 0.030-0.139 0.051l0.004-0.002c-0.053 0.018-0.099 0.040-0.143 0.066l0.003-0.002-0.023 0.011c-0.025 0.023-0.047 0.048-0.068 0.074l-0.001 0.001c-0.041 0.036-0.078 0.075-0.11 0.118l-0.001 0.002c-0.020 0.034-0.039 0.074-0.055 0.115l-0.002 0.005c-0.021 0.042-0.039 0.090-0.052 0.141l-0.001 0.005c-0.003 0.013-0.011 0.023-0.013 0.036l-1 6.751c-0.005 0.032-0.008 0.070-0.008 0.108 0 0.361 0.255 0.663 0.595 0.735l0.005 0.001 1.438 0.294c-0.019 0.054-0.033 0.117-0.037 0.182l-0 0.002v7.531c0 0 0 0.001 0 0.001 0 0.381 0.284 0.696 0.653 0.743l0.004 0 11.871 1.467c0.066 0.025 0.142 0.041 0.221 0.045l0.002 0c0.019 0 0.035-0.010 0.054-0.011l0.040 0.005 12-1.506c0.372-0.048 0.656-0.362 0.656-0.743 0-0 0-0.001 0-0.001v0-7.531c-0.005-0.067-0.018-0.13-0.039-0.19l0.002 0.005 1.438-0.294c0.345-0.072 0.6-0.373 0.6-0.734 0-0.039-0.003-0.076-0.009-0.113l0.001 0.004zM3.629 13.87l11.295 1.955-2.364 5.319-9.714-1.986zM4.75 21.078l8.1 1.657c0.045 0.010 0.097 0.015 0.149 0.015 0.304 0 0.566-0.18 0.685-0.44l0.002-0.005 1.564-3.52v10.366l-10.5-1.318zM27.25 27.834l-10.5 1.338v-10.388l1.564 3.52c0.12 0.264 0.382 0.445 0.686 0.445h0c0.054-0 0.105-0.006 0.156-0.017l-0.005 0.001 8.1-1.657zM19.441 21.145l-2.365-5.319 11.295-1.955 0.783 5.288zM15.385 10.802c0.138 0.153 0.336 0.248 0.557 0.248s0.419-0.095 0.556-0.247l0.001-0.001 3.6-3.991c0.723-0.658 1.174-1.602 1.174-2.652 0-0.29-0.034-0.572-0.099-0.841l0.005 0.024c-0.308-1.115-1.169-1.975-2.26-2.278l-0.023-0.005c-0.249-0.065-0.535-0.102-0.83-0.102-0.807 0-1.549 0.28-2.135 0.747l0.007-0.005c-0.528-0.393-1.194-0.629-1.915-0.629-0.911 0-1.734 0.378-2.321 0.985l-0.001 0.001c-0.611 0.592-0.991 1.42-0.991 2.337 0 0.952 0.409 1.808 1.061 2.403l0.003 0.002zM12.761 3.115c0.309-0.319 0.735-0.523 1.208-0.546l0.004-0 0.052-0.001c0.551 0.021 1.041 0.265 1.385 0.644l0.001 0.002c0.138 0.131 0.325 0.211 0.53 0.211s0.392-0.080 0.531-0.211l-0 0c0.386-0.46 0.961-0.751 1.604-0.751 0.152 0 0.301 0.016 0.444 0.047l-0.014-0.002c0.597 0.165 1.058 0.626 1.22 1.21l0.003 0.012c0.027 0.127 0.043 0.274 0.043 0.424 0 0.645-0.29 1.222-0.747 1.608l-0.003 0.003-3.080 3.415-3.082-3.415c-0.393-0.356-0.641-0.868-0.645-1.437v-0.001c0.023-0.477 0.227-0.902 0.545-1.211l0-0z"></path> </g></svg></div>
            <p class="text-center border-top-0 fw-bold" style="color:#808080 ;">No Data</p>
        `;
        document.querySelector('.number').textContent = '0';
        return;
    }

    const now = new Date();
    const oneDayInMillis = 24 * 60 * 60 * 1000; 

    let hasTodayNotifications = false; 
    let notificationCount = 0;

    dataNotification.data.forEach(ele => {
        const notificationDate = new Date(ele.created_on);
        const timeDifference = now - notificationDate;

          
        if (timeDifference <= oneDayInMillis) {
            hasTodayNotifications = true; 
            notificationCount++; 

            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            let formattedTimeDifference = "";
            if (days > 0) {
                formattedTimeDifference += `${days} day${days > 1 ? "s" : ""}, `;
            } else if (hours > 0) {
                formattedTimeDifference += `${hours} hour${hours > 1 ? "s" : ""}, `;
            } else if (minutes > 0) {
                formattedTimeDifference += `${minutes} minute${minutes > 1 ? "s" : ""}, `;
            } else if (seconds > 0) {
                formattedTimeDifference += `${Math.floor(seconds)} second${seconds > 1 ? "s" : ""}`;
            }

            formattedTimeDifference += " ago";

            showNotifaction.innerHTML += `
                <li>
                    <a href="#" class="d-flex">
                        <div class="img mr-3">
                            <img src="/upload/${ele.user.avarta}" alt="Image" class="img-fluid">
                        </div>
                        <div class="text">
                            <strong>${ele.user.first_name} ${ele.user.last_name}</strong><p class="mb-0"> ${ele.description} <span class="text-primary fw-bold">${formattedTimeDifference}</span></p>
                        </div>
                    </a>
                </li>
            `;
        }
    });

    document.querySelector('.number').textContent = notificationCount;
    if (notificationCount > 9) {
        document.querySelector('.number').textContent = '9+';
    } else {
        notificationCount.textContent = notificationCount.toString();
    }

    if (!hasTodayNotifications) {
        showNotifaction.innerHTML = `
                   <div class="m-auto  border-top-0 w-100 text-center pb-2 mt-5"> <svg fill="#808080" width="70px" height="70px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#a6a6a6" stroke-width="0.00032" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#f2f2f2" stroke-width="0.064"></g><g id="SVGRepo_iconCarrier"> <title>box-open-heart</title> <path d="M29.742 12.89c-0.002-0.012-0.010-0.022-0.012-0.034-0.014-0.057-0.032-0.106-0.055-0.152l0.002 0.004c-0.067-0.12-0.146-0.224-0.237-0.315l0 0-0.024-0.011c-0.077-0.040-0.169-0.078-0.264-0.11l-0.014-0.004-0.024-0.009-8-1.23c-0.035-0.006-0.075-0.009-0.116-0.009-0.414 0-0.75 0.336-0.75 0.75 0 0.375 0.275 0.686 0.635 0.741l0.004 0.001 3.464 0.533-8.351 1.446-8.35-1.446 3.464-0.533c0.366-0.054 0.643-0.366 0.643-0.742 0-0.414-0.336-0.75-0.75-0.75-0.043 0-0.085 0.004-0.126 0.011l0.004-0.001-8.028 1.241c-0.052 0.014-0.096 0.030-0.139 0.051l0.004-0.002c-0.053 0.018-0.099 0.040-0.143 0.066l0.003-0.002-0.023 0.011c-0.025 0.023-0.047 0.048-0.068 0.074l-0.001 0.001c-0.041 0.036-0.078 0.075-0.11 0.118l-0.001 0.002c-0.020 0.034-0.039 0.074-0.055 0.115l-0.002 0.005c-0.021 0.042-0.039 0.090-0.052 0.141l-0.001 0.005c-0.003 0.013-0.011 0.023-0.013 0.036l-1 6.751c-0.005 0.032-0.008 0.070-0.008 0.108 0 0.361 0.255 0.663 0.595 0.735l0.005 0.001 1.438 0.294c-0.019 0.054-0.033 0.117-0.037 0.182l-0 0.002v7.531c0 0 0 0.001 0 0.001 0 0.381 0.284 0.696 0.653 0.743l0.004 0 11.871 1.467c0.066 0.025 0.142 0.041 0.221 0.045l0.002 0c0.019 0 0.035-0.010 0.054-0.011l0.040 0.005 12-1.506c0.372-0.048 0.656-0.362 0.656-0.743 0-0 0-0.001 0-0.001v0-7.531c-0.005-0.067-0.018-0.13-0.039-0.19l0.002 0.005 1.438-0.294c0.345-0.072 0.6-0.373 0.6-0.734 0-0.039-0.003-0.076-0.009-0.113l0.001 0.004zM3.629 13.87l11.295 1.955-2.364 5.319-9.714-1.986zM4.75 21.078l8.1 1.657c0.045 0.010 0.097 0.015 0.149 0.015 0.304 0 0.566-0.18 0.685-0.44l0.002-0.005 1.564-3.52v10.366l-10.5-1.318zM27.25 27.834l-10.5 1.338v-10.388l1.564 3.52c0.12 0.264 0.382 0.445 0.686 0.445h0c0.054-0 0.105-0.006 0.156-0.017l-0.005 0.001 8.1-1.657zM19.441 21.145l-2.365-5.319 11.295-1.955 0.783 5.288zM15.385 10.802c0.138 0.153 0.336 0.248 0.557 0.248s0.419-0.095 0.556-0.247l0.001-0.001 3.6-3.991c0.723-0.658 1.174-1.602 1.174-2.652 0-0.29-0.034-0.572-0.099-0.841l0.005 0.024c-0.308-1.115-1.169-1.975-2.26-2.278l-0.023-0.005c-0.249-0.065-0.535-0.102-0.83-0.102-0.807 0-1.549 0.28-2.135 0.747l0.007-0.005c-0.528-0.393-1.194-0.629-1.915-0.629-0.911 0-1.734 0.378-2.321 0.985l-0.001 0.001c-0.611 0.592-0.991 1.42-0.991 2.337 0 0.952 0.409 1.808 1.061 2.403l0.003 0.002zM12.761 3.115c0.309-0.319 0.735-0.523 1.208-0.546l0.004-0 0.052-0.001c0.551 0.021 1.041 0.265 1.385 0.644l0.001 0.002c0.138 0.131 0.325 0.211 0.53 0.211s0.392-0.080 0.531-0.211l-0 0c0.386-0.46 0.961-0.751 1.604-0.751 0.152 0 0.301 0.016 0.444 0.047l-0.014-0.002c0.597 0.165 1.058 0.626 1.22 1.21l0.003 0.012c0.027 0.127 0.043 0.274 0.043 0.424 0 0.645-0.29 1.222-0.747 1.608l-0.003 0.003-3.080 3.415-3.082-3.415c-0.393-0.356-0.641-0.868-0.645-1.437v-0.001c0.023-0.477 0.227-0.902 0.545-1.211l0-0z"></path> </g></svg></div>
        <p class="text-center  border-top-0 fw-bold" style="color:#808080 ;">No Data</p>
        `;
    }
}
else {
    let allActivities = [];
    const showNotifaction = document.getElementById('notifactionShow');
    showNotifaction.innerHTML = '';


    const projects = await fetchProject();
    projectNotifaction = projects.datas;

    const now = new Date();
    const oneDayInMillis = 24 * 60 * 60 * 1000; 
    let notificationCount = 0;

    for (const project of projectNotifaction) {
        const projectId = project.id;
        const response = await fetch(`${baseApiUrl}/api/projects/activities/${projectId}?search&page=&perpage=`, {
            method: "GET"
        });
        const data = await response.json();

        const filteredActivities = data.data.datas.filter((acti) => {
            const activityDate = new Date(acti.acted_on);
            return (now - activityDate) <= oneDayInMillis; 
        });
        notificationCount += filteredActivities.length;

        allActivities = allActivities.concat(filteredActivities);
    }
    document.querySelector('.number').textContent = notificationCount;
    
    
    if (notificationCount > 9) {
        document.querySelector('.number').textContent = '9+';
    } else {
        notificationCount.textContent = notificationCount.toString();
    }

    if (allActivities.length === 0 || dataUser.data[0].role.id == 1) {
        showNotifaction.innerHTML = `
          <div class="text-center border-top-0 w-100 pb-2 mt-5 "> <svg fill="#808080" width="70px" height="70px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#a6a6a6" stroke-width="0.00032" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#f2f2f2" stroke-width="0.064"></g><g id="SVGRepo_iconCarrier"> <title>box-open-heart</title> <path d="M29.742 12.89c-0.002-0.012-0.010-0.022-0.012-0.034-0.014-0.057-0.032-0.106-0.055-0.152l0.002 0.004c-0.067-0.12-0.146-0.224-0.237-0.315l0 0-0.024-0.011c-0.077-0.040-0.169-0.078-0.264-0.11l-0.014-0.004-0.024-0.009-8-1.23c-0.035-0.006-0.075-0.009-0.116-0.009-0.414 0-0.75 0.336-0.75 0.75 0 0.375 0.275 0.686 0.635 0.741l0.004 0.001 3.464 0.533-8.351 1.446-8.35-1.446 3.464-0.533c0.366-0.054 0.643-0.366 0.643-0.742 0-0.414-0.336-0.75-0.75-0.75-0.043 0-0.085 0.004-0.126 0.011l0.004-0.001-8.028 1.241c-0.052 0.014-0.096 0.030-0.139 0.051l0.004-0.002c-0.053 0.018-0.099 0.040-0.143 0.066l0.003-0.002-0.023 0.011c-0.025 0.023-0.047 0.048-0.068 0.074l-0.001 0.001c-0.041 0.036-0.078 0.075-0.11 0.118l-0.001 0.002c-0.020 0.034-0.039 0.074-0.055 0.115l-0.002 0.005c-0.021 0.042-0.039 0.090-0.052 0.141l-0.001 0.005c-0.003 0.013-0.011 0.023-0.013 0.036l-1 6.751c-0.005 0.032-0.008 0.070-0.008 0.108 0 0.361 0.255 0.663 0.595 0.735l0.005 0.001 1.438 0.294c-0.019 0.054-0.033 0.117-0.037 0.182l-0 0.002v7.531c0 0 0 0.001 0 0.001 0 0.381 0.284 0.696 0.653 0.743l0.004 0 11.871 1.467c0.066 0.025 0.142 0.041 0.221 0.045l0.002 0c0.019 0 0.035-0.010 0.054-0.011l0.040 0.005 12-1.506c0.372-0.048 0.656-0.362 0.656-0.743 0-0 0-0.001 0-0.001v0-7.531c-0.005-0.067-0.018-0.13-0.039-0.19l0.002 0.005 1.438-0.294c0.345-0.072 0.6-0.373 0.6-0.734 0-0.039-0.003-0.076-0.009-0.113l0.001 0.004zM3.629 13.87l11.295 1.955-2.364 5.319-9.714-1.986zM4.75 21.078l8.1 1.657c0.045 0.010 0.097 0.015 0.149 0.015 0.304 0 0.566-0.18 0.685-0.44l0.002-0.005 1.564-3.52v10.366l-10.5-1.318zM27.25 27.834l-10.5 1.338v-10.388l1.564 3.52c0.12 0.264 0.382 0.445 0.686 0.445h0c0.054-0 0.105-0.006 0.156-0.017l-0.005 0.001 8.1-1.657zM19.441 21.145l-2.365-5.319 11.295-1.955 0.783 5.288zM15.385 10.802c0.138 0.153 0.336 0.248 0.557 0.248s0.419-0.095 0.556-0.247l0.001-0.001 3.6-3.991c0.723-0.658 1.174-1.602 1.174-2.652 0-0.29-0.034-0.572-0.099-0.841l0.005 0.024c-0.308-1.115-1.169-1.975-2.26-2.278l-0.023-0.005c-0.249-0.065-0.535-0.102-0.83-0.102-0.807 0-1.549 0.28-2.135 0.747l0.007-0.005c-0.528-0.393-1.194-0.629-1.915-0.629-0.911 0-1.734 0.378-2.321 0.985l-0.001 0.001c-0.611 0.592-0.991 1.42-0.991 2.337 0 0.952 0.409 1.808 1.061 2.403l0.003 0.002zM12.761 3.115c0.309-0.319 0.735-0.523 1.208-0.546l0.004-0 0.052-0.001c0.551 0.021 1.041 0.265 1.385 0.644l0.001 0.002c0.138 0.131 0.325 0.211 0.53 0.211s0.392-0.080 0.531-0.211l-0 0c0.386-0.46 0.961-0.751 1.604-0.751 0.152 0 0.301 0.016 0.444 0.047l-0.014-0.002c0.597 0.165 1.058 0.626 1.22 1.21l0.003 0.012c0.027 0.127 0.043 0.274 0.043 0.424 0 0.645-0.29 1.222-0.747 1.608l-0.003 0.003-3.080 3.415-3.082-3.415c-0.393-0.356-0.641-0.868-0.645-1.437v-0.001c0.023-0.477 0.227-0.902 0.545-1.211l0-0z"></path> </g></svg></div>
        <p class="text-center fw-bold border-top-0" style="color:#808080 ;">No Data</p>`;
        return;
    }

    if (showNotifaction) {
        allActivities.sort((a, b) => new Date(b.acted_on) - new Date(a.acted_on));

        const latestActivities = allActivities.slice(0, 5);


        latestActivities.forEach((acti) => {
            const activityDate = new Date(acti.acted_on);
            const timeDifference = now - activityDate;

            const hours = Math.floor(timeDifference / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            let formattedTimeDifference = "";
            if (hours > 0) {
                formattedTimeDifference += `${hours} hour${hours > 1 ? "s" : ""} `;
            } else if (minutes > 0) {
                formattedTimeDifference += `${minutes} minute${minutes > 1 ? "s" : ""} `;
            } else if (seconds > 0) {
                formattedTimeDifference += `${Math.floor(seconds)} second${seconds > 1 ? "s" : ""} `;
            }
            formattedTimeDifference += "ago";

            showNotifaction.innerHTML += `
                <li>
                    <a href="#" class="d-flex">
                        <div class="img mr-3">
                            <img src="/upload/${acti.actor.user.avarta}" alt="Image" class="img-fluid">
                        </div>
                        <div class="text">
                            <strong>${acti.actor.user.first_name} ${acti.actor.user.last_name}</strong><p class="mb-0"> <span class="mb-0">${acti.activity} <strong>${acti.project.name}</strong> ${acti.title}</span> <span class="fw-bold text-primary">${formattedTimeDifference}</span></p>
                        </div>
                    </a>
                </li>`;
        });
    }
}
}

notifactionOntopbar();

async function topBarSearchInput(){
    let inputText = document.getElementById("topSearchInput").value.trim();
    let searchResults = document.getElementById("searchProjectResults");
    if(inputText.length > 0){
        searchResults.innerHTML = `
            <li><a class="dropdown-item placeholder-glow" href="javascript:void(0);"><span class="placeholder col-12"></span></a></li>
            <li><a class="dropdown-item placeholder-glow" href="javascript:void(0);"><span class="placeholder col-12"></span></a></li>
        `;
        setTimeout( async () => {
            let searchRes = '';
            let results = await fetchData(inputText);
            if(results.length > 0){
                results.forEach((result) => {
                    searchRes += `
                        <li><a class="dropdown-item" href="javascript:void(0);" onclick="topLinkProjectPage(this, event)" data-id=${result.id}>${result.name}</a></li>
                    `;
                })
            } else {
                searchRes = `
                    <div class="w-100 d-flex flex-column justify-content-center align-items-center">
                        <div class="text-center w-100 pb-2 mt-3"> 
                            <svg fill="#808080" width="30px" height="30px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#a6a6a6" stroke-width="0.00032" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)">
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
                        <p class="text-center fs-7 fw-semibold" style="color:#808080;">No Project</p>
                    </div>
                `;
            }
            searchResults.innerHTML = searchRes;
        }, 100);
        searchResults.classList.add("show");
    }else{
        searchResults.innerHTML = `
            <li><a class="dropdown-item placeholder-glow" href="javascript:void(0);"><span class="placeholder col-12"></span></a></li>
            <li><a class="dropdown-item placeholder-glow" href="javascript:void(0);"><span class="placeholder col-12"></span></a></li>
        `;
        searchResults.classList.remove("show");
    }
}

async function fetchData(query) {
  try {
    const response = await fetch(`${baseApiUrl}/api/projects?search=${query}&page=null&perpage=null`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const res = await response.json();
    return res.data.datas;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

async function topLinkProjectPage(item, event){

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
  
    window.location.href = "/pages/analytic";
    event.preventDefault(); // Prevent the default link behavior
    window.location.replace('/pages/analytic');
}

async function notiRemoveDataOnStorage(event, url){
    const profile = await getProfile();
    const roleId = profile.role.id;
    let pageVal = 3;
    if (roleId == 1) {
      pageVal = 4;
    } else {
      pageVal = 3;
    }

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