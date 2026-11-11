import { useEffect, useState } from "react";
import Navbar from "../Component/AdminNavbar";
import api from "../services/api";
import { getContacts } from "../services/adminApi";
import axiosInstance from "../services/axiosInstance";


export default function AdminContacts() {
    const [list, setList] = useState([]);


    useEffect(() => {
        getContacts("/admin/contacts").then(res => setList(res.data));
    }, []);


    const del = id => axiosInstance.delete(`/admin/contacts/${id}`).then(() => window.location.reload());


    return (
        <>
            <Navbar />
            <div className=" mt-10 lg:mt-35 w-full"></div>
            <h2>Contacts</h2>
            {list.map(c => (
                <div key={c.id}>
                    <table className="mx-auto p-2 m-1 rounded shadow border-separate border-spacing-x-4 border border-gray-400 dark:border-gray-500">
                        <thead>
                            <tr> <th className="p-2 m-1 rounded shadow border border-gray-300 dark:border-gray-600">Name</th>
                                <th className="p-2 m-1 rounded shadow border border-gray-300 dark:border-gray-600">Email</th>
                                <th className="p-2 m-1 rounded shadow border border-gray-300 dark:border-gray-600">Phone</th>
                                <th className="p-2 m-1 rounded shadow border border-gray-300 dark:border-gray-600">Message</th>
                                <th className="p-2 m-1 rounded shadow border border-gray-300 dark:border-gray-600">Action</th>
                            </tr>
                        </thead>

                        <tr>
                            <td className="p-2 m-1 rounded shadow border border-gray-300 dark:border-gray-600">{c.name}</td>
                            <td className="p-2 m-1 rounded shadow border border-gray-300 dark:border-gray-600">{c.email} </td>
                            <td className="p-2 m-1 rounded shadow border border-gray-300 dark:border-gray-600"> {c.phone}</td>
                            <td className="p-2 m-1 rounded shadow border border-gray-300 dark:border-gray-600">{c.message}</td>
                            <td className="p-2 m-1 rounded shadow border border-gray-300 dark:border-gray-600"><button onClick={() => del(c.id)}>Delete</button></td>
                        </tr>
                    </table>


                </div>
            ))}
        </>
    );
}