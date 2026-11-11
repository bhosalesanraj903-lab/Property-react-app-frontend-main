import { Mail, Phone, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import OTPModal from "./OTPModel";

export default function Login() {
  const navigate = useNavigate();
  // Separate states for email and phone
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const sendOtp = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    const toastId = toast.loading("Sending OTP...");

    try {
      // Sending both email and phone to the backend
      await api.post("http://localhost:3060/api/auth/send-otp", { 
        email: email.trim(), 
        phone: phone.trim() 
      });
      
      toast.success("OTP sent to your email!", { id: toastId });
      setShowOtpModal(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send OTP.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center items-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-blue-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Access your property dashboard</p>
        </div>

        <div className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Phone Input */}
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <button
            onClick={sendOtp}
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? "Processing..." : "Get Verification Code"}
          </button>

          <div className="flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="mx-4 text-slate-400 text-sm font-medium">SECURE ADMIN ACCESS</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            onClick={() => navigate("/adminlogin")}
            className="w-full bg-slate-800 text-white font-semibold py-3.5 rounded-xl hover:bg-slate-900 transition-colors flex justify-center items-center gap-2"
          >
            Admin Dashboard
          </button>
        </div>

        {showOtpModal && (
          <OTPModal 
            email={email} // Typically OTP is verified against the email
            phone={phone}
            onClose={() => setShowOtpModal(false)} 
          />
        )}
      </div>
    </div>
  );
}