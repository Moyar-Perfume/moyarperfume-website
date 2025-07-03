// components/shared/PriceDistributionChart.js

"use client";

import React from "react";
import dynamic from "next/dynamic";

// ApexCharts cần được import động trong Next.js để tránh lỗi SSR
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Hàm xử lý dữ liệu để tạo các "giỏ" phân bổ
// Chia khoảng giá thành các bước nhỏ và đếm số sản phẩm trong mỗi bước
const createDistributionData = (prices, minPrice, maxPrice, steps = 50) => {
  if (maxPrice <= minPrice) {
    return []; // Tránh lỗi khi khoảng giá không hợp lệ
  }

  const binSize = (maxPrice - minPrice) / steps;
  const distribution = [];

  // Thêm điểm bắt đầu để biểu đồ chạm đáy ở hai bên
  distribution.push({ x: minPrice, y: 0 });

  for (let i = 0; i < steps; i++) {
    const binStart = minPrice + i * binSize;
    const binEnd = binStart + binSize;

    const count = prices.filter((p) => p >= binStart && p < binEnd).length;

    const category = Math.round(binStart + binSize / 2);
    distribution.push({ x: category, y: count });
  }

  const lastCount = prices.filter((p) => p === maxPrice).length;
  distribution.push({ x: maxPrice, y: lastCount > 0 ? lastCount : 0 });

  // Thêm điểm kết thúc để biểu đồ chạm đáy
  distribution.push({ x: maxPrice + binSize, y: 0 });

  return distribution;
};

// *** MỚI: Hàm làm mịn dữ liệu để đỉnh đồ thị tròn hơn ***
// Sử dụng thuật toán Trung bình trượt (Simple Moving Average)
const smoothDataWithMovingAverage = (data, windowSize = 5) => {
  // Nếu dữ liệu quá ít hoặc không cần làm mịn, trả về nguyên bản
  if (windowSize < 2 || data.length < windowSize) return data;

  const smoothedData = data.map((point, index, arr) => {
    // Giữ nguyên các điểm neo ở đầu và cuối để biểu đồ chạm đáy
    if (index === 0 || index === arr.length - 1) {
      return point;
    }

    // Xác định "cửa sổ" để lấy trung bình
    const start = Math.max(0, index - Math.floor(windowSize / 2));
    const end = Math.min(arr.length - 1, index + Math.floor(windowSize / 2));

    const windowSlice = arr.slice(start, end + 1);
    const sum = windowSlice.reduce((acc, p) => acc + p.y, 0);
    const average = sum / windowSlice.length;

    return { x: point.x, y: average };
  });

  return smoothedData;
};

const PriceDistributionChart = ({ productPrices, minPrice, maxPrice }) => {
  // Xử lý dữ liệu đầu vào. Lọc ra các giá trị 0 vì chúng thường làm biểu đồ bị lệch
  const filteredPrices = productPrices.filter((p) => p > 0);

  // 1. Tạo dữ liệu phân bổ gốc
  const rawDistribution = createDistributionData(
    filteredPrices,
    minPrice,
    maxPrice,
    50
  );

  // 2. *** ÁP DỤNG HÀM LÀM MỊN MỚI ***
  // Tăng `windowSize` (vd: 7, 9) để biểu đồ càng "tròn" và "bầu" hơn
  const seriesData = smoothDataWithMovingAverage(rawDistribution, 7);

  const options = {
    chart: {
      type: "area",
      height: "100%",
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        top: 3,
        left: 0,
        blur: 4,
        color: "#d1a3ff",
        opacity: 0.35,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2.5,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.8,
        gradientToColors: ["#222222"],
        inverseColors: false,
        opacityFrom: 0.65,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    colors: ["#f9f9f9"],
    tooltip: {
      enabled: true,
      theme: "dark",
      x: {
        show: false,
      },
      y: {
        formatter: (val) => `${Math.round(val)} sản phẩm`,
        title: {
          formatter: () => "Mật độ sản phẩm:",
        },
      },
      marker: {
        show: false,
      },
    },
  };

  const series = [
    {
      name: "Số lượng sản phẩm",
      data: seriesData, // <-- Sử dụng dữ liệu đã được làm mịn
    },
  ];

  return (
    <div style={{ width: "100%", height: "100%", pointerEvents: "none" }}>
      <Chart
        options={options}
        series={series}
        type="area"
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default PriceDistributionChart;
