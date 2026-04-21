import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Project = {
  id: string;
  title: string;
  description: string | null;
  budget: number | null;
};

export default function ProjectEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");

  useEffect(() => {
    if (!id) return;
    apiFetch<{ project: Project }>(`/projects/me/${encodeURIComponent(id)}`)
      .then((d) => {
        setProject(d.project);
        setTitle(d.project.title);
        setDescription(d.project.description ?? "");
        setBudget(String(d.project.budget ?? 0));
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load project"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      await apiFetch(`/projects/me/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() ? description.trim() : null,
          budget: budget ? Number(budget) : 0,
        }),
      });
      toast.success("Project updated");
      navigate(`/dashboard/projects/${encodeURIComponent(id)}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8 text-muted-foreground">Loading...</div>;
  if (!project) return <div className="container mx-auto px-4 py-8 text-muted-foreground">Not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="font-serif text-2xl font-bold text-foreground mb-6">Edit Project</h1>
      <form onSubmit={handleSave} className="space-y-4 bg-card border border-border rounded-lg p-5">
        <div>
          <label className="text-sm text-muted-foreground">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Description</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Budget</label>
          <Input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />
        </div>
        <Button type="submit" variant="hero" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
}

