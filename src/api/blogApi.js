import axios from "axios";

const BASE = "https://blooms-backend-i36k.onrender.com/api/blog";

export const getBlogs = () => axios.get(`${BASE}/all`);
export const createBlog = (data) => axios.post(BASE, data);
export const updateBlog = (data) => axios.put(BASE, data);
export const deleteBlog = (id) =>
  axios.delete(`${BASE}?blogId=${id}`);

export const getCategoryTree = () =>
  axios.get(`${BASE}/categories`);
