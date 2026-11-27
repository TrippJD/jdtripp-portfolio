/**
 * Wraps a section label in orange square brackets, e.g. "[ Flight log ]".
 * The brackets are decorative, so screen readers skip them.
 */
export function Brackets({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span aria-hidden="true" className="text-flare">
        [
      </span>{" "}
      {children}{" "}
      <span aria-hidden="true" className="text-flare">
        ]
      </span>
    </>
  );
}
