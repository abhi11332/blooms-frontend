import { useEffect, useState } from "react";
import {
  getCategories,
  getMyCategories,
  getCategoriesByStatus,
  createCategory,
  updateCategory,
  deleteCategory,
  publishCategory,
  rejectCategory
} from "../../api/categoryApi";
import { getSubCategories } from "../../api/subCategoryApi";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";

export default function CategoryPage() {
  const { isAdmin } = useAuth();

  const [publishedCategories, setPublishedCategories] = useState([]);
  const [myCategories, setMyCategories] = useState([]);
  const [pendingCategories, setPendingCategories] = useState([]);
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
  const [formMessage, setFormMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAll();
  }, [isAdmin]);

  const loadAll = async () => {
    setLoading(true);
    setListError("");
    try {
      const [publishedRes, mineRes, subRes, pendingRes] = await Promise.all([
        getCategories(),
        getMyCategories(),
        getSubCategories(),
        isAdmin
          ? getCategoriesByStatus("In Review")
          : Promise.resolve({ data: [] })
      ]);

      setPublishedCategories(publishedRes.data || []);
      setMyCategories(mineRes.data || []);
      setSubCategories(subRes.data || []);
      setPendingCategories(pendingRes.data || []);
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
    setFormMessage("");

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSubmitting(true);
      if (editId) {
        await updateCategory({ ...form, id: editId });
        setFormMessage("Category updated.");
      } else {
        await createCategory(form);
        setFormMessage(
          isAdmin
            ? "Category created and published."
            : "Category submitted for review."
        );
      }
      resetForm();
      await loadAll();
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
    setFormMessage("");
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

  const handlePublish = async (id) => {
    try {
      await publishCategory(id);
      await loadAll();
    } catch (err) {
      console.error("Failed to publish category", err);
      setListError("Failed to publish category.");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectCategory(id);
      await loadAll();
    } catch (err) {
      console.error("Failed to reject category", err);
      setListError("Failed to reject category.");
    }
  };

  const getSubByCategory = (categoryId) =>
    subCategories.filter((s) => s.categoryId === categoryId);

  const renderCategoryGrid = ({
    title,
    subtitle,
    categories,
    showOwner,
    allowEdit,
    allowDelete,
    emptyMessage
  }) => (
    <div className="mt-8">
      <h3 className="font-display text-2xl text-white">{title}</h3>
      <p className="mt-1 text-sm text-white/60">{subtitle}</p>

      {categories.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
          {emptyMessage}
        </div>
      ) : (
        <div className="mt-4 grid gap-6 md:grid-cols-2">
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
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-display text-xl text-white">{cat.title}</h4>
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
                      {cat.status || "Published"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-white/65">{cat.desc}</p>

                  {showOwner && (
                    <p className="mt-3 text-xs text-white/50">
                      Created by: {cat.createdBy || "Unknown"}
                    </p>
                  )}

                  {(allowEdit || allowDelete) && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {allowEdit && (
                        <button
                          onClick={() => handleEdit(cat)}
                          className="text-xs font-semibold text-white/80 hover:text-white"
                        >
                          Edit
                        </button>
                      )}
                      {allowDelete && (
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="text-xs font-semibold text-rose-100 hover:text-white"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}

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
                            <p className="text-xs text-white/60">{sub.desc}</p>
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
  );

  return (
    <AdminLayout
      title="Manage Categories"
      subtitle="Create, review, and manage category ownership lifecycle."
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
              {isAdmin
                ? "Admin creations are published instantly."
                : "Your categories are sent for admin review."}
            </p>
          </div>

          {formError && (
            <div className="mb-4 rounded-2xl border border-rose-200/40 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
              {formError}
            </div>
          )}

          {formMessage && (
            <div className="mb-4 rounded-2xl border border-emerald-200/40 bg-emerald-200/10 px-4 py-3 text-sm text-emerald-100">
              {formMessage}
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
              {submitting
                ? "Saving..."
                : editId
                  ? "Update"
                  : isAdmin
                    ? "Create & Publish"
                    : "Submit For Review"}
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
          ) : (
            <>
              {isAdmin && (
                <div className="mb-8">
                  <h3 className="font-display text-2xl text-white">
                    Pending Review ({pendingCategories.length})
                  </h3>
                  <p className="mt-1 text-sm text-white/60">
                    User categories waiting for review.
                  </p>

                  {pendingCategories.length === 0 ? (
                    <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
                      No pending categories right now.
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-6 md:grid-cols-2">
                      {pendingCategories.map((cat) => (
                        <div
                          key={cat.id}
                          className="overflow-hidden rounded-3xl border border-amber-100/20 bg-amber-200/5 shadow-[0_20px_55px_rgba(8,12,24,0.5)]"
                        >
                          {cat.categoryUrl && (
                            <img
                              src={cat.categoryUrl}
                              alt={cat.title}
                              className="h-40 w-full object-cover"
                            />
                          )}
                          <div className="p-5">
                            <h4 className="font-display text-xl text-white">{cat.title}</h4>
                            <p className="mt-2 text-sm text-white/70">{cat.desc}</p>
                            <p className="mt-3 text-xs text-white/50">
                              Created by: {cat.createdBy || "Unknown"}
                            </p>

                            <div className="mt-4 flex gap-3">
                              <Button size="sm" onClick={() => handlePublish(cat.id)}>
                                Publish
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleReject(cat.id)}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {renderCategoryGrid({
                title: "My Categories",
                subtitle: "You can delete your own categories at any time.",
                categories: myCategories,
                showOwner: false,
                allowEdit: isAdmin,
                allowDelete: true,
                emptyMessage: "You have not created any categories yet."
              })}

              {renderCategoryGrid({
                title: "Published Categories",
                subtitle: "Publicly visible categories.",
                categories: publishedCategories,
                showOwner: true,
                allowEdit: isAdmin,
                allowDelete: isAdmin,
                emptyMessage: "No published categories found."
              })}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
