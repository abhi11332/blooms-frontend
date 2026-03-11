import httpClient from "./httpClient";

const BASE = "/api/user";

export const getUsers = () => httpClient.get(`${BASE}/users`);

export const deleteUser = (id) =>
  httpClient.delete(`${BASE}?userId=${id}`);
