
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
; /* Start:"a:4:{s:4:"full";s:92:"/bitrix/components/bitrix/main.app.passwords/templates/.default/script.min.js?15349431792760";s:6:"source";s:73:"/bitrix/components/bitrix/main.app.passwords/templates/.default/script.js";s:3:"min";s:77:"/bitrix/components/bitrix/main.app.passwords/templates/.default/script.min.js";s:3:"map";s:77:"/bitrix/components/bitrix/main.app.passwords/templates/.default/script.map.js";}"*/
function bx_app_pass_toggle(s){if(BX.hasClass(s,"open")){BX.removeClass(s,"open");BX.addClass(s,"close")}else{BX.removeClass(s,"close");BX.addClass(s,"open")}return false}function bx_app_pass_show_create_window(s){s=BX(s);var a={SYSCOMMENT:s.SYSCOMMENT?s.SYSCOMMENT.value:"",COMMENT:s.COMMENT.value,APPLICATION_ID:s.APPLICATION_ID.value,action:"add",sessid:BX.message("bitrix_sessid")};var e={method:"POST",dataType:"json",url:"/bitrix/components/bitrix/main.app.passwords/ajax.php",data:a,onsuccess:function(s){BX.removeClass(BX("bx_app_pass_close_button"),"wait");if(s.success===true){var e=BX("bx_app_pass_lottery");BX.removeClass(e,"bx-otp-popup-lottery-black");BX.addClass(e,"bx-otp-popup-lottery-white");BX("bx_app_pass_password").innerHTML=s.password;var t=[{className:"bx-otp-access-table-param",content:BX.util.htmlspecialchars(a.SYSCOMMENT)+"\n"+"<small>"+BX.util.htmlspecialchars(a.COMMENT)+"</small>"},{className:"bx-otp-access-table-value",content:s.date_create},{className:"bx-otp-access-table-value",content:""},{className:"bx-otp-access-table-value",content:""},{className:"bx-otp-access-table-action",content:'<a class="bx-otp-btn big lightgray mb0" href="javascript:void(0);" onclick="bx_app_pass_show_delete_window('+s.id+')">'+bx_app_pass_mess.deleteButton+"</a>"}];var p=BX("bx_app_pass_table_"+a.APPLICATION_ID);var o=p.insertRow(p.rows.length-1);o.id="bx_app_pass_row_"+s.id;for(var l in t){var _=o.insertCell(-1);_.className=t[l].className;_.innerHTML=t[l].content}}else{alert(s.message)}}};var t=BX.PopupWindowManager.create("bx_app_pass_create",null,{autoHide:false,offsetLeft:0,offsetTop:0,overlay:true,closeByEsc:true,closeIcon:{right:"12px",top:"10px"},content:BX("bx_app_pass_new_password")});BX("bx_app_pass_password").innerHTML="";var p=BX("bx_app_pass_lottery");BX.removeClass(p,"bx-otp-popup-lottery-white");BX.addClass(p,"bx-otp-popup-lottery-black");BX.addClass(BX("bx_app_pass_close_button"),"wait");t.show();BX.ajax(e)}function bx_app_pass_show_delete_window(s){var a={ID:s,action:"delete",sessid:BX.message("bitrix_sessid")};var e={method:"POST",dataType:"json",url:"/bitrix/components/bitrix/main.app.passwords/ajax.php",data:a,onsuccess:function(a){BX.removeClass(BX("bx_app_pass_del_button"),"wait");if(a.success===true){BX("bx_app_pass_row_"+s).style.display="none";t.close()}else{alert(a.message)}}};BX.removeClass(BX("bx_app_pass_del_button"),"wait");var t=BX.PopupWindowManager.create("bx_app_pass_delete",null,{autoHide:false,offsetLeft:0,offsetTop:0,overlay:true,closeByEsc:true,closeIcon:{right:"12px",top:"10px"},content:BX("bx_app_pass_delete_password")});BX("bx_app_pass_del_button").onclick=function(){BX.addClass(BX("bx_app_pass_del_button"),"wait");BX.ajax(e)};t.show()}
/* End */
;; /* /bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?15349432642527*/
; /* /bitrix/components/bitrix/main.app.passwords/templates/.default/script.min.js?15349431792760*/

//# sourceMappingURL=page_d9dce7a8e2b6419f501998e79b2e9af8.map.js