import React, { useEffect, useRef, useState, useMemo } from "react";

// Keycap Orb - Interactive 3D WebGL2 Sphere
const c = (fn) => fn;


export const PORTFOLIO_KEYCAPS = [
  { label: "Python", finish: "ink", hotkey: "p" },
  { label: "React", finish: "cobalt", hotkey: "r" },
  { icon: "code", finish: "ash" },
  { label: "FastAPI", finish: "ink", hotkey: "f" },
  { icon: "cpu", finish: "ash" },
  { label: "C++", finish: "ink", hotkey: "c" },
  { icon: "database", finish: "glass" },
  { label: "ML", finish: "lime", hotkey: "m" },
  { label: "Java", finish: "ash", hotkey: "j" },
  { label: "AI", finish: "cobalt", hotkey: "a" },
  { icon: "sparkles", finish: "glass" },
  { label: "SQL", finish: "ink", hotkey: "s" },
  { label: "Git", finish: "ash", hotkey: "g" },
  { label: "YOLO", finish: "ink", hotkey: "y" },
  { label: "Firebase", finish: "lime", hotkey: "b" },
  { icon: "layers", finish: "ash" },
  { label: "CatBoost", finish: "ash", hotkey: "t" },
  { label: "Supabase", finish: "glass", hotkey: "u" },
  { icon: "terminal", finish: "ash" },
  { label: "OpenCV", finish: "cobalt", hotkey: "o" },
  { label: "Docker", finish: "glass", hotkey: "d" },
  { label: "HTML", finish: "ink", hotkey: "h" },
  { icon: "cube", finish: "glass" },
  { label: "CSS", finish: "ash", hotkey: "e" },
  { label: "JS", finish: "lime", hotkey: "x" },
  { icon: "globe", finish: "ash" },
  { label: "Agentforce", finish: "cobalt", hotkey: "w" },
  { label: "Salesforce", finish: "ash", hotkey: "z" }
];

export const PORTFOLIO_PALETTE_LIGHT = {
  ink: { cap: "#1f1d1a", legend: "#f3eedf" },
  ash: { cap: "#e5dccb", legend: "#171512" },
  cobalt: { cap: "#ed432f", legend: "#ffffff" },
  lime: { cap: "#d48b38", legend: "#171512" },
  glass: { cap: "#f5ebe1", legend: "#ed432f" }
};

export const PORTFOLIO_PALETTE_DARK = {
  ink: { cap: "#22201d", legend: "#f3eedf" },
  ash: { cap: "#33302b", legend: "#eae2d5" },
  cobalt: { cap: "#ed432f", legend: "#ffffff" },
  lime: { cap: "#d48b38", legend: "#171512" },
  glass: { cap: "#2d2925", legend: "#ed432f" }
};


