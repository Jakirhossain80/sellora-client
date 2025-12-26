import { Facebook, Instagram, Linkedin, Twitter, ArrowUpRight } from "lucide-react";
import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";

function Footer() {
  const year = new Date().getFullYear();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const isListing = location.pathname.includes("listing");
  const activeCategoryFromUrl = searchParams.get("category");

  // ✅ Reuse same nav behavior as header MenuItems
  function handleNavigate(e, getCurrentMenuItem) {
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
        setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`));
        return;
      }

      e.preventDefault();
      navigate(`/shop/listing?category=${getCurrentMenuItem.id}`);
      return;
    }

    // ✅ Non-category items: let NavLink navigate normally
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

  // ✅ Keep existing footer sections, but align routes with header/app
  const supportLinks = [
    { label: "FAQ", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ];

  const socialLinks = [
    { label: "Facebook", href: "#", icon: Facebook },
    { label: "Twitter / X", href: "#", icon: Twitter },
    { label: "Instagram", href: "#", icon: Instagram },
    { label: "LinkedIn", href: "#", icon: Linkedin },
  ];

  const authLink = isAuthenticated
    ? { label: "My Account", to: "/shop/account" }
    : { label: "Login / Register", to: "/auth/login" };

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand (reuse same logo as header) */}
          <div className="space-y-4">
            <NavLink to="/shop/home" className="inline-flex items-center gap-2">
              <img src="/logo-sellora.webp" alt="logo-image" className="w-12" />
            </NavLink>

            <p className="text-sm text-muted-foreground leading-6">
              Sellora is your modern e-commerce destination for trending products, great deals,
              and a smooth shopping experience.
            </p>
          </div>

          {/* Quick Links (reuse same menu items + behavior as header) */}
          <nav aria-label="Quick links" className="space-y-4">
            <h2 className="text-sm font-semibold">Quick Links</h2>

            <ul className="space-y-3 text-sm">
              {shoppingViewHeaderMenuItems.map((menuItem) => {
                const isCategory =
                  menuItem.id !== "home" &&
                  menuItem.id !== "products" &&
                  menuItem.id !== "search";

                const to = isCategory ? "/shop/listing" : menuItem.path;

                return (
                  <li key={menuItem.id}>
                    <NavLink
                      to={to}
                      onClick={(e) => handleNavigate(e, menuItem)}
                      className={({ isActive }) => {
                        const active = getIsActive(menuItem, isActive);

                        return [
                          "group inline-flex items-center gap-1",
                          "text-muted-foreground hover:text-foreground transition-colors",
                          active ? "text-primary" : "",
                        ]
                          .filter(Boolean)
                          .join(" ");
                      }}
                    >
                      {menuItem.label}
                      <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </NavLink>
                  </li>
                );
              })}

              {/* Auth link aligned with app routes */}
              <li>
                <NavLink
                  to={authLink.to}
                  className="group inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {authLink.label}
                  <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Customer Support */}
          <nav aria-label="Customer support links" className="space-y-4">
            <h2 className="text-sm font-semibold">Customer Support</h2>
            <ul className="space-y-3 text-sm">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <NavLink
                    to={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold">Follow Us</h2>
            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>

            <p className="text-sm text-muted-foreground leading-6">
              Stay connected for updates, new arrivals, and exclusive offers.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t pt-6">
          <div className="flex flex-col gap-3 text-center text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:text-left">
            <p>© {year} Sellora. All rights reserved.</p>
            <p>Built for a clean, fast, and modern shopping experience.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
