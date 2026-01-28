import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async () => {
    const res = await axios.post(
      "https://blooms-backend-i36k.onrender.com/api/user/login",
      form
    );

    if (!res.data) return alert("Invalid credentials");

    login(res.data);
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 w-96 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>

        <input
          placeholder="Username"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={submit}
          className="w-full bg-purple-600 text-white py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
