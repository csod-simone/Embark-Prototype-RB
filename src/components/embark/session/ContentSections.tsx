import type { ReviewSection } from "@/data/reviewContent";

/** Renders registry content sections using the established article typography. */
export function ContentSections({
  intro,
  sections,
}: {
  intro?: string;
  sections: ReviewSection[];
}) {
  return (
    <>
      {intro && <p>{intro}</p>}
      {sections.map((s) => (
        <section key={s.heading} className="space-y-3">
          <h2 className="text-lg font-bold">{s.heading}</h2>
          {s.paragraphs?.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {s.bullets &&
            (s.ordered ? (
              <ol className="list-decimal pl-5 space-y-2">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ol>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ))}
        </section>
      ))}
    </>
  );
}