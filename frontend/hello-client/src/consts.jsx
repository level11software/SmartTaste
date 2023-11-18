export const backend_url =
  "https://cc27-2a09-80c0-192-0-6dcd-f24d-404a-31cc.ngrok-free.app";

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
  return data;
}
