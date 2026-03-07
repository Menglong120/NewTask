async function totalAllissue() {
  const projectAllID = getProjectID();
 
  const responseAll = await fetch(
    `${baseApiUrl}/api//analyst/project/total/${projectAllID}`,
    {
      method: "GET",
    }
  );

  const dataAll = await responseAll.json();

  let totalIssue = document.getElementById("totalIssue");
  totalIssue.innerHTML = "";
  totalIssue.innerHTML = dataAll.data.total.issue;

  let totalSubIssue = document.getElementById("totalSubIssue");
  totalSubIssue.innerHTML = "";
  totalSubIssue.innerHTML = dataAll.data.total.sub_issue;
}

totalAllissue();

async function totalMemberProject() {
  const projectAllID = getProjectID();
 
  const responseMember = await fetch(
    `${baseApiUrl}/api/projects/members/${projectAllID}?search&perpage=&page=`,
    {
      method: "GET",
    }
  );

  const dataMember = await responseMember.json();
  const TotalShow = document.getElementById("totalMember");

  TotalShow.innerHTML = "";
  TotalShow.innerHTML = dataMember.data.paginate.total;


  const responseResource = await fetch(
    `${baseApiUrl}/api/projects/resources/${projectAllID}?search&perpage=&page=`,
    {
      method: "GET",
    }
  );
  const dataResource = await responseResource.json();
  const resource = dataResource.data.datas;
  let totalResource = document.getElementById("totalResource");
  totalResource.innerHTML = "";
  totalResource.innerHTML = resource.length;

  // getMember detail

  let showDetail = dataMember.data.datas;

  const showMember = document.getElementById("memberDetail");
  showMember.innerHTML;

  showDetail.forEach((mem) => {
    showMember.innerHTML += `
    <div class="analytics-card member-details" >
        <div class="cmt-img m-auto">
         <img src="/upload/${mem.user.avarta}" class="img rounded-circle" alt="user-image">
         </div>
        <div class="cmt-text text-center pt-3">
         <span style="font-weight: bold;">${mem.user.first_name}${mem.user.last_name}</span>
          <p class="m-0">${mem.user.dis_name}</p>
          </div>
    `;
  });
}
totalMemberProject();

