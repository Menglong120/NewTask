async function logout() {
    
    try{
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to logout",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I'm!"
          });
        
        if(result.isConfirmed){

        const respone = await fetch(`${baseApiUrl}/api/logout`,{
            method : 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        const data = respone.json();
        sessionStorage.setItem('side_page_active', `side-1`);

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
        window.location.href = "/user/login";

        const userIdget = sessionStorage.getItem('Userid');
        if(userIdget !== null){
            sessionStorage.removeItem('Userid');
        }

        }
    }
    catch (error) {
        return
    }
}
