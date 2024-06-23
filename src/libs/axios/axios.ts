import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.harvardartmuseums.org",
  headers: {
    apikey: process.env.NEXT_PUBLIC_HARVARD_API_KEY
  },
  timeout: 10000
});

//  ADAPT THIS TO PROTECT BASED ON SESSION COOKIE
// axiosInstance.interceptors.request.use(function (config) {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default axiosInstance;
