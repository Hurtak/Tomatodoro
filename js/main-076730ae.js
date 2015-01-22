var Config=function(){"use strict";var e=!1;window.location.search.indexOf("debug")>-1&&(e=!0);var t=document.title,i=!1,n=!1,r=1500,o=300,a=1200,s=4;return e&&(i=!0,n=!0,r=10,o=5,a=5,s=3,t="DEBUG"),{debug:e,appName:t,audio:i,notifications:n,workInterval:r,breakInterval:o,longbreakInterval:a,repeat:s}}(),Services={},Views={};Services.Storage=function(){"use strict";var e=function(e){return JSON.parse(localStorage.getItem(e))},t=function(e,t){localStorage.setItem(e,JSON.stringify(t))},i=function(){localStorage.clear()};return{set:t,get:e,clear:i}}(),Services.BrowserDetection=function(){"use strict";var e=!!window.opera||navigator.userAgent.indexOf(" OPR/")>=0,t="undefined"!=typeof InstallTrigger,i=Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor")>0,n=!!window.chrome&&!e,r=!1||!!document.documentMode;return{isOpera:e,isFirefox:t,isSafari:i,isChrome:n,isIE:r}}(),Services.Title=function(){"use strict";var e=function(e,t){var i="";t||(i="■ "),document.title=i+e+" – "+Config.appName},t=function(){document.title=Config.appName};return{setTitle:e,resetTitle:t}}(),Services.Favicon=function(){"use strict";var e=document.getElementById("favicon-ico"),t=function(){if(Services.BrowserDetection.isIE)for(var e=document.querySelectorAll("[data-favicon-explorer]"),t=0;t<e.length;t++)document.head.removeChild(e[t])},i=function(t){if(Services.BrowserDetection.isFirefox||Services.BrowserDetection.isIE)e.rel="shortcut icon",e.href="icons/favicon-"+t+".ico",e.id="favicon-ico";else{e=document.createElement("link");var i=document.getElementById("favicon-png");e.rel="icon",e.setAttribute("type","image/png"),e.href="icons/favicon-16x16-"+t+".png",e.setAttribute("sizes","16x16"),e.id="favicon-png",i&&document.head.removeChild(i),document.head.appendChild(e)}};return{init:t,setFavicon:i}}(),Services.Notification=function(){"use strict";var e=5,t=function(){return window.Notification?"granted"!==Notification.permission?(Notification.requestPermission(),!1):!0:!1},i=function(i,n){if(t()){var r=new Notification(Config.appName,{icon:"img/notification-96x96-"+n+".png",body:i});r.onshow=function(){setTimeout(function(){r.close()},1e3*e)}}};return{requestPermission:t,newNotification:i}}(),Services.Audio=function(){"use strict";var e,t=function(){e=document.createElement("audio"),e.src="audio/ding.mp3"},i=function(){e.play()},n=function(t){1>=t&&t>=0||(t=1),e.volume=t};return{init:t,play:i,setVolume:n}}(),Views.Timer=function(){"use strict";var e=document.getElementById("clock"),t=function(){return e.innerHTML.trim()},i=function(t){e.innerHTML=t};return{getTime:t,setTime:i}}(),Views.Progress=function(){"use strict";var e=document.getElementById("progress"),t=e.getElementsByTagName("i"),i=document.getElementById("description"),n={unfinished:"Unfinished interval",work:"Work interval","break":"Break interval",longbreak:"Long break interval",finished:"Finished interval"},r=function(e,i){t[i].className="icon-tomato color-"+e,t[i].title=n[e]},o=function(){c("");for(var e=0;e<t.length;e++)r("unfinished",e)},a=function(t){var i=document.createElement("i");i.className="icon-tomato color-"+t,i.title=n[t],e.appendChild(i)},s=function(){for(;e.firstChild;)e.removeChild(e.firstChild)},c=function(e){i.innerHTML=e};return{setDescription:c,setImageType:r,resetProgress:o,createImage:a,removeImages:s}}(),Views.Controls=function(){"use strict";var e=!0,t=document.getElementById("start"),i=document.getElementById("reset"),n=document.getElementById("skip"),r=document.getElementById("start-icon"),o=document.getElementById("start-caption"),a=function(){e?(o.innerHTML="pause",r.className="icon-pause-1"):(o.innerHTML="start",r.className="icon-play-1"),e=!e},s=function(){e||a()},c=function(){return t},u=function(){return i},l=function(){return n};return{getStartButton:c,getResetButton:u,getSkipButton:l,resetStartButton:s,toogleStartButtonCaption:a}}(),Views.Sidebar=function(){"use strict";var e=!1,t=document.getElementById("sidebar-button"),i=document.getElementById("sidebar-overlay"),n=function(){return i},r=function(){return t},o=function(){e||(document.body.setAttribute("data-sidebar-open",""),e=!0)},a=function(){e&&(document.body.removeAttribute("data-sidebar-open"),e=!1)},s=function(){e?a():o()},c=function(){return e};return{getSidebarOverlay:n,getSidebarButton:r,isSidebarOpen:c,closeSidebar:a,toogleSidebar:s}}(),Views.Settings=function(){"use strict";var e=document.getElementById("audio"),t=document.getElementById("audio-test"),i=document.getElementById("notifications"),n=document.getElementById("notifications-test"),r=document.getElementById("work-interval"),o=document.getElementById("break-interval"),a=document.getElementById("longbreak-interval"),s=document.getElementById("repeat"),c=document.getElementById("reset-settings");return{audio:e,audioTest:t,notifications:i,notificationsTest:n,workInterval:r,breakInterval:o,longbreakInterval:a,repeat:s,resetSettings:c}}();var Sidebar=function(){"use strict";var e=function(){Views.Sidebar.getSidebarButton().addEventListener("click",Views.Sidebar.toogleSidebar),Views.Sidebar.getSidebarOverlay().addEventListener("click",Views.Sidebar.closeSidebar)};return{init:e}}(),Settings=function(){"use strict";var e=function(e,t,i,n){var r=Math.floor(e);return r?1*t>r?r=t:r>1*i&&(r=i):r=n,r},t=function(){var t=Services.Storage.get("audio");null!==t&&(Config.audio=t);var i=Services.Storage.get("notifications");null!==i&&(Config.notifications=i),Config.workInterval=Services.Storage.get("workInterval")||Config.workInterval,Config.breakInterval=Services.Storage.get("breakInterval")||Config.breakInterval,Config.longbreakInterval=Services.Storage.get("longbreakInterval")||Config.longbreakInterval,Config.repeat=Services.Storage.get("repeat")||Config.repeat,Views.Settings.audio.checked=Config.audio,Views.Settings.notifications.checked=Config.notifications,Views.Settings.workInterval.value=Config.workInterval/60,Views.Settings.breakInterval.value=Config.breakInterval/60,Views.Settings.longbreakInterval.value=Config.longbreakInterval/60,Views.Settings.repeat.value=Config.repeat,Views.Settings.audio.addEventListener("click",function(){Config.audio=this.checked,Services.Storage.set("audio",Config.audio)}),Views.Settings.notifications.addEventListener("click",function(){Config.notifications=this.checked,Config.notifications===!0&&Services.Notification.requestPermission(),Services.Storage.set("notifications",Config.notifications)}),Views.Settings.audioTest.addEventListener("click",function(){Services.Audio.play()}),Views.Settings.notificationsTest.addEventListener("click",function(){Services.Notification.newNotification("Web notification test","work")}),Views.Settings.workInterval.addEventListener("blur",function(){this.value=e(this.value,this.min,this.max,Config.workInterval/60),Config.workInterval=60*this.value,Timer.updateIntervals(),Services.Storage.set("workInterval",Config.workInterval)}),Views.Settings.breakInterval.addEventListener("blur",function(){this.value=e(this.value,this.min,this.max,Config.breakInterval/60),Config.breakInterval=60*this.value,Timer.updateIntervals(),Services.Storage.set("breakInterval",Config.breakInterval)}),Views.Settings.longbreakInterval.addEventListener("blur",function(){this.value=e(this.value,this.min,this.max,Config.longbreakInterval/60),Config.longbreakInterval=60*this.value,Timer.updateIntervals(),Services.Storage.set("longbreakInterval",Config.longbreakInterval)}),Views.Settings.repeat.addEventListener("input",function(){this.value=e(this.value,this.min,this.max,Config.repeat),Config.repeat=1*this.value,Views.Progress.removeImages(),Timer.init(),Services.Storage.set("repeat",Config.repeat)}),Views.Settings.resetSettings.addEventListener("click",function(){var e=confirm("Are you sure?");e&&(Services.Storage.clear(),location.reload(!1))}),Config.notifications===!0&&Services.Notification.requestPermission()};return{init:t}}(),Timer=function(){"use strict";var e,t,i,n=[],r=100,o=function(){a(),e=Services.Storage.get("intervalIndex")||0,t=Services.Storage.get("timerInterval")||Config.workInterval,e>n.length-1&&(e=e%2===0?n.length-2:n.length-1);for(var i=0;i<Config.repeat;i++)Views.Progress.createImage("unfinished");for(var r=0;e>=r;r++)l(r,!0);0===e&&t<Config.workInterval&&(Views.Progress.setImageType("work",0),Views.Progress.setDescription("work")),0===e&&t===Config.workInterval?Services.Title.resetTitle():Services.Title.setTitle(s(t)),Views.Controls.getStartButton().addEventListener("click",v),Views.Controls.getSkipButton().addEventListener("click",g),Views.Controls.getResetButton().addEventListener("click",m)},a=function(){n=[];for(var e=0;e<Config.repeat;e++)n.push(Config.workInterval),n.push(Config.breakInterval);n.pop(),n.push(Config.longbreakInterval)},s=function(e){var t=function(e){return 10>e&&(e="0"+e),e},i=Math.floor(e/60);return e%=60,t(i)+":"+t(e)},c=function(){t--,0>=t&&u();var e=s(t);Views.Timer.setTime(e),Services.Title.setTitle(e,i),Services.Storage.set("timerInterval",t)},u=function(r){r=r||!1,e++,e>n.length-1&&(e=0,m()),t=n[e],l(e,r),Services.Storage.set("intervalIndex",e),r&&(i&&(d(),f()),Services.Title.setTitle(s(t),i),Services.Storage.set("intervalIndex",e),Services.Storage.set("timerInterval",t))},l=function(e,i){var r=Math.floor(e/2);Views.Timer.setTime(s(t)),e===n.length-1?(Services.Favicon.setFavicon("longbreak"),!i&&Config.notifications&&(Services.Notification.newNotification(Config.longbreakInterval/60+" minute long break","longbreak"),Services.Audio.play()),Views.Progress.setDescription("long break"),Views.Progress.setImageType("longbreak",r)):0===e?(Services.Favicon.setFavicon("work"),i||(Config.notifications&&Services.Notification.newNotification("Done","work"),Config.audio&&Services.Audio.play())):e%2===0?(Services.Favicon.setFavicon("work"),i||(Config.notifications&&Services.Notification.newNotification(Config.workInterval/60+" minute work","work"),Config.audio&&Services.Audio.play()),Views.Progress.setDescription("work"),Views.Progress.setImageType("work",r),Views.Progress.setImageType("finished",r-1)):e%2===1&&(Services.Favicon.setFavicon("break"),i||(Config.notifications&&Services.Notification.newNotification(Config.breakInterval/60+" minute break","break"),Config.audio&&Services.Audio.play()),Views.Progress.setDescription("break"),Views.Progress.setImageType("break",r))},g=function(){u(!0)},v=function(){i?d():f(),Services.Title.setTitle(s(t),i),Views.Controls.toogleStartButtonCaption(),0===e&&(Views.Progress.setImageType("work",0),Views.Progress.setDescription("work"))},f=function(){var e=0,t=new Date;i=setInterval(function(){e+=(new Date).getTime()-t.getTime(),e>=1e3&&(c(),e-=1e3),t=new Date},r)},d=function(){i=clearInterval(i)},m=function(){d(),e=0,t=Config.workInterval;var i=s(t);Views.Timer.setTime(i),Views.Controls.resetStartButton(),Services.Title.resetTitle(),Services.Favicon.setFavicon("work"),Services.Storage.set("intervalIndex",e),Services.Storage.set("timerInterval",t),Views.Progress.resetProgress()};return{init:o,updateIntervals:a,startTimer:v,pauseTimer:d,skipInterval:g,resetTimer:m}}(),Hotkeys=function(){"use strict";var e={space:32,enter:13,esc:27,tab:9,r:82,s:83,h:72},t=function(){document.addEventListener("keydown",i)},i=function(t){switch(t=t||window.event,t.keyCode){case e.space:t.preventDefault(),Timer.startTimer();break;case e.esc:Views.Sidebar.closeSidebar();break;case e.r:Timer.resetTimer();break;case e.s:Timer.skipInterval();break;case e.h:Views.Sidebar.toogleSidebar();break;case e.tab:Views.Sidebar.isSidebarOpen()||t.preventDefault();break;case e.enter:t.preventDefault()}};return{init:t}}();!function(){"use strict";Services.Favicon.init(),Services.Audio.init(),Settings.init(),Sidebar.init(),Timer.init(),Hotkeys.init()}();