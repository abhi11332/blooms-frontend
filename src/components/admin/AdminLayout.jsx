import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: "D" },
  { to: "/blogs", label: "Blogs", icon: "B" },
  { to: "/categories", label: "Categories", icon: "C" },
  { to: "/subcategories", label: "SubCategories", icon: "S" }
];

export default function AdminLayout({ title, subtitle, children, actions }) {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[color:var(--ink)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(122,162,255,0.18),transparent_55%),radial-gradient(circle_at_10%_90%,rgba(58,229,199,0.15),transparent_50%),radial-gradient(circle_at_90%_80%,rgba(255,107,107,0.2),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(0deg,transparent_24%,rgba(255,255,255,0.35)_25%,rgba(255,255,255,0.35)_26%,transparent_27%,transparent_74%,rgba(255,255,255,0.35)_75%,rgba(255,255,255,0.35)_76%,transparent_77%),linear-gradient(90deg,transparent_24%,rgba(255,255,255,0.35)_25%,rgba(255,255,255,0.35)_26%,transparent_27%,transparent_74%,rgba(255,255,255,0.35)_75%,rgba(255,255,255,0.35)_76%,transparent_77%)] [background-size:44px_44px]" />

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-white/10 bg-white/5 px-6 py-8 backdrop-blur lg:flex">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--sun),var(--flare))] text-lg font-semibold text-slate-950 shadow-[0_12px_40px_rgba(255,179,71,0.35)]">
              B
            </div>
            <div>
              <p className="font-display text-lg leading-none">Blooms</p>
              <p className="text-xs text-white/60">Admin CMS</p>
            </div>
          </div>

          <nav className="mt-10 space-y-2">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                    active
                      ? "bg-white/15 text-white shadow-[0_12px_30px_rgba(15,23,42,0.4)]"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </aside>

        <main className="flex-1 px-6 py-8 lg:px-10">
          <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Blooms Studio</p>
              <h1 className="font-display text-3xl text-white sm:text-4xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 max-w-2xl text-sm text-white/60 sm:text-base">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {actions}
              <Button
                variant="ghost"
                className="lg:hidden"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </header>

          <nav className="mt-5 flex flex-wrap gap-3 lg:hidden">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    active
                      ? "border-white/40 bg-white/15 text-white"
                      : "border-white/15 text-white/70 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