async function getAllProjectStatus() {
  const projectAllID = getProjectID();
 
  const responeStatus = await fetch(
    `${baseApiUrl}/api/analyst/project/issue/status/${projectAllID}`,
    {
      method: "GET",
    }
  );
  const dataStatus = await responeStatus.json();
  let labelShow = [];
  let seriesData = [];

  const hasValidData = dataStatus.data.issue_status.some(
    (sta) => sta.name && sta.total_issues > 0
  );

  if (!hasValidData) {
    const noDataElement = document.createElement("p");
    noDataElement.innerHTML = `
        <div class="m-auto w-100 text-center pb-2 mt-5">
            <svg aria-label="No Data Icon" fill="#808080" width="150px" height="150px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#a6a6a6" stroke-width="0.00032" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#f2f2f2" stroke-width="0.064"></g>
                <g id="SVGRepo_iconCarrier">
                    <title>box-open-heart</title>
                    <path d="M29.742 12.89c-0.002-0.012-0.010-0.022-0.012-0.034-0.014-0.057-0.032-0.106-0.055-0.152l0.002 0.004c-0.067-0.12-0.146-0.224-0.237-0.315l0 0-0.024-0.011c-0.077-0.040-0.169-0.078-0.264-0.11l-0.014-0.004-0.024-0.009-8-1.23c-0.035-0.006-0.075-0.009-0.116-0.009-0.414 0-0.75 0.336-0.75 0.75 0 0.375 0.275 0.686 0.635 0.741l0.004 0.001 3.464 0.533-8.351 1.446-8.35-1.446 3.464-0.533c0.366-0.054 0.643-0.366 0.643-0.742 0-0.414-0.336-0.75-0.75-0.75-0.043 0-0.085 0.004-0.126 0.011l0.004-0.001-8.028 1.241c-0.052 0.014-0.096 0.030-0.139 0.051l0.004-0.002c-0.053 0.018-0.099 0.040-0.143 0.066l0.003-0.002-0.023 0.011c-0.025 0.023-0.047 0.048-0.068 0.074l-0.001 0.001c-0.041 0.036-0.078 0.075-0.11 0.118l-0.001 0.002c-0.020 0.034-0.039 0.074-0.055 0.115l-0.002 0.005c-0.021 0.042-0.039 0.090-0.052 0.141l-0.001 0.005c-0.003 0.013-0.011 0.023-0.013 0.036l-1 6.751c-0.005 0.032-0.008 0.070-0.008 0.108 0 0.361 0.255 0.663 0.595 0.735l0.005 0.001 1.438 0.294c-0.019 0.054-0.033 0.117-0.037 0.182l-0 0.002v7.531c0 0 0 0.001 0 0.001 0 0.381 0.284 0.696 0.653 0.743l0.004 0 11.871 1.467c0.066 0.025 0.142 0.041 0.221 0.045l0.002 0c0.019 0 0.035-0.010 0.054-0.011l0.040 0.005 12-1.506c0.372-0.048 0.656-0.362 0.656-0.743 0-0 0-0.001 0-0.001v0-7.531c-0.005-0.067-0.018-0.13-0.039-0.19l0.002 0.005 1.438-0.294c0.345-0.072 0.6-0.373 0.6-0.734 0-0.039-0.003-0.076-0.009-0.113l0.001 0.004zM3.629 13.87l11.295 1.955-2.364 5.319-9.714-1.986zM4.75 21.078l8.1 1.657c0.045 0.010 0.097 0.015 0.149 0.015 0.304 0 0.566-0.18 0.685-0.44l0.002-0.005 1.564-3.52v10.366l-10.5-1.318zM27.25 27.834l-10.5 1.338v-10.388l1.564 3.52c0.12 0.264 0.382 0.445 0.686 0.445h0c0.054-0 0.105-0.006 0.156-0.017l-0.005 0.001 8.1-1.657zM19.441 21.145l-2.365-5.319 11.295-1.955 0.783 5.288zM15.385 10.802c0.138 0.153 0.336 0.248 0.557 0.248s0.419-0.095 0.556-0.247l0.001-0.001 3.6-3.991c0.723-0.658 1.174-1.602 1.174-2.652 0-0.29-0.034-0.572-0.099-0.841l0.005 0.024c-0.308-1.115-1.169-1.975-2.26-2.278l-0.023-0.005c-0.249-0.065-0.535-0.102-0.83-0.102-0.807 0-1.549 0.28-2.135 0.747l0.007-0.005c-0.528-0.393-1.194-0.629-1.915-0.629-0.911 0-1.734 0.378-2.321 0.985l-0.001 0.001c-0.611 0.592-0.991 1.42-0.991 2.337 0 0.952 0.409 1.808 1.061 2.403l0.003 0.002zM12.761 3.115c0.309-0.319 0.735-0.523 1.208-0.546l0.004-0 0.052-0.001c0.551 0.021 1.041 0.265 1.385 0.644l0.001 0.002c0.138 0.131 0.325 0.211 0.53 0.211s0.392-0.080 0.531-0.211l-0 0c0.386-0.46 0.961-0.751 1.604-0.751 0.152 0 0.301 0.016 0.444 0.047l-0.014-0.002c0.597 0.165 1.058 0.626 1.22 1.21l0.003 0.012c0.027 0.127 0.043 0.274 0.043 0.424 0 0.645-0.29 1.222-0.747 1.608l-0.003 0.003-3.080 3.415-3.082-3.415c-0.393-0.356-0.641-0.868-0.645-1.437v-0.001c0.023-0.477 0.227-0.902 0.545-1.211l0-0z"></path>
                </g>
            </svg>
        </div>
        <p class="text-center fw-bold no-data-text mt-2" style="color:#808080;">Total No Value</p>
    `;
    document.querySelector("#chart2").appendChild(noDataElement);
    return;
}

dataStatus.data.issue_status.forEach((sta) => {
    labelShow.push(sta.name);
    seriesData.push(parseInt(sta.total_issues));
});
  var options = {
    series: seriesData,
    chart: {
      type: "donut",
    },
    labels: labelShow,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 250,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  var chart = new ApexCharts(document.querySelector("#chart2"), options);
  chart.render();
}
getAllProjectStatus();
async function getAllPrority() {
  const projectAllID = getProjectID();
 
  const responePrority = await fetch(
    `${baseApiUrl}/api/analyst/project/issue/priority/${projectAllID}`,
    {
      method: "GET",
    }
  );
  const dataPrority = await responePrority.json();

  let category = [];
  let seriesPrority = [];
  dataPrority.data.issue_priority.forEach((pro) => {
    category.push(pro.name);
    seriesPrority.push(parseInt(pro.total_issues));
  });

  var options = {
    series: [
      {
        data: seriesPrority,
      },
    ],
    chart: {
      type: "bar",
      width: "100%",
      height: 280,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
    },
    colors: ["#D9B747"],
    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"],
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    xaxis: {
      categories: category,
    },
  };

  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
}

getAllPrority();

function formatDate(dateString) {
  if (!dateString) return "No Date";    
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;    
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

// search member
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('memberProject');
    let debounceTimer;
    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
            searchProject();
    });
    
});

