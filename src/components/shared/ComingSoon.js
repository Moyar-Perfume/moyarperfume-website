export default function ComingSoon() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-floral text-center px-4 relative">
      <div className="w-full max-w-2xl mx-auto py-8 px-6 sm:px-8 md:px-10 bg-white shadow-xl rounded-lg relative overflow-hidden">
        {/* Hoa bouncing */}
        <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mb-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flower animate-bounce w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
            ></div>
          ))}
        </div>

        {/* Tiêu đề */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-gotu">
          Moyar sắp ra mắt rồi nè!
        </h1>

        {/* Mô tả */}
        <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6">
          Hương mới – giao diện mới – cảm xúc mới. 💅💫
        </p>

        {/* Logo nước hoa */}
        <div className="mb-6">
          <img
            src="/logo/logo_no_bg/logo_black_perfume.png"
            alt="Cute Perfume"
            className="mx-auto w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
          />
        </div>

        {/* Link Shopee */}
        <div className="mb-6 flex justify-center">
          <a
            href="https://shopee.vn/moyarperfume"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-medium shadow flex gap-3 items-center hover:bg-floral transition-colors duration-300"
          >
            <img src="/icon/shopee.svg" className="w-5 sm:w-6" alt="Shopee" />
            Ghé Shopee Moyar ngay
          </a>
        </div>

        {/* Footer */}
        <p className="text-xs sm:text-sm text-brown-600">
          © {new Date().getFullYear()} Moyar — Thơm mọi khoảnh khắc!
        </p>
      </div>
    </div>
  );
}
