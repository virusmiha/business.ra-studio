
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
; /* Start:"a:4:{s:4:"full";s:104:"/bitrix/components/bitrix/socialnetwork.group_create.ex/templates/.default/script.min.js?153494384726625";s:6:"source";s:84:"/bitrix/components/bitrix/socialnetwork.group_create.ex/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function BXSwitchProject(e){BX.BXGCE.recalcFormPartProject(e)}function BXSwitchNotVisible(e){if(BX("GROUP_OPENED")&&BX("GROUP_OPENED").type=="checkbox"){if(e){BX("GROUP_OPENED").disabled=false}else{BX("GROUP_OPENED").disabled=true;BX("GROUP_OPENED").checked=false}}}function BXSwitchExtranet(e,t){if(BX("INVITE_EXTRANET_block")){if(e){BX("INVITE_EXTRANET_block_container").style.display="block"}BX.BXGCE.showHideBlock({container:BX("INVITE_EXTRANET_block_container"),block:BX("INVITE_EXTRANET_block"),show:e,duration:t?1e3:0,callback:{complete:function(){if(e){BX.removeClass(BX("INVITE_EXTRANET_block_container"),"invisible")}else{BX("INVITE_EXTRANET_block_container").style.display="none";BX.addClass(BX("INVITE_EXTRANET_block_container"),"invisible")}}}})}if(BX("GROUP_OPENED")){if(!e){if(BX("GROUP_OPENED").type=="checkbox"){BX("GROUP_OPENED").disabled=false}}else{if(BX("GROUP_OPENED").type=="checkbox"){BX("GROUP_OPENED").disabled=true;BX("GROUP_OPENED").checked=false}else{BX("GROUP_OPENED").value="N"}}}if(BX("GROUP_VISIBLE")){if(!e){if(BX("GROUP_VISIBLE").type=="checkbox"){BX("GROUP_VISIBLE").disabled=false}}else{if(BX("GROUP_VISIBLE").type=="checkbox"){BX("GROUP_VISIBLE").disabled=true;BX("GROUP_VISIBLE").checked=false}else{BX("GROUP_VISIBLE").value="N"}}}if(BX("GROUP_INITIATE_PERMS")&&BX("GROUP_INITIATE_PERMS_OPTION_E")&&BX("GROUP_INITIATE_PERMS_OPTION_K")){if(e){BX("GROUP_INITIATE_PERMS_OPTION_E").selected=true}else{BX("GROUP_INITIATE_PERMS_OPTION_K").selected=true}}if(BX("GROUP_INITIATE_PERMS_PROJECT")&&BX("GROUP_INITIATE_PERMS_OPTION_PROJECT_E")&&BX("GROUP_INITIATE_PERMS_OPTION_PROJECT_K")){if(e){BX("GROUP_INITIATE_PERMS_OPTION_PROJECT_E").selected=true}else{BX("GROUP_INITIATE_PERMS_OPTION_PROJECT_K").selected=true}}if(BX("USERS_employee_section_extranet")){BX("USERS_employee_section_extranet").style.display=e?"inline-block":"none"}}function BXGCESubmitForm(e){if(BX("EXTRANET_INVITE_ACTION")){BX("EXTRANET_INVITE_ACTION").value=BX.BXGCE.lastAction}var t=BX("sonet_group_create_popup_form").action;if(t){if(BX("SONET_GROUP_ID")&&parseInt(BX("SONET_GROUP_ID").value)<=0){t+=(t.indexOf("?")>=0?"&":"?")+"action=createGroup&groupType="+BX.BXGCE.selectedTypeCode}BX.BXGCE.disableSubmitButton(true);BX.ajax.submitAjax(document.forms.sonet_group_create_popup_form,{url:t,method:"POST",dataType:"json",onsuccess:function(e){if(typeof e["ERROR"]!="undefined"&&e["ERROR"].length>0){BX.BXGCE.showError((typeof e["WARNING"]!="undefined"&&e["WARNING"].length>0?e["WARNING"]+"<br>":"")+e["ERROR"]);if(typeof BX.SocNetLogDestination.obItems!="undefined"&&typeof e["USERS_ID"]!="undefined"&&BX.type.isArray(e["USERS_ID"])){var t=false;var o=[];var i=false;var n=0;for(n=0;n<e["USERS_ID"].length;n++){o["U"+e["USERS_ID"][n]]="users"}if(BX.BXGCE.arUserSelector.length>0){for(var a=0;a<BX.BXGCE.arUserSelector.length;a++){t=BX.findChildren(BX("sonet_group_create_popup_users_item_post_"+BX.BXGCE.arUserSelector[a]),{className:"feed-add-post-destination-users"},true);if(t){for(n=0;n<t.length;n++){i=t[n].getAttribute("data-id");if(i&&i.length>0){BX.SocNetLogDestination.deleteItem(i,"users",BX.BXGCE.arUserSelector[a])}}}BX.SocNetLogDestination.obItemsSelected[BX.BXGCE.arUserSelector[a]]=o;BX.SocNetLogDestination.reInit(BX.BXGCE.arUserSelector[a])}}}BX.BXGCE.disableSubmitButton(false)}else if(e["MESSAGE"]=="SUCCESS"){if(window===top.window){if(typeof e["URL"]!=="undefined"&&e["URL"].length>0){top.location.href=e["URL"]}}else{if(typeof e.ACTION!="undefined"){var s=false;if(BX.util.in_array(e.ACTION,["create","edit"])&&typeof e.GROUP!="undefined"){s={code:e.ACTION=="create"?"afterCreate":"afterEdit",data:{group:e.GROUP}}}else if(BX.util.in_array(e.ACTION,["invite"])){s={code:"afterInvite",data:{}}}if(s){window.top.BX.SidePanel.Instance.postMessageAll(window,"sonetGroupEvent",s);BX.SidePanel.Instance.close();if(e.ACTION=="create"&&BX.type.isNotEmptyString(e.URL)&&(!BX.type.isNotEmptyString(BX.BXGCE.config.refresh)||BX.BXGCE.config.refresh=="Y")){top.window.location.href=e.URL}}else{BX.SocialnetworkUICommon.reload();var l=BX.SidePanel.Instance.getSliderByWindow(window);if(l){window.top.BX.onCustomEvent("SidePanel.Slider:onClose",[l.getEvent("onClose")])}window.top.BX.onCustomEvent("BX.Bitrix24.PageSlider:close",[false]);window.top.BX.onCustomEvent("onSonetIframeCancelClick")}}}}},onfailure:function(e){BX.BXGCE.disableSubmitButton(false);BX.BXGCE.showError(BX.message("SONET_GCE_T_AJAX_ERROR"))}})}e.preventDefault()}function __deleteExtranetEmail(e){var t=false;if(!e||!BX.type.isDomNode(e))e=this;if(e){BX(e).parentNode.parentNode.removeChild(BX(e).parentNode);var o=parseInt(BX(e).parentNode.id.substring(36));top.BXExtranetMailList[o-1]="";BX("EMAILS").value="";for(var i=0;i<top.BXExtranetMailList.length;i++){if(top.BXExtranetMailList[i].length>0){if(t)BX("EMAILS").value+=", ";BX("EMAILS").value+=top.BXExtranetMailList[i];t=true}}}}(function(){if(!!BX.BXGCE){return}BX.BXGCE={config:{refresh:"Y"},groupId:null,userSelector:"",lastAction:"invite",arUserSelector:[],formSteps:2,animationList:{},selectedTypeCode:false};BX.BXGCE.init=function(e){if(typeof e!="undefined"){if(typeof e.groupId!="undefined"){this.groupId=parseInt(e.groupId)}if(typeof e.config!="undefined"){this.config=e.config}}var t=null,o=null;if(BX("sonet_group_create_form_step_1")){var i=BX.findChildren(BX("sonet_group_create_form_step_1"),{className:"social-group-tile-item"},true);for(t=0,o=i.length;t<o;t++){BX.bind(i[t],"click",BX.delegate(function(e){var t=e.currentTarget;var o=this.selectedTypeCode=t.getAttribute("bx-type");if(BX.type.isNotEmptyString(o)){this.showStep({step:2});if(BX("GROUP_NAME_input")){BX("GROUP_NAME_input").focus()}this.recalcForm({type:o})}e.preventDefault()},this))}}if(BX("additional-block-features")){var n=BX.findChildren(BX("additional-block-features"),{className:"social-group-create-form-pencil"},true);for(t=0,o=n.length;t<o;t++){BX.bind(n[t],"click",BX.delegate(function(e){var t=e.currentTarget;var o=BX.findParent(t,{className:"social-group-create-form-field-list-item"},BX("additional-block-features"));if(o){BX.addClass(o,"custom-value")}var i=BX.findChild(o,{className:"social-group-create-form-field-input-text"},true);var n=BX.findChild(o,{className:"social-group-create-form-field-list-label"},true);if(i&&n){i.value=n.innerText}e.preventDefault()},this))}var a=BX.findChildren(BX("additional-block-features"),{className:"social-group-create-form-field-cancel"},true);for(t=0,o=a.length;t<o;t++){BX.bind(a[t],"click",BX.delegate(function(e){var t=e.currentTarget;var o=BX.findParent(t,{className:"social-group-create-form-field-list-item"},BX("additional-block-features"));if(o){BX.removeClass(o,"custom-value")}var i=BX.findChild(o,{className:"social-group-create-form-field-input-text"},true);if(i){i.value=""}e.preventDefault()},this))}}if(BX("GROUP_NAME_input")){BX("GROUP_NAME_input").focus()}BX.bind(BX("sonet_group_create_popup_form_button_step_2_back"),"click",BX.delegate(function(e){this.showStep({step:1});return e.preventDefault()},this));BX.bind(BX("sonet_group_create_popup_form_button_submit"),"click",function(e){BXGCESubmitForm(e);var t=BX.SidePanel.Instance.getSliderByWindow(window);if(t){window.top.BX.onCustomEvent("SidePanel.Slider:onClose",[t.getEvent("onClose")])}});BX.bind(BX("sonet_group_create_popup_form_button_step_2_cancel"),"click",function(e){var t=BX.SidePanel.Instance.getSliderByWindow(window);if(t){window.top.BX.onCustomEvent("SidePanel.Slider:onClose",[t.getEvent("onClose")])}window.top.BX.onCustomEvent("BX.Bitrix24.PageSlider:close",[false]);window.top.BX.onCustomEvent("onSonetIframeCancelClick");return e.preventDefault()});if(BX.SidePanel.Instance.getTopSlider()){BX.addCustomEvent(BX.SidePanel.Instance.getTopSlider().getWindow(),"SidePanel.Slider:onClose",function(e){setTimeout(function(){BX.SidePanel.Instance.destroy(e.getSlider().getUrl())},500)})}BX.bind(BX("GROUP_INITIATE_PERMS"),"change",BX.BXGCE.onInitiatePermsChange);BX.bind(BX("GROUP_INITIATE_PERMS_PROJECT"),"change",BX.BXGCE.onInitiatePermsChange);if(BX("GROUP_MODERATORS_switch")&&BX("GROUP_MODERATORS_PROJECT_switch")){var s=BX.delegate(function(){var e=BX.hasClass(BX("GROUP_MODERATORS_block_container"),"invisible");if(e){BX("GROUP_MODERATORS_block_container").style.display="block"}this.showHideBlock({container:BX("GROUP_MODERATORS_block_container"),block:BX("GROUP_MODERATORS_block"),show:e,duration:500,callback:{complete:function(){if(!e){BX("GROUP_MODERATORS_block_container").style.display="none"}BX.toggleClass(BX("GROUP_MODERATORS_block_container"),"invisible")}}})},this);BX.bind(BX("GROUP_MODERATORS_switch"),"click",s);BX.bind(BX("GROUP_MODERATORS_PROJECT_switch"),"click",s)}if(BX("IS_EXTRANET_GROUP")&&BX("IS_EXTRANET_GROUP").type=="checkbox"){BX.bind(BX("IS_EXTRANET_GROUP"),"click",function(){BXSwitchExtranet(BX("IS_EXTRANET_GROUP").checked,true)})}if(BX("GROUP_VISIBLE")&&BX("GROUP_VISIBLE").type=="checkbox"){BX.bind(BX("GROUP_VISIBLE"),"click",function(){BXSwitchNotVisible(BX("GROUP_VISIBLE").checked)})}if(BX("switch_additional")){BX.bind(BX("switch_additional"),"click",BX.delegate(function(e){var t=BX.getEventTarget(e).getAttribute("bx-block-id");if(BX.type.isNotEmptyString(t)){if(!BX.hasClass(BX("switch_additional"),"opened")){this.onToggleAdditionalBlock({callback:BX.delegate(function(){this.highlightAdditionalBlock(t)},this)})}else{this.highlightAdditionalBlock(t)}}else{this.onToggleAdditionalBlock()}},this))}if(BX.type.isNotEmptyString(e.avatarUploaderId)&&BX("GROUP_IMAGE_ID_block")&&typeof BX.UploaderManager!="undefined"){setTimeout(function(){var t=BX.UploaderManager.getById(e.avatarUploaderId);if(t){BX.addCustomEvent(t,"onQueueIsChanged",function(e,t,o,i){if(t=="add"){BX.addClass(BX("GROUP_IMAGE_ID_block"),"social-group-create-link-upload-set")}else if(t=="delete"){BX.removeClass(BX("GROUP_IMAGE_ID_block"),"social-group-create-link-upload-set")}})}},0)}};BX.BXGCE.onToggleAdditionalBlock=function(e){BX.toggleClass(BX("switch_additional"),"opened");var t=BX.hasClass(BX("block_additional"),"invisible");if(t){BX("block_additional").style.display="block"}this.showHideBlock({container:BX("block_additional"),block:BX("block_additional_inner"),show:t,duration:1e3,callback:{complete:function(){BX.toggleClass(BX("block_additional"),"invisible");if(typeof e!="undefined"&&typeof e.callback=="function"){if(!t){BX("block_additional").style.display="none"}e.callback()}}}})};BX.BXGCE.showHideBlock=function(e){if(typeof e=="undefined"){return false}var t=typeof e.container!="undefined"?BX(e.container):false;var o=typeof e.block!="undefined"?BX(e.block):false;var i=!!e.show;if(!t||!o){return false}if(typeof this.animationList[o.id]!="undefined"&&this.animationList[o.id]!=null){return false}this.animationList[o.id]=null;var n=parseInt(o.offsetHeight);var a=typeof e.duration!="undefined"&&parseInt(e.duration)>0?parseInt(e.duration):0;if(i){t.style.display="block"}if(a>0){if(BX.type.isNotEmptyString(o.id)){this.animationList[o.id]=true}BX.delegate(new BX["easing"]({duration:a,start:{height:i?0:n,opacity:i?0:100},finish:{height:i?n:0,opacity:i?100:0},transition:BX.easing.makeEaseOut(BX.easing.transitions.quart),step:function(e){t.style.maxHeight=e.height+"px";t.style.opacity=e.opacity/100},complete:BX.delegate(function(){if(BX.type.isNotEmptyString(o.id)){this.animationList[o.id]=null}if(typeof e.callback!="undefined"&&typeof e.callback.complete=="function"){t.style.maxHeight="";t.style.opacity="";e.callback.complete()}},this)}).animate(),this)}else{e.callback.complete()}return true};BX.BXGCE.highlightAdditionalBlock=function(e){var t=BX("additional-block-"+e);if(t){var o="item-highlight";var i=BX.GetWindowScrollPos();BX.addClass(t,o);setTimeout(function(){var e=BX.pos(t);new BX.easing({duration:500,start:{scroll:i.scrollTop},finish:{scroll:e.top},transition:BX.easing.makeEaseOut(BX.easing.transitions.quart),step:function(e){window.scrollTo(0,e.scroll)},complete:function(){}}).animate()},600);setTimeout(function(){BX.removeClass(t,o)},3e3)}};BX.BXGCE.onInitiatePermsChange=function(){var e=this.id=="GROUP_INITIATE_PERMS"?"GROUP_INITIATE_PERMS_OPTION_PROJECT_":"GROUP_INITIATE_PERMS_OPTION_";if(BX(e+this.options[this.selectedIndex].value)){BX(e+this.options[this.selectedIndex].value).selected=true}};BX.BXGCE.showStep=function(e){var t=typeof e!="undefined"&&typeof e.step!="undefined"?parseInt(e.step):1;for(var o=1;o<=this.formSteps;o++){if(BX("sonet_group_create_form_step_"+o)){BX("sonet_group_create_form_step_"+o).style.display=o==t?"block":"none"}}};BX.BXGCE.recalcFormPartProjectBlock=function(e,t){if(BX(e)){if(t){BX.addClass(BX(e),"sgcp-switch-project")}else{BX.removeClass(e,"sgcp-switch-project")}}};BX.BXGCE.recalcFormPartProject=function(e){e=!!e;if(BX("GROUP_PROJECT")){this.setCheckedValue(BX("GROUP_PROJECT"),e)}BX.BXGCE.recalcFormPartProjectBlock("IS_PROJECT_block",e);BX.BXGCE.recalcFormPartProjectBlock("GROUP_VISIBLE_LABEL_block",e);BX.BXGCE.recalcFormPartProjectBlock("GROUP_OPENED_LABEL_block",e);BX.BXGCE.recalcFormPartProjectBlock("GROUP_CLOSED_LABEL_block",e);BX.BXGCE.recalcFormPartProjectBlock("GROUP_EXTRANET_LABEL_block",e);BX.BXGCE.recalcFormPartProjectBlock("GROUP_OWNER_LABEL_block",e);BX.BXGCE.recalcFormPartProjectBlock("GROUP_ADD_DEPT_HINT_block",e);BX.BXGCE.recalcFormPartProjectBlock("GROUP_MODERATORS_LABEL_block",e);BX.BXGCE.recalcFormPartProjectBlock("GROUP_MODERATORS_SWITCH_LABEL_block",e);BX.BXGCE.recalcFormPartProjectBlock("GROUP_TYPE_LABEL_block",e);BX.BXGCE.recalcFormPartProjectBlock("GROUP_SUBJECT_ID_LABEL_block",e);BX.BXGCE.recalcFormPartProjectBlock("GROUP_INVITE_PERMS_block",e);BX.BXGCE.recalcFormPartProjectBlock("GROUP_INVITE_PERMS_LABEL_block",e);if(BX("sonet_group_create_popup_form_button_submit")&&BX("sonet_group_create_popup_form_button_submit").getAttribute("bx-action-type")=="create"){BX("sonet_group_create_popup_form_button_submit").innerHTML=BX.message(e?"SONET_GCE_T_DO_CREATE_PROJECT":"SONET_GCE_T_DO_CREATE")}if(BX("GROUP_NAME_input")){BX("GROUP_NAME_input").placeholder=BX.message(e?"SONET_GCE_T_NAME2_PROJECT":"SONET_GCE_T_NAME2")}if(BX("pagetitle-slider")){BX("pagetitle-slider").innerHTML=BX.message(this.groupId>0?e?"SONET_GCE_T_TITLE_EDIT_PROJECT":"SONET_GCE_T_TITLE_EDIT":e?"SONET_GCE_T_TITLE_CREATE_PROJECT":"SONET_GCE_T_TITLE_CREATE")}};BX.BXGCE.recalcForm=function(e){var t=typeof e!="undefined"&&typeof e.type!="undefined"?e.type:false;if(!t||typeof this.types[t]=="undefined"){return}this.recalcFormPartProject(this.types[t].PROJECT=="Y");if(BX("GROUP_OPENED")){this.setCheckedValue(BX("GROUP_OPENED"),this.types[t].OPENED=="Y")}if(BX("GROUP_VISIBLE")){this.setCheckedValue(BX("GROUP_VISIBLE"),this.types[t].VISIBLE=="Y")}if(BX("IS_EXTRANET_GROUP")){this.setCheckedValue(BX("IS_EXTRANET_GROUP"),this.types[t].EXTERNAL=="Y")}this.recalcFormDependencies()};BX.BXGCE.recalcFormDependencies=function(){if(BX("IS_EXTRANET_GROUP")){BXSwitchExtranet(this.getCheckedValue(BX("IS_EXTRANET_GROUP")),false)}if(BX("GROUP_VISIBLE")&&BX("GROUP_OPENED")){var e=this.getCheckedValue(BX("GROUP_VISIBLE"));if(!e){this.setCheckedValue(BX("GROUP_OPENED"),false)}}};BX.BXGCE.setSelector=function(e){BX.BXGCE.userSelector=e};BX.BXGCE.disableBackspace=function(e){if(BX.SocNetLogDestination.backspaceDisable||BX.SocNetLogDestination.backspaceDisable!=null){BX.unbind(window,"keydown",BX.SocNetLogDestination.backspaceDisable)}BX.bind(window,"keydown",BX.SocNetLogDestination.backspaceDisable=function(e){if(e.keyCode==8){e.preventDefault();return false}});setTimeout(function(){BX.unbind(window,"keydown",BX.SocNetLogDestination.backspaceDisable);BX.SocNetLogDestination.backspaceDisable=null},5e3)};BX.BXGCE.selectCallback=function(e){if(typeof e=="undefined"||!BX.type.isNotEmptyString(e.name)||typeof e.item=="undefined"||!BX.type.isNotEmptyString(e.type)){return}var t=e.name,o=e.type,i=e.item;var n=typeof BX.BXGCESelectorManager.controls[t]!="undefined"&&typeof BX.BXGCESelectorManager.controls[t].single!="undefined"&&!!BX.BXGCESelectorManager.controls[t].single;var a=typeof BX.BXGCESelectorManager.controls[t]!="undefined"&&typeof BX.BXGCESelectorManager.controls[t].controlName!="undefined"&&BX.BXGCESelectorManager.controls[t].controlName?BX.BXGCESelectorManager.controls[t].controlName:"USER_CODES[]";if(!BX.findChild(BX("sonet_group_create_popup_users_item_post_"+t),{attr:{"data-id":i.id}},false,false)){if(n){BX.cleanNode(BX("sonet_group_create_popup_users_item_post_"+t));BX("sonet_group_create_popup_users_input_post_"+t).style.display="none"}BX("sonet_group_create_popup_users_item_post_"+t).appendChild(BX.create("span",{attrs:{"data-id":i.id},props:{className:"feed-add-post-destination feed-add-post-destination-"+o},children:[BX.create("input",{attrs:{type:"hidden",name:a,value:i.id}}),BX.create("span",{props:{className:"feed-add-post-destination-text"},html:i.name}),BX.create("span",{props:{className:"feed-add-post-del-but"},events:{click:function(e){BX.SocNetLogDestination.deleteItem(i.id,o,t);e.preventDefault()},mouseover:function(){BX.addClass(this.parentNode,"feed-add-post-destination-hover")},mouseout:function(){BX.removeClass(this.parentNode,"feed-add-post-destination-hover")}}})]}));BX.BXGCE.showDepartmentHint(t)}BX("sonet_group_create_popup_users_input_post_"+t).value="";if(!n){BX.SocNetLogDestination.BXfpSetLinkName({formName:t,tagInputName:"sonet_group_create_popup_users_tag_post_"+t,tagLink1:BX.message("SONET_GCE_T_DEST_LINK_1"),tagLink2:BX.message("SONET_GCE_T_DEST_LINK_2")})}else{BX.style(BX("sonet_group_create_popup_users_tag_post_"+t),"display","none");BX.SocNetLogDestination.closeDialog()}};BX.BXGCE.selectCallbackOld=function(e,t,o,i,n){BX.BXGCE.selectCallback({name:n,type:t,item:e})};BX.BXGCE.showDepartmentHint=function(e){if(!BX.type.isPlainObject(BX.SocNetLogDestination.obItemsSelected[e])||!BX("GROUP_ADD_DEPT_HINT_block")){return false}var t=false;for(var o in BX.SocNetLogDestination.obItemsSelected[e]){if(!BX.SocNetLogDestination.obItemsSelected[e].hasOwnProperty(o)){continue}if(o.match(/DR\d+/)){t=true;break}}if(t){BX.addClass(BX("GROUP_ADD_DEPT_HINT_block"),"visible")}else{BX.removeClass(BX("GROUP_ADD_DEPT_HINT_block"),"visible")}return t};BX.BXGCE.unSelectCallback=function(e){if(typeof e=="undefined"||!BX.type.isNotEmptyString(e.name)||typeof e.item=="undefined"){return}var t=e.name,o=e.item;var i=typeof BX.BXGCESelectorManager.controls[t]!="undefined"&&typeof BX.BXGCESelectorManager.controls[t].single!="undefined"&&!!BX.BXGCESelectorManager.controls[t].single;var n=typeof BX.BXGCESelectorManager.controls[t]!="undefined"&&typeof BX.BXGCESelectorManager.controls[t].tagLinkText1!="undefined"&&BX.BXGCESelectorManager.controls[t].tagLinkText1.length>0?BX.BXGCESelectorManager.controls[t].tagLinkText1:BX.message("SONET_GCE_T_DEST_LINK_1");var a=typeof BX.BXGCESelectorManager.controls[t]!="undefined"&&typeof BX.BXGCESelectorManager.controls[t].tagLinkText2!="undefined"&&BX.BXGCESelectorManager.controls[t].tagLinkText2.length>0?BX.BXGCESelectorManager.controls[t].tagLinkText2:BX.message("SONET_GCE_T_DEST_LINK_2");BX.delegate(BX.SocNetLogDestination.BXfpUnSelectCallback,{formName:t,inputContainerName:"sonet_group_create_popup_users_item_post_"+t,inputName:"sonet_group_create_popup_users_input_post_"+t,tagInputName:"sonet_group_create_popup_users_tag_post_"+t,tagLink1:n,tagLink2:a})(o);if(!i){BX.SocNetLogDestination.BXfpSetLinkName({formName:t,tagInputName:"sonet_group_create_popup_users_tag_post_"+t,tagLink1:BX.message("SONET_GCE_T_DEST_LINK_1"),tagLink2:BX.message("SONET_GCE_T_DEST_LINK_2")})}else{BX.style(BX("sonet_group_create_popup_users_tag_post_"+t),"display","inline-block")}};BX.BXGCE.unSelectCallbackOld=function(e,t,o,i){BX.SocNetLogDestination.BXfpUnSelectCallback.apply(this,[e,t,o,i]);BX.BXGCE.showDepartmentHint(i)};BX.BXGCE.openDialogCallback=function(e){if(typeof e=="undefined"||!BX.type.isNotEmptyString(e.name)){return}var t=e.name;BX.PopupWindow.setOptions({popupZindex:2100});var o=typeof BX.BXGCESelectorManager.controls[t]!="undefined"&&typeof BX.BXGCESelectorManager.controls[t].single!="undefined"&&!!BX.BXGCESelectorManager.controls[t].single;if(o){BX("sonet_group_create_popup_users_input_post_"+t).style.display="inline-block"}BX.SocNetLogDestination.BXfpOpenDialogCallback.apply(this,arguments)};BX.BXGCE.openDialogCallbackOld=function(e){BX.BXGCE.openDialogCallback.apply(this,[{name:e}])};BX.BXGCE.closeDialogCallback=function(e){var t=typeof e!="undefined"&&BX.type.isNotEmptyString(e.name)?e.name:"";BX.SocNetLogDestination.BXfpCloseDialogCallback.apply(this,[t])};BX.BXGCE.bindActionLink=function(e){if(e===undefined||e==null){return}BX.bind(e,"click",function(t){BX.PopupMenu.destroy("invite-dialog-usertype-popup");var o=[{text:BX.message("SONET_GCE_T_DEST_EXTRANET_SELECTOR_INVITE"),id:"sonet_group_create_popup_action_invite",className:"menu-popup-no-icon",onclick:function(){BX.BXGCE.onActionSelect("invite")}},{text:BX.message("SONET_GCE_T_DEST_EXTRANET_SELECTOR_ADD"),id:"sonet_group_create_popup_action_add",className:"menu-popup-no-icon",onclick:function(){BX.BXGCE.onActionSelect("add")}}];var i={offsetLeft:-14,offsetTop:4,zIndex:1200,lightShadow:false,angle:{position:"top",offset:50},events:{onPopupShow:function(e){}}};BX.PopupMenu.show("sonet_group_create_popup_action_popup",e,o,i)})};BX.BXGCE.onActionSelect=function(e){if(e!="add"){e="invite"}BX.BXGCE.lastAction=e;BX("sonet_group_create_popup_action_title_link").innerHTML=BX.message("SONET_GCE_T_DEST_EXTRANET_SELECTOR_"+(e=="invite"?"INVITE":"ADD"));if(e=="invite"){BX("sonet_group_create_popup_action_block_invite").style.display="block";BX("sonet_group_create_popup_action_block_invite_2").style.display="block";BX("sonet_group_create_popup_action_block_add").style.display="none"}else{BX("sonet_group_create_popup_action_block_invite").style.display="none";BX("sonet_group_create_popup_action_block_invite_2").style.display="none";BX("sonet_group_create_popup_action_block_add").style.display="block"}BX("sonet_group_create_popup_action_block_"+e).style.display="block";BX("sonet_group_create_popup_action_block_"+(e=="invite"?"add":"invite")).style.display="none";BX.PopupMenu.destroy("sonet_group_create_popup_action_popup")};BX.BXGCE.showError=function(e){if(BX("sonet_group_create_error_block")){BX("sonet_group_create_error_block").innerHTML=e;BX.removeClass(BX("sonet_group_create_error_block"),"sonet-ui-form-error-block-invisible")}};BX.BXGCE.showMessage=function(){};BX.BXGCE.disableSubmitButton=function(e){e=!!e;var t=BX("sonet_group_create_popup_form_button_submit");if(t){if(e){BX.SocialnetworkUICommon.showButtonWait(t);BX.unbind(t,"click",BXGCESubmitForm)}else{BX.SocialnetworkUICommon.hideButtonWait(t);BX.bind(t,"click",BXGCESubmitForm)}}};BX.BXGCE.getCheckedValue=function(e){var t=false;if(!BX(e)){return t}if(e.type=="hidden"){t=e.value=="Y"}else if(e.type=="checkbox"){t=e.checked}return t};BX.BXGCE.setCheckedValue=function(e,t){if(!BX(e)){return}t=!!t;if(e.type=="checkbox"){e.checked=t}else{e.value=t?"Y":"N"}};BX.BXGCETagsForm=function(e){this.popup=null;this.addNewLink=null;this.hiddenField=null;this.popupContent=null;this.init(e)};BX.BXGCETagsForm.prototype.init=function(e){this.addNewLink=BX(e.addNewLinkId);this.tagsContainer=BX(e.containerNodeId);this.hiddenField=BX(e.hiddenFieldId);this.popupContent=BX(e.popupContentNodeId);this.popupInput=BX.findChild(this.popupContent,{tag:"input"});var t=BX.findChildren(this.tagsContainer,{className:"js-id-tdp-mem-sel-is-item-delete"},true);for(var o=0,i=t.length;o<i;o++){BX.bind(t[o],"click",BX.proxy(this.onTagDelete,{obj:this,tagBox:t[o].parentNode.parentNode,tagValue:t[o].parentNode.parentNode.getAttribute("data-tag")}))}BX.bind(this.addNewLink,"click",BX.proxy(this.onAddNewClick,this))};BX.BXGCETagsForm.prototype.onTagDelete=function(){BX.remove(this.tagBox);this.obj.hiddenField.value=this.obj.hiddenField.value.replace(this.tagValue+",","").replace("  "," ")};BX.BXGCETagsForm.prototype.show=function(){if(this.popup===null){this.popup=new BX.PopupWindow("bx-group-tag-popup",this.addNewLink,{content:this.popupContent,lightShadow:false,offsetTop:8,offsetLeft:10,autoHide:true,angle:true,closeByEsc:true,zIndex:-840,buttons:[new BX.PopupWindowButton({text:BX.message("SONET_GCE_T_TAG_ADD"),events:{click:BX.proxy(this.onTagAdd,this)}})]});BX.bind(this.popupInput,"keydown",BX.proxy(this.onKeyPress,this));BX.bind(this.popupInput,"keyup",BX.proxy(this.onKeyPress,this))}this.popup.show();BX.focus(this.popupInput)};BX.BXGCETagsForm.prototype.addTag=function(e){var t=BX.type.isNotEmptyString(e)?e.split(","):this.popupInput.value.split(",");var o=[];for(var i=0;i<t.length;i++){var n=BX.util.trim(t[i]);if(n.length>0){var a=this.hiddenField.value.split(",");if(!BX.util.in_array(n,a)){var s=null;var l=BX.create("span",{children:[BX.create("span",{props:{className:"js-id-tdp-mem-sel-is-item social-group-create-form-field-item"},children:[BX.create("a",{props:{className:"social-group-create-form-field-item-text"},text:n}),s=BX.create("span",{props:{className:"js-id-tdp-mem-sel-is-item-delete social-group-create-form-field-item-delete"}})]})],attrs:{"data-tag":n},props:{className:"js-id-tdp-mem-sel-is-items social-group-create-sliders-h-invisible"}});this.tagsContainer.insertBefore(l,this.addNewLink);BX.bind(s,"click",BX.proxy(this.onTagDelete,{obj:this,tagBox:l,tagValue:n}));this.hiddenField.value+=n+",";o.push(n)}}}return o};BX.BXGCETagsForm.prototype.onTagAdd=function(){this.addTag();this.popupInput.value="";this.popup.close()};BX.BXGCETagsForm.prototype.onAddNewClick=function(e){e=e||window.event;this.show();e.preventDefault()};BX.BXGCETagsForm.prototype.onKeyPress=function(e){e=e||window.event;var t=e.keyCode?e.keyCode:e.which?e.which:null;if(t==13){setTimeout(BX.proxy(this.onTagAdd,this),0)}};BX.BXGCESelectorInstance=function(e){this.single=typeof e!="undefined"&&typeof e.single!="undefined"&&!!e.single;this.controlName=typeof e!="undefined"&&typeof e.controlName!="undefined"?e.controlName:false;this.tagLinkText1=typeof e!="undefined"&&typeof e.tagLinkText1!="undefined"?e.tagLinkText1:"";this.tagLinkText2=typeof e!="undefined"&&typeof e.tagLinkText2!="undefined"?e.tagLinkText2:""};BX.BXGCESelectorInstance.prototype.init=function(e){BX.bind(BX(e.contId),"click",function(){var t=typeof e.id!="undefined"&&typeof BX.BXGCESelectorManager.controls[e.id]!="undefined"&&typeof BX.BXGCESelectorManager.controls[e.id].single!="undefined"&&!!BX.BXGCESelectorManager.controls[e.id].single;if(!t||BX("sonet_group_create_popup_users_item_post_"+e.id)&&BX("sonet_group_create_popup_users_item_post_"+e.id).children.length<=0){BX.onCustomEvent(window,"BX.BXGCE:open",[e])}})};BX.BXGCESelectorManager={controls:{}}})();
/* End */
;; /* /bitrix/components/bitrix/socialnetwork.group_menu/templates/.default/script.js?15349432634504*/
; /* /bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?15349432642527*/
; /* /bitrix/components/bitrix/socialnetwork.group_create.ex/templates/.default/script.min.js?153494384726625*/
