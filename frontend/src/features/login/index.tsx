import { useEffect, useState } from "react";
import { postLogin, getAuthStatus } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/customs/alert/toast.main.component";

export default function LoginFeature() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    getAuthStatus()
      .then((response) => {
        if (response.statusCode === 200) {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error checking authentication status:", error.message);
      });
  }, [navigate]);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (!username) { showToast("กรุณากรอกชื่อผู้ใช้หรืออีเมล", false, { title: "Login" }); return; }
    if (!password) { showToast("กรุณากรอกรหัสผ่าน", false, { title: "Login" }); return; }

    try {
      postLogin({ username, password }).then((response) => {
        if (response.statusCode === 200) {
          showToast(response.message || "เข้าสู่ระบบสำเร็จ", true, { title: "Login" });
          navigate("/");
        } else {
          showToast(response.message || "เข้าสู่ระบบไม่สำเร็จ", false, { title: "Login" });
        }
      }).catch(() => {
        showToast("ไม่สามารถเข้าสู่ระบบได้", false, { title: "Login" });
      });
    } catch {
      showToast("เกิดข้อผิดพลาดในการเข้าสู่ระบบ", false, { title: "Login" });
    }
  };

  return (
    // <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
    <div className="flex items-center justify-center min-h-screen bg-[url('/images/bg-login.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-fade-in">
        {/* <div className="flex justify-center mb-6">
          <img
            src="/images/logo.png"
            alt="logo-main-website"
            className="h-12 transition-opacity duration-300 hover:opacity-70 cursor-pointer"
          />
        </div> */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1">
              Username / Email
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username or email"
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
