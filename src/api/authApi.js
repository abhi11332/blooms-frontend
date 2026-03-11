import httpClient from "./httpClient";

const BASE = "/api/auth";

export const loginUser = (data) => httpClient.post(`${BASE}/login`, data);

export const registerUser = (data) =>
  httpClient.post(`${BASE}/register`, data);
