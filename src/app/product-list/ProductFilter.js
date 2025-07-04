import SeasonFilter from "@/components/filters/SeasonFilter";
import ConcentFilter from "@/components/filters/ConcentFilter";
import BrandFilter from "@/components/filters/BrandFilter";
import BudgetFilter from "@/components/filters/BudgetFilter";
import ScentsFilter from "@/components/filters/ScentsFilter";
import SubScentsFilter from "@/components/filters/SubScentsFilter";

export default function ProductFilter() {
  return (
    <section className="flex flex-col items-center w-full bg-black text-white pb-20">
      <h1 className="font-gotu text-4xl py-12">Our Recommendations</h1>
      <div className="w-[80%] flex relative">
        <hr className="absolute mt-[12px] border-white w-full items-start" />
        <BudgetFilter />
        <SeasonFilter />
        <ConcentFilter />
        <BrandFilter />
      </div>

      <h1 className="font-gotu text-3xl pb-10 pt-14 flex w-[80%] items-center">
        <hr className="w-full" />
        <span className="whitespace-nowrap px-6">Find your own Scents</span>
        <hr className="w-full" />
      </h1>

      <div className="w-full flex relative z-20 flex-col items-center">
        <ScentsFilter />
        <SubScentsFilter />
      </div>
    </section>
  );
}
