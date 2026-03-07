

function updatePagination(paginate, className, callbackFunction) {
    let paginationAll = document.getElementById(className);
    paginationAll.innerHTML = "";
  
    let { page, pages } = paginate;
  
    // Previous button
    paginationAll.innerHTML += `
      <li class="page-item ${page === 1 ? "disabled" : ""}">
          <a class="page-link" href="javascript:void(0)" onclick="${callbackFunction}(${page - 1})">Previous</a>
      </li>
    `;
  
    // Page numbers logic
    if (pages <= 3) {
      for (let i = 1; i <= pages; i++) {
        paginationAll.innerHTML += `
          <li class="page-item ${i === page ? "active" : ""}">
              <a class="page-link" href="javascript:void(0)" onclick="${callbackFunction}(${i})">${i}</a>
          </li>
        `;
      }
    } else {
      if (page > 2) {
        paginationAll.innerHTML += `
          <li class="page-item">
              <a class="page-link" href="javascript:void(0)" onclick="${callbackFunction}(1)">1</a>
          </li>
          ${page > 3 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
        `;
      }
  
      let start = Math.max(1, page - 1);
      let end = Math.min(pages, page + 1);
      
      for (let i = start; i <= end; i++) {
        paginationAll.innerHTML += `
          <li class="page-item ${i === page ? "active" : ""}">
              <a class="page-link" href="javascript:void(0)" onclick="${callbackFunction}(${i})">${i}</a>
          </li>
        `;
      }
  
      if (page < pages - 1) {
        paginationAll.innerHTML += `
          ${page < pages - 2 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
          <li class="page-item">
              <a class="page-link" href="javascript:void(0)" onclick="${callbackFunction}(${pages})">${pages}</a>
          </li>
        `;
      }
    }
  
    // Next button
    paginationAll.innerHTML += `
      <li class="page-item ${page === pages ? "disabled" : ""}">
          <a class="page-link" href="javascript:void(0)" onclick="${callbackFunction}(${page + 1})">Next</a>
      </li>
    `;
  }
  

  function updateEntriesInfo(currentPages, perPages, totalEntries) {
  let startEntry = (currentPages - 1) * perPages + 1;
  let endEntry = Math.min(currentPages * perPages, totalEntries);

  document.querySelector(".entriesInfo").innerHTML = 
    `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;
}




function search(id,fetchFunction) {
  let searchQuery = document.getElementById(id).value.trim();
  currentPage = 1; 
  fetchFunction(currentPage, searchQuery); 
}


function UpdateRowsPerPage(id, fetchFunction) {
 perPage = document.getElementById(id).value; 
  currentPage = 1; 
  fetchFunction(currentPage); 
}

function showByrole(roleId){
  const showRole = document.getElementById(roleId).value;
  if(showRole == 1){
    return 2
  }
  else if(showRole == 2 ){
    return 3;
  }
  else{
    return 0;
  }
}