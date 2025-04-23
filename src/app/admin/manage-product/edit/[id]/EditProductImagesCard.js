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

  const [mainFileList, setMainFileList] = useState([]);
  const [descFileList, setDescFileList] = useState([]);
  const [featureFileList, setFeatureFileList] = useState([]);

  // Phân loại hình ảnh khi nhận initialFileList
  useEffect(() => {
    if (initialFileList.length > 0) {
      const mainImages = initialFileList.filter((file) => file.type === "main");
      const descImages = initialFileList.filter(
        (file) => file.type === "description"
      );
      const featureImages = initialFileList.filter(
        (file) => file.type === "feature"
      );

      setMainFileList(mainImages);
      setDescFileList(descImages);
      setFeatureFileList(featureImages);

      if (mainImages.length > 0 && onMainImageChange) {
        onMainImageChange(mainImages[0]);
      }
    }
  }, [initialFileList]);

  // Cập nhật toàn bộ ảnh vào form
  useEffect(() => {
    const allImages = [
      ...mainFileList.map((f) => ({ ...f, type: "main", typeNumber: 1 })),
      ...descFileList.map((f) => ({
        ...f,
        type: "description",
        typeNumber: 2,
      })),
      ...featureFileList.map((f) => ({ ...f, type: "feature", typeNumber: 3 })),
    ];
    form.setFieldsValue({ images: allImages });
  }, [mainFileList, descFileList, featureFileList]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(file.name || file.url?.split("/").pop());
    setPreviewOpen(true);
  };

  const processFileList = (files, type, typeNumber) => {
    return files.map((file) => {
      const isCloudinary = file.url?.includes("cloudinary");

      if (!isCloudinary && file.originFileObj) {
        file.thumbUrl = URL.createObjectURL(file.originFileObj);
      }

      return {
        ...file,
        type,
        typeNumber,
        status: "done",
        thumbUrl: file.thumbUrl || file.url,
      };
    });
  };

  const handleChange =
    (type, setter, typeNumber, callback) =>
    ({ fileList }) => {
      const processed = processFileList(fileList, type, typeNumber);
      console.log(`📷 Thay đổi hình ảnh [${type}]:`, processed);
      setter(processed);
      if (callback) callback(processed);
    };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Card title="Hình ảnh sản phẩm" className="mb-6">
        <Form.Item name="images" hidden />

        {/* Hình ảnh chính */}
        <div className="mb-6">
          <Title level={5}>Hình ảnh sản phẩm chính</Title>
          <div className="text-sm text-gray-500 mb-1">
            Tải lên hình ảnh sản phẩm chính
          </div>
          <Upload
            listType="picture-card"
            fileList={mainFileList}
            onPreview={handlePreview}
            onChange={handleChange("main", setMainFileList, 1, (list) => {
              if (onMainImageChange) onMainImageChange(list[0] || null);
            })}
            maxCount={1}
            customRequest={({ onSuccess }) =>
              setTimeout(() => onSuccess("ok"), 0)
            }
          >
            {mainFileList.length >= 1 ? null : uploadButton}
          </Upload>
        </div>

        <Divider />

        {/* Hình ảnh mô tả */}
        <div className="mb-6">
          <Title level={5}>Hình ảnh mô tả</Title>
          <div className="text-sm text-gray-500 mb-1">
            Tải lên hình ảnh mô tả sản phẩm
          </div>
          <Upload
            listType="picture-card"
            fileList={descFileList}
            onPreview={handlePreview}
            onChange={handleChange("description", setDescFileList, 2)}
            maxCount={1}
            customRequest={({ onSuccess }) =>
              setTimeout(() => onSuccess("ok"), 0)
            }
          >
            {descFileList.length >= 1 ? null : uploadButton}
          </Upload>
        </div>

        <Divider />

        {/* Hình ảnh đặc điểm */}
        <div>
          <Title level={5}>Hình ảnh đặc điểm</Title>
          <div className="text-sm text-gray-500 mb-1">
            Tải lên hình ảnh đặc điểm sản phẩm
          </div>
          <Upload
            listType="picture-card"
            fileList={featureFileList}
            onPreview={handlePreview}
            onChange={handleChange("feature", setFeatureFileList, 3)}
            maxCount={1}
            customRequest={({ onSuccess }) =>
              setTimeout(() => onSuccess("ok"), 0)
            }
          >
            {featureFileList.length >= 1 ? null : uploadButton}
          </Upload>
        </div>
      </Card>

      {/* Xem ảnh lớn */}
      <Image
        wrapperStyle={{ display: "none" }}
        preview={{
          visible: previewOpen,
          onVisibleChange: setPreviewOpen,
          title: previewTitle,
        }}
        src={previewImage}
      />
    </>
  );
};

export default EditProductImagesCard;
