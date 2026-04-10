import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ContactPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! We'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative h-[40vh] flex items-center bg-primary">
        <div className="container mx-auto px-4 pt-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground">
            Contact Us
          </h1>
          <p className="text-primary-foreground/70 mt-4 max-w-lg text-lg">
            Let's start a conversation about your renovation project.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
              Get in Touch
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="First Name" required className="bg-card" />
                <Input placeholder="Last Name" required className="bg-card" />
              </div>
              <Input
                type="email"
                placeholder="Email"
                required
                className="bg-card"
              />
              <Input type="tel" placeholder="Phone" className="bg-card" />
              <Textarea
                placeholder="Tell us about your project..."
                rows={5}
                required
                className="bg-card"
              />
              <Button type="submit" variant="hero" size="lg" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
          <div className="space-y-8">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
              Contact Information
            </h2>
            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email", value: "info@renovive.com" },
                { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
                {
                  icon: MapPin,
                  label: "Address",
                  value: "123 Renovation St, Suite 100, New York, NY 10001",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <item.icon className="text-accent" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {item.label}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
