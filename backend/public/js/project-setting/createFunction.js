// Function to handle success actions dynamically
function handleSuccess(inputElement, invalidElement, successMessage, modalId, getAllFunction) {
    clearData(inputElement, invalidElement);
    $(`#${modalId}`).modal('hide');
    getAllFunction();

    Swal.fire({
        icon: "success",
        title: successMessage,
        position: "top-end",
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff",
    });
}

async function createItem(apiUrl, inputSelector, invalidSelector, successMessage, validationRegex, modalId, getAllFunction, loadingObj,activityType,activityAction) {
    const inputElement = document.querySelector(inputSelector);
    const inputValue = inputElement.value.trim();
    const invalidElement = document.getElementById(invalidSelector);
    let isValid = true;
    if (!validationRegex.test(inputValue)) {
        validateInvalid(inputElement, invalidElement, 'Invalid input. Plase Try again');
        isValid = false;
    } else if (inputValue.length < 2) {
        validateInvalid(inputElement, invalidElement, 'Invalid input. Plase Try again');
        isValid = false;
    } else {
        validatevalid(inputElement, invalidElement);
    }

    if (!isValid) {
        stopLoading(loadingObj.btn, loadingObj.btnText, loadingObj.btnSpinner, loadingObj.text);
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: inputValue, description : '' })
        });

        const data = await response.json();

        if (data.result === true) {
            stopLoading(loadingObj.btn, loadingObj.btnText, loadingObj.btnSpinner, loadingObj.text);
            handleSuccess(inputElement, invalidElement, successMessage, modalId, getAllFunction);
            createActivity(activityType, activityAction);
        }

    } catch (error) {
        stopLoading(loadingObj.btn, loadingObj.btnText, loadingObj.btnSpinner, loadingObj.text);
    }
}






async function updateItem(apiUrl, inputSelector, invalidSelector,successMessage, validationRegex, modalId, getAllFunction, loadingObj,activityType,activityAction) {
    const inputElement = document.querySelector(inputSelector);
    const inputValue = inputElement.value;
    const invalidElement = document.getElementById(invalidSelector);
    let isValid = true;

    // Validate input
    if (!validationRegex.test(inputValue)) {
        validateInvalid(inputElement, invalidElement, 'Invalid input. Plase Try again');
        isValid = false;
    } else {
        validatevalid(inputElement, invalidElement);
    }

    if (!isValid) {
        stopLoading(loadingObj.btn, loadingObj.btnText, loadingObj.btnSpinner, loadingObj.text);
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: inputValue })
        });

        const data = await response.json();
        if (data.result === true) {
            stopLoading(loadingObj.btn, loadingObj.btnText, loadingObj.btnSpinner, loadingObj.text);
            handleSuccess(inputElement, invalidElement, successMessage, modalId, getAllFunction);
            createActivity(activityType, activityAction);
        }

    } catch (error) {
        stopLoading(loadingObj.btn, loadingObj.btnText, loadingObj.btnSpinner, loadingObj.text);
    }
}



async function deleteItem(button, apiBaseUrl, getAllFunction,activityType,activityAction) {
    const itemId = button.dataset.id;

    try {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this item!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            const response = await fetch(`${apiBaseUrl}/${itemId}`, {
                method: "DELETE"
            });

            let data = await response.json();
            getAllFunction();
            createActivity(activityType, activityAction);

            if(data.result == true){
                await Swal.fire({
                title: "Deleted!",
                text: "Your item has been deleted.",
                icon: "success"
            });
            }else{
                let errorMessage = data.msg;
                if(data.data && data.data.length > 0){
                    const projectNames = data.data.map(p => p.name).join(', ');
                   errorMessage += `<br><br><strong>Issue using this :</strong><br>${projectNames}`;
                }

                await Swal.fire({
                title: "Error!",
                html: errorMessage, 
                icon: "error",
                width: '600px' 
                });
            }
        }
    } catch (error) {
       return
    }
}



function getDeleteStatus(dataList, userRoleId) {
  let disableDelete = "";

  if (dataList.length === 1) {
    disableDelete = "disabled";
  } else if (userRoleId === 3) {
    disableDelete = "disabled";
  } else if (userRoleId === 2 || dataList.length <= 3) {
    disableDelete = "disabled";
  } else {
    disableDelete = "";
  }

  return disableDelete;
}
