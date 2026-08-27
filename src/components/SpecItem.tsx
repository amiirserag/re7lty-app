interface Props {
  label: string;
  value: string;
}

export function SpecItem({ label, value }: Props) {
  return (
    <div className="spec-item">
      <div className="value">{value}</div>
      <div className="label">{label}</div>
    </div>
  );
}
