import React, { useState, useEffect } from "react";
import { Card, Form, Upload, Divider, Typography, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getBase64 } from "@/utils/base64";

const { Title } = Typography;

const ViewProductImagesCard = ({ form, mainImage, descImage, featImage }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  return (
    <>
      <Card title="Hình ảnh sản phẩm" className="mb-6">
        <Form.Item hidden />

        {/* Hình ảnh chính */}
        <div className="mb-6">
          <Title level={5}>Hình ảnh sản phẩm chính</Title>

          {mainImage == "" ? (
            <div className="w-full h-[200px] flex items-center justify-center bg-gray-200">
              <p className="text-black">Không có hình ảnh</p>
            </div>
          ) : (
            <Image width={200} src={mainImage} />
          )}
        </div>

        <Divider />

        <div className="mb-6">
          <Title level={5}>Hình ảnh sản phẩm chính</Title>
          {descImage == "" ? (
            <div className="w-full h-[200px] flex items-center justify-center bg-gray-200">
              <p className="text-black">Không có hình ảnh</p>
            </div>
          ) : (
            <Image width={200} src={descImage} />
          )}
        </div>

        <Divider />

        <div className="mb-6">
          <Title level={5}>Hình ảnh sản phẩm chính</Title>
          {featImage == "" ? (
            <div className="w-full h-[200px] flex items-center justify-center bg-gray-200">
              <p className="text-black">Không có hình ảnh</p>
            </div>
          ) : (
            <Image width={200} src={featImage} />
          )}
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

export default ViewProductImagesCard;
