import { getPublicIdFromUrl } from "@/utils/getPublicIdFromUrl";
import cloudinary from "@/libs/cloudinary";

/**
 * Xóa một hình ảnh từ Cloudinary
 * @param {string} url - URL của hình ảnh cần xóa
 * @returns {Promise} Kết quả xóa
 */
export const deleteImage = async (url) => {
  try {
    if (!url) {
      throw new Error("URL không được cung cấp");
    }

    // Lấy public ID từ URL
    const publicId = getPublicIdFromUrl(url);

    if (!publicId) {
      throw new Error("Không thể xác định public ID từ URL");
    }

    console.log("Xóa ảnh với public ID:", publicId);

    // Xóa ảnh từ Cloudinary
    const result = await cloudinary.v2.uploader.destroy(publicId);

    if (result.result !== "ok") {
      throw new Error(`Xóa ảnh không thành công: ${result.result}`);
    }

    return { success: true, message: "Đã xóa ảnh thành công" };
  } catch (error) {
    console.error("Lỗi khi xóa ảnh:", error);
    throw error;
  }
};

/**
 * Xóa nhiều hình ảnh từ Cloudinary
 * @param {string[]} urls - Mảng URL của các hình ảnh cần xóa
 * @returns {Promise} Kết quả xóa
 */
export const deleteMultipleImages = async (urls) => {
  try {
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      throw new Error("Danh sách URL không hợp lệ");
    }

    const results = await Promise.allSettled(
      urls.map((url) => deleteImage(url))
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return {
      success: true,
      message: `Đã xóa thành công ${successful} ảnh, thất bại ${failed} ảnh`,
      results,
    };
  } catch (error) {
    console.error("Lỗi khi xóa nhiều ảnh từ Cloudinary:", error);
    throw error;
  }
};
