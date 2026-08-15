"use client";

/*
 * Marketing-safe DecisionCard: it preserves the reference visual and interaction
 * contract, but its commit callback has no side effect unless a caller supplies one.
 */
import { useState } from "react";

import { Frame } from "./Frame";
import { Hold } from "./Hold";
import { K } from "./K";
import { St, type StatusKind } from "./St";

type DecisionCardProps = {
  title: string;
  body: string;
  action: string;
  doneLabel: string;
  status: StatusKind;
  onCommit?: () => void;
};

const noOp = () => undefined;

export function DecisionCard({
  title,
  body,
  action,
  doneLabel,
  status,
  onCommit = noOp,
}: DecisionCardProps) {
  const [isDone, setDone] = useState(false);
  const [closing, setClosing] = useState(false);

  const commit = () => {
    setClosing(true);
    window.setTimeout(() => setDone(true), 240);
    onCommit();
  };

  const inner = (
    <>
      <div className="decision-head">
        <h3>{title}</h3>
        {isDone ? <St kind="done">Executed</St> : <St kind={status}>{status}</St>}
      </div>
      <p>{body}</p>
      <div className="decision-foot">
        <Hold label={action} doneLabel={doneLabel} onCommit={commit} />
      </div>
      {isDone ? <K className="journal-line">Journal · simulated marketing commit recorded</K> : null}
    </>
  );

  /* Un seul wrapper dans les deux états : changer d'élément démontait le
     sous-arbre et réarmait le Hold sous un titre « Executed ». */
  return (
    <Frame closed={closing || isDone} className="decision-card" data-done={isDone || undefined}>
      {inner}
    </Frame>
  );
}
