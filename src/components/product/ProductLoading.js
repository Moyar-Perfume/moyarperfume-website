export default function ProductLoading() {
  return (
    <div className="p-2 animate-pulse">
      <div className="flex flex-col items-center">
        <div className="bg-gray-200 w-full h-[300px] rounded-sm"></div>
        <div className="mt-5 w-full flex items-center gap-2">
          <div className="h-0.5 bg-gray-200 flex-1"></div>
          <div className="bg-gray-200 h-6 w-24 rounded"></div>
          <div className="h-0.5 bg-gray-200 flex-1"></div>
        </div>
        <div className="bg-gray-200 h-8 w-3/4 mt-2 rounded"></div>
        <div className="w-16 h-0.5 bg-gray-200 my-2"></div>
        <div className="bg-gray-200 w-full h-[150px] rounded-sm mt-2"></div>
      </div>
    </div>
  );
}
