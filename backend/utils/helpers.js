const { update } = require("lodash");
// const project = require("../validations/project");

const constructUserRole = (role) => ({
    id : role.id,
    name : role.name,
    description : role.description,
    created_on : role.created_on,
    updated_on : role.updated_on
});

const constructUserProfile = (data, token) => ({
    id : data.id,
    first_name : data.first_name,
    last_name : data.last_name,
    display_name : data.dis_name,
    email : data.email,
    ...(token && { token }),
    avarta : data.avarta,
    description : data.description,
    last_login_on : data.last_login_on,
    status : data.status,
    msg_status : "1 for active & 2 for inactive",
    role : {
        id : data.role_id,
        name : data.role_name,
        description : data.role_description,
        created_on : data.created_on,
        updated_on : data.updated_on
    },
    created_on : data.created_on,
    updated_on : data.updated_on
});

const constructUserWithPassword = (data, token, password) => ({
    id : data.id,
    first_name : data.first_name,
    last_name : data.last_name,
    display_name : data.dis_name,
    email : data.email,
    ...(token && { token }),
    password : password,
    avarta : data.avarta,
    description : data.description,
    last_login_on : data.last_login_on,
    status : data.status,
    msg_status : "1 for active & 2 for inactive",
    role : {
        id : data.role_id,
        name : data.role_name,
        description : data.role_description,
        created_on : data.created_on,
        updated_on : data.updated_on
    },
    created_on : data.created_on,
    updated_on : data.updated_on
});

const constructDataWithPaginate = (datas, total, page, perpage, totalPages) => ({
    datas,
    paginate : {
        total : total,
        page : page,
        perpage : perpage,
        pages : totalPages
    }
});

const constructProjectMembers = (data) => ({
    id: data.id,
    project_id: data.project_id,
    user: {
        id: data.user_id,
        first_name: data.user_first_name,
        last_name: data.user_last_name,
        dis_name: data.user_dis_name,
        email: data.user_email,
        avarta: data.user_avarta,
        description: data.user_description,
        status: data.user_status,
        msg_status: "1 for active & 2 for inactive",
        role: {
            id: data.user_role_id,
            name: data.user_role_name,
            description: data.user_role_description,
            created_on: data.user_role_created_on,
            updated_on: data.user_role_updated_on 
        },
        created_on: data.user_created_on,
        updated_on: data.user_updated_on
    },
    created_on: data.created_on
});

const constructProjects = (data, members) => ({
    id : data.id,
    name : data.name,
    description : data.description,
    status : {
        id : data.status_id,
        title: data.status_title,
        description: data.status_description,
        created_on : data.status_created_on,
        updated_on : data.status_updated_on
    },
    members : members,
    created_on : data.created_on,
    updated_on : data.updated_on,
    start_date : data.start_date,
    end_date : data.end_date
});

const constructProjectResource = (data) => ({
    id : data.id,
    title : data.title,
    note : data.note,
    project : {
        id : data.project_id,
        name : data.project_name,
        description : data.project_description,
        status : {
            id : data.project_status_id,
            title : data.project_status_title,
            description : data.project_status_description,
            created_on : data.project_status_created_on,
            updated_on : data.project_status_updated_on
        },
        created_on : data.project_created_on,
        updated_on : data.project_updated_on
    },
    created_on : data.created_on,
    updated_on : data.updated_on
});

const constructProjectResourceFile = (data, file) => ({
    id : data.id,
    title : data.title,
    note : data.note,
    project : {
        id : data.project_id,
        name : data.project_name,
        description : data.project_description,
        status : {
            id : data.project_status_id,
            title : data.project_status_title,
            description : data.project_status_description,
            created_on : data.project_status_created_on,
            updated_on : data.project_status_updated_on
        },
        created_on : data.project_created_on,
        updated_on : data.project_updated_on
    },
    file : file,
    created_on : data.created_on,
    updated_on : data.updated_on
});

const constructResourceFile = (data) => ({
    id : data.file_id,
    file_name : data.file,
    file_name_show : data.filename,
    created_on : data.file_created_on,
    updated_on : data.file_updated_on
});

