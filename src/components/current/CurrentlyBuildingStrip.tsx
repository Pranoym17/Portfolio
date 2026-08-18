import { siteConfig } from "@/content/site";

export function CurrentlyBuildingStrip() {
  return (
    <aside className="currently-strip" aria-label="Currently building">
      <div className="currently-strip-status"><i aria-hidden="true" /><span>NOW</span></div>
      <div>
        <span className="mini-label">CURRENTLY BUILDING</span>
        <h2>{siteConfig.currentlyBuilding.title}</h2>
      </div>
      <p>{siteConfig.currentlyBuilding.description}</p>
      <span className="currently-update">{siteConfig.currentlyBuilding.updated}</span>
    </aside>
  );
}
