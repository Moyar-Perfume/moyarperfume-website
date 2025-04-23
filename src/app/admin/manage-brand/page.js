"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Modal,
  Pagination,
  Spin,
  Table,
  message,
  Popconfirm,
} from "antd";
import Image from "next/image";
import { formatDate } from "@/utils/formatter";
import useManageBrands from "@/hooks/admin/useManageBrands";

export default function ManageBrand() {
  const router = useRouter();
  const [filteredBrands, setFilteredBrands] = useState([]);

  // Thêm state trong component ManageBrand
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { brands, loading, error, pagination, getAllBrand, deleteBrand } =
    useManageBrands();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const fetchData = (page = 1, limitVal = 20, search = searchText) => {
    setCurrentPage(page);
    getAllBrand(page, limitVal, search);
  };

  const handleSearch = () => {
    fetchData(1);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBrand(id);
      message.success("Đã xóa thành công");
      fetchData(pagination.currentPage);
    } catch {
      message.error("Xóa thất bại");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Xử lý thêm brand mới
  const navigateToAddBrand = () => {
    router.push("/admin/manage-brand/add-brand");
  };

  return (
    <div className="bg-white shadow-md p-4 w-full min-h-[calc(100vh-70px)] flex flex-col">
      {/* Header và Search */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý thương hiệu
        </h1>

        <div className="flex space-x-4">
          <Button
            type="primary"
            onClick={navigateToAddBrand}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Thêm thương hiệu
          </Button>
        </div>
      </div>

      <div className="flex w-full gap-4 pb-4">
        <div className="relative flex w-full">
          <input
            type="text"
            placeholder="Tìm kiếm thương hiệu..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)} // Cập nhật text khi người dùng nhập
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(); // Gọi hàm tìm kiếm khi nhấn Enter
              }
            }}
            className="flex w-full text-sm pl-10 pr-10 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute left-3 top-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
          {/* Nút xóa */}
          {searchText && (
            <button
              onClick={() => {
                setSearchText(""); // Xóa giá trị input
                fetchData(1, 20, ""); // Gọi lại fetchData mà không có tìm kiếm
              }}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        <Button
          type="primary"
          onClick={handleSearch} // Gọi hàm search khi bấm nút
          className="bg-blue-500 hover:bg-blue-600 flex"
        >
          Tìm kiếm
        </Button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="flex-grow overflow-x-auto mb-4 h-full relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        )}

        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider ">
                Logo
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider ">
                Tên thương hiệu
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider ">
                Ngày chỉnh sửa
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {brands.length > 0
              ? brands.map((brand) => (
                  <tr key={brand.slug} className="hover:bg-gray-50">
                    <td className="px-6 whitespace-nowrap text-xs font-medium text-gray-900">
                      <div className=" w-[50px] h-[50px] relative">
                        <Image
                          src={brand.logo || "/logo/logo_bg/logo_black.png"}
                          fill
                          alt={brand.slug}
                        />
                      </div>
                    </td>
                    <td className="px-6 whitespace-nowrap text-xs text-gray-500">
                      {brand.name}
                    </td>
                    <td className="px-6 whitespace-nowrap text-xs text-gray-500">
                      {formatDate(brand.updatedAt)}
                    </td>

                    <td className="px-6 py-2 whitespace-nowrap text-xs font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() =>
                            router.push(`/admin/manage-brand/edit/${brand.id}`)
                          }
                        >
                          Sửa
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(brand.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              : !loading && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Không tìm thấy thương hiệu nào
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>

      <div className="w-full flex items-center justify-end">
        {/* Phân trang - luôn ở dưới cùng */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-end gap-2 mt-4 text-sm">
            <button
              onClick={() => fetchData(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Trang đầu
            </button>

            <button
              onClick={() => fetchData(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Trước
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === pagination.totalPages ||
                  Math.abs(page - currentPage) <= 2
              )
              .map((page, idx, arr) => (
                <React.Fragment key={page}>
                  {idx > 0 && page - arr[idx - 1] > 1 && (
                    <span className="px-2 flex items-center">...</span>
                  )}
                  <button
                    onClick={() => fetchData(page)}
                    className={`w-10 h-10 border rounded ${
                      currentPage === page ? "bg-black text-white" : ""
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}

            <button
              onClick={() => fetchData(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Sau
            </button>

            <button
              onClick={() => fetchData(pagination.totalPages)}
              disabled={currentPage === pagination.totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Trang cuối
            </button>
          </div>
        )}
      </div>

      {/* Modal xác nhận xóa */}
      {/* <Modal
        title="Xác nhận xóa"
        open={deleteModalVisible}
        onCancel={handleCancelDelete}
        footer={[
          <Button key="cancel" onClick={handleCancelDelete}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            loading={deleteLoading}
            onClick={handleDeleteBrand}
          >
            Xóa
          </Button>,
        ]}
      >
        {brandToDelete && (
          <p>
            Bạn có chắc chắn muốn xóa thương hiệu{" "}
            <strong>{brandToDelete.name}</strong>?
            <br />
            Hành động này không thể hoàn tác.
          </p>
        )}
      </Modal> */}
    </div>
  );
}
