import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const router = useRouter();

  // Danh sách menu
  const menuGroups = [
    {
      id: "1",
      label: "Quản Lý Sản Phẩm",
      items: [
        {
          id: "1.1",
          label: "Danh sách sản phẩm",
          path: "/admin/manage-product",
        },
        {
          id: "1.2",
          label: "Thêm sản phẩm",
          path: "/admin/manage-product/add-product",
          disabled: true,
        },
        {
          id: "1.3",
          label: "Thêm hàng loạt",
          path: "/admin/manage-product/bulk-add",
          disabled: true,
        },
        {
          id: "1.4",
          label: "Lấy dữ liệu sản phẩm từ Nhanh.vn",
          path: "/admin/manage-product/nhanhvn-sync",
        },
      ],
    },

    {
      id: "2",
      label: "Quản Lý Brand",
      items: [
        {
          id: "2.1",
          label: "Danh sách brand",
          path: "/admin/manage-brand",
        },
        {
          id: "2.2",
          label: "Thêm brand",
          path: "/admin/manage-brand/add-brand",
        },
      ],
    },
  ];

  const handleItemClick = (path, disabled) => {
    if (disabled) return;
    router.push(path);
  };

  return (
    <aside className="w-[200px] h-screen text-black fixed top-[60px] left-0 z-50 flex flex-col">
      <div className="p-4 h-full overflow-auto border-r-[1px] shadow-md">
        {menuGroups.map((group) => (
          <div key={group.id} className="mb-6 text-sm">
            <h3 className="text-gray-400 font-semibold tracking-wide mb-2">
              {group.label}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li
                  key={item.id}
                  className={`px-3 py-1 flex items-center text-sm 
      ${
        item.disabled
          ? "text-gray-400 cursor-not-allowed"
          : "cursor-pointer hover:underline"
      }`}
                  onClick={() => handleItemClick(item.path, item.disabled)}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