function searchProject() {
    const keyword = document.getElementById('memberProject').value.trim();
    memberPerfomance(keyword);
}

function goToIssueDetail(id) {
  localStorage.setItem("categoryID",id)
  window.location.href = `/pages/issuecategory`;
}


async function memberPerfomance(search = "") {
  const projectAllID = getProjectID();
  const responsePer = await fetch(
    `${baseApiUrl}/api/analyst/project/issue/assignee/${projectAllID}`,
    { method: "GET" }
  );
  const dataPer = await responsePer.json();

  console.log(dataPer);
  
  const responseStatus = await fetch(
    `${baseApiUrl}/api/projects/issue/statuses/${projectAllID}`,
    { method: "GET" }
  );
 const data = await responseStatus.json();

 console.log(data);
 

  const showMemPer = document.getElementById("showMemberPer");
  showMemPer.innerHTML = "";

  if (!dataPer.data.issue || dataPer.data.issue.length === 0) {
   showMemPer.innerHTML = `
    <div class="d-flex flex-column justify-content-center align-items-center py-5">
      <svg fill="#808080" width="150" height="150" viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z"/>
      </svg>
      <p class="text-muted fw-bold">No Data Available</p>
    </div>
  `;

    return;
  }

  let filteredIssues = dataPer.data.issue;
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredIssues = dataPer.data.issue.filter((mem) => {
      const displayName = (mem.assignee.dis_name || mem.assignee.email).toLowerCase();
      const roleName = mem.assignee.role.name.toLowerCase();
      const category = mem.assignee.mainissue.toLowerCase();
      const issueName = mem.assignee.issuename.toLowerCase();
      const statusName = mem.status.name.toLowerCase();
      
      return displayName.includes(searchLower) ||
             roleName.includes(searchLower) ||
             category.includes(searchLower) ||
             issueName.includes(searchLower) ||
             statusName.includes(searchLower);
    });
  }

  // **Check if filtered results are empty**
  if (filteredIssues.length === 0) {
    showMemPer.innerHTML = `
      <div class="d-flex flex-column justify-content-center align-items-center py-5">
        <p class="text-muted fw-bold mt-3">No results found for "${search}"</p>
      </div>
    `;
    return;
  }

  filteredIssues.forEach((mem) => {
    const displayName = mem.assignee.dis_name || mem.assignee.email;
    const statusColor = mem.status.name.toLowerCase() === 'done' ? 'bg-success text-white' :
                        mem.status.name.toLowerCase() === 'in progress' ? 'bg-info text-dark' :
                        mem.status.name.toLowerCase() === 'to start' ? 'custom-to-start text-white' :
                        mem.status.name.toLowerCase() === 'close' ? 'bg-secondary' :
                        'bg-warning';

    let row = `<tr class="align-middle" onclick="goToIssueDetail(${mem.assignee.mainissueid})" style="cursor:pointer;">
                 <td>${displayName}</td>
                 <td>${mem.assignee.role.name}</td>
                 <td>${mem.assignee.mainissue}</td>
                 <td>${mem.assignee.issuename}</td>
                 <td>${formatDate(mem.assignee.startdate)}</td>
                 <td>${formatDate(mem.assignee.duedate)}</td>
                 <td>
                    <div class="progress">
                      <div class="progress-bar rounded-pill" role="progressbar" style="width: ${mem.assignee.progress}%; font-size: 8px;"
                                              aria-valuenow="${mem.assignee.progress}" aria-valuemin="0" aria-valuemax="100">
                                              ${Number(mem.assignee.progress)}%
                                          </div>
                    </div>
                 </td>
                  <td>
                  <span class="status-badge py-1 px-3 rounded-pill ${statusColor}">${mem.status.name}</span>
                </td>`;

    row += `</tr>`;
    showMemPer.innerHTML += row;
  });
}

