
// change password

async function changepassword() {
  startLoading(
    "btn-save-change-password",
    "btn-save-change-password-text",
    "btn-save-change-password-spinner"
  );
  const old_password = document.querySelector("#oldpassword");
  const oldpassValue = old_password.value;
  const invalidOldpass = document.getElementById("invalid-oldpass");
  const new_password = document.querySelector("#newpassword");
  const newpassValue = new_password.value;
  const invalidNewpass = document.getElementById("invalid-newpass");
  const con_password = document.querySelector("#cpassword");
  const confValue = con_password.value;
  const invalidConpass = document.getElementById("invalid-confpass");

  let passwordtest = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#]{6,}$/;
  let isValid = true;
  if (oldpassValue === "") {
    validateInvalid(old_password, invalidOldpass, "Invalid password. Please try again"
  );
    isValid = false;
  } else {
    validatevalid(old_password, invalidOldpass);
  }

  if (!passwordtest.test(newpassValue)) {
    validateInvalid(
      new_password,
      invalidNewpass,
      "Password must be at least 8 characters and contain: uppercase letter, lowercase letter, number, and special character (@$!%*?&)."
    );
    isValid = false;
  } else {
    validatevalid(new_password, invalidNewpass);
  }

  if (confValue !== newpassValue || confValue === "") {
    validateInvalid(con_password, invalidConpass, "Passwords do not match.");
    isValid = false;
  } else {
    validatevalid(con_password, invalidConpass);
  }

  if (!isValid) {
    stopLoading(
      "btn-save-change-password",
      "btn-save-change-password-text",
      "btn-save-change-password-spinner",
      "Save Change"
    );
    return;
  }

  try {
    const response = await fetch(`${baseApiUrl}/api/profile/changepass`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        old_pass: oldpassValue,
        new_pass: newpassValue,
        renew_pass: confValue,
      }),
    });

    const data = await response.json();
    if (data.result === true) {
      removeChangePassword();
      Swal.fire({
        icon: "success",
        title: "Change password successfully.",
        position: "top-end",
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff",
      });
      stopLoading(
        "btn-save-change-password",
        "btn-save-change-password-text",
        "btn-save-change-password-spinner",
        'Save Change'
      );
    } else {
      if (data.msg === "Invalid Password") {
        validateInvalid(
          old_password,
          invalidOldpass,
          "Invalid password. Please try again"
        );
        stopLoading(
          "btn-save-change-password",
          "btn-save-change-password-text",
          "btn-save-change-password-spinner",
          'Save Change'
        );
      }
    }
  } catch (error) {
    stopLoading(
      "btn-save-change-password",
      "btn-save-change-password-text",
      "btn-save-change-password-spinner",
      'Save Change'
    );
  }
}

async function showForgotbtn(){
  const dataUser = await setDisble();
  const userRole = dataUser.data[0].role.id;

  if(userRole == 3 || userRole == 2 ){
  const btnforgot =  document.getElementById('forgotid');
  btnforgot.classList.remove('d-none');
  }
}
showForgotbtn()


const socket = io();
async function forgotpassword() {
  startLoading(
    "btn-request-new-pass",
    "btn-request-new-pass-text",
    "btn-request-new-pass-spinner"
  );
  const forgot = document.querySelector("#forgotEmail");
  const forgotValue = forgot.value;
  const invalidforgot = document.getElementById("invalid-forgot");
  let isValid = true;

  // let emailtest = /^[a-zA-Z0-9]{2,}@(gmail)\.com$/;
  let emailtest = /^[a-zA-Z0-9]{2,}@[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})*\.[a-zA-Z]{2,}$/i;
  if (!emailtest.test(forgotValue)) {
    validateInvalid(forgot, invalidforgot, "Invalid Email. Please try again.");
    isValid = false;
  } else {
    validatevalid(forgot, invalidforgot);
  }

  if(!isValid){
    stopLoading(
      "btn-request-new-pass",
      "btn-request-new-pass-text",
      "btn-request-new-pass-spinner",
      'Send'
    );
    return;
  }

  const dataUser = await setDisble();

  const userEmail =  dataUser.data[0].email;

  if (userEmail !== forgotValue) {
    validateInvalid(forgot, invalidforgot, "Invalid Email. Please try again.");
    isValid = false;
    stopLoading(
      "btn-request-new-pass",
      "btn-request-new-pass-text",
      "btn-request-new-pass-spinner",
      'Send'
    );
  } else {

    const responseForgot = await fetch (`${baseApiUrl}/api/request/password`,{
    method : 'POST', 
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email : forgotValue
    })
  })
  const dataForgot = await responseForgot.json();
  if(dataForgot.result == true){

    socket.emit('sendNotification',{forgotValue});

    $("#forgotpassword").modal("hide");
    Swal.fire({
      icon: "success",
      title: "Request email for change successfully.",
      position: "top-end",
      toast: true,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      background: "#fff",
    });
    stopLoading(
      "btn-request-new-pass",
      "btn-request-new-pass-text",
      "btn-request-new-pass-spinner",
      'Send'
    );
  }
  }
  
  
}

function removeForgot() {
  const forgot = document.querySelector("#forgotEmail");
  const invalidforgot = document.getElementById("invalid-forgot");
  clearData(forgot, invalidforgot);
}

function removeChangePassword() {
  const old_password = document.querySelector("#oldpassword");
  const invalidOldpass = document.getElementById("invalid-oldpass");
  const new_password = document.querySelector("#newpassword");
  const invalidNewpass = document.getElementById("invalid-newpass");
  const con_password = document.querySelector("#cpassword");
  const invalidConpass = document.getElementById("invalid-confpass");
  clearData(old_password, invalidOldpass);
  clearData(new_password, invalidNewpass);
  clearData(con_password, invalidConpass);
}


