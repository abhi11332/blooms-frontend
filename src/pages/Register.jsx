import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 w-96 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        {["name", "username", "email", "password"].map((f) => (
          <input
            key={f}
            type={f === "password" ? "password" : "text"}
            placeholder={f}
            className="w-full mb-3 p-2 border rounded"
            onChange={(e) =>
              setForm({ ...form, [f]: e.target.value })
            }
          />
        ))}

        <button
          onClick={submit}
          className="w-full bg-purple-600 text-white py-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
}
