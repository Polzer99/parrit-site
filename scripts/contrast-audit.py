#!/usr/bin/env python3
"""Automated DOM contrast audit. Walks every text node, computes effective
foreground/background colors, flags WCAG contrast < 3.0 (black-on-black ~1.0)."""
import sys, json
from playwright.sync_api import sync_playwright

import os
BASE = os.environ.get("PARRIT_BASE", "http://localhost:3000")

# JS that runs in the page: returns list of low-contrast text elements.
AUDIT_JS = r"""
() => {
  function parseColor(c) {
    // returns [r,g,b,a]
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map(s => parseFloat(s.trim()));
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  }
  function lum([r,g,b]) {
    const a = [r,g,b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4);
    });
    return 0.2126*a[0] + 0.7152*a[1] + 0.0722*a[2];
  }
  function contrast(fg, bg) {
    const L1 = lum(fg), L2 = lum(bg);
    const hi = Math.max(L1,L2), lo = Math.min(L1,L2);
    return (hi + 0.05) / (lo + 0.05);
  }
  // composite an rgba over a solid bg
  function over(fg, bg) {
    const a = fg[3];
    return [
      fg[0]*a + bg[0]*(1-a),
      fg[1]*a + bg[1]*(1-a),
      fg[2]*a + bg[2]*(1-a),
    ];
  }
  function effBg(el) {
    let node = el;
    let bg = [254,253,249]; // body cream default
    const stack = [];
    while (node && node.nodeType === 1) {
      const s = getComputedStyle(node);
      const c = parseColor(s.backgroundColor);
      const hasImg = s.backgroundImage && s.backgroundImage !== 'none' &&
                     !s.backgroundImage.includes('url("data:image/svg+xml,%3Csvg'); // ignore noise grain
      if (c && c[3] > 0) { stack.push([c, node, hasImg]); }
      else if (hasImg) { stack.push([[null], node, hasImg]); }
      node = node.parentElement;
    }
    // resolve from outermost solid inward
    for (let i = stack.length - 1; i >= 0; i--) {
      const [c, n, hasImg] = stack[i];
      if (c[0] === null) { /* gradient/img bg, unknown — keep prev but mark */ return {bg, img:true, imgNode:n}; }
      bg = c[3] >= 1 ? [c[0],c[1],c[2]] : over(c, bg);
    }
    return {bg, img:false};
  }

  const out = [];
  const els = document.querySelectorAll('body *');
  for (const el of els) {
    // must have its own visible text (not just whitespace), not be hidden
    const direct = Array.from(el.childNodes)
      .filter(n => n.nodeType === 3)
      .map(n => n.textContent.trim())
      .join('').trim();
    if (!direct) continue;
    const s = getComputedStyle(el);
    if (s.visibility === 'hidden' || s.display === 'none' || parseFloat(s.opacity) < 0.05) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) continue;
    const fg = parseColor(s.color);
    if (!fg) continue;
    const {bg, img} = effBg(el);
    const fgc = fg[3] < 1 ? over(fg, bg) : [fg[0],fg[1],fg[2]];
    const ratio = contrast(fgc, bg);
    if (ratio < 3.0) {
      out.push({
        ratio: Math.round(ratio*100)/100,
        text: direct.slice(0, 70),
        tag: el.tagName.toLowerCase(),
        cls: (el.className && el.className.toString ? el.className.toString() : '').slice(0,80),
        color: s.color,
        bg: 'rgb('+bg.map(Math.round).join(',')+')',
        fontSize: s.fontSize,
        img: !!img,
      });
    }
  }
  return out;
}
"""

def audit_page(page, label):
    try:
        findings = page.evaluate(AUDIT_JS)
    except Exception as e:
        return {"label": label, "error": str(e), "findings": []}
    return {"label": label, "findings": findings}

def run(routes):
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(viewport={"width": 1440, "height": 1024})
        page = ctx.new_page()
        for route in routes:
            url = BASE + route
            try:
                page.goto(url, wait_until="networkidle", timeout=30000)
            except Exception as e:
                results.append({"label": route, "error": "goto:"+str(e), "findings": []})
                continue
            page.wait_for_timeout(600)
            results.append(audit_page(page, route))
            # On the homepage, open every modal and audit each
            if route.rstrip("/").endswith(("/fr", "/en")) or route.rstrip("/") in ("", "/fr", "/en"):
                triggers = page.query_selector_all(".parrit-os-icon, .parrit-os-offer, .parrit-os-cta, .parrit-os-mobile-offer")
                seen = set()
                # re-query by index because DOM is stable; open each dock/offer item
                count = len(triggers)
                for i in range(count):
                    btns = page.query_selector_all(".parrit-os-icon, .parrit-os-offer")
                    if i >= len(btns):
                        break
                    b = btns[i]
                    try:
                        txt = (b.inner_text() or "").strip()[:30]
                        if txt in seen:
                            continue
                        seen.add(txt)
                        b.click(timeout=3000)
                        page.wait_for_selector("[role=dialog]", timeout=3000)
                        page.wait_for_timeout(400)
                        results.append(audit_page(page, f"{route}::modal::{txt}"))
                        page.keyboard.press("Escape")
                        page.wait_for_timeout(250)
                    except Exception:
                        try:
                            page.keyboard.press("Escape")
                        except Exception:
                            pass
                        continue
        browser.close()
    return results

if __name__ == "__main__":
    routes = sys.argv[1:] or ["/fr"]
    res = run(routes)
    total = 0
    for r in res:
        fs = r.get("findings", [])
        if r.get("error"):
            print(f"\n### {r['label']}  ERROR: {r['error']}")
            continue
        if not fs:
            print(f"\n### {r['label']}  ✓ clean")
            continue
        # dedup by (cls,color,bg,text)
        uniq = {}
        for f in fs:
            k = (f['cls'], f['color'], f['bg'], f['text'])
            uniq[k] = f
        fs = sorted(uniq.values(), key=lambda x: x['ratio'])
        total += len(fs)
        print(f"\n### {r['label']}  — {len(fs)} low-contrast")
        for f in fs:
            flag = "  ⚠IMG-BG" if f['img'] else ""
            print(f"  [{f['ratio']:>4}] <{f['tag']} .{f['cls']}>  fg={f['color']} bg={f['bg']} sz={f['fontSize']}{flag}")
            print(f"         “{f['text']}”")
    print(f"\n===== TOTAL low-contrast (dedup per route): {total} =====")
