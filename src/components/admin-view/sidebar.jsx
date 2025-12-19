import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import { Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  { id: "dashboard", label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", path: "/admin/products", icon: ShoppingBasket },
  { id: "orders", label: "Orders", path: "/admin/orders", icon: BadgeCheck },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-8 flex flex-col gap-2">
      {adminSidebarMenuItems.map((menuItem) => {
        const Icon = menuItem.icon;
        const isActive = location.pathname === menuItem.path;

        return (
          <button
            key={menuItem.id}
            type="button"
            onClick={() => {
              navigate(menuItem.path);
              setOpen?.(false); // closes mobile sheet if provided
            }}
            className={[
              "flex items-center gap-2 rounded-md px-3 py-2 text-left",
              "text-muted-foreground hover:bg-muted hover:text-foreground",
              isActive ? "bg-muted text-foreground" : "",
            ].join(" ")}
          >
            <Icon className="h-5 w-5" />
            <span className="text-base">{menuItem.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile sidebar (Sheet) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5 items-center">
                <ChartNoAxesCombined size={30} />
                <h1 className="text-2xl font-extrabold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>

            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <button
          type="button"
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </button>

        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
