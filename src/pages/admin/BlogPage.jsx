import { useEffect, useState } from "react";
import {
  createBlog,
  getBlogs,
  getMyBlogs,
  getBlogsByStatus,
  deleteBlog,
  getCategoryTree,
  publishBlog,
  rejectBlog
} from "../../api/blogApi";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";

export default function BlogPage() {
  const { isAdmin } = useAuth();

  const [publishedBlogs, setPublishedBlogs] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [pendingBlogs, setPendingBlogs] = useState([]);
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
  const [formMessage, setFormMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, [isAdmin]);

  const load = async () => {
    setLoading(true);
    setListError("");
    try {
      const [publishedRes, mineRes, pendingRes, catRes] = await Promise.all([
        getBlogs(),
        getMyBlogs(),
        isAdmin
          ? getBlogsByStatus("In Review")
          : Promise.resolve({ data: [] }),
        getCategoryTree()
      ]);

      setPublishedBlogs(publishedRes.data || []);
      setMyBlogs(mineRes.data || []);
      setPendingBlogs(pendingRes.data || []);
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
    setFormMessage("");

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSubmitting(true);
      await createBlog(form);
      setFormMessage("Blog submitted for review.");
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

  const handlePublish = async (id) => {
    try {
      await publishBlog(id);
      await load();
    } catch (err) {
      console.error("Failed to publish blog", err);
      setListError("Failed to publish blog.");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectBlog(id);
      await load();
    } catch (err) {
      console.error("Failed to reject blog", err);
      setListError("Failed to reject blog.");
    }
  };

  const renderBlogsGrid = ({
    title,
    subtitle,
    blogs,
    showAuthor,
    allowDelete,
    emptyMessage
  }) => (
    <div className="mt-8">
      <h2 className="font-display text-2xl text-white">{title}</h2>
      <p className="mt-2 text-sm text-white/60">{subtitle}</p>

      {blogs.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
          {emptyMessage}
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogs.map((b) => (
            <div
              key={b.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(8,12,24,0.5)]"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-lg text-white">{b.title}</h3>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
                  {b.status || "Published"}
                </span>
              </div>

              <p className="mt-2 text-sm text-white/65">{b.description}</p>

              {showAuthor && (
                <p className="mt-3 text-xs text-white/50">
                  Created by: {b.authorName || "Unknown"}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {(b.categoryMappings || []).map((m, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/70"
                  >
                    {m.subCategoryName}
                  </span>
                ))}
              </div>

              {allowDelete && (
                <button
                  onClick={() => removeBlog(b.id)}
                  className="mt-4 text-xs font-semibold text-rose-100 hover:text-white"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <AdminLayout
      title="Manage Blogs"
      subtitle="Create blogs, moderate pending submissions, and manage ownership deletes."
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
              New and edited blogs are submitted for admin review.
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
              Choose subcategories for proper content mapping.
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
              {submitting ? "Submitting..." : "Submit For Review"}
            </Button>
            <Button variant="ghost" onClick={resetForm}>
              Clear Draft
            </Button>
          </div>
        </div>

        <div>
          {listError && (
            <div className="mb-4 rounded-2xl border border-rose-200/40 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
              {listError}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-white/60">Loading blogs...</p>
          ) : (
            <>
              {isAdmin && (
                <div>
                  <h2 className="font-display text-2xl text-white">
                    Pending Review ({pendingBlogs.length})
                  </h2>
                  <p className="mt-2 text-sm text-white/60">
                    User blogs waiting for moderation.
                  </p>

                  {pendingBlogs.length === 0 ? (
                    <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
                      No pending blogs right now.
                    </div>
                  ) : (
                    <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {pendingBlogs.map((b) => (
                        <div
                          key={b.id}
                          className="rounded-3xl border border-amber-100/20 bg-amber-200/5 p-5 shadow-[0_18px_50px_rgba(8,12,24,0.5)]"
                        >
                          <h3 className="font-display text-lg text-white">{b.title}</h3>
                          <p className="mt-2 text-sm text-white/65">{b.description}</p>
                          <p className="mt-3 text-xs text-white/50">
                            Created by: {b.authorName || "Unknown"}
                          </p>

                          <div className="mt-4 flex gap-3">
                            <Button size="sm" onClick={() => handlePublish(b.id)}>
                              Publish
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleReject(b.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {renderBlogsGrid({
                title: "My Blogs",
                subtitle: "You can delete your own blogs anytime.",
                blogs: myBlogs,
                showAuthor: false,
                allowDelete: true,
                emptyMessage: "You have not created any blogs yet."
              })}

              {renderBlogsGrid({
                title: "Published Blogs",
                subtitle: "Publicly visible approved blogs.",
                blogs: publishedBlogs,
                showAuthor: true,
                allowDelete: isAdmin,
                emptyMessage: "No published blogs found."
              })}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
