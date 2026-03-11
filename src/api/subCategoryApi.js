import httpClient from "./httpClient";

const BASE = "/api/subcategory";

export const getSubCategories = () =>
  httpClient.get(`${BASE}/subcategories`);

export const getMySubCategories = () =>
  httpClient.get(`${BASE}/mine`);

export const getSubCategoriesByStatus = (status) =>
  httpClient.get(`${BASE}/moderation/${status}`);

export const createSubCategory = (data) =>
  httpClient.post(BASE, data);

export const updateSubCategory = (data) =>
  httpClient.put(BASE, data);

export const deleteSubCategory = (id) =>
  httpClient.delete(`${BASE}?subCategoryId=${id}`);

export const publishSubCategory = (id) =>
  httpClient.put(`${BASE}/${id}/publish`);

export const rejectSubCategory = (id) =>
  httpClient.put(`${BASE}/${id}/reject`);