const Ou=c((s,y,b)=>s>b?b:s>=y?s:y,"clamp"),Dd=c(s=>{let y=s>>>0;return()=>{y=y+1831565813>>>0;let b=y;return b=Math.imul(b^b>>>15,b|1),b^=b+Math.imul(b^b>>>7,b|61),((b^b>>>14)>>>0)/4294967296}},"mulberry32"),Ud=c(s=>{const y=Math.round(Ou(s,5,15)),b=Math.PI/(y-1),o=[];for(let T=0;T<y;T++){const R=-Math.PI/2+T*b,x=2*Math.PI*Math.cos(R),V=Math.max(1,Math.round(x/b)),D=V===1?b:x/V,A=Math.min(1,D/b);for(let L=0;L<V;L++){const K=L/V*2*Math.PI,j=Math.cos(R),Tt=[j*Math.sin(K),Math.sin(R),j*Math.cos(K)],_t=[Math.cos(K),0,-Math.sin(K)];o.push({lat:R,lon:K,size:A,dir:Tt,east:_t})}}return o},"layoutSlots"),a1=c((s,y)=>Math.acos(Ou(s[0]*y[0]+s[1]*y[1]+s[2]*y[2],-1,1)),"angleBetween"),Nd=c(s=>{const y=[0,0,1],b=s.map((o,T)=>{const R=Math.round(a1(o.dir,y)*1e3)/1e3,x=Math.atan2(o.dir[1],o.dir[0]),V=((Math.PI-x)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);return{i:T,d:R,around:Math.round(V*1e3)/1e3}});return b.sort((o,T)=>o.d-T.d||o.around-T.around||o.i-T.i),b.map(o=>o.i)},"frontOrder"),ba=c((s,y)=>[s[3]*y[0]+s[0]*y[3]+s[1]*y[2]-s[2]*y[1],s[3]*y[1]-s[0]*y[2]+s[1]*y[3]+s[2]*y[0],s[3]*y[2]+s[0]*y[1]-s[1]*y[0]+s[2]*y[3],s[3]*y[3]-s[0]*y[0]-s[1]*y[1]-s[2]*y[2]],"qMul"),ve=c((s,y)=>{const b=Math.sin(y/2);return[s[0]*b,s[1]*b,s[2]*b,Math.cos(y/2)]},"qAxis"),$c=c(s=>{const y=Math.hypot(s[0],s[1],s[2],s[3]);return y>1e-9&&Number.isFinite(y)?[s[0]/y,s[1]/y,s[2]/y,s[3]/y]:[0,0,0,1]},"qNormalize"),zu=c((s,y)=>{const b=s[0],o=s[1],T=s[2],R=s[3],x=2*(o*y[2]-T*y[1]),V=2*(T*y[0]-b*y[2]),D=2*(b*y[1]-o*y[0]);return[y[0]+R*x+o*D-T*V,y[1]+R*V+T*x-b*D,y[2]+R*D+b*V-o*x]},"qRotate"),xd=c((s,y)=>{const b=s-y/3.2;return b<=0||b>2.4?0:Math.sin(b*13)*Math.exp(-b*4.2)*Math.exp(-y*.55)*.42},"ripplePulse"),Hd=c((s,y,b,o)=>{const T=Math.tan(y/2),R=Ou(o,.3,.95);return s/(R*T*Math.min(1,b))+s*.35},"fitDistance"),Ld=c((s,y,b,o)=>{let T=-1/0,R=1/0;for(let x=0;x<3;x++){if(Math.abs(y[x])<1e-12){if(s[x]<b[x]||s[x]>o[x])return-1;continue}const V=(b[x]-s[x])/y[x],D=(o[x]-s[x])/y[x];T=Math.max(T,Math.min(V,D)),R=Math.min(R,Math.max(V,D))}return R<Math.max(T,0)?-1:T>=0?T:R},"rayBox"),Bd=c((s,y,b,o)=>{const T=s[0]-b[0],R=s[1]-b[1],x=s[2]-b[2],V=T*y[0]+R*y[1]+x*y[2],D=T*T+R*R+x*x-o*o,A=V*V-D;if(A<0)return-1;const L=Math.sqrt(A),K=-V-L;return K>=0?K:-V+L>=0?-V+L:-1},"raySphere"),Ea=c((s,y)=>{const b=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((s??"").trim());if(!b)return y;const o=b[1].length===3?b[1].replace(/./g,R=>R+R):b[1],T=c(R=>{const x=R/255;return x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4)},"lin");return[T(parseInt(o.slice(0,2),16)),T(parseInt(o.slice(2,4),16)),T(parseInt(o.slice(4,6),16))]},"hexToLinear"),Cd={ink:0,ash:1,glass:2,cobalt:3,lime:4},kr={ink:{cap:"#17181d",legend:"#c9cdd9"},ash:{cap:"#b3b7c1",legend:"#1c2352"},glass:{cap:"#a9bcff",legend:"#3a50ff"},cobalt:{cap:"#2633d4",legend:"#141c8f"},lime:{cap:"#9aa53a",legend:"#1b1e0e"}},Wr=[{label:"CSS",finish:"cobalt",hotkey:"c"},{label:"HTML",finish:"ink",hotkey:"h"},{icon:"slash",finish:"ash"},{label:"JS",finish:"ink",hotkey:"j"},{icon:"bolt",finish:"ash"},{icon:"quote",finish:"ink"},{icon:"at",finish:"glass"},{icon:"gear",finish:"ink"},{icon:"search",finish:"ink"},{icon:"pen",finish:"ash"},{icon:"braces",finish:"ink"},{icon:"check",finish:"lime"},{icon:"folder",finish:"ash"},{icon:"frame",finish:"ash"},{icon:"chevrons",finish:"ash"},{icon:"shield",finish:"ash"},{icon:"cube",finish:"glass"},{icon:"code",finish:"ink"},{icon:"none",finish:"ink"},{icon:"hash",finish:"cobalt"},{icon:"terminal",finish:"ink"},{icon:"layers",finish:"glass"},{icon:"cursor",finish:"ash"},{icon:"none",finish:"cobalt"},{icon:"star",finish:"ink"},{icon:"none",finish:"ash"},{icon:"heart",finish:"glass"},{icon:"arrow",finish:"ink"},{label:"⌘",finish:"ash"},{icon:"plus",finish:"cobalt"},{icon:"none",finish:"glass"},{label:"Esc",finish:"lime"}],Yd=c(()=>{let s="";for(let b=0;b<8;b++){const o=b/8*Math.PI*2;for(const[T,R]of[[7,o-.3],[9.4,o-.17],[9.4,o+.17],[7,o+.3]])s+=(s?"L":"M")+(12+Math.cos(R)*T).toFixed(2)+" "+(12+Math.sin(R)*T).toFixed(2)}return s+"Z M15.2 12 A3.2 3.2 0 1 0 8.8 12 A3.2 3.2 0 1 0 15.2 12 Z"},"gear"),qd={code:["M8 7 L3 12 L8 17","M16 7 L21 12 L16 17","M14 4 L10 20"],braces:["M9 4 C7 4 6.5 5 6.5 7 V9.8 C6.5 11 5.8 12 4.5 12 C5.8 12 6.5 13 6.5 14.2 V17 C6.5 19 7 20 9 20","M15 4 C17 4 17.5 5 17.5 7 V9.8 C17.5 11 18.2 12 19.5 12 C18.2 12 17.5 13 17.5 14.2 V17 C17.5 19 17 20 15 20"],chevrons:["M9.5 6.5 L4 12 L9.5 17.5","M14.5 6.5 L20 12 L14.5 17.5"],frame:["M6.5 6.5 H17.5 V17.5 H6.5 Z","f:M4 4 H8 V8 H4 Z M16 4 H20 V8 H16 Z M4 16 H8 V20 H4 Z M16 16 H20 V20 H16 Z"],quote:["f:M10.5 6 C6.5 6.5 4.5 9 4.5 12.5 V18 H10.5 V12 H7.5 C7.7 10 8.8 8.8 10.5 8.5 Z M19.5 6 C15.5 6.5 13.5 9 13.5 12.5 V18 H19.5 V12 H16.5 C16.7 10 17.8 8.8 19.5 8.5 Z"],slash:["M15.5 3.5 L8.5 20.5"],at:["M16 12 A4 4 0 1 1 8 12 A4 4 0 1 1 16 12","M16 8 V13.5 C16 15.3 17 16.3 18.5 16.3 C20 16.3 21 14.8 21 12 A9 9 0 1 0 17.4 19.2"],pen:["M12 3 L18.5 12.5 L15 20.5 H9 L5.5 12.5 Z","M12 3 V10.5","M13.6 12 A1.6 1.6 0 1 1 10.4 12 A1.6 1.6 0 1 1 13.6 12"],check:["M4.5 12.5 L9.8 17.8 L19.5 6.5"],search:["M16.5 10.5 A6 6 0 1 1 4.5 10.5 A6 6 0 1 1 16.5 10.5","M15 15 L20 20"],bolt:["f:M13.5 2.5 L5 13.5 H11 L10 21.5 L19 10 H13 Z"],gear:["f:"+Yd()],shield:["M12 3 L19.5 6 V11.5 C19.5 16 16.5 19.5 12 21.5 C7.5 19.5 4.5 16 4.5 11.5 V6 Z"],folder:["M3.5 7 C3.5 6 4.2 5.2 5.2 5.2 H9.4 L11.4 7.3 H18.8 C19.8 7.3 20.5 8 20.5 9 V17 C20.5 18 19.8 18.8 18.8 18.8 H5.2 C4.2 18.8 3.5 18 3.5 17 Z"],cube:["M12 3 L19.8 7.5 V16.5 L12 21 L4.2 16.5 V7.5 Z","M4.2 7.5 L12 12 L19.8 7.5","M12 12 V21"],cursor:["f:M5 3.5 L19 12 L12.6 13.4 L9.4 19.6 Z"],hash:["M10 4 L8 20","M16 4 L14 20","M4.5 9 H20","M4 15 H19.5"],terminal:["M5 7 L10 12 L5 17","M12.5 17.5 H19"],layers:["M12 3.5 L20.5 8 L12 12.5 L3.5 8 Z","M3.5 12 L12 16.5 L20.5 12","M3.5 16 L12 20.5 L20.5 16"],star:["f:M12 3 L14.6 8.9 L21 9.5 L16.2 13.8 L17.6 20.2 L12 16.9 L6.4 20.2 L7.8 13.8 L3 9.5 L9.4 8.9 Z"],heart:["f:M12 20 C5 15.5 3 12.5 3 9.2 C3 6.6 5 4.6 7.5 4.6 C9.3 4.6 10.9 5.6 12 7.2 C13.1 5.6 14.7 4.6 16.5 4.6 C19 4.6 21 6.6 21 9.2 C21 12.5 19 15.5 12 20 Z"],arrow:["M4.5 12 H19.5","M13.5 6 L19.5 12 L13.5 18"],plus:["M12 5 V19","M5 12 H19"]},Gd={"/":["slash"],"\\":["slash"],"@":["at"],"#":["hash"],"{":["braces"],"}":["braces"],"<":["code","chevrons"],">":["chevrons","code","terminal"],'"':["quote"],"'":["quote"],"?":["search"],"+":["plus"],"*":["star"],$:["terminal"]},Du=.6,Ic=.37,Pc=.055,Fr=.028,Xe=128,Xd=c((s,y)=>{const b=new Float32Array(s.length);for(let o=0;o<y.length;o+=3){const T=y[o]*3,R=y[o+1]*3,x=y[o+2]*3,V=s[R]-s[T],D=s[R+1]-s[T+1],A=s[R+2]-s[T+2],L=s[x]-s[T],K=s[x+1]-s[T+1],j=s[x+2]-s[T+2],Tt=D*j-A*K,_t=A*L-V*j,Ot=V*K-D*L;for(const Dt of[T,R,x])b[Dt]+=Tt,b[Dt+1]+=_t,b[Dt+2]+=Ot}for(let o=0;o<b.length;o+=3){const T=Math.hypot(b[o],b[o+1],b[o+2])||1;b[o]/=T,b[o+1]/=T,b[o+2]/=T}return b},"smoothNormals"),Vd=c(()=>{const y=[],b=Du-Pc;for(let D=0;D<=4;D++){const A=D/4;y.push([.5-(.5-Ic-Pc)*A,.11+.03*A,b*A])}for(let D=1;D<=5;D++){const A=D/5*(Math.PI/2);y.push([Ic+Pc*Math.cos(A),.14+.02*(1-Math.cos(A)),b+Pc*Math.sin(A)])}for(let D=1;D<=6;D++){const A=Ic*(1-D/6.2),L=A/Ic;y.push([A,.16*L,Du-Fr*(1-L*L)])}const o=[],T=4*8;for(const[D,A,L]of y){const K=Math.min(A,D),j=D-K,Tt=[[j,j,0],[-j,j,Math.PI/2],[-j,-j,Math.PI],[j,-j,3*Math.PI/2]];for(const[_t,Ot,Dt]of Tt)for(let il=0;il<=7;il++){const jt=Dt+il/7*(Math.PI/2);o.push(_t+Math.cos(jt)*K,L,Ot+Math.sin(jt)*K)}}const R=[];for(let D=0;D<y.length-1;D++)for(let A=0;A<T;A++){const L=D*T+A,K=D*T+(A+1)%T,j=(D+1)*T+(A+1)%T,Tt=(D+1)*T+A;R.push(L,Tt,j,L,j,K)}const x=o.length/3;o.push(0,Du-Fr,0);const V=(y.length-1)*T;for(let D=0;D<T;D++)R.push(V+D,x,V+(D+1)%T);return{pos:new Float32Array(o),nor:Xd(o,R),idx:new Uint16Array(R)}},"buildKeycap"),Zd=c(()=>{const s=[],y=[],b=[],o=c((T,R,x,V,D,A)=>{const L=[[[1,0,0],[0,1,0],[0,0,1]],[[-1,0,0],[0,0,1],[0,1,0]],[[0,1,0],[0,0,1],[1,0,0]],[[0,-1,0],[1,0,0],[0,0,1]],[[0,0,1],[1,0,0],[0,1,0]],[[0,0,-1],[0,1,0],[1,0,0]]],K=[V,D,A];for(const[j,Tt,_t]of L){const Ot=s.length/3;for(const[Dt,il]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const jt=[T,R,x];for(let St=0;St<3;St++)jt[St]+=j[St]*K[St]+Tt[St]*Dt*K[St]+_t[St]*il*K[St];s.push(jt[0],jt[1],jt[2]),y.push(j[0],j[1],j[2])}b.push(Ot,Ot+1,Ot+2,Ot,Ot+2,Ot+3)}},"box");return o(0,.05,0,.36,.05,.36),o(0,.25,0,.17,.2,.045),o(0,.25,0,.045,.2,.17),{pos:new Float32Array(s),nor:new Float32Array(y),idx:new Uint16Array(b)}},"buildStem"),jd=c(()=>{const b=[];for(let T=0;T<=24;T++){const R=T/24*Math.PI;for(let x=0;x<=40;x++){const V=x/40*Math.PI*2;b.push(Math.sin(R)*Math.cos(V),Math.cos(R),Math.sin(R)*Math.sin(V))}}const o=[];for(let T=0;T<24;T++)for(let R=0;R<40;R++){const x=T*41+R,V=x+1,D=x+40+1,A=D+1;o.push(x,V,A,x,A,D)}return{pos:new Float32Array(b),nor:new Float32Array(b),idx:new Uint16Array(o)}},"buildCore"),$r=c(s=>s.icon&&s.icon!=="none"?"i:"+s.icon:s.label&&s.icon!=="none"?"t:"+s.label:"","legendKey"),Qd=c(s=>{const y=Math.max(1,Math.ceil(Math.sqrt(s.length))),b=document.createElement("canvas");b.width=b.height=y*Xe;const o=b.getContext("2d");return o?(o.fillStyle="#000",o.fillRect(0,0,b.width,b.height),o.fillStyle="#fff",o.strokeStyle="#fff",o.lineCap="round",o.lineJoin="round",s.forEach((T,R)=>{const x=R%y*Xe,V=Math.floor(R/y)*Xe;if(o.save(),o.translate(x,V),T.startsWith("i:")){const D=qd[T.slice(2)]??[],A=Xe*.66/24;o.translate(Xe*.17,Xe*.17),o.scale(A,A),o.lineWidth=2.6;for(const L of D)L.startsWith("f:")?o.fill(new Path2D(L.slice(2)),"evenodd"):o.stroke(new Path2D(L))}else{const D=T.slice(2);let A=D.length<=2?64:46;const L='ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';for(o.font="700 "+A+"px "+L;o.measureText(D).width>Xe*.78&&A>14;)A-=2,o.font="700 "+A+"px "+L;o.textAlign="center",o.textBaseline="middle",o.fillText(D,Xe/2,Xe/2+A*.04)}o.restore()}),{canvas:b,cells:y}):{canvas:b,cells:y}},"drawAtlas"),wd=`#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2) * 2.0 - 1.0;
  gl_Position = vec4(p, 0.0, 1.0);
}
`,Kd=`#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 uRes;
uniform vec3 uBg;
uniform vec3 uGlow;
uniform vec2 uOrb;
uniform float uHorizon;
uniform float uSeed;

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233)) + uSeed) * 43758.5453); }

vec3 tone(vec3 c) {
  c = (c * (2.51 * c + 0.03)) / (c * (2.43 * c + 0.59) + 0.14);
  return pow(clamp(c, 0.0, 1.0), vec3(1.0 / 2.2));
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec3 col = uBg;

  // The lit floor: a pool of the glow colour rising from the bottom edge,
  // brightest just off-centre, gone by the middle of the frame.
  vec2 g = (p - vec2(uOrb.x + 0.2, uHorizon - 0.5)) * vec2(0.55, 0.95);
  col += uGlow * exp(-dot(g, g) * 8.0) * 0.5;
  col += uGlow * exp(-dot(g, g) * 2.6) * 0.05;

  // A faint halo right behind the ball, so its silhouette separates.
  vec2 h = p - uOrb;
  col += uGlow * exp(-dot(h, h) * 9.0) * 0.012;

  // Corners sink.
  col *= 1.0 - 0.4 * smoothstep(0.5, 1.15, length(p * vec2(0.8, 1.0)));

  vec3 outc = tone(col);
  // Dither: an 8-bit gradient this dark bands visibly without it.
  outc += (hash(gl_FragCoord.xy) - 0.5) / 255.0 * 1.5;
  fragColor = vec4(outc, 1.0);
}
`,Jd=`#version 300 es
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aNor;
layout(location = 2) in vec4 aM0;
layout(location = 3) in vec4 aM1;
layout(location = 4) in vec4 aM2;
layout(location = 5) in vec4 aM3;
layout(location = 6) in vec4 aInfo;
uniform mat4 uViewProj;
uniform float uReflect;
uniform float uFloor;
out vec3 vWorld;
out vec3 vNormal;
out vec3 vLocal;
out vec3 vTx;
out vec3 vTz;
// flat: the cell index must not be interpolated. Rounding error across a
// triangle flips floor(id / cells) per pixel and samples the neighbouring
// legend, which reads as sparkle on the cap.
flat out vec4 vInfo;
void main() {
  mat4 m = mat4(aM0, aM1, aM2, aM3);
  vec4 w = m * vec4(aPos, 1.0);
  vec3 n = mat3(m) * aNor;
  vec3 tx = aM0.xyz;
  vec3 tz = aM2.xyz;
  if (uReflect > 0.5) {
    // Mirror through the floor plane. The winding flips with it, which the
    // draw call answers with frontFace(CW).
    w.y = 2.0 * uFloor - w.y;
    n.y = -n.y;
    tx.y = -tx.y;
    tz.y = -tz.y;
  }
  vWorld = w.xyz;
  vNormal = n;
  vLocal = aPos;
  vTx = tx;
  vTz = tz;
  vInfo = aInfo;
  gl_Position = uViewProj * w;
}
`,kd=`#version 300 es
precision highp float;
in vec3 vWorld;
in vec3 vNormal;
in vec3 vLocal;
in vec3 vTx;
in vec3 vTz;
flat in vec4 vInfo;
out vec4 fragColor;

uniform vec3 uCam;
uniform vec3 uCap[7];
uniform vec3 uInk[7];
uniform vec3 uGlow;
uniform sampler2D tLegend;
uniform float uCells;
uniform float uReflect;
uniform float uFloor;
uniform float uGlass;
uniform float uStem;
uniform float uCore;

// Must match KEY_H, TOP_HALF and CELL above.
const float KEY_H = 0.600;
const float TOP_HALF = 0.370;
const float CELL = 128.0;

vec3 tone(vec3 c) {
  c = (c * (2.51 * c + 0.03)) / (c * (2.43 * c + 0.59) + 0.14);
  return pow(clamp(c, 0.0, 1.0), vec3(1.0 / 2.2));
}

// The studio the caps reflect: a dark room, one big softbox high on the left,
// a thin strip on the right, and the blue floor underneath.
vec3 env(vec3 d) {
  vec3 c = mix(vec3(0.006, 0.007, 0.014), vec3(0.03, 0.033, 0.055), smoothstep(-0.2, 0.9, d.y));
  c += vec3(1.0, 0.97, 0.93) * smoothstep(0.86, 0.96, dot(d, normalize(vec3(-0.55, 0.78, 0.45)))) * 2.6;
  c += vec3(0.75, 0.8, 1.0) * smoothstep(0.94, 0.99, dot(d, normalize(vec3(0.85, 0.3, 0.25)))) * 1.1;
  c += uGlow * smoothstep(0.05, -0.55, d.y) * 0.95;
  return c;
}

void main() {
  int f = int(vInfo.x + 0.5);
  float hover = vInfo.z;
  vec3 base = uCap[f] * vInfo.w;
  vec3 ink = uInk[f];
  float rough = f == 0 ? 0.36 : f == 1 ? 0.46 : f == 2 ? 0.06 : f == 3 ? 0.3 : 0.42;
  if (uStem > 0.5) { base = uCap[5]; rough = 0.5; }
  if (uCore > 0.5) { base = uCap[6]; rough = 0.55; }

  vec3 N = normalize(vNormal);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(uCam - vWorld);

  // The legend is engraved into the dish: the mask colours it, and its
  // gradient tips the normal so the edges catch the light like a cut would.
  //
  // Sampled unconditionally and masked afterwards: a mipmapped lookup inside a
  // non-uniform branch has undefined derivatives, which shows up as sparkle
  // across the cap and legends that break into dashes.
  float hasLegend = step(0.0, vInfo.y) * (1.0 - uStem) * (1.0 - uCore);
  vec2 uv = vLocal.xz / (2.0 * TOP_HALF) + 0.5;
  float inside = step(0.0, uv.x) * step(0.0, uv.y) * step(uv.x, 1.0) * step(uv.y, 1.0);
  float top = smoothstep(KEY_H - 0.07, KEY_H - 0.035, vLocal.y) * inside * hasLegend;
  float id = floor(max(vInfo.y, 0.0) + 0.5);
  float row = floor((id + 0.5) / uCells);
  vec2 cell = vec2(id - row * uCells, row);
  vec2 auv = (cell + clamp(uv, 0.02, 0.98)) / uCells;
  float e = 1.5 / (uCells * CELL);
  float leg = texture(tLegend, auv).r * top;
  float gx = texture(tLegend, auv + vec2(e, 0.0)).r - texture(tLegend, auv - vec2(e, 0.0)).r;
  float gz = texture(tLegend, auv + vec2(0.0, e)).r - texture(tLegend, auv - vec2(0.0, e)).r;
  N = normalize(N + (normalize(vTx) * gx + normalize(vTz) * gz) * 0.45 * top);
  base = mix(base, ink, leg * (f == 2 ? 0.0 : 0.92));
  rough = mix(rough, 0.6, leg * 0.5);

  // Contact shadow: the walls darken toward the base, where the neighbouring
  // caps and the core close in.
  float ao = (uStem > 0.5 || uCore > 0.5) ? 0.55 : mix(0.28, 1.0, smoothstep(0.0, KEY_H * 0.85, vLocal.y));

  float ndv = max(dot(N, V), 0.0);
  float F = 0.04 + 0.96 * pow(1.0 - ndv, 5.0);
  float shin = mix(900.0, 22.0, rough);

  vec3 Ls[3];
  vec3 Cs[3];
  Ls[0] = normalize(vec3(-0.55, 0.85, 0.7));  Cs[0] = vec3(1.0, 0.96, 0.9) * 2.3;
  Ls[1] = normalize(vec3(0.2, -0.85, 0.5));   Cs[1] = uGlow * 1.5;
  Ls[2] = normalize(vec3(0.9, 0.35, -0.45));  Cs[2] = vec3(0.6, 0.68, 1.0) * 1.2;
  vec3 diff = vec3(0.0);
  vec3 spec = vec3(0.0);
  for (int i = 0; i < 3; i++) {
    float ndl = max(dot(N, Ls[i]), 0.0);
    vec3 H = normalize(Ls[i] + V);
    diff += Cs[i] * ndl;
    spec += Cs[i] * pow(max(dot(N, H), 0.0), shin) * (shin + 8.0) / 60.0 * ndl;
  }
  vec3 R = reflect(-V, N);
  vec3 envc = mix(env(R), env(N) * 0.5, rough);
  vec3 ambient = vec3(0.02, 0.022, 0.035) + uGlow * 0.06 * max(-N.y, 0.0);

  vec3 col;
  float alpha = 1.0;
  if (uGlass > 0.5) {
    // Clear plastic: mostly what it reflects, a little of its own tint, and
    // opaque only where the fresnel says so — which is what makes the edges
    // and the bevel read as thickness.
    alpha = clamp(0.1 + F * 0.95 + leg * 0.8, 0.0, 1.0);
    vec3 body = base * (diff * 0.1 + 0.05);
    col = body * alpha + envc * F * 1.4 + spec * 0.09;
    col += ink * leg * (0.35 + diff.r * 0.25);
    col += uGlow * hover * (0.25 + F) * 0.6;
  } else {
    col = base * (diff * 0.3 + ambient) * ao;
    col += (spec * 0.05 * (1.0 - rough * 0.7) + envc * F * (1.0 - rough * 0.55)) * mix(0.5, 1.0, ao);
    col += uGlow * hover * (0.06 + F * 1.1) * 0.7;
    col += ink * leg * hover * 0.35;
  }

  vec3 outc = tone(col);
  if (uReflect > 0.5) {
    float fade = exp(-max(uFloor - vWorld.y, 0.0) * 1.5) * 0.3;
    fragColor = vec4(outc * fade * alpha, fade * alpha);
  } else if (uGlass > 0.5) {
    fragColor = vec4(outc, alpha);
  } else {
    fragColor = vec4(outc, 1.0);
  }
}
`,Ir=c((s,y,b)=>{const o=s.createShader(y);if(!o)throw new Error("no shader");if(s.shaderSource(o,b),s.compileShader(o),!s.getShaderParameter(o,s.COMPILE_STATUS)){const T=s.getShaderInfoLog(o);throw s.deleteShader(o),new Error("shader: "+T)}return o},"compile"),Pr=c((s,y,b)=>{const o=Ir(s,s.VERTEX_SHADER,y),T=Ir(s,s.FRAGMENT_SHADER,b),R=s.createProgram();if(!R)throw new Error("no program");if(s.attachShader(R,o),s.attachShader(R,T),s.linkProgram(R),s.deleteShader(o),s.deleteShader(T),!s.getProgramParameter(R,s.LINK_STATUS)){const x=s.getProgramInfoLog(R);throw s.deleteProgram(R),new Error("link: "+x)}return R},"link"),Wd=c((s,y,b,o)=>{const T=1/Math.tan(s/2),R=1/(b-o);return[T/y,0,0,0,0,T,0,0,0,0,(o+b)*R,-1,0,0,2*o*b*R,0]},"perspective"),Ru=c((s,y)=>[s[0]-y[0],s[1]-y[1],s[2]-y[2]],"sub"),Yl=c((s,y)=>s[0]*y[0]+s[1]*y[1]+s[2]*y[2],"dot"),ti=c((s,y)=>[s[1]*y[2]-s[2]*y[1],s[2]*y[0]-s[0]*y[2],s[0]*y[1]-s[1]*y[0]],"cross"),ce=c(s=>{const y=Math.hypot(s[0],s[1],s[2])||1;return[s[0]/y,s[1]/y,s[2]/y]},"norm"),Fd=c((s,y)=>{const b=ce(Ru(s,y)),o=ce(ti([0,1,0],b)),T=ti(b,o);return{m:[o[0],T[0],b[0],0,o[1],T[1],b[1],0,o[2],T[2],b[2],0,-Yl(o,s),-Yl(T,s),-Yl(b,s),1],right:o,up:T,forward:[-b[0],-b[1],-b[2]]}},"lookAt"),$d=c((s,y)=>{const b=new Array(16);for(let o=0;o<4;o++)for(let T=0;T<4;T++)b[o*4+T]=s[T]*y[o*4]+s[4+T]*y[o*4+1]+s[8+T]*y[o*4+2]+s[12+T]*y[o*4+3];return b},"mul4"),t1=c((s,y)=>{const b=s[0]*y[0]+s[4]*y[1]+s[8]*y[2]+s[12],o=s[1]*y[0]+s[5]*y[1]+s[9]*y[2]+s[13],T=s[3]*y[0]+s[7]*y[1]+s[11]*y[2]+s[15];return[b/T,o/T]},"project"),qn=20,Gn=2,oo=28*Math.PI/180;


