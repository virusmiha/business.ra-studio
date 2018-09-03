
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
;
; /* Start:"a:4:{s:4:"full";s:106:"/bitrix/components/bitrix/socialnetwork.group_create.popup/templates/.default/script.min.js?15349432632594";s:6:"source";s:87:"/bitrix/components/bitrix/socialnetwork.group_create.popup/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
(function(){if(!!BX.SGCP){return}BX.SGCP={bInit:{},popup:null,params:{},pathToCreate:{},pathToEdit:{},pathToInvite:{}};BX.SGCP.Init=function(t){if(t){if(!t.NAME||t.NAME.length<=0){return}if(BX.SGCP.bInit[t.NAME]){return}BX.SGCP.params[t.NAME]=t;BX.SGCP.pathToCreate[t.NAME]=t.pathToCreate?t.pathToCreate+(t.pathToCreate.indexOf("?")==-1?"?":"&")+"IFRAME=Y&POPUP=Y&SONET=Y":"";BX.SGCP.pathToEdit[t.NAME]=t.pathToEdit?t.pathToEdit+(t.pathToEdit.indexOf("?")==-1?"?":"&")+"IFRAME=Y&POPUP=Y&SONET=Y":"";BX.SGCP.pathToInvite[t.NAME]=t.pathToInvite?t.pathToInvite+(t.pathToInvite.indexOf("?")==-1?"?":"&")+"IFRAME=Y&POPUP=Y&SONET=Y":"";BX.message(t["MESS"]);BX.SGCP.bInit[t.NAME]=true;BX.addCustomEvent("onSonetIframeCancelClick",function(){BX.SGCP.destroyPopup()});BX.addCustomEvent("onSonetIframeSuccess",function(){BX.SGCP.destroyPopup()})}};BX.SGCP.ShowForm=function(t,e,o){if(typeof e==="undefined"||e.length<=0){return BX.PreventDefault(o)}if(BX.SGCP.popup){BX.SGCP.popup.destroy()}var n=null;var p="";switch(t){case"create":n=BX.SGCP.pathToCreate[e];p=BX.message("SONET_SGCP_T_DO_CREATE_"+e);break;case"edit":n=BX.SGCP.pathToEdit[e];p=BX.message("SONET_SGCP_T_DO_EDIT_"+e);break;case"invite":n=BX.SGCP.pathToInvite[e];p=BX.message("SONET_SGCP_T_DO_INVITE_"+e);break;default:n=null}if(n&&n.length>0){var i=t==="invite"?"width:450px;height:230px":"width:600px;height: 650px";BX.SGCP.popup=new BX.PopupWindow("BXSGCP",null,{autoHide:false,zIndex:0,offsetLeft:0,offsetTop:0,overlay:true,lightShadow:true,draggable:{restrict:true},closeByEsc:true,titleBar:p,contentColor:"white",contentNoPaddings:true,closeIcon:{right:"12px",top:"10px"},buttons:[],content:'<div style="'+i+'"></div>',events:{onAfterPopupShow:function(){this.setContent('<div style="'+i+'">'+BX.message("SONET_SGCP_LOADING_"+e)+"</div>");BX.ajax.post(n,{lang:BX.message("LANGUAGE_ID"),site_id:BX.message("SITE_ID")||"",arParams:BX.SGCP.params[e]},BX.delegate(function(t){this.setContent(t);if(BX.SGCP.popup){setTimeout(function(){BX.SGCP.popup.adjustPosition()},100)}},this))},onPopupClose:function(){BX.SGCP.onPopupClose()}}});BX.SGCP.popup.params.zIndex=BX.WindowManager?BX.WindowManager.GetZIndex():0;BX.SGCP.popup.show()}BX.PreventDefault(o)};BX.SGCP.onPopupClose=function(){if(typeof BX.SocNetLogDestination!="undefined"){if(BX.SocNetLogDestination.popupWindow!=null){BX.SocNetLogDestination.popupWindow.close()}if(BX.SocNetLogDestination.popupSearchWindow!=null){BX.SocNetLogDestination.popupSearchWindow.close()}}};BX.SGCP.destroyPopup=function(){BX.SGCP.onPopupClose();if(BX.SGCP.popup!=null){BX.SGCP.popup.destroy()}}})();
/* End */
;
; /* Start:"a:4:{s:4:"full";s:97:"/bitrix/components/bitrix/main.interface.buttons/templates/.default/script.min.js?153494317840299";s:6:"source";s:77:"/bitrix/components/bitrix/main.interface.buttons/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
BX.namespace("BX.Main");if(typeof BX.Main.interfaceButtons==="undefined"){BX.Main.interfaceButtons=function(t,e){this.classItem="main-buttons-item";this.classItemSublink="main-buttons-item-sublink";this.classItemText="main-buttons-item-text";this.classItemCounter="main-buttons-item-counter";this.classItemIcon="main-buttons-item-icon";this.classItemMore="main-buttons-item-more";this.classOnDrag="main-buttons-drag";this.classDropzone="main-buttons-submenu-dropzone";this.classSeporator="main-buttons-submenu-separator";this.classHiddenLabel="main-buttons-hidden-label";this.classSubmenuItem="main-buttons-submenu-item";this.classItemDisabled="main-buttons-disabled";this.classItemOver="over";this.classItemActive="main-buttons-item-active";this.classSubmenu="main-buttons-submenu";this.classSecret="secret";this.classItemLocked="locked";this.submenuIdPrefix="main_buttons_popup_";this.childMenuIdPrefix="main_buttons_popup_child_";this.submenuWindowIdPrefix="menu-popup-";this.classSettingMenuItem="main-buttons-submenu-setting";this.classEditState="main-buttons-edit";this.classEditItemButton="main-buttons-item-edit-button";this.classDragItemButton="main-buttons-item-drag-button";this.classSettingsApplyButton="main-buttons-submenu-settings-apply";this.classSettingsResetButton="main-buttons-submenu-settings-reset";this.classSetHome="main-buttons-set-home";this.classSetHide="main-buttons-set-hide";this.classManage="main-buttons-manage";this.classContainer="main-buttons";this.classSubmenuNoHiddenItem="main-buttons-submenu-item-no-hidden";this.classDefaultSubmenuItem="menu-popup-item";this.classInner="main-buttons-inner-container";this.listContainer=null;this.pinContainer=null;this.dragItem=null;this.overItem=null;this.moreButton=null;this.messages=null;this.licenseParams=null;this.isSubmenuShown=false;this.isSubmenuShownOnDragStart=false;this.isSettingsEnabled=true;this.containerId=e.containerId;this.tmp={};this.init(t,e);return{getItemById:BX.delegate(this.getItemById,this),getAllItems:BX.delegate(this.getAllItems,this),getHiddenItems:BX.delegate(this.getHiddenItems,this),getVisibleItems:BX.delegate(this.getVisibleItems,this),getDisabledItems:BX.delegate(this.getDisabledItems,this),getMoreButton:BX.delegate(this.getMoreButton,this),adjustMoreButtonPosition:BX.delegate(this.adjustMoreButtonPosition,this),showSubmenu:BX.delegate(this.showSubmenu,this),closeSubmenu:BX.delegate(this.closeSubmenu,this),refreshSubmenu:BX.delegate(this.refreshSubmenu,this),getCurrentSettings:BX.delegate(this.getCurrentSettings,this),saveSettings:BX.delegate(this.saveSettings,this),setCounterValueByItemId:BX.delegate(this.setCounterValueByItemId,this),getCounterValueByItemId:BX.delegate(this.getCounterValueByItemId,this),updateCounter:BX.delegate(this.updateCounter,this),getActive:BX.delegate(this.getActive,this),isEditEnabled:BX.delegate(this.isEditEnabled,this),isActiveInMoreMenu:BX.delegate(this.isActiveInMoreMenu,this),isSettingsEnabled:this.isSettingsEnabled,classes:{item:this.classItem,itemText:this.classItemText,itemCounter:this.classItemCounter,itemIcon:this.classItemIcon,itemDisabled:this.classItemDisabled,itemOver:this.classItemOver,itemActive:this.classItemActive,itemLocked:this.classItemLocked,submenu:this.classSubmenu,submenuItem:this.classSubmenuItem,containerOnDrag:this.classOnDrag,classSettingMenuItem:this.classSettingMenuItem},itemsContainer:this.listContainer,itemsContainerId:this.listContainer.id}};BX.Main.interfaceButtons.prototype={init:function(t,e){this.listContainer=BX(this.getId());if(!BX.type.isPlainObject(e)){throw"BX.MainButtons: params is not Object"}if(!("containerId"in e)||!BX.type.isNotEmptyString(e.containerId)){throw"BX.MainButtons: containerId not set in params"}if(!BX.type.isDomNode(this.listContainer)){throw"BX.MainButtons: #"+e.containerId+" is not dom node"}if("classes"in e&&BX.type.isPlainObject(e.classes)){this.setCustomClasses(e.classes)}if("messages"in e&&BX.type.isPlainObject(e.messages)){this.setMessages(e.messages)}if("licenseWindow"in e&&BX.type.isPlainObject(e.licenseWindow)){this.setLicenseWindowParams(e.licenseWindow)}if("disableSettings"in e&&e.disableSettings==="true"){this.isSettingsEnabled=false;this.visibleControlMoreButton()}this.moreButton=this.getMoreButton();this.listChildItems={};if(this.isSettingsEnabled){this.dragAndDropInit()}this.adjustMoreButtonPosition();this.bindOnClickOnMoreButton();this.bindOnScrollWindow();this.setContainerHeight();BX.bind(this.getContainer(),"click",BX.delegate(this._onDocumentClick,this));BX.addCustomEvent("onPullEvent-main",BX.delegate(this._onPush,this));this.updateMoreButtonCounter();if(this.isActiveInMoreMenu()){this.activateItem(this.moreButton)}var i=this.getVisibleItems();var s=BX.type.isArray(i)&&i.length>0?i[0]:null;var n=BX.Buttons.Utils.getByTag(s,"a");if(!BX.type.isDomNode(n)){return}var a=n.getAttribute("href");if(a.charAt(0)==="?"){a=n.pathname+n.search}if(!this.lastHomeLink){this.lastHomeLink=a}this.bindOnResizeFrame()},_onDocumentClick:function(t){var e=this.getItem(t);var i,s,n,a,o,u;if(this.isDragButton(t.target)){t.preventDefault();t.stopPropagation()}if(BX.type.isDomNode(e)){if(this.isSettings(e)){this.enableEdit();BX.hide(this.getSettingsButton());BX.show(this.getSettingsApplyButton());return false}if(this.isApplySettingsButton(e)){t.preventDefault();t.stopPropagation();this.disableEdit();BX.show(this.getSettingsButton());BX.hide(this.getSettingsApplyButton());return false}if(this.isResetSettingsButton(e)){this.resetSettings();return false}if(this.isLocked(e)){t.preventDefault();this.showLicenseWindow();return false}if(this.isEditButton(t.target)){var r,h;t.preventDefault();t.stopPropagation();if(this.isSubmenuItem(e)){e=this.getItemAlias(e)}try{r=JSON.parse(BX.data(e,"item"))}catch(t){}h=this.getItemEditMenu();if(h&&h.popupWindow.isShown()&&this.lastEditNode===e){h.popupWindow.close()}else{this.showItemEditMenu(r,t.target)}this.lastEditNode=e;return false}if(this.isSetHide(e)){o=this.getVisibleItems();u=BX.type.isArray(o)?o.length:null;a=this.editItemData.ID.replace(this.listContainer.id+"_","");s=this.getItemById(a);n=this.getItemAlias(s);s=this.isVisibleItem(s)?s:n;if(this.isDisabled(n)){this.enableItem(n)}else if(!this.isDisabled(n)&&u>2){this.disableItem(n)}if(u===2){BX.onCustomEvent(window,"BX.Main.InterfaceButtons:onHideLastVisibleItem",[s,this])}this.refreshSubmenu();this.saveSettings();this.adjustMoreButtonPosition();if(this.isEditEnabled()){this.enableEdit();BX.hide(this.getSettingsButton());BX.show(this.getSettingsApplyButton())}this.editMenu.popupWindow.close();return false}if(this.isSetHome(e)){a=this.editItemData.ID.replace(this.listContainer.id+"_","");s=this.getItemById(a);n=this.getItemAlias(s);if(this.isDisabled(n)){this.enableItem(n)}this.listContainer.insertBefore(s,BX.firstChild(this.listContainer));this.adjustMoreButtonPosition();this.refreshSubmenu();this.saveSettings();if(this.isEditEnabled()){this.enableEdit();BX.hide(this.getSettingsButton());BX.show(this.getSettingsApplyButton())}this.editMenu.popupWindow.close();return false}if(!this.isSublink(t.target)){i=this.dataValue(e,"onclick");if(BX.type.isNotEmptyString(i)){t.preventDefault();this.execScript(i)}}}if(this.isEditEnabled()){this.getSubmenu().popupWindow.setAutoHide(false)}},isActiveInMoreMenu:function(){var t=this.getHiddenItems();var e=this.getDisabledItems();var i=t.concat(e);return i.some(function(t){var e;try{e=JSON.parse(BX.data(t,"item"))}catch(t){}return BX.type.isPlainObject(e)&&("IS_ACTIVE"in e&&e.IS_ACTIVE===true||e.IS_ACTIVE==="true"||e.IS_ACTIVE==="Y")},this)},_onPush:function(t,e){if(t==="user_counter"&&e&&BX.message("SITE_ID")in e){var i=e[BX.message("SITE_ID")];for(var s in i){if(i.hasOwnProperty(s)){this.updateCounter(s,i[s])}}}},bindOnScrollWindow:function(){BX.bind(window,"scroll",BX.delegate(this._onScroll,this))},getActive:function(){var t=this.getAllItems();var e,i;var s=null;if(BX.type.isArray(t)){t.forEach(function(t){try{e=JSON.parse(BX.data(t,"item"))}catch(t){e=null}if(BX.type.isPlainObject(e)&&"IS_ACTIVE"in e&&(e.IS_ACTIVE===true||e.IS_ACTIVE==="true"||e.IS_ACTIVE==="Y")){s=e}},this)}if(BX.type.isPlainObject(s)){i=BX(s.ID);if(BX.type.isDomNode(i)){s.NODE=i}else{s.NODE=null}}return s},isSetHome:function(t){return BX.hasClass(t,this.classSetHome)},isSetHide:function(t){return BX.hasClass(t,this.classSetHide)},getSettingsButton:function(){return BX.Buttons.Utils.getByClass(this.getSubmenuContainer(),this.classSettingMenuItem)},getSettingsApplyButton:function(){return BX.Buttons.Utils.getByClass(this.getSubmenuContainer(),this.classSettingsApplyButton)},isApplySettingsButton:function(t){return BX.hasClass(t,this.classSettingsApplyButton)},enableEdit:function(){var t=this.getSubmenu();if(t&&"popupWindow"in t){t.popupWindow.setAutoHide(false)}BX.addClass(this.listContainer,this.classEditState);BX.addClass(this.getSubmenuContainer(),this.classEditState);this.isEditEnabledState=true},disableEdit:function(){var t=this.getSubmenu();if(t&&"popupWindow"in t){t.popupWindow.setAutoHide(true)}BX.removeClass(this.listContainer,this.classEditState);BX.removeClass(this.getSubmenuContainer(),this.classEditState);this.isEditEnabledState=false},isEditEnabled:function(){return this.isEditEnabledState},showItemEditMenu:function(t,e){if(BX.type.isPlainObject(t)&&"ID"in t){var i=[this.listContainer.id,"_edit_item"].join("");var s=BX.PopupMenu.getMenuById(i);if(s){BX.PopupMenu.destroy(i)}s=this.createItemEditMenu(t,i,e);s.popupWindow.show()}},getContainer:function(){if(!BX.type.isDomNode(this.container)){this.container=BX(this.containerId).parentNode}return this.container},getItemEditMenu:function(){return BX.PopupMenu.getMenuById([this.listContainer.id,"_edit_item"].join(""))},createItemEditMenu:function(t,e,i){var s;var n=[{text:this.message("MIB_SET_HOME"),className:"main-buttons-set-home menu-popup-no-icon"}];var a=t.ID.replace(this.listContainer.id+"_","");var o=this.getItemById(a);if(this.isDisabled(o)){n.push({text:this.message("MIB_SET_SHOW"),className:"main-buttons-set-hide menu-popup-no-icon"})}else{n.push({text:this.message("MIB_SET_HIDE"),className:"main-buttons-set-hide menu-popup-no-icon"})}var u=BX.pos(i);var r={menuId:e,anchor:i,menuItems:n,settings:{autoHide:true,offsetTop:0,offsetLeft:u.width/2,zIndex:20,angle:{position:"top",offset:u.width/2}}};s=BX.PopupMenu.create(r.menuId,r.anchor,r.menuItems,r.settings);if(this.isVisibleItem(o)){t.NODE=o}else{t.NODE=this.getItemAlias(o)}this.editItemData=t;if("menuItems"in s&&BX.type.isArray(s.menuItems)){s.menuItems.forEach(function(t){BX.bind(t.layout.item,"click",BX.delegate(this._onDocumentClick,this))},this)}BX.onCustomEvent(window,"BX.Main.InterfaceButtons:onBeforeCreateEditMenu",[s,t,this]);this.editMenu=s;return s},setHome:function(){var t=this.getVisibleItems();var e=BX.type.isArray(t)&&t.length>0?t[0]:null;var i=BX.Buttons.Utils.getByTag(e,"a");if(!BX.type.isDomNode(i)){return}var s=i.getAttribute("href");if(s.charAt(0)==="?"){s=i.pathname+i.search}if(!this.lastHomeLink){this.lastHomeLink=s}if(this.lastHomeLink!==s){BX.userOptions.save("ui",this.listContainer.id,"firstPageLink",s);BX.onCustomEvent("BX.Main.InterfaceButtons:onFirstItemChange",[s,e])}this.lastHomeLink=s},isEditButton:function(t){return BX.hasClass(t,this.classEditItemButton)},isDragButton:function(t){return BX.hasClass(t,this.classDragItemButton)},isResetSettingsButton:function(t){return BX.hasClass(t,this.classSettingsResetButton)},getContainerHeight:function(){var t=this.getAllItems().map(function(t){var e=getComputedStyle(t);return BX.height(t)+parseInt(e.marginTop)+parseInt(e.marginBottom)});return Math.max.apply(Math,t)},setContainerHeight:function(){var t=this.getContainerHeight();BX.height(this.listContainer,t)},setLicenseWindowParams:function(t){this.licenseParams=t||{}},message:function(t){var e;try{e=this.messages[t]}catch(t){e=""}return e},setCustomClasses:function(t){if(!BX.type.isPlainObject(t)){return}this.classItem=t.item||this.classItem;this.classItemSublink=t.itemSublink||this.classItemSublink;this.classItemText=t.itemText||this.classItemText;this.classItemCounter=t.itemCounter||this.classItemCounter;this.classItemIcon=t.itemIcon||this.classItemIcon;this.classItemMore=t.itemMore||this.classItemMore;this.classItemOver=t.itemOver||this.classItemOver;this.classItemActive=t.itemActive||this.classItemActive;this.classItemDisabled=t.itemDisabled||this.classItemDisabled;this.classOnDrag=t.onDrag||this.classOnDrag;this.classDropzone=t.dropzone||this.classDropzone;this.classSeporator=t.separator||this.classSeporator;this.classSubmenuItem=t.submenuItem||this.classSubmenuItem;this.classSubmenu=t.submenu||this.classSubmenu;this.classSecret=t.secret||this.classSecret;this.classItemLocked=t.itemLocked||this.classItemLocked},setMessages:function(t){if(!BX.type.isPlainObject(t)){return}this.messages=t},makeFullItemId:function(t){if(!BX.type.isNotEmptyString(t)){return}return[this.listContainer.id,t.replace("-","_")].join("_")},getItemById:function(t){var e=null;var i;if(BX.type.isNotEmptyString(t)){i=this.makeFullItemId(t);e=BX.Buttons.Utils.getBySelector(this.listContainer,"#"+i)}return e},getItemCounterObject:function(t){var e=null;if(BX.type.isDomNode(t)){e=BX.Buttons.Utils.getByClass(t,this.classItemCounter)}return e},setCounterValue:function(t,e){var i=this.getItemCounterObject(t);if(BX.type.isDomNode(i)){i.innerText=e>99?"99+":e>0?e:"";t.dataset.counter=e}this.updateMoreButtonCounter()},updateCounter:function(t,e){if(t.indexOf("crm")===0&&e<0){return}var i,s,n;var a=null;var o=this.getAllItems();if(BX.type.isArray(o)){o.forEach(function(e){try{s=JSON.parse(BX.data(e,"item"))}catch(t){s={}}if(BX.type.isPlainObject(s)&&"COUNTER_ID"in s&&s.COUNTER_ID===t){a=e}},this)}i=this.getItemCounterObject(a);if(BX.type.isDomNode(i)){a=this.getItem(i);i.innerText=e>99?"99+":e>0?e:"";a.dataset.counter=e}n=this.getItemAlias(a);if(BX.type.isDomNode(n)){i=this.getItemCounterObject(n);if(BX.type.isDomNode(i)){i.innerText=e>99?"99+":e>0?e:"";n.dataset.counter=e}}this.updateMoreButtonCounter()},setCounterValueByItemId:function(t,e){var i=e!==null?parseFloat(e):null;var s,n;if(!BX.type.isNotEmptyString(t)){throw"Bad first arg. Need string as item id"}if(i!==null&&!BX.type.isNumber(i)){throw"Bad two arg. Need number counter value - Integer, Float or string with number"}s=this.getItemById(t);if(!BX.type.isDomNode(s)){console.info("Not found node with id #"+t);return}n=this.getItemAlias(s);this.setCounterValue(s,i);this.setCounterValue(n,i)},getCounterValueByItemId:function(t){var e,i;var s=NaN;if(!BX.type.isNotEmptyString(t)){throw"Bad first arg. Need string item id"}else{e=this.getItemById(t);s=this.dataValue(e,"counter");s=parseFloat(s);if(!BX.type.isNumber(s)){i=this.getItemCounterObject(e);s=parseFloat(i.innerText)}}return s},setMoreButtonCounter:function(t){var e=this.getItemCounterObject(this.moreButton);var i=t>99?"99+":t>0?t:"";i=parseInt(i);i=BX.type.isNumber(i)?i:"";e.innerText=i},bindOnClickOnMoreButton:function(){BX.bind(this.moreButton,"click",BX.delegate(this._onClickMoreButton,this))},bindOnResizeFrame:function(){window.frames["maininterfacebuttonstmpframe-"+this.getId()].onresize=BX.throttle(this._onResizeHandler,20,this)},getId:function(){return BX.Buttons.Utils.getByClass(this.getContainer(),this.classInner).id},getAllItems:function(){return BX.Buttons.Utils.getByClass(this.listContainer,this.classItem,true)},getVisibleItems:function(){var t=this.getAllItems();var e=this;var i=[];if(t&&t.length){i=t.filter(function(t){return e.isVisibleItem(t)&&!e.isDisabled(t)})}return i},getHiddenItems:function(){var t=this.getAllItems();var e=[];var i=this;if(t&&t.length){e=t.filter(function(t){return!i.isVisibleItem(t)&&!i.isDisabled(t)})}return e},getDisabledItems:function(){return this.getAllItems().filter(function(t){return this.isDisabled(t)},this)},getMoreButton:function(){var t=null;this.getAllItems().forEach(function(e){!t&&BX.hasClass(e,this.classItemMore)&&(t=e)},this);return t},getLastVisibleItem:function(){var t=this.getVisibleItems();var e=null;if(BX.type.isArray(t)&&t.length){e=t[t.length-1]}if(!BX.type.isDomNode(e)){e=null}return e},adjustMoreButtonPosition:function(){var t=this.getLastVisibleItem();var e=this.isMoreButton(t);if(!e){this.listContainer.insertBefore(this.moreButton,t)}this.updateMoreButtonCounter()},getSubmenuId:function(t){var e="";if(BX.type.isDomNode(this.listContainer)&&BX.type.isNotEmptyString(this.listContainer.id)){e=this.submenuIdPrefix+this.listContainer.id}if(t){e=this.submenuWindowIdPrefix+e}return e},getChildMenuId:function(){var t="";if(BX.type.isDomNode(this.listContainer)&&BX.type.isNotEmptyString(this.listContainer.id)){t=this.childMenuIdPrefix+this.listContainer.id}return t},getSubmenuItemText:function(t){var e,i,s;if(!BX.type.isDomNode(t)){return null}e=this.findChildrenByClassName(t,this.classItemText);i=this.findChildrenByClassName(t,this.classItemCounter);if(BX.type.isDomNode(i)&&BX.type.isDomNode(e)){i.dataset.counter=this.dataValue(t,"counter");s=e.outerHTML+i.outerHTML}else{e=this.dataValue(t,"text");i=this.dataValue(t,"counter");s=e}return s},getChildMenuItemText:function(t){var e,i,s;if(!BX.type.isDomNode(t)){return null}e=this.findChildrenByClassName(t,this.classItemText);i=this.findChildrenByClassName(t,this.classItemCounter);if(BX.type.isDomNode(i)&&BX.type.isDomNode(e)){i.dataset.counter=this.dataValue(t,"counter");s=e.outerHTML+i.outerHTML}else{e=this.dataValue(t,"text");s=e}return s},getLockedClass:function(t){var e="";if(BX.type.isDomNode(t)&&this.isLocked(t)){e=this.classItemLocked}return e},getSubmenuItems:function(){var t=this.getAllItems();var e=this.getHiddenItems();var i=this.getDisabledItems();var s=[];var n,a;if(t.length){t.forEach(function(t){if(e.indexOf(t)===-1&&i.indexOf(t)===-1){s.push({text:this.getSubmenuItemText(t),href:this.dataValue(t,"url"),onclick:this.dataValue(t,"onclick"),title:t.getAttribute("title"),className:[this.classSubmenuItem,this.getIconClass(t),this.classSecret,this.getAliasLink(t),this.getLockedClass(t)].join(" ")})}},this)}if(e.length){e.forEach(function(t){try{n=JSON.parse(this.dataValue(t,"item"))}catch(t){n=null}a=[this.classSubmenuItem,this.getIconClass(t),this.getAliasLink(t),this.getLockedClass(t)];if(BX.type.isPlainObject(n)&&("IS_ACTIVE"in n&&n.IS_ACTIVE===true||n.IS_ACTIVE==="true"||n.IS_ACTIVE==="Y")){a.push(this.classItemActive)}s.push({text:this.getSubmenuItemText(t),href:this.dataValue(t,"url"),onclick:this.dataValue(t,"onclick"),title:t.getAttribute("title"),className:a.join(" "),items:this.getChildMenuItems(t)})},this)}if(this.isSettingsEnabled){s.push({text:"<span>"+this.message("MIB_HIDDEN")+"</span>",className:[this.classSeporator,this.classSubmenuItem,this.classHiddenLabel].join(" ")});if(!i.length){s.push({text:"<span>"+this.message("MIB_NO_HIDDEN")+"</span>",className:[this.classSubmenuItem,this.classSubmenuNoHiddenItem].join(" ")})}if(i.length){i.forEach(function(t){try{n=JSON.parse(this.dataValue(t,"item"))}catch(t){n=null}a=[this.classSubmenuItem,this.classItemDisabled,this.getIconClass(t),this.getAliasLink(t),this.getLockedClass(t)];if(BX.type.isPlainObject(n)&&("IS_ACTIVE"in n&&n.IS_ACTIVE===true||n.IS_ACTIVE==="true"||n.IS_ACTIVE==="Y")){a.push(this.classItemActive)}s.push({text:this.getSubmenuItemText(t),href:this.dataValue(t,"url"),onclick:this.dataValue(t,"onclick"),title:t.getAttribute("title"),className:a.join(" "),items:this.getChildMenuItems(t)})},this)}s.push({text:"<span>"+this.message("MIB_MANAGE")+"</span>",className:[this.classSeporator,this.classSubmenuItem,this.classHiddenLabel,this.classManage].join(" ")});s.push({text:this.message("MIB_SETTING_MENU_ITEM"),className:[this.classSettingMenuItem,this.classSubmenuItem].join(" ")});s.push({text:this.message("MIB_APPLY_SETTING_MENU_ITEM"),className:[this.classSettingsApplyButton,this.classSubmenuItem].join(" ")});s.push({text:this.message("MIB_RESET_SETTINGS"),className:[this.classSettingsResetButton,this.classSubmenuItem].join(" ")})}return s},getChildMenuItems:function(t){var e;try{e=JSON.parse(this.dataValue(t,"item"))}catch(t){e=null}if(!BX.type.isPlainObject(e)){return[]}if(!BX.type.isArray(this.listChildItems[t.id])){var i={};this.setListAllItems(i,e);var s=this.getListItems(i,"");if(s.length){this.listChildItems[t.id]=BX.type.isArray(s[0].items)?s[0].items:[]}}return this.listChildItems[t.id]},setListAllItems:function(t,e){var i=[];if(BX.type.isPlainObject(e)){i.push(e)}else{i=e}i.forEach(function(e){t[e["ID"].replace(this.containerId+"_","")]=e;if(BX.type.isArray(e["ITEMS"])){this.setListAllItems(t,e["ITEMS"])}},this)},getListItems:function(t,e){var i=[];for(var s in t){if(!t.hasOwnProperty(s)){continue}var n=t[s];if(n["PARENT_ID"]===e){var a,o={text:n["TEXT"],href:n["URL"],onclick:n["ON_CLICK"],title:n["TITLE"]};a=this.getListItems(t,s);if(a.length){o.items=a}i.push(o);delete t[s]}}return i},getSubmenuArgs:function(){var t=this.getSubmenuId();var e=this.moreButton;var i=BX.pos(e);var s=this.getSubmenuItems();var n={autoHide:true,offsetLeft:i.width/2-80,angle:{position:"top",offset:100},zIndex:0,events:{onPopupClose:BX.delegate(this._onSubmenuClose,this)}};return[t,e,s,n]},getChildMenuArgs:function(t){var e=this.getChildMenuId();var i=this.getChildMenuItems(t);if(!i||BX.type.isArray(i)&&!i.length){return[]}var s={autoHide:true,angle:true,offsetLeft:t.getBoundingClientRect().width/2};return[e,t,i,s]},visibleControlMoreButton:function(){var t=this.getHiddenItems();if(!t.length||t.length===1&&this.isMoreButton(t[0])){this.getMoreButton().style.display="none"}else{this.getMoreButton().style.display=""}},createSubmenu:function(){var t=BX.PopupMenu.create.apply(BX.PopupMenu,this.getSubmenuArgs());if(this.isSettingsEnabled){this.dragAndDropInitInSubmenu()}t.menuItems.forEach(function(t){BX.bind(t.layout.item,"click",BX.delegate(this._onDocumentClick,this))},this);return t},createChildMenu:function(t){return BX.PopupMenu.create.apply(BX.PopupMenu,this.getChildMenuArgs(t))},showSubmenu:function(){var t=this.getSubmenu();if(t!==null){t.popupWindow.show()}else{this.destroySubmenu();t=this.createSubmenu();t.popupWindow.show()}this.setSubmenuShown(true);this.activateItem(this.moreButton);if(this.isEditEnabled()){t.popupWindow.setAutoHide(false)}},showChildMenu:function(t){var e=BX.PopupMenu.getMenuById(this.getChildMenuId()),i=null;if(e&&e.bindElement){if(e.bindElement.id!==t.id){this.destroyChildMenu(t);i=this.createChildMenu(t);i.popupWindow.show()}else{e.popupWindow.show()}}else{this.destroyChildMenu(t);i=this.createChildMenu(t);i.popupWindow.show()}},closeSubmenu:function(){var t=this.getSubmenu();if(t===null){return}t.popupWindow.close();if(!this.isActiveInMoreMenu()){this.deactivateItem(this.moreButton)}this.setSubmenuShown(false)},closeChildMenu:function(t){var e=this.getChildMenu(t);if(e===null){return}e.popupWindow.close()},getSubmenu:function(){return BX.PopupMenu.getMenuById(this.getSubmenuId())},getChildMenu:function(){return BX.PopupMenu.getMenuById(this.getChildMenuId())},destroySubmenu:function(){BX.PopupMenu.destroy(this.getSubmenuId())},destroyChildMenu:function(){BX.PopupMenu.destroy(this.getChildMenuId())},refreshSubmenu:function(){var t=this.getSubmenu();var e;if(t===null){return}e=this.getSubmenuArgs();if(BX.type.isArray(e)){this.destroySubmenu();this.createSubmenu();this.showSubmenu()}},setSubmenuShown:function(t){this.isSubmenuShown=false;if(BX.type.isBoolean(t)){this.isSubmenuShown=t}},activateItem:function(t){if(!BX.type.isDomNode(t)){return}if(!BX.hasClass(t,this.classItemActive)){BX.addClass(t,this.classItemActive)}},deactivateItem:function(t){if(!BX.type.isDomNode(t)){return}if(BX.hasClass(t,this.classItemActive)){BX.removeClass(t,this.classItemActive)}},getCurrentSettings:function(){var t={};this.getAllItems().forEach(function(e,i){t[e.id]={sort:i,isDisabled:this.isDisabled(e)}},this);return t},saveSettings:function(){var t=this.getCurrentSettings();var e="settings";var i;if(!BX.type.isPlainObject(t)){return}if(BX.type.isDomNode(this.listContainer)){if("id"in this.listContainer){i=this.listContainer.id;t=JSON.stringify(t);BX.userOptions.save("ui",i,e,t);this.setHome()}}},resetSettings:function(){var t=null;var e=BX.PopupWindowManager.create(this.listContainer.id+"_reset_popup",null,{content:this.message("MIB_RESET_ALERT"),autoHide:false,overlay:true,closeByEsc:true,closeIcon:true,draggable:{restrict:true},titleBar:this.message("MIB_RESET_SETTINGS"),buttons:[t=new BX.PopupWindowButton({text:this.message("MIB_RESET_BUTTON"),className:"popup-window-button-create",events:{click:function(){if(BX.hasClass(t.buttonNode,"popup-window-button-wait")){return}BX.addClass(t.buttonNode,"popup-window-button-wait");this.handleResetSettings(function(i){if(i){BX.removeClass(t.buttonNode,"popup-window-button-wait");e.setContent(i)}else{var s="settings";BX.userOptions.save("ui",this.listContainer.id,s,JSON.stringify({}));BX.userOptions.save("ui",this.listContainer.id,"firstPageLink","");window.location.reload()}}.bind(this))}.bind(this)}}),new BX.PopupWindowButtonLink({text:this.message("MIB_CANCEL_BUTTON"),className:"popup-window-button-link-cancel",events:{click:function(){this.popupWindow.close()}}})]});e.show()},handleResetSettings:function(t){var e=[];BX.onCustomEvent("BX.Main.InterfaceButtons:onBeforeResetMenu",[e,this]);var i=new BX.Promise;var s=i;for(var n=0;n<e.length;n++){i=i.then(e[n])}i.then(function(e){t(null,e)},function(e){t(e,null)});s.fulfill()},moveButtonAlias:function(t){var e,i;if(!t||!this.dragItem){return}e=this.getItemAlias(this.dragItem);i=this.getItemAlias(t);if(this.isListItem(e)){if(!i){this.listContainer.appendChild(e)}else{this.listContainer.insertBefore(e,i)}}},moveButton:function(t){var e;if(!BX.type.isDomNode(t)||!BX.type.isDomNode(this.dragItem)){return}if(this.isListItem(t)){if(this.isDisabled(this.dragItem)){this.dragItem.dataset.disabled="false"}if(BX.type.isDomNode(t)){this.listContainer.insertBefore(this.dragItem,t)}else{this.listContainer.appendChild(this.dragItem)}}if(this.isSubmenuItem(t)){if(this.isDisabled(this.dragItem)&&!this.isDisabled(t)){this.enableItem(this.dragItem)}e=this.getSubmenuContainer();e.insertBefore(this.dragItem,t)}},getSubmenuContainer:function(){var t=this.getSubmenu();var e=null;if(t!==null){e=t.itemsContainer}return e},findNextSiblingByClass:function(t,e){var i=t;for(;!!t;t=t.nextElementSibling){if(e){if(BX.hasClass(t,e)&&t!==i){return t}}else{return null}}},findParentByClassName:function(t,e){for(;t&&t!==document;t=t.parentNode){if(e){if(BX.hasClass(t,e)){return t}}else{return null}}},findChildrenByClassName:function(t,e){var i=null;if(BX.type.isDomNode(t)&&BX.type.isNotEmptyString(e)){i=BX.Buttons.Utils.getByClass(t,e)}return i},dragAndDropInit:function(){this.getAllItems().forEach(function(t,e){if(!this.isSeparator(t)&&!this.isSettings(t)&&!this.isApplySettingsButton(t)&&!this.isResetSettingsButton(t)){t.setAttribute("draggable","true");t.setAttribute("tabindex","-1");t.dataset.link="item"+e;BX.bind(t,"dragstart",BX.delegate(this._onDragStart,this));BX.bind(t,"dragend",BX.delegate(this._onDragEnd,this));BX.bind(t,"dragenter",BX.delegate(this._onDragEnter,this));BX.bind(t,"dragover",BX.delegate(this._onDragOver,this));BX.bind(t,"dragleave",BX.delegate(this._onDragLeave,this));BX.bind(t,"drop",BX.delegate(this._onDrop,this))}BX.bind(t,"mouseover",BX.delegate(this._onMouse,this));BX.bind(t,"mouseout",BX.delegate(this._onMouse,this))},this)},dragAndDropInitInSubmenu:function(){var t=this.getSubmenu();var e=t.menuItems;e.forEach(function(t){if(!this.isSeparator(t.layout.item)&&!this.isSettings(t.layout.item)&&!this.isApplySettingsButton(t.layout.item)&&!this.isResetSettingsButton(t.layout.item)){t.layout.item.draggable=true;t.layout.item.dataset.sortable=true;BX.bind(t.layout.item,"dragstart",BX.delegate(this._onDragStart,this));BX.bind(t.layout.item,"dragenter",BX.delegate(this._onDragEnter,this));BX.bind(t.layout.item,"dragover",BX.delegate(this._onDragOver,this));BX.bind(t.layout.item,"dragleave",BX.delegate(this._onDragLeave,this));BX.bind(t.layout.item,"dragend",BX.delegate(this._onDragEnd,this));BX.bind(t.layout.item,"drop",BX.delegate(this._onDrop,this))}if(BX.hasClass(t.layout.item,this.classHiddenLabel)&&!BX.hasClass(t.layout.item,this.classManage)){BX.bind(t.layout.item,"dragover",BX.delegate(this._onDragOver,this))}},this)},getItem:function(t){if(!BX.type.isDomNode(t)){if(!t||!BX.type.isDomNode(t.target)){return null}}else{t={target:t}}var e=this.findParentByClassName(t.target,this.classItem);if(!BX.type.isDomNode(e)){e=this.findParentByClassName(t.target,this.classDefaultSubmenuItem)}return e},setOpacity:function(t){if(!BX.type.isDomNode(t)){return}BX.style(t,"opacity",".1")},unsetOpacity:function(t){if(!BX.type.isDomNode(t)){return}BX.style(t,"opacity","1")},setDragStyles:function(){BX.addClass(this.listContainer,this.classOnDrag);BX.addClass(BX(this.getSubmenuId(true)),this.classOnDrag);this.setOpacity(this.dragItem)},unsetDragStyles:function(){var t=this.getSubmenu();this.getAllItems().forEach(function(t){this.unsetOpacity(t);BX.removeClass(t,"over")},this);if(t&&"menuItems"in t&&BX.type.isArray(t.menuItems)&&t.menuItems.length){t.menuItems.forEach(function(t){this.unsetOpacity(t);BX.removeClass(t.layout.item,"over")},this)}BX.removeClass(this.listContainer,this.classOnDrag);BX.removeClass(BX(this.getSubmenuId(true)),this.classOnDrag)},getIconClass:function(t){var e="";if(BX.type.isDomNode(t)&&"dataset"in t&&"class"in t.dataset&&BX.type.isNotEmptyString(t.dataset.class)){e=t.dataset.class}return e},disableItem:function(t){var e=this.getItemAlias(t);if(t&&"dataset"in t){t.dataset.disabled="true";if(e){e.dataset.disabled="true"}}},enableItem:function(t){var e;if(!BX.type.isDomNode(t)){return}if(this.isSubmenuItem(t)){BX.removeClass(t,this.classItemDisabled);e=this.getItemAlias(t);if(BX.type.isDomNode(e)){e.dataset.disabled="false"}}},getAliasLink:function(t){return this.dataValue(t,"link")||""},getItemAlias:function(t){var e=null;if(!BX.type.isDomNode(t)){return e}var i=this.getAllItems();var s=this.isSubmenuItem(t);var n=this.isListItem(t);if(!s&&!n){return e}if(s){i.forEach(function(i){BX.hasClass(t,this.getAliasLink(i))&&(e=i)},this)}if(n){e=BX.Buttons.Utils.getByClass(document,this.getAliasLink(t))}return e},hideItem:function(t){!!t&&BX.addClass(t,this.classSecret)},showItem:function(t){!!t&&BX.removeClass(t,this.classSecret)},fakeDragItem:function(){var t=null;if(!BX.type.isDomNode(this.dragItem)||!BX.type.isDomNode(this.overItem)){return}if(this.isDragToSubmenu()){t=this.getItemAlias(this.dragItem);if(t!==this.dragItem){this.listContainer.appendChild(this.dragItem);this.dragItem=t;this.showItem(this.dragItem);this.adjustMoreButtonPosition();this.updateSubmenuItems();this.tmp.moved=false;this.tmp.movetToSubmenu=true;this.setOpacity(this.dragItem)}}if(this.isDragToList()&&!this.tmp.movetToSubmenu){t=this.getItemAlias(this.dragItem);if(t!==this.dragItem){this.hideItem(this.dragItem);this.dragItem=t;this.adjustMoreButtonPosition();this.updateSubmenuItems();this.setOpacity(this.dragItem)}}this.tmp.movetToSubmenu=false},updateSubmenuItems:function(){var t=this.getHiddenItems();var e=this.getDisabledItems();var i=this;var s=[];var n,a,o;n=this.getSubmenu();if(n===null){return}a=n.menuItems;if(!BX.type.isArray(a)||!a.length){return}s=e.concat(t);a.forEach(function(t){o=[].some.call(s,function(e){return BX.hasClass(t.layout.item,i.dataValue(e,"link"))||i.isDisabled(t.layout.item)||i.isSeparator(t.layout.item)||i.isDropzone(t.layout.item)});if(o||(i.isSettings(t.layout.item)||i.isApplySettingsButton(t.layout.item)||i.isResetSettingsButton(t.layout.item)||i.isNotHiddenItem(t.layout.item)||i.isSeparator(t.layout.item)||t.layout.item===i.dragItem)&&!i.isMoreButton(t.layout.item)){i.showItem(t.layout.item)}else{i.hideItem(t.layout.item)}})},isNotHiddenItem:function(t){return BX.hasClass(t,this.classSubmenuNoHiddenItem)},getNotHidden:function(){return BX.Buttons.Utils.getByClass(this.getSubmenuContainer(),this.classSubmenuNoHiddenItem)},setOverStyles:function(t){if(BX.type.isDomNode(t)&&!BX.hasClass(t,this.classItemOver)){BX.addClass(t,this.classItemOver)}},unsetOverStyles:function(t){if(BX.type.isDomNode(t)&&BX.hasClass(t,this.classItemOver)){BX.removeClass(t,this.classItemOver)}},dataValue:function(t,e){var i="";var s;if(BX.type.isDomNode(t)){s=BX.data(t,e);if(typeof s!=="undefined"){i=s}}return i},execScript:function(script){if(BX.type.isNotEmptyString(script)){eval(script)}},showLicenseWindow:function(){var t;if(!B24.licenseInfoPopup){return}t=B24.licenseInfoPopup;t.init({B24_LICENSE_BUTTON_TEXT:this.message("MIB_LICENSE_BUY_BUTTON"),B24_TRIAL_BUTTON_TEXT:this.message("MIB_LICENSE_TRIAL_BUTTON"),IS_FULL_DEMO_EXISTS:this.licenseParams.isFullDemoExists,HOST_NAME:this.licenseParams.hostname,AJAX_URL:this.licenseParams.ajaxUrl,LICENSE_ALL_PATH:this.licenseParams.licenseAllPath,LICENSE_DEMO_PATH:this.licenseParams.licenseDemoPath,FEATURE_GROUP_NAME:this.licenseParams.featureGroupName,AJAX_ACTIONS_URL:this.licenseParams.ajaxActionsUrl,B24_FEATURE_TRIAL_SUCCESS_TEXT:this.message("MIB_LICENSE_WINDOW_TRIAL_SUCCESS_TEXT")});t.show("main-buttons",this.message("MIB_LICENSE_WINDOW_HEADER_TEXT"),this.message("MIB_LICENSE_WINDOW_TEXT"))},_onDragStart:function(t){var e=this.getVisibleItems();var i=BX.type.isArray(e)?e.length:null;this.dragItem=this.getItem(t);if(!BX.type.isDomNode(this.dragItem)){return}if(i===2&&this.isListItem(this.dragItem)){t.preventDefault();BX.onCustomEvent(window,"BX.Main.InterfaceButtons:onHideLastVisibleItem",[this.dragItem,this]);return}if(this.isMoreButton(this.dragItem)||this.isSeparator(this.dragItem)||this.isNotHiddenItem(this.dragItem)){t.preventDefault();return}this.isSubmenuShownOnDragStart=!!this.isSubmenuShown;if(this.isListItem(this.dragItem)){this.showSubmenu()}this.setDragStyles();if(!this.isEditEnabled()){this.enableEdit()}},_onDragEnd:function(t){t.preventDefault();var e=this.getItem(t);var i,s;if(!BX.type.isDomNode(e)){return}this.unsetDragStyles();if(!this.isSubmenuShownOnDragStart){this.refreshSubmenu();if(!this.isEditEnabled()){this.closeSubmenu()}}else{this.refreshSubmenu()}i=BX.findNextSibling(this.dragItem,BX.delegate(function(t){return this.isVisibleItem(t)},this));s=BX.findPreviousSibling(this.dragItem,BX.delegate(function(t){return this.isVisibleItem(t)},this));if(BX.type.isDomNode(s)&&(BX.hasClass(s,this.classHiddenLabel)||this.isDisabled(s)&&this.isSubmenuItem(s))||(BX.type.isDomNode(i)&&BX.hasClass(i,this.classManage)||this.isDisabled(i)&&this.isSubmenuItem(i))){this.disableItem(this.dragItem);this.refreshSubmenu()}if(this.isEditEnabled()){this.enableEdit();BX.show(this.getSettingsApplyButton());BX.hide(this.getSettingsButton())}else{this.disableEdit();BX.hide(this.getSettingsApplyButton());BX.show(this.getSettingsButton())}this.updateMoreButtonCounter();this.saveSettings();this.dragItem=null;this.overItem=null;this.tmp.moved=false},updateMoreButtonCounter:function(){var t,e,i,s;t=this.getHiddenItems();s=this.getDisabledItems();t=t.concat(s);e=0;if(BX.type.isArray(t)){t.forEach(function(t){e+=parseInt(this.dataValue(t,"counter"))||0},this)}if(BX.type.isNumber(e)){this.setMoreButtonCounter(e)}},_onDragEnter:function(t){var e=this.getItem(t);if(BX.type.isDomNode(e)&&this.isNotHiddenItem(e)){this.setOverStyles(e)}},_onDragOver:function(t){t.preventDefault();var e=null;this.overItem=this.getItem(t);if(!BX.type.isDomNode(this.overItem)||!BX.type.isDomNode(this.dragItem)||this.overItem===this.dragItem||this.isNotHiddenItem(this.overItem)){return}this.fakeDragItem();if(this.isNext(t)&&this.isGoodPosition(t)&&!this.isMoreButton(this.overItem)){e=this.findNextSiblingByClass(this.overItem,this.classItem);if(this.isMoreButton(e)&&!this.tmp.moved){e=e.previousElementSibling;this.tmp.moved=true}if(!BX.type.isDomNode(e)){e=this.findNextSiblingByClass(this.overItem,this.classSubmenuItem)}if(BX.type.isDomNode(e)){this.moveButton(e);this.moveButtonAlias(e);this.adjustMoreButtonPosition();this.updateSubmenuItems()}}if(!this.isNext(t)&&this.isGoodPosition(t)&&!this.isMoreButton(this.overItem)||!this.isGoodPosition(t)&&this.isMoreButton(this.overItem)&&this.getVisibleItems().length===1){this.moveButton(this.overItem);this.moveButtonAlias(this.overItem);this.adjustMoreButtonPosition();this.updateSubmenuItems()}},_onDragLeave:function(t){var e=this.getItem(t);if(BX.type.isDomNode(e)){this.unsetOverStyles(t.target)}},_onDrop:function(t){var e=this.getItem(t);if(!BX.type.isDomNode(e)){return}if(this.isNotHiddenItem(e)||this.isDisabled(e)){this.disableItem(this.dragItem);this.adjustMoreButtonPosition()}this.unsetDragStyles();t.preventDefault()},getIndex:function(t,e){return[].indexOf.call(t||[],e)},_onSubmenuClose:function(){this.setSubmenuShown(false);if(this.isEditEnabled()){this.activateItem(this.moreButton)}else{if(!this.isActiveInMoreMenu()){this.deactivateItem(this.moreButton)}}},_onResizeHandler:function(){this.adjustMoreButtonPosition();this.updateSubmenuItems();if(!this.isSettingsEnabled){this.visibleControlMoreButton()}},_onClickMoreButton:function(t){t.preventDefault();this.showSubmenu()},_onMouse:function(t){var e=this.getItem(t);if(t.type==="mouseover"&&!BX.hasClass(e,this.classItemOver)){if(!BX.hasClass(e,this.classItemMore)){this.showChildMenu(e)}BX.addClass(e,this.classItemOver)}if(t.type==="mouseout"&&BX.hasClass(e,this.classItemOver)){BX.removeClass(e,this.classItemOver)}},getSettingsResetButton:function(){return BX.Buttons.Utils.getByClass(this.getSubmenuContainer(),this.classSettingsResetButton)},_onScroll:function(){if(BX.style(this.pinContainer,"position")==="fixed"){this.closeSubmenu()}},isDisabled:function(t){var e=false;if(BX.type.isDomNode(t)){e=this.dataValue(t,"disabled")==="true"||BX.hasClass(t,this.classItemDisabled)}return e},isSettings:function(t){var e=false;if(BX.type.isDomNode(t)){e=BX.hasClass(t,this.classSettingMenuItem)}return e},isLocked:function(t){var e=false;if(BX.type.isDomNode(t)){e=this.dataValue(t,"locked")==="true"||BX.hasClass(t,this.classItemLocked)}return e},isDropzone:function(t){return BX.hasClass(t,this.classDropzone)},isNext:function(t){var e=this.dragItem.getBoundingClientRect();var i=this.overItem.getBoundingClientRect();var s=getComputedStyle(this.dragItem);var n=parseInt(s.marginRight.replace("px",""));var a=null;if(this.isListItem(this.overItem)){a=t.clientX>i.left-n&&t.clientX>e.right}if(this.isSubmenuItem(this.overItem)){a=t.clientY>e.top}return a},isGoodPosition:function(t){var e=this.overItem;var i,s;if(!BX.type.isDomNode(e)){return false}i=e.getBoundingClientRect();if(this.isListItem(e)){s=this.isNext(t)&&t.clientX>=i.left+i.width/2||!this.isNext(t)&&t.clientX<=i.left+i.width/2}if(this.isSubmenuItem(e)){s=this.isNext(t)&&t.clientY>=i.top+i.height/2||!this.isNext(t)&&t.clientY<=i.top+i.height/2}return s},isSubmenuItem:function(t){return BX.hasClass(t,this.classSubmenuItem)},isVisibleItem:function(t){if(!BX.type.isDomNode(t)){return false}return t.offsetTop===0},isMoreButton:function(t){var e=false;if(BX.type.isDomNode(t)&&BX.hasClass(t,this.classItemMore)){e=true}return e},isListItem:function(t){var e=false;if(BX.type.isDomNode(t)&&BX.hasClass(t,this.classItem)){e=true}return e},isSublink:function(t){var e=false;if(BX.type.isDomNode(t)){e=BX.hasClass(t,this.classItemSublink)}return e},isSeparator:function(t){var e=false;if(BX.type.isDomNode(t)){e=BX.hasClass(t,this.classSeporator)}return e},isDragToSubmenu:function(){return!this.isSubmenuItem(this.dragItem)&&this.isSubmenuItem(this.overItem)},isDragToList:function(){return this.isSubmenuItem(this.dragItem)&&!this.isSubmenuItem(this.overItem)}}}if(typeof BX.Main.interfaceButtonsManager==="undefined"){BX.Main.interfaceButtonsManager={data:{},init:function(t){var e=null;if(!BX.type.isPlainObject(t)||!("containerId"in t)){throw"BX.Main.interfaceButtonsManager: containerId not set in params Object"}e=BX(t.containerId);if(BX.type.isDomNode(e)){this.data[t.containerId]=new BX.Main.interfaceButtons(e,t)}else{BX(BX.delegate(function(){e=BX(t.containerId);if(!BX.type.isDomNode(e)){throw"BX.Main.interfaceButtonsManager: container is not dom node"}this.data[t.containerId]=new BX.Main.interfaceButtons(e,t)},this))}},getById:function(t){var e=null;if(BX.type.isString(t)&&BX.type.isNotEmptyString(t)){try{e=this.data[t]}catch(t){}}return e},getObjects:function(){return this.data}}}
/* End */
;
; /* Start:"a:4:{s:4:"full";s:94:"/bitrix/components/bitrix/main.interface.buttons/templates/.default/utils.min.js?1534943178575";s:6:"source";s:76:"/bitrix/components/bitrix/main.interface.buttons/templates/.default/utils.js";s:3:"min";s:80:"/bitrix/components/bitrix/main.interface.buttons/templates/.default/utils.min.js";s:3:"map";s:80:"/bitrix/components/bitrix/main.interface.buttons/templates/.default/utils.map.js";}"*/
(function(){"use strict";BX.namespace("BX.Buttons");BX.Buttons.Utils={getByClass:function(e,t,l){var n=[];if(t){n=(e||document.body).getElementsByClassName(t);if(!l){n=n.length?n[0]:null}else{n=[].slice.call(n)}}return n},getByTag:function(e,t,l){var n=[];if(t){n=(e||document.body).getElementsByTagName(t);if(!l){n=n.length?n[0]:null}else{n=[].slice.call(n)}}return n},getBySelector:function(e,t,l){var n=[];if(t){if(!l){n=(e||document.body).querySelector(t)}else{n=(e||document.body).querySelectorAll(t);n=[].slice.call(n)}}return n}}})();
/* End */
;
; /* Start:"a:4:{s:4:"full";s:97:"/bitrix/components/bitrix/socialnetwork.message_form/templates/.default/script.js?153494326413038";s:6:"source";s:81:"/bitrix/components/bitrix/socialnetwork.message_form/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
if (typeof oForumForm != "object")	
	var oForumForm = {};

var MessageMax = 64000;

function quoteMessageEx(author, mid)
{
	if (typeof document.forms["REPLIER"] == "object")
	{
		init_form(document.forms["REPLIER"]);
		oForumForm[document.forms["REPLIER"].id].quote(author, mid);
	}
}

function emoticon(theSmilie) // 
{
	return;
}

/* Form functions */
function init_form(form)
{
	if (typeof(form) != "object")
		return false;
	if (typeof(oForumForm[form.id]) != "object")
	{
		oForumForm[form.id] = new PostForm(form);
		oForumForm[form.id].Init(form);
	}
	return;
}

