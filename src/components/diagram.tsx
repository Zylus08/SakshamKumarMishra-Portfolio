export function Diagram({
  steps = ["Input", "Representation", "Evaluation"],
  caption = "Conceptual workflow — not a verified implementation",
}: {
  steps?: string[] | string;
  caption?: string;
}) {
  // Literal attributes survive MDX's JavaScript blocking; labels remain React text.
  const labels = typeof steps === "string" ? steps.split("|") : steps;
  return (
    <figure className="diagram">
      <div>
        {labels.map((step, i) => (
          <span key={step}>
            <small>0{i + 1}</small>
            {step}
            {i < labels.length - 1 && <b aria-hidden="true">→</b>}
          </span>
        ))}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
export function Note({ children }: { children: React.ReactNode }) {
  return <aside className="note">{children}</aside>;
}
export function BenchmarkTable({
  rows,
}: {
  rows: { metric: string; value: string; context: string }[];
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Conditions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.metric}>
              <td>{r.metric}</td>
              <td>{r.value}</td>
              <td>{r.context}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
