(function(){
var R=document.documentElement,reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
function $$(s,c){return [].slice.call((c||document).querySelectorAll(s))}

/* thème */
var tb=document.getElementById("theme");
if(tb)tb.onclick=function(){var d=R.dataset.theme?R.dataset.theme==="dark":matchMedia("(prefers-color-scheme: dark)").matches;var n=d?"light":"dark";R.dataset.theme=n;try{localStorage.setItem("theme",n)}catch(e){}};

/* filtres et recherche */
var cards=$$(".card"),q=document.getElementById("q"),f="all";
function run(){if(!q)return;var t=q.value.trim().toLowerCase(),n=0;cards.forEach(function(c){var ok=(f==="all"||c.dataset.cats.split(" ").indexOf(f)>-1)&&(!t||c.dataset.text.indexOf(t)>-1);c.hidden=!ok;if(ok){n++;c.classList.add("in")}});
document.getElementById("count").textContent=n+" projet"+(n>1?"s":"");document.getElementById("empty").hidden=n>0}
if(q){q.oninput=run;$$(".chip").forEach(function(c){c.onclick=function(){f=c.dataset.f;$$(".chip").forEach(function(x){x.classList.toggle("on",x===c)});run()}});run()}

/* compteurs : anime chaque nombre du texte, puis remet le texte exact */
var NUM=/\d[\d\s ]*(?:,\d+)?/g;
function count(el){
  var orig=el.textContent; if(!/^[-+]?\d/.test(orig.trim()))return;
  var ms=orig.match(NUM)||[];var vals=ms.map(function(m){var dec=(m.split(",")[1]||"").length;return{v:parseFloat(m.replace(/[\s ]/g,"").replace(",",".")),dec:dec,sp:/[\s ]\d/.test(m.trim())}});
  var t0=null,D=1100;
  function fmt(x,o){var s=x.toFixed(o.dec).replace(".",",");if(o.sp){var p=s.split(",");p[0]=p[0].replace(/\B(?=(\d{3})+(?!\d))/g," ");s=p.join(",")}return s}
  function st(t){if(!t0)t0=t;var k=Math.min((t-t0)/D,1),e=1-Math.pow(1-k,3),i=0;
    el.textContent=orig.replace(NUM,function(m){var o=vals[i++];var sp=m.match(/\s+$/);return fmt(o.v*e,o)+(sp?sp[0]:"")});
    if(k<1)requestAnimationFrame(st);else el.textContent=orig}
  requestAnimationFrame(st)}

/* apparitions au défilement */
var targets=$$(".rv"),nums=$$(".num");
if(!reduce&&"IntersectionObserver"in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}})},{rootMargin:"0px 0px -8% 0px"});
  targets.forEach(function(t,i){t.style.setProperty("--i",i%6);io.observe(t)});
  var io2=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){count(x.target);io2.unobserve(x.target)}})},{threshold:.6});
  nums.forEach(function(n){io2.observe(n)});
}else{targets.forEach(function(t){t.classList.add("in")})}

/* sommaire actif */
var toc=$$(".toc a");if(toc.length&&"IntersectionObserver"in window){var io3=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting)toc.forEach(function(a){a.classList.toggle("on",a.getAttribute("href")==="#"+x.target.id)})})},{rootMargin:"-30% 0px -60% 0px"});$$(".detail section[id]").forEach(function(s){io3.observe(s)})}

/* animation du hero : figée si l'utilisateur limite les animations */
var sv=document.querySelector(".pipe");if(sv&&sv.pauseAnimations&&reduce){sv.pauseAnimations();sv.setCurrentTime(3.2)}

/* visionneuse d'images */
var lb=document.getElementById("lb"),zs=$$(".zoom"),cur=0;
function show(i){cur=(i+zs.length)%zs.length;var a=zs[cur];lb.querySelector("img").src=a.href;lb.querySelector("img").alt=a.dataset.cap;lb.querySelector("p").textContent=a.dataset.cap;lb.querySelector(".lbn").hidden=zs.length<2}
if(lb&&zs.length&&lb.showModal){
  zs.forEach(function(a,i){a.onclick=function(ev){ev.preventDefault();show(i);lb.showModal()}});
  lb.querySelector(".lbx").onclick=function(){lb.close()};
  lb.querySelector(".lbp").onclick=function(){show(cur-1)};
  lb.querySelector(".lbnx").onclick=function(){show(cur+1)};
  lb.addEventListener("click",function(ev){if(ev.target===lb)lb.close()});
  lb.addEventListener("keydown",function(ev){if(ev.key==="ArrowRight")show(cur+1);if(ev.key==="ArrowLeft")show(cur-1)});
}
})();
