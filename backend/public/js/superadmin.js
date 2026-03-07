const username = document.querySelector('#username');
const invalidusernameMessage = document.getElementById('invalid-username');
const password = document.querySelector('#password');
const invalidPassword = document.getElementById('invalid-pass');
const rememberMeCheckbox = document.getElementById("remember-me");

let isValid = true;


let usernametest = /^[a-z]+(\.[a-z]+)+$/;
let passwordtest = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#]{6,}$/;

username.oninput = () =>{
  const usernameValue = username.value;
  if (!usernametest.test(usernameValue)) {
    validateInvalid(username, invalidusernameMessage, 'Invalid email. Please try again.');
    isValid = false;
  } else {
    validatevalid(username, invalidusernameMessage);
  }
}
password.oninput = () =>{
  const passwordValue = password.value; 
  if (!passwordtest.test(passwordValue)) {
    validateInvalid(password, invalidPassword, 'Invalid Password. Please try again.');
    isValid = false;
  }
  else {
    validatevalid(password, invalidPassword);
  }

}

async function login() {
  startLoading(
    "btnlogin",
    "btnlogin-text",
    "btnlogin-spinner"
  );

  
  const usernameValue = username.value; 
  const passwordValue = password.value; 
  const isRemember = rememberMeCheckbox.checked ? 1 : 0;
  let isValid = true;

  if (!usernametest.test(usernameValue)) {
    validateInvalid(username, invalidusernameMessage, 'Invalid email. Please try again.');
    isValid = false;
  }
  if (!passwordtest.test(passwordValue)) {
    validateInvalid(password, invalidPassword, 'Invalid Password. Please try again.');
    isValid = false;
  }

  if (!isValid) {
    stopLoading(
      "btnlogin",
      "btnlogin-text",
      "btnlogin-spinner",
      'Log In'
    );
    return; 
  }

  try {
    const response = await fetch(`${baseApiUrl}/api/superadmin/login`, {
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
      sessionStorage.setItem('side_page_active', 'side-1');
      stopLoading(
        "btnlogin",
        "btnlogin-text",
        "btnlogin-spinner",
        'Log In'
      );
      window.location.href = "/pages/home";
    } else {

      if (data.msg === 'Invalid username' || data.msg === 'Invalid Username') {
        validateInvalid(username, invalidusernameMessage, 'Invalid Username. Please try again.');
        stopLoading(
          "btnlogin",
          "btnlogin-text",
          "btnlogin-spinner",
          'Log In'
        );
      }

      if (passwordValue === '') {
        validateInvalid(password, invalidPassword, 'Please input this field.');
        stopLoading(
          "btnlogin",
          "btnlogin-text",
          "btnlogin-spinner",
          'Log In'
        );
      } else {
        validateInvalid(password, invalidPassword, 'Invalid Password. Please try again.');
        stopLoading(
          "btnlogin",
          "btnlogin-text",
          "btnlogin-spinner",
          'Log In'
        );
      }
    }
  } catch (error) {
    stopLoading(
      "btnlogin",
      "btnlogin-text",
      "btnlogin-spinner",
      'Log In'
    );
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    login(); 
  }
});