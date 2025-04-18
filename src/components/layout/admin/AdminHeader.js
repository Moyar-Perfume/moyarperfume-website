import { Dropdown, Space } from "antd";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const AdminHeader = () => {
  const router = useRouter();

  const handleLogout = async () => {
    router.push("/admin/login");
    await signOut({ redirect: false });
  };

  const items = [
    {
      key: "logout",
      label: "Đăng xuất",
      onClick: handleLogout,
      icon: (
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <main className="w-full bg-white h-[60px] shadow flex justify-between items-center fixed z-50">
      <div>
        {/* <div className="w-[150px] h-[100px] relative">
          <Image
            src="/logo/logo_no_bg/logo_black.png"
            fill
            className="object-cover"
          />
        </div> */}
      </div>

      <Dropdown
        menu={{
          items,
        }}
      >
        <a onClick={(e) => e.preventDefault()} className="h-full">
          <Space className="cursor-pointer p-2 px-4 hover:bg-gray-200 h-full">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
            <div className="text-sm">Tài khoản Admin</div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </Space>
        </a>
      </Dropdown>
    </main>
  );
};

export default AdminHeader;
