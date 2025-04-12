"use client";

import { useState, useEffect } from "react";
import Product from "@/components/shared/Product";
import { Carousel, ConfigProvider } from "antd";
import api from "@/constants/apiURL";

const RelatedProducts = ({ brandId, excludeSlug, productId, limit = 5 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slidesToShow, setSlidesToShow] = useState(5);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!brandId) return;

      setLoading(true);
      try {
        // Xây dựng URL với các tham số
        let url = `/product-list?brandId=${brandId}&limit=${limit}`;

        // Thêm tham số productId nếu có
        if (productId) {
          url += `&productId=${productId}`;
        }

        // Thêm tham số exclude nếu có
        if (excludeSlug) {
          url += `&exclude=${excludeSlug}`;
        }

        const response = await api.get(url);
        // Ensure we're getting the products array from the correct location in the response
        const productsData = response.data?.products || response.data || [];
        setProducts(productsData);
        // Cập nhật slidesToShow dựa trên số lượng sản phẩm
        setSlidesToShow(Math.min(5, productsData.length));
      } catch (err) {
        console.error("Error fetching related products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [brandId, excludeSlug, productId, limit]);

  // Cập nhật slidesToShow khi kích thước màn hình thay đổi
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setSlidesToShow(1);
      } else if (width < 1024) {
        setSlidesToShow(Math.min(2, products.length));
      } else if (width < 1280) {
        setSlidesToShow(Math.min(3, products.length));
      } else if (width < 1536) {
        setSlidesToShow(Math.min(4, products.length));
      } else {
        setSlidesToShow(Math.min(5, products.length));
      }
    };

    handleResize(); // Gọi ngay lần đầu
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [products]);

  if (loading) {
    return (
      <div className="mt-8 grid grid-cols-5 gap-6">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div key={`skeleton-${index}`} className="animate-pulse">
              <div className="h-[300px] bg-gray-200 mb-4"></div>
              <div className="h-4 bg-gray-200 mb-2"></div>
              <div className="h-4 bg-gray-200 w-2/3"></div>
            </div>
          ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 mt-4">Error: {error}</div>;
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-gray-500 text-center mt-8">
        Không có sản phẩm liên quan
      </div>
    );
  }

  // Tính số cột của grid dựa trên slidesToShow
  const gridCols = `grid-cols-${slidesToShow}`;

  return (
    <div className="mt-8">
      <ConfigProvider
        theme={{
          components: {
            Carousel: {
              arrowSize: 24,
              arrowOffset: 25,
            },
          },
        }}
      >
        <Carousel
          slidesToShow={slidesToShow}
          slidesToScroll={1}
          dots={false}
          arrows
          autoplay
          autoplaySpeed={3000}
          responsive={[
            {
              breakpoint: 1536,
              settings: {
                slidesToShow: Math.min(4, products.length),
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 1280,
              settings: {
                slidesToShow: Math.min(3, products.length),
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: Math.min(2, products.length),
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 640,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ]}
        >
          {products.map((product) => (
            <div key={product._id} className="px-4">
              <div className="mx-auto" style={{ width: "250px" }}>
                <Product product={product} imageSize="h-[300px]" />
              </div>
            </div>
          ))}
        </Carousel>
      </ConfigProvider>
    </div>
  );
};

export default RelatedProducts;
