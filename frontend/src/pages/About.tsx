import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/contact.png";
import agent1 from "@/assets/agent1.png";
import agent2 from "@/assets/agent2.png";
import agent3 from "@/assets/agent3.png";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  "Quality craftsmanship in every project",
  "Transparent pricing with no hidden fees",
  "On-time project delivery",
  "Sustainable and eco-friendly materials",
];

const team = [
  {
    image: agent1,
    name: "James Mitchell",
    role: "Senior Architect",
    bio: "15+ years transforming residential spaces.",
  },
  {
    image: agent2,
    name: "Sarah Rodriguez",
    role: "Interior Designer",
    bio: "Specializes in modern luxury interiors.",
  },
  {
    image: agent3,
    name: "David Chen",
    role: "Project Manager",
    bio: "Expert at delivering projects on time.",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[950px] flex items-center">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="About Renovive"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/70" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-8 pt-16">
          <h1 className="text-display-lg font-semibold tracking-[-0.02em] text-white mb-3">
            About Us
          </h1>
          <nav className="flex items-center gap-1.5 text-white/60 text-text-md leading-[150%] tracking-[0em] font-normal">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
            <span className="text-white/40">›</span>
            <span className="text-white/80">About Us</span>
          </nav>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-accent font-medium text-sm uppercase tracking-wider mb-2">
              Our Mission
            </p>
            <h2 className="text-display-lg font-semibold tracking-[-0.02em] text-foreground mb-4">
              We Are on a Mission to Change Your View of Renovation
            </h2>
            <p className="text-muted-foreground text-text-md leading-[150%] tracking-[0em] font-normal mb-6">
              At Renovive, we believe every space has untapped potential. Our
              team of skilled architects, designers, and craftsmen work together
              to create spaces that inspire and delight.
            </p>
            <ul className="space-y-3">
              {values.map((v) => (
                <li
                  key={v}
                  className="flex items-center gap-3 text-foreground text-text-md leading-[150%] tracking-[0em] font-normal"
                >
                  <CheckCircle className="text-accent shrink-0" size={18} />
                  {v}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg overflow-hidden">
            <img
              src={heroImage}
              alt="Our work"
              loading="lazy"
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-accent font-medium text-sm uppercase tracking-wider mb-2">
              Our Team
            </p>
            <h2 className="text-display-lg font-semibold tracking-[-0.02em] text-foreground">
              Meet the Experts
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((m) => (
              <div
                key={m.name}
                className="bg-card rounded-lg overflow-hidden border border-border"
              >
                <img
                  src={m.image}
                  alt={m.name}
                  loading="lazy"
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="text-display-xs leading-[132%] tracking-[-0.02em] font-semibold text-foreground">
                    {m.name}
                  </h3>
                  <p className="text-accent text-text-md leading-[150%] tracking-[0em] font-normal">
                    {m.role}
                  </p>
                  <p className="text-muted-foreground text-text-xs leading-[150%] tracking-[0em] font-normal mt-1">
                    {m.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
