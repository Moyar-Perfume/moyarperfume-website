"use client";

import TextEditor from "@/components/shared/TextEditor";
import { useState } from "react";
import { Image, Upload, Card, Form, Input, Button, message, Spin } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import slugify from "slugify";
import useBrands from "@/hooks/useBrands";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function AddBrand() {
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const { brands, loading: loadingAddBrand, error, createBrand } = useBrands();

  const handleCreateBrand = async () => {
    if (!brandName || !fileList.length) {
      message.error("Vui lòng nhập tên và chọn ảnh!");
      return;
    }

    const file = await getBase64(fileList[0].originFileObj);

    const brandsData = {
      name: brandName,
      logo: file,
      description: description,
      slug: slugify(brandName, { lower: true }),
    };
    try {
      await createBrand(brandsData);

      await message.success("Thêm thương hiệu thành công!");

      setBrandName("");
      setDescription("");
      setFileList([]);
      form.resetFields();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error);
      } else {
        message.error("Có lỗi xảy ra khi thêm thương hiệu!");
        console.error("Lỗi khi gửi request:", error);
      }
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  return (
    <div className="p-4">
      <Card
        title="Thêm thương hiệu mới"
        className="w-full  mx-auto shadow-lg"
        extra={
          <div className="flex gap-2">
            <Button
              type="primary"
              onClick={handleCreateBrand}
              className="bg-blue-500 hover:bg-blue-600"
              loading={loadingAddBrand}
            >
              {loadingAddBrand ? "Đang thêm..." : "Thêm thương hiệu"}
            </Button>
          </div>
        }
      >
        <Spin
          spinning={loadingAddBrand}
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        >
          <Form form={form} layout="vertical" className=" flex gap-6">
            <div className="flex flex-col gap-4 h-full  w-[1000px]">
              <Form.Item
                label="Mô tả thương hiệu"
                tooltip="Thêm mô tả chi tiết về thương hiệu"
              >
                <TextEditor
                  value={description}
                  onChange={setDescription}
                  className="h-full"
                  disabled={loadingAddBrand}
                />
              </Form.Item>
            </div>
            <div className="">
              <Form.Item
                label="Tên thương hiệu"
                required
                tooltip="Nhập tên thương hiệu của bạn"
              >
                <Input
                  placeholder="Nhập tên thương hiệu"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="rounded-md"
                  disabled={loadingAddBrand}
                />
              </Form.Item>

              <Form.Item
                label="Logo thương hiệu"
                required
                tooltip="Tải lên logo của thương hiệu"
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  maxCount={1}
                  className="brand-uploader"
                  disabled={loadingAddBrand}
                >
                  {fileList.length >= 1 ? null : (
                    <div className="flex flex-col items-center justify-center">
                      <PlusOutlined className="text-2xl" />
                      <div className="mt-2">Tải lên</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </div>
          </Form>
        </Spin>

        {previewImage && (
          <Image
            wrapperStyle={{
              display: "none",
            }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </Card>
    </div>
  );
}
