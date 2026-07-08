import type { CvProfileData } from "@/lib/cv-types";

export function CvPreview({ data }: { data: CvProfileData }) {
  const { personal_details: pd } = data;
  const isModern = data.selected_template === "modern";

  return (
    <div
      id="cv-preview-content"
      className={
        isModern
          ? "mx-auto max-w-[210mm] bg-white p-10 text-gray-900 shadow-sm"
          : "mx-auto max-w-[210mm] bg-white p-10 text-gray-900 shadow-sm"
      }
    >
      <header className={isModern ? "border-b-4 border-primary pb-4" : "border-b border-gray-300 pb-4 text-center"}>
        <h1 className={isModern ? "text-3xl font-bold text-primary" : "text-3xl font-bold"}>
          {pd.full_name || "Your Name"}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {[pd.phone, pd.email, pd.address, pd.linkedin].filter(Boolean).join("  ·  ")}
        </p>
      </header>

      {data.professional_summary && (
        <section className="mt-6">
          <h2 className={isModern ? "text-sm font-bold uppercase tracking-wide text-primary" : "text-sm font-bold uppercase tracking-wide"}>
            Professional Summary
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">{data.professional_summary}</p>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mt-6">
          <h2 className={isModern ? "text-sm font-bold uppercase tracking-wide text-primary" : "text-sm font-bold uppercase tracking-wide"}>
            Education
          </h2>
          <div className="mt-2 space-y-3">
            {data.education.map((e, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{e.qualification}</span>
                  <span className="text-gray-500">{e.start_year}–{e.end_year}</span>
                </div>
                <p className="text-sm text-gray-600">{e.institution}</p>
                {e.description && <p className="mt-1 text-sm text-gray-600">{e.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.work_experience.length > 0 && (
        <section className="mt-6">
          <h2 className={isModern ? "text-sm font-bold uppercase tracking-wide text-primary" : "text-sm font-bold uppercase tracking-wide"}>
            Work Experience
          </h2>
          <div className="mt-2 space-y-3">
            {data.work_experience.map((w, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{w.role}</span>
                  <span className="text-gray-500">{w.start_date}–{w.end_date}</span>
                </div>
                <p className="text-sm text-gray-600">{w.employer}</p>
                {w.description && <p className="mt-1 text-sm text-gray-600">{w.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="mt-6">
          <h2 className={isModern ? "text-sm font-bold uppercase tracking-wide text-primary" : "text-sm font-bold uppercase tracking-wide"}>
            Skills
          </h2>
          <p className="mt-2 text-sm text-gray-700">{data.skills.join(" · ")}</p>
        </section>
      )}

      {data.languages.length > 0 && (
        <section className="mt-6">
          <h2 className={isModern ? "text-sm font-bold uppercase tracking-wide text-primary" : "text-sm font-bold uppercase tracking-wide"}>
            Languages
          </h2>
          <p className="mt-2 text-sm text-gray-700">{data.languages.join(" · ")}</p>
        </section>
      )}

      {data.volunteer_work.length > 0 && (
        <section className="mt-6">
          <h2 className={isModern ? "text-sm font-bold uppercase tracking-wide text-primary" : "text-sm font-bold uppercase tracking-wide"}>
            Volunteer Work
          </h2>
          <div className="mt-2 space-y-2">
            {data.volunteer_work.map((v, i) => (
              <div key={i} className="text-sm">
                <span className="font-medium">{v.role}</span> — <span className="text-gray-600">{v.organisation}</span>
                {v.description && <p className="text-gray-600">{v.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.achievements.length > 0 && (
        <section className="mt-6">
          <h2 className={isModern ? "text-sm font-bold uppercase tracking-wide text-primary" : "text-sm font-bold uppercase tracking-wide"}>
            Achievements
          </h2>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {data.achievements.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </section>
      )}

      {data.certificates.length > 0 && (
        <section className="mt-6">
          <h2 className={isModern ? "text-sm font-bold uppercase tracking-wide text-primary" : "text-sm font-bold uppercase tracking-wide"}>
            Certificates
          </h2>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {data.certificates.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </section>
      )}

      {data.references.length > 0 && (
        <section className="mt-6">
          <h2 className={isModern ? "text-sm font-bold uppercase tracking-wide text-primary" : "text-sm font-bold uppercase tracking-wide"}>
            References
          </h2>
          <div className="mt-2 space-y-1">
            {data.references.map((r, i) => (
              <p key={i} className="text-sm text-gray-700">
                <span className="font-medium">{r.name}</span> ({r.relationship}) — {r.contact}
              </p>
            ))}
          </div>
        </section>
      )}

      {data.interests.length > 0 && (
        <section className="mt-6">
          <h2 className={isModern ? "text-sm font-bold uppercase tracking-wide text-primary" : "text-sm font-bold uppercase tracking-wide"}>
            Interests
          </h2>
          <p className="mt-2 text-sm text-gray-700">{data.interests.join(" · ")}</p>
        </section>
      )}
    </div>
  );
}
