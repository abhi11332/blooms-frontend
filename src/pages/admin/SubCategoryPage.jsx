import { useEffect, useMemo, useState } from "react";
import {
  getSubCategories,
  getMySubCategories,
  getSubCategoriesByStatus,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  publishSubCategory,
  rejectSubCategory
} from "../../api/subCategoryApi";
import { getCategories, getMyCategories } from "../../api/categoryApi";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";

export default function SubCategoryPage() {
  const { isAdmin } = useAuth();

  const [publishedSubCategories, setPublishedSubCategories] = useState([]);
  const [mySubCategories, setMySubCategories] = useState([]);
  const [pendingSubCategories, setPendingSubCategories] = useState([]);
  const [publishedCategories, setPublishedCategories] = useState([]);
  const [myCategories, setMyCategories] = useState([]);

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
  const [formMessage, setFormMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAll();
  }, [isAdmin]);

  const categoryOptions = useMemo(() => {
    const merged = [...publishedCategories, ...myCategories];
    const seen = new Set();
    return merged.filter((item) => {
      if (!item?.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [publishedCategories, myCategories]);

  const loadAll = async () => {
    setLoading(true);
    setListError("");
    try {
      const [publishedRes, mineRes, pendingRes, categoryRes, myCategoryRes] = await Promise.all([
        getSubCategories(),
        getMySubCategories(),
        isAdmin
          ? getSubCategoriesByStatus("In Review")
          : Promise.resolve({ data: [] }),
        getCategories(),
        getMyCategories()
      ]);

      setPublishedSubCategories(publishedRes.data || []);
      setMySubCategories(mineRes.data || []);
      setPendingSubCategories(pendingRes.data || []);
      setPublishedCategories(categoryRes.data || []);
      setMyCategories(myCategoryRes.data || []);
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
    setFormMessage("");

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSubmitting(true);
      if (editId) {
        await updateSubCategory({ ...form, id: editId });
        setFormMessage("Subcategory updated.");
      } else {
        await createSubCategory(form);
        setFormMessage(
          isAdmin
            ? "Subcategory created and published."
            : "Subcategory submitted for review."
        );
      }
      resetForm();
      await loadAll();
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
    setFormMessage("");
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

  const handlePublish = async (id) => {
    try {
      await publishSubCategory(id);
      await loadAll();
    } catch (err) {
      console.error("Failed to publish subcategory", err);
      setListError("Failed to publish subcategory.");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectSubCategory(id);
      await loadAll();
    } catch (err) {
      console.error("Failed to reject subcategory", err);
      setListError("Failed to reject subcategory.");
    }
  };

  const renderSubCategoryGrid = ({
    title,
    subtitle,
    items,
    showOwner,
    allowEdit,
    allowDelete,
    emptyMessage
  }) => (
    <div className="mt-8">
      <h3 className="font-display text-2xl text-white">{title}</h3>
      <p className="mt-1 text-sm text-white/60">{subtitle}</p>

      {items.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
          {emptyMessage}
        </div>
      ) : (
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {items.map((sub) => (
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
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-display text-xl text-white">{sub.title}</h4>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
                    {sub.status || "Published"}
                  </span>
                </div>

                <p className="mt-2 text-sm text-white/65">{sub.desc}</p>
                <p className="mt-2 text-xs text-white/50">
                  Category: {sub.categoryName || "Unknown"}
                </p>

                {showOwner && (
                  <p className="mt-1 text-xs text-white/50">
                    Created by: {sub.createdBy || "Unknown"}
                  </p>
                )}

                {(allowEdit || allowDelete) && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {allowEdit && (
                      <button
                        onClick={() => handleEdit(sub)}
                        className="text-xs font-semibold text-white/80 hover:text-white"
                      >
                        Edit
                      </button>
                    )}
                    {allowDelete && (
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="text-xs font-semibold text-rose-100 hover:text-white"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <AdminLayout
      title="Manage SubCategories"
      subtitle="Create, review, and control ownership for subcategory entries."
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
              {isAdmin
                ? "Admin creations are published instantly."
                : "Your subcategory will be sent for review."}
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
              {categoryOptions.map((c) => (
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
            <p className="text-sm text-white/60">Loading subcategories...</p>
          ) : (
            <>
              {isAdmin && (
                <div className="mb-8">
                  <h3 className="font-display text-2xl text-white">
                    Pending Review ({pendingSubCategories.length})
                  </h3>
                  <p className="mt-1 text-sm text-white/60">
                    User subcategories waiting for review.
                  </p>

                  {pendingSubCategories.length === 0 ? (
                    <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
                      No pending subcategories right now.
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-6 md:grid-cols-2">
                      {pendingSubCategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="overflow-hidden rounded-3xl border border-amber-100/20 bg-amber-200/5 shadow-[0_20px_55px_rgba(8,12,24,0.5)]"
                        >
                          {sub.cUrl && (
                            <img
                              src={sub.cUrl}
                              alt={sub.title}
                              className="h-40 w-full object-cover"
                            />
                          )}
                          <div className="p-5">
                            <h4 className="font-display text-xl text-white">{sub.title}</h4>
                            <p className="mt-2 text-sm text-white/70">{sub.desc}</p>
                            <p className="mt-3 text-xs text-white/50">
                              Created by: {sub.createdBy || "Unknown"}
                            </p>

                            <div className="mt-4 flex gap-3">
                              <Button size="sm" onClick={() => handlePublish(sub.id)}>
                                Publish
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleReject(sub.id)}
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

              {renderSubCategoryGrid({
                title: "My SubCategories",
                subtitle: "You can delete your own subcategories.",
                items: mySubCategories,
                showOwner: false,
                allowEdit: isAdmin,
                allowDelete: true,
                emptyMessage: "You have not created any subcategories yet."
              })}

              {renderSubCategoryGrid({
                title: "Published SubCategories",
                subtitle: "Live subcategories visible across the platform.",
                items: publishedSubCategories,
                showOwner: true,
                allowEdit: isAdmin,
                allowDelete: isAdmin,
                emptyMessage: "No published subcategories found."
              })}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
