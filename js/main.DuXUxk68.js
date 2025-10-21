(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(n){if(n.ep)return;n.ep=!0;const s=t(n);fetch(n.href,s)}})();const I=`<!-- SVG 图标库 -->\r
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\r
\r
  <!-- 搜索图标 -->\r
  <symbol id="icon-search" viewBox="0 0 24 24">\r
    <path fill="currentColor"\r
      d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0c.41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14z" />\r
  </symbol>\r
\r
  <!-- 文本图标 -->\r
  <symbol id="icon-text" viewBox="0 0 24 24">\r
    <path fill="currentColor"\r
      d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />\r
  </symbol>\r
\r
  <!-- 图片图标 -->\r
  <symbol id="icon-image" viewBox="0 0 24 24">\r
    <path fill="currentColor"\r
      d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14L6 17h12l-3.86-5.14z" />\r
  </symbol>\r
\r
  <!-- 文件图标 -->\r
  <symbol id="icon-file" viewBox="0 0 24 24">\r
    <path fill="currentColor"\r
      d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />\r
  </symbol>\r
\r
  <!-- 全部图标 -->\r
  <symbol id="icon-all" viewBox="0 0 24 24">\r
    <path fill="currentColor"\r
      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />\r
    <path fill="currentColor"\r
      d="M7 12h2v2H7zm0-3h2v2H7zm0-3h2v2H7zm4 6h2v2h-2zm0-3h2v2h-2zm0-3h2v2h-2zm4 6h2v2h-2zm0-3h2v2h-2zm0-3h2v2h-2z" />\r
  </symbol>\r
\r
  <!-- 复制图标 -->\r
  <symbol id="icon-copy" viewBox="0 0 24 24">\r
    <path fill="currentColor"\r
      d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />\r
  </symbol>\r
\r
  <!-- 删除图标 -->\r
  <symbol id="icon-delete" viewBox="0 0 24 24">\r
    <path fill="currentColor"\r
      d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />\r
  </symbol>\r
\r
  <!-- 清空图标 -->\r
  <symbol id="icon-clear" viewBox="0 0 24 24">\r
    <path fill="currentColor"\r
      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />\r
  </symbol>\r
\r
  <!-- 监听中图标 -->\r
  <symbol id="icon-monitoring" viewBox="0 0 24 24">\r
    <path fill="currentColor"\r
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />\r
  </symbol>\r
\r
  <!-- 暂停图标 -->\r
  <symbol id="icon-pause" viewBox="0 0 24 24">\r
    <path fill="currentColor"\r
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />\r
  </symbol>\r
\r
  <!-- 关闭图标 -->\r
  <symbol id="icon-close" viewBox="0 0 24 24">\r
    <path fill="currentColor"\r
      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z" />\r
  </symbol>\r
\r
  <!-- 时间图标 -->\r
  <symbol id="icon-time" viewBox="0 0 24 24">\r
    <path fill="currentColor"\r
      d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8zm.5-13H11v6l5.25 3.15l.75-1.23l-4.5-2.67z" />\r
  </symbol>\r
\r
  <!-- 勾选图标 -->\r
  <symbol id="icon-check" viewBox="0 0 24 24">\r
    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41L9 16.17z" />\r
  </symbol>\r
\r
</svg>`,v={virtualScrollItemHeight:80,virtualScrollImageItemHeight:260,virtualScrollBufferSize:5,virtualScrollItemGap:12,virtualScrollContainerPadding:12,imageItem:{previewHeight:180,infoBarHeight:50},listItemStyle:{padding:8,borderRadius:8}};function w(){const c=v,{imageItem:e,listItemStyle:t,virtualScrollItemHeight:i,virtualScrollImageItemHeight:n}=c,s=document.createElement("style");s.id="dynamic-clipboard-styles",s.textContent=`
    /* 动态生成的样式 - 基于 config.ts 配置 */
    
    /* 文本/文件列表项 */
    .list-item {
      height: ${i}px !important;
      padding: ${t.padding}px !important;
      border-radius: ${t.borderRadius}px !important;
      box-sizing: border-box !important;
    }
    
    /* 图片列表项 */
    .list-item-image {
      height: ${n}px !important;
      box-sizing: border-box !important;
    }
    
    /* 图片预览区域 */
    .item-image-preview {
      height: ${e.previewHeight}px !important;
      flex-shrink: 0 !important;
    }
    
    /* 图片信息栏 */
    .item-image-info {
      height: ${e.infoBarHeight}px !important;
      padding: ${Math.floor(t.padding*1.25)}px ${t.padding}px !important;
      flex-shrink: 0 !important;
      box-sizing: border-box !important;
    }
  `,document.head.appendChild(s)}const p=new Map;class L{wrapper;content;items=[];visibleItems=[];itemHeight=v.virtualScrollItemHeight;imageItemHeight=v.virtualScrollImageItemHeight;itemGap=v.virtualScrollItemGap;containerPadding=v.virtualScrollContainerPadding;visibleCount=0;startIndex=0;scrollTop=0;bufferSize=v.virtualScrollBufferSize;constructor(e){this.wrapper=document.getElementById("listWrapper"),this.content=document.getElementById("listContent"),this.init()}init(){this.calculateVisibleCount(),this.wrapper.addEventListener("scroll",this.handleScroll.bind(this)),window.addEventListener("resize",()=>{this.calculateVisibleCount(),this.render()})}getItemHeight(e){return e.type==="image"?this.imageItemHeight:this.itemHeight}getItemOffset(e){let t=this.containerPadding;for(let i=0;i<e;i++)t+=this.getItemHeight(this.items[i])+this.itemGap;return t}calculateVisibleCount(){const e=this.wrapper.clientHeight;this.visibleCount=Math.ceil(e/this.itemHeight)+this.bufferSize*2}handleScroll(){this.scrollTop=this.wrapper.scrollTop,this.startIndex=0;for(let e=0;e<this.items.length;e++)if(this.getItemOffset(e)+this.getItemHeight(this.items[e])>=this.scrollTop){this.startIndex=e;break}this.render()}setData(e){this.items=e,this.updateContainerHeight(),this.render()}updateContainerHeight(){let e=this.containerPadding;for(let t=0;t<this.items.length;t++)e+=this.getItemHeight(this.items[t]),t<this.items.length-1&&(e+=this.itemGap);e+=this.containerPadding,this.content.style.height=`${e}px`}render(){const e=Math.max(0,this.startIndex-this.bufferSize),t=Math.min(this.items.length,this.startIndex+this.visibleCount+this.bufferSize);this.visibleItems=this.items.slice(e,t),this.content.innerHTML="",this.visibleItems.forEach((i,n)=>{const s=e+n,r=this.createItemElement(i,s);this.content.appendChild(r)})}createItemElement(e,t){const i=document.createElement("div");i.className=`list-item ${e.type==="image"?"list-item-image":""}`;const n=this.getItemOffset(t);if(i.style.transform=`translateY(${n}px)`,i.dataset.id=e._id,e.type==="image"){const s=document.createElement("div");if(s.className="item-image-preview",e.thumbnail){const o=document.createElement("img");o.alt="图片预览",o.className="preview-image";const g=p.get(e.thumbnail);g?o.src=g:(o.style.opacity="0.3",clipboardAPI.getThumbnail(e.thumbnail).then(u=>{p.set(e.thumbnail,u),o.isConnected&&(o.src=u,o.style.opacity="1")}).catch(u=>{if(console.error("加载缩略图失败:",u),s.isConnected){const f=document.createElement("div");f.className="image-load-error",f.innerHTML='<svg class="error-icon"><use href="#icon-image"></use></svg><span>图片加载失败</span>',s.innerHTML="",s.appendChild(f)}})),s.appendChild(o),s.addEventListener("click",u=>{u.stopPropagation(),h.showImagePreview(e)}),s.style.cursor="pointer"}const r=document.createElement("div");r.className="item-image-info";const l=document.createElement("span");l.className="item-time",l.innerHTML=`<svg class="time-icon"><use href="#icon-time"></use></svg><span>${this.formatTime(e.timestamp)}</span>`;const m=document.createElement("div");m.className="item-actions";const d=document.createElement("button");d.className="item-action-btn copy",d.innerHTML='<svg><use href="#icon-copy"></use></svg>',d.title="复制",d.addEventListener("click",o=>{o.stopPropagation(),h.copyRecord(e,d)});const a=document.createElement("button");a.className="item-action-btn delete",a.innerHTML='<svg><use href="#icon-delete"></use></svg>',a.title="删除",a.addEventListener("click",o=>{o.stopPropagation(),h.deleteRecord(e._id)}),m.appendChild(d),m.appendChild(a),r.appendChild(l),r.appendChild(m),i.appendChild(s),i.appendChild(r)}else{const s=document.createElement("div");s.className="item-content";const r=document.createElement("div");r.className="item-preview",r.textContent=e.preview;const l=document.createElement("div");l.className="item-meta";const m=document.createElement("span");m.className="item-time",m.innerHTML=`<svg class="time-icon"><use href="#icon-time"></use></svg><span>${this.formatTime(e.timestamp)}</span>`,l.appendChild(m),s.appendChild(r),s.appendChild(l);const d=document.createElement("div");d.className="item-actions";const a=document.createElement("button");a.className="item-action-btn copy",a.innerHTML='<svg><use href="#icon-copy"></use></svg>',a.title="复制",a.addEventListener("click",g=>{g.stopPropagation(),h.copyRecord(e,a)});const o=document.createElement("button");o.className="item-action-btn delete",o.innerHTML='<svg><use href="#icon-delete"></use></svg>',o.title="删除",o.addEventListener("click",g=>{g.stopPropagation(),h.deleteRecord(e._id)}),d.appendChild(a),d.appendChild(o),i.appendChild(s),i.appendChild(d)}return i}formatTime(e){const t=new Date(e),i=t.getFullYear(),n=String(t.getMonth()+1).padStart(2,"0"),s=String(t.getDate()).padStart(2,"0"),r=String(t.getHours()).padStart(2,"0"),l=String(t.getMinutes()).padStart(2,"0"),m=String(t.getSeconds()).padStart(2,"0");return`${i}-${n}-${s} ${r}:${l}:${m}`}}class b{modal;previewImage;currentRecord=null;constructor(){this.modal=document.getElementById("imagePreviewModal"),this.previewImage=document.getElementById("previewImage"),this.init()}init(){document.getElementById("closeModal").addEventListener("click",()=>{this.hide()}),this.modal.querySelector(".modal-overlay").addEventListener("click",()=>{this.hide()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&this.modal.classList.contains("show")&&this.isShow()&&(this.hide(),e.stopPropagation(),e.preventDefault())}),document.getElementById("copyImageBtn").addEventListener("click",async e=>{if(this.currentRecord&&this.currentRecord.originalPath){const t=e.currentTarget;await h.copyFullImage(this.currentRecord.originalPath,t),setTimeout(()=>{this.hide()},1200)}}),document.getElementById("deleteImageBtn").addEventListener("click",async()=>{this.currentRecord&&(await h.deleteRecord(this.currentRecord._id),this.hide())})}async show(e){if(this.currentRecord=e,e.originalPath)try{this.modal.classList.add("show");const t=p.get(e.originalPath);if(t)this.previewImage.src=t;else{this.previewImage.style.opacity="0.3";const i=await clipboardAPI.getFullImage(e.originalPath);p.set(e.originalPath,i),this.previewImage.src=i,this.previewImage.style.opacity="1"}}catch(t){console.error("加载图片失败:",t),this.hide()}}hide(){this.modal.classList.remove("show"),this.currentRecord=null,this.previewImage.src=""}isShow(){return this.modal.classList.contains("show")}}class H{virtualList;imagePreview;currentFilter="all";currentSearchKeyword="";searchDebounceTimer=null;allRecords=[];constructor(){this.virtualList=new L("listContainer"),this.imagePreview=new b,this.init()}async init(){console.log("剪贴板历史管理器初始化..."),this.initUIEvents(),window.addEventListener("clipboard-updated",()=>{this.loadRecords()}),await this.loadRecords(),(await clipboardAPI.getConfig()).autoStartMonitoring&&(await clipboardAPI.isMonitoring()||(console.log("自动启动剪贴板监听..."),await clipboardAPI.startMonitoring())),await this.updateMonitoringStatus(),naimo.log.info("剪贴板历史管理器初始化完成")}initUIEvents(){document.getElementById("searchInput").addEventListener("input",i=>{const n=i.target.value;this.handleSearch(n)});const t=document.querySelectorAll(".filter-btn");t.forEach(i=>{i.addEventListener("click",n=>{const s=n.currentTarget,r=s.dataset.type;t.forEach(l=>l.classList.remove("active")),s.classList.add("active"),this.currentFilter=r,this.applyFilter()})}),document.getElementById("monitorToggle").addEventListener("click",async()=>{await clipboardAPI.isMonitoring()?await clipboardAPI.stopMonitoring():await clipboardAPI.startMonitoring(),await this.updateMonitoringStatus()}),document.getElementById("clearAllBtn").addEventListener("click",async()=>{confirm("确定要清空所有剪贴板记录吗？此操作不可恢复！")&&await this.clearAll()})}handleSearch(e){this.currentSearchKeyword=e,this.searchDebounceTimer&&clearTimeout(this.searchDebounceTimer),this.searchDebounceTimer=window.setTimeout(async()=>{if(e.trim()){const t=await clipboardAPI.searchRecords(e);this.allRecords=t}else await this.loadRecords();this.applyFilter()},300)}applyFilter(){let e=this.allRecords;this.currentFilter!=="all"&&(e=e.filter(t=>t.type===this.currentFilter)),this.updateList(e),this.updateStats(e.length)}async loadRecords(){try{const e=await clipboardAPI.queryRecords({limit:1e3,sortBy:"timestamp",order:"desc"});this.allRecords=e,this.applyFilter()}catch(e){console.error("加载记录失败:",e)}}updateList(e){const t=document.getElementById("emptyState");e.length===0?t.classList.remove("hidden"):t.classList.add("hidden"),this.virtualList.setData(e)}updateStats(e){const t=document.getElementById("recordCount"),i=document.getElementById("filterInfo");t.textContent=`共 ${e} 条记录`;let n="显示全部";this.currentFilter==="text"?n="显示文本":this.currentFilter==="image"?n="显示图片":this.currentFilter==="file"&&(n="显示文件"),this.currentSearchKeyword&&(n+=` · 搜索: ${this.currentSearchKeyword}`),i.textContent=n}async updateMonitoringStatus(){const e=document.getElementById("monitorToggle");await clipboardAPI.isMonitoring()?(e.classList.add("monitoring"),e.innerHTML='<svg class="btn-icon"><use href="#icon-monitoring"></use></svg><span>监听中</span>'):(e.classList.remove("monitoring"),e.innerHTML='<svg class="btn-icon"><use href="#icon-pause"></use></svg><span>已暂停</span>')}async showImagePreview(e){await this.imagePreview.show(e)}async copyRecord(e,t){let i="";t&&(i=t.innerHTML);try{t&&(t.disabled=!0,t.classList.add("copying"),t.innerHTML='<svg><use href="#icon-check"></use></svg>'),e.type==="text"?await clipboardAPI.copyText(e.content):e.type==="image"&&e.originalPath&&await clipboardAPI.copyFullImage(e.originalPath),t&&setTimeout(()=>{t.disabled=!1,t.classList.remove("copying"),t.innerHTML=i},1e3)}catch(n){console.error("复制失败:",n),t&&(t.disabled=!1,t.classList.remove("copying"),t.innerHTML=i)}}async copyFullImage(e,t){let i="";t&&(i=t.innerHTML);try{t&&(t.disabled=!0,t.classList.add("copying"),t.innerHTML='<svg class="btn-icon"><use href="#icon-check"></use></svg><span>已复制</span>'),await clipboardAPI.copyFullImage(e),t&&setTimeout(()=>{t.disabled=!1,t.classList.remove("copying"),t.innerHTML=i},1e3)}catch(n){console.error("复制图片失败:",n),t&&(t.disabled=!1,t.classList.remove("copying"),t.innerHTML=i)}}async deleteRecord(e){try{const t=this.allRecords.find(n=>n._id===e);t&&t.type==="image"&&(t.thumbnail&&p.delete(t.thumbnail),t.originalPath&&p.delete(t.originalPath)),await clipboardAPI.deleteRecord(e)&&await this.loadRecords()}catch(t){console.error("删除失败:",t)}}async clearAll(){try{await clipboardAPI.clearAll()&&(p.clear(),await this.loadRecords())}catch(e){console.error("清空失败:",e)}}}let h;async function y(){try{w();const c=document.getElementById("svg-icons");c&&(c.innerHTML=I),h=new H}catch(c){console.error("应用初始化失败:",c),naimo.log.error("应用初始化失败",c)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",y):y();
