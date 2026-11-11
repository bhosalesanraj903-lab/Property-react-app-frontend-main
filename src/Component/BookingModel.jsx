import { CheckCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../services/axiosInstance";

export default function BookingModal({ property, onClose, user }) {

    // 🔹 USER DETAILS
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [message, setMessage] = useState("");

    // 🔹 VISIT DETAILS
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const timeSlots = ["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"];

    // 🔒 Prevent background scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "auto");
    }, []);

    // 🔹 PROPERTY IMAGE
    const propertyImage =
        property?.imageUrls?.length > 0
            ? property.imageUrls[0]
            : property?.imageUrl ||
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa";

    // 🔹 Convert time
    const convertTo24Hour = (time12h) => {
        const [time, modifier] = time12h.split(" ");
        let [hours, minutes] = time.split(":");

        if (modifier === "PM" && hours !== "12") hours = +hours + 12;
        if (modifier === "AM" && hours === "12") hours = "00";

        return `${hours.toString().padStart(2, "0")}:${minutes}`;
    };

    const handleConfirm = async () => {
        if (!name || !email || !phone || !selectedDate || !selectedSlot) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setLoading(true);

            await axiosInstance.post("/bookings", {
                userId: user?.id,
                name,
                email,
                phone,
                propertyId: property?.id,
                propertyTitle: property?.title,
                propertyImage,
                visitDate: selectedDate,
                visitTime: convertTo24Hour(selectedSlot),
                message: message || "Property visit request",
            });

            toast.success("Booking requested successfully!");
            setStep(2);
        } catch (err) {
            console.error(err);
            toast.error("Failed to book visit");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2 sm:p-4">

            {/* MODAL */}
            <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh]
                      flex flex-col overflow-hidden shadow-2xl">

                {/* HEADER */}
                <div className="flex justify-between items-center p-4 sm:p-6 border-b">
                    <h2 className="text-xl font-bold">Schedule Visit</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
                        <X />
                    </button>
                </div>

                {/* SCROLLABLE CONTENT */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

                    {step === 1 ? (
                        <>
                            {/* PROPERTY MINI CARD */}
                            <div className="flex gap-4 bg-slate-50 rounded-xl p-3">
                                <img
                                    src={propertyImage}
                                    alt={property?.title}
                                    className="w-20 h-20 rounded-lg object-cover shrink-0"
                                />
                                <div className="min-w-0">
                                    <h3 className="font-bold text-slate-800 truncate">
                                        {property?.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 truncate">
                                        {property?.location}
                                    </p>
                                </div>
                            </div>

                            {/* USER DETAILS */}
                            <div className="grid gap-3">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="input"
                                />
                            </div>

                            {/* DATE */}
                            <input
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="input"
                            />

                            {/* TIME */}
                            <div className="grid grid-cols-2 gap-2">
                                {timeSlots.map((slot) => (
                                    <button
                                        key={slot}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`py-3 rounded-xl font-bold border transition ${selectedSlot === slot
                                                ? "bg-indigo-600 text-white"
                                                : "bg-white text-slate-600"
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>

                            {/* MESSAGE */}
                            <textarea
                                placeholder="Message (optional)"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="input resize-none h-24"
                            />
                        </>
                    ) : (
                        /* SUCCESS */
                        <div className="text-center py-8">
                            <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold">Booking Confirmed</h2>
                            <p className="text-slate-500 mt-2">
                                {selectedDate} at {selectedSlot}
                            </p>
                        </div>
                    )}
                </div>

                {/* STICKY FOOTER */}
                <div className="p-4 border-t bg-white">
                    {step === 1 ? (
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold disabled:opacity-50"
                        >
                            {loading ? "Booking..." : "Confirm Booking"}
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold"
                        >
                            Done
                        </button>
                    )}
                </div>
            </div>

            {/* INPUT STYLES */}
            <style>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #e6e0d6;
          outline: none;
        }
        .input:focus {
          border-color: #2c6650;
          box-shadow: 0 0 0 2px rgba(44,102,80,0.2);
        }
      `}</style>
        </div>
    );
}
