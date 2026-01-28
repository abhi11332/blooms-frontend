import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { getBlogs } from "../../api/blogApi";
import { getCategories } from "../../api/categoryApi";
import { getSubCategories } from "../../api/subCategoryApi";

export default function Dashboard() {
  const { logout } = useAuth();

  const [stats, setStats] = useState({
    blogs: 0,
    categories: 0,
    subCategories: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-purple-600 mb-10">
          Blooms 🌸
        </h2>

        <nav className="space-y-4">
          <Link
            to="/blogs"
            className="block px-4 py-2 rounded-lg hover:bg-purple-100 text-gray-700"
          >
            📝 Blogs
          </Link>

          <Link
            to="/categories"
            className="block px-4 py-2 rounded-lg hover:bg-purple-100 text-gray-700"
          >
            📂 Categories
          </Link>

          <Link
            to="/subcategories"
            className="block px-4 py-2 rounded-lg hover:bg-purple-100 text-gray-700"
          >
            🗂 SubCategories
          </Link>

          <button
            onClick={logout}
            className="mt-10 text-red-500 text-left w-full px-4"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
        </div>

        {/* ================= STATS ================= */}
        {loading ? (
          <p className="text-gray-500">Loading stats...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <StatCard title="Total Blogs" value={stats.blogs} />
            <StatCard title="Categories" value={stats.categories} />
            <StatCard title="SubCategories" value={stats.subCategories} />
          </div>
        )}

        {/* ================= QUICK ACTIONS ================= */}
        <div className="grid md:grid-cols-3 gap-6">
          <QuickCard
            to="/blogs"
            label="Create / Manage Blogs"
            icon="➕"
          />
          <QuickCard
            to="/categories"
            label="Manage Categories"
            icon="🗂"
          />
          <QuickCard
            to="/subcategories"
            label="Manage SubCategories"
            icon="📁"
          />
        </div>
      </main>
    </div>
  );
}

/* ================= SMALL REUSABLE COMPONENTS ================= */

function StatCard({ title, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
    >
      <p className="text-gray-500 text-sm mb-1">
        {title}
      </p>
      <p className="text-3xl font-bold text-purple-600">
        {value}
      </p>
    </motion.div>
  );
}

function QuickCard({ to, label, icon }) {
  return (
    <Link
      to={to}
      className="bg-white p-6 rounded-xl shadow hover:shadow-xl
      transition text-center font-semibold text-gray-700"
    >
      <div className="text-3xl mb-3">{icon}</div>
      {label}
    </Link>
  );
}
