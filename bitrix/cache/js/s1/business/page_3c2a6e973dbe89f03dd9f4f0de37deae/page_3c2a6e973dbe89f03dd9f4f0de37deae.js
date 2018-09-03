
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
;; /* /bitrix/components/bitrix/socialnetwork.group_menu/templates/.default/script.js?15349432634504*/
; /* /bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?15349432642527*/
