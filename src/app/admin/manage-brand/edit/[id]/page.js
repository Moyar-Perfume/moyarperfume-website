"use client";

import TextEditor from "@/components/shared/TextEditor";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Image, Upload, Card, Form, Input, Button, message, Spin } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import slugify from "slugify";
import api from "@/constants/apiURL";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function EditBrand() {
  const { id } = useParams();
  const router = useRouter();

  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const { data } = await api.get(`/admin/manage-brand/${id}`);
        setBrandName(data.name);
        setDescription(data.description);
        if (data.logo) {
          setFileList([
            {
              uid: "-1",
              name: "logo.png",
              status: "done",
              url: data.logo,
            },
          ]);
        }
      } catch (err) {
        message.error("Không tìm thấy thương hiệu");
        router.push("/admin/brands");
      }
    };

    fetchBrand();
  }, [id]);

  const handleUpdateBrand = async () => {
    if (!brandName) {
      return message.error("Vui lòng nhập tên thương hiệu!");
    }

    setLoading(true);

    let logo = "";

    if (fileList.length > 0) {
      const file = fileList[0];
      if (file.originFileObj) {
        // Nếu là ảnh mới -> convert sang base64
        logo = await getBase64(file.originFileObj);
      } else if (file.url) {
        // Nếu là ảnh cũ Cloudinary thì giữ nguyên
        logo = file.url;
      }
    }

    const updatedBrand = {
      name: brandName,
      description,
      logo,
      slug: slugify(brandName, { lower: true }),
    };

    try {
      await api.put(`/admin/manage-brand/${id}`, updatedBrand);
      message.success("Cập nhật thương hiệu thành công!");
      router.push("/admin/manage-brand");
    } catch (error) {
      message.error(error?.response?.data?.error || "Lỗi cập nhật thương hiệu");
    } finally {
      setLoading(false);
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
        title="Chỉnh sửa thương hiệu"
        className="w-full mx-auto shadow-lg"
        extra={
          <Button
            type="primary"
            className="bg-blue-500 hover:bg-blue-600"
            loading={loading}
            onClick={handleUpdateBrand}
          >
            {loading ? "Đang cập nhật..." : "Cập nhật thương hiệu"}
          </Button>
        }
      >
        <Spin spinning={loading} indicator={<LoadingOutlined spin />}>
          <Form layout="vertical" form={form} className="flex gap-6">
            <div className="flex flex-col gap-4 w-[1000px]">
              <Form.Item label="Mô tả thương hiệu">
                <TextEditor
                  value={description}
                  onChange={setDescription}
                  disabled={loading}
                />
              </Form.Item>
            </div>

            <div>
              <Form.Item label="Tên thương hiệu" required>
                <Input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item label="Logo thương hiệu">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  maxCount={1}
                  className="brand-uploader"
                  disabled={loading}
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
            wrapperStyle={{ display: "none" }}
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
