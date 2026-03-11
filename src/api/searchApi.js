import httpClient from "./httpClient";

const BASE = "/api/search";

export const searchUserContent = (username) =>
  httpClient.get(`${BASE}/user-content`, {
    params: { username }
  });
