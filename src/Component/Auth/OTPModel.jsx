import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";

export default function OTPModal({ email, onClose }) {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(false);

  const verifyOtp = async () => {
    if (otp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }

    setVerifying(true);
    try {
      const res = await api.post("http://localhost:3060/api/auth/verify-otp", { to: email, code: otp });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role);

      toast.success("Identity Verified!");
      navigate("/home");
    } catch (error) {
      toast.error("Invalid OTP code. Please check and try again.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Verify Identity</h2>
        <p className="text-slate-500 text-center mb-6 text-sm">We've sent a code to <br/><span className="font-bold text-slate-700">{email}</span></p>

        <input
          autoFocus
          className="border-2 border-slate-100 text-center text-3xl tracking-[1em] p-3 w-full rounded-xl mb-6 focus:border-blue-500 outline-none transition font-mono"
          placeholder="••••••"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={verifyOtp}
          disabled={verifying}
          className={`w-full bg-blue-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg ${verifying ? 'opacity-50' : ''}`}
        >
          {verifying ? "Verifying..." : "Confirm & Enter"}
        </button>
        
        <button onClick={onClose} className="w-full mt-4 text-slate-400 text-sm font-medium hover:text-slate-600">
          Didn't receive code? Resend
        </button>
      </div>
    </div>
  );
}