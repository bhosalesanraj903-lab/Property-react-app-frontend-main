import axiosInstance from "./axiosInstance";

export const getUsers = () =>
  axiosInstance.get("/admin/users");

export const getBookings = () =>
  axiosInstance.get("/admin/bookings");

export const getContacts = () =>
  axiosInstance.get("/admin/contacts");

export const deleteUser = (id) =>
  axiosInstance.delete(`/admin/users/${id}`);


