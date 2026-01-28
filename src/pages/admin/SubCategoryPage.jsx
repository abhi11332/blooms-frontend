import { useEffect, useState } from "react";
import {
  getSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory
} from "../../api/subCategoryApi";
import { getCategories } from "../../api/categoryApi";

export default function SubCategoryPage() {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    desc: "",
    cUrl: "",
    categoryId: ""
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [subRes, catRes] = await Promise.all([
      getSubCategories(),
      getCategories()
    ]);
    setSubCategories(subRes.data);
    setCategories(catRes.data);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.categoryId) {
      alert("Title & Category required");
      return;
    }

    if (editId) {
      await updateSubCategory({ ...form, id: editId });
    } else {
      await createSubCategory(form);
    }

    resetForm();
    loadAll();
  };

  const resetForm = () => {
    setForm({ title: "", desc: "", cUrl: "", categoryId: "" });
    setEditId(null);
  };

  const handleEdit = (sub) => {
    setEditId(sub.id);
    setForm({
      title: sub.title,
      desc: sub.desc,
      cUrl: sub.cUrl || "",
      categoryId: sub.categoryId
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this subcategory?")) {
      await deleteSubCategory(id);
      loadAll();
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">
        Manage SubCategories
      </h1>

      {/* ===== FORM ===== */}
      <div className="bg-white p-6 rounded-xl shadow mb-10 max-w-xl">
        <h2 className="font-semibold mb-4">
          {editId ? "Update SubCategory" : "Create SubCategory"}
        </h2>

        <input
          placeholder="Title"
          className="w-full mb-3 p-2 border rounded"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          className="w-full mb-3 p-2 border rounded"
          value={form.desc}
          onChange={(e) =>
            setForm({ ...form, desc: e.target.value })
          }
        />

        <select
          className="w-full mb-3 p-2 border rounded"
          value={form.categoryId}
          onChange={(e) =>
            setForm({ ...form, categoryId: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        <input
          placeholder="Image URL (optional)"
          className="w-full mb-4 p-2 border rounded"
          value={form.cUrl}
          onChange={(e) =>
            setForm({ ...form, cUrl: e.target.value })
          }
        />

        {/* IMAGE PREVIEW */}
        {form.cUrl && (
          <img
            src={form.cUrl}
            alt="preview"
            className="w-32 h-32 object-cover rounded mb-4 border"
          />
        )}

        <button
          onClick={handleSubmit}
          className="bg-purple-600 text-white px-6 py-2 rounded"
        >
          {editId ? "Update" : "Create"}
        </button>

        {editId && (
          <button
            onClick={resetForm}
            className="ml-4 text-gray-500"
          >
            Cancel
          </button>
        )}
      </div>

      {/* ===== LIST ===== */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subCategories.map((sub) => (
          <div
            key={sub.id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg"
          >
            {sub.cUrl && (
              <img
                src={sub.cUrl}
                alt={sub.title}
                className="w-full h-40 object-cover rounded mb-4"
              />
            )}

            <h3 className="font-bold text-lg mb-1">
              {sub.title}
            </h3>

            <p className="text-sm text-gray-600 mb-2">
              {sub.desc}
            </p>
            <img src="sub.image" alt="" />

            <p className="text-xs text-gray-500 mb-3">
              Category: {sub.categoryName}
            </p>

            <div className="flex justify-between">
              <button
                onClick={() => handleEdit(sub)}
                className="text-blue-500 text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(sub.id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
