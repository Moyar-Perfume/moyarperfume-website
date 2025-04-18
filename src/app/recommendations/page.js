"use client";

import Product from "@/components/shared/Product";
import Button from "@/components/ui/Button";
import api from "@/constants/apiURL";
import { Carousel, ConfigProvider } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Recommendations() {
  const [maleParfum, setMaleParfum] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaleParfum = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.get("/product-list?gioitinh=Nam");
        const data = await res.data;

        setMaleParfum(data.products);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaleParfum();
  }, []);

  return (
    <main>
      <section className="w-full min-h-[calc(100vh-133px)] relative z-20">
        <Image
          src="/banner/banner-category.png"
          fill
          alt="banner-recommend"
          className=" object-cover"
        />
      </section>

      <section className="w-full relative">
        <div className="grid gap-20 px-10">
          <div className=" grid">
            <div className="flex items-start justify-center overflow-hidden">
              <span className="text-5xl font-gotu z-10 py-20">Male Parfum</span>
              <div className="absolute w-full  md:h-[500px] opacity-60 ">
                <Image
                  src="/about/bg-01.png"
                  fill
                  className="object-cover"
                  sizes="100vw"
                  alt="new_bg"
                  priority
                />
              </div>
            </div>
            <div className="w-full flex ">
              <div className="w-1/3 h-[400px] relative">
                <Image
                  src="/recommend/male-parfum.jpg"
                  fill
                  className=" object-cover"
                  alt="Male Parfum Collection"
                />
              </div>
              {/* <div className="w-2/3 relative pl-20">
                <div className="flex flex-col min-h-[500px]">
                  <div className="w-full max-w-[1400px] mx-auto">
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
                        slidesToShow={3}
                        dots={false}
                        arrows
                        autoplay
                        autoplaySpeed={3000}
                        infinite={true}
                        cssEase="linear"
                        centerMode
                      >
                        {maleParfum.map((product) => (
                          <div key={product._id} className="">
                            <div className="flex items-center">
                              <Product
                                product={product}
                                imageSize="h-[200px]"
                              />
                            </div>
                          </div>
                        ))}
                      </Carousel>
                    </ConfigProvider>
                  </div>
                  <div className="flex w-full items-end gap-10 mt-auto">
                    <hr className="w-full border-black" />
                    <Button className="whitespace-nowrap">See more</Button>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
