"use strict";var t=Object.create,e=Object.defineProperty,s=Object.getOwnPropertyDescriptor,i=Object.getOwnPropertyNames,r=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,n=(n,o,l)=>(l=null!=n?t(r(n)):{},((t,r,n,o)=>{if(r&&"object"==typeof r||"function"==typeof r)for(let l of i(r))a.call(t,l)||l===n||e(t,l,{get:()=>r[l],enumerable:!(o=s(r,l))||o.enumerable});return t})(!o&&n&&n.__esModule?l:e(l,"default",{value:n,enumerable:!0}),n)),o=n(require("worker_threads")),l=n(require("path")),h=n(require("os")),c=n(require("fs")),d=(t,e)=>Math.floor(Math.random()*e)+t,_=(t,e,s)=>{let i=g(t,s||"both");for(;e.includes(i);)i=g(t,s||"both");return i};function g(t,e){let s="";for(let i=0;i<t;i++)s+="number"===e?u[d(0,u.length-1)]:"alphabet"===e?p[d(0,p.length-1)]:f[d(0,f.length-1)];return s}var u="1234567890",p="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",f="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",m=class{_interval=void 0;_timers={};createTimeout(t,e){const s=_(5,Object.keys(this._timers));return this._timers[s]={times:1,interval:t,callback2:e,count:0,lastUpdateTime:performance.now()},void 0===this._interval&&this._start(),s}createInterval(t,e){const s=_(5,Object.keys(this._timers));return this._timers[s]={times:1/0,interval:t,callback:e,count:0,lastUpdateTime:performance.now()},void 0===this._interval&&this._start(),s}createLoop(t,e,s,i){const r=_(5,Object.keys(this._timers));return this._timers[r]={times:t,interval:e,callback:s,callback2:i,count:0,lastUpdateTime:performance.now()},void 0===this._interval&&this._start(),r}deleteTimer(t){if(void 0===this._timers[t])throw new Error(`Timer Not Found: "${t}"`);delete this._timers[t],0===Object.keys(this._timers).length&&(clearInterval(this._interval),this._interval=void 0)}deleteAllTimers(){Object.keys(this._timers).forEach((t=>this.deleteTimer(t)))}_start(){this._interval=setInterval((()=>{const t=performance.now();Object.keys(this._timers).forEach((e=>{const s=this._timers[e];void 0!==s&&t-s.lastUpdateTime>=s.interval&&(void 0!==s.callback&&s.callback(s.count),s.lastUpdateTime=t,s.times!==1/0&&(s.count++,s.count===s.times&&(void 0!==s.callback2&&s.callback2(),delete this._timers[e])))}))}),1)}},w=class{_currentPage=void 0;_pages={};PageInstance;constructor(t){this.PageInstance=new y(t)}get currentPage(){return this._currentPage}addPage(t){if(void 0!==this._pages[t.id])throw new Error(`Page Alreadt Added: "${t.id}"`);return this._pages[t.id]={initialize:t.initialize,components:[]},void 0===this._currentPage&&(this._currentPage=t.id,this.switchPage(t.id)),void 0!==t.subPages&&t.subPages.forEach((t=>this.addPage(t))),this}async switchPage(t,e){if(void 0===this._pages[t])throw new Error(`Page Not Found: "${t}"`);this.PageInstance.TimerManager.deleteAllTimers(),this._pages[t].components=await this._pages[t].initialize(this.PageInstance,e),this._currentPage=t}render(t,e){const s=[];for(let i=0;i<e;i++)s.push(" ".repeat(t));return void 0===this._currentPage||this._pages[this._currentPage].components.forEach((i=>i.render(t,e,s))),s}keydown(t){void 0!==this._currentPage&&this._pages[this._currentPage].components.forEach((e=>e.keydown(t)))}},y=class{Core;TimerManager=new m;constructor(t){this.Core=t}},b=n(require("os")),P={resolution:"1024x768",fps:30,threads:Math.round(b.default.cpus().length/2)},v=n(require("readline")),k=n(require("stream")),$=n(require("wcwidth")),x=class{_options;_layout=[S.pageTabs(),S.blank(),S.pageContent(),S.blank(),S.input()];_style={background:C.reset,background_notSelected:C.gray,text_notSelected:j.white,background_selected:C.white,text_selected:j.gray};interval;interface;_size={width:void 0,height:void 0};_pages={};_data={input:"",currentPage:void 0};_listeners={};_oldRenderContent=[];constructor(t){if(void 0===t&&(t={}),this._options=t,(void 0===t.render||t.render)&&(process.stdout.write(`[?25l${"\n".repeat(process.stdout.rows)}`),this.interval=setInterval((()=>process.stdout.write(this.render().map((t=>`[H${t.line>0?`[${t.line}B`:""}[2K${t.content}`)).join(""))),t.renderInterval||25)),void 0===t.allowInput||t.allowInput){const t=new k.default.Writable({write:()=>{}});this.interface=v.default.createInterface({input:process.stdin,output:t,terminal:!0,historySize:0}),process.stdin.on("data",(t=>this._handleInput(t)))}}get options(){return this._options}get size(){return this._getSize()}get pages(){return Object.keys(this._pages)}get input(){return this._data.input}get currentPage(){return this._data.currentPage}get cursorY(){const t=this._pages[this._data.currentPage];void 0!==t&&t.cursorY}stop(){if(void 0===this.interval)throw new Error("Cannot Stop The CLI");clearInterval(this.interval),void 0!==this.interface&&(this.interface.close(),process.stdin.off("data",this._handleInput),this.interface=void 0),this.interval=void 0,process.stdout.write("[?25h")}setSize(t,e){return this._size={width:t,height:e},this}setLayout(t){return this._layout=t,this}setStyle(t){return this._style=t,this}createPage(t,e,s){if(void 0!==this._pages[t])throw new Error(`Page Already Exist: "${t}"`);return this._pages[t]={name:e,callback:s,content:[],cursorY:0,scrollY:0},void 0===this._data.currentPage&&(this._data.currentPage=t,this._oldRenderContent=[]),this}deletePage(t){if(void 0===this._pages[t])throw new Error(`Page Not Found: "${t}"`);if(void 0!==this._data.currentPage){const e=Object.keys(this._pages).indexOf(this._data.currentPage);delete this._pages[t];const s=Object.keys(this._pages);0===s.length?this._data.currentPage=void 0:e>=s.length&&(this._data.currentPage=s[s.length-1]),this._oldRenderContent=[]}else delete this._pages[t]}setInput(t){this._data.input=t}simulateInput(t){this._handleInput(t)}switchPage(t){if(void 0===this._pages[t])throw new Error(`Page Not Found: "${t}"`);this._data.currentPage=t}listen(t,e){const s=function(t,e){let s=A(t);for(;e.includes(s);)s=A(t);return s}(5,Object.keys(this._listeners));return this._listeners[s]={type:t,callback:e},s}removeListener(t){if(void 0===this._listeners[t])throw new Error(`Listener Not Found: "${t}"`);delete this._listeners[t]}removeAllListeners(){this._listeners={}}render(){let t=[];this._layout.forEach((e=>t=t.concat(this._renderComponent(e))));const e=this._getSize();for(;t.length<e.height-1;)t.push("");const s=[];return this._oldRenderContent=t.slice(0,e.height-1).map(((t,i)=>{let r=this._sperateColor(t.replaceAll("\n","\\n")),a=r.map((t=>t.text)).join("");if((0,$.default)(a)<e.width)r.push({sequence:this._style.background,text:" ".repeat(e.width-(0,$.default)(a))});else for(;(0,$.default)(a)>e.width;)r=r.slice(0,r.length-1),a=a.substring(0,a.length-1);const n=`${this._style.background}${r.map((t=>`${void 0===t.sequence?"":t.sequence}${t.text}`)).join("")}`;return n!==this._oldRenderContent[i]&&s.push({line:i,content:n}),n})),s}_renderComponent(t){if("blank"===t.type)return[this._style.background];if("text"===t.type)return[t.callback()];if("pageTabs"===t.type){const t=[];return Object.keys(this._pages).forEach((e=>{e===this._data.currentPage?t.push(`${this._style.background_selected} ${this._style.text_selected}${this._pages[e].name} ${this._style.background}`):t.push(`${this._style.background_notSelected} ${this._style.text_notSelected}${this._pages[e].name} ${this._style.background}`)})),[` ${t.join(" ")} `]}if("pageContent"===t.type){const t=this._getSize(),e=[];if(void 0!==this._data.currentPage){const s=this._pages[this._data.currentPage];s.content=s.callback();const i=void 0===this._options.pagePrefix_notSelected?" <lineNumber> | ":this._options.pagePrefix_notSelected,r=void 0===this._options.pagePrefix_selected?`${this._style.background_selected} ${this._style.text_selected}<lineNumber>${j.reset}${this._style.background} | `:this._options.pagePrefix_selected;for(let a=s.scrollY;a<s.scrollY+(t.height-this._layout.length)&&a<s.content.length;a++){const t=(a+1).toString().padStart(2," ");s.cursorY===a?e.push(`${r.replaceAll("<lineNumber>",t)}${s.content[a]}`):e.push(`${i.replaceAll("<lineNumber>",t)}${s.content[a]}`)}}for(;e.length<t.height-this._layout.length;)e.push("");return e}if("input"===t.type){const e=this._getSize();let s=` ${this._data.input.length>0?`${this._style.background_selected}${this._style.text_selected}`:`${this._style.background_notSelected}${this._style.text_notSelected}`} `;return this._data.input.length>0?s+=this._data.input:s+=t.placeholder||"⇧⇩ Scroll | ⇦⇨ Switch Page | Type to give input",s+=" ".repeat(e.width-(0,$.default)(this._sperateColor(s).map((t=>t.text)).join("")+" "))+this._style.background,[s]}return[]}_getSize(){return{width:this._size.width||process.stdout.columns,height:this._size.height||process.stdout.rows}}_sperateColor(t){const e=[];let s="";for(let i=0;i<t.length;i++)if(""===t[i]){const e=i;for(;"m"!==t[i]&&i<t.length;)s+=t[i],i++;"m"===t[i]?s+="m":i=e}else void 0===s?e.push({text:t[i]}):(e.push({sequence:s,text:t[i]}),s="");return e}_handleInput(t){const e=t.toString("hex");if([...z.upArrow,...z.downArrow,...z.leftArrow,...z.rightArrow].includes(e)){if(void 0!==this._data.currentPage){const t=this._pages[this._data.currentPage];if(!z.upArrow.includes(e)||void 0!==this._options.allowScroll&&!0!==this._options.allowScroll)if(!z.downArrow.includes(e)||void 0!==this._options.allowScroll&&!0!==this._options.allowScroll)if(!z.leftArrow.includes(e)||void 0!==this._options.allowSwitchPage&&!0!==this._options.allowSwitchPage){if(z.rightArrow.includes(e)&&(void 0===this._options.allowSwitchPage||!0===this._options.allowSwitchPage)){const t=Object.keys(this._pages);t.indexOf(this._data.currentPage)>t.length-2?this._data.currentPage=t[0]:this._data.currentPage=t[t.indexOf(this._data.currentPage)+1],this._callEvent("switchPage",this._data.currentPage)}}else{const t=Object.keys(this._pages);t.indexOf(this._data.currentPage)<1?this._data.currentPage=t[t.length-1]:this._data.currentPage=t[t.indexOf(this._data.currentPage)-1],this._callEvent("switchPage",this._data.currentPage)}else{const e=this._getSize();t.cursorY-t.scrollY<e.height-this._layout.length-1&&t.cursorY<t.content.length-1?t.cursorY++:t.cursorY<t.content.length-1&&(t.cursorY++,t.scrollY++),this._callEvent("scroll",{page:this._data.currentPage,cursorY:t.cursorY,scrollY:t.scrollY})}else t.cursorY>t.scrollY?t.cursorY--:t.scrollY>0&&(t.cursorY--,t.scrollY--),this._callEvent("scroll",{page:this._data.currentPage,cursorY:t.cursorY,scrollY:t.scrollY})}}else if(z.enter.includes(e))this._data.input.length>0?(this._callEvent("enter",this._data.input),this._data.input=""):void 0!==this._data.currentPage&&this._callEvent("select",{page:this._data.currentPage,cursorY:this._pages[this._data.currentPage].cursorY});else if(z.backspace.includes(e))this._data.input.length>0&&(this._data.input=this._data.input.substring(0,this._data.input.length-1)),this._callEvent("input",this._data.input);else{/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]*$/.test(t.toString())&&(this._data.input+=t.toString()),this._callEvent("input",t)}this._callEvent("keydown",t)}_callEvent(t,e){Object.keys(this._listeners).forEach((s=>{this._listeners[s].type===t&&this._listeners[s].callback(e)}))}},S=class{static blank(){return{type:"blank"}}static text(t){return{type:"text",callback:t}}static pageTabs(){return{type:"pageTabs"}}static pageContent(){return{type:"pageContent"}}static input(t){return{type:"input",placeholder:t}}};function A(t){let e="";for(let r=0;r<t;r++)e+=M[(s=0,i=M.length-1,Math.floor(Math.random()*i)+s)];var s,i;return e}var j={reset:"[0m",red:"[31m",brightRed:"[92m",yellow:"[33m",brightYellow:"[93m",green:"[32m",brightGreen:"[92m",cyan:"[36m",brightCyan:"[96m",blue:"[34m",brightBlue:"[94m",purple:"[35m",brightPurple:"[95m",white:"[97m",black:"[30m",gray:"[90m"},C={reset:"[0m",red:"[41m",brightRed:"[101m",yellow:"[43m",brightYellow:"[103m",green:"[42m",brightGreen:"[102m",cyan:"[46m",brightCyan:"[106m",blue:"[44m",brightBlue:"[104m",purple:"[104m",brightPurple:"[105m",white:"[107m",black:"[40m",gray:"[100m"},z={upArrow:["1b5b41"],downArrow:["1b5b42"],leftArrow:["1b5b44"],rightArrow:["1b5b43"],enter:["0d"],backspace:["7f","08"]},M="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789",O=class{_Core;_state="idle";_cli=void 0;constructor(t){this._Core=t}start(){if("idle"!==this._state)throw new Error(`Cannot Start The User Interface: ${this._state}`);this._state="rendering",this._cli=new x({renderInterval:10,pagePrefix_notSelected:"",pagePrefix_selected:"",allowScroll:!1,allowSwitchPage:!1}),this._cli.setLayout([{type:"pageContent"}]).createPage("page","page",(()=>void 0===this._Core.PageManager.currentPage?[]:this._Core.PageManager.render(process.stdout.columns,process.stdout.rows))).listen("keydown",(t=>this._Core.PageManager.keydown(t)))}stop(){if("rendering"!==this._state)throw new Error(`Cannot Stop The User Interface: ${this._state}`);this._state="idle",this._cli.stop()}},E=n(require("os")),T=n(require("wcwidth")),I=class{static bold(t){return`[1m${t}[22m`}static underline(t){return`[4m${t}[24m`}static strikethrough(t){return`[9m${t}[29m`}static red(t){return`[31m${t}[0m`}static yellow(t){return`[33m${t}[0m`}static green(t){return`[32m${t}[0m`}static cyan(t){return`[36m${t}[0m`}static blue(t){return`[34m${t}[0m`}static purple(t){return`[35m${t}[0m`}static brightRed(t){return`[91m${t}[0m`}static brightYellow(t){return`[93m${t}[0m`}static brightGreen(t){return`[92m${t}[0m`}static brightCyan(t){return`[96m${t}[0m`}static brightBlue(t){return`[94m${t}[0m`}static brightPurple(t){return`[95m${t}[0m`}static white(t){return`[37m${t}[0m`}static black(t){return`[30m${t}[0m`}static gray(t){return`[30m${t}[0m`}};function Y(t){let e="";for(let s=0;s<t.length;s++)if(""===t[s]){const e=s;for(;"m"!==t[s]&&s<t.length;)s++;"m"!==t[s]&&(s=e)}else e+=t[s];return(0,T.default)(e)}function D(t,e,s,i){if(i+Y(s)>t){const e=i+Y(s)-t;for(;Y(s)>e&&s.length>0;)s=s.substring(0,s.length-1)}else if(i<0){const t=Y(s)+i;for(;Y(s)>t&&s.length>0;)s=s.substring(1,s.length);i=0}let r="",a="";for(let t=0;Y(r)<i&&t<e.length;t++)r+=e[t];for(let r=e.length-1;(0,T.default)(a)<t-(i+Y(s))&&r>=0;r--)a+=e[r];return r+s+a}var R=class{},U=class extends R{_options;_selected=0;_x;_y;_width;_height;_style;constructor(t,e,s,i){if(super(),0===t.length)throw new Error("No Options Provided");this._options=t,this._x=e,this._y=s,this._style=i||{}}setOptions(t){if(0===t.length)throw new Error("No Options Provided");this._options=t}render(t,e,s){let i,r;this._measure(),"left"===this._style.horizontalAlign||void 0===this._style.horizontalAlign?i=this._x:"center"===this._style.horizontalAlign?i=Math.round(t/2-this._width/2)+this._x:"right"===this._style.horizontalAlign&&(i=Math.round(t-this._width)+this._x),"top"===this._style.verticalAlign||void 0===this._style.verticalAlign?r=this._y:"center"===this._style.verticalAlign?r=Math.round(e/2-this._height/2)+this._y:"bottom"===this._style.verticalAlign&&(r=Math.round(e-this._height)+this._y);const a=void 0===this._style.prefix_notSelected?"":this._style.prefix_notSelected,n=void 0===this._style.suffix_notSelected?"":this._style.suffix_notSelected,o=void 0===this._style.prefix_selected?"> ":this._style.prefix_selected,l=void 0===this._style.suffix_selected?" <":this._style.suffix_selected;this._options.forEach(((h,c)=>{let d=Math.round(r+c);if(d>=0&&d<=e){let e,r=c===this._selected?`${o}${h.name(!0)}${l}`:`${a}${h.name(!1)}${n}`,_=this._style.optionAlign||h.optionAlign;"left"===_||void 0===_?e=i:"center"===_?e=i+Math.round(this._width/2-Y(r)/2):"right"===_&&(e=i+Math.round(this._width/2-Y(r))),s[d]=D(t,s[d],r,e)}}))}keydown(t){const e=t.toString("hex");"1b5b41"===e?(this._selected--,this._selected<0&&(this._style.loop?this._selected=this._options.length-1:this._selected=0)):"1b5b42"===e?(this._selected++,this._selected>=this._options.length&&(this._style.loop?this._selected=0:this._selected=this._options.length-1)):void 0!==this._options[this._selected].selected&&("0d"===e?this._options[this._selected].selected("none"):"1b5b44"===e?this._options[this._selected].selected("left"):"1b5b43"===e&&this._options[this._selected].selected("right"))}_measure(){let t=0;const e=void 0===this._style.prefix_selected?"> ":this._style.prefix_selected,s=void 0===this._style.suffix_selected?" <":this._style.suffix_selected;this._options.forEach(((i,r)=>{const a=Y(`${e}${i.name(r===this._selected)}${s}`);a>t&&(t=a)})),this._width=t,this._height=this._options.length}},q={SelectMenu:U,Text:class extends R{_content;_x;_y;_width;_height;_style;constructor(t,e,s,i){super(),this._content=t,this._x=e,this._y=s,this._style=i||{},this._measure()}setContent(t){this._content=t,this._measure()}render(t,e,s){let i,r;"left"===this._style.horizontalAlign||void 0===this._style.horizontalAlign?i=this._x:"center"===this._style.horizontalAlign?i=Math.round(t/2-this._width/2)+this._x:"right"===this._style.horizontalAlign&&(i=Math.round(t-this._width)+this._x),"top"===this._style.verticalAlign||void 0===this._style.verticalAlign?r=this._y:"center"===this._style.verticalAlign?r=Math.round(e/2-this._height/2)+this._y:"bottom"===this._style.verticalAlign&&(r=Math.round(e-this._height)+this._y),this._content.split("\n").forEach(((a,n)=>{const o=Math.round(r+n);o>=0&&o<=e&&(s[o]=D(t,s[o],a,i))}))}keydown(){}_measure(){let t=0;const e=this._content.split("\n");e.forEach((e=>{const s=Y(e);s>t&&(t=s)})),this._width=t,this._height=e.length}}},N={id:"settings",initialize:async t=>{t.Core.loadData();const e=t.Core.settings,s=["512x384","1024x768","2048x1536","4096x3072"],i=[15,30,60,120],r=E.default.cpus().length;return[new q.Text("- Settings -",0,1,{horizontalAlign:"center"}),new q.SelectMenu([{name:()=>"512x384"===e.resolution?`Resolution: ${I.yellow("512x384 (Low)")}`:"1024x768"===e.resolution?`Resolution: ${I.green("1024x768 (Medium)")}`:"2048x1536"===e.resolution?`Resolution: ${I.blue("2048x1536 (High)")}`:`Resolution: ${I.cyan("4096x3072 (Ultra)")}`,selected:t=>{let i=s.indexOf(e.resolution);"left"===t?(i--,i<0&&(i=0)):"right"===t&&(i++,i>=s.length&&(i=s.length-1)),e.resolution=s[i]}},{name:()=>15===e.fps?`FPS: ${I.yellow("30 (Low)")}`:30===e.fps?`FPS: ${I.green("30 (Medium)")}`:60===e.fps?`FPS: ${I.blue("60 (High)")}`:`FPS: ${I.cyan("120 (Ultra)")}`,selected:t=>{let s=i.indexOf(e.fps);"left"===t?(s--,s<0&&(s=0)):"right"===t&&(s++,s>=i.length&&(s=i.length-1)),e.fps=i[s]}},{name:()=>""},{name:()=>e.threads>=32?`Threads: ${I.purple(`${e.threads} / ${r} (Mega Super Ultra)`)}`:e.threads>=32?`Threads: ${I.purple(`${e.threads} / ${r} (Super Ultra)`)}`:e.threads>=16?`Threads: ${I.cyan(`${e.threads} / ${r} (Ultra)`)}`:e.threads>=8?`Threads: ${I.blue(`${e.threads} / ${r} (High)`)}`:e.threads>=4?`Threads: ${I.green(`${e.threads} / ${r} (Medium)`)}`:e.threads>=2?`Threads: ${I.yellow(`${e.threads} / ${r} (Low)`)}`:`Threads: ${I.red(`${e.threads} / ${r} (Potato)`)}`,selected:t=>{"left"===t?(e.threads--,e.threads<1&&(e.threads=1)):(e.threads++,e.threads>r&&(e.threads=r))}},{name:()=>""},{name:()=>"Back",selected:()=>{t.Core.saveData(),t.Core.PageManager.switchPage("home")},optionAlign:"center"}],0,3,{horizontalAlign:"center"}),new q.Text(I.green("Press [Left / Right] to change."),0,-1,{horizontalAlign:"center",verticalAlign:"bottom"})]}},F=n(require("path")),L=n(require("worker_threads")),W=class{_workers={};_batchs={};async startWorkers(t){const e=[];for(let s=0;s<t;s++){const t=_(5,Object.keys(this._workers));this._workers[t]={state:"starting",worker:new L.default.Worker(__filename)},e.push(this._handleWorker(t))}await Promise.all(e)}stopWorkers(){Object.keys(this._workers).forEach((t=>{this._workers[t].worker.terminate(),delete this._workers[t]}))}async addBatch(t,e,s){return new Promise((i=>{const r={type:t,jobs:{},result:[],progressCallback:s,finishCallback:i};e.forEach((t=>r.jobs[_(5,Object.keys(r.jobs))]=t)),this._assignJobs()}))}_assignJobs(){for(let t of Object.keys(this._workers))if("started"===this._workers[t].state){const e=this._getJob();if(void 0===e)break;this._batchs[e.batchID].jobs[e.jobID].state="inProgress",this._workers[t].worker.postMessage({batchID:e.batchID,jobID:e.jobID,data:this._batchs[e.batchID].jobs[e.jobID].data})}Object.keys(this._workers).forEach((t=>{}))}_getJob(){for(let t of Object.keys(this._batchs)){const e=this._batchs[t];for(let s of Object.keys(e.jobs))if("waiting"===e.jobs[s].state)return{batchID:t,jobID:s};break}}async _handleWorker(t){return new Promise((e=>{this._workers[t].worker.on("message",(t=>{"ready"===t.type&&e(),console.log(t)}))}))}},J=class{_state="idle";_options;_replays=[];WorkerManager;constructor(t){this._options=t,this.WorkerManager=new W}async initialize(){if("idle"!==this._state)throw new Error(`Cannot Initialize HeatTrace: ${this._state}`);this._state="initializing",await this.WorkerManager.startWorkers(this._options.threads),this._state="initialized"}async loadReplays(t){if("initialized"!==this._state)throw new Error(`Cannot Load Replays: ${this._state}`)}},B={id:"render",initialize:async t=>{let e="image";return[new q.Text(I.bold(I.cyan("- Render -")),0,-2,{horizontalAlign:"center",verticalAlign:"center"}),new q.Text(`Put your replays in: ${I.green(F.default.join(t.Core.dataPath,"Data","Replays"))}`,0,0,{horizontalAlign:"center",verticalAlign:"center"}),new q.SelectMenu([{name:()=>"image"===e?`Render: ${I.purple("Image")}`:`Render: ${I.purple("Video")}`,selected:s=>{"none"===s?t.Core.PageManager.switchPage("rendering",e):e="image"===e?"video":"image"}},{name:()=>"Back",selected:()=>t.Core.PageManager.switchPage("home")}],0,2,{horizontalAlign:"center",verticalAlign:"center",optionAlign:"center"}),new q.Text(I.green("Press [Left / Right] to change."),0,-1,{horizontalAlign:"center",verticalAlign:"bottom"})]},subPages:[{id:"rendering",initialize:async(t,e)=>{let s=new q.Text("",0,-1,{horizontalAlign:"center",verticalAlign:"center"}),i=0;function r(){s.setContent(`${I.green(`${H[i]} Parsing Replays`)}\n↳ 1 / 100`)}r(),t.TimerManager.createInterval(100,(()=>{i++,i>=H.length&&(i=0),r()}));const a=t.Core.settings,n=new J({width:+a.resolution.split("x")[0],height:+a.resolution.split("x")[1],fps:a.fps,threads:a.threads});return await n.initialize(),await n.loadReplays([]),[s]}}]},H=["⠙","⠸","⢰","⣠","⣄","⡆","⠇","⠋"],G={id:"home",initialize:async t=>[new q.Text(I.bold(I.yellow("- Heat Trace -")),0,-2,{horizontalAlign:"center",verticalAlign:"center"}),new q.SelectMenu([{name:()=>"Render",selected:()=>t.Core.PageManager.switchPage("render")},{name:()=>"Settings",selected:()=>t.Core.PageManager.switchPage("settings")},{name:()=>"Exit",selected:()=>t.Core.stop()}],0,1,{horizontalAlign:"center",verticalAlign:"center",optionAlign:"center"}),new q.Text(I.green("Press [Enter] to select, [Up / Down] to move."),0,-1,{horizontalAlign:"center",verticalAlign:"bottom"})]},K=class{_dataPath=l.default.join(h.default.homedir(),"HeatTrace");_state="idle";UserInterface;PageManager;settings;constructor(){this.UserInterface=new O(this),this.PageManager=new w(this),this.loadData(),this.PageManager.addPage(N).addPage(B).addPage(G)}get dataPath(){return this._dataPath}get state(){return this._state}start(){if("idle"!==this._state)throw new Error(`Cannot Start The APP: ${this._state}`);this._state="running",this.PageManager.switchPage("home"),this.UserInterface.start()}stop(){if("running"!==this._state)throw new Error(`Cannot Stop The APP: ${this._state}`);this._state="idle",this.UserInterface.stop()}loadData(){this.check(),this.settings=JSON.parse(c.default.readFileSync(l.default.join(this._dataPath,"Data","Settings.json"),"utf8"))}saveData(){this.check(),c.default.writeFileSync(l.default.join(this._dataPath,"Data"),JSON.stringify(this.settings))}check(){c.default.existsSync(this._dataPath)||c.default.mkdirSync(this._dataPath),c.default.existsSync(l.default.join(this._dataPath,"Data"))||c.default.mkdirSync(l.default.join(this._dataPath,"Data")),c.default.existsSync(l.default.join(this._dataPath,"Replays"))||c.default.mkdirSync(l.default.join(this._dataPath,"Replays")),c.default.existsSync(l.default.join(this._dataPath,"Data","Settings.json"))||c.default.writeFileSync(l.default.join(this._dataPath,"Data","Settings.json"),JSON.stringify(P)),c.default.existsSync(l.default.join(this._dataPath,"Data","ProjectData.json"))||c.default.writeFileSync(l.default.join(this._dataPath,"Data","ProjectData.json"),JSON.stringify({}))}};o.default.isMainThread||console.log(!0),(new class{_Core;constructor(){this._Core=new K}state(){return this._Core.state}start(){this._Core.start()}}).start();