memberPerfomance();

// async function getIssueCategory() {
//   const projectAllID = getProjectID();
 
//   const responseIssueCate = await fetch(`${baseApiUrl}/api/analyst/project/issue/category/${projectAllID}`,{
//     method : 'GET'
//   })

//   const dataIssueCate = await responseIssueCate.json();

//   const hasValidData = dataIssueCate.data.issue_category.some(
//     (sta) => sta.name && sta.total_issues > 0
//   );

//   if (!hasValidData) {
//     const noDataElement = document.createElement("p");
//     noDataElement.innerHTML = `
//         <div class="m-auto w-100 text-center pb-3 mt-5">
//             <svg aria-label="No Data Icon" fill="#808080" width="150px" height="150px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#a6a6a6" stroke-width="0.00032" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)">
//                 <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
//                 <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#f2f2f2" stroke-width="0.064"></g>
//                 <g id="SVGRepo_iconCarrier">
//                     <title>box-open-heart</title>
//                     <path d="M29.742 12.89c-0.002-0.012-0.010-0.022-0.012-0.034-0.014-0.057-0.032-0.106-0.055-0.152l0.002 0.004c-0.067-0.12-0.146-0.224-0.237-0.315l0 0-0.024-0.011c-0.077-0.040-0.169-0.078-0.264-0.11l-0.014-0.004-0.024-0.009-8-1.23c-0.035-0.006-0.075-0.009-0.116-0.009-0.414 0-0.75 0.336-0.75 0.75 0 0.375 0.275 0.686 0.635 0.741l0.004 0.001 3.464 0.533-8.351 1.446-8.35-1.446 3.464-0.533c0.366-0.054 0.643-0.366 0.643-0.742 0-0.414-0.336-0.75-0.75-0.75-0.043 0-0.085 0.004-0.126 0.011l0.004-0.001-8.028 1.241c-0.052 0.014-0.096 0.030-0.139 0.051l0.004-0.002c-0.053 0.018-0.099 0.040-0.143 0.066l0.003-0.002-0.023 0.011c-0.025 0.023-0.047 0.048-0.068 0.074l-0.001 0.001c-0.041 0.036-0.078 0.075-0.11 0.118l-0.001 0.002c-0.020 0.034-0.039 0.074-0.055 0.115l-0.002 0.005c-0.021 0.042-0.039 0.090-0.052 0.141l-0.001 0.005c-0.003 0.013-0.011 0.023-0.013 0.036l-1 6.751c-0.005 0.032-0.008 0.070-0.008 0.108 0 0.361 0.255 0.663 0.595 0.735l0.005 0.001 1.438 0.294c-0.019 0.054-0.033 0.117-0.037 0.182l-0 0.002v7.531c0 0 0 0.001 0 0.001 0 0.381 0.284 0.696 0.653 0.743l0.004 0 11.871 1.467c0.066 0.025 0.142 0.041 0.221 0.045l0.002 0c0.019 0 0.035-0.010 0.054-0.011l0.040 0.005 12-1.506c0.372-0.048 0.656-0.362 0.656-0.743 0-0 0-0.001 0-0.001v0-7.531c-0.005-0.067-0.018-0.13-0.039-0.19l0.002 0.005 1.438-0.294c0.345-0.072 0.6-0.373 0.6-0.734 0-0.039-0.003-0.076-0.009-0.113l0.001 0.004zM3.629 13.87l11.295 1.955-2.364 5.319-9.714-1.986zM4.75 21.078l8.1 1.657c0.045 0.010 0.097 0.015 0.149 0.015 0.304 0 0.566-0.18 0.685-0.44l0.002-0.005 1.564-3.52v10.366l-10.5-1.318zM27.25 27.834l-10.5 1.338v-10.388l1.564 3.52c0.12 0.264 0.382 0.445 0.686 0.445h0c0.054-0 0.105-0.006 0.156-0.017l-0.005 0.001 8.1-1.657zM19.441 21.145l-2.365-5.319 11.295-1.955 0.783 5.288zM15.385 10.802c0.138 0.153 0.336 0.248 0.557 0.248s0.419-0.095 0.556-0.247l0.001-0.001 3.6-3.991c0.723-0.658 1.174-1.602 1.174-2.652 0-0.29-0.034-0.572-0.099-0.841l0.005 0.024c-0.308-1.115-1.169-1.975-2.26-2.278l-0.023-0.005c-0.249-0.065-0.535-0.102-0.83-0.102-0.807 0-1.549 0.28-2.135 0.747l0.007-0.005c-0.528-0.393-1.194-0.629-1.915-0.629-0.911 0-1.734 0.378-2.321 0.985l-0.001 0.001c-0.611 0.592-0.991 1.42-0.991 2.337 0 0.952 0.409 1.808 1.061 2.403l0.003 0.002zM12.761 3.115c0.309-0.319 0.735-0.523 1.208-0.546l0.004-0 0.052-0.001c0.551 0.021 1.041 0.265 1.385 0.644l0.001 0.002c0.138 0.131 0.325 0.211 0.53 0.211s0.392-0.080 0.531-0.211l-0 0c0.386-0.46 0.961-0.751 1.604-0.751 0.152 0 0.301 0.016 0.444 0.047l-0.014-0.002c0.597 0.165 1.058 0.626 1.22 1.21l0.003 0.012c0.027 0.127 0.043 0.274 0.043 0.424 0 0.645-0.29 1.222-0.747 1.608l-0.003 0.003-3.080 3.415-3.082-3.415c-0.393-0.356-0.641-0.868-0.645-1.437v-0.001c0.023-0.477 0.227-0.902 0.545-1.211l0-0z"></path>
//                 </g>
//             </svg>
//         </div>
//         <p class="text-center fw-bold no-data-text" style="color:#808080 ;"> Total No value</p>
//     `;
//     document.querySelector("#chart4").appendChild(noDataElement);
//     return;
//   }


