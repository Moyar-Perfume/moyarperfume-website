import * as XLSX from "xlsx";
import slugify from "slugify";

import { connectDB } from "@/libs/mongoDB";
import Product from "@/models/Product";
import Brand from "@/models/Brand";
import { NextResponse } from "next/server";

// Tăng thời gian timeout cho API route này
export const maxDuration = 300; // 300 seconds = 5 phút, tăng lên tùy theo nhu cầu

// Function to get brandID from name or create new if not exists
async function getBrandIdByName(name) {
  if (!name) {
    // Create a default brand if no name is provided
    const defaultBrandName = "Default Brand";
    let defaultBrand = await Brand.findOne({ name: defaultBrandName });

    if (!defaultBrand) {
      defaultBrand = await Brand.create({
        name: defaultBrandName,
        slug: slugify(defaultBrandName, { lower: true }),
        logo: "/logo/logo_bg/logo_black.png",
        description: "Default brand for products without a specified brand",
      });
    }

    return defaultBrand._id;
  }

  const brandName = name.trim();
  const brandSlug = slugify(brandName, { lower: true });

  let brand = await Brand.findOne({ name: brandName });

  if (!brand) {
    brand = await Brand.create({
      name: brandName,
      slug: brandSlug,
      logo: "/logo/logo_bg/logo_black.png",
      description: "",
    });
  }

  return brand._id;
}

// Validate Excel structure
function validateExcelStructure(sheet) {
  if (!sheet || sheet.length === 0) {
    return { valid: false, error: "File Excel không có dữ liệu" };
  }

  const requiredColumns = [
    "Tên sản phẩm",
    "Giá trị thuộc tính",
    "Giá",
    "Số lượng",
  ];
  const firstRow = sheet[0];

  for (const column of requiredColumns) {
    if (!(column in firstRow)) {
      return { valid: false, error: `Thiếu cột "${column}" trong file Excel` };
    }
  }

  return { valid: true };
}

