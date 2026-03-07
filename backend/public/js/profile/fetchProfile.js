async function setDisble() {
    const responseUser = await fetch(`${baseApiUrl}/api/profile`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const dataUser = await responseUser.json();
    return dataUser;
  }