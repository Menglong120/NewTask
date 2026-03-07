const username = document.querySelector('#username');
 const invalidUserMessage = document.getElementById('invalid-username');
 const password = document.querySelector('#password');
 const invalidPassword = document.getElementById('invalid-pass');
 const rememberMeCheckbox = document.getElementById("remember-me");
 let isValid = true;

 let usernametest = /^[a-z]+(\.[a-z]+)+$/;
 let passwordtest = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#]{6,}$/;

 username.oninput = () => {
  const usernameVaule = username.value;
  if (!usernametest.test(usernameVaule)) {
    validateInvalid(username, invalidUserMessage, 'Invalid Username. Please try again.');
    isValid = false;
  } else {
    validatevalid(username, invalidUserMessage);
  }
 }
 password.oninput = () =>{
  const passwordValue = password.value;
  if (!passwordtest.test(passwordValue)) {
    validateInvalid(password, invalidPassword, 'Invalid Password. Please try again.');
    isValid = false;
  }
  else{
   validatevalid(password,invalidPassword)
  }
 }

async function btnlogin() {
  
  startLoading(
    "login",
    "login-text",
    "login-spinner"
  );

  const usernameValue = username.value;
  console.log(usernameValue);
  
  const passwordValue = password.value;
  const isRemember = rememberMeCheckbox.checked ? 1 : 0;
  let isValid = true;
   
     if (!usernametest.test(usernameValue)) {
       validateInvalid(username, invalidUserMessage, 'Invalid Username. Please try again.');
       isValid = false;
     }
   
     if (!passwordtest.test(passwordValue)) {
       validateInvalid(password, invalidPassword, 'Invalid Password. Please try again.');
       isValid = false;
     }

   
    if (!isValid){ 
      stopLoading(
        "login",
        "login-text",
        "login-spinner",
        'Log In'
      );
      return;
    }
   
     try {
       const response = await fetch(`${baseApiUrl}/api/login`, {
         method: 'POST',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           dis_name: usernameValue,
           password: passwordValue,
           rememberMe: isRemember
         })
       });
   
       const data = await response.json();
       console.log(data);
       
   
       if (data.result === true) {
         validatevalid(password, invalidPassword);
         Swal.fire({
           icon: "success",
           title: "Login Successfully",
           position: "top-end",
           toast: true,
           timer: 3000,
           timerProgressBar: true,
           showConfirmButton: false,
           background: "#fff",
          });
          stopLoading(
            "login",
            "login-text",
            "login-spinner",
            'Log In'
          );
          sessionStorage.setItem('side_page_active', 'side-1');
          window.location.href = "/pages/home";
       } else {   
          if (data.msg === 'Invalid username' || data.msg === 'Invalid Username') {
            validateInvalid(username, invalidUserMessage, 'Invalid Username. Please try again.');
            stopLoading(
              "login",
              "login-text",
              "login-spinner",
              'Log In'
            );
          }
   
          if (passwordValue === '') {
           validateInvalid(password, invalidPassword, 'Please input this field.');
           stopLoading(
            "login",
            "login-text",
            "login-spinner",
            'Log In'
          );
          } else {
            validateInvalid(password, invalidPassword, 'Invalid Password. Please try again.');
            stopLoading(
              "login",
              "login-text",
              "login-spinner",
              'Log In'
            );
          }
       }
     } catch (error) {
      stopLoading(
        "login",
        "login-text",
        "login-spinner",
        'Log In'
      );
     }
}


document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    btnlogin(); 
  }
});
