import { Fragment, useEffect, useState, type CSSProperties } from "react";

export type FlowSize = "mini" | "full";
export type FlowVariant =
  | "fan-in-radar"
  | "symmetric-h"
  | "fan-out"
  | "funnel-merge";

export interface FlowConfig {
  variant: FlowVariant;
  inputs: string[];
  hub: true;
  outputs: string[];
  caption: string;
  captionsIn?: string[];
  captionsOut?: string[];
  captionHub?: string;
}

interface FlowGraphProps {
  config: FlowConfig;
  size: FlowSize;
}

interface Pos {
  cx: number;
  cy: number;
}

type Stage = "idle" | "s1" | "s2" | "s3" | "s4";

/* Sequential timeline (ms) — every element keys off this. */
const DURATIONS: Record<Stage, number> = {
  idle: 380,
  s1: 1300, // input connectors fill + input pulses travel
  s2: 560, // hub pulses
  s3: 1400, // output connectors fill + output pulses travel
  s4: 640, // hold
};

const NEXT: Record<Stage, Stage> = {
  idle: "s1",
  s1: "s2",
  s2: "s3",
  s3: "s4",
  s4: "idle",
};

function useSequentialStage(): Stage {
  const [stage, setStage] = useState<Stage>("idle");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setStage("s4");
      return;
    }
    let mounted = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let current: Stage = "s1";
    const tick = () => {
      if (!mounted) return;
      setStage(current);
      const delay = DURATIONS[current];
      current = NEXT[current];
      timer = setTimeout(tick, delay);
    };
    // small kickoff so it doesn't start at the very first paint frame
    timer = setTimeout(tick, 60);
    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
    };
  }, []);
  return stage;
}

function computeLayout(config: FlowConfig, size: FlowSize) {
  const isFull = size === "full";
  const chipSize = isFull ? 60 : 32;
  const hubSize = isFull ? 78 : 38;
  const captionSpace = isFull ? 30 : 0;
  const nIn = config.inputs.length;
  const nOut = config.outputs.length;

  // Per-variant spacing tweaks so each layout has its own rhythm.
  const inSpacing = (() => {
    switch (config.variant) {
      case "fan-in-radar":
        return isFull ? 104 : 34;
      case "symmetric-h":
        return isFull ? 128 : 42;
      case "fan-out":
        return isFull ? 132 : 44;
      case "funnel-merge":
        return isFull ? 96 : 32;
    }
  })();
  const outSpacing = (() => {
    switch (config.variant) {
      case "fan-in-radar":
        return isFull ? 128 : 42;
      case "symmetric-h":
        return isFull ? 128 : 42;
      case "fan-out":
        return isFull ? 100 : 34;
      case "funnel-merge":
        return isFull ? 0 : 0;
    }
  })();

  const maxSpread = Math.max(
    (nIn - 1) * inSpacing,
    (nOut - 1) * outSpacing
  );
  const w = isFull ? 700 : 288;
  const cxIn = isFull ? 52 : 18;
  const cxOut = w - cxIn;
  const cxHub = w / 2;

  const paddingV = isFull ? 44 : 30;
  const nodesH = maxSpread + chipSize + paddingV;
  const h = nodesH + captionSpace;
  const cy0 = nodesH / 2;

  const inputPositions: Pos[] = Array.from({ length: nIn }, (_, i) => {
    const offset = i - (nIn - 1) / 2;
    // For fan-in-radar, gently push the outer inputs OUTWARD along x
    // to sell a "converging fan" feel.
    let cx = cxIn;
    if (config.variant === "fan-in-radar" && nIn >= 3) {
      cx = cxIn + Math.abs(offset) * (isFull ? 6 : 2);
    }
    return { cx, cy: cy0 + offset * inSpacing };
  });
  const outputPositions: Pos[] = Array.from({ length: nOut }, (_, i) => {
    const offset = i - (nOut - 1) / 2;
    let cx = cxOut;
    if (config.variant === "fan-out" && nOut >= 3) {
      cx = cxOut - Math.abs(offset) * (isFull ? 6 : 2);
    }
    return { cx, cy: cy0 + offset * outSpacing };
  });
  const hubPos: Pos = { cx: cxHub, cy: cy0 };

  return {
    w,
    h,
    chipSize,
    hubSize,
    inputPositions,
    outputPositions,
    hubPos,
    isFull,
  };
}

