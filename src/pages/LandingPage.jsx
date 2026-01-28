import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center
      bg-gradient-to-r from-purple-600 to-pink-500 text-white"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-xl"
      >
        <h1 className="text-6xl font-extrabold mb-6">
          Blooms Admin 🌸
        </h1>

        <p className="mb-10 text-white/90">
          Admin CMS to manage blogs, categories & content.
        </p>

        <div className="flex justify-center gap-6">
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="border px-6 py-3 rounded-xl font-semibold"
          >
            Register
          </button>
        </div>
      </motion.div>
    </div>
  );
}
