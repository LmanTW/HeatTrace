"use strict";var t,e=Object.create,a=Object.defineProperty,r=Object.getOwnPropertyDescriptor,s=Object.getOwnPropertyNames,o=Object.getPrototypeOf,i=Object.prototype.hasOwnProperty,n=(t,e,o,n)=>{if(e&&"object"==typeof e||"function"==typeof e)for(let h of s(e))i.call(t,h)||h===o||a(t,h,{get:()=>e[h],enumerable:!(n=r(e,h))||n.enumerable});return t},h=(t,r,s)=>(s=null!=t?e(o(t)):{},n(!r&&t&&t.__esModule?s:a(s,"default",{value:t,enumerable:!0}),t)),d={};((t,e)=>{for(var r in e)a(t,r,{get:e[r],enumerable:!0})})(d,{Color:()=>u,HeatTrace:()=>O,loadReplay:()=>g}),module.exports=(t=d,n(a({},"__esModule",{value:!0}),t));var c,l=h(require("worker_threads"));(c||(c={})).getGradientColor=function(t,e){const a=1/(e.length-1);let r=Math.floor(t/a);return r>=e.length&&(r=e.length-1),function(t,e,a){let r=Math.round(t.r+(e.r-t.r)*a),s=Math.round(t.g+(e.g-t.g)*a),o=Math.round(t.b+(e.b-t.b)*a);return r>255&&(r=255),s>255&&(s=255),o>255&&(o=255),{r:r,g:s,b:o}}(e[r],e[r+1]||e[r],t%a/a)};var u=c,p=require("lzma-native"),f=class{_data="";_index=0;constructor(t){t.forEach((t=>this._data+=t.toString(2).padStart(8,"0")))}readByte(){return parseInt(this._read(8),2)}readShort(){return y([this._read(8),this._read(8)],8)}readInteger(){return y([this._read(8),this._read(8),this._read(8),this._read(8)],8)}readLong(){return y([this._read(8),this._read(8),this._read(8),this._read(8),this._read(8),this._read(8),this._read(8),this._read(8)],8)}readULEB128(){const t=[];for(;;){const e=this._read(8);if(t.push(e.substring(1,8)),"0"===e[0])break}return y(t,7)}readString(){if(11===this.readByte()){const t=this.readULEB128();let e=[];for(let a=0;a<t;a++)e.push(parseInt(this._read(8),2));return Buffer.from(e).toString("utf8")}return""}_read(t){const e=this._data.substring(this._index,this._index+t);return this._index+=t,e}};function y(t,e){let a=0,r=0;for(let s=0;s<t.length;s++){a|=(parseInt(t[s],2)&(1<<e)-1)<<r,r+=e}return a}async function g(t){return new Promise((e=>{const a=new f(t),r=a.readByte(),s=a.readInteger(),o=a.readString(),i=a.readString(),n=a.readString(),h=a.readShort(),d=a.readShort(),c=a.readShort(),l=a.readShort(),u=a.readShort(),y=a.readShort(),g=a.readInteger(),m=a.readShort(),b=a.readByte();a.readInteger(),a.readString(),a.readLong();const _=a.readInteger(),w=new Uint8Array(_);for(let t=0;t<_;t++)w[t]=a.readByte();const k={version:s,gameMode:["standard","taiko","catch","mania"][r],beatmapHash:o,replayHash:n,playerName:i,great:h,ok:d,meh:c,gekis:l,katus:u,misses:y,score:g,greatestCombo:m,perfect:1===b};(0,p.decompress)(Buffer.from(w),void 0,(t=>{const a=t.toString().split(","),r=new Float64Array(a.length),s=new Float64Array(a.length),o=new Float64Array(a.length);let i=0;a.forEach(((t,e)=>{const n=t.split("|");if(+n[1]>0&&+n[2]>0)r[e]=+n[1],s[e]=+n[2];else{const t=function(t){for(let e=0;e<t.length;e+=3){const a=t[e].split("|");if(+a[0]>0&&+a[1]>0)return{x:+a[0],y:+a[1]}}return{x:0,y:0}}(a);r[e]=t.x,s[e]=t.y}i+=+n[0],o[e]=i})),k.cursor={xPositions:r,yPositions:s,timeStamps:o},e(k)}))}))}var m=h(require("ffmpeg-static")),b=h(require("fluent-ffmpeg")),_=h(require("path")),w=h(require("os")),k=h(require("fs")),I=h(require("worker_threads")),D=(t,e)=>{let a=S(t);for(;e.includes(a);)a=S(t);return a};function S(t){let e="";for(let s=0;s<t;s++)e+=v[(a=0,r=v.length-1,Math.floor(Math.random()*r)+a)];var a,r;return e}var v="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789",j=class{_workers={};_requests={};_batches={};async startWorkers(t){const e=[];for(let a=0;a<t;a++){const t=D(5,Object.keys(this._workers));this._workers[t]={state:"starting",worker:new I.default.Worker(__filename,{workerData:{type:"HeatTrace"}})},e.push(this._handleWorker(t))}await Promise.all(e)}stopWorkers(){Object.keys(this._workers).forEach((t=>this._workers[t].worker.terminate())),this._workers={}}createBatch(t,e,a){return new Promise((async r=>{const s=Object.keys(this._workers),o={type:t,totalJobs:e.length,jobs:{},bufferWorker:s[s.length-1],progressCallback:a,finishCallback:r};e.forEach((t=>o.jobs[D(5,Object.keys(o.jobs))]={state:"waiting",data:t}));const i=D(5,Object.keys(this._batches));await this.sendRequest(o.bufferWorker,{type:"createBatchBuffer",batchID:i,batchType:t,total:e.length}),this._batches[i]=o,this._assignJobs()}))}async sendRequest(t,e){return new Promise((a=>{const r=D(5,Object.keys(this._requests));this._requests[r]=a,this._sendMessage(t,{type:"request",data:e,requestID:r})}))}_sendMessage(t,e){if(void 0===this._workers[t])throw new Error(`Worker Not Found: "${t}"`);this._workers[t].worker.postMessage(e)}_assignJobs(){for(let t of Object.keys(this._workers)){const e=this._workers[t];if("readied"===e.state){const a=this._getJob();if(void 0===a)break;const r=this._batches[a.batchID];e.state="working",r.jobs[a.jobID].state="inProgress",this._sendMessage(t,{type:"assignJob",batchID:a.batchID,batchType:r.type,jobID:a.jobID,data:r.jobs[a.jobID].data})}}}_getJob(){for(let t of Object.keys(this._batches)){const e=this._batches[t];for(let a of Object.keys(e.jobs))if("waiting"===e.jobs[a].state)return{batchID:t,jobID:a};break}}async _handleWorker(t){if(void 0===this._workers[t])throw new Error(`Worker Not Found: "${t}"`);return new Promise((e=>{const a=this._workers[t];a.worker.on("message",(async t=>{if("ready"===t.type)a.state="readied",e();else if("jobFinished"===t.type){const e=this._batches[t.batchID];delete e.jobs[t.jobID],this._sendMessage(e.bufferWorker,{type:"addBuffer",batchID:t.batchID,data:t.data}),void 0!==e.progressCallback&&e.progressCallback({total:e.totalJobs,finished:e.totalJobs-Object.keys(e.jobs).length}),a.state="readied",this._assignJobs()}else if("batchResults"===t.type){this._batches[t.batchID].finishCallback(t.data),delete this._batches[t.batchID]}else"response"===t.type&&void 0!==this._requests[t.requestID]&&(this._requests[t.requestID](t.data),delete this._requests[t.requestID])}))}))}},M=class{_state="none";_options;_cursorsData=[];_frameInterval=0;_frames=0;WorkerManager=new j;constructor(t){void 0===t&&(t={});const e=t.style||{},a=e.cursor||{},r=e.background||{};this._options={width:t.width||512,height:t.height||384,style:{traceSize:e.traceSize||1,heatBoost:e.heatBoost||1.75,cursor:{type:a.type||"color",distribution:a.distribution||"player",size:a.size||1,colors:[{r:214,g:40,b:40},{r:247,g:127,b:0},{r:252,g:191,b:73},{r:234,g:226,b:183}],images:[]},background:{type:r.type||"none",color:{r:0,g:0,b:0},image:""},colors:e.colors||[{r:0,g:0,b:0},{r:106,g:4,b:15},{r:208,g:0,b:0},{r:232,g:93,b:4},{r:250,g:163,b:7},{r:255,g:255,b:255}]},imageFormat:t.imageFormat||"png",videoFPS:t.videoFPS||30,videoSpeed:t.videoSpeed||1,threads:w.default.cpus().length/2},this.WorkerManager=new j}get state(){return this._state}get options(){return this._options}async initialize(){if("none"!==this._state)throw new Error(`Cannot Initialize HeatTrace: ${this._state}`);this._state="initializing",await this.WorkerManager.startWorkers(this._options.threads),this._state="initialized"}async loadReplays(t,e){if("initialized"!==this._state)throw new Error(`Cannot Load Replays: ${this._state}`);const a=await this.WorkerManager.createBatch("loadReplays",t,(t=>{void 0!==e&&e({total:t.total,loaded:t.finished})})),r=[];let s,o=0,i=0;for(let t of a)if(t.error)i++;else{if(void 0===s)s=t.data.beatmapHash;else if(t.data.beatmapHash!==s)return{error:!0,message:"Found Replays With Different Beatmaps"};t.data.timeStamps[t.data.timeStamps.length-1]>o&&(o=t.data.timeStamps[t.data.timeStamps.length-1]),r.push({replayHash:t.data.replayHash,playerName:t.data.playerName,xPositions:t.data.xPositions,yPositions:t.data.yPositions,timeStamps:t.data.timeStamps})}return this._cursorsData=r,this._frameInterval=1e3/this._options.videoFPS/this.options.videoSpeed,this._frames=Math.round(o/this._frameInterval),{error:!1,data:{failed:i}}}async renderImage(t){if("initialized"!==this._state)throw new Error(`Cannot Calculate An Image: ${this._state}`);const e=await this._calculateHeatmap(0,1/0,(e=>{void 0!==t&&t({type:"calculatingHeatmap",total:e.total,finished:e.finished})}));void 0!==t&&t({type:"rendering",total:1,finished:0});const a=(await this.WorkerManager.createBatch("renderImage",[{format:this._options.imageFormat,width:this._options.width,height:this._options.height,heatmap:e.data,cursors:[],style:this._options.style}]))[0];return void 0!==t&&t({type:"rendering",total:1,finished:1}),a}async renderVideo(t,e,a){if("initialized"!==this._state)throw new Error(`Cannot Render A Video: ${this._state}`);if(e>this._frames)throw new Error(`Start Frame Is Out Of Range: ${e} / ${this._frames}`);return new Promise((async r=>{k.default.existsSync(t)||k.default.mkdirSync(t),k.default.existsSync(_.default.join(t,"Frames"))||k.default.mkdirSync(_.default.join(t,"Frames"));for(let r=e;r<this._frames;r++){void 0!==a&&a({type:"calculatingHeatmap",total:this._frames,finished:r});const e=await this._calculateHeatmap(0,r*this._frameInterval);void 0!==a&&a({type:"rendering",total:this._frames,finished:r+1});const s=(await this.WorkerManager.createBatch("renderImage",[{format:"png",width:this._options.width,height:this._options.height,heatmap:e.data,cursors:e.cursors,style:this._options.style}]))[0];k.default.writeFileSync(_.default.join(t,"Frames",`${r.toString().padStart(5,"0")}.png`),s)}void 0!==a&&a({type:"encoding",total:this._frames,finished:this._frames}),(0,b.default)(_.default.join(t,"Frames","%05d.png")).setFfmpegPath(m.default).output(_.default.join(t,"Result.mp4")).inputFPS(this._options.videoFPS).outputOptions("-pix_fmt yuv420p").outputOptions(`-threads ${this._options.threads}`).once("end",(()=>r(_.default.join(t,"Result.mp4")))).run()}))}async _calculateHeatmap(t,e,a){if("initialized"!==this._state)throw new Error(`Cannot Calculate The Heatmap: ${this._state}`);const r=this._cursorsData.map((a=>({width:this._options.width,height:this._options.height,start:t,end:e,cursorData:a,style:this.options.style})));return(await this.WorkerManager.createBatch("calculateHeatmaps",r,(t=>{void 0!==a&&a(t)})))[0]}},P=h(require("worker_threads")),H=h(require("jimp")),x=(t,e,a,r,s)=>(t-e)/(a-e)*(s-r)+r,B=async(t,e,a,r,s,o)=>new Promise((i=>{const n=new Uint8Array(e*a*4);r.forEach(((t,e)=>{e*=4;const a=u.getGradientColor(x(t*o.heatBoost,0,1,0,1),o.colors);n[e]=a.r,n[e+1]=a.g,n[e+2]=a.b,n[e+3]=255}));const h=new Map;o.cursor&&s.forEach((t=>{const r="player"===o.cursor.distribution?t.playerName:t.replayHash;h.has(r)||h.set(r,o.cursor.colors[function(t){let e=0;for(let a=0;a<t.length;a++)e+=t.charCodeAt(a);return e}(r)%(o.cursor.colors.length-1)]);const s=h.get(r);(function(t,e,a){const r=[];for(let s=-a;s<=a;s++)for(let o=-a;o<=a;o++)o*o+s*s<=a*a&&r.push({x:Math.round(t+o),y:Math.round(e+s)});return r})(t.x,t.y,(e+a)/250*o.cursor.size).forEach((t=>{if(t.x>0&&t.x<e&&t.y>0&&t.y<a){const a=4*(t.x+e*t.y);n[a]=s.r,n[a+1]=s.g,n[a+2]=s.b}}))})),new H.default(e,a,((e,a)=>{a.bitmap.data=Buffer.from(n),"png"===t?a.getBuffer(H.default.MIME_PNG,((t,e)=>i(e))):a.getBuffer(H.default.MIME_JPEG,((t,e)=>i(e)))}))}));var q=class{static calculateHeatmap(t,e,a,r,s,o){const i=new Map,n=Math.round((t+e)/750*o.traceSize);let h=0,d=0;s.timeStamps.forEach(((o,c)=>{c>0&&o>=a&&o<=r&&(h=s.xPositions[c],d=s.yPositions[c],function(t,e,a,r){const s=[],o=Math.abs(a-t),i=Math.abs(r-e),n=t<a?1:-1,h=e<r?1:-1;let d=o-i;for(;t!==a||e!==r;){s.push({x:t,y:e});let a=2*d;a>-i&&(d-=i,t+=n),a<o&&(d+=o,e+=h)}return s.push({x:a,y:r}),s}(Math.round(x(s.xPositions[c-1],0,512,0,t)),Math.round(x(s.yPositions[c-1],0,384,0,e)),Math.round(x(s.xPositions[c],0,512,0,t)),Math.round(x(s.yPositions[c],0,384,0,e))).forEach((t=>{if(n>1)for(let e=t.x-n;e<t.x+n;e++)for(let a=t.y-n;a<t.y+n;a++)E(i,e,a);else E(i,t.x,t.y)})))}));const c=new Uint32Array(3*i.size);let l=0;return i.forEach(((t,e)=>{const a=e.split(","),r=parseInt(a[0]),s=parseInt(a[1]);c[l]=r,c[l+1]=s,c[l+2]=t,l+=3})),{width:t,height:e,data:c,replayHash:s.replayHash,playerName:s.playerName,cursorX:h,cursorY:d}}static applyHeatmap(t,e,a,r){for(let s=0;s<r.length;s+=3)r[s]>=0&&r[s]<=t&&r[s+1]>=0&&r[s+1]<=e&&(a[r[s]+t*r[s+1]]+=r[s+2])}static normalizeHeatmap(t){let e=1;t.forEach((t=>{t>e&&(e=t)}));const a=new Float64Array(t.length);return t.forEach(((t,r)=>a[r]=x(t,0,e,0,1))),a}};function E(t,e,a){const r=`${e},${a}`;t.has(r)?t.set(r,t.get(r)+1):t.set(r,1)}function F(t){P.default.parentPort.postMessage(t)}var C={},O=class{_Core;constructor(t){this._Core=new M(t)}async initialize(){await this._Core.initialize()}async loadReplays(t,e){return await this._Core.loadReplays(t,e)}async renderImage(t){return await this._Core.renderImage(t)}async renderVideo(t,e,a){return await this._Core.renderVideo(t,e,a)}};l.default.isMainThread||"HeatTrace"!==l.default.workerData.type||(P.default.parentPort.on("message",(async t=>{if("assignJob"===t.type){const e=t.data;let a;if("loadReplays"===t.batchType){const t=await g(e);a="standard"!==t.gameMode?{error:!0,message:"Unsupport Game Mode"}:void 0===t.cursor?{error:!0,message:"Failed To Decompress Cursor Data"}:{error:!1,data:{beatmapHash:t.beatmapHash,replayHash:t.replayHash,playerName:t.playerName,xPositions:t.cursor.xPositions,yPositions:t.cursor.yPositions,timeStamps:t.cursor.timeStamps}}}else"calculateHeatmaps"===t.batchType?a=q.calculateHeatmap(e.width,e.height,e.start,e.end,e.cursorData,e.style):"renderImage"===t.batchType&&(a=await B(e.format,e.width,e.height,e.heatmap,e.cursors,e.style));F({type:"jobFinished",batchID:t.batchID,jobID:t.jobID,data:a})}else if("addBuffer"===t.type){if(void 0===C[t.batchID])throw new Error(`Batch Buffer Not Found: "${t.batchID}"`);const e=C[t.batchID];"calculateHeatmaps"===e.type?(void 0===e.data.data&&(e.data.data=new Uint32Array(t.data.width*t.data.height)),q.applyHeatmap(t.data.width,t.data.height,e.data.data,t.data.data),e.data.cursors.push({replayHash:t.data.replayHash,playerName:t.data.playerName,x:t.data.cursorX,y:t.data.cursorY})):e.data.push(t.data),e.finished++,e.finished>=e.total&&("calculateHeatmaps"===e.type?F({type:"batchResults",batchID:t.batchID,data:[{data:q.normalizeHeatmap(e.data.data),cursors:e.data.cursors}]}):F({type:"batchResults",batchID:t.batchID,data:e.data}),delete C[t.batchID])}else if("request"===t.type){const e=t.data;let a;"createBatchBuffer"===e.type&&("calculateHeatmaps"===e.batchType?C[e.batchID]={type:"calculateHeatmaps",total:e.total,finished:0,data:{cursors:[]}}:C[e.batchID]={type:e.batchType,total:e.total,finished:0,data:[]}),F({type:"response",data:a,requestID:t.requestID})}})),F({type:"ready"}));