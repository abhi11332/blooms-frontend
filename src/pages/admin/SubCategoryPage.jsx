import { useEffect, useState } from "react";
import {
  getSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory
} from "../../api/subCategoryApi";
import { getCategories } from "../../api/categoryApi";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";

export default function SubCategoryPage() {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");

  const [form, setForm] = useState({
    title: "",
    desc: "",
    cUrl: "",
    categoryId: ""
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
      const [subRes, catRes] = await Promise.all([
        getSubCategories(),
        getCategories()
      ]);
      setSubCategories(subRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error("Failed to load subcategories", err);
      setListError("Unable to load subcategories right now.");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Title is required";
    if (!form.categoryId) nextErrors.categoryId = "Pick a category";
    if (form.cUrl && !/^https?:\/\//.test(form.cUrl)) {
      nextErrors.cUrl = "Use a full image URL";
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
        await updateSubCategory({ ...form, id: editId });
      } else {
        await createSubCategory(form);
      }
      resetForm();
      loadAll();
    } catch (err) {
      console.error("Subcategory save failed", err);
      setFormError("Unable to save subcategory. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({ title: "", desc: "", cUrl: "", categoryId: "" });
    setEditId(null);
    setErrors({});
  };

  const handleEdit = (sub) => {
    setEditId(sub.id);
    setForm({
      title: sub.title,
      desc: sub.desc,
      cUrl: sub.cUrl || "",
      categoryId: sub.categoryId
    });
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this subcategory?")) {
      await deleteSubCategory(id);
      loadAll();
    }
  };

  return (
    <AdminLayout
      title="Manage SubCategories"
      subtitle="Add focus topics under each category to keep content discoverable."
      actions={
        <Button size="sm" variant="outline" onClick={resetForm}>
          Reset Form
        </Button>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1.05fr_1.4fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(8,12,24,0.5)]">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">SubCategory Form</p>
            <h2 className="font-display text-2xl text-white">
              {editId ? "Update SubCategory" : "Create SubCategory"}
            </h2>
            <p className="text-sm text-white/60">
              Group related topics and keep the editorial structure tight.
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
              placeholder="SubCategory title"
              value={form.title}
              error={errors.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
            />
            <Textarea
              label="Description"
              placeholder="Describe this subcategory"
              rows={4}
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />
            <Select
              label="Category"
              value={form.categoryId}
              error={errors.categoryId}
              onChange={(e) => {
                setForm({ ...form, categoryId: e.target.value });
                if (errors.categoryId) setErrors({ ...errors, categoryId: "" });
              }}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </Select>
            <Input
              label="Image URL"
              placeholder="https://"
              value={form.cUrl}
              error={errors.cUrl}
              helper="Optional image for the subcategory card."
              onChange={(e) => {
                setForm({ ...form, cUrl: e.target.value });
                if (errors.cUrl) setErrors({ ...errors, cUrl: "" });
              }}
            />
          </div>

          {form.cUrl && !errors.cUrl && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <img
                src={form.cUrl}
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
            <p className="text-sm text-white/60">Loading subcategories...</p>
          ) : subCategories.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
              No subcategories yet. Create the first one to refine topics.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {subCategories.map((sub) => (
                <div
                  key={sub.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_55px_rgba(8,12,24,0.5)]"
                >
                  {sub.cUrl && (
                    <img
                      src={sub.cUrl}
                      alt={sub.title}
                      className="h-40 w-full object-cover"
                    />
                  )}

                  <div className="p-5">
                    <h3 className="font-display text-xl text-white">
                      {sub.title}
                    </h3>

                    <p className="mt-2 text-sm text-white/65">
                      {sub.desc}
                    </p>

                    <p className="mt-3 text-xs text-white/50">
                      Category: {sub.categoryName || "Unassigned"}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleEdit(sub)}
                        className="text-xs font-semibold text-white/80 hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="text-xs font-semibold text-rose-100 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
