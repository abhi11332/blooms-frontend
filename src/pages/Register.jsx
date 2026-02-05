import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const submit = async () => {
    await axios.post("https://blooms-backend-i36k.onrender.com/api/user", form);
    alert("Registered successfully");
    navigate("/login");
  };

  const fields = [
    {
      key: "name",
      label: "Full name",
      type: "text",
      placeholder: "Enter your full name"
    },
    {
      key: "username",
      label: "Username",
      type: "text",
      placeholder: "Choose a username"
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      placeholder: "you@blooms.com"
    },
    {
      key: "password",
      label: "Password",
      type: "password",
      placeholder: "Create a secure password"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[color:var(--ink)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(122,162,255,0.22),transparent_50%),radial-gradient(circle_at_12%_80%,rgba(58,229,199,0.18),transparent_45%),radial-gradient(circle_at_88%_70%,rgba(255,107,107,0.24),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(0deg,transparent_24%,rgba(255,255,255,0.35)_25%,rgba(255,255,255,0.35)_26%,transparent_27%,transparent_74%,rgba(255,255,255,0.35)_75%,rgba(255,255,255,0.35)_76%,transparent_77%),linear-gradient(90deg,transparent_24%,rgba(255,255,255,0.35)_25%,rgba(255,255,255,0.35)_26%,transparent_27%,transparent_74%,rgba(255,255,255,0.35)_75%,rgba(255,255,255,0.35)_76%,transparent_77%)] [background-size:44px_44px]" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,179,71,0.55),transparent_65%)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-25%] left-[-8%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(122,162,255,0.5),transparent_65%)] blur-3xl" />

      <button
        onClick={() => navigate("/")}
        className="absolute left-6 top-6 z-10 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
      >
        Back to home
      </button>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-12 px-6 py-16 lg:flex-row">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 space-y-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
            New Admin
            <span className="h-2 w-2 rounded-full bg-[color:var(--sky)] shadow-[0_0_12px_rgba(122,162,255,0.8)]" />
          </span>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            Build your editorial command center.
            <span className="block text-white/70">Start publishing with confidence.</span>
          </h1>
          <p className="max-w-xl text-base text-white/70 sm:text-lg">
            Create a secure admin profile to manage categories, refine drafts, and
            collaborate with your team in one elegant space.
          </p>
          <div className="grid max-w-md grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Setup</p>
              <p className="text-lg font-semibold text-white">5 mins</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Teams</p>
              <p className="text-lg font-semibold text-white">Multi admin</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(3,8,20,0.65)] backdrop-blur">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Register</p>
              <h2 className="font-display text-2xl text-white">Create admin access</h2>
              <p className="text-sm text-white/60">Fill in your details to join the studio.</p>
            </div>

            <div className="space-y-4">
              {fields.map((field) => (
                <label key={field.key} className="block text-sm text-white/70">
                  {field.label}
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(122,162,255,0.45)]"
                    onChange={(e) =>
                      setForm({ ...form, [field.key]: e.target.value })
                    }
                  />
                </label>
              ))}
            </div>

            <button
              onClick={submit}
              className="mt-6 w-full rounded-2xl bg-[linear-gradient(135deg,var(--sun),var(--flare))] py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_45px_rgba(255,107,107,0.35)] transition hover:-translate-y-0.5"
            >
              Register
            </button>

            <div className="mt-6 flex items-center justify-between text-xs text-white/60">
              <span>Already have access?</span>
              <button
                onClick={() => navigate("/login")}
                className="font-semibold text-white transition hover:text-white/90"
              >
                Go to login
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
