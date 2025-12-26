import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useMemo, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";

function MenuItems({ closeSheet }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const isListing = location.pathname.includes("listing");
  const activeCategoryFromUrl = searchParams.get("category");

  function handleNavigate(e, getCurrentMenuItem) {
    // ✅ Keep your existing filter behavior
    sessionStorage.removeItem("filters");

    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? { category: [getCurrentMenuItem.id] }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    const isCategory =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search";

    if (isCategory) {
      if (isListing) {
        e.preventDefault();
        setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        );
        closeSheet?.(); // ✅ close mobile sheet after click
        return;
      }

      e.preventDefault();
      navigate(`/shop/listing?category=${getCurrentMenuItem.id}`);
      closeSheet?.(); // ✅ close mobile sheet after click
      return;
    }

    // ✅ Non-category items: let NavLink navigate normally
    // But still close sheet after click.
    closeSheet?.();
  }

  function getIsActive(menuItem, isNavLinkActive) {
    const isCategory =
      menuItem.id !== "home" &&
      menuItem.id !== "products" &&
      menuItem.id !== "search";

    if (isCategory) {
      return isListing && activeCategoryFromUrl === menuItem.id;
    }

    return isNavLinkActive;
  }

  return (
    <nav className="mb-3 flex flex-col gap-6 lg:mb-0 lg:flex-row lg:items-center">
      {shoppingViewHeaderMenuItems.map((menuItem) => {
        const isCategory =
          menuItem.id !== "home" &&
          menuItem.id !== "products" &&
          menuItem.id !== "search";

        const to = isCategory ? "/shop/listing" : menuItem.path;

        return (
          <NavLink
            key={menuItem.id}
            to={to}
            onClick={(e) => handleNavigate(e, menuItem)}
            className={({ isActive }) => {
              const active = getIsActive(menuItem, isActive);

              return [
                // base
                "relative inline-flex w-fit",
                "text-sm font-medium cursor-pointer transition-colors",
                "pb-1", // space for underline
                "text-foreground",

                // underline animation (hover + active)
                "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-primary",
                "after:origin-left after:scale-x-0 after:transition-transform after:duration-500 after:ease-in-out",
                "hover:after:scale-x-100",
                active ? "text-primary after:scale-x-100" : "",
              ]
                .filter(Boolean)
                .join(" ");
            }}
          >
            {menuItem.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderRightContent() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (user?.id) dispatch(fetchCartItems(user.id));
  }, [dispatch, user?.id]);

  const safeCartItems = useMemo(
    () => (Array.isArray(cartItems?.items) ? cartItems.items : []),
    [cartItems?.items]
  );

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button
          className="cursor-pointer"
          variant="outline"
          onClick={() => navigate("/auth/login")}
        >
          Login
        </Button>
        <Button
          className="cursor-pointer"
          onClick={() => navigate("/auth/register")}
        >
          Register
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative cursor-pointer"
            type="button"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute right-[2px] top-[-5px] text-sm font-bold">
              {safeCartItems.length || 0}
            </span>
            <span className="sr-only">User cart</span>
          </Button>
        </SheetTrigger>

        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={safeCartItems}
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black font-extrabold text-white">
              {(user?.userName?.[0] || "U").toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  return (
    <header className="fixed top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <NavLink to="/shop/home" className="flex items-center gap-2">
          <img src="/logo-sellora.webp" alt="logo-image" className="w-14" />
        </NavLink>

        <Sheet open={openMobileMenu} onOpenChange={setOpenMobileMenu}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              type="button"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems closeSheet={() => setOpenMobileMenu(false)} />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>

        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