function PostForm()
{
	this.open = {"B" : 0, "I" : 0, "U" : 0, "CODE" : 0, "QUOTE" : 0, "FONT" : 0, "COLOR" : 0};
	this.tags =  {
		"B" : "simple_tag", "I" : "simple_tag", "U" : "simple_tag", 
		"CODE" : "simple_tag", "QUOTE" : "simple_tag", 
		"FONT" : "simple_tag", "COLOR" : "simple_tag",
		"CLOSE" : "closeall",
		"URL" : "tag_url", "IMG" : "tag_image", "LIST" : "tag_list",
		"TRANSLIT" : "translit"};
	this.b = {"translit" : 0};
	this.str = {"translit" : ""};
	this.stack = [];
	this.form = false;
	t = this;
	
	this.Init = function(form)
	{
		if (this.form)
			return true;
		if (typeof(form) != "object")
			return false;
		this.form = form;
		/* Simple tags */ 
		for (var res in this.tags)
		{
			if (this.form[res])
			{
				if (res == "FONT" || res == "COLOR")
					this.form[res].onchange = new Function("t." + this.tags[res] + "(this);");
				else if (res == "CLOSE")
				{
					this.form[res].onclick = new Function("t." + this.tags[res] + "(this);");
					this.form[res].onmouseover = function(){this.style.textDecoration = "underline"; t.show_hints(this.name)};
					this.form[res].onmouseout = function(){this.style.textDecoration = "none";};
				}
				else
				{
					this.form[res].onclick = new Function("t." + this.tags[res] + "(this);");
					this.form[res].onmouseover = function(){t.show_hints(this.name)};
				}
				if (this.form[res].accessKey)
				{
					var title = "";
					var userAgent = navigator.userAgent.toLowerCase();
					var is_nav = ((userAgent.indexOf('mozilla')!=-1) && (userAgent.indexOf('spoofer')==-1)
					 && (userAgent.indexOf('compatible') == -1) && (userAgent.indexOf('opera')==-1)
					 && (userAgent.indexOf('webtv')==-1) && (userAgent.indexOf('hotjava')==-1));
					 
					var is_win = ((userAgent.indexOf("win")!=-1) || (userAgent.indexOf("16bit") != -1));
					var is_mac = (userAgent.indexOf("mac")!=-1);
					
					var title = this.form[res].title;
					if (is_win)
					{
						if (is_nav)
						{
							title = this.form[res].title.replace(/alt/, "shift+alt");
							oHelp[res] = oHelp[res].replace(/alt/, "shift+alt");
						}
						else if (!jsUtils.IsIE())
						{
							title = this.form[res].title.replace(/\([^)]+\)/, "");
							oHelp[res] = oHelp[res].replace(/\([^)]+\)/, "");
						}
					}
					else
					{
						if ((jsUtils.IsIE() || is_nav) && is_mac)
						{
							title = this.form[res].title.replace(/alt/, "ctrl");
							oHelp[res] = oHelp[res].replace(/alt/, "ctrl");
						}
						else
						{
							title = this.form[res].title.replace(/\([^)]+\)/, "");
							oHelp[res] = oHelp[res].replace(/\([^)]+\)/, "");
						}
					}
					
					this.form[res].title = title;
				}
			}
		}
		var image = this.form.getElementsByTagName("img");
		if (image && typeof image == "object" && image.length > 0)
		{
			for (var ii = 0; ii < image.length; ii++ )
			{
				if (image[ii].className != "smiles")
				{
					image[ii].onclick = function(){t.emoticon(this)};
				}
			}
		}
		this.form["POST_MESSAGE"].onselect = function(){ t.store_caret(this)};
		this.form["POST_MESSAGE"].onclick = function(){ t.store_caret(this)};
		this.form["POST_MESSAGE"].onkeyup = function(){ t.store_caret(this)};
		return true;
	}, 
	
	this.Insert = function (ibTag, ibClsTag, isSingle, postText)
	{
		if (!this.form || !this.form["POST_MESSAGE"])
			return false;

		var textarea = this.form["POST_MESSAGE"];
		var isClose = (isSingle ? true : false);
		postText = (postText == null ? "" : postText);
		
		if (jsUtils.IsIE() || jsUtils.IsOpera())
		{
			textarea.focus();
			var sel = document.selection;
			var rng = sel.createRange();
			rng.collapse;
			if ((sel.type == "Text" || sel.type == "None") && rng != null)
			{
				if (ibClsTag != "" && rng.text.length > 0)
				{
					ibTag += rng.text + ibClsTag;
					isClose = false;
				}
				else if (postText.length > 0)
				{
					ibTag += postText + ibClsTag;
					isClose = false;
				}
				rng.text = ibTag;
			}
		}
		else if (document.getElementById)
		{
			var text = {"start" : ibTag, "end" : ""}
			if (ibClsTag != "" && textarea.selectionEnd > textarea.selectionStart)
			{
				text["end"] = ibClsTag;
				isClose = false;
			}
			else if (postText.length > 0)
			{
				text["start"] += postText + ibClsTag;
				isClose = false;
			}
			
			var sel = {
				"start" : textarea.selectionStart,
				"end" : textarea.selectionEnd};
			
			if (sel["end"] == 1 || sel["end"] == 2)
				sel["end"] = textarea.textLength;
		
			var s1 = (textarea.value).substring(0, sel["start"]);
			var s2 = (textarea.value).substring(sel["start"], sel["end"])
			var s3 = (textarea.value).substring(sel["end"], textarea.textLength);
			
			textarea.value = s1 + text["start"] + s2 + text["end"] + s3;
			textarea.selectionEnd = sel["end"] + text["start"].length + text["end"].length;
		} 
		else
		{
			textarea.value += ibTag;
		}
		textarea.focus();
		return isClose;
	},
	
	this.show_hints = function(msg)
	{
		this.form['helpbox'].value = oHelp[msg];
	},
	
	this.store_caret = function()
	{
		if (this.form["POST_MESSAGE"].createTextRange) 
			this.form["POST_MESSAGE"].caretPos = document.selection.createRange().duplicate();
	},
	
	this.emoticon = function(element)
	{
		this.Insert(" " + element.id + " ", "", false);
	},
	
	this.tag_image = function()
	{
		var need_loop = true;
		do 
		{
			var res = prompt(oText['enter_image'], "http://");
			if (res == null)
			{
				need_loop = false;
				return false;
			}
			else if (res.length <= 0)
			{
				alert("Error! " + oErrors['no_url']);
			}
			else
			{
				need_loop = false;
			}
		}
		while(need_loop);
		this.Insert("[IMG]" + res + "[/IMG]", "", false);
	},
	
	this.tag_list = function()
	{ 
		var thelist = "[LIST]\n";
		
		var need_loop = true;
		do 
		{
			var res = prompt(oText['list_prompt'], "");
			if (res == null)
			{
				need_loop = false;
				return false;
			}
			else if (res.length <= 0)
			{
				need_loop = false;
			}
			else
			{
				thelist = thelist + "[*]" + res + "\n";
			}
		}
		while(need_loop);
		this.Insert(thelist + "[/LIST]\n", "", false);
	},
	
	this.closeall = function()
	{
		var res = false;
		while(res = this.stack.pop())
		{
			this.Insert("[/" + res + "]");
			this.form[res].value = res;
			this.open[res]--;
		}
		this.update_counts();
	},
	
	this.tag_url = function( )
	{
		var FoundErrors = '';
		var need_loop = true;
		var oFields = {
			"URL" : {
				"text" : oText['enter_url'],
				"default" : "http://",
				"error" : oErrors['no_url'],
				"value" : ""}, 
			"TITLE" : {
				"text" : oText['enter_url_name'],
				"default" : "My Webpage",
				"error" : oErrors['no_title'],
				"value" : ""}};

		for (var ii in oFields)
		{
			need_loop = true;
			do 
			{
				var res = prompt(oFields[ii]["text"], oFields[ii]["default"]);
				if (res == null)
				{
					need_loop = false;
					return false;
				}
				else if (res.length <= 0)
				{
					alert("Error! " + oFields[ii]["error"]);
				}
				else
				{
					oFields[ii]["value"] = res;
					need_loop = false;
				}
			}
			while(need_loop);
		}
		
		this.Insert("[URL=" + oFields["URL"]["value"] + "]" + oFields["TITLE"]["value"] + "[/URL]", "", false);
	},
	
	this.simple_tag = function(element)
	{
		var tag_name = element.name;
		var tag_start = tag_name;
		if (tag_name == 'FONT' || tag_name == 'COLOR')
			tag_start += "=" + element.value;

		if ((t.open[tag_name] == 0) && t.Insert("[" + tag_start + "]", "[/" + tag_name + "]", true))
		{
			t.open[tag_name]++;
			element.value += "*";
			t.stack.push(tag_name);
			t.show_hints('CLOSE_CLICK')
		}
		else
		{
			var stack_need_insert = [];
			var tag_is_open = false;
			var res = false;
			while (res = t.stack.pop())
			{
				stack_need_insert.unshift(res);
				if (res == tag_name)
				{
					tag_is_open = true;
					break;
				}
			}
			if (!tag_is_open)
				t.stack = stack_need_insert;
			var res = false;
			while (res = stack_need_insert.pop())
			{
				t.Insert("[/" + res + "]", "", false);
				t.form[res].value = res;
				t.open[res]--;
			}
		}
		
		t.update_counts();
	},
	
	this.update_counts = function()
	{
		t.form['tagcount'].value = t.stack.length;
	},
	
	this.storeCaret = function (textEl)
	{
		if (textEl.createTextRange) 
			textEl.caretPos = document.selection.createRange().duplicate();
	},

	this.translit = function()
	{
		var i;
		var objTextarea = this.form['POST_MESSAGE'];
		var textbody = objTextarea.value;
		var selected = false;
		
		if ((jsUtils.IsIE() || jsUtils.IsOpera()) && (objTextarea.isTextEdit))
		{
			objTextarea.focus();
			var sel = document.selection;
			var rng = sel.createRange();
			rng.colapse;
			if (sel.type=="Text" && rng != null)
			{
				textbody = rng.text;
				selected = true;
			}
		}
		else if (document.getElementById)
		{
			if (objTextarea.selectionEnd > objTextarea.selectionStart)
			{
				var selEnd = objTextarea.selectionEnd;
				if (selEnd == 0)
					selEnd = objTextarea.textLength;
				var startText = (objTextarea.value).substring(0, objTextarea.selectionStart);
				textbody = (objTextarea.value).substring(objTextarea.selectionStart, selEnd);
				var endText = (objTextarea.value).substring(selEnd, objTextarea.textLength);
				selected = true;
			}
		}
		
		if (textbody)
		{
			if (this.b["translit"] == 0)
			{
				for (i=0; i<capitEngLettersReg.length; i++) textbody = textbody.replace(capitEngLettersReg[i], capitRusLetters[i]);
				for (i=0; i<smallEngLettersReg.length; i++) textbody = textbody.replace(smallEngLettersReg[i], smallRusLetters[i]);
			}
			else
			{
				for (i=0; i<capitRusLetters.length; i++) textbody = textbody.replace(capitRusLettersReg[i], capitEngLetters[i]);
				for (i=0; i<smallRusLetters.length; i++) textbody = textbody.replace(smallRusLettersReg[i], smallEngLetters[i]);
			}
			if (!selected) 
			{
				objTextarea.value = textbody;
			}
			else 
			{
				if ((jsUtils.IsIE() || jsUtils.IsOpera()) && (objTextarea.isTextEdit))
				{
					rng.text = textbody;
				}
				else
				{
					objTextarea.value = startText + textbody + endText;
					objTextarea.selectionEnd = startText.length + textbody.length;
				}
			}
		}
		if (this.b["translit"]==0)
		{
			this.str["translit"] = this.form['TRANSLIT'].value;
			this.form['TRANSLIT'].value = oText['translit_en'];
			this.b["translit"] = 1;
		}
		else
		{
			this.form['TRANSLIT'].value = this.str["translit"];
			this.b["translit"] = 0;
		}
		objTextarea.focus();	
	},
	
	this.quote = function (author, mid)
	{
		var selection = "";
		var message_id = 0;
		if (document.getSelection)
		{
			selection = document.getSelection();
			selection = selection.replace(/\r\n\r\n/gi, "_newstringhere_");
			selection = selection.replace(/\r\n/gi, " ");
			selection = selection.replace(/  /gi, "");
			selection = selection.replace(/_newstringhere_/gi, "\r\n\r\n");
		}
		else
		{
			selection = document.selection.createRange().text;
		}
		
		if (selection == "")
		{
			message = mid.replace(/message_text_/gi, "");
			if (parseInt(message) > 0)
			{
				message = document.getElementById(mid);
				if (typeof(message) == "object" && message)
				{
					selection = message.innerHTML;
					selection = selection.replace(/\<br(\s)*(\/)*\>/gi, "\n");
					selection = selection.replace(/\<[^\>]+\>/gi, "");
					selection = selection.replace(/&lt;/gi, "<");
					selection = selection.replace(/&gt;/gi, ">");
					selection = selection.replace(/&quot;/gi, "\"");
				}
				else
				{
					selection = 'is not object';
				}
			}
			else if (mid.Length() > 0)
			{
				selection = mid;
			}
		}
		
		if (selection != "")
		{
			selection = selection.replace(/\&shy;/gi, "");
			selection = author + oText['author'] + selection;
			this.Insert("[QUOTE]", "[/QUOTE]", false, selection);
		}
	}

}

