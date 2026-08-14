import type { CSSProperties } from "react";

import {
  DecisionCard,
  Frame,
  Hold,
  Instrument,
  K,
  RegistryLine,
  Seal,
  St,
} from "@/system/components";

const SWATCHES = [
  ["Ink", "--ink"],
  ["Carbon", "--carbon"],
  ["Carbon 2", "--carbon2"],
  ["Paper", "--paper"],
  ["Paper 2", "--paper2"],
  ["Rule light", "--rule-l"],
  ["Rule dark", "--rule-d"],
  ["Grey 2", "--g2"],
  ["Grey 3", "--g3"],
  ["Grey 4", "--g4"],
  ["Parrit red", "--red"],
  ["Pressed red", "--red-p"],
] as const;

function Components() {
  return (
    <div className="component-stack">
      <RegistryLine />
      <Frame className="frame-demo">
        <K>Frame · open decision boundary</K>
      </Frame>
      <div className="status-row">
        <St kind="ok">Operational</St>
        <St kind="att">Attention</St>
        <St kind="crit">Critical</St>
        <St kind="done">Executed</St>
      </div>
      <Hold label="Hold to commit" doneLabel="Committed" />
      <Instrument
        left={<St kind="ok">Operational</St>}
        center={<K>Instrument specimen</K>}
        right={<K>Live</K>}
        rows={[
          { value: "State", label: "The current operating state", status: <K>Observable</K> },
          { value: "Action", label: "A surfaced operating decision", status: <K>Actionable</K> },
        ]}
      />
      <DecisionCard
        title="Approve the operating decision"
        body="A marketing-safe specimen. Committing closes the frame and writes a simulated journal line."
        action="Approve decision"
        doneLabel="Approved"
        status="att"
      />
      <Seal />
    </div>
  );
}

export default function SystemPage() {
  return (
    <main className="system-page">
      <div className="system-wrap">
        <header className="system-header">
          <div>
            <K>Internal verification surface · noindex</K>
            <h1>Parrit Command System.</h1>
          </div>
          <RegistryLine />
        </header>

        <section className="system-section" aria-labelledby="tokens-heading">
          <h2 id="tokens-heading">PC-01 / PC-02 · Tokens</h2>
          <div className="swatches">
            {SWATCHES.map(([name, token]) => (
              <div className="swatch" key={token}>
                <div
                  className="swatch-color"
                  style={{ "--swatch-color": `var(${token})` } as CSSProperties}
                />
                <div className="swatch-meta">
                  <strong>{name}</strong>
                  <K>{token}</K>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="system-section" aria-labelledby="components-heading">
          <h2 id="components-heading">PC-05 / PC-06 / PC-07 / PC-11 · Components</h2>
          <p>Every primitive is rendered in the Document and Instrument registers.</p>
          <div className="register-grid">
            <div className="register light">
              <K>Register · Document</K>
              <Components />
            </div>
            <div className="register instrument">
              <K>Register · Instrument</K>
              <Components />
            </div>
          </div>
        </section>

        <footer className="system-footer">
          <Seal />
          <RegistryLine />
        </footer>
      </div>
    </main>
  );
}
