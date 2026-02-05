import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();
  const container = {
    initial: {},
    animate: {
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const item = {
    initial: { opacity: 0, y: 24 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[color:var(--ink)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(122,162,255,0.22),transparent_50%),radial-gradient(circle_at_12%_80%,rgba(58,229,199,0.18),transparent_45%),radial-gradient(circle_at_88%_70%,rgba(255,107,107,0.24),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(0deg,transparent_24%,rgba(255,255,255,0.35)_25%,rgba(255,255,255,0.35)_26%,transparent_27%,transparent_74%,rgba(255,255,255,0.35)_75%,rgba(255,255,255,0.35)_76%,transparent_77%),linear-gradient(90deg,transparent_24%,rgba(255,255,255,0.35)_25%,rgba(255,255,255,0.35)_26%,transparent_27%,transparent_74%,rgba(255,255,255,0.35)_75%,rgba(255,255,255,0.35)_76%,transparent_77%)] [background-size:44px_44px]" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,179,71,0.55),transparent_65%)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-25%] left-[-8%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(122,162,255,0.5),transparent_65%)] blur-3xl" />

      <div className="relative z-10">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--sun),var(--flare))] text-lg font-semibold text-slate-950 shadow-[0_12px_40px_rgba(255,179,71,0.35)]">
              B
            </div>
            <div>
              <p className="font-display text-lg leading-none">Blooms</p>
              <p className="text-xs text-white/60">Admin CMS</p>
            </div>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <button
              onClick={() => navigate("/login")}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/90 transition hover:border-white/40 hover:text-white"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_rgba(248,250,252,0.3)] transition hover:-translate-y-0.5"
            >
              Register
            </button>
          </div>
        </header>

        <motion.section
          initial="initial"
          animate="animate"
          variants={container}
          className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-16 pt-14 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="space-y-8">
            <motion.span
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/70"
            >
              Live content studio
              <span className="h-2 w-2 rounded-full bg-[color:var(--mint)] shadow-[0_0_12px_rgba(58,229,199,0.8)]" />
            </motion.span>

            <motion.h1
              variants={item}
              className="font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl"
            >
              Blooms Admin,
              <span className="block text-white/80">crafted for high-velocity publishing.</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="max-w-xl text-base text-white/70 sm:text-lg"
            >
              Shape categories, subcategories, and blogs in one unified flow.
              Smart organization, fast edits, and a layout that feels premium
              every time you open it.
            </motion.p>

            <motion.div
              variants={item}
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <button
                onClick={() => navigate("/login")}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--sun),var(--flare))] px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_45px_rgba(255,107,107,0.35)] transition hover:-translate-y-0.5"
              >
                Enter Studio
                <span className="text-base transition group-hover:translate-x-1">-&gt;</span>
              </button>
              <button
                onClick={() => navigate("/register")}
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
              >
                Create Admin Access
              </button>
            </motion.div>

            <motion.div
              variants={item}
              className="grid grid-cols-3 gap-4 text-sm text-white/70"
            >
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Drafts</p>
                <p className="text-lg font-semibold text-white">128</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Live</p>
                <p className="text-lg font-semibold text-white">62</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Editors</p>
                <p className="text-lg font-semibold text-white">9</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(3,8,20,0.65)] backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Today at a glance</p>
                  <p className="text-xl font-semibold text-white">Studio Pulse</p>
                </div>
                <span className="rounded-full border border-emerald-200/40 bg-emerald-200/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                  Live
                </span>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(122,162,255,0.2),rgba(58,229,199,0.15))] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/70">Top Category</p>
                    <p className="text-sm font-semibold text-white">Culture</p>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/10">
                    <div className="h-2 w-4/5 rounded-full bg-[linear-gradient(90deg,var(--sky),var(--mint))]" />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/70">Scheduled</p>
                    <p className="text-sm font-semibold text-white">14 posts</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
                      <div
                        key={day}
                        className={`flex-1 rounded-lg border border-white/10 px-2 py-2 text-center text-[11px] ${
                          index === 3 ? "bg-white/20 text-white" : "bg-white/5 text-white/60"
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">Review</p>
                    <p className="mt-2 text-2xl font-semibold text-white">08</p>
                    <p className="text-xs text-white/50">Pending approvals</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">New Ideas</p>
                    <p className="mt-2 text-2xl font-semibold text-white">21</p>
                    <p className="text-xs text-white/50">Captured this week</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70 backdrop-blur sm:block">
              Smart autosave / Instant drafts
            </div>
          </motion.div>
        </motion.section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-20">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Fast category architecture",
                body: "Map categories and subcategories with clarity. No hunting, just clean structure.",
              },
              {
                title: "Focus-first editor flow",
                body: "Keep writers in rhythm with quick previews, autosaves, and clear status checks.",
              },
              {
                title: "Analytics that feel alive",
                body: "See performance highlights at a glance without losing momentum.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(8,12,24,0.5)]"
              >
                <h3 className="font-display text-xl text-white">{feature.title}</h3>
                <p className="mt-3 text-sm text-white/65">{feature.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
