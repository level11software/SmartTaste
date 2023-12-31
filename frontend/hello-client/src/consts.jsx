export const backend_url = "http://localhost:8000";

export const OPENED_RECIPE = "OPENED_RECIPE";
export const BOUGHT_RECIPE = "BOUGHT_RECIPE";
export const DISCARDED_RECIPE = "DISCARDED_RECIPE";
export const SAVED_RECIPE = "SAVED_RECIPE";

export async function verifiedGET(endpoint, authToken) {
  const url = `${backend_url}/${endpoint}`;

  // Use fetch to retrieve the scan status
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "ngrok-skip-browser-warning": "true",
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await res.json();
  console.log(data);
  return data;
}
export async function postToAPI(endpoint, data, authToken, additionalHeaders = {}) {
  const url = `${backend_url}/${endpoint}`;
  console.log("posting to url:", url)
  // Default headers
  let headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
    ...additionalHeaders,
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: data//JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json(); // Assuming the response is JSON
  } catch (error) {
    console.error('Error making API request:', error);
    throw error; // Rethrowing the error for the caller to handle
  }
}


export async function verifiedPOST(endpoint, authToken, payload) {
  const url = `${backend_url}/${endpoint}`;

  // Use fetch to retrieve the scan status
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const content = await res.json();
  return content;
}

export async function registerAction(authToken, type, id) {
  const url = `${backend_url}/send_interaction`;

  const payload = {
    recipe_id: id,
    event_type: type,
  };

  // Use fetch to retrieve the scan status
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return "ok";
}
