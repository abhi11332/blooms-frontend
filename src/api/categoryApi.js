import httpClient from "./httpClient";

const BASE = "/api/category";

export const getCategories = () =>
  httpClient.get(`${BASE}/all`);

export const getMyCategories = () =>
  httpClient.get(`${BASE}/mine`);

export const getCategoriesByStatus = (status) =>
  httpClient.get(`${BASE}/moderation/${status}`);

export const createCategory = (data) =>
  httpClient.post(BASE, data);

export const updateCategory = (data) =>
  httpClient.put(BASE, data);

export const deleteCategory = (id) =>
  httpClient.delete(`${BASE}?categoryId=${id}`);

export const publishCategory = (id) =>
  httpClient.put(`${BASE}/${id}/publish`);

export const rejectCategory = (id) =>
  httpClient.put(`${BASE}/${id}/reject`);
