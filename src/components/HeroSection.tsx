import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-home.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Modern renovated home"
          className="w-full h-full object-fill"
          width={1920}
          height={1080}
        />
        <div
          className="absolute inset-0"
          // style={{ background: "var(--hero-overlay)" }}
        />
      </div>
      <div className="relative container mx-auto px-4 pt-16">
        <div className="max-w-2xl animate-fade-in">
          <p className="text-accent font-medium mb-4 tracking-wider uppercase text-sm">
            Premium Renovation Services
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary-foreground leading-tight mb-6">
            Perfect Best Residence That Aligns With Your Lifestyle
          </h1>
          <p className="text-primary-foreground/70 text-lg mb-8 leading-relaxed max-w-lg">
            We transform ordinary spaces into extraordinary living environments
            with our expert renovation and design services.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/contact">
              <Button variant="hero" size="lg">
                Get Started
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="hero-outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
