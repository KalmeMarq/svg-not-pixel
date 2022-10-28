(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))p(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const f of s.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&p(f)}).observe(document,{childList:!0,subtree:!0});function g(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerpolicy&&(s.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?s.credentials="include":r.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function p(r){if(r.ep)return;r.ep=!0;const s=g(r);fetch(r.href,s)}})();let $=0;document.getElementById("method").addEventListener("change",c=>{$=c.target.selectedIndex});function M(c,a){const p=document.createElement("canvas").getContext("2d");p.canvas.width=c.width,p.canvas.height=c.height,p.drawImage(c,0,0);const r=p.getImageData(0,0,c.width,c.height),s=[],f={};for(let o=0;o<r.data.length;o+=4){const e=r.data[o],n=r.data[o+1],t=r.data[o+2],i=r.data[o+3];i>0&&(s.push({x:o/4%c.width,y:Math.floor(o/4/c.width),color:`#${e.toString(16).padStart(2,"0")}${n.toString(16).padStart(2,"0")}${t.toString(16).padStart(2,"0")}${i<255?e.toString(16).padStart(2,"0"):""}`}),f[`${o/4%c.width},${Math.floor(o/4/c.width)}`]=`#${e.toString(16).padStart(2,"0")}${n.toString(16).padStart(2,"0")}${t.toString(16).padStart(2,"0")}${i<255?e.toString(16).padStart(2,"0"):""}`)}const h=[],u=[];(()=>{for(let o=0;o<s.length;o++){let e=1,n=s[o].x,t=s[o].y,i=s[o].color,d=n;for(;s[o+1]!==void 0&&s[o+1].color===i&&s[o+1].x===d+1;)++e,++d,++o;h.push({x:n,y:t,color:i,width:e,height:1})}for(let o=0;o<h.length;o++){const e=h[o];let n=[];for(let l=0;l<h.length;l++)o!==l&&h[l].x===e.x&&h[l].width===e.width&&e.color===h[l].color&&h[l].y>e.y&&n.push(h[l]);n.sort((l,y)=>l.y-y.y);let t=[];for(let l=0;l<n.length;l++)n[l-1]?t.length>0?t[t.length-1].y+1===n[l].y&&t.push(n[l]):t.push(n[l]):e.y+1===n[l].y&&t.push(n[l]);let i=t.length>0&&e.y>t[0].y?t[0].y:e.y;u.findIndex(l=>{const y=i,v=i+t.length,x=l.y,A=l.y+l.height;return l.x===e.x&&l.width===e.width&&x<=y&&A>v})<0&&u.push({x:e.x,y:i,width:e.width,height:t.length+1,color:e.color})}})(),console.log(h),console.log(u);const m=(o=!1)=>{const e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("xmlns","http://www.w3.org/2000/svg"),e.setAttribute("viewBox",`0 -0.5 ${c.width} ${c.height}`),e.setAttribute("shape-rendering","crispEdges");const n={};if(o)for(const t of u)t.height>1?(n["f"+t.color]||(n["f"+t.color]=""),n["f"+t.color]+=`M${t.x} ${t.y-.5}h${t.width}v${t.height}H${t.x}`):(n["s"+t.color]||(n["s"+t.color]=""),n["s"+t.color]+=`M${t.x} ${t.y}h${t.width}`);else for(const t of h)n[t.color]||(n[t.color]=""),n[t.color]+=`M${t.x} ${t.y}h${t.width}`;for(const[t,i]of Object.entries(n)){const d=document.createElementNS("http://www.w3.org/2000/svg","path");d.setAttribute("d",i.trim()),o?t[0]==="s"?d.setAttribute("stroke",t.slice(1)):t[0]==="f"&&d.setAttribute("fill",t.slice(1)):d.setAttribute("stroke",t),e.appendChild(d)}return e};function w(o){var e=encodeURI(o).split(/%..|./).length-1,n=e==0?0:Math.floor(Math.log(e)/Math.log(1024));return Number((e/Math.pow(1024,n)).toFixed(2))*1+" "+["B","kB","MB","GB","TB"][n]}if($===0){const o=m(!1),e=m(!0),n=o.outerHTML.replaceAll("></path>","/>"),t=e.outerHTML.replaceAll("></path>","/>");console.log(n),console.log(t);const i=document.createElement("a");i.setAttribute("href",`data:Application/octet-stream,${encodeURIComponent(o.outerHTML.replaceAll("></path>","/>"))}`),i.setAttribute("download",`${a}.svg`);const d=new Image;d.className="down",d.src="/download.png";const l=document.createElement("div");l.className="info",n.length>t.length?(l.innerHTML=`<p>${a}.svg</p><p>${w(t)}</p>`,i.appendChild(e)):(l.innerHTML=`<p>${a}.svg</p><p>${w(n)}</p>`,i.appendChild(o)),i.appendChild(d),i.appendChild(l),document.getElementById("svgs")?.appendChild(i)}else if($===1){const o=m(!1),e=document.createElement("a");e.setAttribute("href",`data:Application/octet-stream,${encodeURIComponent(o.outerHTML.replaceAll("></path>","/>"))}`),e.setAttribute("download",`${a}.svg`);const n=new Image;n.className="down",n.src="download.png";const t=document.createElement("div");t.className="info",t.innerHTML=`<p>${a}.svg</p><p>${w(o.outerHTML.replaceAll("></path>","/>"))}</p>`,e.appendChild(o),e.appendChild(n),e.appendChild(t),document.getElementById("svgs")?.appendChild(e)}else{const o=m(!0),e=document.createElement("a");e.setAttribute("href",`data:Application/octet-stream,${encodeURIComponent(o.outerHTML.replaceAll("></path>","/>"))}`),e.setAttribute("download",`${a}.svg`);const n=new Image;n.className="down",n.src="/download.png";const t=document.createElement("div");t.className="info",t.innerHTML=`<p>${a}.svg</p><p>${w(o.outerHTML.replaceAll("></path>","/>"))}</p>`,e.appendChild(o),e.appendChild(n),e.appendChild(t),document.getElementById("svgs")?.appendChild(e)}}document.getElementById("pixel-png")?.addEventListener("change",c=>{const a=c.target.files;if(a)for(let g=0;g<a.length;g++){const p=new FileReader;p.onload=r=>{if(r.target?.result){const s=new Image;s.src=r.target.result,s.onload=()=>{M(s,a[0].name.replace(/\.png/g,""))}}},p.readAsDataURL(a[g])}});