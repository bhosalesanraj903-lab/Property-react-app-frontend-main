import { Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../services/api"; // Adjust this path based on your folder structure

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Sending your message...");

    try {
      // Connecting to your backend URL via your api service
      await api.post("http://localhost:3060/contacts", formData);
      
      toast.success("Message sent successfully!", { id: toastId });
      // Clear form after success
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      console.error("Contact Error:", err);
      toast.error(err.response?.data?.message || "Failed to send message.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 py-12 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg lg:rounded-xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          
          {/* Form Side */}
          <div className="p-8 lg:p-16 flex-1">
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-6">Let's Talk.</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name" 
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  required 
                />
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number" 
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  required 
                />
              </div>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address" 
                className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                required 
              />
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?" 
                rows={4} 
                className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" 
                required 
              />
              
              <button 
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Send size={18}/>
                )}
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Info Side */}
          <div className="bg-slate-900 p-8 lg:p-16 lg:w-[450px] text-white flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-10">Reach Us Directly</h3>
            <div className="space-y-8">
              <div className="flex items-center gap-5 group">
                <div className="bg-blue-600/20 p-4 rounded-2xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Location</p>
                  <p className="text-slate-200 font-medium">Plot 45, BKC, Mumbai, India</p>
                </div>
              </div>
              
              <div className="flex items-center gap-5 group">
                <div className="bg-blue-600/20 p-4 rounded-2xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Call Us</p>
                  <p className="text-slate-200 font-medium">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center gap-5 group">
                <div className="bg-blue-600/20 p-4 rounded-2xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Email Us</p>
                  <p className="text-slate-200 font-medium">contact@example.org</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}