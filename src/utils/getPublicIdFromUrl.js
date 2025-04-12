/**
 * Lấy public_id từ URL Cloudinary
 * @param {string} url - URL của ảnh trên Cloudinary
 * @returns {string|null} - public_id hoặc null nếu không tìm thấy
 */
export const getPublicIdFromUrl = (url) => {
  try {
    if (!url) return null;

    // URL có dạng: https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/folder/filename.extension
    const regex = /\/v\d+\/(.+)$/;
    const match = url.match(regex);

    if (!match) return null;

    // Lấy phần path đầy đủ sau version number
    let publicId = match[1];

    // Loại bỏ phần mở rộng file (.jpg, .png, ...)
    if (publicId.includes(".")) {
      const lastDotIndex = publicId.lastIndexOf(".");
      publicId = publicId.substring(0, lastDotIndex);
    }

    return publicId;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};

/**
 * Lấy public_id từ URL Cloudinary
 * @param {string} url - URL của ảnh trên Cloudinary
 * @returns {string|null} - public_id hoặc null nếu không tìm thấy
 */
export const getPublicIdFolderFromUrl = (url) => {
  try {
    if (!url) return null;

    // URL có dạng: https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/folder/filename.extension
    const regex = /\/v\d+\/(.+)$/;
    const match = url.match(regex);

    if (!match) return null;

    // Lấy phần path đầy đủ sau version number
    let publicId = match[1];

    // Loại bỏ phần mở rộng file (.jpg, .png, ...)
    if (publicId.includes(".")) {
      const lastDotIndex = publicId.lastIndexOf(".");
      publicId = publicId.substring(0, lastDotIndex);
    }

    // Loại bỏ số sau cùng (-1, -2, etc.) nếu có
    const lastDashPattern = /-\d+$/;
    if (lastDashPattern.test(publicId)) {
      publicId = publicId.replace(lastDashPattern, "");
    }

    return publicId;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};
