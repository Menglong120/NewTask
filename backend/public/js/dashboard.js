
async function getProjectMember() {
    try {
        const projectResponse = await fetch(
            `${baseApiUrl}/api/users?search&role=&page=&perpage=`, { 
                method: "GET" 
     });

        const projectMember = await projectResponse.json();

        let totalmember = document.getElementById("totalMember");
        if (totalmember) {
            const normalUserMembers = projectMember.data.datas.filter(mem => mem.role.id == 3);
            totalmember.innerHTML = normalUserMembers.length;
        }

        let totalAdmin = document.getElementById('totalAdmin');
        if(totalAdmin){
            const Admin = projectMember.data.datas.filter(mem => mem.role.id == 2);
            totalAdmin.innerHTML = Admin.length;
        }
    } catch (error) {
       return
    }
}

getProjectMember();



async function allFetchProject() {
    const projectData = await fetchProject();

    // total project
    let total = document.getElementById("totalProject");
    if (total) {
        total.innerText = projectData.paginate.total;
    }

    // total category

    if (Array.isArray(projectData.datas)) {
        const showTotalCategory = document.getElementById('totalCategories');
        let totalCategories = 0;  
    
        for (const projectall of projectData.datas) {
            const projectID = projectall.id;
            const response = await fetch(`${baseApiUrl}/api/categories/${projectID}`);
            const data = await response.json();
    
            if ( Array.isArray(data.data.categories)) {
                totalCategories += data.data.categories.length;  
            } 
        }
    
        showTotalCategory.innerHTML = totalCategories;
    }

    const responseTotal = await fetch(`${baseApiUrl}/api/projects/status?search=&page=&perpage=`,{
        method : 'GET',
    })
    const data = await responseTotal.json();

    const totalstatus = data.data.paginate.total;

    const doneCount = projectData.datas.filter(project => project.status.title.toLowerCase() === "done").length;
    const inProgressCount = projectData.datas.filter(project => project.status.title.toLowerCase() === "in progress").length;
    const toStartCount = projectData.datas.filter(project => project.status.title.toLowerCase() === "to start").length;
    const closeCount = projectData.datas.filter(project => project.status.title.toLowerCase() === "close").length;
  

    var options = {
        series: [toStartCount,inProgressCount, doneCount,closeCount],
        chart: {
          height: 265,
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: '22px',
              },
              value: {
                fontSize: '16px',
              },
              total: {
                show: true,
                label: 'Total',
                formatter: function (w) {
                  return totalstatus
                }
              }
            }
          }
        },
        labels: ['To Start','In progress', 'Done', 'Close',],
      };
  
      var chart = new ApexCharts(document.querySelector("#chart1"), options);
      chart.render();
    
    

// Apexchart

    projectApexChart = projectData.datas

  const monthlyAllProjects = {};
const monthlyClosedProjects = {};
const dated = { year: 'numeric', month: 'short' };

projectApexChart.forEach(ele => {
    let dateUpdated = new Date(ele.status.updated_on);


    let monthStart = new Date(dateUpdated);
    monthStart.setDate(1); // Normalize to the first of the month
    let monthkey = monthStart.toISOString().split('T')[0].slice(0, 7); // Format as YYYY-MM

    // Increment the count for all projects
    monthlyAllProjects[monthkey] = (monthlyAllProjects[monthkey] || 0) + 1;

    // Increment the count for closed projects
    if (ele.status.title === 'Close') {
        monthlyClosedProjects[monthkey] = (monthlyClosedProjects[monthkey] || 0) + 1;
    }
});

const monthLabel = Object.keys(monthlyAllProjects);
const projectCounts = Object.values(monthlyAllProjects);
const closedCount = monthLabel.map(date => monthlyClosedProjects[date] || 0);

// Ensure all projects are counted

var options = {
    series: [
        { name: 'All Projects (Monthly)', data: projectCounts },
        { name: 'Closed Projects (Monthly)', data: closedCount }
    ],
    chart: {
        height: 300,
        type: 'line',
    },
    forecastDataPoints: {
        count: 7
    },
    stroke: {
        width: 5,
        curve: 'smooth'
    },
    xaxis: {
        type: 'category',
        categories: monthLabel,
        labels: {
            formatter: function (value) {
                return new Date(value + '-01').toLocaleDateString('en-US', dated);
            },
        },
    },
    title: {
        text: 'Projects Closed',
        align: 'left',
        style: {
            fontSize: "16px",
            color: '#666'
        }
    },
    fill: {
        type: 'gradient',
        gradient: {
            shade: 'dark',
            gradientToColors: ['#FDD835'],
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

}
allFetchProject();


async function totalIssue() {
    const responseIssue = await fetch(`${baseApiUrl}/api/analyst/dashboard/issues`,{
        method : 'GET',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
    })

    const dataIsse = await responseIssue.json();
    
    

    var options = {
        series: [dataIsse.data[0].total],
        chart: {
          height: 265,
          type: 'radialBar',
          toolbar: {
            show: true
          }
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 225,
            hollow: {
              margin: 0,
              size: '70%',
              background: '#fff',
              image: undefined,
              imageOffsetX: 0,
              imageOffsetY: 0,
              position: 'front',
              dropShadow: {
                enabled: true,
                top: 3,
                left: 0,
                blur: 4,
                opacity: 0.5
              }
            },
            track: {
              background: '#fff',
              strokeWidth: '67%',
              margin: 0, // margin is in pixels
              dropShadow: {
                enabled: true,
                top: -3,
                left: 0,
                blur: 4,
                opacity: 0.7
              }
            },
  
            dataLabels: {
              show: true,
              name: {
                offsetY: -10,
                show: true,
                color: '#888',
                fontSize: '17px'
              },
              value: {
                formatter: function (val) {
                  return parseInt(val);
                },
                color: '#111',
                fontSize: '36px',
                show: true,
              }
            }
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: ['#ABE5A1'],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
          }
        },
        stroke: {
          lineCap: 'round'
        },
        labels: ['Issue'],
      };
      var chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();
}

totalIssue()


document.addEventListener("DOMContentLoaded", () => {
  loadProjectProgress();
});



function updateGreeting() {
  const now = new Date();
  const hours = now.getHours();
  let greeting;

  // Determine the time of day and set the appropriate greeting
  if (hours >= 5 && hours < 12) {
      greeting = 'Morning 🌞';
  } else if (hours >= 12 && hours < 18) {
      greeting = 'Afternoon ☀️';
  } else if (hours >= 18 && hours < 22) {
      greeting = 'Evening 🌙';
  } else {
      greeting = 'night 👩‍💻';
  }
  return greeting;
}
function getTimeShow(){
  const showTime = document.getElementById('timeShow');
  showTime.innerHTML = updateGreeting()
}

getTimeShow()