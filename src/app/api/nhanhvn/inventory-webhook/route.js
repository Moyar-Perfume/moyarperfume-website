import { NextResponse } from "next/server";
import axios from "axios";
import { connectDB } from "@/libs/mongoDB";
import WebhookLog from "@/models/WebhookLog";
import { splitNameAndCapacity } from "@/utils/splitNameAndCapacity";
import ProductNhanhvn from "@/models/ProductNhanhvn";
import slugify from "slugify";

//--------------------------- PUBLIC ENDPOINT ---------------------------//
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("📥 Webhook:", JSON.stringify(body, null, 2));

    // 1️⃣  Lưu log ngay – để có ID dùng sau
    const log = await WebhookLog.create({ data: body });
    const { event } = body;

    // 2️⃣  Trả 200 OK cho Nhanh ngay lập tức
    const resp = NextResponse.json(
      { message: "Webhook received" },
      { status: 200 }
    );

    // 3️⃣  Xử lý hậu trường theo event
    setTimeout(() => dispatchByEvent(event, body, log._id), 0);

    return resp;
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

//--------------------------- DISPATCHER ---------------------------//

async function dispatchByEvent(event, payload, logId) {
  try {
    switch (event) {
      case "productAdd":
        await handleProductAdd(payload);
        break;
      case "productUpdate":
        await handleProductUpdate(payload);
        break;
      case "productDelete":
        await handleProductDelete(payload);
        break;
      default:
        console.warn("⚠️ Event không hỗ trợ:", event);
    }
  } catch (err) {
    console.error(`❌ Lỗi xử lý ${event}:`, err.message);
  } finally {
    // Xoá log sau khi cố gắng xử lý xong (thành công hay thất bại tuỳ bạn)
    await WebhookLog.findByIdAndDelete(logId);
    console.log(`🧹 Đã xoá webhook log ${logId}`);
  }
}

//--------------------------- HANDLERS ---------------------------//

