async function fetchProjects() {
  const selectProject = document.getElementById('select-project');

  try {
      const getProject = await fetchProject();

      const projectData = getProject.datas;
      selectProject.innerHTML = '';
      projectData.forEach(ele => {

      let optionProject = `<option value="${ele.id}">${ele.name}</option>`;
      selectProject.innerHTML += optionProject;
      })

  } catch (error) {
      return
  }
}

function createAccoutOpenModal() {
  fetchProjects();
  $('#createAccount').modal('show');
}
  


document.addEventListener('DOMContentLoaded', async function () {
  const responseRole = await fetch(`${baseApiUrl}/api/roles`,{
    method : 'GET'
  });

  const dataRoles = await responseRole.json();

  const selectRole = document.getElementById('select-row');
  selectRole.innerHTML = '';

  dataRoles.data.forEach((role)=>{

    if(role.id == 1){
      return;
    }

    let optionRole = `<option value="${role.id}">${role.name}</option>`;
    selectRole.innerHTML += optionRole;
  })


  
})

async function register() {
    startLoading('btn-create-account',  'btn-create-account-text', 'btn-create-account-spinner');
  const fname = document.querySelector('#fname');
  const fnameValue = fname.value;
  const invalidfname = document.getElementById("invalid-fistname");
  const lname = document.querySelector('#lname');
  const lnameValue = lname.value;
  const invalidlname = document.getElementById("invalid-lastname");
  const email = document.querySelector('#email');
  const emailValue = email.value;
  const invalidUsername = document.getElementById("invalid-username");
  const username = document.querySelector('#username');
  const usernameValue = username.value;
  console.log(usernameValue);
  const invalidEmail = document.getElementById("invalid-email");
  const selectRoles = document.querySelector('#select-row');
  const rolesValue = $(selectRoles).val(); 
  const invalidRoles = document.getElementById('invalid-roles');
  const isDefaultSelected = selectRoles.selectedOptions[0]?.disabled || false;
  const password = document.querySelector('#passwords');
  const passwordValue = password.value;
  const invalidPassword = document.getElementById("invalid-password");
  const cpassword = document.querySelector('#cpassword');
  const cpasswordValue = cpassword.value;
  const invalidCpassoword = document.getElementById("invalid-cpassword");
  const selectProject = document.querySelector('#select-project');
  const projectValue = $(selectProject).val();
  const invalidProject = document.getElementById('invalid-project');
  const isDefaultproject = selectProject.selectedOptions[0]?.disabled || false;
  let isValid = true;

  let fnametest = /^[a-zA-Z]{2,}(?:['-][a-zA-Z]+)*$/;
  let lnametest = /^[a-zA-Z]{2,}(?:['-][a-zA-Z]+)*$/;
  let emailtest = /^[a-zA-Z0-9]{2,}@[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})*\.[a-zA-Z]{2,}$/i;
  let passwordtest =(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#]{6,}$/);
  let usernametest = /^[a-z]+(\.[a-z]+)+$/;

  if (!fnametest.test(fnameValue)) {
      validateInvalid(fname, invalidfname, 'First name must be at least 2 letters. Please try again.');
      isValid = false;
  } else {
      validatevalid(fname, invalidfname);
  }

  if (!lnametest.test(lnameValue)) {
      validateInvalid(lname, invalidlname, 'Last name must be at least 2 letters. Please try again.');
      isValid = false;
  } else {
      validatevalid(lname, invalidlname);
  }

   if (!usernametest.test(usernameValue)) {
      validateInvalid(username, invalidUsername, 'User Name example firstname.lastname . Please try again.');
      isValid = false;
  } else {
      validatevalid(username, invalidUsername);
  }

  if (!emailtest.test(emailValue)) {
      validateInvalid(email, invalidEmail, 'Invalid Email. Please try again.');
      isValid = false;
  } else {
      validatevalid(email, invalidEmail);
  }

  if (rolesValue === '' || isDefaultSelected) {
      validateInvalid(selectRoles, invalidRoles, 'Please select a role.');
      isValid = false;
  } else {
      validatevalid(selectRoles, invalidRoles);
  }

  if (!passwordtest.test(passwordValue)) {
      validateInvalid(password, invalidPassword, 'Invalid Password.');
      isValid = false;
  } else {
      validatevalid(password, invalidPassword);
  }

  if (cpasswordValue !== passwordValue || cpasswordValue.trim() === '') {
      validateInvalid(cpassword, invalidCpassoword, "Passwords do not match.");
      isValid = false;
  } else {
      validatevalid(cpassword, invalidCpassoword);
  }

  if (projectValue === '' || isDefaultproject) {
      validateInvalid(selectProject, invalidProject, 'Please select a project.');
      isValid = false;
  } else {
      validatevalid(selectProject, invalidProject);
  }

  if (!isValid) {
    stopLoading('btn-create-account',  'btn-create-account-text', 'btn-create-account-spinner', 'Create Account');
    return;
  }

    try {
        const response = await fetch(`${baseApiUrl}/api/register`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstname: fnameValue,
                lastname: lnameValue,
                dis_name: usernameValue,
                email: emailValue,
                role_id: rolesValue,
                password: passwordValue,
                repassword: cpasswordValue
            })
        });

        const data = await response.json();
        console.log(data);
        

      if (data.result === true) {
        stopLoading('btn-create-account',  'btn-create-account-text', 'btn-create-account-spinner', 'Create Account');
        $('#createAccount').modal('hide');
        clearForm();
        Swal.fire({
            icon: "success",
            title: "Created User successfully.",
            position: "top-end",
            toast: true,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            background: "#fff",
        });

         
        let newUser = [data.data.id]; 
        try {
            const projectResponse = await fetch(`${baseApiUrl}/api/projects/member/${projectValue}`, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: JSON.stringify(newUser) })
            });

            await projectResponse.json();
          
        } catch (error) {
            stopLoading('btn-create-account',  'btn-create-account-text', 'btn-create-account-spinner', 'Create Account');
        }
        } else if (data.msg === 'Email registered already.') {
            validateInvalid(email, invalidEmail, 'Email registered already. Please try again.');
            stopLoading('btn-create-account',  'btn-create-account-text', 'btn-create-account-spinner', 'Create Account');
        }
    } catch (error) {
        stopLoading('btn-create-account',  'btn-create-account-text', 'btn-create-account-spinner', 'Create Account');
    }
}



document.querySelectorAll('.closebtn').forEach(button => {
  button.addEventListener('click', () => {
    clearData(document.querySelector('#fname'), document.getElementById('invalid-fistname'));
    clearData(document.querySelector('#lname'), document.getElementById('invalid-lastname'));
    clearData(document.querySelector('#email'), document.getElementById('invalid-email'));
    clearData(document.querySelector('#passwords'), document.getElementById('invalid-password'));
    clearData(document.querySelector('#cpassword'), document.getElementById('invalid-cpassword'));
    clearData(document.querySelector('#username'), document.getElementById('invalid-username'));
  
  });
});


function clearForm(){
  clearData(document.querySelector('#fname'), document.getElementById('invalid-fistname'));
  clearData(document.querySelector('#lname'), document.getElementById('invalid-lastname'));
  clearData(document.querySelector('#email'), document.getElementById('invalid-email'));
  clearData(document.querySelector('#passwords'), document.getElementById('invalid-password'));
  clearData(document.querySelector('#cpassword'), document.getElementById('invalid-cpassword'));
  clearData(document.querySelector('#username'), document.getElementById('invalid-username'));
}

