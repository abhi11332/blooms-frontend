import { useEffect, useState } from "react";
import {
  createBlog,
  getBlogs,
  deleteBlog,
  getCategoryTree
} from "../../api/blogApi";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";

export default function BlogPage() {
  const { user } = useAuth();

  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    categoryMappings: []
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setListError("");
    try {
      const [blogRes, catRes] = await Promise.all([
        getBlogs(),
        getCategoryTree()
      ]);
      setBlogs(blogRes.data);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error("Failed to load blogs", err);
      setListError("Unable to load blogs right now.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSub = (cat, sub) => {
    const exists = form.categoryMappings.find(
      (m) => m.subCategoryId === sub.subCategoryId
    );

    let updated;
    if (exists) {
      updated = form.categoryMappings.filter(
        (m) => m.subCategoryId !== sub.subCategoryId
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

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Title is required";
    if (!form.content.trim()) nextErrors.content = "Content is required";
    return nextErrors;
  };

  const submit = async () => {
    setFormError("");
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSubmitting(true);
      await createBlog({
        ...form,
        authorId: user.id
      });

      resetForm();
      load();
    } catch (err) {
      console.error("Blog publish failed", err);
      setFormError("Unable to publish blog. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      content: "",
      categoryMappings: []
    });
    setErrors({});
  };

  const removeBlog = async (id) => {
    if (window.confirm("Delete this blog?")) {
      await deleteBlog(id);
      load();
    }
  };

  return (
    <AdminLayout
      title="Manage Blogs"
      subtitle="Publish new stories, map them to categories, and keep the studio pipeline flowing."
      actions={
        <Button size="sm" variant="outline" onClick={resetForm}>
          Reset Draft
        </Button>
      }
    >
      <div className="grid gap-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(8,12,24,0.5)]">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Create Blog</p>
            <h2 className="font-display text-2xl text-white">New Story</h2>
            <p className="text-sm text-white/60">
              Add a title, summary, content, and map it to the right subcategories.
            </p>
          </div>

          {formError && (
            <div className="mb-4 rounded-2xl border border-rose-200/40 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
              {formError}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Title"
              placeholder="Blog title"
              value={form.title}
              error={errors.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
            />

            <Input
              label="Short Description"
              placeholder="Quick summary"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <Textarea
            label="Blog Content"
            placeholder="Write the full story..."
            rows={6}
            value={form.content}
            error={errors.content}
            onChange={(e) => {
              setForm({ ...form, content: e.target.value });
              if (errors.content) setErrors({ ...errors, content: "" });
            }}
            className="mt-4"
          />

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <h3 className="font-display text-lg text-white">Categories & SubCategories</h3>
            <p className="mt-1 text-xs text-white/60">
              Tag at least one subcategory for accurate placement.
            </p>

            <div className="mt-4 space-y-4">
              {categories.length === 0 ? (
                <p className="text-sm text-white/50">No categories available yet.</p>
              ) : (
                categories.map((cat) => (
                  <div
                    key={cat.categoryId}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-sm font-semibold text-white">{cat.name}</p>

                    <div className="mt-3 flex flex-wrap gap-3">
                      {(cat.subCategoryDetailList || []).map((sub) => {
                        const checked = form.categoryMappings.some(
                          (m) => m.subCategoryId === sub.subCategoryId
                        );

                        return (
                          <label
                            key={sub.subCategoryId}
                            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                              checked
                                ? "border-white/40 bg-white/15 text-white"
                                : "border-white/10 text-white/70 hover:border-white/30 hover:text-white"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleSub(cat, sub)}
                              className="accent-[color:var(--mint)]"
                            />
                            {sub.name}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={submit} disabled={submitting}>
              {submitting ? "Publishing..." : "Publish Blog"}
            </Button>
            <Button variant="ghost" onClick={resetForm}>
              Clear Draft
            </Button>
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl text-white">Published Blogs</h2>
          <p className="mt-2 text-sm text-white/60">
            Track what is live and remove outdated stories when needed.
          </p>

          {listError && (
            <div className="mt-4 rounded-2xl border border-rose-200/40 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
              {listError}
            </div>
          )}

          {loading ? (
            <p className="mt-4 text-sm text-white/60">Loading blogs...</p>
          ) : blogs.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
              No published blogs yet. Create the first story above.
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {blogs.map((b) => (
                <div
                  key={b.id}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(8,12,24,0.5)]"
                >
                  <h3 className="font-display text-lg text-white">
                    {b.title}
                  </h3>

                  <p className="mt-2 text-sm text-white/65">
                    {b.description}
                  </p>

                  <p className="mt-3 text-xs text-white/50">
                    by {b.authorName}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {b.categoryMappings.map((m, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/70"
                      >
                        {m.subCategoryName}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => removeBlog(b.id)}
                    className="mt-4 text-xs font-semibold text-rose-100 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
