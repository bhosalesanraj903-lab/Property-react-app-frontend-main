import AdminNavbar from "./AdminNavbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-slate-50">
            <AdminNavbar />

            {/* pt-32 ensures content starts below the two-row header 
         We remove ml-64 because we no longer have a side sidebar.
      */}
            <main className="max-w-[1600px] mx-auto pt-32 p-4 md:p-8">
                
            <Outlet />
            <Footer />
            </main>
        </div>
    );
}