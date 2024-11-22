import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const isMobile = window.navigator.userAgent.includes("Mobile");

const api = axios.create({
  baseURL: isMobile
    ? import.meta.env.VITE_MOBILE_API_URL
    : import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    if (error) return Promise.reject(error);
  }
);

export default api;
