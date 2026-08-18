export const dynamic = "force-dynamic";

export async function GET() {
  const contactConfigured = Boolean(
    process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.CONTACT_FROM_EMAIL,
  );

  return Response.json(
    {
      ok: true,
      service: "pranoy-living-workspace",
      contactConfigured,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
