import React, { useState, useEffect } from "react";
import { Card, Form, Upload, Divider, Typography, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getBase64 } from "@/utils/base64";

const { Title } = Typography;

const EditProductImagesCard = ({
  form,
  onMainImageChange,
  initialFileList = [],
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // Tạo ba state riêng biệt cho ba loại hình ảnh
  const [mainFileList, setMainFileList] = useState([]);
  const [descFileList, setDescFileList] = useState([]);
  const [featureFileList, setFeatureFileList] = useState([]);

  // Phân loại hình ảnh từ initialFileList khi component được khởi tạo
  useEffect(() => {
    if (initialFileList && initialFileList.length > 0) {
      // Tìm hình ảnh cho từng loại
      const mainImages = initialFileList.filter((file) => file.type === "main");
      const descImages = initialFileList.filter(
        (file) => file.type === "description"
      );
      const featureImages = initialFileList.filter(
        (file) => file.type === "feature"
      );

      // Cập nhật state
      if (mainImages.length > 0) setMainFileList(mainImages);
      if (descImages.length > 0) setDescFileList(descImages);
      if (featureImages.length > 0) setFeatureFileList(featureImages);

      // Cập nhật form
      updateFormImages();

      // Cập nhật main image nếu có
      if (mainImages.length > 0 && onMainImageChange) {
        onMainImageChange(mainImages[0]);
      }
    }
  }, [initialFileList]);

  // Hàm cập nhật form với các hình ảnh hiện tại
  const updateFormImages = () => {
    // Tổng hợp tất cả hình ảnh từ ba loại
    const allImages = [
      ...mainFileList.map((file) => ({ ...file, type: "main", typeNumber: 1 })),
      ...descFileList.map((file) => ({
        ...file,
        type: "description",
        typeNumber: 2,
      })),
      ...featureFileList.map((file) => ({
        ...file,
        type: "feature",
        typeNumber: 3,
      })),
    ];

    // Cập nhật vào form
    form.setFieldsValue({ images: allImages });
  };

  // Cập nhật hình ảnh vào form khi có thay đổi
  useEffect(() => {
    updateFormImages();
  }, [mainFileList, descFileList, featureFileList]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
    setPreviewOpen(true);
  };

  // Xử lý hình ảnh chính
  const handleMainChange = ({ fileList: newFileList }) => {
    const processedFiles = newFileList.map((file) => {
      // Kiểm tra nếu đã có URL từ cloudinary thì giữ nguyên
      if (file.url && file.url.includes("cloudinary")) {
        return {
          ...file,
          type: "main",
          typeNumber: 1,
          status: "done",
          thumbUrl: file.url,
        };
      }

      if (file.originFileObj) {
        const blobUrl = URL.createObjectURL(file.originFileObj);
        file.thumbUrl = blobUrl;
      }

      return { ...file, type: "main", typeNumber: 1, status: "done" };
    });

    setMainFileList(processedFiles);

    if (processedFiles.length > 0 && onMainImageChange) {
      onMainImageChange(processedFiles[0]);
    } else if (processedFiles.length === 0 && onMainImageChange) {
      onMainImageChange(null);
    }
  };

  // Xử lý hình ảnh mô tả
  const handleDescChange = ({ fileList: newFileList }) => {
    const processedFiles = newFileList.map((file) => {
      // Kiểm tra nếu đã có URL từ cloudinary thì giữ nguyên
      if (file.url && file.url.includes("cloudinary")) {
        return {
          ...file,
          type: "description",
          typeNumber: 2,
          status: "done",
          thumbUrl: file.url,
        };
      }

      if (file.originFileObj) {
        const blobUrl = URL.createObjectURL(file.originFileObj);
        file.thumbUrl = blobUrl;
      }

      return { ...file, type: "description", typeNumber: 2, status: "done" };
    });

    setDescFileList(processedFiles);
  };

  // Xử lý hình ảnh đặc điểm
  const handleFeatureChange = ({ fileList: newFileList }) => {
    const processedFiles = newFileList.map((file) => {
      // Kiểm tra nếu đã có URL từ cloudinary thì giữ nguyên
      if (file.url && file.url.includes("cloudinary")) {
        return {
          ...file,
          type: "feature",
          typeNumber: 3,
          status: "done",
          thumbUrl: file.url,
        };
      }

      if (file.originFileObj) {
        const blobUrl = URL.createObjectURL(file.originFileObj);
        file.thumbUrl = blobUrl;
      }

      return { ...file, type: "feature", typeNumber: 3, status: "done" };
    });

    setFeatureFileList(processedFiles);
  };

  // Nút tải lên
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Card title="Hình ảnh sản phẩm" className="mb-6">
        {/* Form field ẩn để lưu trữ tất cả hình ảnh */}
        <Form.Item name="images" hidden>
          <input type="hidden" />
        </Form.Item>

        {/* Phần 1: Hình ảnh sản phẩm chính */}
        <div className="mb-6">
          <Title level={5} className="mb-2">
            Hình ảnh sản phẩm chính
          </Title>
          <div className="mb-1 text-gray-500 text-sm">
            Tải lên hình ảnh sản phẩm chính
          </div>

          <Upload
            listType="picture-card"
            fileList={mainFileList}
            onPreview={handlePreview}
            onChange={handleMainChange}
            maxCount={1}
            customRequest={({ onSuccess }) =>
              setTimeout(() => onSuccess("ok"), 0)
            }
          >
            {mainFileList.length >= 1 ? null : uploadButton}
          </Upload>
        </div>

        <Divider />

        {/* Phần 2: Hình ảnh mô tả */}
        <div className="mb-6">
          <Title level={5} className="mb-2">
            Hình ảnh mô tả
          </Title>
          <div className="mb-1 text-gray-500 text-sm">
            Tải lên hình ảnh mô tả sản phẩm
          </div>

          <Upload
            listType="picture-card"
            fileList={descFileList}
            onPreview={handlePreview}
            onChange={handleDescChange}
            maxCount={1}
            customRequest={({ onSuccess }) =>
              setTimeout(() => onSuccess("ok"), 0)
            }
          >
            {descFileList.length >= 1 ? null : uploadButton}
          </Upload>
        </div>

        <Divider />

        {/* Phần 3: Hình ảnh đặc điểm */}
        <div>
          <Title level={5} className="mb-2">
            Hình ảnh đặc điểm
          </Title>
          <div className="mb-1 text-gray-500 text-sm">
            Tải lên hình ảnh đặc điểm sản phẩm
          </div>

          <Upload
            listType="picture-card"
            fileList={featureFileList}
            onPreview={handlePreview}
            onChange={handleFeatureChange}
            maxCount={1}
            customRequest={({ onSuccess }) =>
              setTimeout(() => onSuccess("ok"), 0)
            }
          >
            {featureFileList.length >= 1 ? null : uploadButton}
          </Upload>
        </div>
      </Card>

      <Image
        wrapperStyle={{ display: "none" }}
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => setPreviewOpen(visible),
          title: previewTitle,
        }}
        src={previewImage}
      />
    </>
  );
};

export default EditProductImagesCard;
