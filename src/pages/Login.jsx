import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const nextErrors = {};
    if (!form.username.trim()) nextErrors.username = "Username is required";
    if (!form.password.trim()) nextErrors.password = "Password is required";
    return nextErrors;
  };

  const submit = async () => {
    setFormError("");
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSubmitting(true);
      const res = await axios.post(
        "https://blooms-backend-i36k.onrender.com/api/user/login",
        form
      );

      if (!res.data) {
        setFormError("Invalid credentials. Please try again.");
        return;
      }

      login(res.data);
      navigate("/admin");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

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
            Secure Access
            <span className="h-2 w-2 rounded-full bg-[color:var(--mint)] shadow-[0_0_12px_rgba(58,229,199,0.8)]" />
          </span>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            Welcome back to Blooms.
            <span className="block text-white/70">Keep the editorial flow moving.</span>
          </h1>
          <p className="max-w-xl text-base text-white/70 sm:text-lg">
            Review scheduled drops, polish drafts, and publish with speed. Your
            studio is already warmed up.
          </p>
          <div className="grid max-w-md grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Drafts</p>
              <p className="text-lg font-semibold text-white">128</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Live</p>
              <p className="text-lg font-semibold text-white">62</p>
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
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Admin Login</p>
              <h2 className="font-display text-2xl text-white">Sign in</h2>
              <p className="text-sm text-white/60">Use your admin credentials to enter.</p>
            </div>

            {formError && (
              <div className="mb-4 rounded-2xl border border-rose-200/40 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Username"
                placeholder="Enter your username"
                value={form.username}
                error={errors.username}
                onChange={(e) => {
                  setForm({ ...form, username: e.target.value });
                  if (errors.username) setErrors({ ...errors, username: "" });
                }}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                error={errors.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
              />
            </div>

            <Button
              onClick={submit}
              className="mt-6 w-full"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Login"}
            </Button>

            <div className="mt-6 flex items-center justify-between text-xs text-white/60">
              <span>Need admin access?</span>
              <button
                onClick={() => navigate("/register")}
                className="font-semibold text-white transition hover:text-white/90"
              >
                Create account
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