const constructDetailResourceFile = (data) => ({
    id : data.id,
    file_name : data.file,
    file_name_show : data.filename,
    resource : {
        id : data.resource_id,
        title : data.resource_title,
        note : data.resource_note,
        created_on : data.resource_created_on,
        updated_on : data.resource_updated_on
    },
    created_on : data.created_on,
    updated_on : data.updated_on
});

const constructProjectActivity = (data) => ({
    id : data.id,
    title : data.title,
    activity : data.activity,
    actor : {
        member_id : data.member_actor_id,
        user : {
            id : data.user_id,
            first_name : data.user_first_name,
            last_name : data.user_last_name,
            dis_name : data.user_dis_name,
            email : data.user_email,
            avarta : data.user_avarta,
            description : data.user_description,
            status : data.user_status,
            role : {
                id : data.user_role_id,
                name : data.user_role_name,
                description : data.user_role_description,
                created_on : data.user_role_created_on,
                updated_on : data.user_role_updated_on
            },
            created_on : data.user_created_on,
            updated_on : data.user_updated_on
        },
        member_created_on : data.member_created_on,
    },
    project : {
        id : data.project_id,
        name : data.project_name
    },
    acted_on : data.acted_on,
});

const constructIssueItem = (data) => ({
    id : data.id,
    name : data.name,
    isssuename : data.issue_name,
    description : data.description,
    created_on : data.created_on,
    updated_on : data.updated_on
});

const constructIssueItemWithProject = (project, item, item_name) => ({
    project : {
        id : project.project_id,
        name : project.project_name,
        description : project.project_description,
        created_on : project.project_created_on,
        updated_on : project.project_updated_on
    },
    [item_name] : item
});

const constructIssue = (data) => ({
    id : data.id,
    name : data.name,
    description : data.description,
    progress : data.progress,
    start_date : data.start_date,
    due_date : data.due_date,
    category : {
        id : data.category_id,
        name : data.category_name,
    },
    status : {
        id : data.status_id,
        name : data.status_name,
    },
    priority : {
        id : data.priority_id,
        name : data.priority_name,
    },
    label : {
        id : data.label_id,
        name : data.label_name,
    },
    tracker : {
        id : data.tracker_id,
        name : data.tracker_name,
    },
    assignee : {
        id : data.assignee_id,
        first_name : data.assignee_firstname,
        last_name : data.assignee_lastname,
        dis_name : data.assignee_disname,
        status : data.assignee_status,
        email : data.assignee_email,
        avarta : data.assignee_avarta,
        role : {
            id : data.assignee_role_id,
            name : data.assignee_role_name
        }
    },
    creator : {
        id : data.creator_id,
        first_name : data.creator_firstname,
        last_name : data.creator_lastname,
        dis_name : data.creator_disname,
        email : data.creator_email,
        avarta : data.creator_avarta,
        role : {
            id : data.creator_role_id,
            name : data.creator_role_name
        }
    },
    updater : {
        id : data.updater_id,
        first_name : data.updater_firstname,
        last_name : data.updater_lastname,
        dis_name : data.updater_disname,
        email : data.updater_email,
        avarta : data.updater_avarta,
        role : {
            id : data.updater_role_id,
            name : data.updater_role_name
        }
    },
    created_on : data.created_on,
    updated_on : data.updated_on
});

const constructIssueDetail = (data) => ({
    id : data.id,
    name : data.name,
    description : data.description,
    progress : data.progress,
    start_date : data.start_date,
    due_date : data.due_date,
    category : {
        id : data.category_id,
        name : data.category_name,
        description : data.category_description
    },
    status : {
        id : data.status_id,
        name : data.status_name,
        description : data.status_description
    },
    priority : {
        id : data.priority_id,
        name : data.priority_name,
        description : data.priority_description
    },
    label : {
        id : data.label_id,
        name : data.label_name,
        description : data.label_description
    },
    tracker : {
        id : data.tracker_id,
        name : data.tracker_name,
        description : data.tracker_description
    },
    assignee : {
        id : data.assignee_id,
        first_name : data.assignee_firstname,
        last_name : data.assignee_lastname,
        dis_name : data.assignee_disname,
        email : data.assignee_email,
        avarta : data.assignee_avarta,
        role : {
            id : data.assignee_role_id,
            name : data.assignee_role_name
        }
    },
    creator : {
        id : data.creator_id,
        first_name : data.creator_firstname,
        last_name : data.creator_lastname,
        dis_name : data.creator_disname,
        email : data.creator_email,
        avarta : data.creator_avarta,
        role : {
            id : data.creator_role_id,
            name : data.creator_role_name
        }
    },
    updater : {
        id : data.updater_id,
        first_name : data.updater_firstname,
        last_name : data.updater_lastname,
        dis_name : data.updater_disname,
        email : data.updater_email,
        avarta : data.updater_avarta,
        role : {
            id : data.updater_role_id,
            name : data.updater_role_name
        }
    },
    created_on : data.created_on,
    updated_on : data.updated_on
});

