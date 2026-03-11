import httpClient from "./httpClient";

const BASE = "/api/notifications";

export const getReviewNotifications = () =>
  httpClient.get(`${BASE}/reviews`);
