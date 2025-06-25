"use client";

import React, { useState, useEffect } from "react";
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
  Spin,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import api from "@/constants/apiURL";
import slugify from "slugify";
import { getBase64 } from "@/utils/base64";
import { useEditManageProduct } from "@/hooks/admin/useEditManageProduct";
import { useParams } from "next/navigation";

// Các component con - nếu cần, bạn có thể import từ thư mục add-product
import InfoCard from "../../add-product/InfoCard";
import EditProductImagesCard from "./EditProductImagesCard";
import ProductTagsCard from "../../add-product/ProductTagsCard";
import ViewProductImagesCard from "./ViewProductImagesCard";

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams();
  const {
    editProduct,
    loading: fetchLoading,
    error,
  } = useEditManageProduct({ id });
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [mainImage, setMainImage] = useState("");
  const [descImage, setDescImage] = useState("");
  const [featImage, setFeatImage] = useState("");

  const [product, setProduct] = useState(null);

  // const [mainFileList, setMainFileList] = useState([]);
  // const [descFileList, setDescFileList] = useState([]);
  // const [featureFileList, setFeatureFileList] = useState([]);

  // Thiết lập giá trị form khi editProduct được tải
  useEffect(() => {
    if (editProduct) {
      const editProduct = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/admin/manage-product/${id}`);
          const productData = res.data;
          setProduct(productData);

          // Cập nhật giá trị của selectedTags
          setSelectedTags(productData.tags || []);

          // Chuyển đổi mảng images để phù hợp với Upload component
          setMainImage(productData.mainImage || []);
          setDescImage(productData.subImages[0] || []);
          setFeatImage(productData.subImages[1] || []);

          // Đảm bảo rằng productData.images là một mảng
          // const productImages = Array.isArray(productData.images)
          //   ? productData.images
          //   : [];

          // Phân loại hình ảnh dựa trên type
          // productImages.forEach((img, index) => {
          //   // Xác định typeNumber dựa trên type
          //   const typeNumber =
          //     img.type === "main" ? 1 : img.type === "description" ? 2 : 3;

          //   const fileObj = {
          //     uid: img._id || `-${index}`,
          //     name: `image-${index}.jpg`,
          //     status: "done",
          //     url: img.url,
          //     type: img.type || "main",
          //     _id: img._id,
          //     thumbUrl: img.url,
          //     typeNumber: typeNumber,
          //   };

          //   if (img.type === "description") {
          //     descImages.push(fileObj);
          //   } else if (img.type === "feature") {
          //     featureImages.push(fileObj);
          //   } else {
          //     // Mặc định là main image
          //     mainImages.push(fileObj);
          //   }
          // });

          // Tạo mảng tổng hợp tất cả hình ảnh
          // const allImages = [...mainImage, ...descImage, ...featureImage];

          // Cập nhật state cho các file list
          // setMainFileList(mainImages);
          // setDescFileList(descImages);
          // setFeatureFileList(featureImages);
          // setFileList(allImages);

          // Cập nhật mainImage nếu có ảnh chính
          // if (mainImages.length > 0) {
          //   setMainImage(mainImages[0].url);
          // }

          form.setFieldsValue({
            ...productData,
          });
        } catch (error) {
          console.error("Lỗi tải thông tin sản phẩm:", error);
          message.error("Không thể tải thông tin sản phẩm: " + error.message);
        } finally {
          setLoading(false);
        }
      };
      editProduct();
    }
  }, [editProduct, form, id]);

  // Hiển thị thông báo lỗi nếu có
  useEffect(() => {
    if (error) {
      message.error("Không thể tải thông tin sản phẩm: " + error);
    }
  }, [error]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Lấy dữ liệu từ form
      const values = await form.validateFields();

      // const gioitinh =
      //   values.tags.find((tag) => tag.startsWith("gioitinh_"))?.split("_")[1] ||
      //   "";
      // const nongdoTag =
      //   values.tags.find((tag) => tag.startsWith("nongdo_")) || "";
      // const nongdoMatch = nongdoTag.match(/\((.*?)\)/);
      // const nongdo = nongdoMatch ? nongdoMatch[1] : "";
      // const slug = slugify(`${gioitinh} ${values.name} ${nongdo}`, {
      //   lower: true,
      // });

      // Tạo object data sản phẩm

      const productData = {
        id: id,
        // name: values.name,
        brandID: values.brandID,
        // description: values.description,
        // slug: slug,
        tags: values.tags,
        available: values.available,
        variants: values.variants || [],
        // images: values.images || [],
      };

      // // Xử lý hình ảnh mới (nếu có)
      // if (values.images && values.images.length > 0) {
      //   try {
      //     // Upload lần lượt từng hình ảnh theo thứ tự đã sắp xếp
      //     const imageResults = [];

      //     if (imageResults.length === 0) {
      //       throw new Error("Không thể tải lên bất kỳ hình ảnh nào");
      //     }

      //     // Cập nhật danh sách hình ảnh
      //     productData.images = imageResults;
      //   } catch (uploadError) {
      //     console.error("Lỗi upload:", uploadError);
      //     message.error(
      //       "Có lỗi xảy ra khi tải lên hình ảnh: " +
      //         (uploadError.response?.data?.details || uploadError.message)
      //     );
      //     return;
      //   }
      // }

      // Gọi API cập nhật sản phẩm
      // console.log(values.images);
      // if (values.images && values.images.length > 0) {
      //   try {
      //     const uploadPromises = values.images.map(async (file) => {
      //       const isNew = !!file.originFileObj;
      //       const fileType = file.type || "main";
      //       const typeNumber =
      //         fileType === "main" ? 1 : fileType === "description" ? 2 : 3;

      //       if (isNew) {
      //         const base64 = await getBase64(file.originFileObj);
      //         return {
      //           file: base64,
      //           type: fileType,
      //           typeNumber,
      //         };
      //       } else {
      //         // Trường hợp ảnh cũ, chỉ giữ lại thông tin đã có
      //         return {
      //           url: file.url,
      //           type: fileType,
      //           typeNumber,
      //         };
      //       }
      //     });

      //     const processedImages = await Promise.all(uploadPromises);
      //     const validImages = processedImages.filter((img) => img !== null);

      //     productData.images = validImages;

      //     console.log(
      //       "📦 Hình ảnh sau khi xử lý (ready to upload/send):",
      //       validImages
      //     );
      //   } catch (uploadError) {
      //     console.error("Lỗi xử lý hình ảnh:", uploadError);
      //     message.error(
      //       "Có lỗi xảy ra khi xử lý hình ảnh: " + uploadError.message
      //     );
      //     setLoading(false);
      //     return;
      //   }
      // }

      const updateResponse = await api.put(
        `/admin/manage-product/${id}`,
        productData
      );

      if (updateResponse.status === 200) {
        message.success("Cập nhật sản phẩm thành công!");
        router.push("/admin/manage-product");
      } else {
        throw new Error("Cập nhật sản phẩm không thành công");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      message.error(
        "Có lỗi xảy ra khi cập nhật sản phẩm: " +
          (error.response?.data?.details || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/admin/manage-product");
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-70px)]">
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md p-6 w-full min-h-[calc(100vh-70px)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa sản phẩm</h1>

        <div className="flex justify-end gap-2">
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Cập nhật sản phẩm
          </Button>
          <Button onClick={handleBack}>Quay lại</Button>
        </div>
      </div>

      <div className="product-form">
        <Form form={form} layout="vertical">
          {/* Thông tin cơ bản và Hình ảnh */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* Thông tin cơ bản */}
            <InfoCard form={form} />

            {/* Hình ảnh sản phẩm */}
            {/* <EditProductImagesCard
              form={form}
              initialFileList={fileList}
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
            /> */}

            <ViewProductImagesCard
              form={form}
              mainImage={mainImage}
              descImage={descImage}
              featImage={featImage}
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
          <Card title="Biến thể sản phẩm">
            <Form.List name="variants">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="mb-4">
                      <div className="flex items-center mb-2">
                        <h4 className="text-base font-medium">
                          Biến thể #{name + 1}
                        </h4>
                        {/* {fields.length > 1 && (
                          <MinusCircleOutlined
                            className="ml-2 text-red-500 cursor-pointer"
                            onClick={() => remove(name)}
                          />
                        )} */}
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
                          <Input placeholder="Ví dụ: 50ml, 100ml" readOnly />
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
                            readOnly
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
                            readOnly
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
                      disabled
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
            Cập nhật sản phẩm
          </Button>
        </div>
      </div>
    </div>
  );
}
