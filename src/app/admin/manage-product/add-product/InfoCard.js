import React from "react";
import { Card, Form, Input, Select, Switch } from "antd";
import TextEditor from "@/components/shared/TextEditor";
import useBrands from "@/hooks/useBrands";

const InfoCard = ({ form }) => {
  const { brands, loading, error } = useBrands();

  const brandOptions =
    brands && brands.length > 0
      ? brands.map((brand) => ({
          label: brand.name,
          value: brand._id,
        }))
      : [];

  const handleBrandChange = (value) => {
    if (form) {
      form.setFieldsValue({ brandID: value });
    }
  };

  return (
    <Card title="Thông tin cơ bản" className=" col-span-3">
      <Form.Item
        name="name"
        label="Tên sản phẩm"
        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
      >
        <Input placeholder="Nhập tên sản phẩm" readOnly />
      </Form.Item>

      <Form.Item
        name="brandID"
        label="Thương hiệu của sản phẩm"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn thương hiệu của sản phẩm!",
          },
        ]}
      >
        {/* <Select
          placeholder="Chọn thương hiệu"
          options={brandOptions}
          loading={loading}
          disabled={true}
          onChange={handleBrandChange}
          showSearch
          optionFilterProp="label"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        /> */}

        <Input placeholder="Thương hiệu của sản phẩm" readOnly />
      </Form.Item>

      <Form.Item
        name="content"
        label="Mô tả sản phẩm"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập mô tả của sản phẩm!",
          },
        ]}
      >
        <TextEditor
          placeholder="Nhập mô tả sản phẩm"
          autoSize={{ minRows: 3, maxRows: 6 }}
        />

        {/* <Input placeholder="Mô tả sản phẩm" readOnly /> */}
      </Form.Item>

      <Form.Item
        name="available"
        label="Trạng thái sản phẩm"
        valuePropName="checked"
        tooltip="Bật/tắt để hiển thị sản phẩm trên website"
      >
        <Switch checkedChildren="Có sẵn" unCheckedChildren="Hết hàng" />
      </Form.Item>
    </Card>
  );
};

export default InfoCard;
