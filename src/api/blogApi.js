import httpClient from "./httpClient";

const BASE = "/api/blog";

export const getBlogs = () => httpClient.get(`${BASE}/all`);
export const getMyBlogs = () => httpClient.get(`${BASE}/mine`);
export const getBlogsByStatus = (status) =>
  httpClient.get(`${BASE}/moderation/${status}`);
export const createBlog = (data) => httpClient.post(BASE, data);
export const updateBlog = (data) => httpClient.put(BASE, data);
export const deleteBlog = (id) =>
  httpClient.delete(`${BASE}?blogId=${id}`);
export const publishBlog = (id) => httpClient.put(`${BASE}/${id}/publish`);
export const rejectBlog = (id) => httpClient.put(`${BASE}/${id}/reject`);

export const getCategoryTree = () =>
  httpClient.get(`${BASE}/categories`);
