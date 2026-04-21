import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiFetch, apiFetchForm } from "@/lib/api";
import { ArrowLeft } from "lucide-react";

type PhotoItem = { file: File; url: string };
type EstimateLine = { item: string; quantityLabel: string; unitCost: number; total: number };
type Proposal = {
  lines: EstimateLine[];
  materialSubtotal: number;
  labor: number;
  contingency: number;
  totalInvestment: number;
  totalWeeks: number;
  workingDays: number;
  completionDateISO: string;
  schedule: { title: string; startISO: string; endISO: string; days: number; dependsOn?: string }[];
};

type DesignOption = {
  title: string;
  styleTag: string;
  marketRange: string;
  aiEstimate: string;
  notes: string;
};

type DesignConcept = {
  title: string;
  styleTag: string;
  summary: string;
  visualizationPrompt: string;
  keyUpgrades: string[];
};

export default function ProjectCreatePage() {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [squareFt, setSquareFt] = useState("");
  const [bedroom, setBedroom] = useState("");
  const [bathroom, setBathroom] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [roomType, setRoomType] = useState("");
  const [budgetLevel, setBudgetLevel] = useState("");
  const [designStyle, setDesignStyle] = useState("");
  const [scope, setScope] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [fullMode, setFullMode] = useState(false);
  const [designOptions, setDesignOptions] = useState<DesignOption[]>([]);
  const [designOptionsLoading, setDesignOptionsLoading] = useState(false);
  const [designConcepts, setDesignConcepts] = useState<DesignConcept[]>([]);
  const [designConceptsLoading, setDesignConceptsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<number | null>(null);

  // 3 screens/steps:
  // 1) Browse form
  // 2) Investment analysis (AI design generated)
  // 3) Final proposal/export (full proposal generated)
  const stepIndex = fullMode ? 3 : proposal ? 2 : 1;
  const stepPct = stepIndex === 1 ? 33 : stepIndex === 2 ? 66 : 100;

  const steps = ["Browse / Upload property", "Investment analysis", "Final proposal / Export"];

  const downloadProposal = () => {
    if (!proposal) return;
    const safe = (s: unknown) => String(s ?? "").replace(/[<>]/g, "");
    const money = (n: number) => `$${Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    const today = new Date().toISOString().slice(0, 10);

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Renovation Proposal</title>
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;margin:24px;color:#111}
    .row{display:flex;gap:16px;flex-wrap:wrap}
    .card{border:1px solid #E8E5DF;border-radius:16px;padding:16px;min-width:260px;flex:1}
    h1{margin:0 0 4px 0;font-size:20px}
    .muted{color:#7A7870;font-size:12px}
    table{width:100%;border-collapse:collapse;margin-top:8px}
    th,td{border-top:1px solid #E8E5DF;padding:8px;font-size:12px;text-align:left}
    th{background:#FAFAFA;color:#7A7870;font-weight:600;border-top:none}
    td.r, th.r{text-align:right}
    .pill{display:inline-block;background:#111;color:#fff;padding:6px 10px;border-radius:999px;font-size:12px}
  </style>
</head>
<body>
  <div class="row" style="justify-content:space-between;align-items:center">
    <div>
      <h1>Renovation Proposal</h1>
      <div class="muted">Generated ${today}</div>
    </div>
    <div class="pill">ReNoVIVE</div>
  </div>

  <div class="row" style="margin-top:16px">
    <div class="card">
      <div style="font-weight:700;font-size:12px;margin-bottom:8px">Property Details</div>
      <div class="muted">Address</div><div style="font-weight:600">${safe(address) || "-"}</div>
      <div style="height:10px"></div>
      <div class="muted">Budget Level</div><div style="font-weight:600">${safe(budgetLevel) || "-"}</div>
    </div>
    <div class="card">
      <div style="font-weight:700;font-size:12px;margin-bottom:8px">Investment Summary</div>
      <div class="muted">Total Investment</div><div style="font-weight:700;color:#7C3AED">${money(proposal.totalInvestment)}</div>
      <div style="height:10px"></div>
      <div class="muted">Material Subtotal</div><div style="font-weight:600">${money(proposal.materialSubtotal)}</div>
    </div>
  </div>

  <div class="card" style="margin-top:16px">
    <div style="font-weight:700;font-size:12px;margin-bottom:8px">Budget Breakdown</div>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th class="r">Unit Cost</th>
          <th class="r">Total</th>
        </tr>
      </thead>
      <tbody>
        ${proposal.lines
          .map(
            (l) => `<tr>
          <td>${safe(l.item)}</td>
          <td>${safe(l.quantityLabel)}</td>
          <td class="r">$${Number(l.unitCost).toFixed(2)}</td>
          <td class="r">${money(l.total)}</td>
        </tr>`
          )
          .join("")}
      </tbody>
    </table>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
      <div class="muted">Completion Date</div>
      <div style="font-weight:700">${safe(proposal.completionDateISO)}</div>
    </div>
  </div>

  <div class="card" style="margin-top:16px">
    <div style="font-weight:700;font-size:12px;margin-bottom:8px">Project Timeline</div>
    <div class="muted">Total Duration</div>
    <div style="font-weight:700">${safe(proposal.totalWeeks)} weeks (${safe(proposal.workingDays)} working days)</div>
    <div style="height:10px"></div>
    ${proposal.schedule
      .map(
        (t) => `<div style="margin:8px 0">
      <div style="font-weight:600">${safe(t.title)} <span class="muted">(${t.days} days)</span></div>
      <div class="muted">${safe(t.startISO)} → ${safe(t.endISO)}${t.dependsOn ? ` • depends on ${safe(t.dependsOn)}` : ""}</div>
    </div>`
      )
      .join("")}
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `renovation-proposal-${today}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/dashboard/projects");
  };

  useEffect(() => {
    return () => {
      for (const p of photos) URL.revokeObjectURL(p.url);
    };
  }, [photos]);

  const scopeOptions = [
    "Demolition", "Cabinets", "Electrical", "Countertops",
    "Plumbing", "Painting", "Drywall", "Fixtures",
    "Flooring", "Cleaning",
  ];

  const toggleScope = (item: string) =>
    setScope((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );

  const buildProposal = (): Proposal => {
    const sqft = Math.max(0, Number(squareFt || 0));

    const rules: Record<
      string,
      { unit: "sqft" | "each"; unitCost: number; qty: (sqft: number) => number }
    > = {
      Flooring: { unit: "sqft", unitCost: 5.26, qty: (s) => Math.max(120, Math.round(s * 0.35)) },
      Painting: { unit: "sqft", unitCost: 2.86, qty: (s) => Math.max(180, Math.round(s * 0.9)) },
      Drywall: { unit: "sqft", unitCost: 3.4, qty: (s) => Math.max(100, Math.round(s * 0.25)) },
      Cabinets: { unit: "each", unitCost: 420, qty: () => 12 },
      Countertops: { unit: "sqft", unitCost: 78, qty: () => 40 },
      Plumbing: { unit: "each", unitCost: 250, qty: () => 6 },
      Electrical: { unit: "each", unitCost: 145, qty: () => 10 },
      Fixtures: { unit: "each", unitCost: 120, qty: () => 10 },
      Demolition: { unit: "sqft", unitCost: 1.35, qty: (s) => Math.max(120, Math.round(s * 0.3)) },
      Cleaning: { unit: "sqft", unitCost: 0.55, qty: (s) => Math.max(100, Math.round(s * 0.6)) },
    };

    const selected = scope.length > 0 ? scope : ["Flooring", "Painting"];
    const lines: EstimateLine[] = selected
      .filter((s) => rules[s])
      .map((s) => {
        const r = rules[s];
        const quantity = r.qty(sqft);
        const total = quantity * r.unitCost;
        return {
          item: s,
          quantityLabel: r.unit === "sqft" ? `${quantity} sqft` : `${quantity}`,
          unitCost: r.unitCost,
          total,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);

    const materialSubtotal = lines.reduce((sum, l) => sum + l.total, 0);
    const labor = materialSubtotal * 0.4;
    const contingency = (materialSubtotal + labor) * 0.1;
    const totalInvestment = materialSubtotal + labor + contingency;

    const complexity = Math.max(1, Math.min(10, Math.round(selected.length + sqft / 800)));
    const workingDays = Math.max(25, Math.round(25 + complexity * 6));
    const totalWeeks = Number((workingDays / 5).toFixed(1));
    const now = new Date();
    const completion = new Date(now.getTime() + workingDays * 24 * 60 * 60 * 1000);

    const mkRange = (startOffsetDays: number, durationDays: number) => {
      const start = new Date(now.getTime() + startOffsetDays * 24 * 60 * 60 * 1000);
      const end = new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000);
      return { startISO: start.toISOString().slice(0, 10), endISO: end.toISOString().slice(0, 10) };
    };

    const s1 = mkRange(0, 10);
    const s2 = mkRange(11, 17);
    const s3 = mkRange(18, 4);
    const s4 = mkRange(23, 2);

    const schedule = [
      { title: "Contractor Selection & Bidding", ...s1, days: 10 },
      { title: "Permits & Design Planning", ...s2, days: 17, dependsOn: "Contractor Selection & Bidding" },
      { title: "Demolition", ...s3, days: 4 },
      { title: "Final Cleaning", ...s4, days: 2 },
    ];

    return {
      lines,
      materialSubtotal,
      labor,
      contingency,
      totalInvestment,
      totalWeeks,
      workingDays,
      completionDateISO: completion.toISOString().slice(0, 10),
      schedule,
    };
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("address", address.trim());
    fd.append("purchasePrice", purchasePrice);
    fd.append("squareFt", squareFt);
    fd.append("bedroom", bedroom);
    fd.append("bathroom", bathroom);
    fd.append("yearBuilt", yearBuilt);
    fd.append("zipCode", zipCode);
    fd.append("roomType", roomType);
    fd.append("budgetLevel", budgetLevel);
    fd.append("designStyle", designStyle);
    fd.append("renovationScope", JSON.stringify(scope));
    for (const p of photos) fd.append("photos", p.file, p.file.name);
    return fd;
  };

  const handleGenerateProposal = async () => {
    if (!address.trim()) {
      toast.error("Address is required");
      return;
    }
    setAiLoading(true);
    try {
      const fd = buildFormData();
      const res = await apiFetchForm<{ ok: true; proposal: Proposal }>("/ai/proposal", fd);
      setProposal(res.proposal);
      setFullMode(false);
      setSelectedTier(null);
      setSelectedConcept(null);
      void (async () => {
        setDesignOptionsLoading(true);
        try {
          const opt = await apiFetch<{ ok: true; options: DesignOption[] }>("/ai/design-options", {
            method: "POST",
            body: JSON.stringify({
              address: address.trim(),
              squareFt: squareFt ? Number(squareFt) : 0,
              bedroom: bedroom ? Number(bedroom) : 0,
              bathroom: bathroom ? Number(bathroom) : 0,
              roomType,
              budgetLevel,
              designStyle,
              renovationScope: scope,
            }),
          });
          setDesignOptions(opt.options ?? []);
        } catch {
          setDesignOptions([]);
        } finally {
          setDesignOptionsLoading(false);
        }
      })();

      void (async () => {
        setDesignConceptsLoading(true);
        try {
          const res = await apiFetch<{ ok: true; concepts: DesignConcept[] }>("/ai/design-concepts", {
            method: "POST",
            body: JSON.stringify({
              address: address.trim(),
              squareFt: squareFt ? Number(squareFt) : 0,
              bedroom: bedroom ? Number(bedroom) : 0,
              bathroom: bathroom ? Number(bathroom) : 0,
              roomType,
              budgetLevel,
              designStyle,
              renovationScope: scope,
            }),
          });
          setDesignConcepts(res.concepts ?? []);
        } catch {
          setDesignConcepts([]);
        } finally {
          setDesignConceptsLoading(false);
        }
      })();
      toast.success("AI design generated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate AI design");
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateFullProposal = async () => {
    if (!address.trim()) {
      toast.error("Address is required");
      return;
    }
    setAiLoading(true);
    try {
      const fd = buildFormData();
      const res = await apiFetchForm<{ ok: true; proposal: Proposal }>("/ai/full-proposal", fd);
      setProposal(res.proposal);
      setFullMode(true);
      if (designOptions.length === 0 && !designOptionsLoading) {
        void (async () => {
          setDesignOptionsLoading(true);
          try {
            const opt = await apiFetch<{ ok: true; options: DesignOption[] }>("/ai/design-options", {
              method: "POST",
              body: JSON.stringify({
                address: address.trim(),
                squareFt: squareFt ? Number(squareFt) : 0,
                bedroom: bedroom ? Number(bedroom) : 0,
                bathroom: bathroom ? Number(bathroom) : 0,
                roomType,
                budgetLevel,
                designStyle,
                renovationScope: scope,
              }),
            });
            setDesignOptions(opt.options ?? []);
          } catch {
            setDesignOptions([]);
          } finally {
            setDesignOptionsLoading(false);
          }
        })();
      }
      if (designConcepts.length === 0 && !designConceptsLoading) {
        void (async () => {
          setDesignConceptsLoading(true);
          try {
            const res = await apiFetch<{ ok: true; concepts: DesignConcept[] }>("/ai/design-concepts", {
              method: "POST",
              body: JSON.stringify({
                address: address.trim(),
                squareFt: squareFt ? Number(squareFt) : 0,
                bedroom: bedroom ? Number(bedroom) : 0,
                bathroom: bathroom ? Number(bathroom) : 0,
                roomType,
                budgetLevel,
                designStyle,
                renovationScope: scope,
                selectedTierTitle: selectedTier != null ? designOptions[selectedTier]?.title : undefined,
              }),
            });
            setDesignConcepts(res.concepts ?? []);
          } catch {
            setDesignConcepts([]);
          } finally {
            setDesignConceptsLoading(false);
          }
        })();
      }
      toast.success("Full proposal generated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate full proposal");
    } finally {
      setAiLoading(false);
    }
  };

  const createProject = async () => {
    if (!address.trim()) {
      toast.error("Address is required");
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch<{ project: { id: string } }>("/projects/me", {
        method: "POST",
        body: JSON.stringify({
          address: address.trim(),
          purchasePrice: purchasePrice ? Number(purchasePrice) : 0,
          squareFt: squareFt ? Number(squareFt) : 0,
          bedroom: bedroom ? Number(bedroom) : 0,
          bathroom: bathroom ? Number(bathroom) : 0,
          yearBuilt,
          zipCode,
          roomType,
          budgetLevel,
          renovationScope: scope,
          designStyle,
        }),
      });
      toast.success("Project created");
      void res;
      // Reset screen/state after submit (per requirement).
      setProposal(null);
      setFullMode(false);
      setDesignOptions([]);
      setDesignConcepts([]);
      setSelectedTier(null);
      setSelectedConcept(null);
      setAddress("");
      setPurchasePrice("");
      setSquareFt("");
      setBedroom("");
      setBathroom("");
      setYearBuilt("");
      setZipCode("");
      setRoomType("");
      setBudgetLevel("");
      setDesignStyle("");
      setScope([]);
      setPhotos([]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans">
      <div className="px-8 pt-5 max-w-[70%] mx-auto">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm text-[#7A7870] hover:text-[#1A1A1A]"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Stepper */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[12px]">
            {steps.map((s, idx) => {
              const active = idx + 1 <= stepIndex;
              return (
                <div key={s} className={`flex items-center gap-2 ${active ? "text-[#1A1A1A]" : "text-[#AEACA6]"}`}>
                  <span
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[11px] font-semibold border ${
                      active ? "bg-[#7C3AED] text-white border-[#7C3AED]" : "bg-white border-[#E8E5DF]"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="whitespace-nowrap">{s}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {aiLoading ? (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center px-6">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E8E5DF] p-6 text-center">
            <div className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-[#E8E5DF] border-t-[#C8813A] animate-spin" />
            <p className="text-[15px] font-semibold text-[#1A1A1A]">
              Don’t Refresh This Page
            </p>
            <p className="text-[13px] text-[#7A7870] mt-1">
              Please wait for a few seconds while we generate your AI design.
            </p>
          </div>
        </div>
      ) : null}

      {/* Progress bar */}
      <div className="relative h-[5px] bg-[#EDE9E3] max-w-[66%] mx-auto ">
        <div
          className="h-full bg-gradient-to-r from-[#7C3AED] to-[#7C3AED]"
          style={{ width: `${stepPct}%` }}
        />
        <span className="absolute right-3 top-2 text-[11px] font-semibold text-[#C8813A]">
          {stepPct}%
        </span>
      </div>

      <div className="px-8 pt-3 pb-4 max-w-[70%] mx-auto">
        {proposal && fullMode ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-semibold text-[#7C3AED]">Renovation Proposal</p>
                <h2 className="text-[18px] font-semibold text-[#1A1A1A] mt-0.5">Renovation Proposal</h2>
              </div>
              <button
                type="button"
                className="h-[38px] px-4 rounded-full bg-[#1A1A1A] text-white text-[12.5px] font-medium hover:bg-[#2d2d2d] transition-colors"
                onClick={downloadProposal}
              >
                Download Proposal
              </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-[#E8E5DF] rounded-2xl p-4">
                <p className="text-[12px] font-semibold text-[#1A1A1A]">Property Details</p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-[12px]">
                  <div>
                    <p className="text-[#AEACA6]">Address</p>
                    <p className="font-semibold text-[#1A1A1A] truncate">{address || "-"}</p>
                  </div>
                  <div>
                    <p className="text-[#AEACA6]">Budget Level</p>
                    <p className="font-semibold text-[#1A1A1A]">{budgetLevel || "-"}</p>
                  </div>
                  <div>
                    <p className="text-[#AEACA6]">Square Ft</p>
                    <p className="font-semibold text-[#1A1A1A]">{squareFt || "-"}</p>
                  </div>
                  <div>
                    <p className="text-[#AEACA6]">Bedrooms / Baths</p>
                    <p className="font-semibold text-[#1A1A1A]">
                      {bedroom || "-"} / {bathroom || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E8E5DF] rounded-2xl p-4">
                <p className="text-[12px] font-semibold text-[#1A1A1A]">Investment Summary</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#F7F5F2] border border-[#E8E5DF] p-3">
                    <p className="text-[11px] text-[#7A7870]">Total Investment</p>
                    <p className="text-[16px] font-semibold text-[#7C3AED] mt-0.5">
                      ${proposal.totalInvestment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#F7F5F2] border border-[#E8E5DF] p-3">
                    <p className="text-[11px] text-[#7A7870]">Material Subtotal</p>
                    <p className="text-[16px] font-semibold text-[#1A1A1A] mt-0.5">
                      ${proposal.materialSubtotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Design Options */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-semibold text-[#1A1A1A]">Design Options</h3>
                <span className="text-[11px] text-[#AEACA6]">
                  {designOptionsLoading ? "Generating..." : "AI generated"}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(designOptions.length ? designOptions : []).slice(0, 3).map((opt, idx) => {
                  const fallbackImgs = [
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80",
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80",
                  ];
                  const imgSrc = photos[idx]?.url || fallbackImgs[idx % fallbackImgs.length];
                  return (
                    <button
                      type="button"
                      key={opt.title + idx}
                      onClick={() => setSelectedTier(idx)}
                      className={`text-left bg-white rounded-2xl overflow-hidden border shadow-[0_8px_30px_rgba(17,24,39,0.06)] flex flex-col transition-colors ${
                        selectedTier === idx ? "border-[#7C3AED]" : "border-gray-100/80 hover:border-gray-200"
                      }`}
                    >
                      <div className="relative">
                        <img src={imgSrc} alt={opt.title} className="w-full object-cover" style={{ height: 170 }} />
                        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {opt.styleTag}
                        </span>
                        <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                          AI generated
                        </span>
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-bold text-gray-900 text-[18px] leading-tight mb-1">{opt.title}</h3>
                        <div className="flex items-center gap-2 text-gray-400 text-[12px] mb-3">
                          <span className="truncate">{address || "-"}</span>
                        </div>

                        <p className="text-gray-500 text-xs mb-2">Estimated Cost</p>
                        <div className="relative mb-3">
                          <div className="flex items-stretch w-full rounded-full border border-gray-200 overflow-hidden bg-white">
                            <div className="flex-1 min-w-0 py-2.5  pr-3 text-center">
                              <div className="text-[10px] text-gray-400 font-medium leading-none">In Market</div>
                              <div className="text-[13px] font-semibold text-indigo-700 leading-tight mt-0.5">
                                {opt.marketRange}
                              </div>
                            </div>
                            <div className="shrink-0 rounded-full bg-purple-600 px-5 py-2.5 text-center">
                              <div className="text-[10px] text-purple-200 font-medium leading-none">
                                Estimated Cost by AI
                              </div>
                              <div className="text-[13px] font-semibold text-white leading-tight mt-0.5">
                                {opt.aiEstimate}
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-[11.5px] text-[#7A7870] mt-auto">{opt.notes}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Tier selection hint */}
              {designOptions.length ? (
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[12px] text-[#7A7870]">
                    {selectedTier == null ? "Choose a renovation tier to continue." : "Tier selected."}
                  </p>
                  {selectedTier != null ? (
                    <button
                      type="button"
                      onClick={() => setSelectedConcept(0)}
                      className="h-[38px] px-4 rounded-full border border-[#E8E5DF] bg-white text-[12.5px] font-medium text-[#1A1A1A] hover:bg-[#fafafa] transition-colors"
                    >
                      Continue
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* Design Concepts & Visualizations */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-semibold text-[#1A1A1A]">Design Concepts &amp; Visualizations</h3>
                <span className="text-[11px] text-[#AEACA6]">{designConceptsLoading ? "Generating..." : "AI generated"}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(designConcepts.length ? designConcepts : []).slice(0, 3).map((c, idx) => {
                  const fallbackImgs = [
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80",
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80",
                  ];
                  const imgSrc = photos[idx]?.url || fallbackImgs[(idx + 1) % fallbackImgs.length];
                  const selected = selectedConcept === idx;
                  return (
                    <button
                      type="button"
                      key={c.title + idx}
                      onClick={() => setSelectedConcept(idx)}
                      className={`text-left bg-white rounded-2xl overflow-hidden border shadow-[0_8px_30px_rgba(17,24,39,0.06)] flex flex-col transition-colors ${
                        selected ? "border-[#7C3AED]" : "border-gray-100/80 hover:border-gray-200"
                      }`}
                    >
                      <div className="relative">
                        <img src={imgSrc} alt={c.title} className="w-full object-cover" style={{ height: 170 }} />
                        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {c.styleTag}
                        </span>
                        <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                          AI generated
                        </span>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-bold text-gray-900 text-[18px] leading-tight mb-1">{c.title}</h3>
                        <p className="text-[11.5px] text-[#7A7870]">{c.summary}</p>

                        <div className="mt-3">
                          <p className="text-[11px] font-semibold text-[#1A1A1A]">Key upgrades</p>
                          <ul className="mt-1 space-y-1 text-[11.5px] text-[#7A7870] list-disc pl-4">
                            {c.keyUpgrades.slice(0, 4).map((u) => (
                              <li key={u}>{u}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-3 rounded-xl border border-[#E8E5DF] bg-[#FAFAFA] p-3">
                          <p className="text-[11px] font-semibold text-[#1A1A1A]">Visualization prompt</p>
                          <p className="text-[11px] text-[#7A7870] mt-1 line-clamp-3">{c.visualizationPrompt}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget Breakdown */}
            <div className="bg-white border border-[#E8E5DF] rounded-2xl p-4">
              <h3 className="text-[14px] font-semibold text-[#1A1A1A] mb-3">Budget Breakdown</h3>
              <div className="border border-[#E8E5DF] rounded-xl overflow-hidden">
                <div className="grid grid-cols-[1fr,120px,120px,120px] gap-0 bg-[#FAFAFA] px-4 py-2 text-[12px] text-[#7A7870] font-medium">
                  <div>Item</div>
                  <div>Quantity</div>
                  <div className="text-right">Unit Cost</div>
                  <div className="text-right">Total</div>
                </div>
                {proposal.lines.map((l) => (
                  <div
                    key={l.item}
                    className="grid grid-cols-[1fr,120px,120px,120px] gap-0 px-4 py-2 text-[12.5px] border-t border-[#E8E5DF]"
                  >
                    <div className="text-[#1A1A1A] font-medium">{l.item}</div>
                    <div className="text-[#7A7870]">{l.quantityLabel}</div>
                    <div className="text-right text-[#7A7870]">${l.unitCost.toFixed(2)}</div>
                    <div className="text-right text-[#1A1A1A] font-medium">
                      ${l.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
                <div className="border-t border-[#E8E5DF] bg-[#F6F4EF] px-4 py-3 flex items-center justify-between">
                  <span className="text-[12.5px] font-semibold text-[#1A1A1A]">Total Investment:</span>
                  <span className="text-[12.5px] font-semibold text-[#1A1A1A]">
                    ${proposal.totalInvestment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-[#E8E5DF] rounded-2xl p-4">
              <h3 className="text-[14px] font-semibold text-[#1A1A1A] mb-3">Project Timeline</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-[#F7F5F2] border border-[#E8E5DF] p-3">
                  <p className="text-[16px] font-semibold text-[#7C3AED]">{proposal.totalWeeks} Weeks</p>
                  <p className="text-[11.5px] text-[#7A7870]">Total Duration</p>
                </div>
                <div className="rounded-xl bg-[#F7F5F2] border border-[#E8E5DF] p-3">
                  <p className="text-[16px] font-semibold text-[#00B7C2]">{proposal.workingDays} days</p>
                  <p className="text-[11.5px] text-[#7A7870]">Working Days</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {proposal.schedule.map((t) => (
                  <div key={t.title} className="flex gap-3">
                    <div className="mt-1 h-4 w-4 rounded-full bg-[#BFD7FF] shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[12.5px] font-semibold text-[#1A1A1A]">{t.title}</p>
                        <span className="px-2 py-0.5 rounded-full bg-black text-white text-[11px]">
                          {t.days} Days
                        </span>
                      </div>
                      <p className="text-[11.5px] text-[#7A7870] mt-0.5">
                        {t.startISO} to {t.endISO}
                      </p>
                      {t.dependsOn ? (
                        <p className="text-[11px] text-[#7A7870] mt-0.5">Depends on: {t.dependsOn}</p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                <p className="text-[12.5px] font-semibold text-emerald-700">Proposal Ready!</p>
                <p className="text-[11.5px] text-emerald-700/80 mt-0.5">
                  Your renovation proposal has been generated. Click “Download Proposal” to save it.
                </p>
              </div>

              <button
                type="button"
                onClick={() => void createProject()}
                disabled={loading}
                className="mt-5 w-full h-[48px] rounded-full bg-[#1A1A1A] text-white text-[14px] font-medium
                  hover:bg-[#2d2d2d] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {loading ? "Creating..." : "Submit"}
              </button>
            </div>
          </div>
        ) : proposal ? (
          <div className="grid grid-cols-1 lg:grid-cols-[360px,1fr] gap-6">
            {/* Left summary */}
            <div className="bg-white border border-[#E8E5DF] rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-semibold text-[#1A1A1A]">Property Information</p>
                  <p className="text-[12px] text-[#7A7870] mt-1">{address || "-"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setProposal(null)}
                  className="w-9 h-9 rounded-full border border-[#E8E5DF] hover:bg-[#fafafa] transition-colors flex items-center justify-center"
                  aria-label="Edit"
                >
                  ✎
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
                <div>
                  <p className="text-[#AEACA6]">Purchase Price</p>
                  <p className="font-semibold text-[#1A1A1A]">
                    {purchasePrice ? `$${Number(purchasePrice).toLocaleString()}` : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[#AEACA6]">Square Footage</p>
                  <p className="font-semibold text-[#1A1A1A]">{squareFt ? `${squareFt} sq` : "-"}</p>
                </div>
                <div>
                  <p className="text-[#AEACA6]">Bedroom</p>
                  <p className="font-semibold text-[#1A1A1A]">{bedroom || "-"}</p>
                </div>
                <div>
                  <p className="text-[#AEACA6]">Bathroom</p>
                  <p className="font-semibold text-[#1A1A1A]">{bathroom || "-"}</p>
                </div>
                <div>
                  <p className="text-[#AEACA6]">Year Built</p>
                  <p className="font-semibold text-[#1A1A1A]">{yearBuilt || "-"}</p>
                </div>
                <div>
                  <p className="text-[#AEACA6]">Zip Code</p>
                  <p className="font-semibold text-[#1A1A1A]">{zipCode || "-"}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[13px] font-semibold text-[#1A1A1A]">Upload Images</p>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {photos.slice(0, 6).map((p, idx) => (
                    <div key={idx} className="w-[74px] h-[74px] rounded-xl overflow-hidden border border-[#E8E5DF]">
                      <img src={p.url} alt={`photo-${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {photos.length === 0 ? (
                    <p className="text-[12px] text-[#7A7870]">No images selected</p>
                  ) : null}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[13px] font-semibold text-[#1A1A1A]">Room Type</p>
                <p className="text-[12px] text-[#7A7870] mt-1">{roomType || "-"}</p>
              </div>

              <div className="mt-4">
                <p className="text-[13px] font-semibold text-[#1A1A1A]">Budget Level</p>
                <p className="text-[12px] text-[#7A7870] mt-1">{budgetLevel || "-"}</p>
              </div>

              <div className="mt-4">
                <p className="text-[13px] font-semibold text-[#1A1A1A]">Renovation Scope</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(scope.length ? scope : ["Flooring", "Painting"]).map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[12px] font-medium border border-emerald-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[13px] font-semibold text-[#1A1A1A]">Design Style</p>
                <p className="text-[12px] text-[#7A7870] mt-1">{designStyle || "-"}</p>
              </div>
            </div>

            {/* Right proposal */}
            <div className="space-y-6">
              <div className="bg-white border border-[#E8E5DF] rounded-2xl p-5">
                <p className="text-[18px] font-semibold text-[#1A1A1A]">
                  Investment <span className="text-[#AEACA6] font-semibold">Analysis</span>
                </p>

                <div className="mt-4 border border-[#E8E5DF] rounded-xl overflow-hidden">
                  <div className="grid grid-cols-[1fr,120px,120px,120px] gap-0 bg-[#FAFAFA] px-4 py-2 text-[12px] text-[#7A7870] font-medium">
                    <div>Item</div>
                    <div>Quantity</div>
                    <div className="text-right">Unit Cost</div>
                    <div className="text-right">Total</div>
                  </div>
                  {proposal.lines.map((l) => (
                    <div
                      key={l.item}
                      className="grid grid-cols-[1fr,120px,120px,120px] gap-0 px-4 py-2 text-[12.5px] border-t border-[#E8E5DF]"
                    >
                      <div className="text-[#1A1A1A] font-medium">{l.item}</div>
                      <div className="text-[#7A7870]">{l.quantityLabel}</div>
                      <div className="text-right text-[#7A7870]">${l.unitCost.toFixed(2)}</div>
                      <div className="text-right text-[#1A1A1A] font-medium">
                        ${l.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-[#E8E5DF] px-4 py-2 text-[12.5px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#7A7870]">Material Subtotal:</span>
                      <span className="font-semibold text-[#1A1A1A]">
                        ${proposal.materialSubtotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[#7A7870]">Labor (40%):</span>
                      <span className="text-[#7A7870]">
                        ${proposal.labor.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[#7A7870]">Contingency (10%):</span>
                      <span className="text-[#7A7870]">
                        ${proposal.contingency.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-[#E8E5DF] bg-[#F6F4EF] px-4 py-3 flex items-center justify-between">
                    <span className="text-[12.5px] font-semibold text-[#1A1A1A]">Total Investment:</span>
                    <span className="text-[12.5px] font-semibold text-[#1A1A1A]">
                      ${proposal.totalInvestment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E8E5DF] rounded-2xl p-5">
                <p className="text-[18px] font-semibold text-[#1A1A1A]">
                  Project <span className="text-[#AEACA6] font-semibold">Timeline</span>
                </p>
                <div className="mt-4 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[18px] font-semibold text-[#6D6AFE]">{proposal.totalWeeks} Weeks</p>
                    <p className="text-[12px] text-[#7A7870]">Total Duration</p>
                  </div>
                  <div>
                    <p className="text-[18px] font-semibold text-[#00B7C2]">{proposal.workingDays} days</p>
                    <p className="text-[12px] text-[#7A7870]">Working Days</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[13px] font-semibold text-[#1A1A1A] mb-2">Task Schedule</p>
                  <div className="space-y-3">
                    {proposal.schedule.map((t) => (
                      <div key={t.title} className="flex gap-3">
                        <div className="mt-1 h-4 w-4 rounded-full bg-[#BFD7FF] shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[12.5px] font-semibold text-[#1A1A1A]">{t.title}</p>
                            <span className="px-2 py-0.5 rounded-full bg-black text-white text-[11px]">
                              {t.days} Days
                            </span>
                          </div>
                          <p className="text-[11.5px] text-[#7A7870] mt-0.5">
                            {t.startISO} to {t.endISO}
                          </p>
                          {t.dependsOn ? (
                            <p className="text-[11px] text-[#7A7870] mt-0.5">Depends on: {t.dependsOn}</p>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                    <p className="text-[12.5px] font-semibold text-emerald-700">Timeline Generated</p>
                    <p className="text-[11.5px] text-emerald-700/80 mt-0.5">
                      Project Completion {proposal.completionDateISO}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void handleGenerateFullProposal()}
                  disabled={aiLoading}
                  className="mt-5 w-full h-[48px] rounded-full bg-[#1A1A1A] text-white text-[14px] font-medium
                    hover:bg-[#2d2d2d] active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {aiLoading ? "Generating..." : "Generate Full Proposal"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <h1 className="font-serif text-[26px] font-normal text-[#1A1A1A] mb-0.5">
              Hi there! Let's get started
            </h1>
            <p className="text-[13px] font-medium uppercase tracking-wide text-[#C8813A] mb-4">
              Property Information
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleGenerateProposal();
              }}
              className="space-y-2"
            >
          {/* Address */}
          <Field label="Address">
            <input
              type="text"
              placeholder="12, Business Park"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={inputCls}
            />
          </Field>

          {/* Purchase Price + Square Ft */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Purchase Price ($)">
              <input type="number" placeholder="4" value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Square Ft">
              <input type="number" placeholder="99950" value={squareFt}
                onChange={(e) => setSquareFt(e.target.value)} className={inputCls} />
            </Field>
          </div>

          {/* Bedroom + Bathroom */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Bedroom">
              <input type="number" placeholder="3" value={bedroom}
                onChange={(e) => setBedroom(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Bathroom">
              <input type="number" placeholder="4" value={bathroom}
                onChange={(e) => setBathroom(e.target.value)} className={inputCls} />
            </Field>
          </div>

          {/* Year Built + Zip Code */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Year Built">
              <select value={yearBuilt} onChange={(e) => setYearBuilt(e.target.value)}
                className={inputCls + " appearance-none bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23AEACA6'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_12px_center]"}>
                <option value="" disabled>Select</option>
                <option>Before 1980</option>
                <option>1980–2000</option>
                <option>2000–2010</option>
                <option>After 2010</option>
              </select>
            </Field>
            <Field label="Zip Code">
              <input type="text" placeholder="Enter Zip Code" value={zipCode}
                onChange={(e) => setZipCode(e.target.value)} className={inputCls} />
            </Field>
          </div>

          {/* Upload Images */}
         {/* Upload Images */}
<div className="pt-1">
  <h2 className="text-[17px] font-semibold text-[#C8813A] mb-3">Upload Images</h2>
  <p className="text-[11.5px] text-[#7A7870] font-medium mb-1.5">
    Attach Image <span className="text-[#AEACA6] text-[10px]">ℹ</span>
  </p>

  {photos.length === 0 ? (
    /* ── Empty state: full-width dashed dropzone ── */
    <label className="flex flex-col items-center gap-2 border-[1.5px] border-dashed border-[#E8E5DF]
      rounded-[10px] py-7 px-4 cursor-pointer bg-[#F7F5F2] hover:border-[#C8813A] hover:bg-[#F5EDE0] transition-all">
      <div className="w-9 h-9 rounded-full bg-[#E8E5DF] flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#7A7870" strokeWidth="1.5">
          <path d="M10 13V7m0 0L7.5 9.5M10 7l2.5 2.5" />
          <path d="M4.5 15A4.5 4.5 0 015.13 6.07a6 6 0 1111.74 1.43A3.5 3.5 0 0115.5 15" />
        </svg>
      </div>
      <span className="text-[13.5px] font-medium text-[#C8813A]">Upload photo</span>
      <span className="text-[11.5px] text-[#AEACA6] text-center">
        Only .png, .jpeg – Minimum 5 photos recommended (Interior + Exterior)
      </span>
      <input
        type="file"
        accept=".png,.jpeg,.jpg"
        multiple
        className="hidden"
        onChange={(e) => {
          const next = Array.from(e.target.files ?? []);
          if (next.length === 0) return;
          const withPreviews = next.map((file) => ({
            file,
            url: URL.createObjectURL(file),
          }));
          setPhotos((prev) => [...prev, ...withPreviews]);
          e.currentTarget.value = "";
        }}
      />
    </label>
  ) : (
    /* ── Filled state: small upload button + thumbnails ── */
    <div className="flex items-start gap-2 flex-wrap">
      <label className="flex flex-col items-center justify-center gap-1.5 w-[90px] h-[90px]
        border-[1.5px] border-dashed border-[#E8E5DF] rounded-[10px] cursor-pointer
        bg-[#F7F5F2] hover:border-[#C8813A] hover:bg-[#F5EDE0] transition-all shrink-0">
        <div className="w-8 h-8 rounded-full bg-[#E8E5DF] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#7A7870" strokeWidth="1.5">
            <path d="M10 13V7m0 0L7.5 9.5M10 7l2.5 2.5" />
            <path d="M4.5 15A4.5 4.5 0 015.13 6.07a6 6 0 1111.74 1.43A3.5 3.5 0 0115.5 15" />
          </svg>
        </div>
        <span className="text-[11px] font-medium text-[#C8813A] text-center leading-tight">
          Upload photo
        </span>
        <input
          type="file"
          accept=".png,.jpeg,.jpg"
          multiple
          className="hidden"
          onChange={(e) => {
            const next = Array.from(e.target.files ?? []);
            if (next.length === 0) return;
            const withPreviews = next.map((file) => ({
              file,
              url: URL.createObjectURL(file),
            }));
            setPhotos((prev) => [...prev, ...withPreviews]);
            e.currentTarget.value = "";
          }}
        />
      </label>

      {photos.map((photo, idx) => (
        <div key={idx} className="relative w-[90px] h-[90px] rounded-[10px] overflow-hidden shrink-0 group">
          <img
            src={photo.url}
            alt={`upload-${idx}`}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() =>
              setPhotos((prev) => {
                URL.revokeObjectURL(prev[idx].url);
                return prev.filter((_, i) => i !== idx);
              })
            }
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white
              flex items-center justify-center text-[11px] leading-none
              opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )}
</div>

          {/* Room Type + Budget Level */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Room Type">
              <input type="text" placeholder="Kitchen" value={roomType}
                onChange={(e) => setRoomType(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Budget Level">
              <input type="text" placeholder="Mid Level" value={budgetLevel}
                onChange={(e) => setBudgetLevel(e.target.value)} className={inputCls} />
            </Field>
          </div>

          {/* Budget & Timeline */}
          <div className="pt-1">
            <h2 className="text-[17px] font-semibold text-[#C8813A] mb-3">Budget &amp; Timeline</h2>
            <div className="bg-white border border-[#E8E5DF] rounded-xl p-4">
              <p className="text-[14px] font-semibold text-[#1A1A1A] mb-3">Renovation Scope</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                {scopeOptions.map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scope.includes(item)}
                      onChange={() => toggleScope(item)}
                      className="w-4 h-4 accent-[#C8813A] cursor-pointer"
                    />
                    <span className="text-[13.5px] text-[#1A1A1A]">{item}</span>
                  </label>
                ))}
              </div>
              <Field label="Design Style">
                <input type="text" placeholder="Enter" value={designStyle}
                  onChange={(e) => setDesignStyle(e.target.value)} className={inputCls} />
              </Field>
            </div>
          </div>

              <button
                type="submit"
                disabled={aiLoading}
                className="w-full h-[46px] rounded-[10px] bg-[#1A1A1A] text-white text-[14px] font-medium
                  hover:bg-[#2d2d2d] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {aiLoading ? "Generating..." : "Generate AI Design"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full h-9 border border-[#E8E5DF] rounded-lg px-3 text-[13.5px] text-[#1A1A1A] bg-white outline-none " +
  "focus:border-[#C8813A] focus:ring-2 focus:ring-[#C8813A]/10 placeholder:text-[#AEACA6] transition-all";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11.5px] text-[#7A7870] font-medium tracking-wide">{label}</label>
      {children}
    </div>
  );
}