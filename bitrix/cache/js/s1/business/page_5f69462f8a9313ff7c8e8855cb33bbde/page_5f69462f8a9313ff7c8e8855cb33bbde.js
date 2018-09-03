
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
; /* Start:"a:4:{s:4:"full";s:99:"/bitrix/components/bitrix/socialnetwork.user_friends.ex/templates/.default/script.js?15349432647485";s:6:"source";s:84:"/bitrix/components/bitrix/socialnetwork.user_friends.ex/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
var waitDiv = null;
var waitPopup = null;
var waitTimeout = null;
var waitTime = 500;

function __UFEtoggleCheckbox(ev, block, user_code)
{
	ev = ev || window.event;

	if (user_code == 'undefined' || !user_code)
		return false;

	var type = user_code.substr(0, 1);
	var user_id_tmp = parseInt(user_code.substr(1));
	
	switch (type) {
		case 'F':
			if (BX.util.in_array(user_id_tmp, actionUsers['Friends']))
				actionUsers['Friends'].splice(BX.util.array_search(user_id_tmp, actionUsers['Friends']), 1);
			else
				actionUsers['Friends'][actionUsers['Friends'].length] = user_id_tmp;		
			break;
		case 'B':
			if (BX.message("UFEUseBan") == "Y")
			{
				if (BX.util.in_array(user_id_tmp, actionUsers['Banned']))
					actionUsers['Banned'].splice(BX.util.array_search(user_id_tmp, actionUsers['Banned']), 1);
				else
					actionUsers['Banned'][actionUsers['Banned'].length] = user_id_tmp;		
			}
			break;
		default:
			return false;
	}

	var check_box = BX.findChild(block, { tagName: 'input' }, true, false);

	if(ev.target == check_box || ev.srcElement == check_box){
		BX.toggleClass(block.parentNode, 'sonet-members-member-block-active');
		return false;
	}
	else{
		BX.toggleClass(block.parentNode, 'sonet-members-member-block-active');
		check_box.checked = check_box.checked == true ? false : true;
	}

	BX.PreventDefault(ev);
}

function __UFEShowMenu(bindElement, type)
{
	if (!type)
		type = 'friends';

	var arItems = [];

	if (type == 'friends')
	{
		if (BX.message("UFEIsCurrentUser"))
		{
			arItems[arItems.length] = { text : BX.message('UFEAddToFriendsTitle'), className : "menu-popup-no-icon", href: BX.message('UFEPathToUserSearch') };
			arItems[arItems.length] = { text : BX.message('UFEExcludeFromFriendsTitle'), className : "menu-popup-no-icon", onclick : function(e) { __UFEExcludeFromFriends(this.popupWindow); return BX.PreventDefault(e); } };

			if (BX.message("UFEUseBan") == "Y")
				arItems[arItems.length] = { text : BX.message('UFEBanTitle'), className : "menu-popup-no-icon", onclick : function(e) { __UFEBan(this.popupWindow); return BX.PreventDefault(e); } };
		}
	}
	else if (type == 'ban')
	{
		if (BX.message("UFEIsCurrentUser"))
			arItems[arItems.length] = { text : BX.message('UFEUnBanTitle'), className : "menu-popup-no-icon", onclick : function(e) { __UFEUnBan(this.popupWindow); return BX.PreventDefault(e); } };
	}

	if (arItems.length > 0)
	{
		var arParams = {
			offsetLeft: -32,
			offsetTop: 4,
			lightShadow: false,
			angle: {position: 'top', offset : 60}
		};

		BX.PopupMenu.show("ufe-menu-" + type, bindElement, arItems, arParams);
	}

}

function __UFEExcludeFromFriends(popup)
{
	if(confirm(BX.message('UFEExcludeFromFriendsConfirmTitle'))) 
	{
		if (actionUsers['Friends'].length > 0)
		{
			__UFEShowWait();
			BX.ajax({
				url: '/bitrix/components/bitrix/socialnetwork.user_friends.ex/ajax.php',
				method: 'POST',
				dataType: 'json',
				data: {'ACTION': 'EX', 'USER_ID': parseInt(BX.message('UFEUserId')), 'FRIEND_ID' : actionUsers['Friends'], 'sessid': BX.bitrix_sessid(), 'site': BX.util.urlencode(BX.message('UFESiteId'))},
				onsuccess: function(data) { __UFEProcessAJAXResponse(data, popup); }
			});
		}
		else
			__UFEShowError(BX.message('UFEErrorFriendIDNotDefined'));
	} 
}

function __UFEBan(popup)
{
	if (actionUsers['Friends'].length > 0)
	{
		__UFEShowWait();
		BX.ajax({
			url: '/bitrix/components/bitrix/socialnetwork.user_friends.ex/ajax.php',
			method: 'POST',
			dataType: 'json',
			data: {'ACTION': 'BAN', 'USER_ID': parseInt(BX.message('UFEUserId')), 'FRIEND_ID' : actionUsers['Friends'], 'sessid': BX.bitrix_sessid(), 'site': BX.util.urlencode(BX.message('UFESiteId'))},
			onsuccess: function(data) { __UFEProcessAJAXResponse(data, popup); }
		});
	}
	else
		__UFEShowError(BX.message('UFEErrorFriendIDNotDefined'));
}

function __UFEUnBan(popup)
{
	if (actionUsers['Banned'].length > 0)
	{
		__UFEShowWait();
		BX.ajax({
			url: '/bitrix/components/bitrix/socialnetwork.user_friends.ex/ajax.php',
			method: 'POST',
			dataType: 'json',
			data: {'ACTION': 'UNBAN', 'USER_ID': parseInt(BX.message('UFEUserId')), 'FRIEND_ID' : actionUsers['Banned'], 'sessid': BX.bitrix_sessid(), 'site': BX.util.urlencode(BX.message('UFESiteId'))},
			onsuccess: function(data) { __UFEProcessAJAXResponse(data, popup); }
		});
	}
	else
		__UFEShowError(BX.message('UFEErrorFriendIDNotDefined'));
}

function __UFEProcessAJAXResponse(data, popup)
{
	if (popup == 'undefined' || popup == null || !popup.isShown())
		return false;

	if (data["SUCCESS"] != "undefined" && data["SUCCESS"] == "Y")
	{
		popup.close();
		BX.reload();
	}
	else if (data["ERROR"] != "undefined" && data["ERROR"].length > 0)
	{
		if (data["ERROR"].indexOf("USER_ACTION_FAILED", 0) === 0)
		{
			__UFEShowError(BX.message('UFEErrorActionFailedPattern').replace("#ERROR#", data["ERROR"].substr(20)));
			return false;
		}
		else if (data["ERROR"].indexOf("SESSION_ERROR", 0) === 0)
		{
			__UFEShowError(BX.message('UFEErrorSessionWrong'));
			BX.reload();
		}
		else if (data["ERROR"].indexOf("USER_FRIEND_NO_PERMS", 0) === 0)
		{
			__UFEShowError(BX.message('UFEErrorNoPerms'));
			return false;
		}
		else if (data["ERROR"].indexOf("FRIEND_ID_NOT_DEFINED", 0) === 0)
		{
			__UFEShowError(BX.message('UFEErrorFriendIDNotDefined'));
			return false;
		}
		else if (data["ERROR"].indexOf("FRIEND_ID_INCORRECT_2", 0) === 0)
		{
			__UFEShowError(BX.message('UFEErrorFriendIDIncorrect2'));
			return false;
		}
		else if (data["ERROR"].indexOf("USER_ID_NOT_DEFINED", 0) === 0)
		{
			__UFEShowError(BX.message('UFEErrorUserIdNotDefined'));
			return false;
		}
		else if (data["ERROR"].indexOf("CURRENT_USER_NOT_AUTH", 0) === 0)
		{
			__UFEShowError(BX.message('UFEErrorCurrentUserNotAuthorized'));
			return false;
		}
		else if (data["ERROR"].indexOf("SONET_MODULE_NOT_INSTALLED", 0) === 0)
		{
			__UFEShowError(BX.message('UFEErrorModuleNotInstalled'));
			return false;
		}
		else
		{
			__UFEShowError(data["ERROR"]);
			return false;		
		}
	}
}
				
function __UFEShowError(errorText) 
{
	__UFECloseWait();

	var errorPopup = new BX.PopupWindow('ufe-error' + Math.random(), window, {
		autoHide: true,
		lightShadow: false,
		zIndex: 2,
		content: BX.create('DIV', {props: {'className': 'sonet-members-error-text-block'}, html: errorText}),
		closeByEsc: true,
		closeIcon: true
	});
	errorPopup.show();

}

function __UFEShowWait(timeout)
{
	if (timeout !== 0)
	{
		return (waitTimeout = setTimeout(function(){
			__UFEShowWait(0)
		}, 50));
	}

	if (!waitPopup)
	{
		waitPopup = new BX.PopupWindow('ufe_wait', window, {
			autoHide: true,
			lightShadow: true,
			zIndex: 2,
			content: BX.create('DIV', {
				props: {
					className: 'sonet-members-wait-cont'
				},
				children: [
					BX.create('DIV', {
						props: {
							className: 'sonet-members-wait-icon'
						}
					}),
					BX.create('DIV', {
						props: {
							className: 'sonet-members-wait-text'
						},
						html: BX.message('UFEWaitTitle')
					})
				]
			})
		});
	}
	else
		waitPopup.setBindElement(window);

	waitPopup.show();
}

function __UFECloseWait()
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
;; /* /bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?15349432642527*/
; /* /bitrix/components/bitrix/socialnetwork.user_friends.ex/templates/.default/script.js?15349432647485*/
; /* /bitrix/components/bitrix/socialnetwork.message_form/templates/.default/script.js?153494326413038*/
