if(!self.define){let e,i={};const s=(s,n)=>(s=new URL(s+".js",n).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let o={};const c=e=>s(e,t),l={module:{uri:t},exports:o,require:c};i[t]=Promise.all(n.map((e=>l[e]||c(e)))).then((e=>(r(...e),o)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-DWI0siZZ.css",revision:null},{url:"assets/index-DwuZHIsJ.js",revision:null},{url:"index.html",revision:"c72eabc38e7409ba9c6ae1aedcabcd71"},{url:"registerSW.js",revision:"bba31d891cc16c582ee4cba4750911ef"},{url:"manifest.webmanifest",revision:"a6683ee99ece8e98501d5cc9629af0d2"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/bobriki/index.html")))}));
