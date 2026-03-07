// const { func } = require("joi");

let projectNotifaction = [];

function formatTimeDifference(actedOnDate) {
  const now = new Date();
  const timeDifference = now - actedOnDate;

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
  return formattedTimeDifference;
}


async function getAllActivities() {
  
  document.getElementById("showActivity").innerHTML = `
    <div class="placeholder-glow w-100 px-3 pb-3">
      <span class="placeholder col-2 rounded-1"></span>
    </div>
    <div class="row d-flex justify-content-between border-bottom p-3 mt-3">
      <div class="d-flex col-9">
        <div class="d-flex align-items-center justify-content-center" style="width: 60px; height: 60px; border-radius: 100%;">
          <div class="placeholder-glow overflow-hidden" style="width: 60px; height: 60px; border-radius: 100%;">
            <span class="placeholder w-100 h-100 rounded-full"></span>
          </div>
        </div>
        <div class="ps-3 d-flex flex-column justify-content-center align-items-start w-100 placeholder-glow">
          <span class="placeholder mb-3 col-3 rounded-1"></span>
          <span class="placeholder col-9 rounded-1"></span>
        </div>
      </div>
      <div class="col-3 d-flex justify-content-center align-items-center">
        <div class="placeholder-glow w-100 d-flex justify-content-end">
          <span class="placeholder col-5 rounded-1"></span>
        </div>
      </div>
    </div>
  `;

  document.getElementById('all-notifications').innerHTML = `
    <div class="row">
      <div class="col-9 d-flex">
        <div class="d-flex align-items-center justify-content-center" style="width: 60px; height: 60px; border-radius: 100%;">
            <div class="placeholder-glow overflow-hidden" style="width: 60px; height: 60px; border-radius: 100%;">
              <span class="placeholder w-100 h-100 rounded-full"></span>
            </div>
        </div>
        <div class="ps-3 d-flex flex-column justify-content-center align-items-start w-100 placeholder-glow">
          <span class="placeholder mb-2 col-2 rounded-1"></span>
          <span class="placeholder col-6 rounded-1"></span>
        </div>
      </div>
      <div class="col-3 d-flex justify-center align-items-end flex-column">
        <div class="dropdown mb-2 d-flex justify-content-end placeholder-glow w-100">
          <span class="placeholder col-1 rounded-1"></span>
        </div>
        <div class="d-flex justify-content-end placeholder-glow w-100">
          <span class="placeholder col-7 rounded-1"></span>
        </div>
      </div>
    </div>
  `;
  document.getElementById('approved-notifications').innerHTML = `
    <div class="row">
      <div class="col-9 d-flex">
        <div class="d-flex align-items-center justify-content-center" style="width: 60px; height: 60px; border-radius: 100%;">
            <div class="placeholder-glow overflow-hidden" style="width: 60px; height: 60px; border-radius: 100%;">
              <span class="placeholder w-100 h-100 rounded-full"></span>
            </div>
        </div>
        <div class="ps-3 d-flex flex-column justify-content-center align-items-start w-100 placeholder-glow">
          <span class="placeholder mb-2 col-2 rounded-1"></span>
          <span class="placeholder col-6 rounded-1"></span>
        </div>
      </div>
      <div class="col-3 d-flex justify-center align-items-end flex-column">
        <div class="dropdown mb-2 d-flex justify-content-end placeholder-glow w-100">
          <span class="placeholder col-1 rounded-1"></span>
        </div>
        <div class="d-flex justify-content-end placeholder-glow w-100">
          <span class="placeholder col-7 rounded-1"></span>
        </div>
      </div>
    </div>
  `;
  document.getElementById('rejected-notifications').innerHTML = `
    <div class="row">
      <div class="col-9 d-flex">
        <div class="d-flex align-items-center justify-content-center" style="width: 60px; height: 60px; border-radius: 100%;">
            <div class="placeholder-glow overflow-hidden" style="width: 60px; height: 60px; border-radius: 100%;">
              <span class="placeholder w-100 h-100 rounded-full"></span>
            </div>
        </div>
        <div class="ps-3 d-flex flex-column justify-content-center align-items-start w-100 placeholder-glow">
          <span class="placeholder mb-2 col-2 rounded-1"></span>
          <span class="placeholder col-6 rounded-1"></span>
        </div>
      </div>
      <div class="col-3 d-flex justify-center align-items-end flex-column">
        <div class="dropdown mb-2 d-flex justify-content-end placeholder-glow w-100">
          <span class="placeholder col-1 rounded-1"></span>
        </div>
        <div class="d-flex justify-content-end placeholder-glow w-100">
          <span class="placeholder col-7 rounded-1"></span>
        </div>
      </div>
    </div>
  `;
  document.getElementById('pending-notifications').innerHTML = `
    <div class="row">
      <div class="col-9 d-flex">
        <div class="d-flex align-items-center justify-content-center" style="width: 60px; height: 60px; border-radius: 100%;">
            <div class="placeholder-glow overflow-hidden" style="width: 60px; height: 60px; border-radius: 100%;">
              <span class="placeholder w-100 h-100 rounded-full"></span>
            </div>
        </div>
        <div class="ps-3 d-flex flex-column justify-content-center align-items-start w-100 placeholder-glow">
          <span class="placeholder mb-2 col-2 rounded-1"></span>
          <span class="placeholder col-6 rounded-1"></span>
        </div>
      </div>
      <div class="col-3 d-flex justify-center align-items-end flex-column">
        <div class="dropdown mb-2 d-flex justify-content-end placeholder-glow w-100">
          <span class="placeholder col-1 rounded-1"></span>
        </div>
        <div class="d-flex justify-content-end placeholder-glow w-100">
          <span class="placeholder col-7 rounded-1"></span>
        </div>
      </div>
    </div>
  `;



  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1); 

  const dataUser = await setDisble(); 

 if (dataUser.data[0].role.id == 1) {
  const showNotifactionSuperadmin = document.getElementById('superadmin');
  showNotifactionSuperadmin.classList.remove('d-none');
    try {
        
        const dataNotification = await fetchResqest();

        dataNotification.data.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));

        // Filter notifications by status
        const allNotifications = dataNotification.data; // All notifications
        const approvedNotifications = dataNotification.data.filter(noti => noti.status === 2); // Approved
        const rejectedNotifications = dataNotification.data.filter(noti => noti.status === 3); // Rejected
        const pendingNotifications = dataNotification.data.filter(noti => noti.status === 1); // Pending

        // Function to group notifications by date
        const groupNotificationsByDate = (notifications) => {
            return notifications.reduce((grouped, noti) => {
                const date = new Date(noti.created_on);
                const formattedDate = date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });

                if (!grouped[formattedDate]) {
                    grouped[formattedDate] = [];
                }
                grouped[formattedDate].push(noti);
                return grouped;
            }, {});
        };

        // Group notifications by date for each status
        const allNotificationsByDate = groupNotificationsByDate(allNotifications);
        const approvedNotificationsByDate = groupNotificationsByDate(approvedNotifications);
        const rejectedNotificationsByDate = groupNotificationsByDate(rejectedNotifications);
        const pendingNotificationsByDate = groupNotificationsByDate(pendingNotifications);

        // Function to render notifications for a specific tab
        const renderNotifications = (notificationsByDate, tabElement) => {
          tabElement.innerHTML = '';
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1); 

            const todayFormatted = today.toLocaleDateString("en-US", {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const yesterdayFormatted = yesterday.toLocaleDateString("en-US", {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            let hasNotifications = false;


            for (const [date, notifications] of Object.entries(notificationsByDate)) {
                let displayDate;
                if (date === todayFormatted) {
                    displayDate = "Today";
                } else if (date === yesterdayFormatted) {
                    displayDate = "Yesterday";
                } else {
                    displayDate = date;
                }

                // Add date header
                tabElement.innerHTML += `
                    <div class="date-header mt-3 ms-4">
                        <strong>${displayDate}</strong>
                    </div>`;

                // Add notifications for this date
                notifications.forEach(noti => {
                    const formattedTimeDifference = formatTimeDifference(new Date(noti.created_on));

                    let statusText;
                    let statusClass = '';
                    let colorStatus;
                    if (noti.status === 1) {
                        statusText = "Pending";
                        colorStatus = "text-warning";
                        statusClass = "pending";
                    } else if (noti.status === 2) {
                        statusText = "Approved";
                        colorStatus = "text-success";
                        statusClass = "approved";
                    } else if (noti.status === 3) {
                        statusText = "Rejected";
                        colorStatus = "text-danger";
                        statusClass = "rejected";
                    } else {
                        statusText = "Unknown";
                        colorStatus = "text-secondary";
                        statusClass = "unknown";
                    }

                    const disabledBtn = noti.status === 2 || noti.status === 3 ? "disabled" : "";

                    const notificationDiv = document.createElement("div");
                    notificationDiv.classList.add("d-flex", "justify-content-between", "p-3", "mt-3", "rounded-3", statusClass);
                    notificationDiv.innerHTML = `
                        <div class="d-flex">
                            <div class="bg-blue d-flex align-items-center justify-content-center" style="width: 60px; height: 60px; border-radius: 100%;">
                                <img style="width: 60px; height: 60px; border-radius: 100%;" src="/upload/${noti.user.avarta}" alt="">
                            </div>
                            <div class="ps-3 d-flex flex-column justify-content-center">
                                <h6 class="fs-6 text-b font-weight-bold mb-2">${noti.user.first_name} ${noti.user.last_name} <span class="${colorStatus}"> ~ ${statusText}</span></h6>
                                <p class="mb-0">${noti.description}</p>
                            </div>
                        </div>
                        <div class="d-flex justify-center align-items-end flex-column">
                            <div class="dropdown mb-2">
                                <i class='bx bx-dots-vertical-rounded down cursor' id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false"></i>
                                <ul class="dropdown-menu" data-id="${noti.id}">
                                    <li style="border-bottom: #dfdfdf solid 0.5px;" class="btn-list-hover">
                                        <button type="button" class="btn w-100 border-0 bg-transparent d-flex btn-ed-outline"
                                            data-bs-toggle="modal" data-bs-target="#exampleModalEdit" data-status="${2}" onclick="editNotification(this)" ${disabledBtn}>
                                            <p class="m-0 fs-6 py-1">
                                                <i class='bx bx-paper-plane pe-2'></i> Approved
                                            </p>
                                        </button>
                                    </li>
                                    <li class="btn-list-hover-delete">
                                        <button type="button" class="btn w-100 border-0 bg-transparent d-flex btn-ed-outline py-1"
                                            data-bs-toggle="modal" data-bs-target="#deleteModalA1" data-status="${3}" onclick="editNotification(this)" ${disabledBtn}>
                                            <p class="m-0 fs-6 py-1">  <i class='bx bxs-no-entry pe-2'></i> Rejected</p>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <span>${formattedTimeDifference}</span>
                            </div>
                        </div>
                    `;
                    tabElement.appendChild(notificationDiv);
                });
                hasNotifications = true;
            }
            if (!hasNotifications) {
              tabElement.innerHTML = `<div class="d-flex flex-column align-items-center justify-content-center">
                  <div class="text-center w-100 pb-2 mt-5 "> <svg fill="#808080" width="100px" height="100px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#a6a6a6" stroke-width="0.00032" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#f2f2f2" stroke-width="0.064"></g><g id="SVGRepo_iconCarrier"> <title>box-open-heart</title> <path d="M29.742 12.89c-0.002-0.012-0.010-0.022-0.012-0.034-0.014-0.057-0.032-0.106-0.055-0.152l0.002 0.004c-0.067-0.12-0.146-0.224-0.237-0.315l0 0-0.024-0.011c-0.077-0.040-0.169-0.078-0.264-0.11l-0.014-0.004-0.024-0.009-8-1.23c-0.035-0.006-0.075-0.009-0.116-0.009-0.414 0-0.75 0.336-0.75 0.75 0 0.375 0.275 0.686 0.635 0.741l0.004 0.001 3.464 0.533-8.351 1.446-8.35-1.446 3.464-0.533c0.366-0.054 0.643-0.366 0.643-0.742 0-0.414-0.336-0.75-0.75-0.75-0.043 0-0.085 0.004-0.126 0.011l0.004-0.001-8.028 1.241c-0.052 0.014-0.096 0.030-0.139 0.051l0.004-0.002c-0.053 0.018-0.099 0.040-0.143 0.066l0.003-0.002-0.023 0.011c-0.025 0.023-0.047 0.048-0.068 0.074l-0.001 0.001c-0.041 0.036-0.078 0.075-0.11 0.118l-0.001 0.002c-0.020 0.034-0.039 0.074-0.055 0.115l-0.002 0.005c-0.021 0.042-0.039 0.090-0.052 0.141l-0.001 0.005c-0.003 0.013-0.011 0.023-0.013 0.036l-1 6.751c-0.005 0.032-0.008 0.070-0.008 0.108 0 0.361 0.255 0.663 0.595 0.735l0.005 0.001 1.438 0.294c-0.019 0.054-0.033 0.117-0.037 0.182l-0 0.002v7.531c0 0 0 0.001 0 0.001 0 0.381 0.284 0.696 0.653 0.743l0.004 0 11.871 1.467c0.066 0.025 0.142 0.041 0.221 0.045l0.002 0c0.019 0 0.035-0.010 0.054-0.011l0.040 0.005 12-1.506c0.372-0.048 0.656-0.362 0.656-0.743 0-0 0-0.001 0-0.001v0-7.531c-0.005-0.067-0.018-0.13-0.039-0.19l0.002 0.005 1.438-0.294c0.345-0.072 0.6-0.373 0.6-0.734 0-0.039-0.003-0.076-0.009-0.113l0.001 0.004zM3.629 13.87l11.295 1.955-2.364 5.319-9.714-1.986zM4.75 21.078l8.1 1.657c0.045 0.010 0.097 0.015 0.149 0.015 0.304 0 0.566-0.18 0.685-0.44l0.002-0.005 1.564-3.52v10.366l-10.5-1.318zM27.25 27.834l-10.5 1.338v-10.388l1.564 3.52c0.12 0.264 0.382 0.445 0.686 0.445h0c0.054-0 0.105-0.006 0.156-0.017l-0.005 0.001 8.1-1.657zM19.441 21.145l-2.365-5.319 11.295-1.955 0.783 5.288zM15.385 10.802c0.138 0.153 0.336 0.248 0.557 0.248s0.419-0.095 0.556-0.247l0.001-0.001 3.6-3.991c0.723-0.658 1.174-1.602 1.174-2.652 0-0.29-0.034-0.572-0.099-0.841l0.005 0.024c-0.308-1.115-1.169-1.975-2.26-2.278l-0.023-0.005c-0.249-0.065-0.535-0.102-0.83-0.102-0.807 0-1.549 0.28-2.135 0.747l0.007-0.005c-0.528-0.393-1.194-0.629-1.915-0.629-0.911 0-1.734 0.378-2.321 0.985l-0.001 0.001c-0.611 0.592-0.991 1.42-0.991 2.337 0 0.952 0.409 1.808 1.061 2.403l0.003 0.002zM12.761 3.115c0.309-0.319 0.735-0.523 1.208-0.546l0.004-0 0.052-0.001c0.551 0.021 1.041 0.265 1.385 0.644l0.001 0.002c0.138 0.131 0.325 0.211 0.53 0.211s0.392-0.080 0.531-0.211l-0 0c0.386-0.46 0.961-0.751 1.604-0.751 0.152 0 0.301 0.016 0.444 0.047l-0.014-0.002c0.597 0.165 1.058 0.626 1.22 1.21l0.003 0.012c0.027 0.127 0.043 0.274 0.043 0.424 0 0.645-0.29 1.222-0.747 1.608l-0.003 0.003-3.080 3.415-3.082-3.415c-0.393-0.356-0.641-0.868-0.645-1.437v-0.001c0.023-0.477 0.227-0.902 0.545-1.211l0-0z"></path> </g></svg></div>
                  <p class="text-center fw-bold" style="color:#808080 ;">No Data</p>
                  </div>`;
          }
        };

        // Render notifications for each tab
        renderNotifications(allNotificationsByDate, document.getElementById('all-notifications'));
        renderNotifications(approvedNotificationsByDate, document.getElementById('approved-notifications'));
        renderNotifications(rejectedNotificationsByDate, document.getElementById('rejected-notifications'));
        renderNotifications(pendingNotificationsByDate, document.getElementById('pending-notifications'));

    } catch (error) {
        return
    }
  } else {
    let allActivities = [];
    const showUser = document.getElementById("showActivity");
    showUser.classList.remove('d-none');

    const projects = await fetchProject();
    projectNotifaction = projects.datas; 
    

    for (const project of projectNotifaction) {
      const projectId = project.id;
      const response = await fetch( `${baseApiUrl}/api/projects/activities/${projectId}?search&page=&perpage=`,{
        method : "GET"
      });
      const data = await response.json();
      const oneWeekAgo = new Date();
     oneWeekAgo.setDate(now.getDate() - 6);

      const filteredActivities = data.data.datas.filter((acti) => {
        const activityDate = new Date(acti.acted_on);
        return activityDate >= oneWeekAgo ;
      });  

      allActivities = allActivities.concat(filteredActivities);
    }

    let showAllActivity = document.getElementById("showActivity");
    showAllActivity.innerHTML = "";

    if (allActivities.length === 0 ||  dataUser.data[0].role.id == 1 ) {
        showAllActivity.innerHTML = `
       <div class="d-flex flex-column align-items-center justify-content-center">
        <div class="text-center w-100 pb-2 mt-5 "> <svg fill="#808080" width="100px" height="100px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#a6a6a6" stroke-width="0.00032" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#f2f2f2" stroke-width="0.064"></g><g id="SVGRepo_iconCarrier"> <title>box-open-heart</title> <path d="M29.742 12.89c-0.002-0.012-0.010-0.022-0.012-0.034-0.014-0.057-0.032-0.106-0.055-0.152l0.002 0.004c-0.067-0.12-0.146-0.224-0.237-0.315l0 0-0.024-0.011c-0.077-0.040-0.169-0.078-0.264-0.11l-0.014-0.004-0.024-0.009-8-1.23c-0.035-0.006-0.075-0.009-0.116-0.009-0.414 0-0.75 0.336-0.75 0.75 0 0.375 0.275 0.686 0.635 0.741l0.004 0.001 3.464 0.533-8.351 1.446-8.35-1.446 3.464-0.533c0.366-0.054 0.643-0.366 0.643-0.742 0-0.414-0.336-0.75-0.75-0.75-0.043 0-0.085 0.004-0.126 0.011l0.004-0.001-8.028 1.241c-0.052 0.014-0.096 0.030-0.139 0.051l0.004-0.002c-0.053 0.018-0.099 0.040-0.143 0.066l0.003-0.002-0.023 0.011c-0.025 0.023-0.047 0.048-0.068 0.074l-0.001 0.001c-0.041 0.036-0.078 0.075-0.11 0.118l-0.001 0.002c-0.020 0.034-0.039 0.074-0.055 0.115l-0.002 0.005c-0.021 0.042-0.039 0.090-0.052 0.141l-0.001 0.005c-0.003 0.013-0.011 0.023-0.013 0.036l-1 6.751c-0.005 0.032-0.008 0.070-0.008 0.108 0 0.361 0.255 0.663 0.595 0.735l0.005 0.001 1.438 0.294c-0.019 0.054-0.033 0.117-0.037 0.182l-0 0.002v7.531c0 0 0 0.001 0 0.001 0 0.381 0.284 0.696 0.653 0.743l0.004 0 11.871 1.467c0.066 0.025 0.142 0.041 0.221 0.045l0.002 0c0.019 0 0.035-0.010 0.054-0.011l0.040 0.005 12-1.506c0.372-0.048 0.656-0.362 0.656-0.743 0-0 0-0.001 0-0.001v0-7.531c-0.005-0.067-0.018-0.13-0.039-0.19l0.002 0.005 1.438-0.294c0.345-0.072 0.6-0.373 0.6-0.734 0-0.039-0.003-0.076-0.009-0.113l0.001 0.004zM3.629 13.87l11.295 1.955-2.364 5.319-9.714-1.986zM4.75 21.078l8.1 1.657c0.045 0.010 0.097 0.015 0.149 0.015 0.304 0 0.566-0.18 0.685-0.44l0.002-0.005 1.564-3.52v10.366l-10.5-1.318zM27.25 27.834l-10.5 1.338v-10.388l1.564 3.52c0.12 0.264 0.382 0.445 0.686 0.445h0c0.054-0 0.105-0.006 0.156-0.017l-0.005 0.001 8.1-1.657zM19.441 21.145l-2.365-5.319 11.295-1.955 0.783 5.288zM15.385 10.802c0.138 0.153 0.336 0.248 0.557 0.248s0.419-0.095 0.556-0.247l0.001-0.001 3.6-3.991c0.723-0.658 1.174-1.602 1.174-2.652 0-0.29-0.034-0.572-0.099-0.841l0.005 0.024c-0.308-1.115-1.169-1.975-2.26-2.278l-0.023-0.005c-0.249-0.065-0.535-0.102-0.83-0.102-0.807 0-1.549 0.28-2.135 0.747l0.007-0.005c-0.528-0.393-1.194-0.629-1.915-0.629-0.911 0-1.734 0.378-2.321 0.985l-0.001 0.001c-0.611 0.592-0.991 1.42-0.991 2.337 0 0.952 0.409 1.808 1.061 2.403l0.003 0.002zM12.761 3.115c0.309-0.319 0.735-0.523 1.208-0.546l0.004-0 0.052-0.001c0.551 0.021 1.041 0.265 1.385 0.644l0.001 0.002c0.138 0.131 0.325 0.211 0.53 0.211s0.392-0.080 0.531-0.211l-0 0c0.386-0.46 0.961-0.751 1.604-0.751 0.152 0 0.301 0.016 0.444 0.047l-0.014-0.002c0.597 0.165 1.058 0.626 1.22 1.21l0.003 0.012c0.027 0.127 0.043 0.274 0.043 0.424 0 0.645-0.29 1.222-0.747 1.608l-0.003 0.003-3.080 3.415-3.082-3.415c-0.393-0.356-0.641-0.868-0.645-1.437v-0.001c0.023-0.477 0.227-0.902 0.545-1.211l0-0z"></path> </g></svg></div>
        <p class="text-center fw-bold" style="color:#808080 ;">No Data</p>
        </div>`;
        return;
    }

    if (showAllActivity) {
      allActivities.sort((a, b) => new Date(b.acted_on) - new Date(a.acted_on));

      const notificationByDate = allActivities.reduce((grouped, noti) => {
        const date = new Date(noti.acted_on);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      
        if(!grouped[formattedDate]){
          grouped[formattedDate] = [];
        }
        grouped[formattedDate].push(noti);
        return grouped;
      }, {});

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1); // Calculate yesterday's date

      const todayFormatted = today.toLocaleDateString("en-US", {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });

      const yesterdayFormatted = yesterday.toLocaleDateString("en-US", {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });
      let date;
      let notifications;

      for ([date, notifications] of Object.entries(notificationByDate)) {
          let displayDate;
          if (date === todayFormatted) {
              displayDate = "Today";
          } else if (date === yesterdayFormatted) {
              displayDate = "Yesterday";
          } else {
              displayDate = date;
          }

          showAllActivity.innerHTML += `
          <div class="date-header mt-3 ms-4">
              <strong>${displayDate}</strong>
          </div>`;
      
        notifications.forEach((acti) => {
          const formattedTimeDifference = formatTimeDifference(new Date(acti.acted_on));
          showAllActivity.innerHTML += `
            <div class="d-flex justify-content-between border-bottom p-3 mt-3">
              <div class="d-flex">
                <div class="bg-blue d-flex align-items-center justify-content-center" style="width: 60px; height: 60px; border-radius: 100%;">
                  <img style="width: 60px; height: 60px; border-radius: 100%;" src="/upload/${acti.actor.user.avarta}" alt="">
                </div>
                <div class="ps-3 d-flex flex-column justify-content-center">
                  <h6 class="fs-6 text-b font-weight-bold mb-2">${acti.actor.user.first_name} ${acti.actor.user.last_name}</h6>
                  <p class="mb-0">${acti.activity} <strong>${acti.project.name}</strong> ${acti.title}</p>
                </div>
              </div>
              <div class="d-flex justify-content-center align-items-center">
                <div>
                  <span>${formattedTimeDifference}</span>
                </div>
              </div>
            </div>`;
        });
      }
      
  }
      }
  }
  
  getAllActivities();


  async function editNotification(button) {
    const dropdownMenu = button.closest('.dropdown-menu');
    const notificationId = dropdownMenu.dataset.id;
    const statusId = button.dataset.status;
  
    let title, text, icon;
  
    if (statusId == 2) {
      title = "Are you sure?";
      text = "You want to approve this request.";
      icon = "warning";
    } else if (statusId == 3) {
      title = "Are you sure?";
      text = "You want to reject this request.";
      icon = "warning";
    } 
  
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed!",
    });
  
    if (result.isConfirmed) {
        const response = await fetch(`${baseApiUrl}/api/request/password/${notificationId}`, {
          method: 'PUT',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: statusId
          }),
        });
  
        const data = await response.json();
  
        if (data.result) {
          getAllActivities(); // Assuming this function refreshes the activity list
          Swal.fire({
            icon: "success",
            title: "Status changed successfully",
            position: "top-end",
            toast: true,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            background: "#fff",
          });
        } 
    }
  }

