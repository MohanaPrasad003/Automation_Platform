
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 md:py-5",
        isScrolled
          ? "bg-white bg-opacity-80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-2 text-2xl font-bold text-automation-text"
        >
          <span className="bg-automation-primary text-white rounded-lg p-1.5">AI</span>
          <span>Promptify</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" active={location.pathname === "/"}>
            Home
          </NavLink>
          <NavLink
            to="/#features"
            active={location.hash === "#features"}
          >
            Features
          </NavLink>
          <NavLink to="/dashboard" active={location.pathname === "/dashboard"}>
            Dashboard
          </NavLink>
          <div className="ml-4 flex items-center space-x-3">
            <Link
              to="/auth?mode=login"
              className="text-automation-text font-medium hover:text-automation-primary transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/auth?mode=signup"
              className="bg-automation-primary text-white px-5 py-2 rounded-full font-medium hover:bg-opacity-90 transition-all shadow-sm hover:shadow-md"
            >
              Sign up
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-automation-text p-2 focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-fade-in">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            <MobileNavLink to="/" active={location.pathname === "/"}>
              Home
            </MobileNavLink>
            <MobileNavLink
              to="/#features"
              active={location.hash === "#features"}
            >
              Features
            </MobileNavLink>
            <MobileNavLink to="/dashboard" active={location.pathname === "/dashboard"}>
              Dashboard
            </MobileNavLink>
            <div className="pt-4 flex flex-col space-y-3">
              <Link
                to="/auth?mode=login"
                className="text-automation-text font-medium text-center py-2 border border-automation-border rounded-lg hover:bg-automation-secondary transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/auth?mode=signup"
                className="bg-automation-primary text-white py-2 rounded-lg font-medium text-center hover:bg-opacity-90 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, active, children }: NavLinkProps) => (
  <Link
    to={to}
    className={cn(
      "relative font-medium transition-colors hover:text-automation-primary",
      active ? "text-automation-primary" : "text-automation-text"
    )}
  >
    {children}
    {active && (
      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-automation-primary rounded-full" />
    )}
  </Link>
);

const MobileNavLink = ({ to, active, children }: NavLinkProps) => (
  <Link
    to={to}
    className={cn(
      "py-2 px-4 font-medium rounded-lg transition-colors",
      active
        ? "bg-automation-secondary text-automation-primary"
        : "text-automation-text hover:bg-automation-secondary"
    )}
  >
    {children}
  </Link>
);

export default Navbar;
