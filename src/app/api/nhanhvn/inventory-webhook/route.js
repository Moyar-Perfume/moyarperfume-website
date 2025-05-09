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
  const nhanhID = data.productId?.toString();
  const name = data.name?.trim();
  const price = data.price || 0;
  const quantity = data.inventories?.remain || 0;

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
    strict: true, // Loại bỏ ký tự đặc biệt
    locale: "vi", // Hỗ trợ tiếng Việt
  });

  // Tìm sản phẩm theo tên chuẩn hóa
  let product = await ProductNhanhvn.findOne({ slug });

  if (!product) {
    // Sản phẩm hoàn toàn mới ⇒ tạo mới
    await ProductNhanhvn.create({
      name: baseName,
      slug,
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
    strict: true, // Loại bỏ ký tự đặc biệt
    locale: "vi", // Hỗ trợ tiếng Việt
  });

  const product = await ProductNhanhvn.findOne({
    "variants.nhanhID": nhanhID,
  });

  if (!product) {
    console.warn("❗ Không tìm thấy sản phẩm chứa variant nhanhID:", nhanhID);
    return;
  }

  // Cập nhật tên sản phẩm nếu khác
  if (product.name !== baseName) {
    console.log(`🔁 Đổi tên: "${product.name}" → "${baseName}"`);
    product.name = baseName;
    product.slug = slug;
  }

  // Cập nhật variant cụ thể
  const idx = product.variants.findIndex((v) => v.nhanhID === nhanhID);
  if (idx === -1) {
    console.warn(`⚠️ Không tìm thấy variant nhanhID ${nhanhID}`);
    return;
  }

  product.variants[idx] = {
    ...product.variants[idx].toObject(),
    ...variantData,
  };

  await product.save();
  console.log(`✅ Đã cập nhật variant ${nhanhID} cho sản phẩm "${baseName}"`);
}

async function handleProductDelete({ data }) {
  const id = data.productId;
  console.log(`🗑️ [DELETE] nhanhID ${id}`);

  // Gỡ variant khỏi mọi product
  const res = await ProductNhanhvn.updateMany(
    {},
    { $pull: { variants: { nhanhID: id.toString() } } }
  );
  console.log(`🗑️ Đã gỡ variant khỏi ${res.modifiedCount} sản phẩm`);

  // Xoá product rỗng (không còn variants)
  await ProductNhanhvn.deleteMany({ variants: { $size: 0 } });
}
