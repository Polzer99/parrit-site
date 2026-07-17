"use client";
import { useEffect, useRef } from "react";

// Section signature : input -> 速 -> output. « Montrer pas prouver » rendu littéral.
// Motion sobre : la sortie se tape, la ligne rouge traverse le sceau. Boucle sur des
// cas réels anonymisés. Sans JS ou reduced-motion : premier cas affiché, statique.
export type IOCopy = {
  eyebrow: string;
  title: string;
  sub: string;
  foot: string;
  labIn: string;
  labOut: string;
  cases: { i: string; o: string }[];
};

export default function InputOutputFlow({ copy }: { copy: IOCopy }) {
  const ioRef = useRef<HTMLDivElement>(null);
  const inRef = useRef<HTMLParagraphElement>(null);
  const outRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const io = ioRef.current, inTxt = inRef.current, outTxt = outRef.current;
    if (!io || !inTxt || !outTxt) return;
    const CASES = copy.cases;
    if (!CASES.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      inTxt.textContent = CASES[0].i;
      outTxt.textContent = CASES[0].o;
      io.classList.add("fire", "done");
      return;
    }

    let idx = 0;
    let timers: number[] = [];
    const after = (ms: number, fn: () => void) => {
      const t = window.setTimeout(fn, ms);
      timers.push(t);
      return t;
    };

    const type = (el: HTMLElement, text: string, cb: () => void) => {
      el.textContent = "";
      const car = document.createElement("span");
      car.className = "io-caret";
      car.innerHTML = "&nbsp;";
      el.appendChild(car);
      let n = 0;
      const step = () => {
        if (n <= text.length) {
          car.remove();
          el.textContent = text.slice(0, n);
          el.appendChild(car);
          n++;
          after(26, step);
        } else {
          car.remove();
          cb();
        }
      };
      step();
    };

    const cycle = () => {
      const c = CASES[idx];
      io.classList.remove("fire", "done");
      inTxt.classList.add("swap");
      outTxt.classList.add("swap");
      after(320, () => {
        inTxt.textContent = c.i;
        outTxt.textContent = "";
        inTxt.classList.remove("swap");
        outTxt.classList.remove("swap");
        after(260, () => {
          io.classList.add("fire");
          after(720, () => {
            io.classList.add("done");
            type(outTxt, c.o, () => {
              after(2100, () => {
                idx = (idx + 1) % CASES.length;
                cycle();
              });
            });
          });
        });
      });
    };

    inTxt.textContent = "";
    outTxt.textContent = "";
    const kick = after(400, cycle);

    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers = [];
      clearTimeout(kick);
    };
  }, [copy]);

  return (
    <section className="hd-io" data-reveal aria-labelledby="hd-io-h">
      <div className="hd-io-wrap">
        <p className="hd-io-eyebrow">{copy.eyebrow}</p>
        <h2 id="hd-io-h" className="hd-io-title">{copy.title}</h2>
        <p className="hd-io-sub">{copy.sub}</p>

        <div className="hd-io-flow" ref={ioRef}>
          <div className="hd-io-card in">
            <span className="hd-io-lab"><span className="hd-io-dot" />{copy.labIn}</span>
            <p className="hd-io-txt" ref={inRef}>{copy.cases[0]?.i}</p>
          </div>
          <div className="hd-io-spine">
            <div className="hd-io-line"><div className="hd-io-line-fill" /></div>
            <div className="hd-io-seal">速</div>
          </div>
          <div className="hd-io-card out">
            <span className="hd-io-lab"><span className="hd-io-dot" />{copy.labOut}</span>
            <p className="hd-io-txt" ref={outRef}>{copy.cases[0]?.o}</p>
          </div>
        </div>

        <p className="hd-io-foot">{copy.foot}</p>
      </div>

      <style>{`
        .hd-io { max-width: 1060px; margin: 0 auto; padding: 66px 24px 60px; text-align: center; }
        .hd-io-wrap { position: relative; }
        .hd-io-eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: .22em; text-transform: uppercase; color: var(--red); margin: 0 0 16px; }
        .hd-io-title { font-family: var(--font-heading); font-weight: 600; color: var(--ink); font-size: clamp(26px, 3.6vw, 42px); line-height: 1.04; letter-spacing: -.02em; text-wrap: balance; margin: 0 auto 8px; max-width: 16ch; }
        .hd-io-sub { font-family: var(--font-mono); font-size: 13.5px; line-height: 1.6; color: var(--muted); margin: 0 auto 40px; max-width: 54ch; }
        .hd-io-flow { display: grid; grid-template-columns: 1fr auto 1fr; align-items: stretch; border: 1px solid var(--line); background: var(--bg); text-align: left; }
        .hd-io-card { padding: 28px 26px; min-height: 148px; display: flex; flex-direction: column; }
        .hd-io-card.out { border-left: 1px solid var(--line); }
        .hd-io-lab { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .2em; text-transform: uppercase; color: var(--muted); margin: 0 0 14px; display: flex; align-items: center; gap: 8px; }
        .hd-io-dot { width: 6px; height: 6px; background: var(--line); }
        .hd-io-card.out .hd-io-dot { background: var(--red); }
        .hd-io-txt { font-family: var(--font-mono); font-size: clamp(15px, 1.7vw, 19px); line-height: 1.34; color: var(--ink); margin: 0; transition: opacity .32s ease, transform .32s ease; }
        .hd-io-txt.swap { opacity: 0; transform: translateY(6px); }
        .hd-io-caret { display: inline-block; width: .5ch; background: var(--red); animation: hd-io-blink 1s steps(1) infinite; margin-left: 1px; }
        @keyframes hd-io-blink { 50% { opacity: 0; } }
        .hd-io-spine { position: relative; width: 104px; display: flex; align-items: center; justify-content: center; border-left: 1px solid var(--line); }
        .hd-io-line { position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: var(--line); transform: translateY(-.5px); }
        .hd-io-line-fill { position: absolute; left: 0; top: 0; height: 100%; width: 100%; background: var(--red); transform: scaleX(0); transform-origin: left center; transition: transform .7s cubic-bezier(.7,0,.3,1); }
        .hd-io-flow.fire .hd-io-line-fill { transform: scaleX(1); }
        .hd-io-seal { position: relative; z-index: 2; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-size: 22px; line-height: 1; color: var(--red); background: var(--bg); border: 1.5px solid var(--red); border-radius: 999px; transition: transform .3s ease, background .3s ease, color .3s ease; }
        .hd-io-flow.fire .hd-io-seal { transform: scale(1.12); }
        .hd-io-flow.done .hd-io-seal { background: var(--red); color: #fff; }
        .hd-io-foot { font-family: var(--font-mono); font-size: 11px; letter-spacing: .04em; color: var(--muted); margin: 32px 0 0; }
        .hd-io-foot b { color: var(--ink); font-weight: 400; }
        @media (max-width: 720px) {
          .hd-io-flow { grid-template-columns: 1fr; }
          .hd-io-card.out { border-left: none; border-top: 1px solid var(--line); }
          .hd-io-spine { width: auto; height: 54px; border-left: none; border-top: 1px solid var(--line); }
          .hd-io-line { left: 50%; right: auto; top: 0; bottom: 0; width: 1px; height: 100%; }
          .hd-io-line-fill { width: 100%; height: 100%; transform-origin: top center; transform: scaleY(0); }
          .hd-io-flow.fire .hd-io-line-fill { transform: scaleY(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hd-io-txt, .hd-io-line-fill, .hd-io-seal { transition: none; }
          .hd-io-caret { animation: none; }
        }
      `}</style>
    </section>
  );
}
