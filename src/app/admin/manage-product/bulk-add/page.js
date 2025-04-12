"use client"; // hoặc bỏ nếu dùng trong pages

import api from "@/constants/apiURL";
import { useState } from "react";

export default function BulkAdd() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  // Danh sách các tags cần thiết
  const requiredTags = [
    "doluumui_",
    "thoigian_",
    "khuyendung_",
    "gioitinh_",
    "shadow_",
    "phathanh_",
    "nongdo_",
    "toahuong_",
    "phongcach_",
    "muihuong_",
    "dotuoi_",
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file extension
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      if (!["xlsx", "xls"].includes(fileExtension)) {
        setMessage("❌ Vui lòng chọn file Excel (.xlsx, .xls)");
        setFile(null);
        setFileName("");
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
      setMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("❌ Vui lòng chọn file Excel");
      return;
    }

    setIsLoading(true);
    setMessage("⏳ Đang xử lý...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Thêm danh sách tags cần thiết vào formData
      formData.append("requiredTags", JSON.stringify(requiredTags));

      // Tăng timeout cho request lên 5 phút
      const res = await api.post("admin/bulk-add", formData, {
        timeout: 300000, // 300 seconds = 5 phút
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Check if the response is successful
      if (res.status === 200) {
        setMessage(`✅ Import thành công: ${res.data.count} sản phẩm`);
        // Reset form after successful import
        setFile(null);
        setFileName("");
      } else {
        setMessage(`❌ Thất bại: ${res.data.error || "Có lỗi xảy ra"}`);
      }
    } catch (error) {
      console.error("Upload error:", error);

      // Provide more detailed error information
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage =
          error.response.data.error ||
          error.response.data.details ||
          "Có lỗi xảy ra";
        setMessage(`❌ Lỗi: ${errorMessage}`);
      } else if (error.request) {
        // The request was made but no response was received
        setMessage(
          "❌ Không nhận được phản hồi từ máy chủ. Vui lòng thử lại sau."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        setMessage(`❌ Lỗi: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Nhập sản phẩm từ Excel</h1>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Hướng dẫn: Tải lên file Excel chứa thông tin sản phẩm với các cột sau:
        </p>
        <ul className="text-sm text-gray-600 list-disc pl-5 mb-4">
          <li>Tên sản phẩm (bắt buộc)</li>
          <li>Giá trị thuộc tính (bắt buộc)</li>
          <li>Giá (bắt buộc)</li>
          <li>Số lượng (bắt buộc)</li>
          <li>Nhà cung cấp (tùy chọn)</li>
          <li>Nội dung (tùy chọn)</li>
          <li>Tags (tùy chọn, phân cách bằng dấu phẩy)</li>
          <li>Hiển thị (tùy chọn, true/false)</li>
        </ul>

        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm font-medium text-blue-800 mb-2">
            Tags được hỗ trợ:
          </p>
          <div className="flex flex-wrap gap-2">
            {requiredTags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-xs text-blue-600 mt-2">
            Chỉ các tags có tiền tố trên sẽ được thêm vào sản phẩm.
          </p>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 rounded-md">
          <p className="text-sm font-medium text-yellow-800 mb-2">
            Lưu ý quan trọng về xử lý tags:
          </p>
          <ul className="text-xs text-yellow-700 list-disc pl-5 space-y-1">
            <li>
              Hệ thống sẽ chỉ lấy các tags có tiền tố thuộc danh sách trên.
            </li>
            <li>
              Các tags không có tiền tố thuộc danh sách sẽ bị xóa trước khi thêm
              vào database.
            </li>
            <li>
              Ví dụ: Nếu sản phẩm có tags "gioitinh_Nữ, Mùa xuân, nongdo_EDT",
              chỉ "gioitinh_Nữ" và "nongdo_EDT" sẽ được thêm vào.
            </li>
            <li>
              Bạn không cần phải xóa các tags không cần thiết trong file Excel,
              hệ thống sẽ tự động lọc.
            </li>
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-blue-500 hover:text-blue-700"
          >
            {fileName || "Chọn file Excel"}
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || !file}
          className={`w-full py-2 px-4 rounded ${
            isLoading || !file
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isLoading ? "Đang xử lý..." : "Import"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded ${
            message.includes("✅")
              ? "bg-green-100 text-green-800"
              : message.includes("❌")
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
