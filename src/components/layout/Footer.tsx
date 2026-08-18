import { siteConfig } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <span>Designed + built by {siteConfig.name}</span>
      <span>{siteConfig.location} · {year}</span>
      <a href="#home">Back to top ↑</a>
      <small>Yes, I made the weird floating things too.</small>
    </footer>
  );
}
