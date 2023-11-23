export const checkFetchError = async response => {
  const json = await response.json();
  if (response.ok) {
    return json;
  }
  return Promise.reject(new Error(json.message));
};

export const fetchApi = (path, method = 'GET', opts = {}) => {
  console.log("Fetch API:" + process.env.REACT_APP_API_URL + "/" + path)
  return fetch(`${process.env.REACT_APP_API_URL}/${path}`, {
    method: method,
    credentials: 'include',
    mode: 'cors',
    cache: method === 'GET' ? 'default' : 'no-cache',
    ...opts,
  });
};

export const fetchApiSendJson = (path, method, data) => {
  console.log("URL: /" + path + ", method: " + method + ", JSON Payload: " + JSON.stringify(data))
  return fetchApi(path, method, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const shuffle = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [array[i], array[rand]] = [array[rand], array[i]];
  }
};
