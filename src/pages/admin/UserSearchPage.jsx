import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { searchUserContent } from "../../api/searchApi";
import { useAuth } from "../../context/AuthContext";

export default function UserSearchPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    const value = username.trim();
    if (!value) {
      setError("Enter a username to search.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await searchUserContent(value);
      setResult(res.data || null);
    } catch (err) {
      if (err?.response?.status === 404) {
        setError("User not found.");
      } else {
        setError("Search failed. Please try again.");
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const renderCards = ({ title, items, type }) => (
    <div className="mt-8">
      <h3 className="font-display text-2xl text-white">{title}</h3>

      {items.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
          No {title.toLowerCase()} found.
        </div>
      ) : (
        <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(8,12,24,0.5)]"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-display text-lg text-white">
                  {item.title || "Untitled"}
                </h4>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
                  {item.status || "Unknown"}
                </span>
              </div>

              {type !== "blog" && (
                <p className="mt-2 text-sm text-white/65">{item.desc || "No description"}</p>
              )}

              {type === "subcategory" && (
                <p className="mt-2 text-xs text-white/55">
                  Category: {item.categoryName || "Unknown"}
                </p>
              )}

              {type === "blog" && (
                <>
                  <p className="mt-2 text-sm text-white/65">{item.description || "No description"}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(item.categoryMappings || []).map((mapping, idx) => (
                      <span
                        key={`${item.id}-${idx}`}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/70"
                      >
                        {mapping.subCategoryName}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <p className="mt-3 text-xs text-white/50">
                Created by: {item.createdBy || item.authorName || result?.user?.username || "Unknown"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <AdminLayout
      title="Search User Content"
      subtitle="Search any username and view their categories, subcategories, and blogs."
      actions={
        isAdmin ? (
          <Button size="sm" variant="outline" onClick={() => navigate("/users")}>
            Open Users Panel
          </Button>
        ) : null
      }
    >
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(8,12,24,0.5)]">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Input
            label="Username"
            placeholder="Enter exact username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <div className="sm:pt-7">
            <Button onClick={handleSearch} disabled={loading} className="w-full sm:w-auto">
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-rose-200/40 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="mt-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(8,12,24,0.5)]">
            <h2 className="font-display text-2xl text-white">{result.user?.name || result.user?.username}</h2>
            <p className="mt-1 text-sm text-white/60">@{result.user?.username}</p>
            <p className="mt-1 text-sm text-white/60">{result.user?.email}</p>
            <p className="mt-2 text-xs text-white/50">Role: {result.user?.role || "USER"}</p>
          </div>

          {renderCards({
            title: "Categories",
            items: result.categories || [],
            type: "category"
          })}

          {renderCards({
            title: "SubCategories",
            items: result.subCategories || [],
            type: "subcategory"
          })}

          {renderCards({
            title: "Blogs",
            items: result.blogs || [],
            type: "blog"
          })}
        </div>
      )}
    </AdminLayout>
  );
}