function ValidateForm(form)
{
	if (typeof form != "object" || typeof form.POST_MESSAGE != "object")
		return false;
		
	var errors = "";
	var MessageLength = form.POST_MESSAGE.value.length;

	if (form.SONET_USER_ID && (form.SONET_USER_ID.value.length <= 0))
 		errors += oErrors['no_topic_recip'];

	if (MessageLength < 2)
		errors += oErrors['no_message'];
    else if ((MessageMax != 0) && (MessageLength > MessageMax))
		errors += oErrors['max_len1'] + MessageMax + oErrors['max_len2'] + MessageLength;

	if (errors != "")
	{
		alert(errors);
		return false;
	}
	
	var arr = form.getElementsByTagName("input");
	for (var i=0; i < arr.length; i++)
	{
		var butt = arr[i];
		if (butt.getAttribute("type") == "submit")
			butt.disabled = true;
	}
	return true;
}


PostFormIsLoad = true;

/* End */
;; /* /bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?15349432642527*/
; /* /bitrix/components/bitrix/socialnetwork.user_groups/templates/.default/script.min.js?153494326410359*/
; /* /bitrix/components/bitrix/socialnetwork.group_create.popup/templates/.default/script.min.js?15349432632594*/
; /* /bitrix/components/bitrix/main.interface.buttons/templates/.default/script.min.js?153494317840299*/
; /* /bitrix/components/bitrix/main.interface.buttons/templates/.default/utils.min.js?1534943178575*/
; /* /bitrix/components/bitrix/socialnetwork.message_form/templates/.default/script.js?153494326413038*/

//# sourceMappingURL=page_99a594c56442ef8b4f80e84a60b0762b.map.js