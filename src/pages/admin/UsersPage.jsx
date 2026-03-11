import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/ui/Button";
import { getUsers, deleteUser } from "../../api/userApi";

export default function UsersPage() {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin");
      return;
    }
    loadUsers();
  }, [isAdmin]);

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load users", err);
      setError("Unable to load users right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (targetUser) => {
    const isSelf = user?.id === targetUser.id;
    if (isSelf) {
      setError("You cannot delete your own admin account from this panel.");
      return;
    }

    if (!window.confirm(`Delete user ${targetUser.username || targetUser.name}?`)) {
      return;
    }

    try {
      await deleteUser(targetUser.id);
      await loadUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
      setError("Failed to delete user.");
    }
  };

  return (
    <AdminLayout
      title="Manage Users"
      subtitle="Admin-only panel to view users and delete accounts with cascade cleanup."
      actions={
        <Button size="sm" variant="outline" onClick={loadUsers}>
          Refresh
        </Button>
      }
    >
      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200/40 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-white/60">Loading users...</p>
      ) : users.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
          No users found.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {users.map((u) => {
            const isSelf = user?.id === u.id;
            return (
              <div
                key={u.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(8,12,24,0.5)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg text-white">
                    {u.name || "Unnamed User"}
                  </h3>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
                    {u.role || "USER"}
                  </span>
                </div>

                <p className="mt-2 text-sm text-white/70">@{u.username || "-"}</p>
                <p className="mt-1 text-sm text-white/60">{u.email || "No email"}</p>

                <Button
                  size="sm"
                  variant="danger"
                  className="mt-5"
                  disabled={isSelf}
                  onClick={() => handleDelete(u)}
                >
                  {isSelf ? "Current Admin" : "Delete User"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
