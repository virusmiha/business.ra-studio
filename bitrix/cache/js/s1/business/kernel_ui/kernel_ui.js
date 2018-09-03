; /* /bitrix/js/ui/animations/animations.min.js?15349432752113*/
; /* /bitrix/js/ui/tooltip/tooltip.min.js?15349432759434*/

; /* Start:"a:4:{s:4:"full";s:57:"/bitrix/js/ui/animations/animations.min.js?15349432752113";s:6:"source";s:38:"/bitrix/js/ui/animations/animations.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
(function(){var e=window.BX;e.namespace("BX.UI");if(!!e.UI.Animations){return}e.UI.Animations={expand:function(t){if(!e(t.moreButtonNode)){return}var n=e.type.isNotEmptyString(t.type)?t.type:"post",i=e.type.isNotEmptyString(t.classBlock)?t.classBlock:"feed-post-text-block",o=e.type.isNotEmptyString(t.classOuter)?t.classOuter:"feed-post-text-block-inner",a=e.type.isNotEmptyString(t.classInner)?t.classInner:"feed-post-text-block-inner-inner",r=typeof t.heightLimit!="undefined"&&parseInt(t.heightLimit)>0?parseInt(t.heightLimit):300;var s=e.findParent(e(t.moreButtonNode),{tag:"div",className:i});if(!s){return}var l=e.findChild(s,{tag:"div",className:o},true);var c=e.findChild(s,{tag:"div",className:a},true);if(!l||!c){return}var m=r,d=parseInt(c.offsetHeight),f={height:m},p={height:d};if(!!t.moreButtonNode){e.remove(t.moreButtonNode)}var u=(d-m)/(2e3-m);u=u<.3?.3:u>.8?.8:u;l.style.maxHeight=f.height+"px";l.style.overflow="hidden";l.style.maxHeight=f.height+"px";l.style.overflow="hidden";new e["easing"]({duration:u*1e3,start:f,finish:p,transition:e.easing.makeEaseOut(e.easing.transitions.quart),step:function(e){l.style.maxHeight=e.height+"px";l.style.opacity=e.opacity/100},complete:function(){l.style.cssText="";l.style.maxHeight="none";e.LazyLoad.showImages(true);if(e.type.isFunction(t.callback)){t.callback(l)}}}).animate();return true},onPlayerPlay:function(t){var n={post:{block:"feed-post-text-block",outer:"feed-post-text-block-inner",inner:"feed-post-text-block-inner-inner"},comment:{block:"feed-com-block",outer:"feed-com-text-inner",inner:"feed-com-text-inner-inner"},more:"feed-post-text-more"};var i=e.findParent(t,{className:n.post.block});var o=null;if(i){o="post"}else{i=e.findParent(t,{className:n.comment.block});if(i){o="comment"}}if(!i){return}var a=e.findChild(i,{className:n.more},true);if(a){e.UI.Animations.expand({moreButtonNode:a,type:o,classBlock:n[o].block,classOuter:n[o].outer,classInner:n[o].inner,heightLimit:o=="comment"?200:300})}}};e.ready(function(){e.addCustomEvent("Player:onPlay",function(t){var n=t.getElement();if(n){e.UI.Animations.onPlayerPlay(n)}})})})();
/* End */
;
; /* Start:"a:4:{s:4:"full";s:51:"/bitrix/js/ui/tooltip/tooltip.min.js?15349432759434";s:6:"source";s:32:"/bitrix/js/ui/tooltip/tooltip.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
(function(){var BX=window.BX;BX.namespace("BX.UI");if(!!BX.UI.Tooltip){return}BX.UI.Tooltip={disabled:false,tooltipsList:{},disable:function(){this.disabled=true},enable:function(){this.disabled=false},getDisabledStatus:function(){return this.disabled},getLoader:function(){return"/bitrix/tools/tooltip.php"},getIdPrefix:function(){return"bx-ui-tooltip-"}};BX.ready(function(){if(BX.browser.IsAndroid()||BX.browser.IsIOS()){return}document.addEventListener("mouseover",function(t){var i=BX.getEventTarget(t);var o=i.getAttribute("bx-tooltip-user-id");var e=i.getAttribute("bx-tooltip-loader");var s=o;if(BX.type.isNotEmptyString(e)){var a=0;for(var l=0,r=e.length;l<r;l++){a=31*a+e.charCodeAt(l)<<0}s=a+o}if(parseInt(o)>0){if(null==BX.UI.Tooltip.tooltipsList[s]){BX.UI.Tooltip.tooltipsList[s]=new BX.UI.TooltipBalloon({userId:parseInt(o),node:i})}else{BX.UI.Tooltip.tooltipsList[s].node=i;BX.UI.Tooltip.tooltipsList[s].create()}t.preventDefault()}})});BX.UI.TooltipBalloon=function(t){this.node=t.node;this.userId=t.userId;this.tracking=false;this.active=false;this.width=393;this.height=302;this.realAnchor=null;this.coordsLeft=0;this.coordsTop=0;this.anchorRight=0;this.anchorBottom=0;this.rootClassName=this.node.getAttribute("bx-tooltip-classname");this.INFO=null;this.DIV=null;this.ROOT_DIV=null;var i={};var o=this.node.getAttribute("bx-tooltip-params");if(BX.type.isNotEmptyString(o)){i=JSON.parse(o);if(!BX.type.isPlainObject(i)){i={}}}this.params=i;this.create=function(){if(!BX.UI.Tooltip.getDisabledStatus()){this.startTrackMouse()}BX.bind(this.node,"mouseout",BX.delegate(this.stopTrackMouse,this))};this.trackMouseHandle=this.trackMouse.bind(this);this.create();return this};BX.UI.TooltipBalloon.prototype.startTrackMouse=function(){if(!this.tracking){var t=this;var i=BX.pos(this.node);this.realAnchor=this.node;this.coordsLeft=i.left+0;this.coordsTop=i.top-325;this.anchorRight=i.right;this.anchorBottom=i.bottom;this.tracking=true;BX.bind(document,"mousemove",this.trackMouseHandle);setTimeout(BX.delegate(function(){this.tickTimer()},this),500);BX.bind(this.node,"mouseout",BX.delegate(this.stopTrackMouse,this))}};BX.UI.TooltipBalloon.prototype.stopTrackMouse=function(){if(this.tracking){var t=this;BX.unbind(document,"mousemove",this.trackMouseHandle);this.active=false;setTimeout(BX.delegate(function(){this.hideTooltip()},this),500);this.tracking=false}};BX.UI.TooltipBalloon.prototype.trackMouse=function(t){if(!this.tracking){return}var i=t&&t.pageX?{x:t.pageX,y:t.pageY}:{x:t.clientX+document.body.scrollLeft,y:t.clientY+document.body.scrollTop};if(i.x<0){i.x=0}if(i.y<0){i.y=0}i.time=this.tracking;if(!this.active){this.active=i}else{if(this.active.x>=i.x-1&&this.active.x<=i.x+1&&this.active.y>=i.y-1&&this.active.y<=i.y+1){if(this.active.time+20<=i.time){this.showTooltip()}}else{this.active=i}}};BX.UI.TooltipBalloon.prototype.tickTimer=function(){var t=this;if(t.tracking){t.tracking++;if(t.active){if(t.active.time+5<=t.tracking){t.showTooltip()}}setTimeout(function(){t.tickTimer()},100)}};BX.UI.TooltipBalloon.prototype.hideTooltip=function(){if(!this.tracking){this.showOpacityEffect({func:this.SetInVisible,obj:this.DIV,arParams:[]},1)}};BX.UI.TooltipBalloon.prototype.showOpacityEffect=function(t,i){var o=3;var e=1;var s=1/o;var a=0,l,r=this;if(BX.browser.IsIE()&&r.DIV){r.DIV.className=r.classNameAnim}var n=function(){a++;if(a>o){clearInterval(d);if(!t.arParams){t.arParams=[]}if(t.func&&t.obj){t.func.apply(t.obj,t.arParams)}return}l=i?1-a*s:a*s;if(r.DIV!=null){try{r.DIV.style.filter="progid:DXImageTransform.Microsoft.Alpha(opacity="+l*100+")";r.DIV.style.opacity=l;r.DIV.style.MozOpacity=l;r.DIV.style.KhtmlOpacity=l}catch(t){}finally{if(!i&&a==1){r.DIV.style.display="block"}if(i&&a==o&&r.DIV){r.DIV.style.display="none"}if(BX.browser.IsIE()&&a==1&&i&&r.IFRAME){r.IFRAME.style.display="none"}if(BX.browser.IsIE()&&a==o&&r.DIV){if(!i){r.IFRAME.style.display="block"}r.DIV.style.filter=r.filterFixed;r.DIV.className=r.classNameFixed;r.DIV.innerHTML=""+r.DIV.innerHTML}if(i){BX.onCustomEvent("onTooltipHide",[r])}}}};var d=setInterval(n,e)};BX.UI.TooltipBalloon.prototype.showTooltip=function(){var t=this;var i=BX(BX.UI.Tooltip.getIdPrefix()+t.userId);if(BX.UI.Tooltip.getDisabledStatus()||i&&i.style.display=="block"){return}if(null==t.DIV&&null==t.ROOT_DIV){t.ROOT_DIV=document.body.appendChild(document.createElement("DIV"));t.ROOT_DIV.style.position="absolute";t.DIV=t.ROOT_DIV.appendChild(document.createElement("DIV"));t.DIV.className="bx-ui-tooltip-info-shadow";t.DIV.style.width=t.width+"px";t.DIV.style.height=t.height+"px"}var o=t.coordsLeft;var e=t.coordsTop+30;var s=BX.GetWindowScrollPos();var a=document.body;var l=false;var r=false;if(a.clientWidth+s.scrollLeft<o+t.width){o=t.anchorRight-t.width;l=true}if(e-s.scrollTop<0){e=t.anchorBottom-5;r=true;t.v_delta=40}else{t.v_delta=0}t.ROOT_DIV.style.left=parseInt(o)+"px";t.ROOT_DIV.style.top=parseInt(e)+"px";t.ROOT_DIV.style.zIndex=1200;BX.bind(BX(t.ROOT_DIV),"click",BX.eventCancelBubble);if(this.rootClassName!="undefined"&&this.rootClassName!=null&&this.rootClassName.length>0){t.ROOT_DIV.className=this.rootClassName}var n=BX.UI.Tooltip.getLoader();if(""==t.DIV.innerHTML){var d=n+(n.indexOf("?")>=0?"&":"?")+"MODE=UI&MUL_MODE=INFO&USER_ID="+t.userId+"&site="+(BX.message("SITE_ID")||"")+(typeof t.params!="undefined"&&typeof t.params.entityType!="undefined"&&t.params.entityType.length>0?"&entityType="+t.params.entityType:"")+(typeof t.params!="undefined"&&typeof t.params.entityId!="undefined"&&parseInt(t.params.entityId)>0?"&entityId="+parseInt(t.params.entityId):"");BX.ajax.get(d,BX.delegate(t.insertData,t));t.DIV.id=BX.UI.Tooltip.getIdPrefix()+t.userId;t.DIV.innerHTML='<div class="bx-ui-tooltip-info-wrap">'+'<div class="bx-ui-tooltip-info-leftcolumn">'+'<div class="bx-ui-tooltip-photo" id="'+BX.UI.Tooltip.getIdPrefix()+"photo-"+t.userId+'"><div class="bx-ui-tooltip-info-data-loading">'+BX.message("JS_CORE_LOADING")+"</div></div>"+'<div class="bx-ui-tooltip-tb-control bx-ui-tooltip-tb-control-left" id="'+BX.UI.Tooltip.getIdPrefix()+"toolbar-"+t.userId+'"></div>'+"</div>"+'<div class="bx-ui-tooltip-info-data">'+'<div id="'+BX.UI.Tooltip.getIdPrefix()+"data-card-"+t.userId+'"></div>'+'<div class="bx-ui-tooltip-info-data-tools">'+'<div class="bx-ui-tooltip-tb-control bx-ui-tooltip-tb-control-right" id="'+BX.UI.Tooltip.getIdPrefix()+"toolbar2-"+t.userId+'"></div>'+'<div class="bx-ui-tooltip-info-data-clear"></div>'+"</div>"+"</div>"+'</div><div class="bx-ui-tooltip-info-bottomarea"></div>'}t.DIV.className="bx-ui-tooltip-info-shadow";t.classNameAnim="bx-ui-tooltip-info-shadow-anim";t.classNameFixed="bx-ui-tooltip-info-shadow";t.filterFixed="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/bitrix/components/bitrix/main.user.link/templates/.default/images/cloud-left-top.png', sizingMethod = 'crop' );";if(l&&r){t.DIV.className="bx-ui-tooltip-info-shadow-hv";t.classNameAnim="bx-ui-tooltip-info-shadow-hv-anim";t.classNameFixed="bx-ui-tooltip-info-shadow-hv";t.filterFixed="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/bitrix/components/bitrix/main.user.link/templates/.default/images/cloud-right-bottom.png', sizingMethod = 'crop' );"}else{if(l){t.DIV.className="bx-ui-tooltip-info-shadow-h";t.classNameAnim="bx-ui-tooltip-info-shadow-h-anim";t.classNameFixed="bx-ui-tooltip-info-shadow-h";t.filterFixed="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/bitrix/components/bitrix/main.user.link/templates/.default/images/cloud-right-top.png', sizingMethod = 'crop' );"}if(r){t.DIV.className="bx-ui-tooltip-info-shadow-v";t.classNameAnim="bx-ui-tooltip-info-shadow-v-anim";t.classNameFixed="bx-ui-tooltip-info-shadow-v";t.filterFixed="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/bitrix/components/bitrix/main.user.link/templates/.default/images/cloud-left-bottom.png', sizingMethod = 'crop' );"}}if(BX.browser.IsIE()&&null==t.IFRAME){t.IFRAME=document.body.appendChild(document.createElement("IFRAME"));t.IFRAME.id=t.DIV.id+"_frame";t.IFRAME.style.position="absolute";t.IFRAME.style.width=t.width-60+"px";t.IFRAME.style.height=t.height-100+"px";t.IFRAME.style.borderStyle="solid";t.IFRAME.style.borderWidth="0px";t.IFRAME.style.zIndex=550;t.IFRAME.style.display="none"}if(BX.browser.IsIE()){t.IFRAME.style.left=parseInt(o)+25+"px";t.IFRAME.style.top=parseInt(e)+30+t.v_delta+"px"}t.DIV.style.display="none";t.showOpacityEffect({func:t.SetVisible,obj:t.DIV,arParams:[]},0);BX(BX.UI.Tooltip.getIdPrefix()+t.userId).onmouseover=function(){t.startTrackMouse(this)};BX(BX.UI.Tooltip.getIdPrefix()+t.userId).onmouseout=function(){t.stopTrackMouse(this)};BX.onCustomEvent("onTooltipShow",[this])};BX.UI.TooltipBalloon.prototype.insertData=function(data){var _this=this;if(null!=data&&data.length>0){eval("_this.INFO = "+data);var cardEl=BX(BX.UI.Tooltip.getIdPrefix()+"data-card-"+_this.userId);cardEl.innerHTML=_this.INFO.RESULT.Card;var photoEl=BX(BX.UI.Tooltip.getIdPrefix()+"photo-"+_this.userId);photoEl.innerHTML=_this.INFO.RESULT.Photo;var toolbarEl=BX(BX.UI.Tooltip.getIdPrefix()+"toolbar-"+_this.userId);toolbarEl.innerHTML=_this.INFO.RESULT.Toolbar;var toolbar2El=BX(BX.UI.Tooltip.getIdPrefix()+"toolbar2-"+_this.userId);toolbar2El.innerHTML=_this.INFO.RESULT.Toolbar2;if(BX.type.isArray(_this.INFO.RESULT.Scripts)){for(var i=0;i<_this.INFO.RESULT.Scripts.length;i++){eval(_this.INFO.RESULT.Scripts[i])}}BX.onCustomEvent("onTooltipInsertData",[_this])}}})();
/* End */
;