import axios from "axios";

export const API_BASE_URL = "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export async function registerUser(email, password) {
  
  const res = await api.post("/auth/register", null, { params: { email, password } });
  return res.data;
}

export async function loginUser(email, password) {
  
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);

  const res = await api.post("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return res.data; 
}


export async function compareItineraries(payload) {
  const res = await api.post("/itineraires/compare", payload);
  return res.data; 
}


export async function saveTrajet(payload) {
  const res = await api.post("/trajets/save", payload);
  return res.data;
}

export async function getHistory() {
  const res = await api.get("/trajets/history");
  return res.data;
}
