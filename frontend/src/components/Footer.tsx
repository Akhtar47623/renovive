import heroBg from "@/assets/hero-home.png";
const Footer = () => {
  const navLinks = ["About Us", "Properties", "Agents", "Blog", "Contact Us"];
  const socialLinks = ["Facebook", "Instagram", "LinkedIn"];
  return (
    <footer className="bg-background  overflow-hidden">
      <div className="relative rounded-3xl overflow-hidden min-h-[540px] flex flex-col justify-end bg-neutral-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />

        <div className="absolute top-0 left-0 right-0 px-10 pt-8 z-10 pointer-events-none select-none">
          <span className="text-white/90 font-light tracking-[0.12em] text-[clamp(56px,11vw,110px)] leading-none">
            RENOVIVE
          </span>
        </div>

        <div className="relative z-10 mx-6 mb-6 bg-white rounded-2xl px-7 py-4 flex items-center justify-between flex-wrap gap-4">
          <nav className="flex items-center flex-wrap gap-x-5">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-foreground/85 hover:text-foreground transition-colors"
              >
                {link}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            {socialLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-foreground/85 hover:text-foreground transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="relative z-10 mx-6 pb-1 flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs text-white/50">
            ©2026 Renovive. All rights are reserved
          </span>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
