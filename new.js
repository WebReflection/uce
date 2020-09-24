var uce=function(e){"use strict";var t=e=>({get:t=>e.get(t),set:(t,n)=>(e.set(t,n),n)});const n=/([^\s\\>"'=]+)\s*=\s*(['"]?)$/,s=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,r=/<[a-z][^>]+$/i,l=/>[^<>]*$/,o=/<([a-z]+[a-z0-9:._-]*)([^>]*?)(\/>)/gi,a=/\s+$/,c=(e,t)=>0<t--&&(r.test(e[t])||!l.test(e[t])&&c(e,t)),i=(e,t,n)=>s.test(t)?e:`<${t}${n.replace(a,"")}></${t}>`;const{isArray:u}=Array,{indexOf:d,slice:p}=[],h=(e,t)=>111===e.nodeType?1/t<0?t?(({firstChild:e,lastChild:t})=>{const n=document.createRange();return n.setStartAfter(e),n.setEndAfter(t),n.deleteContents(),e})(e):e.lastChild:t?e.valueOf():e.firstChild:e;const f=e=>document.createElementNS("http://www.w3.org/1999/xhtml",e),g=(e,t)=>("svg"===t?b:m)(e),m=e=>{const t=f("template");return t.innerHTML=e,t.content},b=e=>{const{content:t}=f("template"),n=f("div");n.innerHTML='<svg xmlns="http://www.w3.org/2000/svg">'+e+"</svg>";const{childNodes:s}=n.firstChild;let{length:r}=s;for(;r--;)t.appendChild(s[0]);return t},y=({childNodes:e},t)=>e[t],v=e=>{const t=[];let{parentNode:n}=e;for(;n;)t.push(d.call(n.childNodes,e)),n=(e=n).parentNode;return t},{createTreeWalker:w,importNode:C}=document,x=1!=C.length,k=x?(e,t)=>C.call(document,g(e,t),!0):g,N=x?e=>w.call(document,e,129,null,!1):e=>w.call(document,e,129),E=(e,t,n)=>((e,t,n,s,r)=>{const l=n.length;let o=t.length,a=l,c=0,i=0,u=null;for(;c<o||i<a;)if(o===c){const t=a<l?i?s(n[i-1],-0).nextSibling:s(n[a-i],0):r;for(;i<a;)e.insertBefore(s(n[i++],1),t)}else if(a===i)for(;c<o;)u&&u.has(t[c])||e.removeChild(s(t[c],-1)),c++;else if(t[c]===n[i])c++,i++;else if(t[o-1]===n[a-1])o--,a--;else if(t[c]===n[a-1]&&n[i]===t[o-1]){const r=s(t[--o],-1).nextSibling;e.insertBefore(s(n[i++],1),s(t[c++],-1).nextSibling),e.insertBefore(s(n[--a],1),r),t[o]=n[a]}else{if(!u){u=new Map;let e=i;for(;e<a;)u.set(n[e],e++)}if(u.has(t[c])){const r=u.get(t[c]);if(i<r&&r<a){let l=c,d=1;for(;++l<o&&l<a&&u.get(t[l])===r+d;)d++;if(d>r-i){const l=s(t[c],0);for(;i<r;)e.insertBefore(s(n[i++],1),l)}else e.replaceChild(s(n[i++],1),s(t[c++],-1))}else c++}else e.removeChild(s(t[c++],-1))}return n})(e.parentNode,t,n,h,e),$=(e,t)=>"ref"===t?(e=>t=>{"function"==typeof t?t(e):t.current=e})(e):"aria"===t?(e=>t=>{for(const n in t){const s="role"===n?n:"aria-"+n,r=t[n];null==r?e.removeAttribute(s):e.setAttribute(s,r)}})(e):".dataset"===t?(({dataset:e})=>t=>{for(const n in t){const s=t[n];null==s?delete e[n]:e[n]=s}})(e):"."===t.slice(0,1)?((e,t)=>n=>{e[t]=n})(e,t.slice(1)):"on"===t.slice(0,2)?((e,t)=>{let n,s=t.slice(2);return!(t in e)&&t.toLowerCase()in e&&(s=s.toLowerCase()),t=>{const r=u(t)?t:[t,!1];n!==r[0]&&(n&&e.removeEventListener(s,n,r[1]),(n=r[0])&&e.addEventListener(s,n,r[1]))}})(e,t):((e,t)=>{let n,s=!0;const r=document.createAttributeNS(null,t);return t=>{n!==t&&(n=t,null==n?s||(e.removeAttributeNode(r),s=!0):(r.value=t,s&&(e.setAttributeNodeNS(r),s=!1)))}})(e,t);function A(e){const{type:t,path:n}=e,s=n.reduceRight(y,this);return"node"===t?(e=>{let t,n,s=[];const r=l=>{switch(typeof l){case"string":case"number":case"boolean":t!==l&&(t=l,n?n.textContent=l:n=document.createTextNode(l),s=E(e,s,[n]));break;case"object":case"undefined":if(null==l){t!=l&&(t=l,s=E(e,s,[]));break}if(u(l)){t=l,0===l.length?s=E(e,s,[]):"object"==typeof l[0]?s=E(e,s,l):r(String(l));break}"ELEMENT_NODE"in l&&t!==l&&(t=l,s=E(e,s,11===l.nodeType?p.call(l.childNodes):[l]))}};return r})(s):"attr"===t?$(s,e.name):(e=>{let t;return n=>{t!=n&&(t=n,e.textContent=null==n?"":n)}})(s)}const O="isµ",S=t(new WeakMap),L=(e,t)=>{const s=((e,t,s)=>{const r=[],{length:l}=e;for(let s=1;s<l;s++){const l=e[s-1];r.push(n.test(l)&&c(e,s)?l.replace(n,(e,n,r)=>`${t}${s-1}=${r||'"'}${n}${r?"":'"'}`):`${l}\x3c!--${t}${s-1}--\x3e`)}r.push(e[l-1]);const a=r.join("").trim();return s?a:a.replace(o,i)})(t,O,"svg"===e),r=k(s,e),l=N(r),a=[],u=t.length-1;let d=0,p="isµ"+d;for(;d<u;){const e=l.nextNode();if(!e)throw"bad template: "+s;if(8===e.nodeType)e.textContent===p&&(a.push({type:"node",path:v(e)}),p="isµ"+ ++d);else{for(;e.hasAttribute(p);)a.push({type:"attr",path:v(e),name:e.getAttribute(p)}),e.removeAttribute(p),p="isµ"+ ++d;/^(?:style|textarea)$/i.test(e.tagName)&&e.textContent.trim()===`\x3c!--${p}--\x3e`&&(a.push({type:"text",path:v(e)}),p="isµ"+ ++d)}}return{content:r,nodes:a}},M=(e,t)=>{const{content:n,nodes:s}=S.get(t)||S.set(t,L(e,t)),r=C.call(document,n,!0);return{content:r,updates:s.map(A,r)}},T=(e,{type:t,template:n,values:s})=>{const{length:r}=s;j(e,s,r);let{entry:l}=e;l&&l.template===n&&l.type===t||(e.entry=l=((e,t)=>{const{content:n,updates:s}=M(e,t);return{type:e,template:t,content:n,updates:s,wire:null}})(t,n));const{content:o,updates:a,wire:c}=l;for(let e=0;e<r;e++)a[e](s[e]);return c||(l.wire=(e=>{const{childNodes:t}=e,{length:n}=t;if(n<2)return n?t[0]:e;const s=p.call(t,0);return{ELEMENT_NODE:1,nodeType:111,firstChild:s[0],lastChild:s[n-1],valueOf(){if(t.length!==n){let t=0;for(;t<n;)e.appendChild(s[t++])}return e}}})(o))},j=({stack:e},t,n)=>{for(let s=0;s<n;s++){const n=t[s];n instanceof P?t[s]=T(e[s]||(e[s]={stack:[],entry:null,wire:null}),n):u(n)?j(e[s]||(e[s]={stack:[],entry:null,wire:null}),n,n.length):e[s]=null}n<e.length&&e.splice(n)};function P(e,t,n){this.type=e,this.template=t,this.values=n}const{create:W,defineProperties:B}=Object,z=e=>{const n=t(new WeakMap);return B((t,...n)=>new P(e,t,n),{for:{value(t,s){const r=n.get(t)||n.set(t,W(null));return r[s]||(r[s]=(t=>(n,...s)=>T(t,{type:e,template:n,values:s}))({stack:[],entry:null,wire:null}))}},node:{value:(t,...n)=>T({stack:[],entry:null,wire:null},{type:e,template:t,values:n}).valueOf()}})},D=t(new WeakMap),H=(e,t)=>{const n="function"==typeof t?t():t,s=D.get(e)||D.set(e,{stack:[],entry:null,wire:null}),r=n instanceof P?T(s,n):n;return r!==s.wire&&(s.wire=r,e.textContent="",e.appendChild(r.valueOf())),e},_=z("html"),R=z("svg");function q(e){for(var t=e[0],n=1,s=arguments.length;n<s;n++)t+=arguments[n]+e[n];return t}const{defineProperties:F,keys:G}=Object,I=(e,t,n,s,r)=>({configurable:!0,get:()=>s,set(l){(e||l!==s||t&&"object"==typeof l&&l)&&(s=l,n?r.call(this,s):r.call(this))}}),J=()=>{};const K=(({all:e=!1,shallow:t=!0,useState:n=J,getAttribute:s=((e,t)=>e.getAttribute(t))}={})=>(r,l,o)=>{const a=((e,t,n,s,r,l)=>{const o={},a=r!==J,c=[n,s,a];for(let n=G(e),s=0;s<n.length;s++){const i=t(e,n[s]),u=a?r(i):[i,r];l&&(u[1]=l),o[n[s]]=I.apply(null,c.concat(u))}return o})(l,(e,t)=>{let n=e[t];return r.hasOwnProperty(t)?(n=r[t],delete r[t]):r.hasAttribute(t)&&(n=s(r,t)),n},e,t,n,o);return F(r,a)})({dom:!0}),Q=customElements,{define:U}=Q,{create:V,defineProperties:X,getOwnPropertyDescriptor:Y,keys:Z}=Object,ee="element",te=t(new Map([[ee,{c:HTMLElement,e:ee}]])),ne=e=>document.createElement(e),se=e=>te.get(e)||te.set(e,{c:ne(e).constructor,e:e}),re=(e,t)=>{const{attachShadow:n,attributeChanged:s,bound:r,connected:l,disconnected:o,handleEvent:a,init:c,observedAttributes:i,props:u,render:d,style:p}=t,h=new WeakMap,f={},g={},m=[],b=V(null),y=(e,t,s)=>{if(!h.has(e)){h.set(e,0),X(e,{html:{value:oe.bind(n?e.attachShadow(n):e)}});for(let t=0;t<v;t++){const{type:n,options:s}=m[t];e.addEventListener(n,e,s)}r&&r.forEach(le,e),u&&K(e,u,d),(c||d)&&(c||d).call(e),t&&(e[t]=s)}};for(let e=Z(t),n=0,{length:s}=e;n<s;n++){const s=e[n];if(/^on./.test(s)&&!/Options$/.test(s)){const e=t[s+"Options"]||!1,n=s.toLowerCase();let r=n.slice(2);m.push({type:r,options:e}),b[r]=s,n!==s&&(r=n.slice(2,3)+s.slice(3),b[r]=s,m.push({type:r,options:e}))}switch(s){case"attachShadow":case"observedAttributes":case"style":break;default:g[s]=Y(t,s)}}const{length:v}=m;if(v&&!a&&(g.handleEvent={value(e){this[b[e.type]](e)}}),null!==u)if(u)for(let e=Z(u),t=0;t<e.length;t++){const n=e[t];g[n]={get(){return y(this),u[n]},set(e){y(this,n,e)}}}else g.props={get(){const e={};for(let{attributes:t}=this,{length:n}=t,s=0;s<n;s++){const{name:n,value:r}=t[s];e[n]=r}return e}};i&&(f.observedAttributes={value:i}),g.attributeChangedCallback={value(){y(this),s&&s.apply(this,arguments)}},g.connectedCallback={value(){y(this),l&&l.apply(this,arguments)}},o&&(g.disconnectedCallback={value:o});const{c:w,e:C}=se(t.extends||ee);class x extends w{}X(x,f),X(x.prototype,g);const k=[e,x];return C!==ee&&k.push({extends:C}),U.apply(Q,k),te.set(e,{c:x,e:C}),p&&(document.head.appendChild(ne("style")).textContent=p(C===ee?e:C+'[is="'+e+'"]')),x};function le(e){this[e]=this[e].bind(this)}function oe(){return H(this,_.apply(null,arguments))}return Q.get("uce-lib")||Q.define("uce-lib",class extends se(ee).c{static get define(){return re}static get render(){return H}static get html(){return _}static get svg(){return R}static get css(){return q}}),e.css=q,e.define=re,e.html=_,e.render=H,e.svg=R,e}({});
