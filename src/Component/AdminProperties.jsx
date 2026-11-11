
  import { AnimatePresence, motion } from "framer-motion";
import { Bath, BedDouble, Edit3, Plus, RotateCcw, Square, Trash2, Upload, X, MapPin, ChevronLeft, ChevronRight, Star, AlignLeft } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import AdminNavbar from "./AdminNavbar";

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // States for card UI
  const [activeImageIndexes, setActiveImageIndexes] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const initialFormState = {
    title: "",
    description: "",
    location: "",
    price: "",
    type: "BUY",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "", 
    featured: false,
    imageUrls: []
  };

  const [form, setForm] = useState(initialFormState);

  const loadProperties = async () => {
    try {
      const res = await axiosInstance.get("/properties?size=1000");
      setProperties(res.data.content || []);
    } catch (err) { console.error("Error loading properties"); }
  };

  useEffect(() => { loadProperties(); }, []);

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({
      title: p.title || "",
      description: p.description || "",
      location: p.location || "",
      price: p.price || "",
      type: p.type || "BUY",
      bedrooms: p.bedrooms || "",
      bathrooms: p.bathrooms || "",
      squareFeet: p.squareFeet || "", 
      featured: p.featured || false,
      imageUrls: p.imageUrls || (p.imageUrl ? [p.imageUrl] : [])
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const formData = new FormData();
    files.forEach(file => formData.append("file", file));

    try {
      setLoading(true);
      const res = await axiosInstance.post("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newImages = Array.isArray(res.data) ? res.data : [res.data];
      setForm(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ...newImages] }));
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.imageUrls.length === 0) return alert("Please upload at least one image");
    setIsSubmitting(true);
    try {
      if (editId) {
        await axiosInstance.put(`/properties/admin/${editId}`, form);
        setEditId(null);
      } else {
        await axiosInstance.post("/properties/admin", form);
      }
      setForm(initialFormState);
      loadProperties();
    } catch (err) {
      alert("Failed to save property");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axiosInstance.delete(`/properties/admin/${id}`);
        setProperties(properties.filter(p => p.id !== id));
      } catch (err) { alert("Delete failed."); }
    }
  };

  const nextImage = (e, propId, len) => {
    e.stopPropagation();
    setActiveImageIndexes(prev => ({ ...prev, [propId]: ((prev[propId] || 0) + 1) % len }));
  };

  const prevImage = (e, propId, len) => {
    e.stopPropagation();
    setActiveImageIndexes(prev => ({ ...prev, [propId]: ((prev[propId] || 0) - 1 + len) % len }));
  };

  return (
    <>
      <AdminNavbar />
      <div className=" mt-50 lg:mt-31 w-full"></div>
      <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 gap-8 p-4 md:p-10 pt-28">

        {/* LEFT: FORM (Unchanged Logic) */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-28">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                {editId ? <Edit3 className="bg-amber-500 text-white rounded-lg p-1" size={24} /> : <Plus className="bg-indigo-600 text-white rounded-lg p-1" size={24} />}
                {editId ? "Edit Listing" : "New Listing"}
              </h2>
              {editId && <button onClick={() => {setEditId(null); setForm(initialFormState);}} className="text-slate-400 hover:text-indigo-600"><RotateCcw size={20} /></button>}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input className="w-full bg-slate-50 border-transparent rounded-xl p-3.5" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              
              <div className="flex items-center gap-2 px-1">
                <input type="checkbox" id="feat" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="w-4 h-4 accent-indigo-600" />
                <label htmlFor="feat" className="text-sm font-bold text-slate-600">Mark as Featured</label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input type="number" className="w-full bg-slate-50 border-transparent rounded-xl p-3.5" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                <select className="w-full bg-slate-50 border-transparent rounded-xl p-3.5 font-bold text-indigo-600" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="BUY">BUY</option>
                  <option value="RENT">RENT</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input type="number" className="w-full bg-slate-50 border-transparent rounded-xl p-3.5 text-xs" placeholder="Beds" value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })} />
                <input type="number" className="w-full bg-slate-50 border-transparent rounded-xl p-3.5 text-xs" placeholder="Baths" value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })} />
                <input type="number" className="w-full bg-slate-50 border-transparent rounded-xl p-3.5 text-xs" placeholder="Sqft" value={form.squareFeet} onChange={e => setForm({ ...form, squareFeet: e.target.value })} />
              </div>
              <input className="w-full bg-slate-50 border-transparent rounded-xl p-3.5" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
              <textarea className="w-full bg-slate-50 border-transparent rounded-xl p-3.5 h-24 resize-none" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Photos Gallery</label>
                <div className="grid grid-cols-4 gap-2">
                  {form.imageUrls.map((url, i) => (
                    <div key={i} className="relative aspect-square">
                      <img src={url} className="w-full h-full object-cover rounded-xl border border-slate-200" />
                      <button type="button" onClick={() => setForm(prev => ({ ...prev, imageUrls: prev.imageUrls.filter((_, idx) => idx !== i) }))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md"><X size={10} /></button>
                    </div>
                  ))}
                  <div className="border-2 border-dashed border-slate-200 rounded-xl relative aspect-square flex items-center justify-center cursor-pointer">
                    <input type="file" multiple onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Upload size={20} className="text-slate-400" />
                  </div>
                </div>
              </div>

              <button disabled={isSubmitting || loading} className={`w-full ${editId ? 'bg-amber-500 shadow-amber-200' : 'bg-indigo-600 shadow-indigo-200'} text-white font-bold py-4 rounded-2xl transition-all shadow-xl`}>
                {isSubmitting ? "Saving..." : editId ? "Update Property" : "Add Property"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: GRID (Detailed Cards) */}
        <div className="flex-1">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <AnimatePresence>
              {properties.map((p) => {
                const images = p.imageUrls?.length > 0 ? p.imageUrls : ["https://via.placeholder.com/400x300"];
                const currIdx = activeImageIndexes[p.id] || 0;
                const isExpanded = expandedDescriptions[p.id];

                return (
                  <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={p.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full">
                    
                    {/* Image Section */}
                    <div className="relative h-64 group">
                      <img src={images[currIdx]} className="w-full h-full object-cover" alt={p.title} />
                      
                      {images.length > 1 && (
                        <>
                          <button onClick={(e) => prevImage(e, p.id, images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronLeft size={18} />
                          </button>
                          <button onClick={(e) => nextImage(e, p.id, images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight size={18} />
                          </button>
                        </>
                      )}

                      <div className="absolute top-5 left-5 flex gap-2">
                        <div className="bg-indigo-600 text-white px-3 py-1 rounded-xl text-[10px] font-bold shadow-lg uppercase tracking-wider">{p.type}</div>
                        {p.featured && (
                          <div className="bg-amber-400 text-white px-3 py-1 rounded-xl text-[10px] font-bold shadow-lg flex items-center gap-1">
                            <Star size={10} fill="currentColor" /> FEATURED
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-7 flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-slate-800 truncate pr-2">{p.title}</h3>
                        <p className="text-xl font-black text-indigo-600">₹{Number(p.price).toLocaleString()}</p>
                      </div>
                      
                      <div className="flex items-center gap-1 text-slate-400 mb-4 text-sm font-medium">
                        <MapPin size={14} className="text-indigo-400" /> {p.location}
                      </div>

                      {/* Description Detail */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <AlignLeft size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Overview</span>
                        </div>
                        <p className={`text-slate-600 text-sm leading-relaxed ${!isExpanded && "line-clamp-2"}`}>
                          {p.description}
                        </p>
                        <button
                          onClick={() => setExpandedDescriptions(prev => ({...prev, [p.id]: !prev[p.id]}))}
                          className="text-indigo-600 text-xs font-bold mt-1 hover:underline"
                        >
                          {isExpanded ? "Show Less" : "Read Full Description"}
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-5 border-t border-slate-50">
                        <div className="flex flex-col items-center gap-1">
                          <BedDouble size={18} className="text-slate-300" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{p.bedrooms || 0} Beds</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 border-x border-slate-100">
                          <Bath size={18} className="text-slate-300" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{p.bathrooms || 0} Baths</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <Square size={18} className="text-slate-300" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{p.squareFeet || 0} Sqft</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="grid grid-cols-2 border-t border-slate-50">
                      <button onClick={() => handleEdit(p)} className="flex items-center justify-center gap-2 py-4 bg-white hover:bg-amber-50 text-amber-600 font-bold transition-colors border-r border-slate-50 text-sm">
                        <Edit3 size={16} /> Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="flex items-center justify-center gap-2 py-4 bg-white hover:bg-red-50 text-red-600 font-bold transition-colors text-sm">
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}