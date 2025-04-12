import { useFilter } from "@/contexts/FilterContext";
import Image from "next/image";
import { motion } from "framer-motion";

const concentrations = [
  { id: 1, name: "Eau de Cologne (EDC)" },
  { id: 2, name: "Eau de Toilette (EDT)" },
  { id: 3, name: "Eau de Parfum (EDP)" },
  { id: 4, name: "Parfum (Extrait de Parfum)" },
];

export default function Concent() {
  const { selectedConcents, toggleConcent } = useFilter();

  return (
    <div className="w-full items-center flex-col flex">
      <div className="flex items-center">
        <span className="whitespace-nowrap bg-black px-3 z-20 font-gotu pb-6 text-lg">
          Perfume Concentration
        </span>
      </div>
      <ul className="w-[80%] flex flex-col gap-6">
        {concentrations.map((concentration) => {
          const isSelected = selectedConcents.includes(concentration.id);

          return (
            <li
              key={concentration.id}
              onClick={() => toggleConcent(concentration.id)}
              className={`flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity`}
            >
              <motion.div
                animate={
                  isSelected
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0.5, scale: 0.9 }
                }
                transition={{ duration: 0.5 }}
                className={`p-[6px] border-[1px] rounded-full ${
                  isSelected ? "bg-gray-600" : ""
                }`}
              >
                <div className="relative w-[20px] h-[20px]">
                  <Image
                    src="/element/concentration.svg"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 40vw"
                    alt={`${concentration.name} season icon`}
                  />
                </div>
              </motion.div>
              <span>{concentration.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
