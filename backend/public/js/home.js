let currentPage = 1;
let perPage = 5;
let totalEntries = 20;
let roleID = 0;
let projectDataCache = [];

async function getProjectUser() {
  try {
      const projectData = await fetchProject();

      let projectDataCache = projectData.datas; 

      await getAllActivities(projectDataCache);

      // Count in-progress projects
      const inProgressProjects = projectDataCache.filter(project => 
        project.status.title.toLowerCase() === "in progress"
    );
      document.getElementById("totalStatus").innerHTML = inProgressProjects.length;

      // Count "To Start" projects
      const tostartProjects = projectDataCache.filter(project => project.status.title.toLowerCase() === "to start");
      document.getElementById("toStart").innerHTML = tostartProjects.length;

      // Count "Done" projects
      const doneProjects = projectDataCache.filter(project => project.status.title.toLowerCase() === "closed");
      document.getElementById("totalDone").innerHTML = doneProjects.length;

      // Total projects count
      document.getElementById("totalProject").innerText = projectData.paginate.total;

      // Display project folders
      let showfolderProject = document.getElementById("allFolder");
      showfolderProject.innerHTML = "";

      if(projectDataCache.length === 0){
        showfolderProject.innerHTML = `
        <div class="m-auto w-100 text-center pb-2"> <svg fill="#808080" width="100px" height="100px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#a6a6a6" stroke-width="0.00032" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#f2f2f2" stroke-width="0.064"></g><g id="SVGRepo_iconCarrier"> <title>box-open-heart</title> <path d="M29.742 12.89c-0.002-0.012-0.010-0.022-0.012-0.034-0.014-0.057-0.032-0.106-0.055-0.152l0.002 0.004c-0.067-0.12-0.146-0.224-0.237-0.315l0 0-0.024-0.011c-0.077-0.040-0.169-0.078-0.264-0.11l-0.014-0.004-0.024-0.009-8-1.23c-0.035-0.006-0.075-0.009-0.116-0.009-0.414 0-0.75 0.336-0.75 0.75 0 0.375 0.275 0.686 0.635 0.741l0.004 0.001 3.464 0.533-8.351 1.446-8.35-1.446 3.464-0.533c0.366-0.054 0.643-0.366 0.643-0.742 0-0.414-0.336-0.75-0.75-0.75-0.043 0-0.085 0.004-0.126 0.011l0.004-0.001-8.028 1.241c-0.052 0.014-0.096 0.030-0.139 0.051l0.004-0.002c-0.053 0.018-0.099 0.040-0.143 0.066l0.003-0.002-0.023 0.011c-0.025 0.023-0.047 0.048-0.068 0.074l-0.001 0.001c-0.041 0.036-0.078 0.075-0.11 0.118l-0.001 0.002c-0.020 0.034-0.039 0.074-0.055 0.115l-0.002 0.005c-0.021 0.042-0.039 0.090-0.052 0.141l-0.001 0.005c-0.003 0.013-0.011 0.023-0.013 0.036l-1 6.751c-0.005 0.032-0.008 0.070-0.008 0.108 0 0.361 0.255 0.663 0.595 0.735l0.005 0.001 1.438 0.294c-0.019 0.054-0.033 0.117-0.037 0.182l-0 0.002v7.531c0 0 0 0.001 0 0.001 0 0.381 0.284 0.696 0.653 0.743l0.004 0 11.871 1.467c0.066 0.025 0.142 0.041 0.221 0.045l0.002 0c0.019 0 0.035-0.010 0.054-0.011l0.040 0.005 12-1.506c0.372-0.048 0.656-0.362 0.656-0.743 0-0 0-0.001 0-0.001v0-7.531c-0.005-0.067-0.018-0.13-0.039-0.19l0.002 0.005 1.438-0.294c0.345-0.072 0.6-0.373 0.6-0.734 0-0.039-0.003-0.076-0.009-0.113l0.001 0.004zM3.629 13.87l11.295 1.955-2.364 5.319-9.714-1.986zM4.75 21.078l8.1 1.657c0.045 0.010 0.097 0.015 0.149 0.015 0.304 0 0.566-0.18 0.685-0.44l0.002-0.005 1.564-3.52v10.366l-10.5-1.318zM27.25 27.834l-10.5 1.338v-10.388l1.564 3.52c0.12 0.264 0.382 0.445 0.686 0.445h0c0.054-0 0.105-0.006 0.156-0.017l-0.005 0.001 8.1-1.657zM19.441 21.145l-2.365-5.319 11.295-1.955 0.783 5.288zM15.385 10.802c0.138 0.153 0.336 0.248 0.557 0.248s0.419-0.095 0.556-0.247l0.001-0.001 3.6-3.991c0.723-0.658 1.174-1.602 1.174-2.652 0-0.29-0.034-0.572-0.099-0.841l0.005 0.024c-0.308-1.115-1.169-1.975-2.26-2.278l-0.023-0.005c-0.249-0.065-0.535-0.102-0.83-0.102-0.807 0-1.549 0.28-2.135 0.747l0.007-0.005c-0.528-0.393-1.194-0.629-1.915-0.629-0.911 0-1.734 0.378-2.321 0.985l-0.001 0.001c-0.611 0.592-0.991 1.42-0.991 2.337 0 0.952 0.409 1.808 1.061 2.403l0.003 0.002zM12.761 3.115c0.309-0.319 0.735-0.523 1.208-0.546l0.004-0 0.052-0.001c0.551 0.021 1.041 0.265 1.385 0.644l0.001 0.002c0.138 0.131 0.325 0.211 0.53 0.211s0.392-0.080 0.531-0.211l-0 0c0.386-0.46 0.961-0.751 1.604-0.751 0.152 0 0.301 0.016 0.444 0.047l-0.014-0.002c0.597 0.165 1.058 0.626 1.22 1.21l0.003 0.012c0.027 0.127 0.043 0.274 0.043 0.424 0 0.645-0.29 1.222-0.747 1.608l-0.003 0.003-3.080 3.415-3.082-3.415c-0.393-0.356-0.641-0.868-0.645-1.437v-0.001c0.023-0.477 0.227-0.902 0.545-1.211l0-0z"></path> </g></svg></div>
        <p class="text-center fw-bold" style="color:#808080 ;">No Data</p>
        `;
      }

      projectDataCache.forEach(ele => {
          showfolderProject.innerHTML += `
           
            <li class="px-3 d-flex align-items-center home-folder-project mb-3 cursor-pointer" data-id=${ele.id} data-page="analytic" onclick="linkProjectPage(this, event)">
              <div class="class="w-100 d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <i class='bx bx-folder pe-2'></i>
                  <span>${ele.name}</span>
                </div>
              </div>
            </li>
          `;
      });

      // Display "In Progress" folders
      let showfolderRecent = document.getElementById("allFolderRecent");
      showfolderRecent.innerHTML = "";


      const folderProjectsRecent = projectDataCache.filter(project => project.status.title.toLowerCase() === "in progress");
          if (projectDataCache.filter(project => project.status.title.toLowerCase() === "in progress").length === 0) {
        document.getElementById("allFolderRecent").innerHTML = `
        <div class="m-auto w-100 text-center pb-2"> <svg fill="#808080" width="100px" height="100px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#a6a6a6" stroke-width="0.00032" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#f2f2f2" stroke-width="0.064"></g><g id="SVGRepo_iconCarrier"> <title>box-open-heart</title> <path d="M29.742 12.89c-0.002-0.012-0.010-0.022-0.012-0.034-0.014-0.057-0.032-0.106-0.055-0.152l0.002 0.004c-0.067-0.12-0.146-0.224-0.237-0.315l0 0-0.024-0.011c-0.077-0.040-0.169-0.078-0.264-0.11l-0.014-0.004-0.024-0.009-8-1.23c-0.035-0.006-0.075-0.009-0.116-0.009-0.414 0-0.75 0.336-0.75 0.75 0 0.375 0.275 0.686 0.635 0.741l0.004 0.001 3.464 0.533-8.351 1.446-8.35-1.446 3.464-0.533c0.366-0.054 0.643-0.366 0.643-0.742 0-0.414-0.336-0.75-0.75-0.75-0.043 0-0.085 0.004-0.126 0.011l0.004-0.001-8.028 1.241c-0.052 0.014-0.096 0.030-0.139 0.051l0.004-0.002c-0.053 0.018-0.099 0.040-0.143 0.066l0.003-0.002-0.023 0.011c-0.025 0.023-0.047 0.048-0.068 0.074l-0.001 0.001c-0.041 0.036-0.078 0.075-0.11 0.118l-0.001 0.002c-0.020 0.034-0.039 0.074-0.055 0.115l-0.002 0.005c-0.021 0.042-0.039 0.090-0.052 0.141l-0.001 0.005c-0.003 0.013-0.011 0.023-0.013 0.036l-1 6.751c-0.005 0.032-0.008 0.070-0.008 0.108 0 0.361 0.255 0.663 0.595 0.735l0.005 0.001 1.438 0.294c-0.019 0.054-0.033 0.117-0.037 0.182l-0 0.002v7.531c0 0 0 0.001 0 0.001 0 0.381 0.284 0.696 0.653 0.743l0.004 0 11.871 1.467c0.066 0.025 0.142 0.041 0.221 0.045l0.002 0c0.019 0 0.035-0.010 0.054-0.011l0.040 0.005 12-1.506c0.372-0.048 0.656-0.362 0.656-0.743 0-0 0-0.001 0-0.001v0-7.531c-0.005-0.067-0.018-0.13-0.039-0.19l0.002 0.005 1.438-0.294c0.345-0.072 0.6-0.373 0.6-0.734 0-0.039-0.003-0.076-0.009-0.113l0.001 0.004zM3.629 13.87l11.295 1.955-2.364 5.319-9.714-1.986zM4.75 21.078l8.1 1.657c0.045 0.010 0.097 0.015 0.149 0.015 0.304 0 0.566-0.18 0.685-0.44l0.002-0.005 1.564-3.52v10.366l-10.5-1.318zM27.25 27.834l-10.5 1.338v-10.388l1.564 3.52c0.12 0.264 0.382 0.445 0.686 0.445h0c0.054-0 0.105-0.006 0.156-0.017l-0.005 0.001 8.1-1.657zM19.441 21.145l-2.365-5.319 11.295-1.955 0.783 5.288zM15.385 10.802c0.138 0.153 0.336 0.248 0.557 0.248s0.419-0.095 0.556-0.247l0.001-0.001 3.6-3.991c0.723-0.658 1.174-1.602 1.174-2.652 0-0.29-0.034-0.572-0.099-0.841l0.005 0.024c-0.308-1.115-1.169-1.975-2.26-2.278l-0.023-0.005c-0.249-0.065-0.535-0.102-0.83-0.102-0.807 0-1.549 0.28-2.135 0.747l0.007-0.005c-0.528-0.393-1.194-0.629-1.915-0.629-0.911 0-1.734 0.378-2.321 0.985l-0.001 0.001c-0.611 0.592-0.991 1.42-0.991 2.337 0 0.952 0.409 1.808 1.061 2.403l0.003 0.002zM12.761 3.115c0.309-0.319 0.735-0.523 1.208-0.546l0.004-0 0.052-0.001c0.551 0.021 1.041 0.265 1.385 0.644l0.001 0.002c0.138 0.131 0.325 0.211 0.53 0.211s0.392-0.080 0.531-0.211l-0 0c0.386-0.46 0.961-0.751 1.604-0.751 0.152 0 0.301 0.016 0.444 0.047l-0.014-0.002c0.597 0.165 1.058 0.626 1.22 1.21l0.003 0.012c0.027 0.127 0.043 0.274 0.043 0.424 0 0.645-0.29 1.222-0.747 1.608l-0.003 0.003-3.080 3.415-3.082-3.415c-0.393-0.356-0.641-0.868-0.645-1.437v-0.001c0.023-0.477 0.227-0.902 0.545-1.211l0-0z"></path> </g></svg></div>
        <p class="text-center fw-bold" style="color:#808080 ;">No Data</p>
        `;
    }

      folderProjectsRecent.forEach(project => {
          showfolderRecent.innerHTML += `
            <li class="px-3 d-flex align-items-center home-folder-project mb-3 cursor-pointer" data-id=${project.id} data-page="analytic" onclick="linkProjectPage(this, event)">
              <div class="w-100 d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <i class='bx bx-folder pe-2'></i>
                  <span>${project.name}</span>
                </div>
                <div class="spinner-grow" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </li>
          `;
      });

      // Weekly project tracking
      const weeklyAllProjects = {};
      const weeklyClosedProjects = {};
      const options1 = { year: 'numeric', month: 'short', day: 'numeric' };

      projectDataCache.forEach(pro => {
          let date = new Date(pro.status.updated_on);
          let weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay()); // Start from Monday
          let weekKey = weekStart.toISOString().split('T')[0];

          weeklyAllProjects[weekKey] = (weeklyAllProjects[weekKey] || 0) + 1;
          if (pro.status.title.toLowerCase() === 'close' || pro.status.title.toLowerCase() === 'closed') {
              weeklyClosedProjects[weekKey] = (weeklyClosedProjects[weekKey] || 0) + 1;
          }
      });

      // Extract weeks and counts for the chart
      const weekLabels = Object.keys(weeklyAllProjects);
      const allProjectsCounts = Object.values(weeklyAllProjects);
      const closedProjectsCounts = weekLabels.map(date => weeklyClosedProjects[date] || 0);

      // Render chart
      var options = {
          series: [
              { name: 'All Projects (Weekly)', data: allProjectsCounts },
              { name: 'Closed Projects (Weekly)', data: closedProjectsCounts }
          ],
          chart: { height: 300, type: 'line' },
          stroke: { width: 3, curve: 'smooth' },
          xaxis: {
              type: 'datetime',
              categories: weekLabels,
              tickAmount: weekLabels.length,
              labels: {
                  formatter: function (value) {
                      return new Date(value).toLocaleDateString('en-US', options1);
                  },
              },
          },
          title: {
              text: 'Weekly Project Trends',
              align: 'left',
              style: { fontSize: "16px", color: '#666' }
          },
          fill: {
              type: 'gradient',
              gradient: {
                  shade: 'dark',
                  gradientToColors: ['#3498db', '#e74c3c'],
                  shadeIntensity: 1,
                  type: 'horizontal',
                  opacityFrom: 1,
                  opacityTo: 1,
                  stops: [0, 100, 100, 100]
              },
          }
      };

      var chart = new ApexCharts(document.querySelector("#chart2"), options);
      chart.render();

      getAllActivities(projectDataCache);
  } catch (error) {
      console.error("Error fetching project data:", error);
  }
}

