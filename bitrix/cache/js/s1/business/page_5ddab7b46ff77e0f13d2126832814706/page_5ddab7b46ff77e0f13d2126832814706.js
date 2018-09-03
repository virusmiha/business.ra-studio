
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
; /* Start:"a:4:{s:4:"full";s:105:"/bitrix/components/bitrix/socialnetwork.group_requests.ex/templates/.default/script.min.js?15349432643779";s:6:"source";s:86:"/bitrix/components/bitrix/socialnetwork.group_requests.ex/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
(function(){if(!!BX.BXSGRE){return}BX.BXSGRE={iframe:false,errorBlock:null,mode:null};BX.BXSGRE.init=function(e){if(typeof e!="undefined"){if(typeof e.iframe!="undefined"){this.iframe=!!e.iframe}if(BX.type.isNotEmptyString(e.errorBlockName)&&BX(e.errorBlockName)){this.errorBlock=BX(e.errorBlockName)}if(typeof e.mode!="undefined"){this.mode=e.mode}}if(BX("sonet_group_requests_in_form_button_submit")){BX.bind(BX("sonet_group_requests_in_form_button_submit"),"click",BX.delegate(function(e){this.submitForm(e,{type:"in",action:"accept"});e.preventDefault()},this))}if(BX("sonet_group_requests_in_form_button_reject")){BX.bind(BX("sonet_group_requests_in_form_button_reject"),"click",BX.delegate(function(e){this.submitForm(e,{type:"in",action:"reject"});e.preventDefault()},this))}if(BX("sonet_group_requests_out_form_button_reject")){BX.bind(BX("sonet_group_requests_out_form_button_reject"),"click",BX.delegate(function(e){this.submitForm(e,{type:"out",action:"reject"});e.preventDefault()},this))}if(BX("sonet_group_requests_in_check_all")){BX.bind(BX("sonet_group_requests_in_check_all"),"click",BX.delegate(function(e){this.checkAll(e.currentTarget)},this))}if(BX("sonet_group_requests_out_check_all")){BX.bind(BX("sonet_group_requests_out_check_all"),"click",BX.delegate(function(e){this.checkAll(e.currentTarget)},this))}this.processUserList(BX("invite-main-wrap-in"));this.processUserList(BX("invite-main-wrap-out"));BX.addCustomEvent("SidePanel.Slider:onMessage",BX.delegate(function(e){if(e.getEventId()=="sonetGroupEvent"){var t=e.getData();if(BX.util.in_array(this.mode,["ALL","OUT"])&&BX.type.isNotEmptyString(t.code)&&t.code=="afterInvite"){BX.SocialnetworkUICommon.reload()}}},this))};BX.BXSGRE.processUserList=function(e){if(BX(e)){var t=null;if(BX(e)){var o=BX.findChildren(BX(e),{className:"invite-user-link"},true);for(var i=0,n=o.length;i<n;i++){BX.bind(o[i],"click",function(e){if(BX.type.isNotEmptyString(BX.getEventTarget(e).href)){top.location.href=BX.getEventTarget(e).href}e.preventDefault()});t=o[i].getAttribute("bx-user-id");if(t){BX.tooltip(t,o[i].id)}}}}};BX.BXSGRE.submitForm=function(e,t){var o=null,i=null;if(typeof t!="undefined"){if(BX.type.isNotEmptyString(t.type)){o=t.type}if(BX.type.isNotEmptyString(t.action)){i=t.action}}if(!o||!i){return false}var n=e.currentTarget;BX.SocialnetworkUICommon.hideError(this.errorBlock);BX.SocialnetworkUICommon.showButtonWait(n);var r=o=="out"?"form_requests_out":"form_requests";if(BX("requests_action_"+o)){BX("requests_action_"+o).value=i}BX.ajax.submitAjax(document.forms[r],{url:document.forms[r].getAttribute("action"),method:"POST",dataType:"json",onsuccess:BX.delegate(function(e){BX.SocialnetworkUICommon.hideButtonWait(n);if(typeof e.MESSAGE!="undefined"&&e.MESSAGE=="SUCCESS"&&typeof e.URL!="undefined"){if(window===top.window){top.location.href=e.URL}else{window.top.BX.SidePanel.Instance.postMessageAll(window,"sonetGroupEvent",{code:o=="out"?"afterRequestOutDelete":"afterRequestDelete",data:{}});BX.SocialnetworkUICommon.reload()}}else if(typeof e.MESSAGE!="undefined"&&e.MESSAGE=="ERROR"&&typeof e.ERROR_MESSAGE!="undefined"&&e.ERROR_MESSAGE.length>0){BX.SocialnetworkUICommon.showError(e.ERROR_MESSAGE,this.errorBlock)}},this),onfailure:BX.delegate(function(e){BX.SocialnetworkUICommon.hideButtonWait(n);BX.SocialnetworkUICommon.showError(BX.message("SONET_GRE_T_ERROR"),this.errorBlock)},this)});return false};BX.BXSGRE.checkAll=function(e){var t=null,o=BX.findChildren(e.parentNode.parentNode.parentNode,{tag:"input"},true);if(!e.checked){for(t=1;t<o.length;t++){o[t].checked=false;BX.removeClass(o[t].parentNode.parentNode.parentNode,"invite-list-active")}}else{for(t=1;t<o.length;t++){o[t].checked=true;BX.addClass(o[t].parentNode.parentNode.parentNode,"invite-list-active")}}}})();
/* End */
;; /* /bitrix/components/bitrix/socialnetwork.group_menu/templates/.default/script.js?15349432634504*/
; /* /bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?15349432642527*/
; /* /bitrix/components/bitrix/socialnetwork.group_requests.ex/templates/.default/script.min.js?15349432643779*/
