import React, { useState, useEffect } from "react";
import { Card, Form, Upload, Divider, Typography, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getBase64 } from "@/utils/base64";

const { Title } = Typography;

const AddProductImagesCard = ({ form, onMainImageChange }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // Tạo ba state riêng biệt cho ba loại hình ảnh
  const [mainFileList, setMainFileList] = useState([]);
  const [descFileList, setDescFileList] = useState([]);
  const [featureFileList, setFeatureFileList] = useState([]);

  const updateFormImages = () => {
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

    form.setFieldsValue({ images: allImages });
  };

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

  // Xử lý hình ảnh sản phẩm chính
  const handleMainChange = ({ fileList: newFileList }) => {
    const processedFiles = newFileList.map((file) => {
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
            Hình ảnh sản phẩm chính <span className="text-red-500">*</span>
          </Title>
          <div className="mb-1 text-gray-500 text-sm">Bắt buộc phải có</div>

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
            Hình ảnh mô tả <span className="text-red-500">*</span>
          </Title>
          <div className="mb-1 text-gray-500 text-sm">Bắt buộc phải có</div>

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
            Hình ảnh đặc điểm <span className="text-red-500">*</span>
          </Title>
          <div className="mb-1 text-gray-500 text-sm">Bắt buộc phải có</div>

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

// Export mặc định và export có tên
export default AddProductImagesCard;
