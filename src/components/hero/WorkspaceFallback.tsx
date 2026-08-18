import Image from "next/image";

export function WorkspaceFallback() {
  return (
    <div className="workspace-fallback" aria-hidden="true">
      <div className="fallback-orbit fallback-orbit-a" />
      <div className="fallback-orbit fallback-orbit-b" />
      <div className="fallback-portrait">
        <Image src="/portrait/portrait-fallback.webp" alt="" fill sizes="(max-width: 820px) 60vw, 28vw" priority />
        <div className="fallback-scan-line" />
      </div>
      <div className="fallback-laptop"><span /></div>
      <div className="fallback-pcb"><i /><i /><i /></div>
    </div>
  );
}
