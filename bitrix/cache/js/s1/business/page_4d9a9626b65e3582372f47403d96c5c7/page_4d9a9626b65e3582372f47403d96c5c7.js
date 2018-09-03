
; /* Start:"a:4:{s:4:"full";s:94:"/bitrix/components/bitrix/socialnetwork.group_menu/templates/.default/script.js?15349432634504";s:6:"source";s:79:"/bitrix/components/bitrix/socialnetwork.group_menu/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
var SGMWaitDiv = null;
var SGMWaitPopup = null;
var SGMWaitTimeout = null;
var SGMWaitTime = 500;

var SGMNotifyHintPopup = null;
var SGMotifyHintTimeout = null;
var SGMotifyHintTime = 3000;

function __SGMSetSubscribe(groupID, event)
{
	__SGMShowWait();

	var action = (!BX.hasClass(BX("group_menu_subscribe_button"), "profile-menu-notify-btn-active") ? "set" : "unset");

	BX.ajax({
		url: '/bitrix/components/bitrix/socialnetwork.group_menu/ajax.php',
		method: 'POST',
		dataType: 'json',
		data: {
			'groupID': parseInt(groupID),
			'action': (action == 'set' ? 'set' : 'unset'), 
			'sessid': BX.bitrix_sessid() 
		},
		onsuccess: function(data) { __SGMProcessAJAXResponse(data); }
	});
	BX.PreventDefault(event);
}

function __SGMProcessAJAXResponse(data)
{
	if (data["SUCCESS"] != undefined && data["SUCCESS"] == "Y")
	{
		__SGMCloseWait();

		var button = BX("group_menu_subscribe_button", true);
		if (button)
		{
			if (data["RESULT"] != undefined && data["RESULT"] == "N")
			{
				__SGMShowNotifyHint(button, BX.message('SGMSubscribeButtonHintOff'));
				BX.adjust(button, { attrs : {title : BX.message('SGMSubscribeButtonTitleOff')} });
				BX.removeClass(button, "profile-menu-notify-btn-active");
			}
			else
			{
				__SGMShowNotifyHint(button, BX.message('SGMSubscribeButtonHintOn'));
				BX.adjust(button, { attrs : {title : BX.message('SGMSubscribeButtonTitleOn')} });
				BX.addClass(button, "profile-menu-notify-btn-active");
			}
		}

		return false;
	}
	else if (data["ERROR"] != undefined && data["ERROR"].length > 0)
	{
		if (data["ERROR"].indexOf("SESSION_ERROR", 0) === 0)
		{
			__SGMShowError(BX.message('SGMErrorSessionWrong'));
			return false;
		}
		else if (data["ERROR"].indexOf("CURRENT_USER_NOT_AUTH", 0) === 0)
		{
			__SGMShowError(BX.message('SGMErrorCurrentUserNotAuthorized'));
			return false;
		}
		else if (data["ERROR"].indexOf("SONET_MODULE_NOT_INSTALLED", 0) === 0)
		{
			__SGMShowError(BX.message('SGMErrorModuleNotInstalled'));
			return false;
		}
		else
		{
			__SGMShowError(data["ERROR"]);
			return false;		
		}
	}
}
				
function __SGMShowError(errorText) 
{
	__SGMCloseWait();

	var errorPopup = new BX.PopupWindow('sgm-error' + Math.random(), window, {
		autoHide: true,
		lightShadow: false,
		zIndex: 2,
		content: BX.create('DIV', {props: {'className': 'sonet-sgm-error-text-block'}, html: errorText}),
		closeByEsc: true,
		closeIcon: true
	});
	errorPopup.show();

}

function __SGMShowWait(timeout)
{
	if (timeout !== 0)
	{
		return (SGMWaitTimeout = setTimeout(function(){
			__SGMShowWait(0)
		}, 50));
	}

	if (!SGMWaitPopup)
	{
		SGMWaitPopup = new BX.PopupWindow('sgm_wait', window, {
			autoHide: true,
			lightShadow: true,
			zIndex: 2,
			content: BX.create('DIV', {
				props: {
					className: 'sonet-sgm-wait-cont'
				},
				children: [
					BX.create('DIV', {
						props: {
							className: 'sonet-sgm-wait-icon'
						}
					}),
					BX.create('DIV', {
						props: {
							className: 'sonet-sgm-wait-text'
						},
						html: BX.message('SGMWaitTitle')
					})
				]
			})
		});
	}
	else
		SGMWaitPopup.setBindElement(window);

	SGMWaitPopup.show();
}

function __SGMCloseWait()
{
	if (SGMWaitTimeout)
	{
		clearTimeout(SGMWaitTimeout);
		SGMWaitTimeout = null;
	}

	if (SGMWaitPopup)
		SGMWaitPopup.close();
}

function __SGMShowNotifyHint(el, hint_text)
{
	if (SGMotifyHintTimeout)
	{
		clearTimeout(SGMotifyHintTimeout);
		SGMotifyHintTimeout = null;
	}

	if (SGMNotifyHintPopup != null)
	{
		SGMNotifyHintPopup.destroy();
	}

	if (SGMNotifyHintPopup == null)
	{
		SGMNotifyHintPopup = new BX.PopupWindow('sgm_notify_hint', el, {
			autoHide: true,
			lightShadow: true,
			zIndex: 2,
			content: BX.create('DIV', {
				props: {
					className: 'sonet-sgm-notify-hint-content'
				},
				style: {
					display: 'none'
				},
				children: [
					BX.create('SPAN', {
						props: {
							id: 'sgm_notify_hint_text'
						},
						html: hint_text
					})
				]
			}),
			closeByEsc: true,
			closeIcon: false,
			offsetLeft: 16,
			offsetTop: -7,
			bindOptions: {position: "top"},
			angle: {
				position: 'bottom', 
				offset: 0
			}
		});
		
		SGMNotifyHintPopup.TEXT = BX('sgm_notify_hint_text');
		SGMNotifyHintPopup.setBindElement(el);
	}
	else
	{
		SGMNotifyHintPopup.TEXT.innerHTML = hint_text;
		SGMNotifyHintPopup.setBindElement(el);
	}

	SGMNotifyHintPopup.setAngle({});	
	SGMNotifyHintPopup.show();

	SGMotifyHintTimeout = setTimeout(function() {
		SGMNotifyHintPopup.close();
	}, SGMotifyHintTime);
}
/* End */
;
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
; /* Start:"a:4:{s:4:"full";s:103:"/bitrix/components/bitrix/socialnetwork.group_users.ex/templates/.default/script.min.js?153494326314217";s:6:"source";s:83:"/bitrix/components/bitrix/socialnetwork.group_users.ex/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
(function(){if(!!BX.BXGUE){return}BX.BXGUE={groupId:null,menuPopup:null,errorBlock:null,ajaxUrl:"/bitrix/components/bitrix/socialnetwork.group_users.ex/ajax.php",popupHint:{}};BX.BXGUE.init=function(e){if(typeof e=="undefined"||typeof e.groupId=="undefined"||parseInt(e.groupId)<=0){return}this.groupId=e.groupId;if(typeof e!="undefined"){if(BX.type.isNotEmptyString(e.errorBlockName)&&BX(e.errorBlockName)){this.errorBlock=BX(e.errorBlockName)}if(typeof e.styles!="undefined"){if(typeof e.styles.memberClass!="undefined"&&typeof e.styles.memberClassOver!="undefined"&&typeof e.styles.memberClassDelete!="undefined"){var t=BX.findChildren(document,{className:e.styles.memberClass},true);var n=null;if(t){for(var o=t.length-1;o>=0;o--){BX.bind(t[o],"mouseover",function(t){BX.addClass(t.currentTarget,e.styles.memberClassOver)});BX.bind(t[o],"mouseout",function(t){BX.removeClass(t.currentTarget,e.styles.memberClassOver)});n=BX.findChild(t[o],{className:e.styles.memberClassDelete},true);if(n){BX.bind(n,"click",BX.delegate(function(t){var n=BX.findParent(t.currentTarget,{className:e.styles.memberClass});if(n&&BX.type.isNotEmptyString(n.getAttribute("bx-action"))){this.showDeleteButton({userBlock:n,action:n.getAttribute("bx-action")})}},this))}}}}}}if(BX("sonet-members-actionlink-changeowner")){BX.bind(BX("sonet-members-actionlink-changeowner"),"click",BX.delegate(function(e){BX.onCustomEvent(window,"BX.SonetGroupUsers:openDestDialog",[{id:"changeowner"}]);e.preventDefault()},this))}if(BX("sonet-members-actionlink-addmoderator")){BX.bind(BX("sonet-members-actionlink-addmoderator"),"click",BX.delegate(function(e){BX.onCustomEvent(window,"BX.SonetGroupUsers:openDestDialog",[{id:"addmoderator"}]);e.preventDefault()},this))}this.initHint("sonet-members-auto-subtitle-hint")};BX.BXGUE.initHint=function(e){var t=BX(e);if(!t){return}t.setAttribute("data-id",t);BX.bind(t,"mouseover",BX.proxy(function(){var e=BX.proxy_context.getAttribute("data-id");var t=BX.proxy_context.getAttribute("data-text");this.showHint(e,BX.proxy_context,t)},this));BX.bind(t,"mouseout",BX.proxy(function(){var e=BX.proxy_context.getAttribute("data-id");this.hideHint(e)},this))};BX.BXGUE.showHint=function(e,t,n){if(this.popupHint[e]){this.popupHint[e].close()}this.popupHint[e]=new BX.PopupWindow("sonet-members-auto-hint-popup",t,{lightShadow:true,autoHide:false,darkMode:true,offsetLeft:9,offsetTop:-5,bindOptions:{position:"top"},zIndex:200,events:{onPopupClose:function(){this.destroy()}},content:BX.create("div",{attrs:{style:"padding-right: 5px; width: 250px;"},html:n})});this.popupHint[e].setAngle({offset:13,position:"bottom"});this.popupHint[e].show();return true};BX.BXGUE.hideHint=function(e){this.popupHint[e].close();this.popupHint[e]=null};BX.BXGUE.showDeleteButton=function(e){var t=null,n=null;if(typeof e.userBlock!="undefined"&&BX(e.userBlock)){t=e.userBlock}if(typeof e.action!="undefined"&&BX.type.isNotEmptyString(e.action)){n=e.action}if(!t||!n){return}var o=BX.delegate(function(e){var i=parseInt(BX.getEventTarget(e).getAttribute("bx-entity-id"));if(i>0){this.doAction({entityId:i,action:n,buttonNode:BX.getEventTarget(e),callback:{success:BX.delegate(function(){t.style.display="none"})}})}else{this.hideDeleteButton({userBlock:t});window.removeEventListener("click",o,true)}e.preventDefault()},this);if(typeof e.userBlock!="undefined"&&BX(e.userBlock)){BX.addClass(BX(e.userBlock),"delete");window.addEventListener("click",o,true)}};BX.BXGUE.hideDeleteButton=function(e){if(typeof e.userBlock!="undefined"&&BX(e.userBlock)){BX.removeClass(BX(e.userBlock),"delete")}};BX.BXGUE.sendAjax=function(e,t){if(e.items.length>0){if(typeof t=="undefined"||typeof t.showWait=="undefined"||t.showWait){BX.SocialnetworkUICommon.Waiter.getInstance().show()}var n={ACTION:e.action,GROUP_ID:parseInt(BX.message("GUEGroupId")),sessid:BX.bitrix_sessid(),site:BX.util.urlencode(BX.message("SITE_ID"))};if(e.action=="UNCONNECT_DEPT"){n.DEPARTMENT_ID=e.items}else{n.USER_ID=e.items}BX.ajax({url:this.ajaxUrl,method:"POST",dataType:"json",data:n,onsuccess:BX.proxy(function(n){if(typeof t!="undefined"&&typeof t.callback!="undefined"&&typeof t.callback.success!="undefined"){t.callback.success(n)}else{this.processAJAXResponse(n,e.popup)}},this),onfailure:BX.delegate(function(){if(typeof t!="undefined"&&typeof t.callback!="undefined"&&typeof t.callback.failure!="undefined"){t.callback.failure()}},this)})}else{this.showError(BX.message(e.action=="UNCONNECT_DEPT"?"GUEErrorDepartmentIDNotDefined":"GUEErrorUserIDNotDefined"))}};BX.BXGUE.processAJAXResponse=function(e,t){if(t=="undefined"||t==null||!t.isShown()){return false}if(typeof e.SUCCESS!="undefined"&&e.SUCCESS=="Y"){t.close();BX.reload()}else if(e["ERROR"]!="undefined"&&e["ERROR"].length>0){if(e["ERROR"].indexOf("USER_ACTION_FAILED",0)===0){this.showError(BX.message("GUEErrorActionFailedPattern").replace("#ERROR#",e["ERROR"].substr(20)));return false}else if(e["ERROR"].indexOf("SESSION_ERROR",0)===0){this.showError(BX.message("GUEErrorSessionWrong"));BX.reload()}else if(e["ERROR"].indexOf("USER_GROUP_NO_PERMS",0)===0){this.showError(BX.message("GUEErrorNoPerms"));return false}else if(e["ERROR"].indexOf("USER_ID_NOT_DEFINED",0)===0){this.showError(BX.message("GUEErrorUserIDNotDefined"));return false}else if(e["ERROR"].indexOf("DEPARTMENT_ID_NOT_DEFINED",0)===0){this.showError(BX.message("GUEErrorDepartmentIDNotDefined"));return false}else if(e["ERROR"].indexOf("GROUP_ID_NOT_DEFINED",0)===0){this.showError(BX.message("GUEErrorGroupIDNotDefined"));return false}else if(e["ERROR"].indexOf("CURRENT_USER_NOT_AUTH",0)===0){this.showError(BX.message("GUEErrorCurrentUserNotAuthorized"));return false}else if(e["ERROR"].indexOf("SONET_MODULE_NOT_INSTALLED",0)===0){this.showError(BX.message("GUEErrorModuleNotInstalled"));return false}else if(e["ERROR"].indexOf("SONET_GUE_T_OWNER_CANT_EXCLUDE_HIMSELF",0)===0){this.showError(BX.message("GUEErrorOwnerCantExcludeHimself"));return false}else if(e["ERROR"].indexOf("SONET_GUE_T_CANT_EXCLUDE_AUTO_MEMBER",0)===0){this.showError(BX.message("GUEErrorCantExcludeAutoMember"));return false}else if(e["ERROR"].indexOf("DEPARTMENT_ACTION_FAILED",0)===0){this.showError(BX.message("GUEErrorActionFailedPattern").replace("#ERROR#",e["ERROR"].substr(26)));return false}else{this.showError(e["ERROR"]);return false}}};BX.BXGUE.showError=function(e){BX.SocialnetworkUICommon.Waiter.getInstance().hide();var t=new BX.PopupWindow("gue-error"+Math.random(),window,{autoHide:true,lightShadow:false,zIndex:2,content:BX.create("DIV",{props:{className:"sonet-members-error-text-block"},html:e}),closeByEsc:true,closeIcon:true});t.show()};BX.BXGUE.doAction=function(e){if(typeof e=="undefined"||typeof e.entityId=="undefined"||parseInt(e.entityId)<=0||!BX.type.isNotEmptyString(e.action)||parseInt(this.groupId)<=0){return}var t=parseInt(e.entityId),n=null,o=null;if(e.action=="exclude"){n="EX";o="afterUserExclude"}else if(e.action=="unban"){n="UNBAN";o="afterUserUnban"}else if(e.action=="unconnect"){n="UNCONNECT_DEPT";o="afterDeptUnconnect"}else if(e.action=="setowner"){n="SETOWNER";o="afterOwnerSet"}else if(e.action=="addmoderator"){n="ADDMODERATOR";o="afterModeratorAdd"}else if(e.action=="removemod"){n="M2U";o="afterModeratorRemove"}if(n){if(typeof e.buttonNode!="undefined"&&BX(e.buttonNode)){BX.SocialnetworkUICommon.showButtonWait(BX(e.buttonNode))}this.sendAjax({action:n,items:[t]},{showWait:e.action=="setowner"||e.action=="addmoderator",callback:{success:BX.delegate(function(n){if(typeof e.buttonNode!="undefined"&&BX(e.buttonNode)){BX.SocialnetworkUICommon.hideButtonWait(BX(e.buttonNode))}if(typeof n.SUCCESS!="undefined"&&n.SUCCESS=="Y"){if(o&&window!==top.window){window.top.BX.SidePanel.Instance.postMessageAll(window,"sonetGroupEvent",{code:o,data:{entityId:t,groupId:this.groupId}})}if(typeof e.callback!="undefined"&&typeof e.callback.success=="function"){e.callback.success()}BX.SocialnetworkUICommon.reload()}else if(typeof n.ERROR!="undefined"&&BX.type.isNotEmptyString(n.ERROR)&&this.errorBlock){var i="";if(n.ERROR.indexOf("USER_ACTION_FAILED",0)===0){i=BX.message("GUEErrorActionFailedPattern").replace("#ERROR#",n.ERROR.substr(20))}else if(n.ERROR.indexOf("SESSION_ERROR",0)===0){i=BX.message("GUEErrorSessionWrong")}else if(n.ERROR.indexOf("USER_GROUP_NO_PERMS",0)===0){i=BX.message("GUEErrorNoPerms")}else if(n.ERROR.indexOf("USER_ID_NOT_DEFINED",0)===0){i=BX.message("GUEErrorUserIDNotDefined")}else if(n.ERROR.indexOf("DEPARTMENT_ID_NOT_DEFINED",0)===0){i=BX.message("GUEErrorDepartmentIDNotDefined")}else if(n.ERROR.indexOf("GROUP_ID_NOT_DEFINED",0)===0){i=BX.message("GUEErrorGroupIDNotDefined")}else if(n.ERROR.indexOf("CURRENT_USER_NOT_AUTH",0)===0){i=BX.message("GUEErrorCurrentUserNotAuthorized")}else if(n.ERROR.indexOf("SONET_MODULE_NOT_INSTALLED",0)===0){i=BX.message("GUEErrorModuleNotInstalled")}else if(n.ERROR.indexOf("SONET_GUE_T_OWNER_CANT_EXCLUDE_HIMSELF",0)===0){i=BX.message("GUEErrorOwnerCantExcludeHimself")}else if(n.ERROR.indexOf("SONET_GUE_T_CANT_EXCLUDE_AUTO_MEMBER",0)===0){i=BX.message("GUEErrorCantExcludeAutoMember")}else if(n.ERROR.indexOf("DEPARTMENT_ACTION_FAILED",0)===0){i=BX.message("GUEErrorActionFailedPattern").replace("#ERROR#",n.ERROR.substr(26))}else{i=n.ERROR}if(typeof e.callback!="undefined"&&typeof e.callback.failure=="function"){e.callback.failure()}if(BX.type.isNotEmptyString(i)){BX.SocialnetworkUICommon.showError(i,this.errorBlock)}}},this),failure:BX.delegate(function(){if(typeof e.buttonNode!="undefined"&&BX(e.buttonNode)){BX.SocialnetworkUICommon.hideButtonWait(BX(e.buttonNode))}if(typeof e.callback!="undefined"&&typeof e.callback.failure=="function"){e.callback.failure()}if(this.errorBlock){BX.SocialnetworkUICommon.showError(BX.message("SONET_EXT_COMMON_AJAX_ERROR"),this.errorBlock)}},this)}})}};BX.BXGUE.showActionWait=function(e){if(typeof e=="undefined"||typeof e.node=="undefined"||!BX(e.node)||!BX.type.isNotEmptyString(e.className)){return}BX.addClass(BX(e.node),e.className);BX(e.node).disabled=true};BX.BXGUE.hideActionWait=function(e){if(typeof e=="undefined"||typeof e.node=="undefined"||!BX(e.node)||!BX.type.isNotEmptyString(e.className)){return}BX.removeClass(BX(e.node),e.className);BX(e.node).disabled=false};BX.BXGUEDestinationSelectorManager={data:{changeowner:{multiple:false,containterId:"sonet-members-container-changeowner",value:null},addmoderator:{multiple:true,containterId:"sonet-members-container-addmoderator",value:null}},onSelect:function(e){if(typeof e=="undefined"||!BX.type.isNotEmptyString(e.name)||typeof e.item=="undefined"||!BX.type.isNotEmptyString(e.type)){return}var t=e.name,n=e.type,o=e.item;if(typeof BX.BXGUEDestinationSelectorManager.data[t]=="undefined"){return}var i=BX.BXGUEDestinationSelectorManager.data[t].multiple;if(!i){BX.SocNetLogDestination.obItemsSelected[t]={}}if(typeof BX.SocNetLogDestination.obItemsSelected[t][o.id]=="undefined"){BX.SocNetLogDestination.obItemsSelected[t][o.id]=n}if(typeof e.state!="undefined"&&e.state=="init"){if(!i){BX.BXGUEDestinationSelectorManager.data[t].value=o.id}else{if(BX.BXGUEDestinationSelectorManager.data[t].value===null){BX.BXGUEDestinationSelectorManager.data[t].value=[]}BX.BXGUEDestinationSelectorManager.data[t].value.push(o.id)}return}if(!i&&o.id!=BX.BXGUEDestinationSelectorManager.data[t].value||i&&!BX.util.in_array(o.id,BX.BXGUEDestinationSelectorManager.data[t].value)){if(!i){BX.BXGUEDestinationSelectorManager.data[t].value=o.id}else{BX.BXGUEDestinationSelectorManager.data[t].value.push(o.id)}var r=o.id.match(/^U(\d+)/);if(r){if(t=="changeowner"){BX.BXGUE.doAction({entityId:r[1],action:"setowner",entityNode:BX("sonet-members-member-block-owner")})}else if(t=="addmoderator"){BX.BXGUE.doAction({entityId:r[1],action:"addmoderator",entityNode:BX("sonet-members-member-block-mod-"+r[1])})}}}if(BX.SocNetLogDestination.containerWindow!=null){BX.SocNetLogDestination.containerWindow.close()}},onDialogOpen:function(e){if(typeof e=="undefined"||!BX.type.isNotEmptyString(e.name)){return}var t=e.name;var n=BX.BXGUEDestinationSelector.items[t];if(n){n.onDialogOpen()}},onDialogClose:function(e){if(typeof e=="undefined"||!BX.type.isNotEmptyString(e.name)){return}var t=e.name;var n=BX.BXGUEDestinationSelector.items[t];if(n){n.onDialogClose()}}};BX.BXGUEDestinationSelector=function(){this.id="";this.settings={};this.fieldId="";this.control=null;this.inited=null};BX.BXGUEDestinationSelector.items={};BX.BXGUEDestinationSelector.create=function(e,t){var n=new BX.BXGUEDestinationSelector(e,t);n.initialize(e,t);this.items[e]=n;BX.onCustomEvent(window,"BX.SonetGroupUsers:create",[e]);return n};BX.BXGUEDestinationSelector.prototype.initialize=function(e,t){this.id=e;this.settings=t?t:{};this.fieldId=this.getSetting("fieldId","");this.inited=false;this.opened=null;BX.addCustomEvent(window,"BX.SonetGroupUsers:openDestDialog",BX.delegate(this.onSelectorOpen,this));BX.addCustomEvent(window,"BX.Main.Selector:beforeInitDialog",BX.delegate(this.onBeforeInitDialog,this))};BX.BXGUEDestinationSelector.prototype.getSetting=function(e,t){return this.settings.hasOwnProperty(e)?this.settings[e]:t};BX.BXGUEDestinationSelector.prototype.open=function(){if(!this.inited){BX.addCustomEvent(window,"BX.Main.Selector:afterInitDialog",BX.delegate(function(e){if(typeof e.id!="undefined"||e.id!=this.id){return}this.opened=true},this));BX.onCustomEvent(window,"BX.SonetGroupUsers:openInit",[{id:this.id,openDialogWhenInit:true,containerId:BX.BXGUEDestinationSelectorManager.data[this.id].containterId}])}else{BX.onCustomEvent(window,"BX.SonetGroupUsers:open",[{id:this.id,bindNode:BX(BX.BXGUEDestinationSelectorManager.data[this.id].containterId)}]);this.opened=true}};BX.BXGUEDestinationSelector.prototype.close=function(){};BX.BXGUEDestinationSelector.prototype.onSelectorOpen=function(e){var t=typeof e!="undefined"&&typeof e.id!="undefined"?e.id:false;if(!t||t!=this.id){return}if(!this.opened){this.open()}else{this.close()}};BX.BXGUEDestinationSelector.prototype.onDialogOpen=function(){this.opened=true};BX.BXGUEDestinationSelector.prototype.onDialogClose=function(){this.opened=false};BX.BXGUEDestinationSelector.prototype.onBeforeInitDialog=function(e){if(typeof e.id=="undefined"||e.id!=this.id){return}this.inited=true}})();
/* End */
;
; /* Start:"a:4:{s:4:"full";s:91:"/bitrix/components/bitrix/main.ui.selector/templates/.default/script.min.js?153494317910379";s:6:"source";s:71:"/bitrix/components/bitrix/main.ui.selector/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
(function(){"use strict";BX.namespace("BX.Main");BX.Main.selectorManager={getById:function(t){if(typeof this.controls[t]!="undefined"){return this.controls[t]}return null},controls:{}};BX.Main.Selector=function(){this.initialized=false;this.blockInit=false;this.id="";this.inputId=null;this.input=null;this.tagId=null;this.tag=null;this.options=null;this.callback=null;this.items=null;this.entities=null;this.mainPopupWindow=null;this.entitiesSet=["users","emails","crmemails","groups","sonetgroups","department","departmentRelation","contacts","companies","leads","deals"];this.auxObject=null};BX.Main.Selector.controls={};BX.Main.Selector.create=function(t){if(typeof t.id=="undefined"||!t.id){t.id=BX.util.hashCode(Math.random().toString())}else if(typeof BX.Main.selectorManager.controls[t.id]!="undefined"){return BX.Main.selectorManager.controls[t.id]}var e=new BX.Main.Selector;e.init(t);BX.Main.selectorManager.controls[e.getId()]=e;return e};BX.Main.Selector.proxyCallback=function(t,e){t(e)};BX.Main.Selector.prototype={init:function(t){try{if(!("SocNetLogDestination"in BX)){throw new ReferenceError("No BX.SocNetLogDestination detected. Forgot to include socialnetwork module and/or its assets?")}}catch(t){throw t}this.id=t.id;this.inputId=t.inputId?t.inputId:null;this.input=t.inputId&&BX(t.inputId)?BX(t.inputId):null;this.containerNode=t.containerId&&BX(t.containerId)?BX(t.containerId):null;this.bindNode=t.bindId&&BX(t.bindId)?BX(t.bindId):this.containerNode;this.tagId=t.tagId?t.tagId:null;this.tag=t.tagId&&BX(t.tagId)?BX(t.tagId):null;this.openDialogWhenInit=typeof t.openDialogWhenInit=="undefined"||!!t.openDialogWhenInit;this.options=t.options||{};this.callback=t.callback||null;this.items=t.items||null;this.entities=t.entities||null;var e={name:this.id,pathToAjax:t.pathToAjax?t.pathToAjax:null,searchInput:this.input||null,bindMainPopup:{node:this.bindNode,offsetTop:"5px",offsetLeft:"15px"},bindSearchPopup:{node:this.bindNode,offsetTop:"5px",offsetLeft:"15px"},userSearchArea:this.getOption("userSearchArea"),lazyLoad:this.getOption("lazyLoad")=="Y",useClientDatabase:this.getOption("useClientDatabase")=="Y",sendAjaxSearch:this.getOption("sendAjaxSearch")!="N",showSearchInput:this.getOption("useSearch")=="Y",allowAddUser:this.getOption("allowAddUser")=="Y",allowAddCrmContact:this.getOption("allowAddCrmContact")=="Y",allowAddSocNetGroup:this.getOption("allowAddSocNetGroup")=="Y",allowSearchEmailUsers:this.getOption("allowSearchEmailUsers")=="Y",allowSearchCrmEmailUsers:this.getOption("allowSearchCrmEmailUsers")=="Y",allowSearchNetworkUsers:this.getOption("allowSearchNetworkUsers")=="Y",enableDepartments:this.getOption("enableDepartments")=="Y",departmentSelectDisable:this.getOption("departmentSelectDisable")=="Y",enableSonetgroups:this.getOption("enableSonetgroups")=="Y",enableProjects:this.getOption("enableProjects")=="Y",isCrmFeed:this.getOption("isCrmFeed")=="Y",callback:{select:this.callback.select!=null?BX.delegate(function(t,e,i,n,o,a){this.getOption("useNewCallback")=="Y"?BX.Main.Selector.proxyCallback(this.callback.select,{name:o,item:t,type:e,search:i,bUndeleted:n,state:a}):this.callback.select(t,e,i,n,o,a)},this):null,unSelect:this.callback.unSelect!=null?BX.delegate(function(t,e,i,n){this.getOption("useNewCallback")=="Y"?BX.Main.Selector.proxyCallback(this.callback.unSelect,{name:n,item:t,type:e,search:i}):this.callback.unSelect(t,e,i,n)},this):null,openDialog:this.callback.openDialog!=null?BX.delegate(function(t){this.getOption("useNewCallback")=="Y"?BX.Main.Selector.proxyCallback(this.callback.openDialog,{name:t}):this.callback.openDialog(t)},this):null,closeDialog:this.callback.closeDialog!=null?BX.delegate(function(t){this.getOption("useNewCallback")=="Y"?BX.Main.Selector.proxyCallback(this.callback.closeDialog,{name:t}):this.callback.closeDialog(t)},this):null,openSearch:this.callback.openSearch!=null?BX.delegate(function(t){this.getOption("useNewCallback")=="Y"?BX.Main.Selector.proxyCallback(this.callback.openSearch,{name:t}):this.callback.openSearch(t)},this):null,closeSearch:this.callback.closeSearch!=null?BX.delegate(function(t){this.getOption("useNewCallback")=="Y"?BX.Main.Selector.proxyCallback(this.callback.closeSearch,{name:t}):this.callback.closeSearch(t)},this):null,openEmailAdd:this.callback.openEmailAdd!=null?BX.delegate(function(t){this.getOption("useNewCallback")=="Y"?BX.Main.Selector.proxyCallback(this.callback.openEmailAdd,{name:t}):this.callback.openEmailAdd(t)},this):null,closeEmailAdd:this.callback.closeEmailAdd!=null?BX.delegate(function(t){this.getOption("useNewCallback")=="Y"?BX.Main.Selector.proxyCallback(this.callback.closeEmailAdd,{name:t}):this.callback.closeEmailAdd(t)},this):null},allowSonetGroupsAjaxSearchFeatures:this.getOption("allowSonetGroupsAjaxSearchFeatures")};var i=null;e.items={};for(var n=0;n<this.entitiesSet.length;n++){i=this.entitiesSet[n];e.items[i]=this.entities[i]||{}}e.itemsLast={};e.itemsSelected=this.items.selected||{};BX.SocNetLogDestination.init(e);if(this.input){if(!this.options.lazyLoad){this.initDialog()}if(this.tag){BX.bind(this.tag,"focus",BX.delegate(function(t){this.initDialog({realParams:true,bByFocusEvent:true});return BX.PreventDefault(t)},this));BX.SocNetLogDestination.BXfpSetLinkName({formName:this.id,tagInputName:t.tagId,tagLink1:BX.message("BX_FPD_LINK_1"),tagLink2:BX.message("BX_FPD_LINK_2")})}BX.bind(this.input,"keydown",BX.proxy(BX.SocNetLogDestination.BXfpSearchBefore,{formName:this.id,inputName:t.inputId}));this.auxObject={formName:this.id,inputNode:BX(t.inputId),tagInputName:t.tagId};BX.bind(this.input,"bxchange",BX.proxy(BX.SocNetLogDestination.BXfpSearch,this.auxObject));this.input.setAttribute("data-bxchangehandler","Y")}else if(e.showSearchInput){if(!this.options.lazyLoad){this.initDialog()}}if(this.items.hidden){for(var o in this.items.hidden){if(this.items.hidden.hasOwnProperty(o)){this.callback.select.apply({id:(typeof this.items.hidden[o]["PREFIX"]!="undefined"?this.items.hidden[o]["PREFIX"]:"SG")+this.items.hidden[o]["ID"],name:this.items.hidden[o]["NAME"]},typeof this.items.hidden[o]["TYPE"]!="undefined"?this.items.hidden[o]["TYPE"]:"sonetgroups","",true,"","init")}}}},show:function(){this.initDialog()},initDialog:function(t){if(typeof t=="undefined"||typeof t.realParams=="undefined"){t=null}if(this.blockInit){return}var e={id:this.id};if(!this.initialized){BX.onCustomEvent(window,"BX.Main.Selector:beforeInitDialog",[e])}setTimeout(BX.delegate(function(){if(typeof e.blockInit=="undefined"||e.blockInit!==true){if(this.initialized){if(!this.mainPopupWindow||!this.mainPopupWindow.isShown()){this.openDialog(t)}}else{this.getData(BX.delegate(function(e){if(!!this.openDialogWhenInit){this.openDialog(t)}BX.onCustomEvent(window,"BX.Main.Selector:afterInitDialog",[{id:this.id}]);if(typeof this.options.eventOpen!="undefined"){BX.addCustomEvent(window,this.options.eventOpen,BX.delegate(function(t){if(typeof t.id=="undefined"||t.id!=this.id){return}if(t.bindNode){var e=BX.findChild(t.bindNode,{tagName:"input",attr:{type:"text"}},true);if(e){BX.bind(e,"keydown",BX.proxy(BX.SocNetLogDestination.BXfpSearchBefore,{formName:this.id,inputName:null,inputNode:e}));this.auxObject={formName:this.id,inputNode:e,tagInputName:t.tagId};BX.SocNetLogDestination.obElementBindMainPopup[this.id].node=e;BX.SocNetLogDestination.obElementBindSearchPopup[this.id].node=e;if(e.getAttribute("data-bxchangehandler")!=="Y"){BX.bind(e,"bxchange",BX.proxy(BX.SocNetLogDestination.BXfpSearch,this.auxObject));BX.SocNetLogDestination.obItemsSelected[this.id]={};e.setAttribute("data-bxchangehandler","Y")}if(typeof t.value!="undefined"){BX.SocNetLogDestination.obItemsSelected[this.id]=t.value}}this.openDialog({bindNode:t.bindNode})}},this))}},this))}}},this),1)},openDialog:function(t){BX.SocNetLogDestination.openDialog(this.id,t);this.mainPopupWindow=BX.SocNetLogDestination.popupWindow},closeDialog:function(){BX.SocNetLogDestination.closeDialog()},getData:function(t){this.blockInit=true;BX.ajax({url:"/bitrix/components/bitrix/main.ui.selector/ajax.php",method:"POST",dataType:"json",data:{sessid:BX.bitrix_sessid(),site:BX.message("SITE_ID"),options:this.options,action:"getData"},onsuccess:BX.delegate(function(e){this.blockInit=false;if(!!e.SUCCESS){this.addData(e.DATA,t);this.initialized=true}},this),onfailure:BX.delegate(function(t){this.blockInit=false},this)})},addData:function(t,e){function i(t,e){if(typeof e!="undefined"){if(typeof t=="undefined"){t={}}for(var i in e){if(e.hasOwnProperty(i)){t[i]=e[i]}}}}i(BX.SocNetLogDestination.obItems[this.id]["groups"],t.ITEMS.GROUPS);i(BX.SocNetLogDestination.obItems[this.id]["users"],t.ITEMS.USERS);i(BX.SocNetLogDestination.obItems[this.id]["emails"],t.ITEMS.EMAILS);i(BX.SocNetLogDestination.obItems[this.id]["crmemails"],t.ITEMS.CRMEMAILS);i(BX.SocNetLogDestination.obItems[this.id]["sonetgroups"],t.ITEMS.SONETGROUPS);i(BX.SocNetLogDestination.obItems[this.id]["department"],t.ITEMS.DEPARTMENT);BX.SocNetLogDestination.obItems[this.id]["departmentRelation"]=BX.SocNetLogDestination.buildDepartmentRelation(BX.SocNetLogDestination.obItems[this.id]["department"]);BX.SocNetLogDestination.obItemsLast[this.id]["users"]=typeof t["ITEMS_LAST"]["USERS"]!="undefined"?t["ITEMS_LAST"]["USERS"]:{};BX.SocNetLogDestination.obItemsLast[this.id]["emails"]=typeof t["ITEMS_LAST"]["EMAILS"]!="undefined"?t["ITEMS_LAST"]["EMAILS"]:{};BX.SocNetLogDestination.obItemsLast[this.id]["crmemails"]=typeof t["ITEMS_LAST"]["CRMEMAILS"]!="undefined"?t["ITEMS_LAST"]["CRMEMAILS"]:{};BX.SocNetLogDestination.obItemsLast[this.id]["sonetgroups"]=typeof t["ITEMS_LAST"]["SONETGROUPS"]!="undefined"?t["ITEMS_LAST"]["SONETGROUPS"]:{};BX.SocNetLogDestination.obItemsLast[this.id]["department"]=typeof t["ITEMS_LAST"]["DEPARTMENT"]!="undefined"?t["ITEMS_LAST"]["DEPARTMENT"]:{};BX.SocNetLogDestination.obItemsLast[this.id]["groups"]=typeof t["ITEMS_LAST"]["GROUPS"]!="undefined"?t["ITEMS_LAST"]["GROUPS"]:{};if(typeof t.ITEMS_LAST.CRM!="undefined"&&t.ITEMS_LAST.CRM.length>0){BX.SocNetLogDestination.obCrmFeed[this.id]=true}if(typeof t.SONETGROUPS_LIMITED!="undefined"&&t.SONETGROUPS_LIMITED=="Y"){BX.SocNetLogDestination.obAllowSonetGroupsAjaxSearch[this.id]=true}BX.SocNetLogDestination.obDestSort[this.id]=t.DEST_SORT;e.apply(this,t)},getId:function(){return this.id},getOption:function(t){return typeof this.options[t]!="undefined"?this.options[t]:null}}})();
/* End */
;; /* /bitrix/components/bitrix/socialnetwork.group_menu/templates/.default/script.js?15349432634504*/
; /* /bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?15349432642527*/
; /* /bitrix/components/bitrix/socialnetwork.group_users.ex/templates/.default/script.min.js?153494326314217*/
; /* /bitrix/components/bitrix/main.ui.selector/templates/.default/script.min.js?153494317910379*/