async function handleProductAdd({ data }) {
  const nhanhID = data.productId.toString();
  const name = data.name?.trim();
  const price = data.price || 0;
  const quantity = data.inventories?.remain || 0;
  const nhanhBrandId = data.brandId;

  if (!nhanhID || !name) {
    console.warn("⚠️ Thiếu nhanhID hoặc tên sản phẩm");
    return;
  }

  const { baseName, capacity } = splitNameAndCapacity(name);

  const variantData = {
    nhanhID,
    capacity,
    price,
    quantity,
    available: quantity > 0,
  };

  const slug = slugify(baseName, {
    lower: true,
    strict: true,
    locale: "vi",
  });

  let brandMongoId = null;

  if (nhanhBrandId) {
    const existingBrand = await Brand.findOne({
      nhanhBrandID: nhanhBrandId.toString(),
    });

    if (existingBrand) {
      brandMongoId = existingBrand._id;
    } else {
      try {
        const formData = new URLSearchParams();
        formData.append("accessToken", process.env.ACCESS_TOKEN);
        formData.append("version", process.env.API_VERSION);
        formData.append("appId", process.env.APP_ID);
        formData.append("businessId", process.env.BUSINESS_ID);
        formData.append("data", nhanhID);

        const { data: detailRes } = await axios.post(
          "https://open.nhanh.vn/api/product/detail",
          formData,
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const brandName = detailRes.data?.data?.[nhanhID].brandId;

        if (brandName) {
          const brandSlug = slugify(brandName, {
            lower: true,
            strict: true,
            locale: "vi",
          });

          const newBrand = await Brand.create({
            name: brandName,
            slug: brandSlug,
            nhanhBrandID: nhanhBrandId.toString(),
          });

          brandMongoId = newBrand._id;
          console.log(`🆕 Tạo brand mới: ${brandName}`);
        }
      } catch (err) {
        console.error("❌ Lỗi khi fetch brand từ Nhanh.vn:", err.message);
      }
    }
  }

  // Tìm sản phẩm theo tên chuẩn hóa
  let product = await ProductNhanhvn.findOne({ slug });

  if (!product) {
    // Sản phẩm hoàn toàn mới ⇒ tạo mới
    await ProductNhanhvn.create({
      name: baseName,
      slug,
      brandID: brandMongoId,
      available: true,
      variants: [variantData],
    });
    console.log(`🆕 Tạo mới sản phẩm "${baseName}"`);
    return;
  }

  // Nếu đã có sản phẩm, kiểm tra trùng variant
  const hasVariant = product.variants.some((v) => v.nhanhID === nhanhID);

  if (!hasVariant) {
    product.variants.push(variantData);
    await product.save();
    console.log(`🔗 Thêm variant mới vào "${baseName}"`);
  } else {
    console.log("ℹ️ Variant đã tồn tại – bỏ qua");
  }
}

async function handleProductUpdate({ data }) {
  const nhanhID = data.productId.toString();
  const name = data.name?.trim();
  const price = data.price || 0;
  const quantity = data.inventories?.remain || 0;
  const content = data.content || "";
  const description = data.description || "";

  if (!name) return console.warn("❗ Không có tên sản phẩm trong webhook");

  const { baseName, capacity } = splitNameAndCapacity(name);

  const variantData = {
    nhanhID,
    capacity,
    price,
    quantity,
    available: quantity > 0,
  };

  const slug = slugify(baseName, {
    lower: true,
    strict: true,
    locale: "vi",
  });

  // 1️⃣ Tìm product đang chứa variant
  const oldProduct = await ProductNhanhvn.findOne({
    "variants.nhanhID": nhanhID,
  });

  if (!oldProduct) {
    console.warn("❗ Không tìm thấy sản phẩm chứa variant nhanhID:", nhanhID);
    return;
  }

  // 2️⃣ Nếu tên không đổi ⇒ cập nhật bình thường
  if (oldProduct.name === baseName) {
    const idx = oldProduct.variants.findIndex((v) => v.nhanhID === nhanhID);
    if (idx === -1)
      return console.warn(`⚠️ Không tìm thấy variant nhanhID ${nhanhID}`);

    oldProduct.variants[idx] = {
      ...oldProduct.variants[idx].toObject(),
      ...variantData,
    };

    if (content) oldProduct.content = content;
    if (description) oldProduct.description = description;
    if (data.image) oldProduct.mainImage = data.image;

    if (data.images !== undefined) {
      oldProduct.subImages = data.images === null ? [] : data.images;
    }
    await oldProduct.save();
    console.log(`✅ Cập nhật variant ${nhanhID} trong "${baseName}"`);
    return;
  }

  // 3️⃣ Nếu tên mới khác ⇒ chuyển variant sang product mới
  console.log(`🔁 Đổi baseName: "${oldProduct.name}" → "${baseName}"`);

  // Gỡ variant khỏi product cũ
  oldProduct.variants = oldProduct.variants.filter(
    (v) => v.nhanhID !== nhanhID
  );
  await oldProduct.save();

  // Xoá product cũ nếu rỗng
  if (oldProduct.variants.length === 0) {
    await ProductNhanhvn.deleteOne({ _id: oldProduct._id });
    console.log(`🗑️ Xoá product rỗng "${oldProduct.name}"`);
  }

  // Tìm product mới theo slug
  let newProduct = await ProductNhanhvn.findOne({ slug });
  if (!newProduct) {
    // Nếu chưa có ⇒ tạo mới
    newProduct = await ProductNhanhvn.create({
      name: baseName,
      slug,
      content,
      description,
      available: true,
      variants: [variantData],
    });
    console.log(`🆕 Tạo product mới "${baseName}" và thêm variant ${capacity}`);
  } else {
    // Đã có ⇒ thêm variant
    newProduct.variants.push(variantData);
    await newProduct.save();
    console.log(`🔗 Thêm variant ${capacity} vào product "${baseName}"`);
  }
}

async function handleProductDelete({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("⚠️ Dữ liệu xóa không hợp lệ:", data);
    return;
  }

  const ids = data.map((id) => id.toString());
  console.log(`🗑️ [DELETE] nhanhIDs: ${ids.join(", ")}`);

  const res = await ProductNhanhvn.updateMany(
    {},
    { $pull: { variants: { nhanhID: { $in: ids } } } }
  );
  console.log(`🗑️ Đã gỡ variant khỏi ${res.modifiedCount} sản phẩm`);

  // Xoá product rỗng
  await ProductNhanhvn.deleteMany({ variants: { $size: 0 } });
}