export async function POST(request) {
  try {
    // Set a longer timeout for the MongoDB connection
    await connectDB();

    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get("file");

    // Lấy danh sách tags cần thiết từ formData
    const requiredTagsJson = formData.get("requiredTags");
    const requiredTags = requiredTagsJson ? JSON.parse(requiredTagsJson) : [];

    if (!file) {
      return NextResponse.json(
        { error: "Không tìm thấy file" },
        { status: 400 }
      );
    }

    // Check if it's a File object
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File không hợp lệ" }, { status: 400 });
    }

    // Check file extension
    const fileName = file.name;
    const fileExtension = fileName.split(".").pop().toLowerCase();
    if (!["xlsx", "xls"].includes(fileExtension)) {
      return NextResponse.json(
        {
          error:
            "File không đúng định dạng. Vui lòng tải lên file Excel (.xlsx, .xls)",
        },
        { status: 400 }
      );
    }

    console.log("Processing file:", fileName);

    // Read the file directly from memory
    const bytes = await file.arrayBuffer();

    // Parse the Excel file in memory
    const workbook = XLSX.read(new Uint8Array(bytes), { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log(`Parsed Excel file with ${sheet.length} rows`);

    // Validate Excel structure
    const validation = validateExcelStructure(sheet);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const groupedProducts = [];
    let currentProduct = null;
    let rowIndex = 0;
    let skippedProducts = 0;

    for (const row of sheet) {
      rowIndex++;
      const productName = row["Tên sản phẩm"];

      // Validate price is a valid number
      const priceValue = row["Giá"];
      // Handle Vietnamese number format (1.000.000)
      const cleanPrice = priceValue.toString().replace(/\./g, "");
      const price = Number(cleanPrice);

      if (isNaN(price)) {
        return NextResponse.json(
          {
            error: `Giá không hợp lệ ở dòng ${rowIndex}: "${priceValue}". Vui lòng nhập một số hợp lệ.`,
          },
          { status: 400 }
        );
      }

      // Validate quantity is a valid number
      const quantityValue = row["Số lượng"];
      // Handle Vietnamese number format for quantity as well
      const cleanQuantity = quantityValue.toString().replace(/\./g, "");
      const quantity = Number(cleanQuantity);

      if (isNaN(quantity)) {
        return NextResponse.json(
          {
            error: `Số lượng không hợp lệ ở dòng ${rowIndex}: "${quantityValue}". Vui lòng nhập một số hợp lệ.`,
          },
          { status: 400 }
        );
      }

      // Prepare variant
      const variant = {
        capacity: row["Giá trị thuộc tính"],
        price: price,
        quantity: quantity,
        available: row["Hiển thị"]?.toString().toLowerCase() !== "false",
      };

      if (productName && productName.trim() !== "") {
        // If there's an old product → push to list
        if (currentProduct) {
          groupedProducts.push(currentProduct);
        }

        const brandID = await getBrandIdByName(row["Nhà cung cấp"]);

        // Create a slug
        const productSlug = slugify(productName, { lower: true });

        // Check if product with this slug already exists
        const slugExists = await Product.findOne({ slug: productSlug });
        if (slugExists) {
          // Skip this product and continue with the next one
          console.log(
            `Skipping duplicate product: ${productName} (slug: ${productSlug})`
          );
          skippedProducts++;
          currentProduct = null;
          continue;
        }

        currentProduct = {
          name: productName,
          slug: productSlug,
          description: row["Nội dung"] || "",
          // Lọc tags để chỉ giữ lại các tags có tiền tố thuộc danh sách requiredTags
          tags: row["Tags"]
            ? row["Tags"]
                .split(",")
                .map((t) => t.trim())
                .filter((tag) => {
                  // Kiểm tra xem tag có bắt đầu bằng một trong các tiền tố trong requiredTags không
                  return requiredTags.some((prefix) => tag.startsWith(prefix));
                })
            : [],
          brandID,
          available: row["Hiển thị"]?.toString().toLowerCase() !== "false",
          images: [], // Can add images if available
          variants: [variant],
        };
      } else if (currentProduct) {
        currentProduct.variants.push(variant);
      }
    }

    // Push the last product
    if (currentProduct) {
      groupedProducts.push(currentProduct);
    }

    if (groupedProducts.length === 0) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm nào để import" },
        { status: 400 }
      );
    }

    console.log(
      `Prepared ${groupedProducts.length} products for import, skipped ${skippedProducts} duplicates`
    );

    // Add to MongoDB in smaller batches to avoid timeouts
    const batchSize = 5; // Reduced batch size for reliability
    let importedCount = 0;

    // Function to handle importing batches with retries
    const importBatchWithRetry = async (batch, retryCount = 0) => {
      try {
        // Kiểm tra trùng lặp trong batch hiện tại
        const uniqueBatch = [];
        const duplicateSlugs = [];

        for (const product of batch) {
          // Kiểm tra xem sản phẩm đã tồn tại trong DB chưa
          const existingProduct = await Product.findOne({ slug: product.slug });

          if (existingProduct) {
            console.log(
              `Skipping duplicate product in batch: ${product.name} (slug: ${product.slug})`
            );
            duplicateSlugs.push(product.slug);
            skippedProducts++;
          } else {
            uniqueBatch.push(product);
          }
        }

        // Nếu không có sản phẩm nào trong batch là duy nhất, bỏ qua batch này
        if (uniqueBatch.length === 0) {
          console.log(`Skipping entire batch - all products are duplicates`);
          return;
        }

        // Chỉ thêm các sản phẩm không trùng lặp
        await Product.insertMany(uniqueBatch);
        importedCount += uniqueBatch.length;
        console.log(
          `Successfully imported ${uniqueBatch.length} products. Total so far: ${importedCount}/${groupedProducts.length}`
        );
      } catch (error) {
        // Retry logic - up to 3 retries
        if (retryCount < 3) {
          console.log(`Retrying batch import (attempt ${retryCount + 1})...`);
          // Wait a bit before retrying
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return importBatchWithRetry(batch, retryCount + 1);
        } else {
          throw error; // Throw if all retries failed
        }
      }
    };

    try {
      // Process batches with some delay between them to avoid overwhelming the server
      for (let i = 0; i < groupedProducts.length; i += batchSize) {
        const batch = groupedProducts.slice(i, i + batchSize);

        // Add a small delay between batches to prevent connection issues
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        await importBatchWithRetry(batch);

        console.log(
          `Imported batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(
            groupedProducts.length / batchSize
          )}`
        );
      }
    } catch (error) {
      // If some products were imported before the error, return partial success
      if (importedCount > 0) {
        return NextResponse.json(
          {
            message: "Import một phần thành công",
            count: importedCount,
            skipped: skippedProducts,
            error: `Có lỗi xảy ra sau khi import ${importedCount}/${groupedProducts.length} sản phẩm: ${error.message}`,
          },
          { status: 207 } // 207 Multi-Status
        );
      } else {
        throw error; // Re-throw to be caught by the outer catch block
      }
    }

    return NextResponse.json(
      {
        message: "Import thành công",
        count: groupedProducts.length,
        skipped: skippedProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Import error:", error);

    // Provide more detailed error information
    let errorMessage = "Lỗi khi xử lý dữ liệu";
    let errorDetails = error.message;

    if (error.code === "ECONNRESET") {
      errorMessage =
        "Kết nối bị ngắt. Vui lòng thử lại hoặc chia nhỏ file Excel.";
    } else if (error.code === "ETIMEDOUT") {
      errorMessage =
        "Yêu cầu quá thời gian xử lý. Vui lòng chia nhỏ file Excel.";
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}
