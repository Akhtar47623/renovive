import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-home.jpg";

const CTASection = () => {
  return (
    <section className="relative py-24">
      <div className="absolute inset-0">
        <img src={heroImage} alt="" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-primary/80" />
      </div>
      <div className="relative container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
          Did You Ever Wished to Transform Your Current Home?
        </h2>
        <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
          Let our team of experts help you create the home you've always dreamed of. Contact us today for a free consultation.
        </p>
        <Link to="/contact">
          <Button variant="hero" size="lg">Contact Us Today</Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
