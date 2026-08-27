interface Row {
  label: string;
  value: string;
  emphasize?: boolean;
}

interface Props {
  rows: Row[];
  title?: string;
}

export function BookingSummaryCard({ rows, title = "Trip summary" }: Props) {
  return (
    <div className="booking-summary">
      <div className="eyebrow" style={{ marginBottom: 10 }}>
        {title}
      </div>
      {rows.map((row) => (
        <div key={row.label} className={`row ${row.emphasize ? "total" : ""}`}>
          <span className={row.emphasize ? undefined : "text-muted"}>{row.label}</span>
          <span>{row.value}</span>
        </div>
      ))}
    </div>
  );
}
