"use strict";var e,t=Object.create,a=Object.defineProperty,r=Object.getOwnPropertyDescriptor,s=Object.getOwnPropertyNames,o=Object.getPrototypeOf,i=Object.prototype.hasOwnProperty,n=(e,t,o,n)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let h of s(t))i.call(e,h)||h===o||a(e,h,{get:()=>t[h],enumerable:!(n=r(t,h))||n.enumerable});return e},h=(e,r,s)=>(s=null!=e?t(o(e)):{},n(!r&&e&&e.__esModule?s:a(s,"default",{value:e,enumerable:!0}),e)),l={};((e,t)=>{for(var r in t)a(e,r,{get:t[r],enumerable:!0})})(l,{HeatTrace:()=>W,loadReplay:()=>g}),module.exports=(e=l,n(a({},"__esModule",{value:!0}),e));var c=h(require("worker_threads")),d=require("lzma-native"),u=class{_data="";_index=0;constructor(e){e.forEach((e=>this._data+=e.toString(2).padStart(8,"0")))}readByte(){return parseInt(this._read(8),2)}readShort(){return m([this._read(8),this._read(8)],8)}readInteger(){return m([this._read(8),this._read(8),this._read(8),this._read(8)],8)}readLong(){return m([this._read(8),this._read(8),this._read(8),this._read(8),this._read(8),this._read(8),this._read(8),this._read(8)],8)}readULEB128(){const e=[];for(;;){const t=this._read(8);if(e.push(t.substring(1,8)),"0"===t[0])break}return m(e,7)}readString(){if(11===this.readByte()){const e=this.readULEB128();let t=[];for(let a=0;a<e;a++)t.push(parseInt(this._read(8),2));return Buffer.from(t).toString("utf8")}return""}_read(e){const t=this._data.substring(this._index,this._index+e);return this._index+=e,t}};function m(e,t){let a=0,r=0;for(let s=0;s<e.length;s++){a|=(parseInt(e[s],2)&(1<<t)-1)<<r,r+=t}return a}async function g(e){return new Promise((t=>{const a=new u(e),r=a.readByte(),s=a.readInteger(),o=a.readString(),i=a.readString(),n=a.readString(),h=a.readShort(),l=a.readShort(),c=a.readShort(),m=a.readShort(),g=a.readShort(),p=a.readShort(),y=a.readInteger(),f=a.readShort(),b=a.readByte();a.readInteger(),a.readString(),a.readLong();const w=a.readInteger(),_=new Uint8Array(w);for(let e=0;e<w;e++)_[e]=a.readByte();const x={version:s,gameMode:["standard","taiko","catch","mania"][r],beatmapHash:o,replayHash:n,playerName:i,great:h,ok:l,meh:c,gekis:m,katus:g,misses:p,score:y,greatestCombo:f,perfect:1===b};(0,d.decompress)(Buffer.from(_),void 0,(e=>{if(null===e)t(x);else{const a=e.toString().split(","),r=new Float64Array(a.length),s=new Float64Array(a.length),o=new Float64Array(a.length);let i=0;a.forEach(((e,t)=>{const a=e.split("|");i+=+a[0],r[t]=+a[1],s[t]=+a[2],o[t]=i})),x.cursor={xPositions:r,yPositions:s,timeStamps:o},t(x)}}))}))}var p=h(require("worker_threads"));function y(e,t,a,r){const s=new Float64Array(a.xPositions.length),o=new Float64Array(a.yPositions.length),i=new Float64Array(a.timeStamps.length);let n=0,h=a.xPositions[0],l=a.yPositions[0];return a.timeStamps.forEach(((e,t)=>{if(void 0===h||void 0===l)h=a.xPositions[t],l=a.yPositions[t];else{if(Math.hypot(h-a.xPositions[t],l-a.yPositions[t])>r)return;h=a.xPositions[t],l=a.yPositions[t]}s[n]=h,o[n]=l,i[n]=e,n++})),{playerName:e,replayHash:t,xPositions:s.slice(0,n),yPositions:o.slice(0,n),timeStamps:i.slice(0,n)}}var f=h(require("jimp")),b=h(require("fs")),w=(e,t,a)=>e<t?t:e>a?a:e,_=async(e,t,a,r,s)=>new Promise((o=>{b.default.existsSync(e)?new f.default(e,((i,n)=>{if(null===i){const e=function(e,t,a,r,s){const o="min"===e?Math.min(r/t,s/a):Math.max(r/t,s/a);return{width:Math.round(t*o),height:Math.round(a*o)}}(t,n.getWidth(),n.getHeight(),a,r);n.resize(e.width,e.height);const i=new SharedArrayBuffer(n.bitmap.data.length),h=new Uint8Array(i);for(let e=0;e<n.bitmap.data.length;e+=4)h[e]=n.bitmap.data[e],h[e+1]=n.bitmap.data[e+1],h[e+2]=n.bitmap.data[e+2],h[e+3]=255,void 0!==s.brightness&&(h[e]=w(h[e]-h[e]*(1-s.brightness),0,255),h[e+1]=w(h[e+1]-h[e+1]*(1-s.brightness),0,255),h[e+2]=w(h[e+2]-h[e+2]*(1-s.brightness),0,255));o({error:!1,texture:{width:e.width,height:e.height,data:i}})}else o({error:!0,message:`Failed To Load Texture: "${e}"`})})):o({error:!0,message:`Texture File Not Found: "${e}"`})}));var x,k=h(require("jimp")),v=(e,t,a,r,s)=>(e-t)/(a-t)*(s-r)+r;(x||(x={})).getGradientColor=function(e,t){const a=1/(t.length-1);let r=Math.floor(e/a);r>=t.length&&(r=t.length-1);const s=t[r],o=t[r+1]||t[r],i=e%a/a;let n=Math.round(s.r+(o.r-s.r)*i),h=Math.round(s.g+(o.g-s.g)*i),l=Math.round(s.b+(o.b-s.b)*i);return{r:Math.min(n,255),g:Math.min(h,255),b:Math.min(l,255)}};var M=x,S=class{static renderBackground(e,t,a,r){const s=new SharedArrayBuffer(Math.round(e*t*4)),o=new Uint8Array(s);if("color"===r.background.type)for(let e=0;e<o.length;e+=4)o[e]=w(r.background.color.r+255*r.background.brightness,0,255),o[e+1]=w(r.background.color.g+255*r.background.brightness,0,255),o[e+2]=w(r.background.color.b+255*r.background.brightness,0,255),o[e+3]=255;else if("image"===r.background.type){const s=a[r.background.image],i=e/2-s.width/2,n=t/2-s.height/2;this._putTexture(o,e,t,s,Math.round(i),Math.round(n),255)}return{layer:0,pixels:s}}static renderHeatmap(e,t){const a=new Float64Array(e),r=new SharedArrayBuffer(4*a.length),s=new Uint8Array(r);return a.forEach(((e,a)=>{if(e>0){e=v(e*t.heatBoost,0,1,0,1),a*=4;const r=M.getGradientColor(e,t.colors);s[a]=w(r.r,0,255),s[a+1]=w(r.g,0,255),s[a+2]=w(r.b,0,255),s[a+3]=w(Math.round(v(e,0,1,255*t.traceOpacity[0],255*t.traceOpacity[1])),0,255)}})),{layer:1,pixels:r}}static async renderImage(e,t,a,r){return new Promise((s=>{const o=new Uint8Array(Math.round(t*a*4));for(let e=0;e<o.length;e+=4)o[e+3]=255;r.sort(((e,t)=>e.layer-t.layer)).forEach((e=>{const t=new Uint8Array(e.pixels);for(let e=0;e<t.length;e+=4)if(t[e+3]>0){const a=Math.max(o[e+3],t[e+3]),r=v(t[e+3],0,a,0,1);o[e]=w(o[e]+(t[e]-o[e])*r,0,255),o[e+1]=w(o[e+1]+(t[e+1]-o[e+1])*r,0,255),o[e+2]=w(o[e+2]+(t[e+2]-o[e+2])*r,0,255),o[e+3]=w(255*r,0,255)}}));for(let e=0;e<o.length;e+=4)o[e+3]=255;if("raw"===e){const e=new SharedArrayBuffer(t*a*4);new Uint8Array(e).set(o,0),s(e)}else new k.default(t,a,((t,a)=>{a.bitmap.data=Buffer.from(o),"png"===e?a.getBuffer(k.default.MIME_PNG,((e,t)=>{const a=new SharedArrayBuffer(t.length);new Uint8Array(a).set(t,0),s(a)})):a.getBuffer(k.default.MIME_JPEG,((e,t)=>{const a=new SharedArrayBuffer(t.length);new Uint8Array(a).set(t,0),s(a)}))}))}))}static _putTexture(e,t,a,r,s,o,i){const n=new Uint8Array(r.data);let h=0;for(let l=o;l<o+r.height;l++)for(let o=s;o<s+r.width;o++){if(o>=0&&o<t&&l>=0&&l<a){const a=4*(o+l*t);e[a]=w(n[h],0,255),e[a+1]=w(n[h+1],0,255),e[a+2]=w(n[h+2],0,255),e[a+3]=w(i,0,255)}h+=4}}},P=class{static calculateHeatmap(e,t,a,r,s,o,i){const n=new Uint32Array(s),h=Math.round(e*t/1e6*i.traceSize);let l=o.xPositions[0],c=o.yPositions[0];const d=new Map;for(let s=0;s<o.timeStamps.length-1;s++)if(o.timeStamps[s]>=a&&o.timeStamps[s]<=r)l=o.xPositions[s],c=o.yPositions[s],d.clear(),I(Math.round(v(l,0,512,0,e)),Math.round(v(c,0,384,0,t)),Math.round(v(o.xPositions[s+1],0,512,0,e)),Math.round(v(o.yPositions[s+1],0,384,0,t))).forEach((a=>{if(h>1)for(let r=a.x-h;r<a.x+h;r++)for(let s=a.y-h;s<a.y+h;s++)r>=0&&r<e&&s>=0&&s<t&&(d.has(`${r},${s}`)||(Atomics.add(n,r+s*e,1),d.set(`${r},${s}`,!0)));else a.x>=0&&a.x<e&&a.y>=0&&a.y<t&&Atomics.add(n,a.x+a.y*e,1)}));else if(o.timeStamps[s]>r)break;return{playerName:o.playerName,replayHash:o.replayHash,x:l,y:c}}static normalizeHeatmap(e){const t=new Uint32Array(e);let a=1;t.forEach((e=>{e>a&&(a=e)}));const r=new SharedArrayBuffer(8*t.length),s=new Float64Array(r);return t.forEach(((e,t)=>s[t]=v(e,0,a,0,1))),r}};function I(e,t,a,r){const s=[],o=Math.abs(a-e),i=Math.abs(r-t),n=e<a?1:-1,h=t<r?1:-1;let l=o-i;for(;e!==a||t!==r;){s.push({x:e,y:t});let a=2*l;a>-i&&(l-=i,e+=n),a<o&&(l+=o,t+=h)}return s.push({x:a,y:r}),s}function C(e){p.default.parentPort.postMessage(e)}var D=(e,t)=>void 0===e?t:e,T=e=>{const t=[];if(e.forEach((e=>{const a=function(e){if(void 0!==e.min&&e.value<e.min)return{error:!0,message:`Value "${e.name}" Is Less Than ${e.min} (Requirement: >= ${e.min}${void 0===e.max?"":` And <= ${e.max}`})`};if(void 0!==e.max&&e.value>e.max)return{error:!0,message:`Value "${e.name}" Is More Than ${e.max} (Requirement: ${void 0===e.min?"":`>= ${e.min} And `}<= ${e.max})`};return{error:!1}}(e);a.error&&t.push(a.message)})),t.length>0)throw new Error(`Values Check Failed (${t.length}):\n${t.map((e=>`| ${e}`)).join("\n")}\n`)};var j=h(require("os"));var A=class{_Core;_textures={};constructor(e){this._Core=e}get textures(){return this._textures}async loadTextures(){const e=[],t=this._Core.options.style;if("image"===this._Core.options.style.cursor.type){const a=(this._Core.options.width+this._Core.options.height)/350*t.cursor.size;for(let r of t.cursor.images)e.push({type:"loadTexture",filePath:r,scaleType:"min",width:a,height:a,effect:{}})}"image"===this._Core.options.style.background.type&&e.push({type:"loadTexture",filePath:t.background.image,scaleType:"max",width:this._Core.options.width,height:this._Core.options.height,effect:{brightness:t.background.brightness}});const a={},r=await this._Core.WorkerManager.createBatch(e);for(let e of r){if(e.error)return{error:!0,message:e.message};a[e.data.filePath]=e.data.texture}return this._textures=a,{error:!1}}unloadTextures(){Object.keys(this.textures).forEach((e=>delete this.textures[e]))}},B=h(require("worker_threads")),z=(e,t)=>{let a=H(e);for(;t.includes(a);)a=H(e);return a};function H(e){let t="";for(let s=0;s<e;s++)t+=$[(a=0,r=$.length-1,Math.floor(Math.random()*r)+a)];var a,r;return t}var $="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789",E=class{_workers={};_requests={};_batches={};async startWorkers(e,t){for(let a=0;a<e;a++){const e=z(5,Object.keys(this._workers));this._workers[e]={state:"starting",worker:new B.default.Worker(__filename,{workerData:{type:"HeatTrace",textures:t}})},await this._handleWorker(e)}}async stopWorkers(){for(let e of Object.keys(this._workers))await this._workers[e].worker.terminate(),delete this._workers[e]}async createBatch(e,t){return new Promise((a=>{if(0===e.length)a([]);else{const r={totalJobs:e.length,jobs:{},results:[],progressCallback:t,finishCallback:a};e.forEach((e=>{r.jobs[z(5,Object.keys(r.jobs))]={state:"waiting",data:e}})),this._batches[z(5,Object.keys(this._batches))]=r,this._assignJobs()}}))}_assignJobs(){for(let e of Object.keys(this._workers)){const t=this._workers[e];if("readied"===t.state){const a=this._getJob();if(void 0===a)break;const r=this._batches[a.batchID];t.state="working",r.jobs[a.jobID].state="inProgress",this._sendMessage(e,{type:"assignJob",batchID:a.batchID,jobID:a.jobID,jobData:r.jobs[a.jobID].data})}}}_getJob(){for(let e of Object.keys(this._batches)){const t=this._batches[e];for(let a of Object.keys(t.jobs))if("waiting"===t.jobs[a].state)return{batchID:e,jobID:a};break}}_sendMessage(e,t){this._workers[e].worker.postMessage(t)}async _handleWorker(e){return new Promise((t=>{const a=this._workers[e];a.worker.on("message",(e=>{if("readied"===e.type)a.state="readied",t();else if("jobFinished"===e.type){const t=this._batches[e.batchID];t.results.push(e.jobResult),void 0!==t.progressCallback&&t.progressCallback({total:t.totalJobs,finished:t.results.length}),t.results.length>=t.totalJobs&&(t.finishCallback(t.results),delete this._batches[e.batchID]),a.state="readied",this._assignJobs()}}))}))}},F=async(e,t,a)=>{if("initialized"!==e.state)throw new Error(`Cannot Render A Frame: ${e.state}`);const r=await async function(e,t,a){if("initialized"!==e.state)throw new Error(`Cannot Calculate The Heatmap: ${e.state}`);const r=new SharedArrayBuffer(e.options.width*e.options.height*4),s=t*e.frameInterval,o=e.cursorsData.map((t=>({type:"calculateHeatmap",width:e.options.width,height:e.options.height,start:s-1e3*e.options.style.traceLength,end:s,heatmap:r,cursorData:t,style:e.options.style}))),i=await e.WorkerManager.createBatch(o,a),n=(await e.WorkerManager.createBatch([{type:"normalizeHeatmap",heatmap:r}]))[0].normalizedHeatmap;return{heatmap:n,cursorsInfo:i.map((e=>e.cursorInfo))}}(e,t,(e=>{void 0!==a&&a({type:"calculatingHeatmaps",total:e.total,finished:e.finished})})),s=[{type:"renderLayer",layerData:{type:"heatmap",heatmap:r.heatmap},style:e.options.style}];"none"!==e.options.style.background.type&&s.push({type:"renderLayer",layerData:{type:"background",width:e.options.width,height:e.options.height,textures:e.TextureManager.textures},style:e.options.style});return(await e.WorkerManager.createBatch(s,(e=>{void 0!==a&&a({type:"renderingLayers",total:e.total,finished:e.finished})}))).map((e=>e.layer))};var O=class{_state="none";_options;WorkerManager;TextureManager;_cursorsData=[];_frameInterval=0;_frames=0;constructor(e){this._options=function(e){const t=D(e.style,{}),a=D(t.cursor,{}),r=D(t.background,{});return{width:Math.round(D(e.width,512)),height:Math.round(D(e.height,384)),style:{heatBoost:D(t.heatBoost,3),traceSize:D(t.traceSize,1),traceOpacity:D(t.traceOpacity,[1,1]),traceLength:D(t.traceLength,1/0),colors:D(t.colors,[{r:0,g:0,b:0},{r:106,g:4,b:15},{r:208,g:0,b:0},{r:232,g:93,b:4},{r:250,g:163,b:7},{r:255,g:255,b:255}]),cursor:{type:D(a.type,"none"),distribution:D(a.distribution,"player"),size:D(a.size,1),opacity:D(a.opacity,1),colors:D(a.colors,[{r:214,g:40,b:40},{r:247,g:127,b:0},{r:252,g:191,b:73},{r:234,g:226,b:183}]),images:D(a.images,[])},background:{type:D(r.type,"none"),brightness:D(r.brightness,1),color:D(r.color,{r:0,g:0,b:0}),image:D(r.image,"")}},imageFormat:D(e.imageFormat,"png"),imageQuality:D(e.imageQuality,1),videoFPS:D(e.videoFPS,30),videoSpeed:D(e.videoSpeed,1),threads:D(e.threads,j.default.cpus().length/2),maxCursorTravelDistance:D(e.maxCursorTravelDistance,200)}}(e),function(e){T([{name:"options.width",value:e.width,min:1},{name:"options.height",value:e.height,min:1},{name:"options.style.traceSize",value:e.style.traceSize,min:0},{name:"options.style.traceOpacity[0]",value:e.style.traceOpacity[0],min:0,max:1},{name:"options.style.traceOpacity[1]",value:e.style.traceOpacity[1],min:0,max:1},{name:"options.style.traceLength",value:e.style.traceLength,min:0},{name:"options.style.cursor.size",value:e.style.cursor.size,min:0},{name:"options.style.cursor.opacity",value:e.style.cursor.opacity,min:0,max:1},{name:"options.style.background.brightness",value:e.style.background.brightness,min:0},{name:"options.imageQuality",value:e.imageQuality,min:.1,max:1},{name:"options.videoFPS",value:e.videoFPS,min:1},{name:"options.videoSpeed",value:e.videoFPS,min:.1},{name:"options.threads",value:e.threads,min:1},{name:"options.maxCursorTravelDistance",value:e.maxCursorTravelDistance,min:0}]),e.style.colors.forEach(((e,t)=>{T([{name:`options.style.colors[${t}].r`,value:e.r,min:0,max:255},{name:`options.style.colors[${t}].g`,value:e.g,min:0,max:255},{name:`options.style.colors[${t}].b`,value:e.b,min:0,max:255}])})),e.style.cursor.colors.forEach(((e,t)=>{T([{name:`options.style.cursor.colors[${t}].r`,value:e.r,min:0,max:255},{name:`options.style.cursor.colors[${t}].g`,value:e.g,min:0,max:255},{name:`options.style.cursor.colors[${t}].b`,value:e.b,min:0,max:255}])})),T([{name:"options.style.background.color.r",value:e.style.background.color.r,min:0,max:255},{name:"options.style.background.color.g",value:e.style.background.color.g,min:0,max:255},{name:"options.style.background.color.b",value:e.style.background.color.b,min:0,max:255}])}(this._options),this.WorkerManager=new E,this.TextureManager=new A(this)}get state(){return this._state}get options(){return this._options}get cursorsData(){return this._cursorsData}get frameInterval(){return this._frameInterval}get frames(){return this._frames}async initialize(e){if("none"!==this._state)throw new Error(`Cannot Initialize HeatTrace: ${this._state}`);return this._state="initializing",void 0!==e&&e({type:"startingWorkers"}),await this.WorkerManager.startWorkers(this._options.threads,this.TextureManager.textures),void 0!==e&&e({type:"loadingTextures"}),await this.TextureManager.loadTextures(),this._state="initialized",{error:!1}}async terminate(){if("initialized"!==this._state)throw new Error(`Cannot Load Terminate HeatTrace: ${this._state}`);this._state="terminating",await this.WorkerManager.stopWorkers(),this.TextureManager.unloadTextures(),this._state="none"}async loadReplays(e,t){if("initialized"!==this._state)throw new Error(`Cannot Load Replays: ${this._state}`);const a=e.map((e=>({type:"loadReplay",data:e,maxCursorTravelDistance:this._options.maxCursorTravelDistance}))),r=await this.WorkerManager.createBatch(a,t);let s,o=0,i=0;const n=[];for(let e of r)if(e.error)i++;else{if(void 0===s)s=e.data.beatmapHash;else if(e.data.beatmapHash!==s)return{error:!0,message:"Found Replays With Different Beatmaps"};const t=e.data.cursorData.timeStamps[e.data.cursorData.timeStamps.length-1];t>o&&(o=t),n.push(e.data.cursorData)}return this._cursorsData=n,this._frameInterval=1e3/this._options.videoFPS/this._options.videoSpeed,this._frames=Math.round(o/this._frameInterval),{error:!1,data:{loaded:e.length,failed:i}}}async renderImage(e,t){if("initialized"!==this._state)throw new Error(`Cannot Render An Image: ${this._state}`);return T([{name:"frame",value:e,min:1,max:this._frames}]),new Uint8Array((await this.WorkerManager.createBatch([{type:"renderImage",format:this._options.imageFormat,width:this._options.width,height:this._options.height,layers:await F(this,D(e,this._frames),t)}]))[0].data)}async renderVideo(e,t,a,r){if("initialized"!==this._state)throw new Error(`Cannot Render An Image: ${this._state}`);t=D(t,1),a=D(a,this._frames),T([{name:"start",value:t,min:1,max:Math.min(a,this._frames)},{name:"end",value:a,min:Math.max(D(t,1),1),max:this._frames}]);for(let e=D(t,1);e<D(a,this._frames);e++);}},W=class{_Core;constructor(e){this._Core=new O(e||{})}async initialize(e){return await this._Core.initialize(e)}async terminate(){await this._Core.terminate()}async loadReplays(e,t){return await this._Core.loadReplays(e,t)}async renderImage(e,t){return await this._Core.renderImage(e,t)}};c.default.isMainThread||(p.default.parentPort.on("message",(async e=>{if("assignJob"===e.type){const t=e.jobData;let a;if("loadTexture"===t.type){const e=await _(t.filePath,t.scaleType,t.width,t.height,t.effect);a={type:"loadTexture",error:e.error,message:e.message,data:{filePath:t.filePath,texture:e.texture}}}else if("loadReplay"===t.type){const e=await g(t.data);a="standard"!==e.gameMode?{type:"loadReplay",error:!0,message:"Unsupport Game Mode"}:void 0===e.cursor?{type:"loadReplay",error:!0,message:"Failed To Decompress Cursor Data"}:{type:"loadReplay",error:!1,data:{beatmapHash:e.beatmapHash,cursorData:y(e.playerName,e.replayHash,e.cursor,t.maxCursorTravelDistance)}}}else if("calculateHeatmap"===t.type)a={type:"calculateHeatmap",cursorInfo:P.calculateHeatmap(t.width,t.height,t.start,t.end,t.heatmap,t.cursorData,t.style)};else if("normalizeHeatmap"===t.type)a={type:"normalizeHeatmap",normalizedHeatmap:P.normalizeHeatmap(t.heatmap)};else if("renderLayer"===t.type){const e=t.layerData;"background"===e.type?a={type:"renderLayer",layer:S.renderBackground(e.width,e.height,e.textures,t.style)}:"heatmap"===e.type&&(a={type:"renderLayer",layer:S.renderHeatmap(e.heatmap,t.style)})}else"renderImage"===t.type&&(a={type:"renderImage",data:await S.renderImage(t.format,t.width,t.height,t.layers)});C({type:"jobFinished",batchID:e.batchID,jobResult:a})}})),C({type:"readied"}));