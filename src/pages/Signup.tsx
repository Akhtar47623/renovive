import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import heroImage from "@/assets/hero-home.jpg";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Account created successfully!");
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:block relative">
        <img src={heroImage} alt="Renovive" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="absolute bottom-10 left-10">
          <h2 className="font-serif text-3xl font-bold text-primary-foreground">RENOVIVE</h2>
          <p className="text-primary-foreground/70 mt-2">Start your renovation journey</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="font-serif text-2xl font-bold text-foreground md:hidden block mb-8">RENOVIVE</Link>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground mb-8">Join Renovive to get started</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
              <Input placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} className="bg-card" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
              <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-card" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
              <Input type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-card" />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Sign Up"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-accent font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
