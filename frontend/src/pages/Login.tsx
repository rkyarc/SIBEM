import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Mengirim data ke API Laravel
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      // Menyimpan token dan role ke localStorage
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("role", response.data.user.role);
      
      alert("Login Berhasil! Sebagai: " + response.data.user.role);
      window.location.href = "/"; // Arahkan ke dashboard
    } catch (error) {
      alert("Login Gagal: Email atau password salah.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login SIBEM</h2>
        <input 
          type="email" placeholder="Email" className="w-full p-3 mb-4 border rounded-lg"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Password" className="w-full p-3 mb-6 border rounded-lg"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold">
          Masuk
        </button>
      </form>
    </div>
  );
}