
; /* Start:"a:4:{s:4:"full";s:93:"/bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?15349432642527";s:6:"source";s:78:"/bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
var waitDiv = null;
var waitPopup = null;
var waitTimeout = null;
var waitTime = 500;

function __SASSetAdmin()
{
	__SASShowWait();
	BX.ajax({
		url: '/bitrix/components/bitrix/socialnetwork.admin.set/ajax.php',
		method: 'POST',
		dataType: 'json',
		data: {'ACTION': 'SET', 'sessid': BX.bitrix_sessid(), 'site': BX.util.urlencode(BX.message('SASSiteId'))},
		onsuccess: function(data) { __SASProcessAJAXResponse(data); }
	});
}

function __SASProcessAJAXResponse(data)
{
	if (data["SUCCESS"] != "undefined" && data["SUCCESS"] == "Y")
	{
		BX.reload();
		return false;
	}
	else if (data["ERROR"] != "undefined" && data["ERROR"].length > 0)
	{
		if (data["ERROR"].indexOf("SESSION_ERROR", 0) === 0)
		{
			__SASShowError(BX.message('SASErrorSessionWrong'));
			BX.reload();
		}
		else if (data["ERROR"].indexOf("CURRENT_USER_NOT_ADMIN", 0) === 0)
		{
			__SASShowError(BX.message('SASErrorNotAdmin'));
			return false;
		}
		else if (data["ERROR"].indexOf("CURRENT_USER_NOT_AUTH", 0) === 0)
		{
			__SASShowError(BX.message('SASErrorCurrentUserNotAuthorized'));
			return false;
		}
		else if (data["ERROR"].indexOf("SONET_MODULE_NOT_INSTALLED", 0) === 0)
		{
			__SASShowError(BX.message('SASErrorModuleNotInstalled'));
			return false;
		}
		else
		{
			__SASShowError(data["ERROR"]);
			return false;		
		}
	}
}
				
function __SASShowError(errorText) 
{
	__SASCloseWait();

	var errorPopup = new BX.PopupWindow('sas-error' + Math.random(), window, {
		autoHide: true,
		lightShadow: false,
		zIndex: 2,
		content: BX.create('DIV', {props: {'className': 'sonet-adminset-error-text-block'}, html: errorText}),
		closeByEsc: true,
		closeIcon: true
	});
	errorPopup.show();

}

function __SASShowWait(timeout)
{
	if (timeout !== 0)
	{
		return (waitTimeout = setTimeout(function(){
			__SASShowWait(0)
		}, 50));
	}

	if (!waitPopup)
	{
		waitPopup = new BX.PopupWindow('sas_wait', window, {
			autoHide: true,
			lightShadow: true,
			zIndex: 2,
			content: BX.create('DIV', {
				props: {
					className: 'sonet-adminset-wait-cont'
				},
				children: [
					BX.create('DIV', {
						props: {
							className: 'sonet-adminset-wait-icon'
						}
					}),
					BX.create('DIV', {
						props: {
							className: 'sonet-adminset-wait-text'
						},
						html: BX.message('SASWaitTitle')
					})
				]
			})
		});
	}
	else
		waitPopup.setBindElement(window);

	waitPopup.show();
}

function __SASCloseWait()
{
	if (waitTimeout)
	{
		clearTimeout(waitTimeout);
		waitTimeout = null;
	}

	if (waitPopup)
		waitPopup.close();
}
/* End */
;
; /* Start:"a:4:{s:4:"full";s:100:"/bitrix/components/bitrix/socialnetwork.user_groups/templates/.default/script.min.js?153494326410359";s:6:"source";s:80:"/bitrix/components/bitrix/socialnetwork.user_groups/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
BitrixSUG=function(){this.bLoadStarted=null;this.refreshUrl=null;this.mainFilterUsed=false;this.sortKey="alpha";this.project="N"};BitrixSUG.prototype.init=function(e){if(typeof e!="undefined"){this.refreshUrl=typeof e.refreshUrl!="undefined"?e.refreshUrl:top.location.href;this.project=typeof e.project!="undefined"&&e.project=="Y"?"Y":"N";if(typeof e.keyboardPageNavigation!="undefined"&&e.keyboardPageNavigation&&typeof e.navId!="undefined"){this.initKeyboardPageNavigation(e.navId)}}this.processNavigation();BX.addCustomEvent("BX.SonetGroupList.Filter:beforeApply",BX.delegate(function(e,t){this.showRefreshFade()},this));BX.addCustomEvent("BX.SonetGroupList.Filter:apply",BX.delegate(function(e,t,s){if(typeof s!="undefined"){s.autoResolve=false}this.refresh({useBXMainFilter:"Y"},t)},this));BX.addCustomEvent("BX.SonetGroupList.Filter:searchInput",BX.delegate(function(e){if(typeof e!="undefined"&&BX.util.trim(e).length>0){this.showRefreshFade()}else{this.hideRefreshFade()}},this));BX.addCustomEvent("SidePanel.Slider:onMessage",BX.delegate(function(e){if(e.getEventId()=="sonetGroupEvent"){var t=e.getData();if(BX.type.isNotEmptyString(t.code)&&t.code=="afterEdit"){BX.SocialnetworkUICommon.reload()}}},this))};BitrixSUG.prototype.sendRequest=function(e){if(typeof e=="undefined"||typeof e.groupId=="undefined"||parseInt(e.groupId)<=0){return false}if(typeof e.action=="undefined"||!BX.util.in_array(e.action,["REQUEST","FAVORITES"])){return false}var t={};if(e.action=="FAVORITES"){t.value=typeof e.value!="undefined"?e.value:"Y"}BX.ajax({url:"/bitrix/components/bitrix/socialnetwork.user_groups/ajax.php",method:"POST",dataType:"json",data:{sessid:BX.bitrix_sessid(),site:BX.message("SITE_ID"),groupId:parseInt(e.groupId),action:e.action,params:t},onsuccess:function(t){if(typeof t.SUCCESS!="undefined"){e.callback_success(t)}else{e.callback_failure(typeof t.ERROR!="undefined"?t.ERROR:BX("SONET_C33_T_F_REQUEST_ERROR"))}},onfailure:function(t){e.callback_failure(BX("SONET_C33_T_F_REQUEST_ERROR"))}});return false};BitrixSUG.prototype.showRequestWait=function(e){BX.addClass(e,"popup-window-button-wait")};BitrixSUG.prototype.closeRequestWait=function(e){BX.removeClass(e,"popup-window-button-wait")};BitrixSUG.prototype.setFavorites=function(e,t){if(BX(e)){var s=e.cloneNode();s.style.marginLeft="-"+e.offsetWidth+"px";e.parentNode.appendChild(s);new BX.easing({duration:200,start:{opacity:100,scale:100},finish:{opacity:0,scale:300},transition:BX.easing.transitions.linear,step:function(e){s.style.transform="scale("+e.scale/100+")";s.style.opacity=e.opacity/100},complete:function(){s.parentNode.removeChild(s)}}).animate();if(!!t){BX.addClass(e,"sonet-groups-group-title-favorites-active");BX.adjust(e,{attrs:{title:BX.message("SONET_C33_T_ACT_FAVORITES_REMOVE")}})}else{BX.removeClass(e,"sonet-groups-group-title-favorites-active");BX.adjust(e,{attrs:{title:BX.message("SONET_C33_T_ACT_FAVORITES_ADD")}})}}};BitrixSUG.prototype.setRequestSent=function(e,t,s){if(BX(e)){this.closeRequestWait(e);BX.addClass(e,"sonet-groups-group-btn-sent")}if(typeof s!="undefined"&&s=="Z"&&BX(t)){BX.addClass(t,"sonet-groups-group-desc-container-active")}};BitrixSUG.prototype.showRequestSent=function(e){if(BX(e)){BX.addClass(e,"sonet-groups-group-desc-container-active")}};BitrixSUG.prototype.showError=function(e){var t=new BX.PopupWindow("ug-error"+Math.random(),window,{autoHide:true,lightShadow:false,zIndex:2,content:BX.create("DIV",{props:{className:"sonet-groups-error-text-block"},html:BX.message("SONET_C33_T_F_REQUEST_ERROR").replace("#ERROR#",e)}),closeByEsc:true,closeIcon:true});t.show()};BitrixSUG.prototype.showSortMenu=function(e){BX.PopupMenu.destroy("bx-sonet-groups-sort-menu");BX.PopupMenu.show("bx-sonet-groups-sort-menu",e.bindNode,[{text:BX.message("SONET_C33_T_F_SORT_ALPHA"),onclick:BX.proxy(function(){this.selectSortMenuItem({text:BX.message("SONET_C33_T_F_SORT_ALPHA"),key:"alpha",valueNode:e.valueNode});BX.PopupMenu.destroy("bx-sonet-groups-sort-menu")},this)},parseInt(e.userId)==BX.message("USER_ID")&&parseInt(e.userId)>0?{text:BX.message("SONET_C33_T_F_SORT_DATE_REQUEST"),onclick:BX.proxy(function(){this.selectSortMenuItem({text:BX.message("SONET_C33_T_F_SORT_DATE_REQUEST"),key:"date_request",valueNode:e.valueNode});BX.PopupMenu.destroy("bx-sonet-groups-sort-menu")},this)}:null,parseInt(e.userId)==BX.message("USER_ID")&&parseInt(e.userId)>0?{text:BX.message("SONET_C33_T_F_SORT_DATE_VIEW"),onclick:BX.proxy(function(){this.selectSortMenuItem({text:BX.message("SONET_C33_T_F_SORT_DATE_VIEW"),key:"date_view",valueNode:e.valueNode});BX.PopupMenu.destroy("bx-sonet-groups-sort-menu")},this)}:null,e.showMembersCountItem?{text:BX.message("SONET_C33_T_F_SORT_MEMBERS_COUNT"),onclick:BX.proxy(function(){this.selectSortMenuItem({text:BX.message("SONET_C33_T_F_SORT_MEMBERS_COUNT"),key:"members_count",valueNode:e.valueNode});BX.PopupMenu.destroy("bx-sonet-groups-sort-menu")},this)}:null,{text:BX.message("SONET_C33_T_F_SORT_DATE_ACTIVITY"),onclick:BX.proxy(function(){this.selectSortMenuItem({text:BX.message("SONET_C33_T_F_SORT_DATE_ACTIVITY"),key:"date_activity",valueNode:e.valueNode});BX.PopupMenu.destroy("bx-sonet-groups-sort-menu")},this)},{text:BX.message("SONET_C33_T_F_SORT_DATE_CREATE"),onclick:BX.proxy(function(){this.selectSortMenuItem({text:BX.message("SONET_C33_T_F_SORT_DATE_CREATE"),key:"date_create",valueNode:e.valueNode});BX.PopupMenu.destroy("bx-sonet-groups-sort-menu")},this)}],{offsetLeft:100,offsetTop:0,lightShadow:false,angle:{position:"top",offset:50}});return false};BitrixSUG.prototype.selectSortMenuItem=function(e){this.setSortMenuItemText(e);var t=null;if(!BX.util.in_array(e.key,["alpha","date_request","date_view","members_count","date_activity","date_create"])){e.key="alpha"}this.sortKey=e.key;switch(e.key){case"alpha":t=BX.message("filterAlphaUrl");break;case"date_request":t=BX.message("filterDateRequestUrl");break;case"date_view":t=BX.message("filterDateViewUrl");break;case"members_count":t=BX.message("filterMembersCountUrl");break;case"date_activity":t=BX.message("filterDateActivityUrl");break;case"date_create":t=BX.message("filterDateCreateUrl");break;default:t=BX.message("filterAlphaUrl")}if(this.mainFilterUsed){t+="&useBXMainFilter=Y"}this.refresh({url:t})};BitrixSUG.prototype.setSortMenuItemText=function(e){BX(e.valueNode).innerHTML=e.text};BitrixSUG.prototype.refresh=function(e,t){if(this.bLoadStarted){return}var s=this.refreshUrl;if(typeof e!="undefined"&&typeof e.url!="undefined"){s=e.url;e.url=null}this.bLoadStarted=true;this.showRefreshFade();var o=typeof e!="undefined"&&typeof e.useBXMainFilter!="undefined"&&e.useBXMainFilter=="Y"||s.indexOf("&useBXMainFilter=Y")>=0;if(typeof e=="undefined"){e={}}e.order=this.sortKey;var r=BX.ajax.prepareData(e);if(r){s+=(s.indexOf("?")!==-1?"&":"?")+r}this.bLoadStarted=false;BX.ajax({url:s,method:"GET",dataType:"json",onsuccess:BX.delegate(function(e){this.bLoadStarted=false;this.hideRefreshFade();this.mainFilterUsed=o;if(typeof e!="undefined"&&typeof e.PROPS!="undefined"){if(t){t.fulfill()}var s=null;if(BX("sonet-groups-loader-loader-container")){s=BX("sonet-groups-loader-loader-container")}BX.cleanNode("sonet-groups-content-container",false);if(typeof e.PROPS.EMPTY!="undefined"&&e.PROPS.EMPTY=="Y"){BX.addClass(BX("sonet-groups-content-wrap"),"no-groups");BX("sonet-groups-content-container").appendChild(BX.create("DIV",{props:{id:"sonet-groups-list-container",className:"sonet-groups-list-container"},children:[BX.create("DIV",{props:{id:"sonet-groups-loader-container",className:"sonet-groups-loader-container"},html:'<svg class="sonet-groups-loader-circular" viewBox="25 25 50 50"><circle class="sonet-groups-loader-path" cx="50" cy="50" r="20" fill="none" stroke-miterlimit="10"></circle></svg>'}),BX.create("DIV",{props:{className:"sonet-groups-group-message"},children:[BX.create("DIV",{props:{className:"sonet-groups-group-message-text"},html:this.project=="Y"?BX.message("SONET_C36_T_NO_GROUPS_PROJECT"):BX.message("SONET_C36_T_NO_GROUPS")})]})]}))}else{BX.removeClass(BX("sonet-groups-content-wrap"),"no-groups")}if(s){BX("sonet-groups-list-container").appendChild(s)}if(typeof e.PROPS.CONTENT!="undefined"&&e.PROPS.CONTENT.length>0){this.processAjaxBlock(e.PROPS)}this.processNavigation()}else{if(t){t.reject()}this.showRefreshError()}},this),onfailure:BX.delegate(function(e){this.bLoadStarted=false;if(t){t.reject()}this.hideRefreshFade();this.showRefreshError()},this)});return false};BitrixSUG.prototype.showRefreshFade=function(){if(BX("sonet-groups-list-container")&&!BX.hasClass(BX("sonet-groups-list-container"),"sonet-groups-internal-mask")){BX.addClass(BX("sonet-groups-list-container"),"sonet-groups-internal-mask");var e=BX("sonet-groups-loader-container");if(e){BX.style(e,"display","block");BX.removeClass(e,"sonet-groups-hide-loader");setTimeout(function(){BX.addClass(e,"sonet-groups-show-loader")},0)}}};BitrixSUG.prototype.hideRefreshFade=function(){BX.removeClass(BX("sonet-groups-list-container"),"sonet-groups-internal-mask");var e=BX("sonet-groups-loader-container");if(e){BX.removeClass(e,"sonet-groups-show-loader");BX.addClass(e,"sonet-groups-hide-loader")}};BitrixSUG.prototype.showRefreshError=function(){};BitrixSUG.prototype.processAjaxBlock=function(e){if(!e){return}var t=false;var s=false;o();r();function o(){BX("sonet-groups-content-container").appendChild(BX.create("DIV",{props:{},html:e.CONTENT}));t=true;if(s){r()}}function r(){s=true;if(t){BX.ajax.processRequestData(e.CONTENT,{scriptsRunFirst:false,dataType:"HTML"})}}};BitrixSUG.prototype.initKeyboardPageNavigation=function(e){window.addEventListener("keydown",BX.delegate(function(t){if((t.ctrlKey||t.metaKey)&&[39,37].indexOf(t.keyCode)!==-1){var s=null;if(t.keyCode===39){s=BX(e+"_next_page")}if(t.keyCode===37){s=BX(e+"_previous_page")}if(s&&s.href){t.preventDefault();t.stopImmediatePropagation();this.refresh({url:s.href+"&refreshAjax=Y"})}}},this),true)};BitrixSUG.prototype.processNavigation=function(){var e=BX("sonet-groups-nav-container");if(!e){return}var t=BX.findChildren(e,{tagName:"a"},true);for(var s=0;s<t.length;s++){BX.bind(t[s],"click",BX.delegate(function(e){var t=e.currentTarget.href;if(t&&t.length>0){this.clickNavigation(t);e.preventDefault()}},this))}};BitrixSUG.prototype.clickNavigation=function(e){this.refresh({url:e+"&refreshAjax=Y"})};oSUG=new BitrixSUG;window.oSUG=oSUG;
/* End */
;; /* /bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?15349432642527*/
; /* /bitrix/components/bitrix/socialnetwork.user_groups/templates/.default/script.min.js?153494326410359*/
