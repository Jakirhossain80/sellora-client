import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpenSidebar(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen w-full">
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        <AdminHeader setOpen={setOpenSidebar} />
        <main className="flex flex-1 flex-col bg-muted/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
