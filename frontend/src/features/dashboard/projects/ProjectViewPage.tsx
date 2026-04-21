import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

type Project = {
  id: string;
  title: string;
  description: string | null;
  budget: number | null;
  status: string;
  progress: number | null;
  createdAt: string;
};

export default function ProjectViewPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    apiFetch<{ project: Project }>(`/projects/me/${encodeURIComponent(id)}`)
      .then((d) => setProject(d.project))
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load project"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-8 text-muted-foreground">Loading...</div>;
  if (!project) return <div className="container mx-auto px-4 py-8 text-muted-foreground">Not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">{project.title}</h1>
        <Button asChild variant="outline" size="sm">
          <Link to={`/dashboard/projects/${encodeURIComponent(project.id)}/edit`}>Edit</Link>
        </Button>
      </div>
      <div className="bg-card border border-border rounded-lg p-5 space-y-3">
        <div>
          <div className="text-sm text-muted-foreground">Description</div>
          <div className="text-foreground">{project.description ?? "-"}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Budget</div>
          <div className="text-foreground">${Number(project.budget ?? 0).toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Status</div>
          <div className="text-foreground">{project.status}</div>
        </div>
      </div>
    </div>
  );
}

