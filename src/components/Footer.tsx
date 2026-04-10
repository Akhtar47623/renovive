import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-serif text-2xl font-bold tracking-wider mb-4">RENOVIVE</h3>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Transforming spaces into extraordinary living experiences with expert renovation services.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li>Kitchen Renovation</li>
              <li>Bathroom Remodeling</li>
              <li>Full Home Renovation</li>
              <li>Interior Design</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li>info@renovive.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Renovation St, Suite 100</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm text-primary-foreground/40">
          © {new Date().getFullYear()} Renovive. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
