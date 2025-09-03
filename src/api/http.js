const API_URL = "http://31.97.22.121:8080";

export async function request(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const msg = await res.text();

    throw {
      status: res.status,
      statusText: res.statusText,
      message: msg,
    };
  }

  if (res.status === 204) return null;
  return res.json();
}
