import { UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";

export default function AdminRegistration() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            toast.error("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            console.log("📤 Sending registration request with email:", email);
            const res = await axiosInstance.post("/admin/create", { email, password });

            console.log("✅ Registration successful:", res.data);
            toast.success("Admin registered successfully!");
            setTimeout(() => navigate("/adminlogin"), 1500);
        } catch (err) {
            console.error("❌ Registration error:", err);
            console.error("Response status:", err.response?.status);
            console.error("Response data:", err.response?.data);
            
            const errorMsg = err.response?.data?.message || err.message || "Registration failed";
            console.error("Final error message:", errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-slate-900">
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
                <h1 className="text-2xl font-black mb-8 text-slate-800 flex items-center gap-2">
                    <UserPlus className="text-blue-500" /> ADMIN REGISTRATION
                </h1>

                <div className="space-y-5">
                    <div>
                        <label className="text-sm font-bold text-slate-600 ml-1">ADMIN EMAIL</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full mt-1 border-2 border-slate-100 p-3 rounded-xl focus:border-blue-400 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-600 ml-1">PASSWORD</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full mt-1 border-2 border-slate-100 p-3 rounded-xl focus:border-blue-400 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-600 ml-1">CONFIRM PASSWORD</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full mt-1 border-2 border-slate-100 p-3 rounded-xl focus:border-blue-400 outline-none transition"
                        />
                    </div>

                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        className={`w-full py-4 rounded-xl bg-blue-500 text-white font-bold text-lg hover:bg-blue-600 transition ${loading ? "opacity-50" : ""}`}
                    >
                        {loading ? "Registering..." : "Register Admin"}
                    </button>

                    <button
                        onClick={() => navigate("/adminlogin")}
                        className="w-full py-2 text-slate-600 hover:text-slate-800 transition"
                    >
                        Already have an account? Login
                    </button>
                </div>
            </div>
        </div>
    );
}