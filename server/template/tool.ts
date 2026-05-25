// Reusable single-file micro-SaaS "tool" template. The Developer agent only
// supplies copy; structure, styling and the real Locus paywall are fixed
// (docs §10: template-based generation, one shared shell).

export type ToolCopy = {
  projectId: string;
  projectName: string;
  tagline: string;
  inputLabel: string;
  placeholder: string;
  ctaLabel: string;
  resultText: string;
  baseUrl: string;
  amount: string;
  currency: string;
};

function esc(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderTool(c: ToolCopy): string {
  const name = esc(c.projectName);
  const tagline = esc(c.tagline);
  const inputLabel = esc(c.inputLabel);
  const placeholder = esc(c.placeholder);
  const cta = esc(c.ctaLabel);
  const result = esc(c.resultText);
  const price = `${esc(c.amount)} ${esc(c.currency)}`;
  const cfg = JSON.stringify({
    projectId: c.projectId,
    baseUrl: c.baseUrl.replace(/\/$/, ""),
    result: c.resultText
  });

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${name}</title>
<style>
:root{--bg:#060608;--card:#0c0c12;--line:#ffffff1a;--ink:#f3f4f8;--mut:#a5a6bd;--faint:#6c6d85;--v:#7c5cff;--a:#22d3c5}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--ink);font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;-webkit-font-smoothing:antialiased;min-height:100vh}
.wrap{max-width:58rem;margin:0 auto;padding:clamp(1.5rem,5vw,4rem)}
header{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:2.5rem}
.brand{display:flex;align-items:center;gap:.55rem;font-weight:600;letter-spacing:-.02em}
.dot{width:.5rem;height:.5rem;border-radius:999px;background:var(--v)}
.tag{font-size:.7rem;text-transform:uppercase;letter-spacing:.24em;color:var(--faint)}
h1{font-size:clamp(2rem,5vw,3.2rem);line-height:1.04;letter-spacing:-.03em;margin:.5rem 0 .7rem}
.sub{color:var(--mut);max-width:46ch;line-height:1.6}
.card{background:var(--card);border:1px solid var(--line);border-radius:24px;padding:1.75rem;margin-top:2.25rem}
label{display:block;font-size:.78rem;color:var(--mut);margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.14em}
textarea{width:100%;min-height:9rem;background:#06060880;border:1px solid var(--line);border-radius:16px;padding:1rem;color:var(--ink);font:inherit;font-size:1rem;outline:none;resize:vertical}
textarea:focus{border-color:#7c5cff80}
.btn{margin-top:1.1rem;border:0;border-radius:999px;background:var(--v);color:#fff;font-weight:600;font-size:.95rem;padding:.85rem 1.7rem;cursor:pointer;transition:.2s}
.btn:hover{filter:brightness(1.12)}
.btn:disabled{opacity:.6;cursor:default}
.res{position:relative;overflow:hidden;margin-top:1.25rem;border:1px solid var(--line);border-radius:18px;background:#ffffff05;min-height:8rem}
.res .body{padding:1.25rem;color:var(--mut);line-height:1.7;white-space:pre-wrap}
.res.locked .veil{display:flex}
.veil{display:none;position:absolute;inset:0;background:#060608cc;backdrop-filter:blur(6px);align-items:center;justify-content:center;flex-direction:column;gap:.7rem;text-align:center;padding:1.5rem}
.pay{border:0;border-radius:999px;background:var(--a);color:#04110f;font-weight:700;font-size:.95rem;padding:.8rem 1.5rem;cursor:pointer}
.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.8rem;color:var(--ink);word-break:break-all;background:#06060880;border:1px solid var(--line);border-radius:10px;padding:.5rem .7rem;margin:.3rem 0}
.hint{font-size:.78rem;color:var(--mut)}
.link{color:var(--a);text-decoration:none;font-size:.85rem;cursor:pointer;background:none;border:0}
footer{margin-top:2.5rem;color:var(--faint);font-size:.78rem;display:flex;justify-content:space-between;flex-wrap:wrap;gap:.5rem}
a{color:var(--a);text-decoration:none}
</style></head>
<body><div class="wrap">
<header><div class="brand"><span class="dot"></span> ${name}</div><span class="tag">SaaS-Factory.ai</span></header>
<h1>${tagline}</h1>
<p class="sub">Run the tool below. The result unlocks after a real Locus USDC payment.</p>
<div class="card">
  <label for="in">${inputLabel}</label>
  <textarea id="in" placeholder="${placeholder}"></textarea>
  <button class="btn" id="run">${cta}</button>
  <div class="res locked" id="res">
    <div class="body" id="body">Your result will appear here.</div>
    <div class="veil" id="veil">
      <span class="tag">Locus paywall</span>
      <strong style="font-size:1.25rem">${price}</strong>
      <div id="payInit">
        <button class="pay" id="startPay">Pay with Locus</button>
      </div>
      <div id="payInstr" style="display:none">
        <p class="hint">Send <strong id="amt"></strong> USDC on Base to:</p>
        <div class="mono" id="addr"></div>
        <p class="hint">memo / reference:</p>
        <div class="mono" id="memo"></div>
        <button class="pay" id="verify" style="margin-top:.6rem">I've paid — verify</button>
        <div class="hint" id="vstatus" style="margin-top:.5rem"></div>
      </div>
    </div>
  </div>
</div>
<footer><span>Generated micro-SaaS · template: tool · Locus</span><a href="${esc(c.baseUrl)}/dashboard">Founder dashboard</a></footer>
</div>
<script>
var C=${cfg};var R=C.result;var SID=null;
document.getElementById('run').onclick=function(){
  var v=document.getElementById('in').value.trim();
  document.getElementById('body').textContent = v ? (R+"\\n\\nInput:\\n"+v) : R;
};
document.getElementById('startPay').onclick=async function(){
  this.disabled=true;this.textContent='Creating session…';
  try{
    var r=await fetch(C.baseUrl+'/api/projects/'+C.projectId+'/payment-sessions',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
    var d=await r.json();
    SID=d.sessionId;
    document.getElementById('amt').textContent=d.amount;
    document.getElementById('addr').textContent=d.payToAddress;
    document.getElementById('memo').textContent=d.memo;
    document.getElementById('payInit').style.display='none';
    document.getElementById('payInstr').style.display='block';
  }catch(e){this.disabled=false;this.textContent='Pay with Locus';alert('Could not start payment');}
};
document.getElementById('verify').onclick=async function(){
  var s=document.getElementById('vstatus');s.textContent='Checking Locus…';
  try{
    var r=await fetch(C.baseUrl+'/api/payments/'+SID,{method:'POST'});
    var d=await r.json();
    if(d.status==='paid'){document.getElementById('res').classList.remove('locked');}
    else{s.textContent='Not detected yet ('+(d.status||'pending')+'). Send the USDC, then verify again.';}
  }catch(e){s.textContent='Verification failed, try again.';}
};
</script>
</body></html>`;
}
