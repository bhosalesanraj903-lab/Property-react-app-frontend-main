import axios from "axios";
import { Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { startLogoutTimer } from "../../services/authTimeOut";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error("Credentials required");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post("http://localhost:3060/admin/login", { email, password });

            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("adminToken", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            localStorage.setItem("role", res.data.role);

            startLogoutTimer(navigate);
            toast.success("Welcome, Administrator!");
            console.log("hiii Admin");
            navigate("/admin");
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid Admin Credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-slate-900">
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
                <h1 className="text-2xl font-black mb-8 text-slate-800 flex items-center gap-2">
                    <Lock className="text-red-500" /> ADMIN PANEL
                </h1>

                <div className="space-y-5">
                    <div>
                        <label className="text-sm font-bold text-slate-600 ml-1">ADMIN EMAIL</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full mt-1 border-2 border-slate-100 p-3 rounded-xl focus:border-red-400 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-600 ml-1">PASSWORD</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full mt-1 border-2 border-slate-100 p-3 rounded-xl focus:border-red-400 outline-none transition"
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className={`w-full py-4 rounded-xl bg-red-500 text-white font-bold text-lg hover:bg-red-600 transition ${loading ? "opacity-50" : ""}`}
                    >
                        {loading ? "Authenticating..." : "System Login"}
                    </button>

                    <button
                        onClick={() => window.location.href = "/adminregister"}
                        className="w-full py-2 text-slate-600 hover:text-slate-800 transition"
                    >
                        New Admin? Register Here
                    </button>
                </div>
            </div>
        </div>
    );
}