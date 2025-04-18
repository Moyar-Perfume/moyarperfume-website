export default function Loading() {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    </div>
  );
}
