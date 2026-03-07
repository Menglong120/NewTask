(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const passFields = document.querySelectorAll(".form-control[type='password']"); // Select all password fields
    const showBtns = document.querySelectorAll(".show-btn");

    showBtns.forEach((showBtn, index) => {
      const passField = passFields[index];
      const icon = showBtn.querySelector("i");

      showBtn.addEventListener("click", () => {
        if (passField.type === "password") {
          passField.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash'); // Change icon to "eye-slash"
        } else {
          passField.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye'); // Change icon back
        }
      });
    });
  });
})();