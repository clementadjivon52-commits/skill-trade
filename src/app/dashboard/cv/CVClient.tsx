"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type CVData = {
  fullName: string;
  title: string;
  summary: string;
  phone: string;
  email: string;
  address: string;
  skills: string[];
  experience: { company: string; role: string; period: string; desc: string }[];
  education: { school: string; degree: string; year: string }[];
  pdfPath?: string;
};

export default function CVClient({ initial }: { initial: CVData | null }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [cv, setCv] = useState<CVData>(
    initial ?? {
      fullName: "",
      title: "",
      summary: "",
      phone: "",
      email: "",
      address: "",
      skills: [],
      experience: [],
      education: [],
    }
  );

  const update = (field: keyof CVData, value: unknown) =>
    setCv((prev) => ({ ...prev, [field]: value }));

  const addSkill = () => {
    if (skillInput.trim()) {
      update("skills", [...cv.skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (i: number) =>
    update("skills", cv.skills.filter((_, idx) => idx !== i));

  const addExp = () =>
    update("experience", [
      ...cv.experience,
      { company: "", role: "", period: "", desc: "" },
    ]);

  const updateExp = (
    i: number,
    field: keyof CVData["experience"][0],
    value: string
  ) => {
    const exp = [...cv.experience];
    exp[i] = { ...exp[i], [field]: value };
    update("experience", exp);
  };

  const removeExp = (i: number) =>
    update("experience", cv.experience.filter((_, idx) => idx !== i));

  const addEdu = () =>
    update("education", [
      ...cv.education,
      { school: "", degree: "", year: "" },
    ]);

  const updateEdu = (
    i: number,
    field: keyof CVData["education"][0],
    value: string
  ) => {
    const edu = [...cv.education];
    edu[i] = { ...edu[i], [field]: value };
    update("education", edu);
  };

  const removeEdu = (i: number) =>
    update("education", cv.education.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const form = new FormData();
      form.append(
        "data",
        JSON.stringify({
          fullName: cv.fullName,
          title: cv.title,
          summary: cv.summary,
          phone: cv.phone,
          email: cv.email,
          address: cv.address,
          skills: JSON.stringify(cv.skills),
          experience: JSON.stringify(cv.experience),
          education: JSON.stringify(cv.education),
        })
      );
      if (fileRef.current?.files?.[0]) {
        form.append("pdf", fileRef.current.files[0]);
      }
      const res = await fetch("/api/user/cv", { method: "POST", body: form });
      if (res.ok) {
        const data = await res.json();
        if (data.pdfPath) update("pdfPath", data.pdfPath);
        setSaved(true);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--text-muted)" }}>
            Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-bold" style={{ color: "var(--heading)" }}>
            Mon CV 📄
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {cv.pdfPath && (
            <a
              href={cv.pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              ⬇ Voir le PDF
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary text-sm"
          >
            {saving ? "Enregistrement…" : saved ? "✅ Enregistré !" : "Enregistrer"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left: Form */}
        <div className="space-y-6">
          {/* Personal Info */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold" style={{ color: "var(--heading)" }}>
              Informations personnelles
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block mb-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  Nom complet
                </label>
                <input
                  className="form-input"
                  value={cv.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="Jean Kouassi"
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  Titre / Poste
                </label>
                <input
                  className="form-input"
                  value={cv.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="Développeur Web Full-Stack"
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  Téléphone
                </label>
                <input
                  className="form-input"
                  value={cv.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+228 90 00 00 00"
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  Email
                </label>
                <input
                  className="form-input"
                  value={cv.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="jean@example.com"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block mb-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  Adresse
                </label>
                <input
                  className="form-input"
                  value={cv.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="Lomé, Togo"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block mb-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  Résumé professionnel
                </label>
                <textarea
                  className="form-input min-h-[80px] resize-y"
                  value={cv.summary}
                  onChange={(e) => update("summary", e.target.value)}
                  placeholder="Brève description de votre profil…"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold" style={{ color: "var(--heading)" }}>
              Compétences
            </h2>
            <div className="flex gap-2">
              <input
                className="form-input flex-1"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="Ex: React, Design, Marketing…"
              />
              <button onClick={addSkill} className="btn-primary px-4 py-2 text-sm rounded-xl">
                +
              </button>
            </div>
            {cv.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {cv.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-sm text-violet-300"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(i)}
                      className="text-violet-400 hover:text-red-400 leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Experience */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold" style={{ color: "var(--heading)" }}>
                Expériences
              </h2>
              <button onClick={addExp} className="btn-secondary text-xs px-3 py-1.5">
                + Ajouter
              </button>
            </div>
            {cv.experience.map((exp, i) => (
              <div
                key={i}
                className="rounded-xl border p-4 space-y-3"
                style={{ borderColor: "var(--line)", background: "var(--input-bg)" }}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className="form-input"
                    value={exp.company}
                    onChange={(e) => updateExp(i, "company", e.target.value)}
                    placeholder="Entreprise"
                  />
                  <input
                    className="form-input"
                    value={exp.role}
                    onChange={(e) => updateExp(i, "role", e.target.value)}
                    placeholder="Poste occupé"
                  />
                  <input
                    className="form-input sm:col-span-2"
                    value={exp.period}
                    onChange={(e) => updateExp(i, "period", e.target.value)}
                    placeholder="Période (ex: Jan 2023 – Déc 2024)"
                  />
                  <textarea
                    className="form-input sm:col-span-2 resize-y"
                    value={exp.desc}
                    onChange={(e) => updateExp(i, "desc", e.target.value)}
                    placeholder="Description de vos tâches…"
                  />
                </div>
                <button
                  onClick={() => removeExp(i)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold" style={{ color: "var(--heading)" }}>
                Formation
              </h2>
              <button onClick={addEdu} className="btn-secondary text-xs px-3 py-1.5">
                + Ajouter
              </button>
            </div>
            {cv.education.map((edu, i) => (
              <div
                key={i}
                className="rounded-xl border p-4 space-y-3"
                style={{ borderColor: "var(--line)", background: "var(--input-bg)" }}
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <input
                    className="form-input"
                    value={edu.school}
                    onChange={(e) => updateEdu(i, "school", e.target.value)}
                    placeholder="Établissement"
                  />
                  <input
                    className="form-input"
                    value={edu.degree}
                    onChange={(e) => updateEdu(i, "degree", e.target.value)}
                    placeholder="Diplôme"
                  />
                  <input
                    className="form-input"
                    value={edu.year}
                    onChange={(e) => updateEdu(i, "year", e.target.value)}
                    placeholder="Année"
                  />
                </div>
                <button
                  onClick={() => removeEdu(i)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>

          {/* PDF Upload */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold" style={{ color: "var(--heading)" }}>
              Importer un CV PDF
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Vous pouvez uploader directement votre CV au format PDF. Il sera visible sur votre profil.
            </p>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 transition-all hover:border-violet-400/50"
              style={{ borderColor: "var(--line)" }}>
              <span className="text-4xl">📎</span>
              <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                Cliquez pour choisir un fichier PDF
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Max 5 MB
              </span>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                className="hidden"
              />
            </label>
            {cv.pdfPath && (
              <p className="text-sm text-emerald-400">
                ✅ PDF actuel :{" "}
                <a href={cv.pdfPath} target="_blank" rel="noopener noreferrer" className="underline">
                  Voir le fichier
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="sticky top-24">
          <div
            className="rounded-2xl border p-6 space-y-5"
            style={{
              background: "var(--panel-strong)",
              borderColor: "var(--line)",
              boxShadow: "0 20px 60px rgba(124,58,237,0.15)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-400 text-lg font-bold text-white">
                {cv.fullName?.[0] ?? "?"}
              </div>
              <div>
                <p className="font-bold" style={{ color: "var(--heading)" }}>
                  {cv.fullName || "Votre nom"}
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {cv.title || "Votre titre"}
                </p>
              </div>
            </div>

            {cv.summary && (
              <p className="text-sm leading-6" style={{ color: "var(--text)" }}>
                {cv.summary}
              </p>
            )}

            {cv.skills.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: "var(--text-muted)" }}>
                  Compétences
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cv.skills.map((s, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-violet-500/20 border border-violet-400/30 px-2.5 py-0.5 text-xs text-violet-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {cv.experience.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: "var(--text-muted)" }}>
                  Expériences
                </p>
                <div className="space-y-2">
                  {cv.experience.map((e, i) => (
                    <div key={i}>
                      <p className="text-sm font-medium" style={{ color: "var(--heading)" }}>
                        {e.role} @ {e.company}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {e.period}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cv.education.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: "var(--text-muted)" }}>
                  Formation
                </p>
                {cv.education.map((e, i) => (
                  <div key={i} className="text-sm">
                    <span style={{ color: "var(--heading)" }}>{e.degree}</span>{" "}
                    <span style={{ color: "var(--text-muted)" }}>— {e.school} ({e.year})</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t text-xs space-y-1" style={{ borderColor: "var(--line)", color: "var(--text-muted)" }}>
              {cv.phone && <p>📞 {cv.phone}</p>}
              {cv.email && <p>✉️ {cv.email}</p>}
              {cv.address && <p>📍 {cv.address}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
