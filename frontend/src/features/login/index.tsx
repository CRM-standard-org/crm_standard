import { useEffect, useState } from "react";
import { postLogin, getAuthStatus } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";

export default function LoginFeature() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getAuthStatus()
      .then((response) => {
        if (response.statusCode === 200 && response.message === "User authenticated successfully") {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error checking authentication status:", error.message);
      });
  }, []);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (!username) return alert("Please enter a username.");
    if (!password) return alert("Please enter a password.");

    try {
      postLogin({ username, password }).then((response) => {
        if (response.statusCode === 200) {
          navigate("/");
        } else {
          alert(response.message || "Unexpected error occurred");
        }
      });
    } catch (error) {
      // console.error("Error logging in:", error.response?.data || error.message);
      alert("Failed to log in. Please try again.");
    }
  };

  return (
    // <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
    <div className="flex items-center justify-center min-h-screen bg-[url('/images/bg-login.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-fade-in">
        <div className="flex justify-center mb-6">
          <img
            src="/images/logo.png"
            alt="logo-main-website"
            className="h-12 transition-opacity duration-300 hover:opacity-70 cursor-pointer"
          />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Login
          </button>
        </form>
       
      </div>
    </div>
  );
}
