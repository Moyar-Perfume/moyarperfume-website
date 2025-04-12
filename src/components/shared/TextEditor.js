import dynamic from "next/dynamic";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function TextEditor({ value, onChange, className, disabled }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }], // Tiêu đề
      ["bold", "italic", "underline", "strike"], // In đậm, in nghiêng, gạch chân, gạch ngang
      [{ list: "ordered" }, { list: "bullet" }], // Danh sách số, danh sách chấm
      [{ script: "sub" }, { script: "super" }], // Chỉ số dưới, chỉ số trên
      [{ indent: "-1" }, { indent: "+1" }], // Thụt lề
      [{ direction: "rtl" }], // Viết từ phải sang trái
      [{ size: ["small", false, "large", "huge"] }], // Kích thước chữ
      [{ color: [] }, { background: [] }], // Màu chữ, màu nền
      [{ align: [] }], // Căn lề
      ["link", "image", "video"], // Thêm link, hình ảnh, video
      ["clean"], // Xóa định dạng
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "script",
    "indent",
    "direction",
    "size",
    "color",
    "background",
    "align",
    "link",
    "image",
    "video",
  ];

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      className={`w-full pb-0 mb-0 h-full ${className || ""}`}
      readOnly={disabled}
    />
  );
}
