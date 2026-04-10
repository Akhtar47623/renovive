import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, LogOut, FolderOpen, TrendingUp, DollarSign, BarChart3, Upload, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  budget: number | null;
  progress: number | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  planning: "bg-blue-100 text-blue-700",
  "in-progress": "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
};

const DashboardPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchProjects = useCallback(async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    setProjects(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async () => {
    if (!newTitle || !user) return;
    const { error } = await supabase.from("projects").insert({
      user_id: user.id,
      title: newTitle,
      description: newDesc || null,
      budget: newBudget ? parseFloat(newBudget) : 0,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Project created!");
      setNewTitle("");
      setNewDesc("");
      setNewBudget("");
      setShowNew(false);
      fetchProjects();
    }
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Project deleted");
      fetchProjects();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, projectId: string) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const path = `${user.id}/${projectId}/${file.name}`;
    const { error } = await supabase.storage.from("project-files").upload(path, file);
    setUploading(false);
    if (error) toast.error(error.message);
    else toast.success("File uploaded!");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const avgProgress = projects.length
    ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-serif text-xl font-bold text-primary-foreground">RENOVIVE</h1>
          <div className="flex items-center gap-3">
            <span className="text-primary-foreground/70 text-sm hidden md:block">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <LogOut size={16} />
              <span className="hidden md:inline ml-1">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Dashboard</h2>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FolderOpen, label: "Total Projects", value: projects.length },
            { icon: TrendingUp, label: "Avg Progress", value: `${avgProgress}%` },
            { icon: DollarSign, label: "Total Budget", value: `$${totalBudget.toLocaleString()}` },
            { icon: BarChart3, label: "Completed", value: projects.filter((p) => p.status === "completed").length },
          ].map((m) => (
            <div key={m.label} className="bg-card rounded-lg border border-border p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <m.icon className="text-accent" size={20} />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">{m.label}</p>
                <p className="text-foreground font-bold text-xl">{m.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* New Project */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg font-semibold text-foreground">Projects</h3>
          <Button variant="hero" size="sm" onClick={() => setShowNew(!showNew)}>
            <Plus size={16} /> New Project
          </Button>
        </div>

        {showNew && (
          <div className="bg-card border border-border rounded-lg p-5 mb-6 space-y-3">
            <Input placeholder="Project title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <Input placeholder="Description" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
            <Input placeholder="Budget" type="number" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} />
            <div className="flex gap-2">
              <Button variant="hero" size="sm" onClick={createProject}>Create</Button>
              <Button variant="outline" size="sm" onClick={() => setShowNew(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Project List */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <FolderOpen className="mx-auto text-muted-foreground mb-3" size={40} />
            <p className="text-muted-foreground">No projects yet. Create your first project!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-card rounded-lg border border-border p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-serif font-semibold text-foreground">{project.title}</h4>
                    {project.description && (
                      <p className="text-muted-foreground text-sm mt-1">{project.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[project.status] || "bg-muted text-muted-foreground"}`}>
                      {project.status}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => deleteProject(project.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                  <span>Budget: ${(project.budget || 0).toLocaleString()}</span>
                  <span>Progress: {project.progress || 0}%</span>
                </div>
                <Progress value={project.progress || 0} className="h-2 mb-3" />
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, project.id)}
                      disabled={uploading}
                    />
                    <span className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
                      <Upload size={14} /> {uploading ? "Uploading..." : "Upload File"}
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
