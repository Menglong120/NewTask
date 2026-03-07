let cropper;
async function getProfile() {

    try {
        const response = await fetch(`${baseApiUrl}/api/profile`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

        const result = await response.json();

        if (result.data && result.data.length > 0) {
            let showName = document.getElementById('showProfile');
            let showInfor = document.getElementById('formEdit');
            const user = result.data[0];
            showName.innerHTML = `
             <div class="position-relative">
                  <img id="profileImage" class="rounded-circle " src="/upload/${user.avarta}" alt="Profile Image" width="100" style="cursor: pointer;">
                  <input type="file" id="imageUpload" name="avatar" accept="image/*" style="display: none;">
                  
                  <!-- Camera Icon -->
                  <div class="" onclick="document.getElementById('imageUpload').click();">
                    <i class='bx bxs-camera-plus camera-icon'></i>
                  </div>
              </div>
              <div class="ps-3 d-flex flex-column justify-content-center">
                  <p class="mb-1 font-weight-bold">${user.first_name} ${user.last_name}</p>
                  <p class="mb-0">${user.email}</p>
              </div>

        `;

            showInfor.innerHTML = `
        <div class="row g-2 mt-5">
                        <div class="col">
                            <label for="" class="text-dark font-weight-bold mb-1">First Name</label>
                            <input type="text" class="form-control" id="fname" placeholder="First name" value="${user.first_name}">
                            <div class="invalid-feedback" id="invalid-fistname">
                                Please fill in your email!
                            </div>
                        </div>
                        <div class="col">
                            <label for="" class="text-dark font-weight-bold mb-1">Last Name</label>
                            <input type="text" class="form-control" id="lname" placeholder="Last name" value="${user.last_name}">
                            <div class="invalid-feedback" id="invalid-lastname">
                                Please fill in your email!
                            </div>
                        </div>
                        <div class="col">
                            <label for="" class="text-dark font-weight-bold mb-1">User Name</label>
                            <input type="text" class="form-control" disabled id="displayName" placeholder=" name" value="${user.display_name}">
                            <div class="invalid-feedback" id="invalid-displayName">
                                Please fill in your email!
                            </div>
                        </div>
                    </div>
                    <div class="row g-2 mt-4">
                        <div class="col">
                            <label for="" class="text-dark font-weight-bold mb-1">Email</label>
                            <input type="text" class="form-control" id="email" placeholder="Email" value="${user.email}" ${user.role.name === 'Normal User' ? 'disabled' : ''}>
                            <div class="invalid-feedback" id="invalid-email">
                                Please fill in your email!
                            </div>
                        </div>
                        <div class="col">
                            <label for="" class="text-dark font-weight-bold mb-1">Role</label>
                            <input type="text" class="form-control" disabled id="roles" placeholder="Role" value="${user.role.name}">
                            <div class="invalid-feedback" id="invalid-roles">
                                Please fill in your email!
                            </div>
                        </div>
                         <div class="col-12 mt-4">
                             <label class="text-dark font-weight-bold mb-1" for="exampleFormControlTextarea1">Description</label>
                             <textarea class="form-control" id="description" rows="3">${user.description}</textarea>
                            <div class="invalid-feedback" id="invalid-des">
                                Please fill in your email!
                            </div>
                        </div>
                    </div>
                    <div class="mt-5">
                        <button type="button" onclick="changeInfor()" disabled id="btn-save-change-profile" class="btn btn-primary py-2 px-3 d-flex align-items-center">
                            <div id="btn-save-change-profile-spinner" class="spinner-border text-white spinner-border-sm me-2 d-none" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <span id="btn-save-change-profile-text" >Save Change</span>
                        </button>
                    </div>
        `

            const defultValue = {
                fname : user.first_name,
                lname : user.last_name,
                displayName: user.display_name,
                email: user.email,
                description: user.description,
            }    

            const fnameInput = document.getElementById('fname')
            const lnameInput = document.getElementById('lname');
            const displayNameInput = document.getElementById('displayName');
            const emailInput = document.getElementById('email');
            const descriptionInput = document.getElementById('description');
            const saveButton = document.getElementById('btn-save-change-profile');

            const checkDate = () =>{
                const currentValue =  {
                    fname: fnameInput.value,
                    lname: lnameInput.value,
                    displayName: displayNameInput.value,
                    email: emailInput.value,
                    description: descriptionInput.value,
                }
                const hasChanged = Object.keys(defultValue).some(
                    (key) => defultValue[key] !== currentValue[key]
                );
                saveButton.disabled = !hasChanged;

            }
            fnameInput.addEventListener('input', checkDate);
            lnameInput.addEventListener('input', checkDate);
            displayNameInput.addEventListener('input', checkDate);
            emailInput.addEventListener('input', checkDate);
            descriptionInput.addEventListener('input', checkDate);

            const cropperModal = new bootstrap.Modal(document.getElementById("cropperModal"));
            imageUpload.addEventListener("change", function (event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const cropperImage = document.getElementById("cropperImage");
                        if (!cropperImage) {
                            return;
                        }
                        cropperImage.src = e.target.result;
                        cropperModal.show();
                        if (cropper) {
                            cropper.destroy();
                        }
                        cropper = new Cropper(cropperImage, {
                            aspectRatio: 1,
                            viewMode: 1,
                            autoCropArea: 0.9,
                            responsive: true,
                            dragMode: 'move',
                            minContainerWidth: 500,
                            minContainerHeight: 500,
                            minCropBoxWidth: 250,
                            minCropBoxHeight: 250,
                            strict: true,
                            guides: true,
                            center: true,
                            highlight: true,
                            background: true,
                            scalable: true,
                            zoomable: true,
                            minZoom: 0.1,
                            maxZoom: 2
                        });
                    };
                    reader.readAsDataURL(file);
                }
            });


        }

    } catch (error) {
        return
    }

}