const constructSubIssueDetail = (data) => ({
    id : data.id,
    name : data.name,
    description : data.description,
    comment : data.comment,
    progress : data.progress,
    start_date : data.start_date,
    due_date : data.due_date,
    category : {
        id : data.category_id,
        name : data.category_name,
        description : data.category_description
    },
    status : {
        id : data.status_id,
        name : data.status_name,
        description : data.status_description
    },
    priority : {
        id : data.priority_id,
        name : data.priority_name,
        description : data.priority_description
    },
    label : {
        id : data.label_id,
        name : data.label_name,
        description : data.label_description
    },
    tracker : {
        id : data.tracker_id,
        name : data.tracker_name,
        description : data.tracker_description
    },
    assignee : {
        id : data.assignee_id,
        first_name : data.assignee_firstname,
        last_name : data.assignee_lastname,
        dis_name : data.assignee_disname,
        email : data.assignee_email,
        avarta : data.assignee_avarta,
        role : {
            id : data.assignee_role_id,
            name : data.assignee_role_name
        }
    },
    creator : {
        id : data.creator_id,
        first_name : data.creator_firstname,
        last_name : data.creator_lastname,
        dis_name : data.creator_disname,
        email : data.creator_email,
        avarta : data.creator_avarta,
        role : {
            id : data.creator_role_id,
            name : data.creator_role_name
        }
    },
    updater : {
        id : data.updater_id,
        first_name : data.updater_firstname,
        last_name : data.updater_lastname,
        dis_name : data.updater_disname,
        email : data.updater_email,
        avarta : data.updater_avarta,
        role : {
            id : data.updater_role_id,
            name : data.updater_role_name
        }
    },
    created_on : data.created_on,
    updated_on : data.updated_on
});

const constructIssueNote = (data) => ({
    id : data.id,
    notes : data.notes,
    issue : {
        id : data.issue_id,
        name : data.issue_name,
        description : data.issue_description
    },
    noter : {
        id : data.user_id,
        fistname : data.user_first_name,
        lastname : data.user_last_name,
        disname : data.user_dis_name,
        email : data.user_email,
        avarta : data.user_avarta
    },
    created_on : data.created_on,
    updated_on : data.updated_on
});

function formatDataForChart(data, status) {
    
    let result = [];
    status.forEach((stat) => {
        let stemp = [];
        data.forEach((element) => {
            if(element.status_id === stat.id){
                stemp.push({
                    month : element.month_name,
                    total_issues : element.count
                })
            }
        })        

        let temp = { 
            status : {
                id : stat.id,
                name : stat.name,
                issue : stemp
            }
        }
        result.push(temp);
    })
    return result;
}

const constructIssueActivity = (data) => ({
    id : data.id,
    title : data.title,
    activity : data.activity,
    issue : {
        id : data.issue_id,
        name : data.issue_name,
        description : data.issue_description,
    },
    actor : {
        id : data.user_id,
        first_name : data.user_first_name,
        last_name : data.user_last_name,
        dis_name : data.user_dis_name,
        email : data.user_email,
        avarta : data.user_avarta
    },
    created_on : data.created_on
});

module.exports = {
    constructUserRole,
    constructUserProfile,
    constructUserWithPassword,
    constructDataWithPaginate,
    constructProjectMembers,
    constructProjects,
    constructProjectResource,
    constructProjectActivity,
    constructProjectResourceFile,
    constructResourceFile,
    constructDetailResourceFile,
    constructIssueItem,
    constructIssueItemWithProject,
    constructIssue,
    constructIssueDetail,
    constructIssueNote,
    constructSubIssueDetail,
    formatDataForChart,
    constructIssueActivity
}