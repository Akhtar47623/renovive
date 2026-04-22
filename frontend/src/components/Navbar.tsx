import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowUpRight } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const showBlur = scrolled || mobileOpen;

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-200",
        showBlur
          ? "bg-primary/20 backdrop-blur-md border-b border-primary-foreground/10"
          : "bg-transparent border-b border-transparent",
      ].join(" ")}
    >
      <div className="w-full flex items-center justify-between h-16 px-4 md:px-[118px]">
        <Link
          to="/"
          className="text-2xl font-bold text-primary-foreground tracking-wider"
        >
          ReNoVIVE
        </Link>

        {/* Desktop right cluster: nav + auth */}
        <div className="hidden md:flex items-center gap-8 ml-auto">
          <nav className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? "text-accent"
                    : "text-primary-foreground/70 hover:text-primary-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="nav" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="rounded-full border border-primary-foreground/25 px-5 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/40"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/login" aria-label="Login">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full border border-primary-foreground/25 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/40"
                  >
                    <ArrowUpRight size={16} />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/10 p-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="block text-sm text-primary-foreground/80 hover:text-primary-foreground py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="nav" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleSignOut();
                    setMobileOpen(false);
                  }}
                  className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button
                      variant="ghost"
                      className="rounded-full border border-primary-foreground/25 px-5 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/40"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/login" aria-label="Login" onClick={() => setMobileOpen(false)}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full border border-primary-foreground/25 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/40"
                    >
                      <ArrowUpRight size={16} />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
