"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Portfolio route error", error);
  }, [error]);

  return (
    <main className="not-found-page" role="alert">
      <div className="broken-object" aria-hidden="true"><i /><i /><i /></div>
      <span className="mini-label">500 / SOMETHING BROKE</span>
      <h1>The weird floating things got a little too weird.</h1>
      <p>The core site hit an unexpected error. You can retry this view or head back home.</p>
      <div className="error-actions">
        <button className="button-primary" type="button" onClick={reset}>Try again</button>
        <Link className="button-secondary" href="/">Back home</Link>
      </div>
      {error.digest && <small>Reference: {error.digest}</small>}
    </main>
  );
}
