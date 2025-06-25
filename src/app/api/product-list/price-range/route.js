// /app/api/filter/price-range/route.js (hoặc tương đương trong /api)

import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongoDB";
import ProductNhanhvn from "@/models/ProductNhanhvn";

export async function GET() {
  await connectDB();

  try {
    const result = await ProductNhanhvn.aggregate([
      { $unwind: "$variants" },
      { $match: { "variants.available": true } },

      {
        $group: {
          _id: null,
          minPrice: { $min: "$variants.price" },
          maxPrice: { $max: "$variants.price" },
        },
      },
    ]);

    if (result.length === 0) {
      return NextResponse.json({ minPrice: 0, maxPrice: 0 });
    }

    const { minPrice, maxPrice } = result[0];
    return NextResponse.json({ minPrice, maxPrice });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
