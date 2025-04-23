import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:4000/api",
//   withCredentials: true, // ⚠️ Cần thiết để nhận cookie từ server
// });

const api = axios.create({
  baseURL: "https://website-phi-five-69.vercel.app/api",
  withCredentials: true, // ⚠️ Cần thiết để nhận cookie từ server
});

export default api;
