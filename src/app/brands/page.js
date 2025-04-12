"use client";
import { useRef } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

const brands = [
  { id: 1, name: "Amouage", logo: "/brands/amouage.png" },
  { id: 2, name: "Acqua di Parma", logo: "/brands/acquadiparma.png" },
  { id: 3, name: "Burberry", logo: "/brands/burberry.png" },
  { id: 4, name: "Bond No.9", logo: "/brands/bondno9.png" },
  { id: 5, name: "Byredo", logo: "/brands/byredo.png" },
  { id: 6, name: "Creed", logo: "/brands/creed.png" },
  { id: 7, name: "Clive Christian", logo: "/brands/clivechristian.png" },
  { id: 8, name: "Cartier", logo: "/brands/cartier.png" },
  { id: 9, name: "Chanel", logo: "/brands/chanel.png" },
  { id: 10, name: "Dior", logo: "/brands/dior.png" },
  { id: 11, name: "Dolce & Gabbana", logo: "/brands/dolcegabbana.png" },
  { id: 12, name: "Diptyque", logo: "/brands/diptyque.png" },
  { id: 13, name: "Etat Libre d’Orange", logo: "/brands/etatlibre.png" },
  { id: 14, name: "Ermenegildo Zegna", logo: "/brands/ermenegildozegna.png" },
  { id: 15, name: "Frederic Malle", logo: "/brands/fredericmalle.png" },
  { id: 16, name: "Floris", logo: "/brands/floris.png" },
  { id: 17, name: "Guerlain", logo: "/brands/guerlain.png" },
  { id: 18, name: "Gucci", logo: "/brands/gucci.png" },
  { id: 19, name: "Givenchy", logo: "/brands/givenchy.png" },
  { id: 20, name: "Hermès", logo: "/brands/hermes.png" },
  { id: 21, name: "Hugo Boss", logo: "/brands/hugoboss.png" },
  {
    id: 22,
    name: "Histoires de Parfums",
    logo: "/brands/histoiresdeparfums.png",
  },
  { id: 23, name: "Issey Miyake", logo: "/brands/isseymiyake.png" },
  { id: 24, name: "Initio Parfums", logo: "/brands/initio.png" },
  { id: 25, name: "Jo Malone", logo: "/brands/jomalone.png" },
  { id: 26, name: "Juliette Has a Gun", logo: "/brands/juliettehasagun.png" },
  { id: 27, name: "Kenzo", logo: "/brands/kenzo.png" },
  { id: 28, name: "Killian", logo: "/brands/killian.png" },
  { id: 29, name: "Lacoste", logo: "/brands/lacoste.png" },
  { id: 30, name: "Le Labo", logo: "/brands/lelabo.png" },
  { id: 31, name: "Maison Francis Kurkdjian", logo: "/brands/mfk.png" },
  { id: 32, name: "Montale", logo: "/brands/montale.png" },
  { id: 33, name: "Mancera", logo: "/brands/mancera.png" },
  { id: 34, name: "Narciso Rodriguez", logo: "/brands/narciso.png" },
  { id: 35, name: "Nasomatto", logo: "/brands/nasomatto.png" },
  { id: 36, name: "Ormonde Jayne", logo: "/brands/ormondejayne.png" },
  { id: 37, name: "Parfums de Marly", logo: "/brands/parfumsdemarly.png" },
  { id: 38, name: "Paco Rabanne", logo: "/brands/pacorabanne.png" },
  { id: 39, name: "Penhaligon's", logo: "/brands/penhaligons.png" },
  { id: 40, name: "Quintessence", logo: "/brands/quintessence.png" },
  { id: 41, name: "Ralph Lauren", logo: "/brands/ralphlauren.png" },
  { id: 42, name: "Roja Parfums", logo: "/brands/roja.png" },
  { id: 43, name: "Serge Lutens", logo: "/brands/sergelutens.png" },
  {
    id: 44,
    name: "Salvatore Ferragamo",
    logo: "/brands/salvatoreferragamo.png",
  },
  { id: 45, name: "Tom Ford", logo: "/brands/tomford.png" },
  { id: 46, name: "Trussardi", logo: "/brands/trussardi.png" },
  { id: 47, name: "Unum", logo: "/brands/unum.png" },
  { id: 48, name: "Valentino", logo: "/brands/valentino.png" },
  { id: 49, name: "Versace", logo: "/brands/versace.png" },
  { id: 50, name: "Viktor & Rolf", logo: "/brands/viktorrolf.png" },
  { id: 51, name: "Widian", logo: "/brands/widian.png" },
  { id: 52, name: "Xerjoff", logo: "/brands/xerjoff.png" },
  { id: 53, name: "Yves Saint Laurent", logo: "/brands/ysl.png" },
  { id: 54, name: "Zoologist", logo: "/brands/zoologist.png" },
  { id: 55, name: "Zegna", logo: "/brands/zegna.png" },
];
export default function BrandPage() {
  const sectionRef = useRef(null);

  const handleScrollToSection = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const groupedBrands = brands.reduce((acc, brand) => {
    const firstLetter = brand.name[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(brand);
    return acc;
  }, {});

  const groups = [
    { title: "A-C", letters: ["A", "B", "C"], image: "/brand/brand-01.jpg" },
    { title: "D-F", letters: ["D", "E", "F"], image: "/brand/brand-02.jpg" },
    { title: "G-I", letters: ["G", "H", "I"], image: "/brand/brand-03.jpg" },
    { title: "J-L", letters: ["J", "K", "L"], image: "/brand/brand-04.jpg" },
    { title: "M-O", letters: ["M", "N", "O"], image: "/brand/brand-05.jpg" },
    { title: "P-R", letters: ["P", "Q", "R"], image: "/brand/brand-06.jpg" },
    { title: "S-U", letters: ["S", "T", "U"], image: "/brand/brand-07.jpg" },
    { title: "V-X", letters: ["V", "W", "X"], image: "/brand/brand-08.jpg" },
    { title: "Y-Z", letters: ["Y", "Z"], image: "/brand/brand-09.jpg" },
  ];

  return (
    <main>
      {/* Banner Section */}
      <section className="bg-black w-full flex items-center justify-center min-h-[calc(100vh-132px)] relative">
        <p className="absolute inset-0 z-20 text-white flex items-center justify-center text-2xl font-gotu text-center flex-col gap-4">
          Discover a world of captivating aromas designed to leave a lasting
          impression,
          <br />
          carefully curated to match your personal style and preferences.
          <Button onClick={handleScrollToSection}>Choose Your Brand</Button>
        </p>
        <div className="absolute inset-0 bg-black opacity-80 z-10"></div>
        <div className="w-[90%] h-[600px] relative">
          <Image
            src="/brand/brand-banner.png"
            fill
            className="object-cover"
            alt="brand-banner"
          />
        </div>
      </section>

      {/* Brand List Section */}
      <section ref={sectionRef} className="min-h-screen w-full">
        {groups.map((group, index) => {
          const brandsInGroup = group.letters.flatMap(
            (letter) => groupedBrands[letter] || []
          );

          if (brandsInGroup.length === 0) return null;

          return (
            <div key={index} className=" items-start p-10 px-24 w-full">
              {index % 2 === 0 ? (
                <div className="  border-b-[1px] border-black w-full grid grid-cols-2 pb-20">
                  {/* Ảnh bên trái */}
                  <div className="w-full h-full relative col-span-1">
                    <Image
                      src={group.image}
                      fill
                      className="object-cover"
                      alt={group.title}
                    />
                  </div>

                  {/* Danh sách bên phải */}
                  <div className="grid grid-cols-3 gap-4 p-4">
                    {group.letters.map(
                      (letter) =>
                        groupedBrands[letter] && (
                          <div
                            key={letter}
                            className="col-span-1 flex flex-col items-center h-full  p-4"
                          >
                            <span className="text-4xl font-gotu pb-2">
                              {letter}
                            </span>
                            <ul className="mt-2 space-y-1 flex flex-col items-center">
                              {groupedBrands[letter].map((brand) => (
                                <li
                                  key={brand.id}
                                  className="text-lg hover:underline cursor-pointer"
                                >
                                  {brand.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                    )}
                  </div>
                </div>
              ) : (
                <div className="  border-b-[1px] border-black w-full grid grid-cols-2 pb-20">
                  {/* Danh sách bên trái */}
                  <div className="grid grid-cols-3 gap-4 p-4">
                    {group.letters.map(
                      (letter) =>
                        groupedBrands[letter] && (
                          <div
                            key={letter}
                            className="col-span-1 flex flex-col items-center h-full p-4"
                          >
                            <span className="text-4xl font-gotu pb-2">
                              {letter}
                            </span>
                            <ul className="mt-2 space-y-1 flex flex-col items-center">
                              {groupedBrands[letter].map((brand) => (
                                <li
                                  key={brand.id}
                                  className="text-lg hover:underline cursor-pointer"
                                >
                                  {brand.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                    )}
                  </div>

                  {/* Ảnh bên phải */}
                  <div className="w-full h-full relative col-span-1">
                    <Image
                      src={group.image}
                      fill
                      className="object-cover"
                      alt={group.title}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}
