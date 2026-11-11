import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3060",
});

/* 🔐 REQUEST INTERCEPTOR */
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("adminToken") ||
      localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* 🔁 RESPONSE INTERCEPTOR (REFRESH TOKEN) */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🚫 If no response (network error)
    if (!error.response) {
      return Promise.reject(error);
    }

    // 🔁 Access token expired → refresh
    if (
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      // ❌ No refresh token → logout
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          "http://localhost:3060/auth/refresh",
          { refreshToken }
        );

        // ✅ Save new access token
        localStorage.setItem("accessToken", res.data.accessToken);

        // ✅ Retry original request
        originalRequest.headers.Authorization =
          `Bearer ${res.data.accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // ❌ Refresh token expired / invalid
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
