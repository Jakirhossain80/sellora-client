import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  ArrowUpRight,
} from "lucide-react";

function Footer() {
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "#" },
    { label: "Shop", href: "#" },
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Login / Register", href: "#" },
  ];

  const supportLinks = [
    { label: "FAQ", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms & Conditions", href: "#" },
  ];

  const socialLinks = [
    { label: "Facebook", href: "#", icon: Facebook },
    { label: "Twitter / X", href: "#", icon: Twitter },
    { label: "Instagram", href: "#", icon: Instagram },
    { label: "LinkedIn", href: "#", icon: Linkedin },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <a href="#" className="inline-flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight">
                Sellora
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                Store
              </span>
            </a>
            <p className="text-sm text-muted-foreground leading-6">
              Sellora is your modern e-commerce destination for trending
              products, great deals, and a smooth shopping experience.
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links" className="space-y-4">
            <h2 className="text-sm font-semibold">Quick Links</h2>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="group inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                    <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Customer Support */}
          <nav aria-label="Customer support links" className="space-y-4">
            <h2 className="text-sm font-semibold">Customer Support</h2>
            <ul className="space-y-3 text-sm">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
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
            <p>
              Built for a clean, fast, and modern shopping experience.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
