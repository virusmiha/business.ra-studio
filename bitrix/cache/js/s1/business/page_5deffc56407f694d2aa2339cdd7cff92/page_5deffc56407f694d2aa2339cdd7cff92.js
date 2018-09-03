
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
;; /* /bitrix/components/bitrix/socialnetwork.group_menu/templates/.default/script.js?15349432634504*/
; /* /bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?15349432642527*/
; /* /bitrix/components/bitrix/socialnetwork.group_users.ex/templates/.default/script.min.js?153494326314217*/
