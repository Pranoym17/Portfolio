/**
 * The markers left in every unfinished content slot.
 *
 * This lives in its own module for one reason: `scripts/static-audit.mjs` and
 * `scripts/prelaunch-audit.mjs` scan content files as plain text, so a rule list
 * written inside `site.ts` would match itself and the audit could never pass.
 * Both scripts skip this path — see the exclusion in `static-audit.mjs`.
 *
 * Keep in sync with the `placeholders` list in `scripts/prelaunch-audit.mjs`:
 * the audit blocks the release command, `isTemplateSite` blocks indexing, and
 * the two must agree about what "unfinished" means.
 */
export const PLACEHOLDER_MARKER =
  /you@example\.com|yourusername|yourdomain\.com|replace this|update this line|your university|sample outcome/i;

/** True when any string anywhere in `value` still carries a placeholder marker. */
export function hasPlaceholder(value: unknown) {
  return PLACEHOLDER_MARKER.test(JSON.stringify(value));
}
