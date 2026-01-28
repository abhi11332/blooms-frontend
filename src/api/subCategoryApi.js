import axios from "axios";

const BASE = "https://blooms-backend-i36k.onrender.com/api/subcategory";

export const getSubCategories = () =>
  axios.get(`${BASE}/subcategories`);

export const createSubCategory = (data) =>
  axios.post(BASE, data);

export const updateSubCategory = (data) =>
  axios.put(BASE, data);

export const deleteSubCategory = (id) =>
  axios.delete(`${BASE}?subCategoryId=${id}`);
