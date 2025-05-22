"use client";

import React, { useState, useEffect, useMemo, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal, message, Switch } from "antd";
import Image from "next/image";
import { formatDate } from "@/utils/formatter";
import api from "@/constants/apiURL";

export default function ManageProduct() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  // Thêm state cho loading trạng thái available
  const [availableLoading, setAvailableLoading] = useState({});

  const [productListLoading, setProductListLoading] = useState(false);
  const [productList, setProductList] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasMore: false,
  });

  const productsPerPage = 12;

  const fetchProducts = async (page = 1, limit = 20, search = searchText) => {
    setProductListLoading(true);
    try {
      const queryParams = new URLSearchParams();

      queryParams.append("page", page);
      queryParams.append("limit", productsPerPage);

      if (search.trim() !== "") {
        queryParams.append("search", search);
      }

      const response = await api.get(
        `/admin/manage-product?${queryParams.toString()}`
      );

      const { products, pagination, message } = response.data;

      if (message === "No Product Found") {
        setProductList([]);
        setPagination({
          currentPage: 1,
          totalPages: 0,
          totalProducts: 0,
          hasMore: false,
        });
      } else {
        const { currentPage, totalPages, totalProducts } = pagination;
        setProductList(products || []);
        setPagination({
          currentPage,
          totalPages,
          totalProducts,
          hasMore: currentPage < totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setProductListLoading(false);
    }
  };

  useEffect(() => {
    // Ban đầu load page 1
    fetchProducts(1);
  }, []);

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchProducts(page); // Gọi fetch luôn
    }
  };

  // Xử lý thêm sản phẩm mới
  const navigateToAddProduct = () => {
    router.push("/admin/manage-product/add-product");
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
        const updatedProducts = [...productList].map((product) => {
          if (product._id === productId) {
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

        setProductList(updatedProducts);

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

  // const [filteredProducts, setFilteredProducts] = useState([]);
  // Thêm state cho modal xóa
  // const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  // const [productToDelete, setProductToDelete] = useState(null);
  // const [deleteLoading, setDeleteLoading] = useState(false);
  // const [products, setProducts] = useState([]);
  //// Các hàm xóa sản phẩm
  // Thêm hàm xử lý xóa sản phẩm
  // const handleDeleteProduct = async () => {
  //   if (!productToDelete) return;

  //   setDeleteLoading(true);
  //   try {
  //     await api.delete(`admin/manage-product/${productToDelete.id}`);

  //     setProducts(
  //       products.filter((product) => product.id !== productToDelete.id)
  //     );
  //     setFilteredProducts(
  //       filteredProducts.filter((product) => product.id !== productToDelete.id)
  //     );

  //     message.success(`Đã xóa sản phẩm "${productToDelete.name}" thành công!`);
  //   } catch (error) {
  //     console.error("Lỗi khi xóa sản phẩm:", error);
  //     message.error("Có lỗi xảy ra khi xóa sản phẩm!");
  //   } finally {
  //     setDeleteLoading(false);
  //     setDeleteModalVisible(false);
  //     setProductToDelete(null);
  //   }
  // };
  // Hàm mở modal xác nhận xóa
  // const showDeleteConfirm = (product) => {
  //   setProductToDelete(product);
  //   setDeleteModalVisible(true);
  // };
  // Hàm đóng modal xác nhận
  // const handleCancelDelete = () => {
  //   setDeleteModalVisible(false);
  //   setProductToDelete(null);
  // };

  // // Tạo helper function để lấy hình ảnh theo type
  // const getImageByType = (images, type) => {
  //   if (!images || !Array.isArray(images)) return null;

  //   const image = images.find((img) => img.type === type);
  //   return image ? image.url : null;
  // };

  return (
    <div className="bg-white shadow-md p-4 w-full min-h-[calc(100vh-70px)] flex flex-col">
      {/* Header và Search */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>

        <div className="flex space-x-4">
          <Button
            type="primary"
            onClick={navigateToAddProduct}
            className="bg-blue-500 hover:bg-blue-600"
            disabled
          >
            Thêm sản phẩm
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
                setPagination((prev) => ({ ...prev, currentPage: 1 }));
                fetchProducts(1);
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
                fetchProducts(1, 20, ""); // Gọi lại fetchData mà không có tìm kiếm
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
          className="bg-blue-500 hover:bg-blue-600 flex"
          onClick={() => {
            setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset về trang 1
            fetchProducts(1); // Gọi API tìm kiếm với trang 1
          }}
        >
          Tìm kiếm
        </Button>
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
              <th className="px-6 py-3 text-left text-sm font-medium text-black tracking-wider bg-gray-200">
                Sản phẩm
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
              <th className="px-6 py-3 text-left text-sm font-medium text-black tracking-wider bg-gray-200">
                Ngày chỉnh sửa
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-black tracking-wider bg-gray-200"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productList.length > 0 ? (
              productList.map((product) => {
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
                  <React.Fragment key={product._id}>
                    {/* Hàng chính của sản phẩm */}
                    <tr className="hover:bg-gray-50 border border-b-0">
                      <td className="px-4 py-2 text-xs text-black align-top w-1/5">
                        <div className="flex items-center space-x-2">
                          <div className="min-w-[50px] min-h-[50px] max-w-[60px] max-h-[60px] relative">
                            {product.mainImage ? (
                              <Image
                                src={product.mainImage}
                                alt={`Hình ${product.slug}`}
                                fill
                                className="object-contain"
                              />
                            ) : (
                              <div className=" flex items-center justify-center w-full h-full py-4">
                                <a
                                  className=" text-gray-500 "
                                  target="_blank"
                                  href={`https://nhanh.vn/product/item/index?name=${product.name}&businessId=200798 `}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                  </svg>
                                </a>
                              </div>
                            )}
                          </div>
                          <span className="font-semibold line-clamp-2">
                            {product.brandID
                              ? `${product.brandID.name} - ${product.name}`
                              : product.name}
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
                            handleToggleAvailable(
                              product._id,
                              product.available
                            )
                          }
                          loading={availableLoading[product._id]}
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
                          <a
                            href={`/admin/manage-product/edit/${product._id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                            target="_blank"
                          >
                            Sửa
                          </a>
                          {/* <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => showDeleteConfirm(product)}
                          >
                            Xóa
                          </button> */}
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
                                  product._id,
                                  variant.available,
                                  true,
                                  variant._id
                                )
                              }
                              loading={
                                availableLoading[
                                  `${product._id}_${variant._id}`
                                ]
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
        <div className="flex justify-end  gap-2 mt-4 text-sm">
          <button
            onClick={() => goToPage(1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Trang đầu
          </button>

          <button
            onClick={() => goToPage(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Trước
          </button>

          {/* Hiển thị một vài số trang gần currentPage */}
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === pagination.totalPages ||
                Math.abs(page - pagination.currentPage) <= 2
            )
            .map((page, idx, arr) => (
              <React.Fragment key={page}>
                {idx > 0 && page - arr[idx - 1] > 1 && (
                  <span className="px-2 items-center flex">...</span>
                )}
                <button
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 px-2 py-1 border rounded ${
                    pagination.currentPage === page ? "bg-black text-white" : ""
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}

          <button
            onClick={() => goToPage(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Sau
          </button>

          <button
            onClick={() => goToPage(pagination.totalPages)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Trang cuối
          </button>
        </div>
      )}

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
      </Modal> */}
    </div>
  );
}

// export default function ManageProduct() {
//   const [productListLoading, setProductListLoading] = useState(false);

//   const fetchProducts = async () => {
//     setProductListLoading(true);
//     try {
//       const response = await api.post("/nhanhvn/product", {
//         data: { page: 1, lcpp: 100 },
//       });

//       console.log(response.data);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setProductListLoading(false);
//     }
//   };

//   return (
//     <div>
//       <button onClick={fetchProducts} disabled={productListLoading}>
//         {productListLoading ? "Đang tải..." : "Tải sản phẩm"}
//       </button>
//     </div>
//   );
// }