/* Straight vs cubic curved connector. */
function connectorPath(
  from: Pos,
  fromR: number,
  to: Pos,
  toR: number,
  style: "curve" | "straight" | "funnel" | "arc"
): string {
  const inX = from.cx + fromR;
  const inY = from.cy;
  const outX = to.cx - toR;
  const outY = to.cy;
  if (style === "straight" || Math.abs(inY - outY) < 0.5) {
    return `M ${inX} ${inY} L ${outX} ${outY}`;
  }
  if (style === "funnel") {
    // Sharp late convergence: hold the source y most of the way, then bend.
    const bend = inX + (outX - inX) * 0.62;
    return `M ${inX} ${inY} L ${bend} ${inY} Q ${(bend + outX) / 2} ${
      (inY + outY) / 2
    } ${outX} ${outY}`;
  }
  if (style === "arc") {
    // Wider swoop — more visible curvature.
    const midX = inX + (outX - inX) * 0.45;
    const c1x = midX;
    const c1y = inY;
    const c2x = midX;
    const c2y = outY;
    return `M ${inX} ${inY} C ${c1x} ${c1y} ${c2x} ${c2y} ${outX} ${outY}`;
  }
  const midX = (inX + outX) / 2;
  return `M ${inX} ${inY} C ${midX} ${inY} ${midX} ${outY} ${outX} ${outY}`;
}

