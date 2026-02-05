import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/ui/Button";

import { getBlogs } from "../../api/blogApi";
import { getCategories } from "../../api/categoryApi";
import { getSubCategories } from "../../api/subCategoryApi";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    blogs: 0,
    categories: 0,
    subCategories: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setError("");
    try {
      const [blogRes, catRes, subCatRes] = await Promise.all([
        getBlogs(),
        getCategories(),
        getSubCategories()
      ]);

      setStats({
        blogs: blogRes.data.length,
        categories: catRes.data.length,
        subCategories: subCatRes.data.length
      });
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
      setError("Unable to load studio stats right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="Track the publishing pulse across blogs, categories, and subcategories."
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

      {loading ? (
        <p className="text-sm text-white/60">Loading studio stats...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Blogs" value={stats.blogs} accent="var(--sun)" />
          <StatCard title="Categories" value={stats.categories} accent="var(--sky)" />
          <StatCard title="SubCategories" value={stats.subCategories} accent="var(--mint)" />
        </div>
      )}

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <QuickCard
          title="Create or Manage Blogs"
          body="Jump into drafts, publish new posts, and keep your editorial schedule on track."
          action={() => navigate("/blogs")}
        />
        <QuickCard
          title="Structure Categories"
          body="Shape the core themes that power your newsroom hierarchy."
          action={() => navigate("/categories")}
        />
        <QuickCard
          title="Refine SubCategories"
          body="Keep granular topics aligned with the main editorial pillars."
          action={() => navigate("/subcategories")}
        />
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
