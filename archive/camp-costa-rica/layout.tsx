// Page documentaire autonome : typographie DA (Geist/Geist Mono, rouge accent)
// mais mise en page éditoriale plein écran, photos 35mm, chapitres.
const campCss = `
@font-face{font-family:'Geist';src:url('/camp/fonts/geist-latin.woff2') format('woff2');font-weight:100 900;font-display:swap;unicode-range:U+0000-00FF,U+2000-206F,U+20AC}
@font-face{font-family:'Geist';src:url('/camp/fonts/geist-latin-ext.woff2') format('woff2');font-weight:100 900;font-display:swap;unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:'Geist Mono';src:url('/camp/fonts/geist-mono-latin.woff2') format('woff2');font-weight:100 900;font-display:swap;unicode-range:U+0000-00FF,U+2000-206F,U+20AC}
@font-face{font-family:'Geist Mono';src:url('/camp/fonts/geist-mono-latin-ext.woff2') format('woff2');font-weight:100 900;font-display:swap;unicode-range:U+0100-024F,U+1E00-1EFF}
:root{--c-bg:#FFFDFA;--c-ink:#0C0C0D;--c-red:#D1132F;--c-muted:#6E7079;--c-line:#D8D4CC;
  --c-dark:#111213;--c-on-dark:#EFEDE8;--c-on-dark-mut:#A9A6A0;
  --c-sans:'Geist',system-ui,-apple-system,sans-serif;--c-mono:'Geist Mono',ui-monospace,monospace}
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--c-bg);color:var(--c-ink);font-family:var(--c-sans);-webkit-font-smoothing:antialiased}
img{display:block;max-width:100%}
.cwrap{max-width:980px;margin:0 auto;padding:0 28px}

/* kicker + titres */
.ckicker{font-family:var(--c-mono);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--c-red);display:block}
.ckicker.light{color:#FF6B82}
h1,h2,h3{font-family:var(--c-sans);letter-spacing:-.035em;text-wrap:balance;margin:0}
h2{font-size:clamp(30px,4.2vw,46px);font-weight:600;line-height:1.08;margin-top:16px}
.clead{font-family:var(--c-mono);font-size:14.5px;line-height:1.8;color:var(--c-muted);max-width:680px;margin-top:22px}

/* ——— hero ——— */
.chero{position:relative;min-height:100svh;display:flex;flex-direction:column;overflow:hidden}
.chero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.chero-veil{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,8,10,.55) 0%,rgba(8,8,10,.18) 38%,rgba(8,8,10,.72) 100%)}
.cnav{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;padding:26px 34px}
.cnav-logo{height:26px;width:auto;filter:brightness(0) invert(1)}
.cfooter .cnav-logo{filter:none}
.cnav-cta{font-family:var(--c-mono);font-size:13px;color:#fff;text-decoration:none;border:1px solid rgba(255,255,255,.55);padding:10px 22px}
.cnav-cta:hover{background:#fff;color:var(--c-ink)}
.chero-inner{position:relative;z-index:2;flex:1;display:flex;flex-direction:column;justify-content:center;
  max-width:980px;margin:0 auto;width:100%;padding:40px 34px 90px}
.chero h1{color:#fff;font-size:clamp(40px,6.4vw,78px);font-weight:600;line-height:1.02;margin-top:18px;
  text-shadow:0 2px 30px rgba(0,0,0,.35)}
.chero h1 .red{color:#FF4D66}
.chero-sub{font-family:var(--c-mono);font-size:15px;line-height:1.75;color:rgba(255,255,255,.88);max-width:600px;margin-top:26px}
.cbtn{display:inline-block;font-family:var(--c-mono);font-size:14px;font-weight:500;color:#fff;background:var(--c-red);
  border:0;padding:16px 30px;margin-top:34px;text-decoration:none;cursor:pointer;width:fit-content}
.cbtn:hover{background:#B00F27}
.cbtn.wide{width:100%;text-align:center;margin-top:8px}
.chero-facts{position:absolute;left:0;right:0;bottom:0;z-index:2;display:flex;justify-content:center;align-items:center;gap:22px;
  padding:18px 20px;border-top:1px solid rgba(255,255,255,.25);backdrop-filter:blur(4px);background:rgba(8,8,10,.35);
  font-family:var(--c-mono);font-size:12.5px;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.92);flex-wrap:wrap}
.chero-facts i{width:4px;height:4px;background:var(--c-red);border-radius:0;display:block}

/* ——— sections & figures ——— */
.csection{padding:110px 0 0}
.csection > .cwrap:first-child{margin-bottom:56px}
.cfig{margin:0}
.cfig img{width:100%;height:min(72vh,640px);object-fit:cover}
.cfig figcaption{font-family:var(--c-mono);font-size:12px;color:var(--c-muted);letter-spacing:.04em;
  padding:14px 28px;max-width:980px;margin:0 auto}
.cdark .cfig figcaption{color:var(--c-on-dark-mut)}

/* histoire : liste éditoriale numérotée */
.cstory{list-style:none;margin:64px 0 90px;padding:0;border-top:1px solid var(--c-line)}
.cstory li{display:grid;grid-template-columns:90px 1fr;gap:20px;padding:30px 4px;border-bottom:1px solid var(--c-line)}
.cnum{font-family:var(--c-mono);font-size:13px;color:var(--c-red);padding-top:6px}
.cstory h3{font-size:21px;font-weight:600;letter-spacing:-.02em}
.cstory p{font-family:var(--c-mono);font-size:13.5px;line-height:1.75;color:var(--c-muted);margin:10px 0 0;max-width:640px}

/* programme : section sombre */
.cdark{background:var(--c-dark);color:var(--c-on-dark);padding-bottom:110px;margin-top:110px}
.cdark h2{color:var(--c-on-dark)}
.cphases{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:70px;border-top:1px solid rgba(255,255,255,.18)}
.cphase{padding:34px 26px 8px;border-left:1px solid rgba(255,255,255,.18)}
.cphase:first-child{border-left:0;padding-left:4px}
.cphase-days{font-family:var(--c-mono);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:#FF6B82}
.cphase h3{font-size:22px;font-weight:600;margin-top:12px;color:var(--c-on-dark)}
.cphase p{font-family:var(--c-mono);font-size:13px;line-height:1.75;color:var(--c-on-dark-mut);margin-top:12px}

/* citation */
.cquote{padding:120px 0;text-align:center}
.cquote blockquote{margin:0 auto;max-width:820px;font-size:clamp(26px,3.6vw,40px);font-weight:500;
  letter-spacing:-.03em;line-height:1.25;text-wrap:balance}
.cquote-by{font-family:var(--c-mono);font-size:12.5px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--c-muted);display:block;margin-top:28px}

/* avant / pendant / après */
.cbeforeafter{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin:64px 0 110px;border-top:1px solid var(--c-line)}
.cbeforeafter > div{padding:30px 26px 6px;border-left:1px solid var(--c-line)}
.cbeforeafter > div:first-child{border-left:0;padding-left:4px}
.cba-label{font-family:var(--c-mono);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--c-red)}
.cbeforeafter p{font-family:var(--c-mono);font-size:13.5px;line-height:1.75;color:var(--c-muted);margin-top:14px}

/* FAQ */
.cband{background:#F4F1EA;padding-bottom:110px}
.cband > .cwrap:first-child{margin-bottom:0}
.cfaq{margin-top:52px;border-top:1px solid var(--c-line)}
.cfaq details{border-bottom:1px solid var(--c-line)}
.cfaq summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:16px;
  padding:22px 4px;font-weight:600;font-size:17px;letter-spacing:-.015em}
.cfaq summary::-webkit-details-marker{display:none}
.cfaq summary::after{content:"+";font-family:var(--c-mono);font-size:19px;color:var(--c-red);flex:none}
.cfaq details[open] summary::after{content:"−"}
.cfaq details p{font-family:var(--c-mono);font-size:13.5px;line-height:1.8;color:var(--c-muted);padding:0 4px 26px;margin:0;max-width:800px}

/* candidature */
.capply{position:relative;padding:130px 0;overflow:hidden}
.capply-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.capply-veil{position:absolute;inset:0;background:rgba(10,10,12,.42)}
.capply .cwrap{position:relative;z-index:2}
.capply-card{background:var(--c-bg);max-width:640px;margin:0 auto;padding:48px 44px;border:1px solid var(--c-line)}
.capply-card h2{font-size:clamp(26px,3.4vw,34px)}
.capply-sub{font-family:var(--c-mono);font-size:13px;line-height:1.7;color:var(--c-muted);margin:16px 0 28px}
.capply-card form{display:flex;flex-direction:column;gap:12px}
.capply-row{display:flex;gap:12px;flex-wrap:wrap}
.capply-row input,.capply-row select{flex:1 1 220px}
.capply-card input,.capply-card select,.capply-card textarea{font-family:var(--c-mono);font-size:13.5px;color:var(--c-ink);
  background:#fff;border:1px solid var(--c-line);border-radius:0;padding:14px 15px;outline:none;width:100%;box-sizing:border-box}
.capply-card textarea{resize:vertical}
.capply-card input:focus,.capply-card select:focus,.capply-card textarea:focus{border-color:var(--c-ink)}
.capply-fine{font-family:var(--c-mono);font-size:11px;color:var(--c-muted);text-align:center;margin:6px 0 0}
.capply-error{font-family:var(--c-mono);font-size:12.5px;color:var(--c-red);text-align:center;margin:0}
.capply-ok{font-family:var(--c-mono);font-size:14px;line-height:1.7;text-align:center;margin:10px 0}

/* footer */
.cfooter{display:flex;justify-content:space-between;align-items:center;gap:18px;flex-wrap:wrap;
  max-width:980px;margin:0 auto;padding:44px 28px;border-top:1px solid var(--c-line)}
.cfooter span{font-family:var(--c-mono);font-size:12px;color:var(--c-muted)}
.cfooter .cnav-logo{height:22px}

/* grilles de cellules (sécurité, créations, cadre) */
.cgrid3{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:64px;border-top:1px solid var(--c-line)}
.ccell{padding:30px 26px 26px;border-left:1px solid var(--c-line);border-bottom:1px solid var(--c-line)}
.ccell:nth-child(3n+1){border-left:0;padding-left:4px}
.ccell h3{font-size:18px;font-weight:600;letter-spacing:-.015em}
.ccell p{font-family:var(--c-mono);font-size:13px;line-height:1.75;color:var(--c-muted);margin:12px 0 0}
.ccell ul{list-style:none;margin:12px 0 0;padding:0}
.ccell li{font-family:var(--c-mono);font-size:12.5px;line-height:1.7;color:var(--c-muted);padding:7px 0 7px 18px;position:relative}
.ccell li::before{content:"";position:absolute;left:0;top:14px;width:6px;height:6px;background:var(--c-red)}
.csection:last-of-type .cgrid3{margin-bottom:110px}

/* fondateur */
.cfounder{display:grid;grid-template-columns:minmax(280px,420px) 1fr;gap:56px;align-items:center;padding-bottom:110px}
.cfounder img{width:100%;height:auto;border:1px solid var(--c-line)}
.cfounder-p{font-family:var(--c-mono);font-size:13.5px;line-height:1.8;color:var(--c-muted);margin:18px 0 0;max-width:560px}
.cband .cfounder{padding-top:0}
#fondateur.cband{padding-bottom:0}

/* pour qui / pas pour qui */
.cyesno{display:grid;grid-template-columns:1fr 1fr;gap:0;margin:64px 0 110px;border-top:1px solid var(--c-line)}
.cyesno > div{padding:34px 30px 22px;border-left:1px solid var(--c-line)}
.cyesno > div:first-child{border-left:0;padding-left:4px}
.cyesno ul{list-style:none;margin:18px 0 0;padding:0}
.cyesno li{font-family:var(--c-mono);font-size:13px;line-height:1.75;color:var(--c-muted);padding:10px 0 10px 22px;position:relative;border-top:1px solid var(--c-line)}
.cyesno li:first-child{border-top:0}
.cyesno > div:first-child li::before{content:"+";position:absolute;left:0;top:9px;color:var(--c-red);font-family:var(--c-mono)}
.cyesno > div:last-child li::before{content:"\\2212";position:absolute;left:0;top:9px;color:var(--c-muted);font-family:var(--c-mono)}
.cba-label.dark{color:var(--c-muted)}
#cadre .cgrid3{margin-bottom:110px}
#securite .cgrid3{margin-bottom:110px}

/* switcher de langue + nav droite */
.cnav-right{display:flex;align-items:center;gap:20px}
.clang{font-family:var(--c-mono);font-size:12px;letter-spacing:.06em;color:rgba(255,255,255,.75)}
.clang i{font-style:normal;margin:0 6px;color:rgba(255,255,255,.4)}
.clang a{color:rgba(255,255,255,.75);text-decoration:none}
.clang a:hover{color:#fff}
.clang b{color:#fff;font-weight:700}
.cfact{display:inline-flex;align-items:center;gap:22px}

/* archives 2022 */
#archives{padding-bottom:110px}
#archives .clead{color:var(--c-on-dark-mut)}
.carchives{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;margin-top:64px}
.carchives figure{margin:0}
.carchives img{width:100%;height:340px;object-fit:cover;object-position:top;border:1px solid rgba(255,255,255,.2);filter:saturate(.92)}
.carchives figcaption{font-family:var(--c-mono);font-size:12px;line-height:1.7;color:var(--c-on-dark-mut);margin-top:14px}

/* grain papier (signature DA) */
body::before{content:"";position:fixed;inset:0;z-index:9998;pointer-events:none;opacity:.05;mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23g)'/%3E%3C/svg%3E")}

/* responsive */
@media (max-width:880px){
  .cphases,.cbeforeafter{grid-template-columns:1fr}
  .cphase,.cbeforeafter > div{border-left:0;padding-left:4px;padding-right:4px;border-top:1px solid rgba(255,255,255,.18)}
  .cbeforeafter > div{border-top:1px solid var(--c-line)}
  .cphase:first-child,.cbeforeafter > div:first-child{border-top:0}
  .cstory li{grid-template-columns:52px 1fr}
  .csection{padding-top:80px}
  .cdark{padding-bottom:80px;margin-top:80px}
  .cquote{padding:90px 0}
  .capply{padding:90px 0}
  .capply-card{padding:36px 24px}
  .cnav{padding:20px 22px;gap:14px}
  .cnav-logo{height:20px;flex:none}
  .cnav-right{gap:12px}
  .cnav-cta{padding:8px 14px;font-size:12px}
  .clang{font-size:11px}
  .clang i{margin:0 3px}
  .chero-inner{padding:30px 22px 110px}
  .chero h1{font-size:clamp(32px,9vw,44px)}
  .chero-facts{gap:14px;font-size:11px}
  .cgrid3{grid-template-columns:1fr}
  .ccell{border-left:0;padding-left:4px;padding-right:4px}
  .cfounder{grid-template-columns:1fr;gap:34px}
  .cyesno{grid-template-columns:1fr}
  .cyesno > div{border-left:0;padding-left:4px;padding-right:4px}
  .carchives{grid-template-columns:1fr}
}
`;

export default function CampLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <style dangerouslySetInnerHTML={{ __html: campCss }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
