import { Fragment, type CSSProperties } from "react";

export type FlowSize = "mini" | "full";

export interface FlowConfig {
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

function computeLayout(config: FlowConfig, size: FlowSize) {
  const isFull = size === "full";
  const chipSize = isFull ? 60 : 32;
  const hubSize = isFull ? 72 : 36;
  const spacing = isFull ? 108 : 34;
  const captionSpace = isFull ? 30 : 0;
  const nIn = config.inputs.length;
  const nOut = config.outputs.length;
  const maxN = Math.max(nIn, nOut);

  const w = isFull ? 680 : 280;
  const cxIn = isFull ? 44 : 16;
  const cxOut = w - cxIn;
  const cxHub = w / 2;

  const spread = (maxN - 1) * spacing;
  const paddingV = isFull ? 40 : 26;
  const nodesH = spread + chipSize + paddingV;
  const h = nodesH + captionSpace;

  const cy0 = nodesH / 2;

  const inputPositions: Pos[] = Array.from({ length: nIn }, (_, i) => {
    const offset = i - (nIn - 1) / 2;
    return { cx: cxIn, cy: cy0 + offset * spacing };
  });
  const outputPositions: Pos[] = Array.from({ length: nOut }, (_, i) => {
    const offset = i - (nOut - 1) / 2;
    return { cx: cxOut, cy: cy0 + offset * spacing };
  });
  const hubPos: Pos = { cx: cxHub, cy: cy0 };

  return { w, h, chipSize, hubSize, inputPositions, outputPositions, hubPos, isFull };
}

function connectorPath(from: Pos, fromR: number, to: Pos, toR: number): string {
  const inX = from.cx + fromR;
  const inY = from.cy;
  const outX = to.cx - toR;
  const outY = to.cy;
  if (Math.abs(inY - outY) < 0.5) {
    return `M ${inX} ${inY} L ${outX} ${outY}`;
  }
  const midX = (inX + outX) / 2;
  return `M ${inX} ${inY} C ${midX} ${inY} ${midX} ${outY} ${outX} ${outY}`;
}

export function FlowGraph({ config, size }: FlowGraphProps) {
  const layout = computeLayout(config, size);
  const { w, h, chipSize, hubSize, inputPositions, outputPositions, hubPos, isFull } = layout;
  const chipR = chipSize / 2;
  const hubR = hubSize / 2;

  const inConnectors = inputPositions.map((p) => connectorPath(p, chipR, hubPos, hubR));
  const outConnectors = outputPositions.map((p) => connectorPath(hubPos, hubR, p, chipR));

  return (
    <div
      className={`flow flow-${size}`}
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
            className="flow-conn-fg flow-conn-in"
            pathLength={100}
          />
        ))}
        {outConnectors.map((d, i) => (
          <path
            key={`out-fg-${i}`}
            d={d}
            className="flow-conn-fg flow-conn-out"
            pathLength={100}
          />
        ))}
        {inConnectors.map((d, i) => {
          const s: CSSProperties & Record<string, string> = {
            offsetPath: `path('${d}')`,
            offsetDistance: "0%",
            WebkitOffsetPath: `path('${d}')`,
            WebkitOffsetDistance: "0%",
          };
          return (
            <circle
              key={`in-p-${i}`}
              r={isFull ? 5 : 3.5}
              className="flow-pulse flow-pulse-in"
              style={s}
            />
          );
        })}
        {outConnectors.map((d, i) => {
          const s: CSSProperties & Record<string, string> = {
            offsetPath: `path('${d}')`,
            offsetDistance: "0%",
            WebkitOffsetPath: `path('${d}')`,
            WebkitOffsetDistance: "0%",
          };
          return (
            <circle
              key={`out-p-${i}`}
              r={isFull ? 5 : 3.5}
              className="flow-pulse flow-pulse-out"
              style={s}
            />
          );
        })}
      </svg>

      {inputPositions.map((p, i) => (
        <Fragment key={`in-${i}`}>
          <div
            className="flow-node flow-input"
            style={{
              left: p.cx - chipR,
              top: p.cy - chipR,
              width: chipSize,
              height: chipSize,
            }}
          >
            <img src={`/integrations/${config.inputs[i]}`} alt="" />
          </div>
          {isFull && config.captionsIn?.[i] ? (
            <div className="flow-caption" style={{ left: p.cx, top: p.cy + chipR + 12 }}>
              {config.captionsIn[i]}
            </div>
          ) : null}
        </Fragment>
      ))}

      <div
        className="flow-node flow-node-hub"
        style={{
          left: hubPos.cx - hubR,
          top: hubPos.cy - hubR,
          width: hubSize,
          height: hubSize,
        }}
      >
        <svg viewBox="0 0 24 24" className="flow-hub-icon" aria-hidden="true">
          <path d="M12 2 L13.6 9.2 L20.8 10.4 L15.4 14.6 L17.2 21.6 L12 17.4 L6.8 21.6 L8.6 14.6 L3.2 10.4 L10.4 9.2 Z" />
        </svg>
      </div>
      {isFull && config.captionHub ? (
        <div className="flow-caption" style={{ left: hubPos.cx, top: hubPos.cy + hubR + 12 }}>
          {config.captionHub}
        </div>
      ) : null}

      {outputPositions.map((p, i) => (
        <Fragment key={`out-${i}`}>
          <div
            className="flow-node flow-output"
            style={{
              left: p.cx - chipR,
              top: p.cy - chipR,
              width: chipSize,
              height: chipSize,
            }}
          >
            <img src={`/integrations/${config.outputs[i]}`} alt="" />
          </div>
          {isFull && config.captionsOut?.[i] ? (
            <div className="flow-caption" style={{ left: p.cx, top: p.cy + chipR + 12 }}>
              {config.captionsOut[i]}
            </div>
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}