async function linkProjectPage(item, event){

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



async function initializeData() {
  await getProjectUser();
}

initializeData();




  // Function to get the current time and update the greeting
  function updateGreeting() {
    const now = new Date();
    const hours = now.getHours();
    let greeting;

    // Determine the time of day and set the appropriate greeting
    if (hours >= 5 && hours < 12) {
        greeting = 'Good Morning 🌞';
    } else if (hours >= 12 && hours < 18) {
        greeting = 'Good Afternoon ☀️';
    } else if (hours >= 18 && hours < 22) {
        greeting = 'Good Evening 🌙';
    } else {
        greeting = 'Have a great night 👩‍💻';
    }
    return greeting;
  }

  // Fetch the user's name from the API
  async function getName() {
    try {
      const response = await fetch(`${baseApiUrl}/api/profile`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      let showName = document.getElementById("showNames");
      const user = result.data[0];
      
      // Get the current greeting based on time of day
      const greeting = updateGreeting();
      
      // Update the HTML with the user's name and the greeting
      showName.innerHTML = ` ${greeting}, ${user.first_name} ${user.last_name}`;
    } catch (error) {
      return
    }
  }

  // Call the function to get the name and update the greeting when the page loads
  window.onload = getName;



async function getAllActivities(projects) {
  const getIdUser = window.sessionStorage.getItem('Userid')
  try {
    let allActivities = [];
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1); 

    for (const project of projects) {
      const projectId = project.id;
      const response = await fetch(
        `${baseApiUrl}/api/projects/activities/${projectId}?search&page=&perpage=`
      );
      const data = await response.json();


      const filteredActivities = data.data.datas.filter((acti) => {
        const activityDate = new Date(acti.acted_on);
        return activityDate >= oneMonthAgo && acti.actor.user.id === getIdUser; // Filter by current user
      });


      allActivities = allActivities.concat(filteredActivities);
    }

    let showAllActivity = document.getElementById("showActivity");
    showAllActivity.innerHTML = "";

    if (allActivities.length === 0) {
        showAllActivity.innerHTML = `
       <div class="d-flex flex-column align-items-center justify-content-center text-center">
        <div class="text-center w-100 pb-2 mt-5 "> <svg fill="#808080" width="100px" height="100px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#a6a6a6" stroke-width="0.00032" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#f2f2f2" stroke-width="0.064"></g><g id="SVGRepo_iconCarrier"> <title>box-open-heart</title> <path d="M29.742 12.89c-0.002-0.012-0.010-0.022-0.012-0.034-0.014-0.057-0.032-0.106-0.055-0.152l0.002 0.004c-0.067-0.12-0.146-0.224-0.237-0.315l0 0-0.024-0.011c-0.077-0.040-0.169-0.078-0.264-0.11l-0.014-0.004-0.024-0.009-8-1.23c-0.035-0.006-0.075-0.009-0.116-0.009-0.414 0-0.75 0.336-0.75 0.75 0 0.375 0.275 0.686 0.635 0.741l0.004 0.001 3.464 0.533-8.351 1.446-8.35-1.446 3.464-0.533c0.366-0.054 0.643-0.366 0.643-0.742 0-0.414-0.336-0.75-0.75-0.75-0.043 0-0.085 0.004-0.126 0.011l0.004-0.001-8.028 1.241c-0.052 0.014-0.096 0.030-0.139 0.051l0.004-0.002c-0.053 0.018-0.099 0.040-0.143 0.066l0.003-0.002-0.023 0.011c-0.025 0.023-0.047 0.048-0.068 0.074l-0.001 0.001c-0.041 0.036-0.078 0.075-0.11 0.118l-0.001 0.002c-0.020 0.034-0.039 0.074-0.055 0.115l-0.002 0.005c-0.021 0.042-0.039 0.090-0.052 0.141l-0.001 0.005c-0.003 0.013-0.011 0.023-0.013 0.036l-1 6.751c-0.005 0.032-0.008 0.070-0.008 0.108 0 0.361 0.255 0.663 0.595 0.735l0.005 0.001 1.438 0.294c-0.019 0.054-0.033 0.117-0.037 0.182l-0 0.002v7.531c0 0 0 0.001 0 0.001 0 0.381 0.284 0.696 0.653 0.743l0.004 0 11.871 1.467c0.066 0.025 0.142 0.041 0.221 0.045l0.002 0c0.019 0 0.035-0.010 0.054-0.011l0.040 0.005 12-1.506c0.372-0.048 0.656-0.362 0.656-0.743 0-0 0-0.001 0-0.001v0-7.531c-0.005-0.067-0.018-0.13-0.039-0.19l0.002 0.005 1.438-0.294c0.345-0.072 0.6-0.373 0.6-0.734 0-0.039-0.003-0.076-0.009-0.113l0.001 0.004zM3.629 13.87l11.295 1.955-2.364 5.319-9.714-1.986zM4.75 21.078l8.1 1.657c0.045 0.010 0.097 0.015 0.149 0.015 0.304 0 0.566-0.18 0.685-0.44l0.002-0.005 1.564-3.52v10.366l-10.5-1.318zM27.25 27.834l-10.5 1.338v-10.388l1.564 3.52c0.12 0.264 0.382 0.445 0.686 0.445h0c0.054-0 0.105-0.006 0.156-0.017l-0.005 0.001 8.1-1.657zM19.441 21.145l-2.365-5.319 11.295-1.955 0.783 5.288zM15.385 10.802c0.138 0.153 0.336 0.248 0.557 0.248s0.419-0.095 0.556-0.247l0.001-0.001 3.6-3.991c0.723-0.658 1.174-1.602 1.174-2.652 0-0.29-0.034-0.572-0.099-0.841l0.005 0.024c-0.308-1.115-1.169-1.975-2.26-2.278l-0.023-0.005c-0.249-0.065-0.535-0.102-0.83-0.102-0.807 0-1.549 0.28-2.135 0.747l0.007-0.005c-0.528-0.393-1.194-0.629-1.915-0.629-0.911 0-1.734 0.378-2.321 0.985l-0.001 0.001c-0.611 0.592-0.991 1.42-0.991 2.337 0 0.952 0.409 1.808 1.061 2.403l0.003 0.002zM12.761 3.115c0.309-0.319 0.735-0.523 1.208-0.546l0.004-0 0.052-0.001c0.551 0.021 1.041 0.265 1.385 0.644l0.001 0.002c0.138 0.131 0.325 0.211 0.53 0.211s0.392-0.080 0.531-0.211l-0 0c0.386-0.46 0.961-0.751 1.604-0.751 0.152 0 0.301 0.016 0.444 0.047l-0.014-0.002c0.597 0.165 1.058 0.626 1.22 1.21l0.003 0.012c0.027 0.127 0.043 0.274 0.043 0.424 0 0.645-0.29 1.222-0.747 1.608l-0.003 0.003-3.080 3.415-3.082-3.415c-0.393-0.356-0.641-0.868-0.645-1.437v-0.001c0.023-0.477 0.227-0.902 0.545-1.211l0-0z"></path> </g></svg></div>
        <p class="text-center fw-bold" style="color:#808080 ;">No Data</p>
        </div>`;
        return;
    }

    if (showAllActivity) {
      allActivities.sort((a, b) => new Date(b.acted_on) - new Date(a.acted_on));
      allActivities.forEach((acti) => {
        showAllActivity.innerHTML += `
         <div class="mt-3">
         <i class='bx bx-user fs-4 pe-2'></i>
              <strong>  </strong> 
              ${acti.activity} <strong>${acti.project.name}</strong> ${acti.title}
         </div>
        `;
      });
    }
  } catch (error) {
    return
  }
}

getAllActivities(projectDataCache);


document.addEventListener("DOMContentLoaded", () => {
  loadProjectProgress();
});