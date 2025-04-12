/**
 * Định dạng ngày giờ
 * @param {string} dateString - Chuỗi ngày cần định dạng
 * @param {string} format - Định dạng mong muốn (mặc định là DD/MM/YYYY HH:MM)
 * @returns {string} - Chuỗi đã định dạng
 */
export const formatDate = (dateString, format = "datetime") => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);

    // Kiểm tra ngày hợp lệ
    if (isNaN(date.getTime())) return "Invalid date";

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    switch (format) {
      case "date":
        return `${day}/${month}/${year}`;
      case "time":
        return `${hours}:${minutes}`;
      case "datetime":
      default:
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error";
  }
};
