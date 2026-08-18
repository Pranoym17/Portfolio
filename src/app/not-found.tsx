import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="broken-object" aria-hidden="true"><i /><i /><i /></div>
      <span className="mini-label">404 / NOT FOUND</span>
      <h1>Well, this wasn&apos;t <em>supposed to happen.</em></h1>
      <p>The page is missing. The portfolio is probably still intact.</p>
      <Link className="button-primary" href="/">Return home</Link>
      <small>Note to self: stop blaming the weird floating things.</small>
    </main>
  );
}
