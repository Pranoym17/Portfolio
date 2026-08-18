export function ExternalIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M5 3.5H3.75C3.06 3.5 2.5 4.06 2.5 4.75V11.25C2.5 11.94 3.06 12.5 3.75 12.5H10.25C10.94 12.5 11.5 11.94 11.5 11.25V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8 2.5H12.5V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 8L12.25 2.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
