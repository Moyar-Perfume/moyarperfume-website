export const parseColorInput = (
  value,
  setShadowValues,
  form,
  setSelectedTags,
  message,
  addTag = false
) => {
  // Kiểm tra định dạng RGB: rgb(R, G, B)
  const rgbRegex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/i;
  // Kiểm tra định dạng R, G, B
  const numbersRegex = /^(\d+),\s*(\d+),\s*(\d+)$/;
  // Kiểm tra định dạng HEX: #RRGGBB hoặc RRGGBB
  const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  // Kiểm tra định dạng HEX rút gọn: #RGB hoặc RGB
  const shortHexRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

  let r, g, b;
  let match;

  // Thử phân tích theo định dạng RGB
  match = value.match(rgbRegex);
  if (match) {
    r = parseInt(match[1], 10);
    g = parseInt(match[2], 10);
    b = parseInt(match[3], 10);
  }
  // Thử phân tích theo định dạng R, G, B
  else if ((match = value.match(numbersRegex))) {
    r = parseInt(match[1], 10);
    g = parseInt(match[2], 10);
    b = parseInt(match[3], 10);
  }
  // Thử phân tích theo định dạng HEX
  else if ((match = value.match(hexRegex))) {
    r = parseInt(match[1], 16);
    g = parseInt(match[2], 16);
    b = parseInt(match[3], 16);
  }
  // Thử phân tích theo định dạng HEX rút gọn
  else if ((match = value.match(shortHexRegex))) {
    r = parseInt(match[1] + match[1], 16);
    g = parseInt(match[2] + match[2], 16);
    b = parseInt(match[3] + match[3], 16);
  }

  // Nếu phân tích thành công
  if (r !== undefined && g !== undefined && b !== undefined) {
    // Kiểm tra phạm vi hợp lệ
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      // Cập nhật state (giữ nguyên inputValue)
      if (setShadowValues) {
        setShadowValues((prevState) => ({
          ...prevState,
          r,
          g,
          b,
        }));
      }

      // Nếu yêu cầu thêm tag
      if (addTag && form && setSelectedTags && message) {
        // Kiểm tra xem đã có tag shadow nào chưa
        const currentTags = form.getFieldValue("tags") || [];
        const existingShadowTag = currentTags.find((tag) =>
          tag.startsWith("shadow_")
        );

        if (existingShadowTag) {
          message.warning(
            "Bạn chỉ được phép thêm 1 màu. Vui lòng xóa màu hiện tại trước khi thêm màu mới!"
          );
          return false;
        }

        const tagValue = `shadow_${r} ${g} ${b}`;

        if (!currentTags.includes(tagValue)) {
          // Thêm vào form
          const newTags = [...currentTags, tagValue];
          form.setFieldsValue({ tags: newTags });
          setSelectedTags(newTags);
          message.success("Đã thêm màu mới");

          // Nếu thêm tag thành công thì mới xóa giá trị input
          setShadowValues((prevState) => ({
            ...prevState,
            inputValue: "",
          }));
        } else {
          message.warning("Màu này đã được thêm!");
        }
      }

      return true;
    } else {
      if (addTag && message) {
        message.error("Giá trị RGB phải nằm trong khoảng 0-255");
      }
    }
  } else if (addTag && message) {
    message.error(
      "Định dạng không hợp lệ. Sử dụng: rgb(R,G,B) hoặc #RRGGBB hoặc R,G,B"
    );
  }

  return false;
};
