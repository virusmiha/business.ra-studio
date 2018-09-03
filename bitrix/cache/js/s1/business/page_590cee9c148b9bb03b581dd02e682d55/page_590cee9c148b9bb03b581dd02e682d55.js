
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
; /* /bitrix/components/bitrix/socialnetwork.message_form/templates/.default/script.js?153494326413038*/