getProfile();


//change profile

async function changeProfile() {
    startLoading(
        "btn-crop-save-profile",
        "btn-crop-save-profile-text",
        "btn-crop-save-profile-spinner"
    );
    if (!cropper) {
        stopLoading(
            "btn-crop-save-profile",
            "btn-crop-save-profile-text",
            "btn-crop-save-profile-spinner",
            'Crop & Save'
        );
        // alert("Please select an image before uploading.");
        return;
    }

    cropper.getCroppedCanvas().toBlob(async (blob) => {
        if (!blob) {
            stopLoading(
                "btn-crop-save-profile",
                "btn-crop-save-profile-text",
                "btn-crop-save-profile-spinner",
                'Crop & Save'
            );
            Swal.fire({
                icon: "error",
                title: "Failed to process the image. Please try again.",
                position: "top-end",
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                background: "#fff",
            });
            // alert("Failed to process the image. Please try again.");
            return;
        }

        const formData = new FormData();
        formData.append("image", blob, "profile.jpg");

        try {
            const response = await fetch(`${baseApiUrl}/api/profile/image`, {
                method: 'PUT',
                headers: { 'Accept': 'application/json' },
                body: formData
            });
            
            const data = await response.json();
            if(data.result){
                location.reload();
                stopLoading(
                    "btn-crop-save-profile",
                    "btn-crop-save-profile-text",
                    "btn-crop-save-profile-spinner",
                    'Crop & Save'
                );
                Swal.fire({
                    icon: "success",
                    title: "Change image successfully.",
                    position: "top-end",
                    toast: true,
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    background: "#fff",
                });
            }
        } catch (error) {
            stopLoading(
                "btn-crop-save-profile",
                "btn-crop-save-profile-text",
                "btn-crop-save-profile-spinner",
                'Crop & Save'
            );
        }
    });
}



//change information

async function changeInfor() {
    startLoading(
        "btn-save-change-profile",
        "btn-save-change-profile-text",
        "btn-save-change-profile-spinner"
    );
    const fname = document.querySelector('#fname');
    const fnameValue = fname.value;
    const invalidfname = document.getElementById("invalid-fistname");
    const lname = document.querySelector('#lname');
    const lnameValue = lname.value;
    const invalidlname = document.getElementById("invalid-lastname");
    const displayname = document.querySelector('#displayName');
    const displaynameValue = displayname.value;
    // const invaliddisplayName = document.getElementById('invalid-displayName');
    const email = document.querySelector('#email');
    const emailValue = email.value;
    const invalidEmail = document.getElementById("invalid-email");
    const descript = document.querySelector('#description');
    const descriptValue = descript.value;
    const invalidDes = document.getElementById('invalid-des');

    
    // let emailtest = /^[a-zA-Z0-9]{2,}@(gmail)\.com$/;
    let emailtest = /^[a-zA-Z0-9]{2,}@[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})*\.[a-zA-Z]{2,}$/i;
    let fnametest = /^[a-zA-Z]+(?:['-][a-zA-Z]+)*$/;
    let lnametest = /^[a-zA-Z]+(?:['-][a-zA-Z]+)*$/;
    // let displaynametest = /^[a-zA-Z]+(?:[ '-][a-zA-Z]+)*$/;
    const maxLength = 1000;
    let isValid = true;

    if(descriptValue.length > maxLength){
        validateInvalid(descript , invalidDes, 'Maximun value only 1000 character ');
        isValid = false;
    }
    else{
        validatevalid(descript,invalidDes);
    }
    if (!fnametest.test(fnameValue)) {
        validateInvalid(
            fname,
            invalidfname,
            'Invalid Firstname. Please try again.'
        )
        isValid = false;
    } else {
        validatevalid(fname, invalidfname);
    }

    if (!lnametest.test(lnameValue)) {
        validateInvalid(
            lname,
            invalidlname,
            'Invalid Lastname. Please try again.'
        )
        isValid = false;
    }
    else {
        validatevalid(lname, invalidlname);
    }

    if (!emailtest.test(emailValue)) {
        validateInvalid(email, invalidEmail, 'Invalid email. Please try again.');
        isValid = false;
    } else {
        validatevalid(email, invalidEmail);
    }

    if (!isValid) {
        stopLoading(
            "btn-save-change-profile",
            "btn-save-change-profile-text",
            "btn-save-change-profile-spinner",
            'Save Change'
        );
        return;
    }

    try {
        const respone = await fetch(`${baseApiUrl}/api/profile/info`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstname: fnameValue,
                lastname: lnameValue,
                disname: displaynameValue,
                email: emailValue,
                description : descriptValue
            })
        });

        const data = await respone.json();
        if(data.result ===  true){
            Swal.fire({
                icon: "success",
                title: "Change Information successfully.",
                position: "top-end",
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                background: "#fff",
            });
            stopLoading(
                "btn-save-change-profile",
                "btn-save-change-profile-text",
                "btn-save-change-profile-spinner",
                'Save Change'
            );
            getProfile();
        }
    }
    catch (error) {
        stopLoading(
            "btn-save-change-profile",
            "btn-save-change-profile-text",
            "btn-save-change-profile-spinner",
            'Save Change'
        );
    }


}
