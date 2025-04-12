"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal, message, Switch } from "antd";
import api from "@/constants/apiURL";
import Image from "next/image";
import { useProductList } from "@/hooks/useProductList";

export default function ManageProduct() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Thêm state cho modal xóa
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Thêm state cho loading trạng thái available
  const [availableLoading, setAvailableLoading] = useState({});

  const {
    productList,
    loading: productListLoading,
    error,
    pagination,
  } = useProductList(true, currentPage, itemsPerPage, debouncedSearchText);

  console.log(productList);

  const formattedProducts = useMemo(() => {
    if (!productList || !Array.isArray(productList)) {
      return [];
    }

    return productList.map((product) => ({
      id: product._id,
      name: product.name,
      tags: product.tags,
      quantity: product.quantity,
      updatedAt: product.updatedAt,
      slug: product.slug,
      images: product.images,
      variants: product.variants,
      brand: product.brandID?.name,
      available: product.available,
    }));
  }, [productList]);

  // Thêm debounce cho search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchText]);

  // Gọi API search khi debouncedSearchText thay đổi
  useEffect(() => {
    if (debouncedSearchText) {
      // Reset về trang 1 khi tìm kiếm
      setCurrentPage(1);
    }
  }, [debouncedSearchText]);

  // Cập nhật useEffect để lọc sản phẩm
  useEffect(() => {
    if (formattedProducts.length > 0) {
      setFilteredProducts(formattedProducts);
    }
  }, [formattedProducts]);

  // Xử lý sắp xếp
  const requestSort = (key) => {
    let direction = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });

    // Sắp xếp dữ liệu
    const sortedData = [...filteredProducts].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setFilteredProducts(sortedData);
  };

  // Hàm định dạng ngày
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    // Kiểm tra nếu ngày không hợp lệ
    if (isNaN(date.getTime())) return "Invalid date";

    // Format: DD/MM/YYYY HH:MM
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Xử lý thêm sản phẩm mới
  const navigateToAddProduct = () => {
    router.push("/admin/manage-product/add-product");
  };

  // Dữ liệu trang hiện tại
  const currentPageData = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Thêm hàm xử lý xóa sản phẩm
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    setDeleteLoading(true);
    try {
      await api.delete(`admin/manage-product/${productToDelete.id}`);

      setProducts(
        products.filter((product) => product.id !== productToDelete.id)
      );
      setFilteredProducts(
        filteredProducts.filter((product) => product.id !== productToDelete.id)
      );

      message.success(`Đã xóa sản phẩm "${productToDelete.name}" thành công!`);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      message.error("Có lỗi xảy ra khi xóa sản phẩm!");
    } finally {
      setDeleteLoading(false);
      setDeleteModalVisible(false);
      setProductToDelete(null);
    }
  };

  // Hàm mở modal xác nhận xóa
  const showDeleteConfirm = (product) => {
    setProductToDelete(product);
    setDeleteModalVisible(true);
  };

  // Hàm đóng modal xác nhận
  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setProductToDelete(null);
  };

  // Tạo helper function để lấy hình ảnh theo type
  const getImageByType = (images, type) => {
    if (!images || !Array.isArray(images)) return null;

    const image = images.find((img) => img.type === type);
    return image ? image.url : null;
  };

  // Hàm xử lý chuyển đổi trạng thái available của sản phẩm
  const handleToggleAvailable = async (
    productId,
    currentStatus,
    isVariant = false,
    variantId = null
  ) => {
    try {
      // Cập nhật trạng thái loading
      const loadingKey = isVariant ? `${productId}_${variantId}` : productId;
      setAvailableLoading((prev) => ({ ...prev, [loadingKey]: true }));

      // Gọi API để cập nhật trạng thái
      const endpoint = isVariant
        ? `/admin/manage-product/${productId}/variant/${variantId}/toggle-available`
        : `/admin/manage-product/${productId}/toggle-available`;

      const response = await api.patch(endpoint);

      // Cập nhật UI sau khi API thành công
      if (response.status === 200) {
        // Tạo bản sao của mảng sản phẩm để cập nhật
        const updatedProducts = [...filteredProducts].map((product) => {
          if (product.id === productId) {
            if (isVariant && variantId) {
              // Cập nhật available cho variant
              return {
                ...product,
                variants: product.variants.map((variant) =>
                  variant._id === variantId
                    ? { ...variant, available: !currentStatus }
                    : variant
                ),
              };
            } else {
              // Cập nhật available cho sản phẩm
              return { ...product, available: !currentStatus };
            }
          }
          return product;
        });

        setFilteredProducts(updatedProducts);

        message.success(
          `Đã ${!currentStatus ? "bật" : "tắt"} trạng thái hiển thị cho ${
            isVariant ? "biến thể" : "sản phẩm"
          }`
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái available:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái hiển thị!");
    } finally {
      // Kết thúc trạng thái loading
      const loadingKey = isVariant ? `${productId}_${variantId}` : productId;
      setAvailableLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Xử lý chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Icon sắp xếp
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <span className="ml-1">⇅</span>;
    }

    return sortConfig.direction === "ascending" ? (
      <span className="ml-1">↑</span>
    ) : (
      <span className="ml-1">↓</span>
    );
  };

  return (
    <div className="bg-white shadow-md p-4 w-full min-h-[calc(100vh-70px)] flex flex-col">
      {/* Header và Search */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>

        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="text-sm pl-10 pr-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          </div>

          <Button
            type="primary"
            onClick={navigateToAddProduct}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="flex-grow overflow-x-auto mb-4 h-full relative">
        {productListLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        )}

        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-sm font-medium text-black tracking-wider cursor-pointer bg-gray-200"
                onClick={() => requestSort("name")}
              >
                Tên sản phẩm {getSortIcon("name")}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-black tracking-wider bg-gray-200">
                Kho hàng
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-black tracking-wider bg-gray-200">
                Giá
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-black tracking-wider bg-gray-200">
                Hiển thị
              </th>
              <th
                className="px-6 py-3 text-left text-sm font-medium text-black tracking-wider cursor-pointer bg-gray-200"
                onClick={() => requestSort("updatedAt")}
              >
                Ngày chỉnh sửa {getSortIcon("updatedAt")}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-black tracking-wider bg-gray-200"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                // Lấy danh sách giá từ variants
                const variantPrices = product.variants.map((v) => v.price);

                // Tính giá thấp nhất và cao nhất
                const minPrice =
                  variantPrices.length > 0 ? Math.min(...variantPrices) : 0;
                const maxPrice =
                  variantPrices.length > 0 ? Math.max(...variantPrices) : 0;

                // Xác định giá hiển thị
                const displayedPrice =
                  variantPrices.length > 1
                    ? `₫${minPrice.toLocaleString()} - ₫${maxPrice.toLocaleString()}`
                    : variantPrices.length === 1
                    ? `₫${minPrice.toLocaleString()}`
                    : "-";

                return (
                  <React.Fragment key={product.id}>
                    {/* Hàng chính của sản phẩm */}
                    <tr className="hover:bg-gray-50 border border-b-0">
                      <td className="px-4 py-2 text-xs text-black align-top w-1/5">
                        <div className="flex items-center space-x-2">
                          <div className="min-w-[50px] min-h-[50px] relative">
                            <Image
                              src={
                                getImageByType(product.images, "main") ||
                                product.images?.[0]?.url ||
                                "/product/placeholder-product-01.png"
                              }
                              fill
                              alt={`Hình ${product.slug}`}
                              className="object-contain"
                            />
                          </div>
                          <span className="font-semibold line-clamp-2 ">
                            {product.brand} - {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-black w-1/5 align-center ">
                        <span className="flex items-center">{"-"}</span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-black w-1/5 align-center ">
                        <span className="flex items-center">
                          {displayedPrice}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-black w-1/5 align-center">
                        <Switch
                          checked={product.available}
                          onChange={() =>
                            handleToggleAvailable(product.id, product.available)
                          }
                          loading={availableLoading[product.id]}
                          size="small"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-black w-1/5 align-center">
                        <span className="flex items-center">
                          {formatDate(product.updatedAt)}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs font-medium w-1/5 align-center">
                        <div className="grid items-start justify-start">
                          <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() =>
                              router.push(
                                `/admin/manage-product/edit/${product.id}`
                              )
                            }
                          >
                            Sửa
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => showDeleteConfirm(product)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Hàng con: Hiển thị từng variant với cùng số cột */}
                    {product.variants.length > 0 &&
                      product.variants.map((variant) => (
                        <tr key={variant._id} className=" border-none">
                          <td className="px-4 py-1 text-xs text-gray-700 w-1/5 align-top pl-20">
                            {variant.capacity}
                          </td>
                          <td className="px-4 py-1 text-xs text-gray-700 w-1/5 align-top">
                            {variant.quantity}
                          </td>
                          <td className="px-4 py-1 text-xs text-gray-700 w-1/5 align-top">
                            ₫{variant.price.toLocaleString()}
                          </td>
                          <td className="px-4 py-1 text-xs text-gray-700 w-1/5 align-top">
                            <Switch
                              checked={variant.available}
                              onChange={() =>
                                handleToggleAvailable(
                                  product.id,
                                  variant.available,
                                  true,
                                  variant._id
                                )
                              }
                              loading={
                                availableLoading[`${product.id}_${variant._id}`]
                              }
                              size="small"
                            />
                          </td>
                          <td className="px-4 py-1 text-xs text-gray-700 w-1/5 align-top">
                            {variant.updatedAt
                              ? formatDate(variant.updatedAt)
                              : "-"}
                          </td>
                          <td className="px-4 py-2 text-xs text-gray-700 w-1/5 align-top">
                            <div className="flex space-x-2"></div>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Không tìm thấy sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang - luôn ở dưới cùng */}
      {pagination.totalPages > 1 && (
        <div className="mt-auto flex justify-end border-gray-200">
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            {/* Nút Trước */}
            <button
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                pagination.currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
              onClick={() =>
                pagination.currentPage > 1 &&
                setCurrentPage(pagination.currentPage - 1)
              }
              disabled={pagination.currentPage === 1}
            >
              Trước
            </button>

            {/* Hiển thị tối đa 5 nút trang */}
            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (
                  pagination.currentPage >=
                  pagination.totalPages - 2
                ) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      pagination.currentPage === pageNum
                        ? "bg-blue-50 border-blue-500 text-blue-600 z-10"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    } text-sm font-medium`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              }
            )}

            {/* Nút Sau */}
            <button
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                pagination.currentPage === pagination.totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
              onClick={() =>
                pagination.currentPage < pagination.totalPages &&
                setCurrentPage(pagination.currentPage + 1)
              }
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Sau
            </button>
          </nav>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      <Modal
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
            onClick={handleDeleteProduct}
          >
            Xóa
          </Button>,
        ]}
      >
        {productToDelete && (
          <p>
            Bạn có chắc chắn muốn xóa sản phẩm{" "}
            <strong>{productToDelete.name}</strong>?
            <br />
            Hành động này không thể hoàn tác.
          </p>
        )}
      </Modal>
    </div>
  );
}
