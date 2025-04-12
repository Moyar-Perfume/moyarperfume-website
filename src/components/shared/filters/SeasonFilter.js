import { useFilter } from "@/contexts/FilterContext";
import Image from "next/image";
import { motion } from "framer-motion";

const seasons = [
  { id: 1, name: "Spring", icon: "/element/spring.svg" },
  { id: 2, name: "Summer", icon: "/element/summer.svg" },
  { id: 3, name: "Autumn", icon: "/element/autumn.svg" },
  { id: 4, name: "Winter", icon: "/element/winter.svg" },
];

export default function SeasonFilter() {
  const { selectedSeasons, toggleSeason } = useFilter();

  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex items-center">
        <span className="bg-black px-3 z-20 font-gotu pb-6 text-lg">
          Seasons
        </span>
      </div>
      <ul className="w-[40%] flex flex-col gap-6">
        {seasons.map((season) => {
          const isSelected = selectedSeasons.includes(season.id);

          return (
            <li
              key={season.id}
              onClick={() => toggleSeason(season.id)}
              className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <motion.div
                initial={{ opacity: 0.5, scale: 0.9 }}
                animate={
                  isSelected
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0.5, scale: 0.9 }
                }
                transition={{ duration: 0.3 }}
                className={`p-[6px] border-[1px] rounded-full ${
                  isSelected ? "bg-gray-600" : ""
                }`}
              >
                <div className="relative w-[20px] h-[20px]">
                  <Image
                    src={season.icon}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 40vw"
                    fill
                    alt={`${season.name} season icon`}
                  />
                </div>
              </motion.div>
              <span>{season.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
