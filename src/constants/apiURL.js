import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:4000/api",
//   withCredentials: true, // ⚠️ Cần thiết để nhận cookie từ server
// });

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ⚠️ Cần thiết để nhận cookie từ server
});

export default api;
