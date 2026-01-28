import axios from "axios";

const BASE = "https://blooms-backend-i36k.onrender.com/api/category";

// GET all categories
export const getCategories = () => 
  axios.get(`${BASE}/all`);

// CREATE category
export const createCategory = (data) => 
  axios.post(BASE, data);

// UPDATE category
export const updateCategory = (data) => 
  axios.put(BASE, data);

// DELETE category
export const deleteCategory = (id) => 
  axios.delete(`${BASE}?categoryId=${id}`);
