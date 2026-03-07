function validateInvalid(inputFiled,feedbackFiled,message){
  const inputBox = inputFiled.parentElement;
  inputBox.classList.add('invalid');
  inputBox.classList.remove('valid');
  if(feedbackFiled){
  feedbackFiled.innerText = message;
  feedbackFiled.style.display = "block";
  feedbackFiled.classList.remove('d-none')
  }
}

function validatevalid(inputFiled, feedbackFiled){
  const inputBox = inputFiled.parentElement;
  inputBox.classList.add('valid');
  inputBox.classList.remove('invalid');
  if (feedbackFiled) { 
    feedbackFiled.style.display = 'none';
  }
}

function clearData(inputField, invalidMessage) {
  const inputBox = inputField.parentElement;
  inputBox.classList.remove('invalid', 'valid');
  inputField.classList.remove('border-danger')
  
  if (inputField.tagName === 'SELECT' && $(inputField).data('select2')) {
    $(inputField).val('').trigger('change');
  } else {
    inputField.value = '';
  }
  
  inputField.style.border = '';
  if (invalidMessage) {
    invalidMessage.style.display = 'none';
    invalidMessage.innerText = '';
  }
}