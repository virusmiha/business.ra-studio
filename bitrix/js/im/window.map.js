{"version":3,"sources":["window.js"],"names":["window","BX","MessengerWindow","this","popupConfirm","BXIM","popup","backgroundSelector","content","contentFullWindow","contentBodyWindow","contentMenu","contentAvatar","contentTab","contentTabContent","currentTab","currentTabTarget","lastTab","lastTabTarget","tabItems","tabRedrawTimeout","userInfo","id","name","gender","avatar","profile","inited","width","height","initWidth","initHeight","minWidth","minHeight","prototype","init","params","bxim","context","design","popupBackground","apps","addClass","bind","delegate","closePopup","scrollSize","innerWidth","document","documentElement","clientWidth","onCustomEvent","body","parentNode","PreventDefault","e","backgroundChange","localStorage","set","value","imFullscreenBackground","get","create","attrs","className","insertBefore","firstChild","MessengerCommon","preventDefault","hasClass","offsetWidth","style","desktop","apiReady","enableInVersion","PULL","tryConnectSet","notSupported","disableLogin","browser","SupportLocalStorage","addCustomEvent","storageSet","isDesktop","addTab","title","message","order","target","events","open","logout","adjustSize","browse","url","location","href","getCurrentUrl","protocol","hostname","port","windowReload","reload","terminate","reason","skipCheck","innerHeight","setFirstHeight","popupFullscreenSizeTop","popupFullscreenSizeBottom","popupPos","pos","top","Math","max","setTimeout","offsetHeight","BXDesktopWindow","SetProperty","Width","Height","IsMobile","openConfirm","text","buttons","modal","destroy","length","PopupWindowButton","click","popupWindow","close","PopupWindow","zIndex","autoHide","closeByEsc","overlay","onPopupClose","onPopupDestroy","props","html","show","popupContainer","contentContainer","element","addSeparator","type","Date","drawTabs","hide","parseInt","badge","initContent","isDomNode","hideTab","showTab","existsTab","force","clearTimeout","drawAppearance","innerHTML","arTabs","util","objectSort","i","drawTab","changeTab","updateTabBadge","appendChild","data-id","children","isActive","contentBox","bindDelegate","event","tabId","skipFireEvent","proxy_context","getAttribute","fireEvent","removeClass","closeTab","getCurrentTab","setTabBadge","counter","findChild","setTabContent","getCurrentTabTarget","setUserInfo","openMessenger","userId","htmlspecialcharsback","src","isBlankAvatar","color","updateUserInfo","getUserInfo","isPopupShow","backgroundImage","showPopup","dialogId","popupTimestart","popupTimeout","webrtc","callOverlay","messenger","popupMessengerFullHeight","callInit","key"],"mappings":"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","file":""}