import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

import { getBlogs, getBlogsByStatus } from "../../api/blogApi";
import { getCategories, getCategoriesByStatus } from "../../api/categoryApi";
import {
  getSubCategories,
  getSubCategoriesByStatus
} from "../../api/subCategoryApi";
import { getReviewNotifications } from "../../api/notificationApi";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({
    blogs: 0,
    categories: 0,
    subCategories: 0,
    pendingCategories: 0,
    pendingSubCategories: 0,
    pendingBlogs: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, [isAdmin]);

  const loadStats = async () => {
    setError("");
    try {
      const [blogRes, catRes, subCatRes, pendingCatRes, pendingSubRes, pendingBlogRes, notificationRes] = await Promise.all([
        getBlogs(),
        getCategories(),
        getSubCategories(),
        isAdmin ? getCategoriesByStatus("In Review") : Promise.resolve({ data: [] }),
        isAdmin ? getSubCategoriesByStatus("In Review") : Promise.resolve({ data: [] }),
        isAdmin ? getBlogsByStatus("In Review") : Promise.resolve({ data: [] }),
        getReviewNotifications().catch(() => ({ data: [] }))
      ]);

      setStats({
        blogs: blogRes.data.length,
        categories: catRes.data.length,
        subCategories: subCatRes.data.length,
        pendingCategories: pendingCatRes.data.length,
        pendingSubCategories: pendingSubRes.data.length,
        pendingBlogs: pendingBlogRes.data.length
      });
      setNotifications(notificationRes.data || []);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
      setError("Unable to load studio stats right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Track publishing, moderation, and review updates in one place."
      actions={
        <Button size="sm" onClick={() => navigate("/blogs")}>
          Create Blog
        </Button>
      }
    >
      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200/40 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      {notifications.length > 0 && (
        <div className="mb-6 rounded-3xl border border-sky-200/25 bg-sky-200/10 p-5">
          <h3 className="font-display text-xl text-white">Review Notifications</h3>
          <div className="mt-3 space-y-2">
            {notifications.slice(0, 6).map((note) => (
              <p key={`${note.type}-${note.resourceId}`} className="text-sm text-white/80">
                {note.message}
              </p>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-white/60">Loading studio stats...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Published Blogs" value={stats.blogs} accent="var(--sun)" />
          <StatCard title="Published Categories" value={stats.categories} accent="var(--sky)" />
          <StatCard title="Published SubCategories" value={stats.subCategories} accent="var(--mint)" />
          {isAdmin && (
            <StatCard title="Pending Categories" value={stats.pendingCategories} accent="var(--flare)" />
          )}
          {isAdmin && (
            <StatCard title="Pending SubCategories" value={stats.pendingSubCategories} accent="var(--flare)" />
          )}
          {isAdmin && (
            <StatCard title="Pending Blogs" value={stats.pendingBlogs} accent="var(--flare)" />
          )}
        </div>
      )}

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <QuickCard
          title="Search User Content"
          body="Find any username and view their categories, subcategories, and blogs."
          action={() => navigate("/search")}
        />
        <QuickCard
          title="Manage Blogs"
          body="Create new blogs, moderate pending submissions, and delete what you own."
          action={() => navigate("/blogs")}
        />
        <QuickCard
          title="Manage Categories"
          body="Review category submissions and keep taxonomy clean and approved."
          action={() => navigate("/categories")}
        />
        <QuickCard
          title="Manage SubCategories"
          body="Moderate subcategory queue and control nested content structure."
          action={() => navigate("/subcategories")}
        />
        {isAdmin && (
          <QuickCard
            title="Manage Users"
            body="Delete user accounts and trigger cascade cleanup of their content."
            action={() => navigate("/users")}
          />
        )}
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_22px_60px_rgba(8,12,24,0.5)]"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-white/50">{title}</p>
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
      <div
        className="mt-4 h-1.5 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${accent}, rgba(255,255,255,0.08))`
        }}
      />
    </motion.div>
  );
}

function QuickCard({ title, body, action }) {
  return (
    <button
      onClick={action}
      className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left text-white/80 shadow-[0_20px_55px_rgba(8,12,24,0.55)] transition hover:-translate-y-1 hover:border-white/30"
    >
      <h3 className="font-display text-xl text-white">{title}</h3>
      <p className="mt-3 text-sm text-white/60">{body}</p>
      <span className="mt-6 inline-flex text-sm font-semibold text-white">
        Open &gt;
      </span>
    </button>
  );
}
