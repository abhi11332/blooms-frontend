import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../../api/categoryApi";
import { getSubCategories } from "../../api/subCategoryApi";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [openCatId, setOpenCatId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    desc: "",
    categoryUrl: ""
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [catRes, subRes] = await Promise.all([
      getCategories(),
      getSubCategories()
    ]);
    setCategories(catRes.data);
    setSubCategories(subRes.data);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.desc) {
      alert("Title & Description required");
      return;
    }

    if (editId) {
      await updateCategory({ ...form, id: editId });
    } else {
      await createCategory(form);
    }

    resetForm();
    loadAll();
  };

  const resetForm = () => {
    setForm({ title: "", desc: "", categoryUrl: "" });
    setEditId(null);
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setForm({
      title: cat.title,
      desc: cat.desc,
      categoryUrl: cat.categoryUrl || ""
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      await deleteCategory(id);
      loadAll();
    }
  };

  const getSubByCategory = (categoryId) =>
    subCategories.filter((s) => s.categoryId === categoryId);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-purple-700">
        Manage Categories
      </h1>

      {/* ================= FORM ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-12 max-w-xl">
        <h2 className="font-semibold mb-4">
          {editId ? "Update Category" : "Create Category"}
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

        <input
          placeholder="Image URL (optional)"
          className="w-full mb-4 p-2 border rounded"
          value={form.categoryUrl}
          onChange={(e) =>
            setForm({ ...form, categoryUrl: e.target.value })
          }
        />

        {form.categoryUrl && (
          <img
            src={form.categoryUrl}
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

      {/* ================= CATEGORY LIST ================= */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => {
          const subs = getSubByCategory(cat.id);

          return (
            <div
              key={cat.id}
              className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden"
            >
              {cat.categoryUrl && (
                <img
                  src={cat.categoryUrl}
                  alt={cat.title}
                  className="w-full h-40 object-cover"
                />
              )}

              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">
                  {cat.title}
                </h3>

                <p className="text-sm text-gray-600 mb-3">
                  {cat.desc}
                </p>

                <div className="flex justify-between mb-3">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-blue-500 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                </div>

                {/* TOGGLE SUBCATEGORIES */}
                {subs.length > 0 && (
                  <button
                    onClick={() =>
                      setOpenCatId(
                        openCatId === cat.id ? null : cat.id
                      )
                    }
                    className="text-purple-600 text-sm font-medium"
                  >
                    {openCatId === cat.id
                      ? "Hide SubCategories ▲"
                      : `See SubCategories (${subs.length}) ▼`}
                  </button>
                )}

                {/* SUBCATEGORY LIST */}
                {openCatId === cat.id && (
                  <div className="mt-4 space-y-3 border-t pt-3">
                    {subs.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex gap-3 items-start"
                      >
                        {sub.cUrl && (
                          <img
                            src={sub.cUrl}
                            alt={sub.title}
                            className="w-12 h-12 rounded object-cover border"
                          />
                        )}

                        <div>
                          <p className="font-semibold text-sm">
                            {sub.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {sub.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
