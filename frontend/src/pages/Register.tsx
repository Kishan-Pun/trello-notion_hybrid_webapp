import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/signup", { name, email, password });
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-white">
          Create Account 🚀
        </h1>

        <input
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 p-3 rounded-lg mb-4 text-white"
        />

        <input
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 p-3 rounded-lg mb-4 text-white"
        />

        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 p-3 rounded-lg mb-6 text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 transition text-white p-3 rounded-lg font-semibold"
        >
          Register
        </button>

        <p className="text-gray-400 text-sm mt-6 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
