"use client";

import { useId, useMemo } from "react";
import type { ArchitectureEdge, ArchitectureNode } from "@/types/portfolio";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const nodeClass: Record<ArchitectureNode["type"], string> = {
  client: "arch-client",
  api: "arch-api",
  database: "arch-database",
  ai: "arch-ai",
  hardware: "arch-hardware",
  service: "arch-service",
};

export function ArchitectureDiagram({ nodes, edges }: { nodes: ArchitectureNode[]; edges: ArchitectureEdge[] }) {
  const rawId = useId();
  const reducedMotion = useReducedMotion();
  const markerId = `arch-arrow-${rawId.replace(/:/g, "")}`;
  const byId = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);

  return (
    <div className="architecture-wrap">
      <svg className="architecture-svg" viewBox="0 0 100 100" role="img" aria-label="Project architecture diagram">
        <defs>
          <marker id={markerId} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L6,3 z" fill="currentColor" />
          </marker>
        </defs>
        <g className="architecture-edges">
          {edges.map((edge, index) => {
            const from = byId.get(edge.from);
            const to = byId.get(edge.to);
            if (!from || !to) return null;
            const midX = (from.x + to.x) / 2;
            const d = `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
            return (
              <g key={`${edge.from}-${edge.to}`}>
                <path d={d} markerEnd={`url(#${markerId})`} />
                {!reducedMotion && (
                  <circle r="1.1" className="architecture-packet">
                    <animateMotion dur={`${2.6 + index * 0.22}s`} repeatCount="indefinite" path={d} />
                  </circle>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      <div className="architecture-nodes" aria-hidden="true">
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`architecture-node ${nodeClass[node.type]}`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <span>{node.label}</span>
            <small>{node.type}</small>
          </div>
        ))}
      </div>
      <div className="sr-only">
        {nodes.map((node) => <span key={node.id}>{node.label}. </span>)}
      </div>
    </div>
  );
}
