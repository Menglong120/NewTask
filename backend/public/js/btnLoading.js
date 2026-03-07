function startLoading(btnId, textId, loadingsId) {
    const button = document.getElementById(btnId);
    const buttonText = document.getElementById(textId);
    const spinner = document.getElementById(loadingsId);

    button.disabled = true;

    buttonText.innerText = 'Loading...';
    spinner.classList.remove('d-none');
}

function stopLoading(btnId, textId, loadingsId, text) {
    const button = document.getElementById(btnId);
    const buttonText = document.getElementById(textId);
    const spinner = document.getElementById(loadingsId);

    button.disabled = false;

    buttonText.innerHTML = text;
    spinner.classList.add('d-none');
}