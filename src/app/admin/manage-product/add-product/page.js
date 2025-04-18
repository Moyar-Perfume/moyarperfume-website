"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  Input,
  Button,
  message,
  Switch,
  Card,
  InputNumber,
  Divider,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import api from "@/constants/apiURL";
import slugify from "slugify";
import InfoCard from "./InfoCard";
import AddProductImagesCard from "./AddProductImagesCard";
import ProductTagsCard from "./ProductTagsCard";

import { getBase64 } from "@/utils/base64";

export default function AddProduct() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [mainImage, setMainImage] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Lấy dữ liệu từ form
      const values = await form.validateFields();

      // Kiểm tra có đủ hình ảnh không
      if (!values.images || values.images.length < 3) {
        message.error(
          "Bạn phải tải lên đủ 3 loại hình ảnh: chính, mô tả, và đặc điểm"
        );
        setLoading(false);
        return;
      }

      // Kiểm tra cụ thể từng loại hình ảnh
      const hasMainImage = values.images.some((img) => img.type === "main");
      const hasDescImage = values.images.some(
        (img) => img.type === "description"
      );
      const hasFeatureImage = values.images.some(
        (img) => img.type === "feature"
      );

      if (!hasMainImage || !hasDescImage || !hasFeatureImage) {
        let errorMsg = "Thiếu hình ảnh bắt buộc: ";

        if (!hasMainImage) errorMsg += "hình ảnh chính, ";
        if (!hasDescImage) errorMsg += "hình ảnh mô tả, ";
        if (!hasFeatureImage) errorMsg += "hình ảnh đặc điểm, ";

        errorMsg = errorMsg.slice(0, -2); // Loại bỏ dấu phẩy và khoảng trắng cuối cùng
        message.error(errorMsg);
        setLoading(false);
        return;
      }

      const gioitinh =
        values.tags.find((tag) => tag.startsWith("gioitinh_"))?.split("_")[1] ||
        "";

      const nongdoTag =
        values.tags.find((tag) => tag.startsWith("nongdo_")) || "";
      const nongdoMatch = nongdoTag.match(/\((.*?)\)/);
      const nongdo = nongdoMatch ? nongdoMatch[1] : "";

      const slug = slugify(`${gioitinh} ${values.name} ${nongdo}`, {
        lower: true,
      });

      // Tạo object data sản phẩm
      const productData = {
        name: values.name,
        brandID: values.brandID,
        description: values.description,
        slug: slug,
        tags: values.tags,
        available: values.available,
        variants: values.variants || [],
        images: [],
      };

      // Xử lý hình ảnh
      if (values.images && values.images.length > 0) {
        try {
          // Tạo mảng promises cho việc convert và upload
          const uploadPromises = values.images.map(async (file) => {
            // Kiểm tra nếu đã có URL cloudinary (hình ảnh hiện có từ server)
            if (
              typeof file === "object" &&
              file.url &&
              file.url.includes("cloudinary")
            ) {
              // Giữ nguyên hình ảnh hiện có
              const typeNumber =
                file.type === "main" ? 1 : file.type === "description" ? 2 : 3;
              return {
                url: file.url,
                type: file.type || "main",
                typeNumber: file.typeNumber || typeNumber, // Sử dụng typeNumber từ file hoặc tính toán từ type
                _id: file._id, // Giữ nguyên _id nếu có
              };
            }

            // Lấy file object và type
            const fileObj = file.originFileObj;
            const fileType = file.type || "main";
            const typeNumber =
              fileType === "main" ? 1 : fileType === "description" ? 2 : 3;

            if (!fileObj) {
              console.error("Missing originFileObj in file:", file);
              return null;
            }

            try {
              // Convert file to base64
              const base64 = await getBase64(fileObj);

              // Upload dùng API
              const uploadResponse = await api.post(
                "/admin/manage-image/product-img",
                {
                  file: base64,
                  slug: slug,
                  typeNumber: typeNumber, // Truyền typeNumber vào request API
                }
              );

              // Trả về đối tượng với URL và type
              return {
                url: uploadResponse.data,
                type: fileType,
                typeNumber: typeNumber, // Luôn dùng typeNumber đã tính toán
              };
            } catch (error) {
              console.error(`Lỗi khi tải lên hình ảnh ${fileType}:`, error);
              return null;
            }
          });

          // Chờ tất cả các promises hoàn thành
          const uploadedImages = await Promise.all(uploadPromises);

          // Lọc ra các URL hợp lệ
          const validImages = uploadedImages.filter((img) => img !== null);

          console.log("Valid images after upload:", validImages);

          productData.images = validImages;
        } catch (uploadError) {
          console.error("Lỗi upload:", uploadError);
          message.error(
            "Có lỗi xảy ra khi tải lên hình ảnh: " + uploadError.message
          );
          setLoading(false);
          return;
        }
      } else {
        message.error("Vui lòng tải lên ít nhất một hình ảnh!");
        setLoading(false);
        return;
      }

      const createProductResponse = await api.post(
        "/admin/manage-product",
        productData
      );

      if (createProductResponse.status === 201) {
        message.success("Thêm sản phẩm thành công!");
        form.resetFields();
        setSelectedTags([]);
        router.push("/admin/manage-product");
      } else {
        throw new Error("Tạo sản phẩm không thành công");
      }
    } catch (error) {
      console.error("Lỗi response:", error.response?.data);
      message.error(
        "Có lỗi xảy ra khi thêm sản phẩm: " +
          (error.response?.data?.details || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/admin/manage-product");
  };

  return (
    <div className="bg-white shadow-md p-6 w-full min-h-[calc(100vh-70px)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Thêm sản phẩm mới</h1>
        <Button onClick={handleBack}>Quay lại</Button>
      </div>

      <div className="product-form">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            available: true,
            variants: [
              { capacity: "", price: 0, quantity: 0, available: true },
            ],
            images: [],
          }}
        >
          {/* Form field ẩn để lưu trữ tất cả hình ảnh */}
          <Form.Item name="images" hidden>
            <Input />
          </Form.Item>

          {/* Thông tin cơ bản và Hình ảnh */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Thông tin cơ bản */}
            <InfoCard form={form} />

            {/* Hình ảnh sản phẩm */}
            <AddProductImagesCard
              form={form}
              onMainImageChange={(file) => {
                if (file && file.url) {
                  // Sử dụng URL trực tiếp nếu có
                  setMainImage(file.url);
                } else if (file && file.originFileObj) {
                  // Chuyển đổi File object thành URL để hiển thị
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setMainImage(e.target.result);
                  };
                  reader.readAsDataURL(file.originFileObj);
                } else {
                  setMainImage("");
                }
              }}
            />
          </div>

          {/* Tags sản phẩm */}
          <ProductTagsCard
            form={form}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            mainImageUrl={mainImage}
          />

          {/* Biến thể sản phẩm */}
          <Card title="Biến thể sản phẩm" className="my-6">
            <Form.List name="variants">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="mb-4">
                      <div className="flex items-center mb-2">
                        <h4 className="text-base font-medium">
                          Biến thể #{name + 1}
                        </h4>
                        {fields.length > 1 && (
                          <MinusCircleOutlined
                            className="ml-2 text-red-500 cursor-pointer"
                            onClick={() => remove(name)}
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Form.Item
                          {...restField}
                          name={[name, "capacity"]}
                          label="Dung tích"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập dung tích!",
                            },
                          ]}
                        >
                          <Input placeholder="Ví dụ: 50ml, 100ml" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "price"]}
                          label="Giá"
                          rules={[
                            { required: true, message: "Vui lòng nhập giá!" },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            placeholder="Giá"
                            style={{ width: "100%" }}
                            formatter={(value) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "quantity"]}
                          label="Số lượng"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập số lượng!",
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            placeholder="Số lượng"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "available"]}
                          label="Trạng thái biến thể"
                          valuePropName="checked"
                        >
                          <Switch
                            checkedChildren="Có sẵn"
                            unCheckedChildren="Hết hàng"
                          />
                        </Form.Item>
                      </div>
                      {fields.length > 1 && <Divider />}
                    </div>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm biến thể
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        </Form>

        {/* Nút submit - tách khỏi Form để tránh auto submit */}
        <div className="flex justify-end">
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Thêm sản phẩm
          </Button>
        </div>
      </div>
    </div>
  );
}
