/* Pure calculation functions. Replace or add engines without changing the UI. */
(function(root){
const cash=s=>s.strategy==='contribution'?s.contribution:s.strategy==='withdrawal'?-s.withdrawal:0;
function calculateBasicVR(s){return {next:s.v+s.pool/s.g+cash(s),growth:s.pool/s.g,correction:0,cash:cash(s)}}
function calculateAdvancedVR(s){const r=calculateBasicVR(s);r.correction=(s.price*s.shares-s.v)/(2*Math.sqrt(s.g));r.next+=r.correction;return r}
function calculateCustomVR(s){const correction=s.customCorrection*(s.price*s.shares-s.v)/(2*Math.sqrt(s.g));return {next:s.v+s.customSlope+correction+cash(s),growth:s.customSlope,correction,cash:cash(s)}}
function calculate(s){if(s.mode==='manual')return {next:s.manualV,growth:0,correction:0,cash:cash(s),manual:true};return ({basic:calculateBasicVR,advanced:calculateAdvancedVR,custom:calculateCustomVR}[s.mode])(s)}
function plan(s){const e=s.price*s.shares,lower=s.v*(1-s.lower/100),upper=s.v*(1+s.upper/100),signal=e<lower?'BUY':e>upper?'SELL':'HOLD';const required=signal==='BUY'?lower-e:signal==='SELL'?e-upper:0;const allowance=Math.max(0,s.pool*s.usage/100);const amount=signal==='BUY'?Math.min(required,allowance,s.pool):signal==='SELL'?Math.min(required,e):0;let qty=s.price>0?amount/s.price:0;qty=s.fractional?Math.floor(qty*1e6)/1e6:signal==='SELL'?Math.ceil(qty-1e-10):Math.floor(qty+1e-10);qty=Math.min(qty,signal==='SELL'?s.shares:Infinity);return {e,lower,upper,signal,required,allowance,qty,amount:qty*s.price,total:e+s.pool}}
const api={calculateBasicVR,calculateAdvancedVR,calculateCustomVR,calculate,plan,cash};if(typeof module!=='undefined')module.exports=api;root.VR=api;
})(typeof window!=='undefined'?window:globalThis);