export default function KeycapOrb({
  keys: s = PORTFOLIO_KEYCAPS,
  palette: y,
  background: b,
  glow: o,
  rings: T = 9,
  scale: R = 0.62,
  autoRotate: x = true,
  speed: V = 0.8,
  reflection: D = true,
  ripple: A = true,
  height: L = "400px",
  onKeyPress: K,
  className: j = "",
  "aria-label": Tt = "Interactive 3D Keycap Tech Orb. Drag to spin, hover, or focus and type."
}) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.body.classList.contains("portfolio-dark");
    }
    return false;
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains("portfolio-dark"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const currentBg = b || (isDark ? "#141311" : "#faf6eb");
  const currentGlow = o || (isDark ? "#ed432f" : "#ed432f");
  const currentPalette = y || (isDark ? PORTFOLIO_PALETTE_DARK : PORTFOLIO_PALETTE_LIGHT);
const _t=useRef(null),Ot=useRef(null),[Dt,il]=useState(!1),[jt,St]=useState(0),[vl,ft]=useState(!1),[rl,hl]=useState("");useEffect(()=>{const Mt=window.matchMedia("(prefers-reduced-motion: reduce)"),tt=c(()=>ft(Mt.matches),"sync");return tt(),Mt.addEventListener("change",tt),()=>Mt.removeEventListener("change",tt)},[]);const Qt=useRef({palette:currentPalette,background:currentBg,glow:currentGlow,scale:R,autoRotate:x,speed:V,reflection:D,ripple:A,reduced:vl,onKeyPress:K});Qt.current={palette:currentPalette,background:currentBg,glow:currentGlow,scale:R,autoRotate:x,speed:V,reflection:D,ripple:A,reduced:vl,onKeyPress:K};const Gl=useMemo(()=>Math.round(Ou(T,5,15))+"|"+JSON.stringify(s??[]),[T,s]);return useEffect(()=>{const Mt=Ot.current,tt=_t.current;if(!Mt||!tt)return;const d=Mt.getContext("webgl2",{alpha:!1,antialias:!0,premultipliedAlpha:!1});if(!d){il(!0);return}const ie=Math.round(Ou(T,5,15)),$l=Ud(ie),kt=Nd($l),p=s&&s.length?s:Wr,B=$l.length,Q=Math.PI/(ie-1),dt=Gn*Q*.92,h=new Array(B);kt.forEach((z,Y)=>{h[z]=Y<p.length?p[Y]:p[Y*7%p.length]});const N=[],q=new Map;for(const z of h){const Y=$r(z);Y&&!q.has(Y)&&N.length<64&&(q.set(Y,N.length),N.push(Y))}const C=Dd(1801812323),X=$l.map((z,Y)=>{var Zl;const H=z.dir,$=z.east,ot=ce(ti(H,$)),I=(C()-.5)*.09,W=C()*Math.PI*2,zt=(C()-.5)*.08,ml=ce([$[0]*Math.cos(W)+ot[0]*Math.sin(W),$[1]*Math.cos(W)+ot[1]*Math.sin(W),$[2]*Math.cos(W)+ot[2]*Math.sin(W)]),el=ba(ve(ml,I),ve(H,zt)),ee=zu(el,H),zl=zu(el,$),Rl=ti(zl,ee),Ol=C()<.12?.18+C()*.12:(C()-.3)*.06,Me=((Zl=h[Y])==null?void 0:Zl.finish)??"ink";return{x:zl,y:ee,z:Rl,dir:H,size:dt*z.size,pop:Me==="glass"?Math.max(Ol,.1):Ol,finish:Cd[Me]??0,cell:q.get($r(h[Y]??{}))??-1,shade:.92+C()*.16}}),et=X.map((z,Y)=>z.finish===2?Y:-1).filter(z=>z>=0),k=X.map((z,Y)=>z.finish!==2?Y:-1).filter(z=>z>=0);let wt=null,vt=null;const Xl=[],Ve=[];let fe=null,yl=null,Il=null,Tl=0,Za=!1,Uu=!0;const Ml=c(z=>{z.preventDefault(),cancelAnimationFrame(Tl),Tl=0},"onLost"),Xn=c(()=>St(z=>z+1),"onRestored");Mt.addEventListener("webglcontextlost",Ml),Mt.addEventListener("webglcontextrestored",Xn);const ja=c(()=>{const z=Math.min(window.devicePixelRatio||1,2),Y=Math.round(Mt.clientWidth*z),H=Math.round(Mt.clientHeight*z);Y===0||H===0||(Mt.width!==Y||Mt.height!==H)&&(Mt.width=Y,Mt.height=H)},"resize"),Nu=new ResizeObserver(ja);Nu.observe(Mt);const Ze=c((z,Y)=>{const H=d.createVertexArray();if(!H)throw new Error("no vao");Ve.push(H),d.bindVertexArray(H);const $=d.createBuffer(),ot=d.createBuffer(),I=d.createBuffer();if(!$||!ot||!I)throw new Error("no buffer");Xl.push($,ot,I),d.bindBuffer(d.ARRAY_BUFFER,$),d.bufferData(d.ARRAY_BUFFER,z.pos,d.STATIC_DRAW),d.enableVertexAttribArray(0),d.vertexAttribPointer(0,3,d.FLOAT,!1,0,0),d.bindBuffer(d.ARRAY_BUFFER,ot),d.bufferData(d.ARRAY_BUFFER,z.nor,d.STATIC_DRAW),d.enableVertexAttribArray(1),d.vertexAttribPointer(1,3,d.FLOAT,!1,0,0),d.bindBuffer(d.ELEMENT_ARRAY_BUFFER,I),d.bufferData(d.ELEMENT_ARRAY_BUFFER,z.idx,d.STATIC_DRAW);for(let W=0;W<5;W++)d.enableVertexAttribArray(2+W),d.vertexAttribDivisor(2+W,1);return Aa(Y,0),d.bindVertexArray(null),{vao:H,count:z.idx.length}},"meshVao"),Aa=c((z,Y)=>{d.bindBuffer(d.ARRAY_BUFFER,z);for(let H=0;H<5;H++)d.vertexAttribPointer(2+H,4,d.FLOAT,!1,qn*4,Y*qn*4+H*16)},"pointInstances");let Nt={},ye={},je={vao:null,count:0},me={vao:null,count:0},Pt={vao:null,count:0},Pl=1;const qt=new Float32Array(B*qn);let ge=ve([1,0,0],-.14),Lt=[0,0],Se=[0,0];const be=new Float32Array(B),Qe=new Float32Array(B),tl=new Uint8Array(B),Ta=new Float32Array(B),pl=[],xu=performance.now();let Qa=xu,we=-1,Ee={x:0,y:0,inside:!1},nt={active:!1,moved:!1,id:-1,sx:0,sy:0,lx:0,ly:0,lt:0,key:-1},Ma=new Map,Vl=[0,0,0],Bt={eye:[0,0,10],right:[1,0,0],up:[0,1,0],forward:[0,0,-1],aspect:1};const _l=X.map(()=>({x:[0,0,0],y:[0,0,0],z:[0,0,0],p:[0,0,0],s:1})),Hu=c((z,Y)=>{const H=Mt.getBoundingClientRect(),$=(z-H.left)/Math.max(H.width,1)*2-1,ot=1-(Y-H.top)/Math.max(H.height,1)*2,I=Math.tan(oo/2),W=ce([Bt.forward[0]+Bt.right[0]*$*I*Bt.aspect+Bt.up[0]*ot*I,Bt.forward[1]+Bt.right[1]*$*I*Bt.aspect+Bt.up[1]*ot*I,Bt.forward[2]+Bt.right[2]*$*I*Bt.aspect+Bt.up[2]*ot*I]);return{o:Bt.eye,d:W}},"ray"),Lu=c((z,Y)=>{const{o:H,d:$}=Hu(z,Y);let ot=-1,I=Bd(H,$,Vl,Gn*.98);I<0&&(I=1/0);for(let W=0;W<B;W++){const zt=_l[W],ml=Ru(H,zt.p),el=zt.s*zt.s,ee=[Yl(ml,zt.x)/el,Yl(ml,zt.y)/el,Yl(ml,zt.z)/el],zl=[Yl($,zt.x)/el,Yl($,zt.y)/el,Yl($,zt.z)/el],Rl=Ld(ee,zl,[-.5,0,-.5],[.5,Du,.5]);Rl>=0&&Rl<I&&(I=Rl,ot=W)}return ot},"pick"),Vn=c(z=>{var ot,I;const Y=(performance.now()-xu)/1e3;Qt.current.ripple&&!Qt.current.reduced&&(pl.push({origin:X[z].dir,t0:Y}),pl.length>6&&pl.shift());const H=h[z],$=(H==null?void 0:H.label)||(H!=null&&H.icon&&H.icon!=="none"?H.icon:"blank");hl($+" pressed"),(I=(ot=Qt.current).onKeyPress)==null||I.call(ot,H??{},z)},"fire"),te=c(()=>{let z=0,Y=-1/0;for(let H=0;H<B;H++){const $=_l[H],ot=ce(Ru(Bt.eye,$.p)),I=Yl(ce($.y),ot);I>Y&&(Y=I,z=H)}return z},"facingIndex"),Wt=c(z=>{const Y=z.toLowerCase(),H=[];if(h.forEach((W,zt)=>{W.hotkey&&W.hotkey.toLowerCase()===Y&&H.push(zt)}),!H.length&&z.length===1){const W=Gd[z]??[];h.forEach((zt,ml)=>{(zt.icon&&W.includes(zt.icon)||zt.label&&zt.label.toLowerCase().startsWith(Y))&&H.push(ml)})}let $=-1,ot=-1/0;for(const W of H){const zt=Yl(ce(_l[W].y),ce(Ru(Bt.eye,_l[W].p)));zt>ot&&(ot=zt,$=W)}if($>=0||z.length!==1)return $;const I=[];for(let W=0;W<B;W++)Yl(ce(_l[W].y),ce(Ru(Bt.eye,_l[W].p)))>.55&&I.push(W);return I.length?I[z.codePointAt(0)%I.length]:te()},"keyFor"),ll=c(z=>{var H;if(z.button!==0&&z.pointerType==="mouse")return;(H=tt.setPointerCapture)==null||H.call(tt,z.pointerId);const Y=Lu(z.clientX,z.clientY);nt={active:!0,moved:!1,id:z.pointerId,sx:z.clientX,sy:z.clientY,lx:z.clientX,ly:z.clientY,lt:performance.now(),key:Y},Lt=[0,0],Y>=0&&(tl[Y]=1),tt.style.cursor="grabbing"},"onPointerDown"),Ae=c(z=>{const Y=tt.getBoundingClientRect();if(Ee={x:(z.clientX-Y.left)/Math.max(Y.width,1)*2-1,y:(z.clientY-Y.top)/Math.max(Y.height,1)*2-1,inside:!0},nt.active&&z.pointerId===nt.id){const H=z.clientX-nt.lx,$=z.clientY-nt.ly;if(!nt.moved&&Math.hypot(z.clientX-nt.sx,z.clientY-nt.sy)>6&&(nt.moved=!0,nt.key>=0&&(tl[nt.key]=0)),nt.moved){const ot=Math.PI*1.2/Math.max(Math.min(Y.width,Y.height),1);ge=$c(ba(ba(ve([0,1,0],H*ot),ve(Bt.right,$*ot)),ge));const I=performance.now(),W=Math.max(I-nt.lt,1)/1e3;Lt=[Lt[0]*.6+H*ot/W*.4,Lt[1]*.6+$*ot/W*.4],nt.lt=I}nt.lx=z.clientX,nt.ly=z.clientY}else we=Lu(z.clientX,z.clientY),tt.style.cursor=we>=0?"pointer":"grab"},"onPointerMove"),wa=c(z=>{var Y;!nt.active||z.pointerId!==nt.id||(performance.now()-nt.lt>80&&(Lt=[0,0]),!nt.moved&&nt.key>=0&&(tl[nt.key]=0,Vn(nt.key)),nt.active=!1,(Y=tt.releasePointerCapture)==null||Y.call(tt,z.pointerId),tt.style.cursor=we>=0?"pointer":"grab")},"onPointerUp"),Zn=c(z=>{nt.key>=0&&(tl[nt.key]=0),z.pointerId===nt.id&&(nt.active=!1)},"onPointerCancel"),jn=c(()=>{Ee.inside=!1,nt.active||(we=-1)},"onPointerLeave"),Bu=c(z=>{if(z.metaKey||z.ctrlKey||z.altKey)return;const Y=1.6;if(z.key==="ArrowLeft")Lt=[-Y,Lt[1]];else if(z.key==="ArrowRight")Lt=[Y,Lt[1]];else if(z.key==="ArrowUp")Lt=[Lt[0],-Y];else if(z.key==="ArrowDown")Lt=[Lt[0],Y];else{if(z.key==="Tab"||z.key==="Escape"||z.key==="Shift")return;{if(z.repeat){z.preventDefault();return}const H=z.key==="Enter"||z.key===" "?te():Wt(z.key);if(H<0)return;tl[H]=1,Ma.set(z.key.toLowerCase(),H)}}z.preventDefault()},"onKeyDown"),Ke=c(z=>{const Y=Ma.get(z.key.toLowerCase());Y!==void 0&&(Ma.delete(z.key.toLowerCase()),tl[Y]=0,Vn(Y))},"onKeyUp"),Ka=c(()=>{Ma.forEach(z=>tl[z]=0),Ma=new Map},"onBlur");tt.addEventListener("pointerdown",ll),tt.addEventListener("pointermove",Ae),tt.addEventListener("pointerup",wa),tt.addEventListener("pointercancel",Zn),tt.addEventListener("pointerleave",jn),tt.addEventListener("keydown",Bu),tt.addEventListener("keyup",Ke),tt.addEventListener("blur",Ka);const Te=new IntersectionObserver(z=>{Uu=z.some(Y=>Y.isIntersecting),Uu&&!Tl&&!Za&&(Qa=performance.now(),Tl=requestAnimationFrame(le))});Te.observe(tt);const le=c(()=>{var _e,Xu;if(Tl=0,Za||!Uu)return;const z=Qt.current,Y=performance.now(),H=Math.min((Y-Qa)/1e3,.05);Qa=Y;const $=(Y-xu)/1e3,ot=z.reduced;ja();const I=Mt.width,W=Mt.height;if(I===0||W===0){Tl=requestAnimationFrame(le);return}if(!nt.active){if(Math.abs(Lt[0])+Math.abs(Lt[1])>1e-4){ge=$c(ba(ba(ve([0,1,0],Lt[0]*H),ve(Bt.right,Lt[1]*H)),ge));const P=Math.exp(-H*2.2);Lt=[Lt[0]*P,Lt[1]*P]}z.autoRotate&&!ot&&(ge=$c(ba(ve([0,1,0],.16*Ou(z.speed,-6,6)*H),ge)))}const zt=Ee.inside&&!nt.active?[Ee.x*.12,Ee.y*.1]:[0,0],ml=1-Math.exp(-H*4);Se=[Se[0]+(zt[0]-Se[0])*ml,Se[1]+(zt[1]-Se[1])*ml];const el=$c(ba(ba(ve([0,1,0],Se[0]),ve([1,0,0],Se[1])),ge)),ee=I/W,zl=Gn+dt*Du,Rl=Hd(zl,oo,ee,z.scale);Vl=[0,ot?0:Math.sin($*.9)*.05,0];const Me=-zl*1.16,Zl=[0,Rl*.12,Rl],Je=[0,-zl*.12,0],pe=Fd(Zl,Je);Bt={eye:Zl,right:pe.right,up:pe.up,forward:pe.forward,aspect:ee};const Cu=Wd(oo,ee,.1,100),Yu=$d(Cu,pe.m),qu=1-Math.exp(-H*14);for(let P=0;P<B;P++){const yt=X[P];be[P]+=((P===we?1:0)-be[P])*qu,Qe[P]+=(tl[P]-Qe[P])*(tl[P]?1-Math.exp(-H*30):qu);let xt=0;for(const Dl of pl)xt+=xd($-Dl.t0,a1(yt.dir,Dl.origin));Ta[P]=yt.pop+be[P]*.16-Qe[P]*.3+xt}for(;pl.length&&$-pl[0].t0>4;)pl.shift();for(let P=0;P<B;P++){const yt=X[P],xt=_l[P],Dl=zu(el,yt.x),jl=zu(el,yt.y),_a=zu(el,yt.z),Vu=zu(el,yt.dir),Zu=Gn+Ta[P]*yt.size*Du;xt.s=yt.size,xt.x=[Dl[0]*yt.size,Dl[1]*yt.size,Dl[2]*yt.size],xt.y=[jl[0]*yt.size,jl[1]*yt.size,jl[2]*yt.size],xt.z=[_a[0]*yt.size,_a[1]*yt.size,_a[2]*yt.size],xt.p=[Vl[0]+Vu[0]*Zu,Vl[1]+Vu[1]*Zu,Vl[2]+Vu[2]*Zu]}const gl=et.map(P=>({i:P,d:Yl(Ru(_l[P].p,Zl),pe.forward)})).sort((P,yt)=>yt.d-P.d).map(P=>P.i);k.concat(gl).forEach((P,yt)=>{const xt=_l[P],Dl=X[P],jl=yt*qn;qt.set([xt.x[0],xt.x[1],xt.x[2],0,xt.y[0],xt.y[1],xt.y[2],0,xt.z[0],xt.z[1],xt.z[2],0,xt.p[0],xt.p[1],xt.p[2],1],jl),qt[jl+16]=Dl.finish,qt[jl+17]=Dl.cell,qt[jl+18]=be[P],qt[jl+19]=Dl.shade}),d.bindBuffer(d.ARRAY_BUFFER,yl),d.bufferSubData(d.ARRAY_BUFFER,0,qt);const Gu=Gn*.985;d.bindBuffer(d.ARRAY_BUFFER,Il),d.bufferSubData(d.ARRAY_BUFFER,0,new Float32Array([Gu,0,0,0,0,Gu,0,0,0,0,Gu,0,Vl[0],Vl[1],Vl[2],1,0,-1,0,1]));const pa=z.palette??{},Ja=[],ke=[];for(const P of["ink","ash","glass","cobalt","lime"])Ja.push(...Ea((_e=pa[P])==null?void 0:_e.cap,Ea(kr[P].cap,[0,0,0]))),ke.push(...Ea((Xu=pa[P])==null?void 0:Xu.legend,Ea(kr[P].legend,[1,1,1])));Ja.push(...Ea("#c9cfe0",[.6,.6,.7]),...Ea("#050508",[0,0,0])),ke.push(0,0,0,0,0,0);const We=Ea(z.glow,[.014,.03,1]),fl=Ea(z.background,[.001,.001,.002]);d.viewport(0,0,I,W),d.clearColor(0,0,0,1),d.clear(d.COLOR_BUFFER_BIT|d.DEPTH_BUFFER_BIT);const ka=t1(Yu,Vl),Qn=t1(Yu,[0,Me,0]);d.disable(d.DEPTH_TEST),d.disable(d.BLEND),d.useProgram(wt),d.bindVertexArray(Ve[0]),d.uniform2f(ye.uRes,I,W),d.uniform3f(ye.uBg,fl[0],fl[1],fl[2]),d.uniform3f(ye.uGlow,We[0],We[1],We[2]),d.uniform2f(ye.uOrb,ka[0]*ee/2,ka[1]/2),d.uniform1f(ye.uHorizon,Qn[1]/2),d.uniform1f(ye.uSeed,ot?0:$*7.3%100),d.drawArrays(d.TRIANGLES,0,3),d.useProgram(vt),d.uniformMatrix4fv(Nt.uViewProj,!1,Yu),d.uniform3f(Nt.uCam,Zl[0],Zl[1],Zl[2]),d.uniform3fv(Nt.uCap,Ja),d.uniform3fv(Nt.uInk,ke),d.uniform3f(Nt.uGlow,We[0],We[1],We[2]),d.uniform1f(Nt.uCells,Pl),d.uniform1f(Nt.uFloor,Me),d.uniform1i(Nt.tLegend,0),d.activeTexture(d.TEXTURE0),d.bindTexture(d.TEXTURE_2D,fe),d.enable(d.DEPTH_TEST),d.enable(d.CULL_FACE);const Fe=c(P=>{if(d.uniform1f(Nt.uStem,0),d.uniform1f(Nt.uCore,0),!P){d.uniform1f(Nt.uGlass,0),d.uniform1f(Nt.uCore,1),d.bindVertexArray(Pt.vao),Aa(Il,0),d.drawElementsInstanced(d.TRIANGLES,Pt.count,d.UNSIGNED_SHORT,0,1),d.uniform1f(Nt.uCore,0),d.bindVertexArray(je.vao),Aa(yl,0),d.drawElementsInstanced(d.TRIANGLES,je.count,d.UNSIGNED_SHORT,0,k.length),et.length&&(d.uniform1f(Nt.uStem,1),d.bindVertexArray(me.vao),Aa(yl,k.length),d.drawElementsInstanced(d.TRIANGLES,me.count,d.UNSIGNED_SHORT,0,et.length),d.uniform1f(Nt.uStem,0));return}et.length&&(d.uniform1f(Nt.uGlass,1),d.depthMask(!1),d.bindVertexArray(je.vao),Aa(yl,k.length),d.cullFace(d.FRONT),d.drawElementsInstanced(d.TRIANGLES,je.count,d.UNSIGNED_SHORT,0,et.length),d.cullFace(d.BACK),d.drawElementsInstanced(d.TRIANGLES,je.count,d.UNSIGNED_SHORT,0,et.length),d.depthMask(!0),d.uniform1f(Nt.uGlass,0))},"drawSet");z.reflection&&(d.uniform1f(Nt.uReflect,1),d.frontFace(d.CW),d.enable(d.BLEND),d.blendFunc(d.ONE,d.ONE_MINUS_SRC_ALPHA),Fe(!1),Fe(!0),d.frontFace(d.CCW),d.clear(d.DEPTH_BUFFER_BIT)),d.uniform1f(Nt.uReflect,0),d.disable(d.BLEND),Fe(!1),d.enable(d.BLEND),d.blendFunc(d.ONE,d.ONE_MINUS_SRC_ALPHA),Fe(!0),d.disable(d.BLEND),d.bindVertexArray(null),Tl=requestAnimationFrame(le)},"frame");try{wt=Pr(d,wd,Kd),vt=Pr(d,Jd,kd);for(const $ of["uRes","uBg","uGlow","uOrb","uHorizon","uSeed"])ye[$]=d.getUniformLocation(wt,$);for(const $ of["uViewProj","uReflect","uFloor","uCam","uCap","uInk","uGlow","tLegend","uCells","uGlass","uStem","uCore"])Nt[$]=d.getUniformLocation(vt,$);const z=d.createVertexArray();if(!z)throw new Error("no vao");if(Ve.push(z),yl=d.createBuffer(),Il=d.createBuffer(),!yl||!Il)throw new Error("no buffer");Xl.push(yl,Il),d.bindBuffer(d.ARRAY_BUFFER,yl),d.bufferData(d.ARRAY_BUFFER,qt.byteLength,d.DYNAMIC_DRAW),d.bindBuffer(d.ARRAY_BUFFER,Il),d.bufferData(d.ARRAY_BUFFER,qn*4,d.DYNAMIC_DRAW),je=Ze(Vd(),yl),me=Ze(Zd(),yl),Pt=Ze(jd(),Il);const Y=Qd(N);Pl=Y.cells,fe=d.createTexture(),d.activeTexture(d.TEXTURE0),d.bindTexture(d.TEXTURE_2D,fe),d.pixelStorei(d.UNPACK_FLIP_Y_WEBGL,!1),d.texImage2D(d.TEXTURE_2D,0,d.RGBA,d.RGBA,d.UNSIGNED_BYTE,Y.canvas),d.generateMipmap(d.TEXTURE_2D),d.texParameteri(d.TEXTURE_2D,d.TEXTURE_MIN_FILTER,d.LINEAR_MIPMAP_LINEAR),d.texParameteri(d.TEXTURE_2D,d.TEXTURE_MAG_FILTER,d.LINEAR),d.texParameteri(d.TEXTURE_2D,d.TEXTURE_WRAP_S,d.CLAMP_TO_EDGE),d.texParameteri(d.TEXTURE_2D,d.TEXTURE_WRAP_T,d.CLAMP_TO_EDGE);const H=d.getExtension("EXT_texture_filter_anisotropic");H&&d.texParameterf(d.TEXTURE_2D,H.TEXTURE_MAX_ANISOTROPY_EXT,4),ja(),Tl=requestAnimationFrame(le)}catch{Za||il(!0)}return()=>{Za=!0,cancelAnimationFrame(Tl),Nu.disconnect(),Te.disconnect(),Mt.removeEventListener("webglcontextlost",Ml),Mt.removeEventListener("webglcontextrestored",Xn),tt.removeEventListener("pointerdown",ll),tt.removeEventListener("pointermove",Ae),tt.removeEventListener("pointerup",wa),tt.removeEventListener("pointercancel",Zn),tt.removeEventListener("pointerleave",jn),tt.removeEventListener("keydown",Bu),tt.removeEventListener("keyup",Ke),tt.removeEventListener("blur",Ka);for(const z of Xl)d.deleteBuffer(z);for(const z of Ve)d.deleteVertexArray(z);fe&&d.deleteTexture(fe);wt&&d.deleteProgram(wt);vt&&d.deleteProgram(vt);
    };
  }, [jt, Gl]);

  return (
    <div
      ref={_t}
      role="application"
      aria-roledescription="keycap orb"
      aria-label={Tt}
      tabIndex={0}
      className={`relative w-full select-none overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-terracotta ${j}`}
      style={{ height: L, background: currentBg, cursor: "grab", touchAction: "pan-y" }}
    >
      {Dt ? (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `radial-gradient(60% 45% at 55% 100%, ${currentGlow} 0%, transparent 70%), radial-gradient(30% 30% at 50% 45%, #15161c 0%, #08080c 60%, transparent 61%)`
          }}
        />
      ) : (
        <canvas
          ref={Ot}
          aria-hidden="true"
          className="absolute inset-0 block"
          style={{ width: "100%", height: "100%", maxWidth: "none" }}
        />
      )}
      <span
        aria-live="polite"
        className="pointer-events-none absolute overflow-hidden"
        style={{ width: 1, height: 1, clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}
      >
        {rl}
      </span>
    </div>
  );
}

