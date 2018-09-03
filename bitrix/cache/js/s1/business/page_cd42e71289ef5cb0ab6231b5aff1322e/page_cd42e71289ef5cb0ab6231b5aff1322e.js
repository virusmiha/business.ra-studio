
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
; /* Start:"a:4:{s:4:"full";s:96:"/bitrix/components/bitrix/socialnetwork.features/templates/.default/script.min.js?15349432632236";s:6:"source";s:77:"/bitrix/components/bitrix/socialnetwork.features/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
(function(){if(!!BX.BXSF){return}BX.BXSF={iframe:false,errorBlock:null};BX.BXSF.init=function(e){if(typeof e!="undefined"){if(typeof e.iframe!="undefined"){this.iframe=!!e.iframe}if(BX.type.isNotEmptyString(e.errorBlockName)&&BX(e.errorBlockName)){this.errorBlock=BX(e.errorBlockName)}}BX.bind(BX("sonet_group_features_form_button_cancel"),"click",function(e){BX.SidePanel.Instance.close();e.preventDefault()});var t=BX.findChildren(BX("sonet-features-form"),{className:"sn-features-row"},true);if(t&&BX("sonet_group_features_form_button_submit")){BX.bind(BX("sonet_group_features_form_button_submit"),"click",BX.delegate(function(e){BX.BXSF.submitForm();e.preventDefault()},this))}var o=null;t=BX.findChildren(BX("sonet-features-form"),{className:"settings-right-enable-checkbox"},true);for(var r=0;r<t.length;r++){BX.bind(t[r],"click",BX.delegate(function(e){var t=e.currentTarget;o=t.getAttribute("bx-feature");if(BX.type.isNotEmptyString(o)){BX.BXSF.toggleInternalBlock(t.checked,o)}},this))}};BX.BXSF.toggleInternalBlock=function(e,t){var o=BX(t+"_body");if(o){BX.toggle(o)}var r=BX(t+"_block");if(r){BX.toggle(r)}o=BX(t+"_lbl");if(o){o.innerHTML=BX.message("sonetF_"+t+(e?"_on":"_off"))}};BX.BXSF.submitForm=function(){if(!BX("sonet-features-form")){return}BX.SocialnetworkUICommon.hideError(this.errorBlock);BX.SocialnetworkUICommon.showButtonWait(BX("sonet_group_features_form_button_submit"));BX.ajax.submitAjax(document.forms["sonet-features-form"],{url:BX("sonet-features-form").getAttribute("action"),method:"POST",dataType:"json",onsuccess:BX.delegate(function(e){BX.SocialnetworkUICommon.hideButtonWait(BX("sonet_group_features_form_button_submit"));if(typeof e.MESSAGE!="undefined"&&e.MESSAGE=="SUCCESS"&&typeof e.URL!="undefined"){if(this.iframe){BX.SidePanel.Instance.close()}top.location.href=e.URL}else if(typeof e.MESSAGE!="undefined"&&e.MESSAGE=="ERROR"&&typeof e.ERROR_MESSAGE!="undefined"&&e.ERROR_MESSAGE.length>0){BX.SocialnetworkUICommon.showError(e["ERROR_MESSAGE"],this.errorBlock)}},this),onfailure:BX.delegate(function(e){BX.SocialnetworkUICommon.hideButtonWait(BX("sonet_group_features_form_button_submit"));BX.SocialnetworkUICommon.showError(BX.message("SONET_C4_T_ERROR"),this.errorBlock)},this)})}})();
/* End */
;; /* /bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?15349432642527*/
; /* /bitrix/components/bitrix/socialnetwork.features/templates/.default/script.min.js?15349432632236*/
