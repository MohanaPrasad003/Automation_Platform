
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-automation-border">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <Link
              to="/"
              className="flex items-center space-x-2 text-2xl font-bold text-automation-text mb-4"
            >
              <span className="bg-automation-primary text-white rounded-lg p-1.5">AI</span>
              <span>Promptify</span>
            </Link>
            <p className="text-gray-600 mb-6 max-w-md">
              Simplify automation with AI-powered workflow generation. 
              Turn your natural language descriptions into powerful 
              automated workflows.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" label="Twitter" />
              <SocialLink href="#" label="LinkedIn" />
              <SocialLink href="#" label="GitHub" />
            </div>
          </div>

          <div>
            <h3 className="font-medium text-automation-text mb-4">Product</h3>
            <ul className="space-y-3">
              <FooterLink to="/#features">Features</FooterLink>
              <FooterLink to="/dashboard">Dashboard</FooterLink>
              <FooterLink to="/">Pricing</FooterLink>
              <FooterLink to="/">Integrations</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-automation-text mb-4">Company</h3>
            <ul className="space-y-3">
              <FooterLink to="/">About</FooterLink>
              <FooterLink to="/">Careers</FooterLink>
              <FooterLink to="/">Blog</FooterLink>
              <FooterLink to="/">Contact</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-automation-text mb-4">Legal</h3>
            <ul className="space-y-3">
              <FooterLink to="/">Terms</FooterLink>
              <FooterLink to="/">Privacy</FooterLink>
              <FooterLink to="/">Security</FooterLink>
            </ul>
          </div>
        </div>

        <div className="border-t border-automation-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} AI Promptify. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a 
              href="#" 
              className="text-gray-500 hover:text-automation-primary text-sm"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="text-gray-500 hover:text-automation-primary text-sm"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-gray-500 hover:text-automation-primary text-sm"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
}

const FooterLink = ({ to, children }: FooterLinkProps) => (
  <li>
    <Link
      to={to}
      className="text-gray-600 hover:text-automation-primary transition-colors"
    >
      {children}
    </Link>
  </li>
);

interface SocialLinkProps {
  href: string;
  label: string;
}

const SocialLink = ({ href, label }: SocialLinkProps) => (
  <a
    href={href}
    aria-label={label}
    className="w-10 h-10 rounded-full bg-automation-secondary flex items-center justify-center text-automation-text hover:bg-automation-primary hover:text-white transition-colors"
  >
    <ArrowUpRight className="h-4 w-4" />
  </a>
);

export default Footer;
