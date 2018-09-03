
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
;; /* /bitrix/components/bitrix/socialnetwork.group_menu/templates/.default/script.js?15349432634504*/
; /* /bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?15349432642527*/
; /* /bitrix/components/bitrix/socialnetwork.group_users.ex/templates/.default/script.min.js?153494326314217*/
; /* /bitrix/components/bitrix/socialnetwork.message_form/templates/.default/script.js?153494326413038*/