//   let totalIssue = [];
//   let totalName = []
//   dataIssueCate.data.issue_category.forEach((issue)=>{
//     totalIssue.push(issue.total_issues);
//     totalName.push(issue.name)

//   })


//   var options = {
//     series: [{
//     data: totalIssue
//   }],
//     chart: {
//     type: 'bar',
//     height: 350
//   },
//   plotOptions: {
//     bar: {
//       borderRadius: 4,
//       borderRadiusApplication: 'end',
//       horizontal: true,
//     }
//   },
//   dataLabels: {
//     enabled: false
//   },
//   xaxis: {
//     categories: totalName,
//   }
//   };

//   var chart = new ApexCharts(document.querySelector("#chart4"), options);
//   chart.render();
// }

// getIssueCategory()

async function issuesByMonth() {
  try {
    const projectAllID = await getProjectID();
    if(projectAllID === null){
      window.location.href = '/pages/home';
        return;
    }
    const responseMonth = await fetch(
      `${baseApiUrl}/api/analyst/project/issue/month/${projectAllID}`,
      {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
    );

    const dataMonth = await responseMonth.json();

  let monthsSet = new Set();
  let seriesDataMap = new Map();

    // Collect all unique months
    dataMonth.data.forEach((stu) => {
      stu.status.issue.forEach((issue) => {
        monthsSet.add(issue.month);
      });
    });

    let months = Array.from(monthsSet).sort(); 

    dataMonth.data.forEach((stu) => {
      let statusName = stu.status.name;

      // Ensure each status has an array filled with 0s for every month
      if (!seriesDataMap.has(statusName)) {
        seriesDataMap.set(statusName, new Array(months.length).fill(0));
      }

      stu.status.issue.forEach((issue) => {
        let monthIndex = months.indexOf(issue.month); // Find correct position
        seriesDataMap.get(statusName)[monthIndex] =
          parseInt(issue.total_issues) || 0;
      });
    });

    let seriesData = Array.from(seriesDataMap, ([name, data]) => ({
      name,
      data,
    }));

    var options = {
      series: seriesData,
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      colors: ["#33b2df", "#546E7A", "#CA8226"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: months, // Dynamic months
      },
      yaxis: {
        title: {
          text: "Total Issues",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " issues";
          },
        },
      },
    };

    var chart = new ApexCharts(document.querySelector("#chart3"), options);
    chart.render();
  } catch (error) {
   return
  }
}

issuesByMonth();

