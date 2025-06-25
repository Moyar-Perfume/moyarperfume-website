import AdminHeader from "../admin/AdminHeader";
import AdminSidebar from "../admin/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div>
      <AdminSidebar />
      <div className="overflow-hidden">
        <AdminHeader />
        <div className="pt-[60px] pl-[200px]">{children}</div>
      </div>
    </div>
  );
}
