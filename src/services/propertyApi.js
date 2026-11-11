// src/api/propertyApi.js
import axiosInstance from "./axiosInstance";

export const getAllProperties = (page = 0) =>
  axiosInstance.get(`/properties?page=${page}`);

export const getBuyProperties = () =>
  axiosInstance.get("/properties/type/BUY");

export const getRentProperties = () =>
  axiosInstance.get("/properties/type/RENT");

export const getFeatured = () =>
  axiosInstance.get("/properties/featured");

export const createProperty = (data) =>
  axiosInstance.post("/properties/admin", data);

export const deleteProperty = (id) =>
  axiosInstance.delete(`/properties/admin/${id}`);
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axiosInstance.post("/properties/admin/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });};