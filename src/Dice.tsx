import "./Dice.css";

export function Dice({ value }: { value: number }) {
  return (
    <div className="dice" data-value={value}>
      {Array.from({ length: value }).map((_, i) => (
        <div className="dice-circle" key={i} />
      ))}
    </div>
  );
}
