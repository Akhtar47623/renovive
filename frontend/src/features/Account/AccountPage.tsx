import { useAuth } from "@/contexts/AuthContext";

export default function AccountPage() {
  const { user, role } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-serif text-2xl font-bold text-foreground mb-4">Account</h1>
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="text-sm text-muted-foreground">Email</div>
        <div className="font-medium text-foreground mb-3">{user?.email ?? "-"}</div>
        <div className="text-sm text-muted-foreground">Role</div>
        <div className="font-medium text-foreground">{role ?? "-"}</div>
      </div>
    </div>
  );
}

