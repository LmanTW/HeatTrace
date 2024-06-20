"use strict";var t,e=Object.create,r=Object.defineProperty,a=Object.getOwnPropertyDescriptor,s=Object.getOwnPropertyNames,o=Object.getPrototypeOf,i=Object.prototype.hasOwnProperty,n=(t,e,o,n)=>{if(e&&"object"==typeof e||"function"==typeof e)for(let h of s(e))i.call(t,h)||h===o||r(t,h,{get:()=>e[h],enumerable:!(n=a(e,h))||n.enumerable});return t},h=(t,a,s)=>(s=null!=t?e(o(t)):{},n(!a&&t&&t.__esModule?s:r(s,"default",{value:t,enumerable:!0}),t)),d={};((t,e)=>{for(var a in e)r(t,a,{get:e[a],enumerable:!0})})(d,{Color:()=>u,HeatTrace:()=>B,loadReplay:()=>g}),module.exports=(t=d,n(r({},"__esModule",{value:!0}),t));var l,c=h(require("worker_threads"));(l||(l={})).getGradientColor=function(t,e){const r=1/(e.length-1);let a=Math.floor(t/r);return a>=e.length&&(a=e.length-1),function(t,e,r){let a=Math.round(t.r+(e.r-t.r)*r),s=Math.round(t.g+(e.g-t.g)*r),o=Math.round(t.b+(e.b-t.b)*r);return a>255&&(a=255),s>255&&(s=255),o>255&&(o=255),{r:a,g:s,b:o}}(e[a],e[a+1]||e[a],t%r/r)};var u=l,p=require("lzma-native"),f=class{_data="";_index=0;constructor(t){t.forEach((t=>this._data+=t.toString(2).padStart(8,"0")))}readByte(){return parseInt(this._read(8),2)}readShort(){return y([this._read(8),this._read(8)],8)}readInteger(){return y([this._read(8),this._read(8),this._read(8),this._read(8)],8)}readLong(){return y([this._read(8),this._read(8),this._read(8),this._read(8),this._read(8),this._read(8),this._read(8),this._read(8)],8)}readULEB128(){const t=[];for(;;){const e=this._read(8);if(t.push(e.substring(1,8)),"0"===e[0])break}return y(t,7)}readString(){if(11===this.readByte()){const t=this.readULEB128();let e=[];for(let r=0;r<t;r++)e.push(parseInt(this._read(8),2));return Buffer.from(e).toString("utf8")}return""}_read(t){const e=this._data.substring(this._index,this._index+t);return this._index+=t,e}};function y(t,e){let r=0,a=0;for(let s=0;s<t.length;s++){r|=(parseInt(t[s],2)&(1<<e)-1)<<a,a+=e}return r}async function g(t){return new Promise((e=>{const r=new f(t),a=r.readByte(),s=r.readInteger(),o=r.readString(),i=r.readString(),n=r.readString(),h=r.readShort(),d=r.readShort(),l=r.readShort(),c=r.readShort(),u=r.readShort(),y=r.readShort(),g=r.readInteger(),_=r.readShort(),m=r.readByte();r.readInteger(),r.readString(),r.readLong();const b=r.readInteger(),w=new Uint8Array(b);for(let t=0;t<b;t++)w[t]=r.readByte();const k={version:s,gameMode:["standard","taiko","catch","mania"][a],beatmapHash:o,replayHash:n,playerName:i,great:h,ok:d,meh:l,gekis:c,katus:u,misses:y,score:g,greatestCombo:_,perfect:1===m};(0,p.decompress)(Buffer.from(w),void 0,(t=>{const r=t.toString().split(","),a=new Float64Array(r.length),s=new Float64Array(r.length),o=new Float64Array(r.length);let i=0;r.forEach(((t,e)=>{const n=t.split("|");if(+n[1]>0&&+n[2]>0)a[e]=+n[1],s[e]=+n[2];else{const t=function(t){for(let e=0;e<t.length;e+=3){const r=t[e].split("|");if(+r[0]>0&&+r[1]>0)return{x:+r[0],y:+r[1]}}return{x:0,y:0}}(r);a[e]=t.x,s[e]=t.y}i+=+n[0],o[e]=i})),k.cursor={xPositions:a,yPositions:s,timeStamps:o},e(k)}))}))}var _=h(require("path")),m=h(require("os")),b=h(require("fs")),w=h(require("worker_threads")),k=(t,e)=>{let r=S(t);for(;e.includes(r);)r=S(t);return r};function S(t){let e="";for(let s=0;s<t;s++)e+=I[(r=0,a=I.length-1,Math.floor(Math.random()*a)+r)];var r,a;return e}var I="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789",M=class{_workers={};_requests={};_batches={};async startWorkers(t){const e=[];for(let r=0;r<t;r++){const t=k(5,Object.keys(this._workers));this._workers[t]={state:"starting",worker:new w.default.Worker(__filename,{workerData:{type:"HeatTrace"}})},e.push(this._handleWorker(t))}await Promise.all(e)}stopWorkers(){Object.keys(this._workers).forEach((t=>this._workers[t].worker.terminate())),this._workers={}}createBatch(t,e,r){return new Promise((a=>{const s={type:t,totalJobs:e.length,jobs:{},results:[],progressCallback:r,finishCallback:a};e.forEach((t=>s.jobs[k(5,Object.keys(s.jobs))]={state:"waiting",data:t})),this._batches[k(5,Object.keys(this._batches))]=s,this._assignJobs()}))}async sendRequest(t,e){return new Promise((r=>{const a=k(5,Object.keys(this._requests));this._requests[a]=r,this._sendMessage(t,{type:"request",data:e,requestID:a})}))}_sendMessage(t,e){if(void 0===this._workers[t])throw new Error(`Worker Not Found: "${t}"`);this._workers[t].worker.postMessage(e)}_assignJobs(){for(let t of Object.keys(this._workers)){const e=this._workers[t];if("readied"===e.state){const r=this._getJob();if(void 0===r)break;const a=this._batches[r.batchID];e.state="working",a.jobs[r.jobID].state="inProgress",this._sendMessage(t,{type:"assignJob",batchID:r.batchID,batchType:a.type,jobID:r.jobID,data:a.jobs[r.jobID].data})}}}_getJob(){for(let t of Object.keys(this._batches)){const e=this._batches[t];for(let r of Object.keys(e.jobs))if("waiting"===e.jobs[r].state)return{batchID:t,jobID:r};break}}async _handleWorker(t){if(void 0===this._workers[t])throw new Error(`Worker Not Found: "${t}"`);return new Promise((e=>{const r=this._workers[t];r.worker.on("message",(async t=>{if("ready"===t.type)r.state="readied",e();else if("jobFinished"===t.type){const e=this._batches[t.batchID];delete e.jobs[t.jobID],e.results.push(t.data),void 0!==e.progressCallback&&e.progressCallback({total:e.totalJobs,finished:e.totalJobs-Object.keys(e.jobs).length}),r.state="readied",this._assignJobs(),0===Object.keys(e.jobs).length&&(e.finishCallback(e.results),delete this._batches[t.batchID])}}))}))}},j=class{_state="none";_options;_replaysCursorData=[];_length=0;_frameInterval=0;_frames=0;WorkerManager=new M;constructor(t){void 0===t&&(t={});const e=t.style||{};this._options={width:t.width||512,height:t.height||384,style:{traceSize:e.traceSize||1,heatBoost:e.traceSize||1.75,cursor:!0,cursorSize:1,cursorColorDistribution:"player",colors:e.colors||[{r:0,g:0,b:0},{r:106,g:4,b:15},{r:208,g:0,b:0},{r:232,g:93,b:4},{r:250,g:163,b:7},{r:255,g:255,b:255}],cursorColors:[{r:239,g:71,b:111},{r:255,g:209,b:102},{r:6,g:214,b:160},{r:6,g:163,b:214}]},imageFormat:t.imageFormat||"png",videoFPS:t.videoFPS||30,videoSpeed:t.videoSpeed||1,threads:m.default.cpus().length/2}}get state(){return this._state}get options(){return this._options}async initialize(){if("none"!==this._state)throw new Error(`Cannot Initialize HeatTrace: ${this._state}`);this._state="initializing",await this.WorkerManager.startWorkers(this._options.threads),this._state="initialized"}async loadReplays(t,e){if("initialized"!==this._state)throw new Error(`Cannot Load Replays: ${this._state}`);const r=await this.WorkerManager.createBatch("loadReplays",t,(t=>{void 0!==e&&e({total:t.total,loaded:t.finished})})),a=[];let s,o=0,i=0;for(let t of r)if(t.error)i++;else{if(void 0===s)s=t.data.beatmapHash;else if(t.data.beatmapHash!==s)return{error:!0,message:"Found Replays With Different Beatmaps"};t.data.timeStamps[t.data.timeStamps.length-1]>o&&(o=t.data.timeStamps[t.data.timeStamps.length-1]),a.push({replayHash:t.data.replayHash,playerName:t.data.playerName,xPositions:t.data.xPositions,yPositions:t.data.yPositions,timeStamps:t.data.timeStamps})}return this._replaysCursorData=a,this._length=o,this._frameInterval=1e3/this._options.videoFPS/this.options.videoSpeed,this._frames=Math.round(o/this._frameInterval),{error:!1,data:{failed:i}}}async renderImage(t){if("initialized"!==this._state)throw new Error(`Cannot Calculate An Image: ${this._state}`);const e=await this._calculateHeatmap(0,1/0,(e=>{void 0!==t&&t({type:"calculatingHeatmap",total:e.total,finished:e.finished})}));void 0!==t&&t({type:"rendering",total:1,finished:0});const r=(await this.WorkerManager.createBatch("renderImage",[{format:this._options.imageFormat,width:this._options.width,height:this._options.height,heatmap:e.data,cursors:[],style:this._options.style}]))[0];return void 0!==t&&t({type:"rendering",total:1,finished:1}),r}async renderVideo(t,e,r){if("initialized"!==this._state)throw new Error(`Cannot Render A Video: ${this._state}`);if(e>this._frames)throw new Error(`Start Frame Is Out Of Range: ${e} / ${this._frames}`);b.default.existsSync(t)||b.default.mkdirSync(t);for(let a=e;a<this._frames;a++){const e=await this._calculateHeatmap(0,a*this._frameInterval,(t=>{void 0!==r&&r({totalFrames:this._frames,finishedFrames:a,type:"calculatingHeatmap",total:t.total,finished:t.finished})}));void 0!==r&&r({totalFrames:this._frames,finishedFrames:a,type:"rendering",total:1,finished:0});const s=(await this.WorkerManager.createBatch("renderImage",[{format:"png",width:this._options.width,height:this._options.height,heatmap:e.data,cursors:e.cursors,style:this._options.style}]))[0];b.default.writeFileSync(_.default.join(t,`${a.toString().padStart(5,"0")}.png`),s)}}async _calculateHeatmap(t,e,r){if("initialized"!==this._state)throw new Error(`Cannot Calculate The Heatmap: ${this._state}`);const a=this._replaysCursorData.map((r=>({width:this._options.width||512,height:this._options.height||384,start:t,end:e,replayCursorData:r,style:this.options.style}))),s=await this.WorkerManager.createBatch("calculateHeatmaps",a,(t=>{void 0!==r&&r(t)}));return(await this.WorkerManager.createBatch("combineBeatmaps",[{width:this._options.width||512,height:this._options.height||384,heatmaps:s}]))[0]}},v=h(require("worker_threads")),P=(t,e,r,a,s)=>(t-e)/(r-e)*(s-a)+a,C=(t,e,r,a,s,o)=>{const i=new Map,n=Math.round((t+e)/750*o.traceSize);let h=0,d=0;s.timeStamps.forEach(((o,l)=>{l>0&&o>=r&&o<=a&&(h=s.xPositions[l],d=s.yPositions[l],function(t,e,r,a){const s=[],o=Math.abs(r-t),i=Math.abs(a-e),n=t<r?1:-1,h=e<a?1:-1;let d=o-i;for(;t!==r||e!==a;){s.push({x:t,y:e});let r=2*d;r>-i&&(d-=i,t+=n),r<o&&(d+=o,e+=h)}return s.push({x:r,y:a}),s}(Math.round(P(s.xPositions[l-1],0,512,0,t)),Math.round(P(s.yPositions[l-1],0,384,0,e)),Math.round(P(s.xPositions[l],0,512,0,t)),Math.round(P(s.yPositions[l],0,384,0,e))).forEach((t=>{if(n>1)for(let e=t.x-n;e<t.x+n;e++)for(let r=t.y-n;r<t.y+n;r++)D(i,e,r);else D(i,t.x,t.y)})))}));const l=new Uint32Array(3*i.size);let c=0;return i.forEach(((t,e)=>{const r=e.split(","),a=parseInt(r[0]),s=parseInt(r[1]);l[c]=a,l[c+1]=s,l[c+2]=t,c+=3})),{data:l,replayHash:s.replayHash,playerName:s.playerName,cursorX:h,cursorY:d}};function D(t,e,r){const a=`${e},${r}`;t.has(a)?t.set(a,t.get(a)+1):t.set(a,1)}var x=h(require("jimp")),H=async(t,e,r,a,s,o)=>new Promise((i=>{const n=new Uint8Array(e*r*4);a.forEach(((t,e)=>{e*=4;const r=u.getGradientColor(P(t*o.heatBoost,0,1,0,1),o.colors);n[e]=r.r,n[e+1]=r.g,n[e+2]=r.b,n[e+3]=255}));const h=new Map;o.cursor&&s.forEach((t=>{const a="player"===o.cursorColorDistribution?t.playerName:t.replayHash;h.has(a)||h.set(a,o.cursorColors[function(t){let e=0;for(let r=0;r<t.length;r++)e+=t.charCodeAt(r);return e}(a)%(o.cursorColors.length-1)]);const s=h.get(a);(function(t,e,r){const a=[];for(let s=-r;s<=r;s++)for(let o=-r;o<=r;o++)o*o+s*s<=r*r&&a.push({x:Math.round(t+o),y:Math.round(e+s)});return a})(t.x,t.y,(e+r)/250*o.cursorSize).forEach((t=>{if(t.x>0&&t.x<e&&t.y>0&&t.y<r){const r=4*(t.x+e*t.y);n[r]=s.r,n[r+1]=s.g,n[r+2]=s.b}}))})),new x.default(e,r,((e,r)=>{r.bitmap.data=Buffer.from(n),"png"===t?r.getBuffer(x.default.MIME_PNG,((t,e)=>i(e))):r.getBuffer(x.default.MIME_JPEG,((t,e)=>i(e)))}))}));function E(t){v.default.parentPort.postMessage(t)}var B=class{_Core;constructor(t){this._Core=new j(t)}async initialize(){await this._Core.initialize()}async loadReplays(t,e){return await this._Core.loadReplays(t,e)}async renderImage(t){return await this._Core.renderImage(t)}async renderVideo(t,e,r){await this._Core.renderVideo(t,e,r)}};c.default.isMainThread||"HeatTrace"!==c.default.workerData.type||(v.default.parentPort.on("message",(async t=>{if("assignJob"===t.type){const e=t.data;let r;if("loadReplays"===t.batchType){const t=await g(e);r="standard"!==t.gameMode?{error:!0,message:"Unsupport Game Mode"}:void 0===t.cursor?{error:!0,message:"Failed To Decompress Cursor Data"}:{error:!1,data:{beatmapHash:t.beatmapHash,replayHash:t.replayHash,playerName:t.playerName,xPositions:t.cursor.xPositions,yPositions:t.cursor.yPositions,timeStamps:t.cursor.timeStamps}}}else"calculateHeatmaps"===t.batchType?r=C(e.width,e.height,e.start,e.end,e.replayCursorData,e.style):"combineBeatmaps"===t.batchType?r=((t,e,r)=>{const a=[],s=new Uint32Array(t*e);r.forEach((e=>{a.push({replayHash:e.replayHash,playerName:e.playerName,x:e.cursorX,y:e.cursorY});for(let r=0;r<e.data.length;r+=3)s[e.data[r]+t*e.data[r+1]]+=e.data[r+2]}));let o=0;s.forEach((t=>{t>o&&(o=t)}));const i=new Float64Array(t*e);return s.forEach(((t,e)=>i[e]=P(t,0,o,0,1))),{data:i,cursors:a}})(e.width,e.height,e.heatmaps):"renderImage"===t.batchType&&(r=await H(e.format,e.width,e.height,e.heatmap,e.cursors,e.style));E({type:"jobFinished",batchID:t.batchID,jobID:t.jobID,data:r})}else if("request"===t.type){let e;t.data,E({type:"response",data:e,requestID:t.requestID})}})),E({type:"ready"}));