import { useEffect, useState } from "react";
import {
  createBlog,
  getBlogs,
  deleteBlog,
  getCategoryTree
} from "../../api/blogApi";
import { useAuth } from "../../context/AuthContext";

export default function BlogPage() {
  const { user } = useAuth();

  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    categoryMappings: []
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const [blogRes, catRes] = await Promise.all([
      getBlogs(),
      getCategoryTree()
    ]);
    setBlogs(blogRes.data);
    setCategories(catRes.data);
    setLoading(false);
  };

  /* ================= CATEGORY TOGGLE ================= */

  const toggleSub = (cat, sub) => {
    const exists = form.categoryMappings.find(
      m => m.subCategoryId === sub.subCategoryId
    );

    let updated;
    if (exists) {
      updated = form.categoryMappings.filter(
        m => m.subCategoryId !== sub.subCategoryId
      );
    } else {
      updated = [
        ...form.categoryMappings,
        {
          categoryId: cat.categoryId,
          categoryName: cat.name,
          subCategoryId: sub.subCategoryId,
          subCategoryName: sub.name
        }
      ];
    }

    setForm({ ...form, categoryMappings: updated });
  };

  /* ================= CREATE BLOG ================= */

  const submit = async () => {
    if (!form.title || !form.content) {
      alert("Title & Content required");
      return;
    }

    await createBlog({
      ...form,
      authorId: user.id
    });

    resetForm();
    load();
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      content: "",
      categoryMappings: []
    });
  };

  const removeBlog = async (id) => {
    if (window.confirm("Delete this blog?")) {
      await deleteBlog(id);
      load();
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-purple-700">
        Manage Blogs
      </h1>

      {/* ================= CREATE BLOG FORM ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-12 max-w-4xl">
        <h2 className="font-semibold mb-4 text-lg">
          Create New Blog
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            placeholder="Title"
            value={form.title}
            onChange={e =>
              setForm({ ...form, title: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Short Description"
            value={form.description}
            onChange={e =>
              setForm({ ...form, description: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>

        <textarea
          placeholder="Blog Content"
          rows="6"
          value={form.content}
          onChange={e =>
            setForm({ ...form, content: e.target.value })
          }
          className="w-full border p-2 rounded mb-6"
        />

        {/* ================= CATEGORY SELECTOR ================= */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">
            Categories & SubCategories
          </h3>

          <div className="space-y-4">
            {categories.map(cat => (
              <div
                key={cat.categoryId}
                className="border rounded p-3"
              >
                <p className="font-medium text-purple-700 mb-2">
                  {cat.name}
                </p>

                <div className="flex flex-wrap gap-4">
                  {cat.subCategoryDetailList.map(sub => {
                    const checked = form.categoryMappings.some(
                      m => m.subCategoryId === sub.subCategoryId
                    );

                    return (
                      <label
                        key={sub.subCategoryId}
                        className={`flex items-center gap-2 px-3 py-1 rounded cursor-pointer border
                          ${checked
                            ? "bg-purple-100 border-purple-500"
                            : "hover:bg-gray-100"
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSub(cat, sub)}
                        />
                        {sub.name}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={submit}
          className="bg-purple-600 hover:bg-purple-700
          text-white px-8 py-2 rounded"
        >
          Publish Blog
        </button>
      </div>

      {/* ================= BLOG LIST ================= */}
      <h2 className="text-xl font-semibold mb-4">
        Published Blogs
      </h2>

      {loading && <p>Loading blogs...</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map(b => (
          <div
            key={b.id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg"
          >
            <h3 className="font-bold text-lg mb-1">
              {b.title}
            </h3>

            <p className="text-sm text-gray-600 mb-2">
              {b.description}
            </p>

            <p className="text-xs text-gray-500 mb-3">
              by {b.authorName}
            </p>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2 mb-4">
              {b.categoryMappings.map((m, i) => (
                <span
                  key={i}
                  className="text-xs bg-purple-100
                  text-purple-700 px-2 py-1 rounded"
                >
                  {m.subCategoryName}
                </span>
              ))}
            </div>

            <button
              onClick={() => removeBlog(b.id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
