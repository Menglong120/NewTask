async function fetchResqest(){
    const responseNotification = await fetch(`${baseApiUrl}/api/request/password`, {
      method: 'GET'
  });
  const dataNotification = await responseNotification.json();
  return dataNotification;
  }