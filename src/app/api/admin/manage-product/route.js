import { connectDB } from "@/libs/mongoDB";
import Brand from "@/models/Brand";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const {
      name,
      brandID,
      description,
      slug,
      tags,
      available,
      variants,
      images,
    } = body;

    // Check if product with same slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json(
        { error: "Sản phẩm với tên tương tự đã tồn tại" },
        { status: 400 }
      );
    }

    // Create new product
    const newProduct = new Product({
      name,
      brandID,
      description,
      slug,
      tags,
      available: available !== undefined ? available : true,
      images: images || [],
      variants,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newProduct.save();

    return NextResponse.json(
      {
        message: "Thêm sản phẩm mới thành công",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Không thể tạo sản phẩm mới", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Return specific product if ID is provided
      const product = await Product.findById(id);
      if (!product) {
        return NextResponse.json(
          { error: "Không tìm thấy sản phẩm" },
          { status: 404 }
        );
      }
      return NextResponse.json(product);
    }

    // Return all products if no ID is provided
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Không thể lấy dữ liệu sản phẩm", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID sản phẩm không được cung cấp" },
        { status: 400 }
      );
    }

    // Update product timestamps
    updateData.updatedAt = new Date();

    // Find and update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Cập nhật sản phẩm thành công",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật sản phẩm", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID sản phẩm không được cung cấp" },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Không thể xóa sản phẩm", details: error.message },
      { status: 500 }
    );
  }
}
