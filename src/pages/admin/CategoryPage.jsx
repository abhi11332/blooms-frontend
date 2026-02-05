import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../../api/categoryApi";
import { getSubCategories } from "../../api/subCategoryApi";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [openCatId, setOpenCatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");

  const [form, setForm] = useState({
    title: "",
    desc: "",
    categoryUrl: ""
  });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setListError("");
    try {
      const [catRes, subRes] = await Promise.all([
        getCategories(),
        getSubCategories()
      ]);
      setCategories(catRes.data);
      setSubCategories(subRes.data);
    } catch (err) {
      console.error("Failed to load categories", err);
      setListError("Unable to load categories right now.");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Title is required";
    if (!form.desc.trim()) nextErrors.desc = "Description is required";
    if (form.categoryUrl && !/^https?:\/\//.test(form.categoryUrl)) {
      nextErrors.categoryUrl = "Use a full image URL";
    }
    return nextErrors;
  };

  const handleSubmit = async () => {
    setFormError("");
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSubmitting(true);
      if (editId) {
        await updateCategory({ ...form, id: editId });
      } else {
        await createCategory(form);
      }
      resetForm();
      loadAll();
    } catch (err) {
      console.error("Category save failed", err);
      setFormError("Unable to save category. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({ title: "", desc: "", categoryUrl: "" });
    setEditId(null);
    setErrors({});
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setForm({
      title: cat.title,
      desc: cat.desc,
      categoryUrl: cat.categoryUrl || ""
    });
    setErrors({});
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
    <AdminLayout
      title="Manage Categories"
      subtitle="Define the core editorial pillars and keep subcategories organized."
      actions={
        <Button size="sm" variant="outline" onClick={resetForm}>
          Reset Form
        </Button>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1.05fr_1.4fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(8,12,24,0.5)]">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Category Form</p>
            <h2 className="font-display text-2xl text-white">
              {editId ? "Update Category" : "Create Category"}
            </h2>
            <p className="text-sm text-white/60">
              Add a clean title, strong description, and optional hero image.
            </p>
          </div>

          {formError && (
            <div className="mb-4 rounded-2xl border border-rose-200/40 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
              {formError}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Title"
              placeholder="Category title"
              value={form.title}
              error={errors.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
            />
            <Textarea
              label="Description"
              placeholder="Describe this category"
              rows={4}
              value={form.desc}
              error={errors.desc}
              onChange={(e) => {
                setForm({ ...form, desc: e.target.value });
                if (errors.desc) setErrors({ ...errors, desc: "" });
              }}
            />
            <Input
              label="Image URL"
              placeholder="https://"
              value={form.categoryUrl}
              error={errors.categoryUrl}
              helper="Optional hero image for the category card."
              onChange={(e) => {
                setForm({ ...form, categoryUrl: e.target.value });
                if (errors.categoryUrl) {
                  setErrors({ ...errors, categoryUrl: "" });
                }
              }}
            />
          </div>

          {form.categoryUrl && !errors.categoryUrl && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <img
                src={form.categoryUrl}
                alt="preview"
                className="h-40 w-full object-cover"
              />
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Saving..." : editId ? "Update" : "Create"}
            </Button>
            {editId && (
              <Button variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </div>

        <div>
          {listError && (
            <div className="mb-4 rounded-2xl border border-rose-200/40 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
              {listError}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-white/60">Loading categories...</p>
          ) : categories.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
              No categories yet. Create the first one to start organizing.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {categories.map((cat) => {
                const subs = getSubByCategory(cat.id);

                return (
                  <div
                    key={cat.id}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_55px_rgba(8,12,24,0.5)]"
                  >
                    {cat.categoryUrl && (
                      <img
                        src={cat.categoryUrl}
                        alt={cat.title}
                        className="h-40 w-full object-cover"
                      />
                    )}

                    <div className="p-5">
                      <h3 className="font-display text-xl text-white">
                        {cat.title}
                      </h3>

                      <p className="mt-2 text-sm text-white/65">
                        {cat.desc}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="text-xs font-semibold text-white/80 hover:text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="text-xs font-semibold text-rose-100 hover:text-white"
                        >
                          Delete
                        </button>
                      </div>

                      {subs.length > 0 && (
                        <button
                          onClick={() =>
                            setOpenCatId(openCatId === cat.id ? null : cat.id)
                          }
                          className="mt-4 text-xs font-semibold text-white/80 hover:text-white"
                        >
                          {openCatId === cat.id
                            ? "Hide subcategories"
                            : `See subcategories (${subs.length})`}
                        </button>
                      )}

                      {openCatId === cat.id && (
                        <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                          {subs.map((sub) => (
                            <div key={sub.id} className="flex gap-3">
                              {sub.cUrl && (
                                <img
                                  src={sub.cUrl}
                                  alt={sub.title}
                                  className="h-12 w-12 rounded-2xl object-cover"
                                />
                              )}
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  {sub.title}
                                </p>
                                <p className="text-xs text-white/60">
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
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
