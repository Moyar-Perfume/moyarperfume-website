import { useFilter } from "@/contexts/FilterContext";
import Image from "next/image";
import { Carousel, ConfigProvider } from "antd";
import { motion, AnimatePresence } from "framer-motion";

const subScents = [
  { id: 1, name: "Citrus", img: "/scents/sub/citrus.webp", slug: "citrus" },
  { id: 2, name: "Green", img: "/scents/sub/green.webp", slug: "green" },
  { id: 3, name: "Watery", img: "/scents/sub/watery.webp", slug: "watery" },
  {
    id: 4,
    name: "Aromatic Fougere",
    img: "/scents/sub/aromatic-fougere.webp",
    slug: "aromatic-fougere",
  },
  {
    id: 5,
    name: "Aldehydic",
    img: "/scents/sub/aldehyde.webp",
    slug: "aldehydic",
  },
  { id: 6, name: "Floral", img: "/scents/sub/floral.webp", slug: "floral" },
  { id: 7, name: "Fruity", img: "/scents/sub/fruity.webp", slug: "fruity" },
  { id: 8, name: "Spicy", img: "/scents/sub/spicy.webp", slug: "spicy" },
  { id: 9, name: "Chypre", img: "/scents/sub/chypre.webp", slug: "chypre" },
  { id: 10, name: "Tobacco", img: "/scents/sub/tobacco.webp", slug: "tobacco" },
  {
    id: 11,
    name: "Gourmand",
    img: "/scents/sub/gourmand.webp",
    slug: "gourmand",
  },
  {
    id: 12,
    name: "Ambery (Oriental)",
    img: "/scents/sub/ambery.webp",
    slug: "ambery-oriental",
  },
  { id: 13, name: "Leather", img: "/scents/sub/leather.webp", slug: "leather" },
  {
    id: 14,
    name: "Musk Skin",
    img: "/scents/sub/musk-skin.webp",
    slug: "musk-skin",
  },
];

export default function SubScentsFilter() {
  const { selectedScent, selectedSubScents, toggleSubScent } = useFilter();

  return (
    <>
      <AnimatePresence>
        {selectedScent && (
          <>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="overflow-hidden w-[90%] mt-3 "
            >
              <h1 className="font-gotu text-2xl pb-10 pt-14 flex w-[100%] items-center">
                <hr className="w-full" />
                <span className="whitespace-nowrap px-6">
                  Discover Your Scents Note
                </span>
                <hr className="w-full" />
              </h1>

              {/* Hiệu ứng kéo dài dần */}

              <ConfigProvider
                theme={{
                  components: {
                    Carousel: {
                      arrowSize: 24,
                      arrowOffset: 10,
                    },
                  },
                }}
              >
                <Carousel
                  dots={false}
                  slidesToShow={7}
                  arrows
                  centerMode
                  className="custom-carousel"
                >
                  {subScents.map((subScent) => (
                    <div
                      key={subScent.slug}
                      className={`w-[200px] h-[200px] relative group cursor-pointer px-4 hover:scale-105 transition-transform duration-300`}
                      onClick={() => toggleSubScent(subScent.slug)}
                    >
                      <Image
                        src={subScent.img}
                        alt={subScent.slug}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 40vw"
                        className={`object-cover transition-all duration-300 px-4 ${
                          selectedSubScents.includes(subScent.slug)
                            ? "grayscale-0 opacity-100"
                            : "grayscale"
                        }`}
                      />

                      {!selectedSubScents.includes(subScent.slug) && (
                        <div className="absolute inset-0 bg-black opacity-60 group-hover:opacity-0 transition-opacity duration-500"></div>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-white p-2 px-4 whitespace-nowrap bg-black">
                          {subScent.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </Carousel>
              </ConfigProvider>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
