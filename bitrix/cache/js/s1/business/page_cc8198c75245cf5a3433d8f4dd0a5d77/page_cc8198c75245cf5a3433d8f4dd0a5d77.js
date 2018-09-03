
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
; /* Start:"a:4:{s:4:"full";s:100:"/bitrix/components/bitrix/socialnetwork.user_requests.ex/templates/.default/script.js?15349432622196";s:6:"source";s:85:"/bitrix/components/bitrix/socialnetwork.user_requests.ex/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function __URESubmitForm(type, action) 
{
	var form_name = (type == "out") ? "form_requests_out" : "form_requests";
	if (BX("requests_action_" + type))
		BX("requests_action_" + type).value = action;
	BX.submit(BX(form_name));
	return false;
}

function __URECheckedAll(input) 
{
	var input_list = BX.findChildren(input.parentNode.parentNode.parentNode, { tag: 'input' }, true);
	if (!input.checked)
	{
		for(var i=1; i<input_list.length; i++)
		{
			input_list[i].checked = false;
			BX.removeClass(input_list[i].parentNode.parentNode.parentNode, 'invite-list-active')
		}
	}
	else
	{
		for(var i=1; i<input_list.length; i++)
		{
			input_list[i].checked = true;
			BX.addClass(input_list[i].parentNode.parentNode.parentNode, 'invite-list-active')
		}
	}
}

function __UREIsLeftClick(event)
{
	if (!event.which && event.button !== undefined)
	{
		if (event.button & 1)
			event.which = 1;
		else if (event.button & 4)
			event.which = 2;
		else if (event.button & 2)
			event.which = 3;
		else
			event.which = 0;
	}

	return event.which == 1 || (event.which == 0 && BX.browser.IsIE());
};

function __hideInvitationItem(params)
{
	var invite_code = params.NOTIFY_TAG.split('|')[1],
		invite_id = params.NOTIFY_TAG.split('|')[3],
		invitation_item = BX(invite_code + '_' + invite_id);

	if (invitation_item)
	{
		BX.remove(invitation_item);
		
		//if no other invitations exist, hide buttons
		var requests_list = BX.findChildren(BX('form_requests'), { tag: 'td', className: 'invite-list-checkbox' }, true);
		var invite_list_nav = BX.findChild(BX('form_requests'), { tag: 'div', className: 'navigation'}, true);
		if (!requests_list && !invite_list_nav)
		{
			var invitation_table = BX.findChild(BX('form_requests'), { tag: 'table', className: 'invite-list' }, true);
			BX.addClass(invitation_table, 'invite-list-hidden');

			var buttons_area = BX.findChild(BX('form_requests'), { tag: 'span', className: 'invite-buttons-area' }, true);
			BX.addClass(buttons_area, 'invite-buttons-area-hidden');

			var group_info = BX.findChild(BX('form_requests'), { tag: 'span', className: 'sonet-group-requests-info' }, true);
			BX.removeClass(group_info, 'sonet-group-requests-info-hidden');
		}
	}
}
/* End */
;; /* /bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?15349432642527*/
; /* /bitrix/components/bitrix/socialnetwork.user_requests.ex/templates/.default/script.js?15349432622196*/