/* Hub glyphs — one per variant so hubs read as different roles. */
function HubGlyph({ variant }: { variant: FlowVariant }) {
  if (variant === "symmetric-h") {
    /* speech-bubble reply glyph */
    return (
      <svg viewBox="0 0 24 24" className="flow-hub-icon" aria-hidden="true">
        <path
          d="M4 6 h13 a2 2 0 0 1 2 2 v6 a2 2 0 0 1 -2 2 h-5 l-3.4 3 v-3 h-4.6 a2 2 0 0 1 -2 -2 v-6 a2 2 0 0 1 2 -2 z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (variant === "fan-out") {
    /* verify checkmark inside a rounded square */
    return (
      <svg viewBox="0 0 24 24" className="flow-hub-icon" aria-hidden="true">
        <path
          d="M5 12.5 l4 4 l10 -10"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (variant === "funnel-merge") {
    /* sparkle / summary glyph */
    return (
      <svg viewBox="0 0 24 24" className="flow-hub-icon" aria-hidden="true">
        <path
          d="M12 3 L13.3 9.6 L19.5 11 L13.3 12.4 L12 19 L10.7 12.4 L4.5 11 L10.7 9.6 Z"
          fill="currentColor"
        />
        <circle cx="18.5" cy="5.5" r="1.4" fill="currentColor" />
        <circle cx="5" cy="18" r="1.1" fill="currentColor" />
      </svg>
    );
  }
  /* fan-in-radar: concentric radar rings */
  return (
    <svg viewBox="0 0 24 24" className="flow-hub-icon" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
      <circle cx="12" cy="12" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.75" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
    </svg>
  );
}

export function FlowGraph({ config, size }: FlowGraphProps) {
  const stage = useSequentialStage();
  const layout = computeLayout(config, size);
  const { w, h, chipSize, hubSize, inputPositions, outputPositions, hubPos, isFull } = layout;
  const chipR = chipSize / 2;
  const hubR = hubSize / 2;

  const inStyle: "arc" | "funnel" | "straight" | "curve" =
    config.variant === "fan-in-radar"
      ? "arc"
      : config.variant === "symmetric-h"
      ? "straight"
      : config.variant === "funnel-merge"
      ? "funnel"
      : "curve";
  const outStyle: "arc" | "funnel" | "straight" | "curve" =
    config.variant === "fan-out"
      ? "arc"
      : config.variant === "symmetric-h"
      ? "straight"
      : "curve";

  const inConnectors = inputPositions.map((p) =>
    connectorPath(p, chipR, hubPos, hubR, inStyle)
  );
  const outConnectors = outputPositions.map((p) =>
    connectorPath(hubPos, hubR, p, chipR, outStyle)
  );

  const isS1Plus = stage === "s1" || stage === "s2" || stage === "s3" || stage === "s4";
  const isS2Plus = stage === "s2" || stage === "s3" || stage === "s4";
  const isS3Plus = stage === "s3" || stage === "s4";

  return (
    <div
      className={`flow flow-${size} flow-${config.variant}`}
      data-stage={stage}
      style={{ width: w, height: h }}
      aria-hidden="true"
    >
      <svg className="flow-svg" viewBox={`0 0 ${w} ${h}`}>
        {[...inConnectors, ...outConnectors].map((d, i) => (
          <path key={`bg-${i}`} d={d} className="flow-conn-bg" />
        ))}
        {inConnectors.map((d, i) => (
          <path
            key={`in-fg-${i}`}
            d={d}
            className={`flow-conn-fg flow-conn-in ${isS1Plus ? "is-lit" : ""}`}
            pathLength={100}
          />
        ))}
        {outConnectors.map((d, i) => (
          <path
            key={`out-fg-${i}`}
            d={d}
            className={`flow-conn-fg flow-conn-out ${isS3Plus ? "is-lit" : ""}`}
            pathLength={100}
          />
        ))}
        {inConnectors.map((d, i) => {
          const s: CSSProperties & Record<string, string> = {
            offsetPath: `path('${d}')`,
            WebkitOffsetPath: `path('${d}')`,
          };
          return (
            <circle
              key={`in-p-${stage}-${i}`}
              r={isFull ? 5 : 3.5}
              className={`flow-pulse flow-pulse-in ${stage === "s1" ? "is-firing" : ""}`}
              style={s}
            />
          );
        })}
        {outConnectors.map((d, i) => {
          const s: CSSProperties & Record<string, string> = {
            offsetPath: `path('${d}')`,
            WebkitOffsetPath: `path('${d}')`,
            /* staggered ripple for fan-out (payments) */
            animationDelay:
              config.variant === "fan-out" && stage === "s3"
                ? `${i * 130}ms`
                : "0ms",
          };
          return (
            <circle
              key={`out-p-${stage}-${i}`}
              r={isFull ? 5 : 3.5}
              className={`flow-pulse flow-pulse-out ${stage === "s3" ? "is-firing" : ""}`}
              style={s}
            />
          );
        })}
      </svg>

      {inputPositions.map((p, i) => (
        <Fragment key={`in-${i}`}>
          <div
            className={`flow-node flow-input ${isS1Plus ? "is-active" : ""}`}
            style={{
              left: p.cx - chipR,
              top: p.cy - chipR,
              width: chipSize,
              height: chipSize,
            }}
          >
            <img src={`/integrations/${config.inputs[i]}`} alt="" loading="lazy" decoding="async" />
          </div>
          {isFull && config.captionsIn?.[i] ? (
            <div className="flow-caption" style={{ left: p.cx, top: p.cy + chipR + 12 }}>
              {config.captionsIn[i]}
            </div>
          ) : null}
        </Fragment>
      ))}

      <div
        className={`flow-node flow-node-hub ${isS2Plus ? "is-active" : ""} ${
          stage === "s2" ? "is-pulsing" : ""
        }`}
        style={{
          left: hubPos.cx - hubR,
          top: hubPos.cy - hubR,
          width: hubSize,
          height: hubSize,
        }}
      >
        {config.variant === "fan-in-radar" ? (
          <span className="flow-hub-sweep" aria-hidden="true" />
        ) : null}
        {config.variant === "funnel-merge" ? (
          <>
            <span className="flow-hub-spark s1" aria-hidden="true" />
            <span className="flow-hub-spark s2" aria-hidden="true" />
            <span className="flow-hub-spark s3" aria-hidden="true" />
          </>
        ) : null}
        <HubGlyph variant={config.variant} />
      </div>
      {isFull && config.captionHub ? (
        <div className="flow-caption" style={{ left: hubPos.cx, top: hubPos.cy + hubR + 12 }}>
          {config.captionHub}
        </div>
      ) : null}

      {outputPositions.map((p, i) => {
        const nodeStyle: CSSProperties = {
          left: p.cx - chipR,
          top: p.cy - chipR,
          width: chipSize,
          height: chipSize,
        };
        // For fan-out (payments), stagger the pop animation so outputs
        // ripple in as their pulses arrive.
        if (config.variant === "fan-out" && stage === "s3") {
          nodeStyle.animationDelay = `${i * 130}ms`;
        }
        return (
          <Fragment key={`out-${i}`}>
            <div
              className={`flow-node flow-output ${isS3Plus ? "is-active" : ""}`}
              style={nodeStyle}
            >
              <img src={`/integrations/${config.outputs[i]}`} alt="" loading="lazy" decoding="async" />
            </div>
            {isFull && config.captionsOut?.[i] ? (
              <div className="flow-caption" style={{ left: p.cx, top: p.cy + chipR + 12 }}>
                {config.captionsOut[i]}
              </div>
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}
