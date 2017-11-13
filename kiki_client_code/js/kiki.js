console.log("%c kiki js initd!!", 'background: #222; color: #bada55');
console.log("href", window.location.href);
if(!console.debug){
	console.debug = console.log;
}

var NEWSFEED_LAST_FLAG = false;

var _KIKI_PROFILE_DIV_SELECTED = 0;
var _KIKI_FRIENDS_DIV_SELECTED = 1;
var _KIKI_NEWSFEED_DIV_SELECTED = 2;
var _KIKI_RANKING_DIV_SELECTED = 3;


var _KIKI_CUR_NEWSFEED_PAGE = 0;


var _KIKI_COMMON_PROPS = {
	"animateanimateCompleteFlag" : true,
	"displayDashBoard" : true
}

window._kikiInitProfData = {
	levelId : 0,
	minPoint : 0,
	nextminPoint : 0,
	ranking : 0,
	userPoint : 0
}

window.kikiReady = false;
//window.kikiReadyFunc = false; 

window._kikiBaseUrl = "http://gamekiki.com/kiki_client_modules";
window._kikiHTMLPath = window._kikiBaseUrl + "/" + "php" + "/" + "widgetContents.php?filename=";
window._kikiPaths = {
	users : "http://gamekiki.com",
	badge : "http://gamekiki.com/data/badge"
};

window._kikiAsyncInit = function(){
	
	for(var i =0; i < window.kikiTemplates.length; i++){
		if(document.querySelector(window.kikiTemplates[i].className)){
			window.kikiTemplates[i].initWidget({
				appId : window.kikiOption.appId
				//userID : window.kikiOption.userID
			});
		}
	}
} 
   
window.kikiUtil = {
	getTemplateByClassName : function(className){
		for(var i =0; i < kikiTemplates.length; i++){
			if(kikiTemplates[i].className == className){
				return kikiTemplates[i];
			}
		}
		return false;
	},
	addScripts : function(scriptsToLoad, callback, context, prop){
        var callback_ = callback;
        var context_ = context;
        var prop_ = prop;
        function loadNextScript() {
            var done = false;
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.onreadystatechange = function () {
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    scriptLoaded();
                }
            }
            script.onload = scriptLoaded;
            script.src = scriptsToLoad.shift(); // grab next script off front of array
            head.appendChild(script);

            function scriptLoaded() {
                // check done variable to make sure we aren't getting notified more than once on the same script
                if (!done) {
                    script.onreadystatechange = script.onload = null;   // kill memory leak in IE
                    done = true;
                    if (scriptsToLoad.length != 0) {
                        loadNextScript();
                    }else{
                        // window.gamebinAsyncInit();
                        callback_.call(context_, prop_);
                    }
                }
            }
        }
        loadNextScript();
    },
	addCss : function(filenames){
        for(var i =0; i < filenames.length; i++){
            var b = document.createElement("link");
            b.type = "text/css", b.rel = "stylesheet", b.href = filenames[i], document.getElementsByTagName("head")[0].appendChild(b)                    
        }
    },
	requestSendMsg : function(name, reqParamArry){
		console.debug("%c about to send message", 'background: #222; color: #bada55',"name", name, "arry", reqParamArry);
		try{
			window.kikiDOMUtil.isRequesting = true;
			window.kikiDOMUtil.showSpinner(true);
			window.kiki.g_conn.sendMessage(name, reqParamArry)
		}catch(e){
			console.log("kiki sendMessage exception : " + e)
			window.kikiDOMUtil.isRequesting = false;
			window.kikiDOMUtil.showSpinner(false);	
		};
	}
}	

window.kikiNumUtil = {
	commafy : function(num) {
        var str = num.toString().split('.');
        if (str[0].length >= 5) {
            str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
        }
        if (str[1] && str[1].length >= 5) {
            str[1] = str[1].replace(/(\d{3})/g, '$1 ');
        }
        return str.join('.');
    },
	getTimeDiff : function(oldDate, curDate){
        var _MS_PER_DAY = 1000 * 60 * 60 * 24;
        var _MS_PER_HOUR = 1000 * 60 * 60;
        var _MS_PER_MIN = 1000 * 60;
        // Discard the time and time-zone information.
        var utc1 = Date.UTC(oldDate.getFullYear(), oldDate.getMonth(), oldDate.getDate());
        var utc2 = Date.UTC(curDate.getFullYear(), curDate.getMonth(), curDate.getDate());
        var dayDiff = Math.floor((utc2 - utc1) / _MS_PER_DAY);
        var hourDiff = Math.floor((utc2 - utc1) / _MS_PER_HOUR);
        var minDiff = Math.floor((utc2 - utc1) / _MS_PER_MIN);
        return (dayDiff > 0)? dayDiff + "days ago" : (hourDiff > 0)?  hourDiff + "hours ago" : minDiff + "minutes ago";
    },
	getNextLvPercentage : function(userPnt, nextLvMinPnt, prevLvMinPts){
        return ((userPnt - prevLvMinPts) / (nextLvMinPnt - prevLvMinPts) * 100);
    }
}

window.kikiDOMUtil = {
	 isRequesting : false,
	 showSpinner : function(flag){
		 console.debug("showSpinner call", flag);
		for(var i =0; i < kikiTemplates.length; i++){	
			var baseClass = kikiTemplates[i].className;
			var loadingSpinner = document.querySelector(baseClass + " #lodingScroll");
			if(loadingSpinner){
				console.debug("loadingSpinner", loadingSpinner, flag);
				loadingSpinner.style.display= flag? "block" : "none";
			}				
		}
	 },
	 showSection : function(selectedNum, baseClass){
       var targetTemplate = window.kikiUtil.getTemplateByClassName(baseClass);
		if(!targetTemplate) return;
		window.kikiDOMUtil.hideAllSection(baseClass);
        switch(parseInt(selectedNum)){
            case _KIKI_PROFILE_DIV_SELECTED :
                console.log("send profile req", selectedNum);
				var targetDiv = document.querySelector(baseClass);
				targetDiv.querySelector(".kiki-header > p").innerHTML = "프로필";
				window.kikiUtil.requestSendMsg("profile", null);
				document.querySelector(baseClass + " " + ".kiki-profile-nav").style.display="block";
                break;
            case _KIKI_FRIENDS_DIV_SELECTED :
				 var frdNav = document.querySelector(baseClass + " " + ".kiki-friends-nav");
                frdNav.style.display="block";
				// old kikiBottom, left, right case
				if(document.querySelector(".kiki-soci-title")){
					frdNav.querySelector(".kiki-soci-title").innerHTML = "추천친구";					
				}
				
				if(!frdNav.querySelector(".kiki-loading-text")){
					var div = document.createElement("div");
					div.className = "kiki-loading-text";
					div.style.color="Black";
					div.innerHTML = window.kiki.loginFlag? "<center>추천친구 검색중입니다...</center>" : "<center>로그인해주세요</center>";
					var tit = document.querySelector(baseClass + " " + ".kiki-soci-title");
					if(tit){tit.parentNode.insertBefore(div, tit.nextSibling)};	
					
					// new kikiBottom case
					if(document.querySelector(".friends-box")){
						document.querySelector(".friends-box > ul").appendChild(div);
					}
				}               
				targetTemplate.frdSectFlag = true;
				var targetTemplate = window.kikiUtil.getTemplateByClassName(".kikiBottom");		
				targetTemplate.frdCommonCallback(document.querySelector(".kikiBottom #kiki_frd_bottom_reccfrd"));
				document.querySelector(baseClass + " .search_input").value = "";
				document.querySelector(baseClass +  " .kiki-header > p").innerHTML = "친구";		
               

				window.kikiUtil.requestSendMsg("sugfriend", null);					
				
				//this.setFriendData(frdRcmdData);
                break;
            case _KIKI_NEWSFEED_DIV_SELECTED :
				targetTemplate.clearData("newsfeed");
				document.querySelector(baseClass  + " .kiki-newsfeed-nav").setAttribute("feedPage", 1);
				if(document.querySelector(baseClass + ' .kiki-newsfeed-nav' + " .kiki-tabcont")){
					document.querySelector(baseClass + ' .kiki-newsfeed-nav' + " .kiki-tabcont").setAttribute("feedPage", 1);				
					document.querySelector(baseClass + ' .kiki-newsfeed-nav' + " .kiki-tabcont").setAttribute("reqeustType", "feed");
					document.querySelector(baseClass + " .kiki-newsfeed-nav .kiki-tabcont").setAttribute("isFrd", "N");
					document.querySelector(baseClass + " .kiki-newsfeed-nav .kiki-tabcont").setAttribute("isMine", "N");
				}
				window.kiki.isProfileNewsfeed = false;					
				window.kikiUtil.requestSendMsg("feed", [1 + "", "N", "N"]);
				document.querySelector(baseClass + " " + ".kiki-newsfeed-nav").style.display="block";
                document.querySelector(baseClass +  " .kiki-header > p").innerHTML = "뉴스피드";		
				break;
            case _KIKI_RANKING_DIV_SELECTED :
				targetTemplate.clearData("ranking");				
				document.querySelector(baseClass  + " .kiki-ranking-nav").setAttribute("feedPage", 1);
				if(document.querySelector(baseClass + ' .kiki-ranking-nav' + " .kiki-tabcont")){
					document.querySelector(baseClass + ' .kiki-ranking-nav' + " .kiki-tabcont").setAttribute("feedPage", 1);				
					document.querySelector(baseClass + ' .kiki-ranking-nav' + " .kiki-tabcont").setAttribute("reqeustType", "ranking");
					document.querySelector(baseClass + " .kiki-ranking-nav .kiki-tabcont").setAttribute("isFrd", "N");
					document.querySelector(baseClass + " .kiki-ranking-nav .kiki-tabcont").setAttribute("isMine", "N");
				}
				document.querySelector(baseClass + " " + ".kiki-ranking-nav").style.display="block";            
				document.querySelector(baseClass +  " .kiki-header > p").innerHTML = "랭킹";
		
				window.kikiUtil.requestSendMsg("ranking", [1, "N", 'null']);
				 break;					
        }
    },
	linkTab : function(div, num, baseClassName, aTagClass, templateNum){
        div.setAttribute("numTag", num);			
        div.setAttribute("baseClass", baseClassName);
		div.setAttribute("aTagClass", aTagClass)
        div.onclick = function(e){
			// 클릭 이후 스크롤링 방지
			e.preventDefault();			
			if(window.kikiDOMUtil.isRequesting){
				return
			}
			
            var baseClass = this.getAttribute("baseClass");
			var targetTemplate = window.kikiUtil.getTemplateByClassName(baseClass);
			//클릭이후 애니메이션 끝날때까지 재클릭 방지
			//if(!targetTemplate.animateCompleteFlag) return;
			var alreadyAnimated = false;

			// 기존에 클릭한 탭이라면 animateDashBoard 호출
			if(this.className == "selected"){
				window.kikiDOMUtil.animateDashBoard(baseClass, targetTemplate.animateDirection, targetTemplate.animateVector, targetTemplate.animateCallback);				
				alreadyAnimated  = true;
			}
			
			if(!targetTemplate.displayDashBoard && this.className != "selected"){
				window.kikiDOMUtil.animateDashBoard(baseClass, targetTemplate.animateDirection, targetTemplate.animateVector, targetTemplate.animateCallback);		
			}
			
            // block friends tab click for left, right widgets
            if((baseClass != ".kikiBottom") && (this.getAttribute("numTag") == _KIKI_FRIENDS_DIV_SELECTED)){
                return
            }
            aTagObjs = document.querySelectorAll(baseClass + " " + div.getAttribute("aTagClass"));
            for(var i =0; i < aTagObjs.length; i++){
                aTagObjs[i].className = "";
            }
            this.className = !alreadyAnimated? "selected" : "";
			 this.className += " on";
			window.kikiDOMUtil.showSection(this.getAttribute("numTag"), baseClass);
        }
    },
	hideAllSection : function(className){
        var nodes = document.querySelectorAll(className + " " + ".kiki-content");
        for(var i =0; i < nodes.length; i++){
            nodes[i].style.display = "none";
        }
    },
	animateDashBoard : function(targetclsName, animateDirection, vector, animateComplete){
		var targetTemplate = window.kikiUtil.getTemplateByClassName(targetclsName);
		// 클릭 이후 애니메이션이 끝날때까지 재클릭 방지
		targetTemplate.animateCompleteFlag = false;
		myProfileDiv = targetclsName + ' ' + '.kiki-usrSection';  
		targetTemplate.displayDashBoard = !targetTemplate.displayDashBoard;
		var firstSign = targetTemplate.invertAniDirection? "-=" : "+=";
		var	secondSign = targetTemplate.invertAniDirection? "+=" : "-="

		for(var key in animateDirection){
			animateDirection[key] = targetTemplate.displayDashBoard? firstSign + vector + "px" : secondSign + vector + "px";
		}		
		if ($(myProfileDiv).is(':animated')){return false} 
        $(myProfileDiv).stop().animate(animateDirection,{
            complete : animateComplete
		},100); 
	},	
	setBadgeData : function(badgeDiv, badgeDataArry,  column, row, option){
		try{
			var cnt = 0;
			if(!option) option = function(){};
			window.kikiDOMUtil.removeAllChild(badgeDiv);
            
			for(var i =0; i < row; i++){
				var ul = document.createElement("ul");
				//ul.setAttribute("marginTop",  "20px");
				//kiki-myProfile
				for(var j =0; j < column; j++){
					var li = document.createElement("li");
					if(option.style){
						for(var key in option.style){
							li.style[key] = option.style[key] + "px";
						}
					}
					//	option.marginRight? (function(){li.style.marginRight = option.marginRight + "px";})() : false;
					
					var src;
					if(!badgeDataArry){
						var imgDiv = '<img src="http://gamekiki.com/kiki_client_modules/images/img_badge_empty.png">';                                     
						li.innerHTML = imgDiv; 
						ul.appendChild(li);
						cnt++;
						continue
					}	
					if(badgeDataArry[cnt]){
						var eachBadgeInfo = badgeDataArry[cnt].split(",");
						src = 
							(
								(badgeDataArry.length > cnt) 
								&& (window.kikiOption.appId)
								&& (eachBadgeInfo[2].length > 0) 
								&& (eachBadgeInfo[1].split("||")[0].length > 0)
							)  ? 
						window._kikiPaths.badge + "/" + eachBadgeInfo[2] + "/" + window.kikiOption.appId + "/" + eachBadgeInfo[1].split("||")[0] : window._kikiBaseUrl + "/" + "images/img_badge_empty.png";				
					}else{
						src = window._kikiBaseUrl + "/" + "images/img_badge_empty.png";											
					}
					var imgDiv =  src?  '<img src="'+src+'">' : '<img src="http://gamekiki.com/kiki_client_modules/images/myphoto.png">';                                     
					li.innerHTML = imgDiv; 
					ul.appendChild(li);
					cnt++;
				}
				ul.setAttribute("marginLeft", ($(badgeDiv).width() - $(ul).width() / 2) + "px");
				badgeDiv.appendChild(ul);
			}			
		}catch(e){
			console.log("Exception : " + e);
		}
    },
	setRankBadgeData : function(badgeDiv, badgeData,  column, row, option){
		var eachBadgeInfo = []; 
		var eachDevIdInfo = [];
		console.debug("checking badgeData", badgeData);
		if(badgeData.badges == null){
			console.log("badges is null");
		}else{
			eachBadgeInfo = badgeData.badges.split(",");
		}
		
		if(badgeData.devIds == null){
			console.log("devIds is null");	
		}else{
			eachDevIdInfo = badgeData.devIds.split(",");			
		}

		try{
			var cnt = 0;
			if(!option) option = function(){};
			window.kikiDOMUtil.removeAllChild(badgeDiv);
            
			for(var i =0; i < row; i++){
				var ul = document.createElement("ul");
				ul.setAttribute("marginTop",  "20px");
				ul.setAttribute("style", "display: flex;justify-content: center;");
				 
				
				for(var j =0; j < column; j++){
					var li = document.createElement("li");
					if(option.style){
						for(var key in option.style){
							li.style[key] = option.style[key] + "px";
						}
					}
					var src;
					if(badgeData.badges == null){
						var imgDiv = '<img src="http://gamekiki.com/kiki_client_modules/images/img_badge_empty.png">';                                     
						li.innerHTML = imgDiv; 
						ul.appendChild(li);
						cnt++;
						continue
					}
					
					if(eachBadgeInfo[cnt]){
						src = 
							(
								(window.kikiOption.appId)
								&& (eachBadgeInfo[cnt].length > 0) 
								&& (eachBadgeInfo[cnt].split("||")[0].length > 0)
							)  ? 
						window._kikiPaths.badge + "/" + eachDevIdInfo[cnt] + "/" + window.kikiOption.appId + "/" + eachBadgeInfo[cnt].split("||")[0] : window._kikiBaseUrl + "/" + "images/img_badge_empty.png";				
					}else{
						src = window._kikiBaseUrl + "/" + "images/img_badge_empty.png";											
					}
					var imgDiv =  src?  '<img src="'+src+'">' : '<img src="http://gamekiki.com/kiki_client_modules/images/myphoto.png">';                                     
					
					li.innerHTML = imgDiv; 
					ul.appendChild(li);
					cnt++;
				}
				badgeDiv.appendChild(ul);
			}			
		}catch(e){
			console.log("Exception : " + e);
		}
	},
	setCustomScrollBar : function(divClassName, reqeustType, opts){
		console.debug("request type check", requestType);
		opts = opts? opts : {};
		$(divClassName).attr("feedPage", 1);
		$(divClassName).attr("reqeustType", reqeustType);
		$(divClassName).attr("fromScroll", "N");
		
		var _callbacks = {};
		if(opts.autoScroll){
			_callbacks.onTotalScroll = function(){
				var isLast = $(this).attr("isLast");
				console.debug("isLast", isLast);
				if(isLast != "Y"){
					var nextPageInt = parseInt($(this).attr("feedPage")) + 1;
					$(this).attr("feedPage", nextPageInt);
					$(this).attr("fromScroll", "Y");
					console.debug("ontotalscroll requestSendMsg");
					window.kikiUtil.requestSendMsg($(this).attr("reqeustType"), ["N", $(this).attr("feedPage") + "", "null"]);
				}else{
					console.log("is last page");
				}
			}
			
		}
		
		$(divClassName).mCustomScrollbar({
			theme : "dark",
			callbacks: _callbacks,
			advanced :{
				autoExpandVerticalScroll : true,
				updateOnContentResize: true
			}
		});
	},
	getLvLeftMsg : function(nextLevel, leftExp){
			return "<span>레벨" + nextLevel+ "</span>까지 <span> " + leftExp+ "p</span> 남았습니다.";
        //return "up to the next level,<span>" + leftExp+ "</span> points left.";
    },	

	removeAllChild : function(div){
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
    }
}	
	
window.kikiTemplates = [];
	

	
window.kikiTemplates.push({
	"type" : "right", 
	"className" : ".kikiRight",
	"cssName" : window._kikiBaseUrl + "/" + "css" + "/" + "default_right.css",
	"url" : window._kikiHTMLPath + "kikiWebRight.html",
 	"subHTML" :[{"type" : "rankSub", "url" : window._kikiHTMLPath + "rankdiv/rank_right.html", "widgetType" : "right"}],
	"rankListSubHTML" : "",
	"frdListSubHTML" : "",
	"frdSectFlag" : false,
	"profileImgDivPath" : [".kikiRight .kiki-avatar > img",".kikiRight .kiki-profile-pick > img"],
	"initWidget" : function(prop){
		//link tabs
		window.kikiDOMUtil.linkTab(document.querySelector(this.className + ' ' + ".kiki-gnb .gnb-my > a"), _KIKI_PROFILE_DIV_SELECTED, this.className, ".kiki-gnb a");
		window.kikiDOMUtil.linkTab(document.querySelector(this.className + ' ' + ".kiki-gnb .gnb-friend > a"), _KIKI_FRIENDS_DIV_SELECTED, this.className, ".kiki-gnb a");
		window.kikiDOMUtil.linkTab(document.querySelector(this.className + ' ' + ".kiki-gnb .gnb-new > a"), _KIKI_NEWSFEED_DIV_SELECTED, this.className, ".kiki-gnb a");
		window.kikiDOMUtil.linkTab(document.querySelector(this.className + ' ' + ".kiki-gnb .gnb-ranking > a"), _KIKI_RANKING_DIV_SELECTED, this.className, ".kiki-gnb a");			

		//hide all sections
		window.kikiDOMUtil.hideAllSection(this.className);

		//set profile section visible
		document.querySelector(this.className + ' ' + ".kiki-profile-nav").style.display = "block";                          
		
		//set dashboard animation -> kiki-profile
		document.querySelector(this.className + ' ' + ".kiki-profile").setAttribute("baseClass", this.className);                                        
		document.querySelector(this.className + " " + ".kiki-profile").onclick = function(){
			var targetTemplate = window.kikiUtil.getTemplateByClassName(this.getAttribute("baseClass"));	
			window.kikiDOMUtil.animateDashBoard(this.getAttribute("baseClass"), targetTemplate.animateDirection, targetTemplate.animateVector, targetTemplate.animateCallback);
		}
		
		//set dashboard animation -> kiki-folding
		document.querySelector(this.className + ' ' + ".kiki-folding").setAttribute("baseClass", this.className);                                        
		document.querySelector(this.className + " " + ".kiki-folding").onclick = function(){
			var targetTemplate = window.kikiUtil.getTemplateByClassName(this.getAttribute("baseClass"));	
			window.kikiDOMUtil.animateDashBoard(this.getAttribute("baseClass"), targetTemplate.animateDirection, targetTemplate.animateVector, targetTemplate.animateCallback);
		}
		
		//set baseClass to animDiv
		document.querySelector(this.className + ' ' + '.kiki-usrSection').setAttribute("baseClass", this.className);
		
		// animate once to change position from (x, yPos) to (x, yPos - animationVector)    
		window.kikiDOMUtil.animateDashBoard(this.className, this.animateDirection, this.animateVector, function(){$(this).show();});
		
		if(prop.userID){
			// (userID != geust) == real user 
			//set user point
			var pointDiv = document.querySelector(this.className + ' ' + '.kiki-point01');
			for(var j=0; j < pointDiv.childNodes.length; j++){
				if(pointDiv.childNodes[j].style){
					pointDiv.childNodes[j].style.display = "block";
				}
			}
			
			// hide login request text
			var loginReqDiv = document.querySelector(this.className + ' ' + ".kikiLoginReqTxt");
			console.debug("login div?", loginReqDiv);
			if(loginReqDiv){loginReqDiv.style.display="hidden"};
		}
		
		//set profile image select onclick
		
		
		/*document.querySelector(this.className + ' ' + ".p_cg").onclick = function(){
			console.debug("click triggered2");
			$('._kiki_profileChangeInput').trigger('click'); 
		}*/
		
		window.kikiDOMUtil.addDragEvent(this.className + ' ' + ".kiki-ranking-nav", "y");
		kikiDOMUtil.setCustomScrollBar(this.className + " " + ".kiki-newsfeed-nav", "feed", {
			autoScroll : true
		});
		kikiDOMUtil.setCustomScrollBar(this.className + " " + ".kiki-ranking-nav", "toplist");
		window.kikiUtil.requestSendMsg("profile", [prop.userID]);
	},
	"animateCompleteFlag" : true,
	"displayDashBoard" : true,
	"animateDirection" : {"right" : ""},
	"animateVector" : 350,
	"animateCallback"  : function(){
		var targetTemplate = window.kikiUtil.getTemplateByClassName(".kikiRight");
		// 애니메이션 종료 이후 클릭 재활성화
		targetTemplate.animateCompleteFlag = true;
		//document.querySelector(targetTemplate.className + " .kiki-conWrap").style.height = targetTemplate.displayDashBoard? "310px" : "100px";								
		$(this).show();
	},
	"profileCallback" : function(data){
		var targetDiv = document.querySelector(this.className);                
		if(data.levelId){
			targetDiv.querySelector(".kiki-profile-nav .kiki-level > p").innerHTML = data.levelId;
			targetDiv.querySelector(".kiki-profile-level").innerHTML = "<span>Lv</span><strong>" + data.levelId + "</strong>";                        
		}
		targetDiv.querySelector(".kiki-profile-name").innerHTML = data.userName;
		if(data.userImg){
			targetDiv.querySelector(".kiki-info .kiki-avatar > img").src = window._kikiPaths.users + (data.userImg).substring(2);								
			targetDiv.querySelector(".kiki-profile-pick > img").src = window._kikiPaths.users + (data.userImg).substring(2);                                             
		}
		// ranking
		targetDiv.querySelector(".kiki-profile-nav .kiki-ranking p").innerHTML = data.ranking? data.ranking : 0;
		
		
		//targetDiv.querySelector(".kiki-profile-nav .kiki-avatar > img").src = data.usrImg;		
		//point 
		targetDiv.querySelector(".kiki-profile-nav .kiki-point01 > p > span").innerHTML = data.userPoint + "p"; 
		//next level msg
	   if(data.nextminPoint && data.userPoint){
			var percentage = window.kikiNumUtil.getNextLvPercentage(data.userPoint, data.nextminPoint, data.minPoint);
			targetDiv.querySelector(".kiki-progress-bar-s-point").style.width = percentage + "%";
			var nextLvMsg = window.kikiDOMUtil.getLvLeftMsg((parseInt(data.level)+1), (data.nextminPoint - data.userPoint));
			targetDiv.querySelector(".kiki-txt-level").innerHTML = nextLvMsg;	                 
		}
		//badge
		window.kikiDOMUtil.setBadgeData(targetDiv.querySelector(".kiki-profile-nav .kiki-badge-box"), data.badgeInfo, 4, 2, {"style" : {"marginRight" : 2}});		
	},
	"frdCallback" : function(data, frdType){
		console.debug("frd callback", window.kiki);
		if(!this.frdSectFlag){
			return
		}
		//if(!window.kiki.frdSectFlag) return 
		var targetDiv = document.querySelector(this.className + " " + ".kiki-friends-nav" + " " +"." + frdType);
		console.debug("check targetDiv", targetDiv);
		if(document.querySelector(".kiki-loading-text")){
			var loginTextDivs = document.querySelectorAll(".kiki-loading-text");
			for(var i = 0; i < loginTextDivs.length; i++){
				loginTextDivs[i].parentNode.removeChild(loginTextDivs[i]);				
			}
		}
		$(this.className + " " + ".kiki-friends-nav").find("section").each(function(){
			$(this).hide();
		});
		$(targetDiv).show();
		
		$(targetDiv).find(".kiki-soci-list").each(function(){
			$(this).find(".kiki-soci-more").prop('onclick',null).off('click');
			$(this).find(".kiki-soci-friend").prop('onclick',null).off('click');
			$(this).find(".kiki-soci-accept").prop('onclick',null).off('click');
			$(this).find(".kiki-soci-reject").prop('onclick',null).off('click');
			$(this).remove();
		});
		
		
		var moreBtn = '<a href="#" class="kiki-soci-more">more</a>';
		var frdReqBtn = '<a href="#" class="bg kiki-soci-friend">more</a>';
		var acceptBtn = '<a href="#" class="bg kiki-soci-accept">accept</a>';
		var rejectBtn = '<a href="#" class="bg kiki-soci-reject">refect</a>';
		for(var i =0; i < data.length; i++){
			var eachFrdDiv = document.createElement("div");
			eachFrdDiv.className = "kiki-soci-list";
			eachFrdDiv.innerHTML = this.frdListSubHTML;
			eachFrdDiv.querySelector(".kiki-soci-name > a").innerHTML = data[i].userId;
			eachFrdDiv.querySelector(".kiki-soci-level01 > span").innerHTML = data[i].levelId;
			eachFrdDiv.querySelector(".kiki-soci-ranking01 > span").innerHTML = data[i].ranking;
			var socialBtnCon = eachFrdDiv.querySelector(".kiki-soci-btn");
			var kiki_frd_data = data[i];
			switch(frdType){
				case "friendlist" :
					socialBtnCon.innerHTML = moreBtn;       
					socialBtnCon.querySelector(".kiki-soci-more").onclick = function(){

					}
			
					break;
				case "sugfriend" :
					socialBtnCon.innerHTML = moreBtn + frdReqBtn;       
					socialBtnCon.querySelector(".kiki-soci-more").onclick = function(){

					}
					socialBtnCon.querySelector(".kiki-soci-friend").onclick = (function(eachFrdDiv, kiki_frd_data){
						return function(){

							var reqResult = confirm("친구 요청하시겠습니까?");
							if (reqResult) {
								console.debug("kiki_frd_data", kiki_frd_data);
								window.kikiUtil.requestSendMsg("reqfriend", ["N", "1", kiki_frd_data.UserId]);		                                
								this.onclick = false;
								this.parentNode.removeChild(this);
								kiki_frd_data = false;
								//eachFrdDiv.parentNode.removeChild(eachFrdDiv);
							} else {
								return
							}
						}
					})(eachFrdDiv, kiki_frd_data);
					break;
				case "reqfriendlist" :
					socialBtnCon.innerHTML = moreBtn + acceptBtn + rejectBtn;
					socialBtnCon.querySelector(".kiki-soci-more").onclick = function(){

					}
					
					socialBtnCon.querySelector(".kiki-soci-accept").onclick = (function(eachFrdDiv, kiki_frd_data){
						return function(){
							var confirmReq = alertify.confirm("친구로 수락하시겠습니까?");
							if (confirmReq) {
								// after accept API
								try{
									//console.log("opts", getMsgs);
									window.kikiUtil.requestSendMsg("reqfriend", [kiki_frd_data.userId], "Y");		                                
									alertify.alert("친구로 수락되었습니다");
									kiki_frd_data = false;
									this.onclick = false;
									eachFrdDiv.parentNode.removeChild(eachFrdDiv);                                
								}catch(e){
									console.log("procreqfriend reject error : " + e);
								}
							} else {
								return
							}
						}
					})(eachFrdDiv,kiki_frd_data);
					
				   
					socialBtnCon.querySelector(".kiki-soci-reject").onclick = (function(eachFrdDiv, kiki_frd_data){
						return function(){
							//var confirmReq = confirm();
							
							alertify.confirm("친구요청을 거절하시겠습니까?", function (flag) {
								if (flag) {
									alertify.success("You've clicked OK");
								try{
									var getMsgs = JSON.stringify({"userId": kiki_frd_data.UserId, "acceptYN": "N"});
									window.kiki.acceptYN = false;
									window.kikiUtil.requestSendMsg("procreqfriend", [kiki_frd_data.UserId, "N"]);		                                                              
									alertify.alert("친구요청을 거절하였습니다");
									kiki_frd_data = false;
									this.onclick = false;
									eachFrdDiv.parentNode.removeChild(eachFrdDiv);                                
								}catch(e){
									console.log("procreqfriend reject error : " + e);
								}
								
								} else {
									alertify.error("cancel을 누르셨습니다");
								}
							});
						}
					})(eachFrdDiv,kiki_frd_data);
					break;
				case "srcfriend" :
					socialBtnCon.innerHTML = moreBtn + frdReqBtn;
					/*socialBtnCon.querySelector(".kiki-soci-more").onclick = function(){

					}*/
					socialBtnCon.querySelector(".kiki-soci-friend").onclick = (function(eachFrdDiv, kiki_frd_data){
						return function(){
							/*var reqResult = confirm("친구 요청하시겠습니까?");
							if (reqResult) {
								window.kikiUtil.requestSendMsg("reqfriend", [kiki_frd_data.UserId]);
								kiki_frd_data = false;
								this.onclick = false;
								this.parentNode.removeChild(this);
								//eachFrdDiv.parentNode.removeChild(eachFrdDiv);
							} else {
								return
							}*/
							alertify.confirm("친구 요청하시겠습니까?", function (flag) {
								if (flag) {
									alertify.success("You've clicked OK");
								} else {
									alertify.error("You've clicked Cancel");
								}
							});
						}
					})(eachFrdDiv,kiki_frd_data);           
					break;
			}
			window.kikiDOMUtil.setBadgeData(eachFrdDiv.querySelector(".kiki-badge-box"), data[i], 6, 4, {"style" : {"marginRight" : 4}});      
			targetDiv.appendChild(eachFrdDiv);
		}
	
		window.kiki.frdSectFlag = false;
	},
	"newsfeedCallback" : function(data, isLast){
		var curDate = new Date();
		for(var i =0; i < data.length; i++){
			var wrapDiv = document.createElement("div");
			wrapDiv.className = "kiki-new01";
			var feedDiv = document.createElement("div");
		   
			feedDiv.className = "kiki-new-con";
			if(data[i].regiYHs){
				var dateStr = data[i].regiYHs.split('T');
				var hms = dateStr[1].split(".")[0];
				console.log("hms", hms);
				var oldDate = new Date(data[i].regiYHs);
				var timeDiff = window.kikiNumUtil.getTimeDiff(oldDate, curDate);
				
				data[i].date =  dateStr[0] + " " + dateStr[1].split(".")[0];
			}else{
				data[i].date = false;
			}
			//data[i].src? data[i].src : false;
			data[i].amount? data[i].amount : false;
			//2015-09-24T09:52:36.000Z
			var feedHTML = window.kiki.getFeedPtsMsg(data[i], data[i].date, i, this.className);
			feedDiv.innerHTML = feedHTML;
			wrapDiv.appendChild(feedDiv);
			var container = document.querySelector(this.className + " .kiki-newsfeed-nav .mCSB_container");
			if(container){
				container.appendChild(wrapDiv);
			}
			
		}   
		$(this.className + " " + ".kiki-newsfeed-nav").attr("stopScroll", "N");	
		if(isLast != "false"){
			$(this.className + " " + ".kiki-newsfeed-nav").attr("isLast", "Y");		
			console.debug("class check", $(this.className + " " + ".kiki-newsfeed-nav"));
		}
	},
	"rankingCallback" : function(data){
		//window.kikiDOMUtil.removeAllChild(document.querySelector(this.className +  " .kiki-ranking-nav .mCSB_container"));        
		if(data.length > 20){
			var _data = [];
			for(var i =0; i < 20; i++){
				_data.push(data[i]);
			}
			data = _data;
		}
		for(var i =0; i < data.length; i++){
			var topUsrData = data[i];
			if(i >0){
				if(topUsrData.ranking == data[i-1].ranking){
					continue
				}
			}

			var topRankerDiv = document.createElement("div");
			topRankerDiv.className = "kiki-ranking-con";
			topRankerDiv.innerHTML = this.rankListSubHTML;
			
			topRankerDiv.querySelector(".kiki-ranking-num").innerHTML = topUsrData.ranking;
			var userImg = topUsrData.userImg?  window._kikiPaths.users + (topUsrData.userImg).substring(2)  : (window._kikiBaseUrl + "/images/myphoto.png");         
			topRankerDiv.querySelector(".kiki-ranking-pick").innerHTML = '<img src="'+userImg+'">';
			topRankerDiv.querySelector(".kiki-ranking-point").innerHTML = 
				"<p>"+topUsrData.userId +
				"<p class='kiki-point-num'>"+window.kikiNumUtil.commafy(topUsrData.UserPoint)+"</p>";
			window.kikiDOMUtil.setRankBadgeData(topRankerDiv.querySelector(".kiki-ranking-badge"), {"badges" : topUsrData.badgeimg, "devIds" : topUsrData.developerId}, 4, 1, {"style" : {"marginRight" : 2, "marginTop" : 1}, isFromRanking : true});
			//document.querySelector(this.className +  " .kiki-ranking-nav .mCSB_container").appendChild(topRankerDiv);
			var container = document.querySelector(this.className + " .kiki-ranking-nav .mCSB_container");
			if(container){
				container.appendChild(topRankerDiv);
			}
		}
	}
});	

window.kikiTemplates.push({
	"type" : "left", 
	"className" : ".kikiLeft",
	"cssName" : window._kikiBaseUrl + "/" + "css" + "/" + "default_left.css",
	"url" : window._kikiHTMLPath + "kikiWebLeft.html",
	"subHTML" :[{"type" : "rankSub", "url" : window._kikiHTMLPath + "rankdiv/rank_right.html", "widgetType" : "right"}],
	"rankListSubHTML" : "",
	"frdListSubHTML" : "",
	"profileImgDivPath" : [".kikiLeft .kiki-avatar > img",".kikiLeft .kiki-profile-pick > img"],
	"profileCallback" : window.kikiTemplates[0].profileCallback,
	"frdCallback" : function(data, frdType){
		
	},
	"displayDashBoard" : true,
	"animateCompleteFlag" : true,
	"animateDirection" : {"left" : ""},
	"animateVector" : 345,
	"animateCallback"  : function(){
		var targetTemplate = window.kikiUtil.getTemplateByClassName(".kikiLeft");
		targetTemplate.animateCompleteFlag = true;
		//document.querySelector(targetTemplate.className + " .kiki-conWrap").style.height = targetTemplate.displayDashBoard? "310px" : "100px";								
		$(this).show();
	},
	"initWidget" : window.kikiTemplates[0].initWidget,
	"newsfeedCallback" : window.kikiTemplates[0].newsfeedCallback,
	"rankingCallback" : window.kikiTemplates[0].rankingCallback
});
window.kikiTemplates.push({
	"type" : "bottom", 
	"className" : ".kikiBottom",
	"rankListSubHTML" : "",
	"frdListSubHTML" : "",
	"newsfeedSubHTML" : "",
	"frdSectFlag" : false,
	"cssName" : window._kikiBaseUrl + "/" + "css" + "/" + "default_bottom3_20170724.css",
	"url" : window._kikiHTMLPath + "kikiWebBottom.html",
	"subHTML" :
	[
		{"type" : "rankSub", "url" : window._kikiHTMLPath + "rankdiv/rank_bottom2.html", "widgetType" : "bottom"}, 
		{"type" : "friendSub", "url" : window._kikiHTMLPath + "friendDiv/friend_bottom2.html", "widgetType" : "bottom"},
		{"type" : "newsfeedSub", "url" : window._kikiHTMLPath + "newsfeedDiv/newsfeed_bottom2.html", "widgetType" : "bottom"}
		
	],
	"displayDashBoard" : true,
	"animateCompleteFlag" : true,
	"animateDirection" : {"top" : ""},
	"invertAniDirection" : true,
	"animateVector" : 495,
	"animateCallback" : function(){
		var targetTemplate = window.kikiUtil.getTemplateByClassName(".kikiBottom");
		document.querySelector(targetTemplate.className + " #widjet-wrap").style.height = targetTemplate.displayDashBoard? "490px" : "100px";						
		targetTemplate.animateCompleteFlag = true;
		$(this).show();
	},
	"initWidget" : function(prop){
		
		window.kikiDOMUtil.linkTab(document.querySelector(this.className + ' ' + ".kiki-gnb .myinfo > a"), _KIKI_PROFILE_DIV_SELECTED, this.className, ".kiki-gnb a");
		window.kikiDOMUtil.linkTab(document.querySelector(this.className + ' ' + ".kiki-gnb .myfriends > a"), _KIKI_FRIENDS_DIV_SELECTED, this.className, ".kiki-gnb a");
		window.kikiDOMUtil.linkTab(document.querySelector(this.className + ' ' + ".kiki-gnb .ranking > a"), _KIKI_RANKING_DIV_SELECTED, this.className, ".kiki-gnb a");
		window.kikiDOMUtil.linkTab(document.querySelector(this.className + ' ' + ".kiki-gnb .newsfeed > a"), _KIKI_NEWSFEED_DIV_SELECTED, this.className, ".kiki-gnb a");			
		
		//hide all sections
		window.kikiDOMUtil.hideAllSection(this.className);
		
		//set profile section visible
		document.querySelector(this.className + ' ' + ".kiki-profile-nav").style.display = "block";                          
		document.querySelector(this.className + ' ' + ".kbtn_close").onclick = function(){
				//animate
				var floatWidget = document.querySelector(".kikiBottom #kiki-float");
				var widgetContainer = document.querySelector(".kikiBottom .kiki-wrap");				
				var body = document.body,
				html = document.documentElement;
				var docuHeight = Math.max( body.scrollHeight, body.offsetHeight, 
				html.clientHeight, html.scrollHeight, html.offsetHeight );
				var floatWidgetPosY = docuHeight - floatWidget.offsetTop;
				var marginBetween = 20;
				var animVector = floatWidgetPosY + marginBetween + widgetContainer.offsetHeight;
				//450px일 때 float widget을 가림
				animVector = 450;
				$(".kikiBottom .kiki-wrap").stop().animate({
					top:"+="+animVector+"px"					
				},500,function(){
					$(".kikiBottom .kiki-wrap").css("display","none");
					document.querySelector(".kikiBottom #widjet-wrap").style.width = "0px";
				});								
		}   
		var containerNav = document.querySelector(this.className + ' ' + "#kiki-float");
		containerNav.onclick = function(){
			//animate
			if(this.getAttribute("isDragging") == "N"){
				if($(".kikiBottom .kiki-wrap").css("display") == "none"){
					var height = this.style;
					
					
					
					
					
					document.querySelector(".kikiBottom #widjet-wrap").style.width = "340px";					
					$(".kikiBottom .kiki-wrap").css("display","block");
						var floatWidget = document.querySelector(this.className + ' ' + "#kiki-float");
						var widgetContainer = document.querySelector(this.className + ' ' + ".kiki-wrap");
						
						var body = document.body,
						html = document.documentElement;
						var docuHeight = Math.max( body.scrollHeight, body.offsetHeight, 
						html.clientHeight, html.scrollHeight, html.offsetHeight );
						var floatWidgetPosY = docuHeight - floatWidget.offsetTop;
						var marginBetween = 20;
						var animVector = floatWidgetPosY + marginBetween + widgetContainer.offsetHeight;
						// 450px 일때 floatWidget을 가림
						animVector = 445;
						//var vector = floatWidgetH + widgetContainerH + floatWidgetBottom + marginBetween;
					$(".kikiBottom .kiki-wrap").stop().animate( {"top":"-="+animVector+"px"}			
				,500,  function(){console.debug("complete calls..")});
				}
			}
		}			
		containerNav.setAttribute("isDragging", "N");
		/*containerNav.addEventListener("mousedown", function(event){
			this.setAttribute("isDragging", "Y");
		}, false);
					
		containerNav.addEventListener("mousemove", function(event){
			if(this.getAttribute("isDragging") == "Y"){
				var xbox = this.offsetWidth/2;
				var ybox = this.offsetHeight/2;
				this.style.left = event.clientX - xbox + 'px'; 
				//this.style.top = "100px";
				this.style.top  =  (event.clientY - ybox) + 'px';
				
			}
		}, false);
		
		containerNav.addEventListener("mouseup", function(event){
			this.setAttribute("isDragging", "N");
//			window.setTimeout(function(){document.querySelector(".kikiBottom #kiki-float").setAttribute("isDragging", "N")}, 1000);
			return false;
		}, false);*/

		
		
		//set badgeDiv click
		document.querySelector(this.className + ' ' + '#kikiBottom_profile_badge').setAttribute("bassClass", this.className);
		document.querySelector(this.className + ' ' + '#kikiBottom_profile_badge').onclick = function(){			
			this.className = "on";
			document.querySelector(this.getAttribute("bassClass") + ' ' + '.badge-box').style.display= "block";			
			document.querySelector(this.getAttribute("bassClass") + ' ' + '#kikiBottom_profile_news').className = "";
			var newsfeedDiv = document.querySelector(this.getAttribute("bassClass") + ' ' + '.act-box');
			newsfeedDiv.style.display = "none";
			
		}
		
		//set profile newsfeed click
		document.querySelector(this.className + ' ' + "#kikiBottom_profile_news").setAttribute("bassClass", this.className);
		document.querySelector(this.className + ' ' + '#kikiBottom_profile_news').onclick = function(){	
			if(!window.kiki.loginFlag){
				alertify.alert("로그인 해주세요");
				return
			}
			window.kiki.isProfileNewsfeed = true;
			
			$(this.getAttribute("bassClass") + ' ' + ".kiki-tabcont").attr("feedPage", 1);
			$(this.getAttribute("bassClass") + ' ' + ".kiki-tabcont").attr("reqeustType", "newsfeed");
			document.querySelector(this.getAttribute("bassClass")  + " .kiki-tabcont").setAttribute("feedPage", 1);
			document.querySelector(this.getAttribute("bassClass")  + " .kiki-tabcont").setAttribute("isFrd", "N");
			document.querySelector(this.getAttribute("bassClass")  + " .kiki-tabcont").setAttribute("isMine", "Y");
		
			this.className = "on";
			document.querySelector(this.getAttribute("bassClass") + ' ' + '#kikiBottom_profile_badge').className= "";			
			var newsfeedDiv = document.querySelector(this.getAttribute("bassClass") + ' ' + '.act-box');
			newsfeedDiv.style.display= "block";
			window.kikiDOMUtil.removeAllChild(newsfeedDiv.querySelector("ul"));
			var badgeDiv = document.querySelector(this.getAttribute("bassClass") + ' ' + '.badge-box');
			badgeDiv.style.display = "none";
			window.kikiUtil.requestSendMsg("feed", ["1", "N", "Y"]);
		}
		
		//set baseClass to animDiv
		//document.querySelector(this.className + ' ' + '.kiki-usrSection').setAttribute("baseClass", this.className);
		
		// animate once to change position from (x, yPos) to (x, yPos - animationVector)    
		//document.querySelector(this.className + " #widjet-wrap").style.height = "490px";			               			
		//window.kikiDOMUtil.animateDashBoard(this.className, this.animateDirection, this.animateVector, this.animateCallback);
		
		var _callbacks = {}
		_callbacks.onTotalScroll = function(){
				var isLast = $(this).attr("isLast");
				if(isLast != "Y"){
					var nextPageInt = parseInt($(this).attr("feedPage")) + 1;
					$(this).attr("feedPage", nextPageInt);
					console.debug("ontotalscroll requestSendMsg 1028", $(this).attr("reqeustType"));

					$(this).attr("fromScroll", "Y");
					window.kikiUtil.requestSendMsg($(this).attr("reqeustType"), [$(this).attr("feedPage"), $(this).attr("isFrd"), $(this).attr("isMine")]);
				}else{
					console.log("is last page");
				}
			}
		_callbacks.onTotalScrollOffset = 300;
		$(this.className + ' ' + ".kiki-tabcont").each(function(){			
			// toplistSS , feed 페이지만 스크롤링 시 페이지 로드, 
			// friends, profile 페이지는 isLast attr을 "Y"로 설정. 
			$(this).mCustomScrollbar({ theme : "dark", 
			   callbacks: _callbacks, 
			   advanced :{ 
				autoExpandVerticalScroll : true, 
				updateOnContentResize: true 
				}
			});
		});		
		document.querySelector(this.className + ' ' + ".kiki-wrap").style.display = "none";
		this.setFrdSectionClick();
		
		$(".kikiBottom .kiki-wrap").stop().animate( {"top":"+=500px"});
		document.querySelector(".kikiBottom #widjet-wrap").style.width = "0px";
		

		document.querySelector(this.className + ' ' + ".p_cg").onclick = function(){
			console.debug("click triggered");
			$('._kiki_profileChangeInput').trigger('click'); 
		}

		
		//document.querySelector(".kiki-ranking-nav").style.display= "block";
		//document.querySelector(".kiki-profile-nav").style.display= "none";
		
		//window.kikiUtil.requestSendMsg("profile", "N", "1", 'null');
	},
	"frdCommonCallback" : function(context){
		window.kiki.frdSectFlag = true;
		
		var targetTemplate = window.kikiUtil.getTemplateByClassName(".kiki-bottom");
		targetTemplate.frdSectFlag = true;
		var socialBtns = document.querySelectorAll(".kiki-tabbtn > ul > li");
		for(var i =0; i < socialBtns.length; i++){
			$(socialBtns).removeClass("on");
		}
		$(context).addClass("on");
		var frdList = document.querySelectorAll(".kiki-friends-nav .friends-box > ul > li");
		for(var i =0; i < frdList.length; i++){
			//remove onclick listener
			var clickableButtons = frdList[i].querySelectorAll(".frbtn_add");
			for(var j =0; j < clickableButtons.length; j++){						
				clickableButtons[j].onclick = null;
			}
			frdList[i].parentNode.removeChild(frdList[i]);
		}	
	},
	"setFrdSectionClick" : function(){	
		document.querySelector("#kiki_frd_bottom_reccfrd").onclick = function(){ 
			if(window.kikiDOMUtil.isRequesting)return 		
			var targetTemplate = window.kikiUtil.getTemplateByClassName(".kikiBottom");		
			targetTemplate.frdCommonCallback(this);
			window.kikiUtil.requestSendMsg("sugfriend", null);                  
        }
        
		document.querySelector("#kiki_frd_bottom_myfrd").onclick = function(){ 
			if(window.kikiDOMUtil.isRequesting)return 
			var targetTemplate = window.kikiUtil.getTemplateByClassName(".kikiBottom");		
			targetTemplate.frdCommonCallback(this);		
			window.kikiUtil.requestSendMsg("friendlist", [window.kiki.g_conn.getUserId()]);                  
        }
        
		
        document.querySelector("#kiki_frd_bottom_reqfrd").onclick = function(){
			if(window.kikiDOMUtil.isRequesting)return 
			var targetTemplate = window.kikiUtil.getTemplateByClassName(".kikiBottom");		
			targetTemplate.frdCommonCallback(this);
			window.kikiUtil.requestSendMsg("reqfriendlist", null);
		}   
        
        document.querySelector(this.className + " .search_btn").onclick = function(){
			if(window.kikiDOMUtil.isRequesting)return 
			var searchValue = document.querySelector(".kikiBottom .search_input").value;
            if(searchValue.length < 1){alertify.alert("please insert atleast 1 character"); return};           
			var targetTemplate = window.kikiUtil.getTemplateByClassName(".kikiBottom");		
			targetTemplate.frdCommonCallback(this);
			window.kikiUtil.requestSendMsg("srcfriend", searchValue);
        }        
		
        document.querySelector(".kikiBottom .search_input").onkeypress = function(e){
			if(window.kikiDOMUtil.isRequesting)return 
            window.kiki.frdSectFlag = true;
			var targetTemplate = window.kikiUtil.getTemplateByClassName(".kikiBottom");
				targetTemplate.frdSectFlag = true;
			if(e.keyCode ==13){
                e.preventDefault();
				if(this.value.length > 0){
					window.kiki.frdSectFlag = true;
					
					var targetTemplate = window.kikiUtil.getTemplateByClassName(".kikiBottom");		
			targetTemplate.frdCommonCallback(this);
					window.kikiUtil.requestSendMsg("srcfriend", [this.value]);					
				}else{
					alertify.alert("한글자 이상 입력해주세요");
				}
			}
			return
        }
	},
	"clearData" : function(type){
		switch(type){
			case "newsfeed" :
				window.kikiDOMUtil.removeAllChild(document.querySelector(this.className +  " .kiki-newsfeed-nav .friends-box > ul"));        			
				break;
			case "ranking" :
				var prevRankDivs = document.querySelectorAll(this.className +  " .kiki-ranking-nav .friends-box > ul > li");
				//remove onclick listener
				for(var i =0; i < prevRankDivs.length; i++){
					prevRankDivs[i].querySelector(".frbtn_add").onclick = null;			
				}
				window.kikiDOMUtil.removeAllChild(document.querySelector(this.className +  " .kiki-ranking-nav .friends-box > ul"));        
				break;			
		}
	},
	"profileImgDivPath" : [".kikiBottom .con-pick01 > div > img", ".kikiBottom #kiki-float .fl-pick img"],		
	"profileCallback" : function(data){
		console.debug("badge data22", data);
		var targetDiv = document.querySelector(".kikiBottom");
		
		
		//document.querySelector(this.className + ' ' + '#kikiBottom_profile_badge').onclick();
		if(data.levelId){
			targetDiv.querySelector(".kiki-profile-nav .u-level01 > span").innerHTML = data.levelId;
			
			targetDiv.querySelector("#kiki-float .fl-level > span").innerHTML = data.levelId;                        
		}
		// ranking
		//targetDiv.querySelector(".kiki-profile-nav .con-ranking01 > span").innerHTML = data.ranking? data.ranking : "0";
		//picture name
		if(data.userId){
			targetDiv.querySelector(".kiki-profile-nav .con-infowrap .u-name > p").innerHTML = data.userId;		
			targetDiv.querySelector("#kiki-float .fl-name > div > p").innerHTML = data.userId;		
		}
		//picture image
		if(data.userImg){
			targetDiv.querySelector(".kiki-profile-nav .kiki-uinfo > .con-pick01 img").src = window._kikiPaths.users + (data.userImg).substring(2);								
			targetDiv.querySelector("#kiki-float .fl-pick img").src = window._kikiPaths.users + (data.userImg).substring(2);                                             
		}
		//point 
		if(data.userPoint || data.userPoint == 0){
			targetDiv.querySelector(".kiki-profile-nav .con-infowrap .u_point").innerHTML = data.userPoint + "p"; 
			targetDiv.querySelector("#kiki-float .fl-point").innerHTML = data.userPoint + "p";		
		}
		//next level msg
		if(data.nextminPoint && data.userPoint){
			var percentage = window.kikiNumUtil.getNextLvPercentage(data.userPoint, data.nextminPoint, data.minPoint);
			targetDiv.querySelector(".kiki-profile-nav .progress-bar-s-point").style.width = percentage + "%";
			var nextLvMsg = window.kikiDOMUtil.getLvLeftMsg((parseInt(data.levelId)+1), (data.nextminPoint - data.userPoint));
			targetDiv.querySelector(".kiki-profile-nav .txt-level").innerHTML = nextLvMsg;	                 
		}
		var maxBadgeRow = Math.ceil( data.badgeInfo.length / 5);
		if(maxBadgeRow < 4) maxBadgeRow = 4;
		console.debug("badge data", data);
		window.kikiDOMUtil.setBadgeData(targetDiv.querySelector(".kiki-profile-nav .badge-box"), data.badgeInfo, 5, maxBadgeRow, {"style" : {"marginRight" : 4}});
	},
	"lastRank" : 0,
	"rankingCallback" : function(data, isLast){
		console.debug("data.rankList", data.rankList);
		/*if(data.rankList.length > 20){
			var _data = [];
			for(var i =0; i < 20; i++){
				_data.push(data.rankList[i]);
			}
			data.rankList = _data;
		}*/
		if(data.rankList[0].ranking == "1") this.lastRank = 1;
		if(this.lastRank <= data.rankList[0].ranking){
			this.lastRank = data.rankList[0].ranking;			
		}else{
			data.rankList[0].ranking = this.lastRank;
		}
		var sameRankArry = [];
		for(var i =0; i < data.rankList.length; i++){
			var topUsrData = data.rankList[i];			
			// 랭킹이 같은 사용자들은 array에 우선 들어온 순서대로 랭킹정리
			/*if(i > 0){
				if(topUsrData.ranking == this.lastRank && i != (data.rankList.length -1)){
					sameRankArry.push(data.rankList[i]);
					continue
				}				
			}
			this.lastRank = topUsrData.ranking;
			if(sameRankArry.length > 0){
				for(var j =0; j < sameRankArry.length; j++){
					sameRankArry[j].ranking = parseInt(sameRankArry[j].ranking)+j+1;
					this.rankCommonCallback(sameRankArry[j]);
				}
			}
			this.lastRank = this.lastRank + sameRankArry.length;
			sameRankArry = [];*/
			this.rankCommonCallback(topUsrData);				
				
		
		}
		
	},
	"rankCommonCallback" : function(topUsrData){
		console.debug("checking rank",topUsrData,topUsrData.ranking);
		var topRankerDiv = document.createElement("div");
		topRankerDiv.innerHTML = this.rankListSubHTML;
		topRankerDiv.querySelector(".rank-num").innerHTML = topUsrData.ranking;
		if(parseInt(topUsrData.ranking) > 99){
			topRankerDiv.querySelector(".fr-infowarp").style.marginLeft = "50px";
		}
		var userImg = topUsrData.userImg?  window._kikiPaths.users + (topUsrData.userImg).substring(2)  : (window._kikiBaseUrl + "/images/myphoto.png");
		topRankerDiv.querySelector(".fr-pick p > img").src = userImg;
		topRankerDiv.querySelector(".fr-name p").innerHTML = topUsrData.userId;
		topRankerDiv.querySelector(".fr-point").innerHTML = window.kikiNumUtil.commafy(topUsrData.UserPoint) + "p";
		if(window.kiki.g_conn.getUserId() == topUsrData.userId){
			topRankerDiv.querySelector(".frbtn_add").className += " fr";
			topRankerDiv.querySelector(".frbtn_add").innerHTML = "내랭킹";
			topRankerDiv.querySelector(".frbtn_add").onclick = null;
		}else if(topUsrData.friendFlag != null){
			topRankerDiv.querySelector(".frbtn_add").className += " fr";
			topRankerDiv.querySelector(".frbtn_add").innerHTML = "친구";
			topRankerDiv.querySelector(".frbtn_add").onclick = null;
		}else{
			topRankerDiv.querySelector(".frbtn_add").onclick = (function(topRankerDiv, topUsrData){
				return function(){
					if(!window.kiki.loginFlag){
						alertify.alert("로그인 해주세요");
						return
					}


					/*var reqResult = confirm("친구 요청하시겠습니까?");
					if (reqResult) {
						console.log("topUsrData", topUsrData);
						window.kikiUtil.requestSendMsg("reqfriend", [topUsrData.userId]);		                                
						this.onclick = false;
						this.parentNode.removeChild(this);
						topUsrData = false;
						//eachFrdDiv.parentNode.removeChild(eachFrdDiv);
					} else {
						return
					}*/
					
					alertify.confirm("친구 요청하시겠습니까 , topuser?", function (flag) {
						if (flag) {
							window.kikiUtil.requestSendMsg("reqfriend", [topUsrData.userId]);		                                
							this.onclick = false;
							this.parentNode.removeChild(this);
							topUsrData = false;
						} else {
							alertify.error("취소를 누르셨습니다.");
						}
					});
					
					
				}
			})(topRankerDiv, topUsrData);
			
		}
		
		//window.kikiDOMUtil.setRankBadgeData(topRankerDiv.querySelector(".badge-box"), {"badges" : topUsrData.badgeimg, "devIds" : topUsrData.developerId}, 6, 2, {"style" : {"marginRight" : 4, "marginTop" : 4}});			
		var container = document.querySelector(this.className + " .kiki-ranking-nav .friends-box ul");
		if(container){
			container.appendChild(topRankerDiv);
		}
	},
	"newsfeedCallback" : function(data, isLast){
		var container = document.querySelector(this.className + " .kiki-newsfeed-nav .friends-box >ul");			       
		var innerContentDiv = "";
		innerContentDiv = window.kiki.isProfileNewsfeed? "<div class='txt'></div><p class='date'></p>" : this.newsfeedSubHTML;		
		if(window.kiki.isProfileNewsfeed){
			container = document.querySelector(this.className + ' .kiki-profile-nav .act-box >ul');			
		}
		
		var curDate = new Date();
		for(var i =0; i < data.length; i++){
			var eachNewsfeedDiv = document.createElement("li");	
			eachNewsfeedDiv.innerHTML = innerContentDiv;
			
			if(data[i].regiYHS){
				var stamp = new Date(data[i].regiYHS);
				var dateStr = data[i].regiYHS.split('T');
				var hms = dateStr[1].split(".")[0];
				data[i].date =  dateStr[0] + " " + dateStr[1].split(".")[0];
			}else{
				data[i].date = false;
			}
			data[i].src? data[i].src : false;
			data[i].amount? data[i].amount : false;
			if(window.kiki.isProfileNewsfeed){
				eachNewsfeedDiv.querySelector(".date").innerHTML = data[i].date;
				eachNewsfeedDiv.querySelector(".txt").innerHTML = "<span>" + data[i].UserId + "</span> <span>"  + data[i].actName + "</span>.";											
			}else{
				eachNewsfeedDiv.querySelector(".fr-pick img").src = data[i].userImg?  window._kikiPaths.users + (data[i].userImg).substring(2)  : (window._kikiBaseUrl + "/images/myphoto.png");

				eachNewsfeedDiv.querySelector(".news-date").innerHTML = data[i].date;
				eachNewsfeedDiv.querySelector(".news-txt").innerHTML = "<span>" + data[i].UserId + "</span> <span>"  + data[i].actName + "</span>.";							
			}
			if(container){
				container.appendChild(eachNewsfeedDiv);
			}
			if(isLast != "false"){
				$(this.className + " " + ".kiki-newsfeed-nav").attr("isLast", "Y");		
			}			
		}
		//$(this.className + " " + ".kiki-newsfeed-nav").mCustomScrollbar("update");
	},
	"frdCallback" : function(data, frdType){
		
		if(frdType == "sugfriend"){
			document.querySelector(this.className + " .ssome_search").style.display="block";					
		}else if (frdType == "friendlist" || frdType == "reqfriendlist"){
			document.querySelector(this.className + " .ssome_search").style.display="none";					
		}
		document.querySelector(".kikiBottom .kiki-header > p").innerHTML = "친구";
		
		var targetDiv = document.querySelector(this.className + " " + ".kiki-friends-nav" + " .friends-box > ul");
		
		// 로그인 텍스트 추후에 처리
		if(document.querySelector(".kiki-loading-text")){
			var loginTextDivs = document.querySelectorAll(".kiki-loading-text");
			for(var i = 0; i < loginTextDivs.length; i++){
				loginTextDivs[i].parentNode.removeChild(loginTextDivs[i]);				
			}
		}
				
		$(targetDiv).show();
		
		$(targetDiv).find(".kiki-soci-list").each(function(){
			$(this).find(".frbtn_add").prop('onclick',null).off('click');
			$(this).find(".kiki-soci-accept").prop('onclick',null).off('click');
			$(this).find(".kiki-soci-reject").prop('onclick',null).off('click');
			$(this).remove();
		});
		
		
		var rankDiv = '<a href="#" class="frbtn_rank"></a>';
		var frdReqBtn = '<a class="frbtn_add">친구추가</a>';
		var isFrdBtn =  '<a class="frbtn_add fr">친구</a>';
		var acceptBtn = '<a class="frbtn_add acc">수락</a>';
		var rejectBtn = '<a class="frbtn_add ref">거절</a>';
		console.debug("is not array", typeof data);
		if(typeof data == "string"){			
			console.log("is error : ", data);
			return 
		}
		for(var i =0; i < data.length; i++){
			var eachFrdDiv = document.createElement("li");
			//eachFrdDiv.className = "kiki-soci-list";
			eachFrdDiv.innerHTML = this.frdListSubHTML;
			eachFrdDiv.querySelector(".fr-pick img").src = data[i].userImg?  window._kikiPaths.users + (data[i].userImg).substring(2)  : (window._kikiBaseUrl + "/images/myphoto.png");
			eachFrdDiv.querySelector(".s-name").innerHTML = data[i].UserId? data[i].UserId : data[i].userId;
			eachFrdDiv.querySelector(".fr-level > span").innerHTML = data[i].levelId;
			eachFrdDiv.querySelector(".fr-point").innerHTML = data[i].userPoint + "P";
			var socialBtnCon = eachFrdDiv.querySelector(".fr-info");
			var kiki_frd_data = data[i];
			switch(frdType){
				case "friendlist" :
					socialBtnCon.innerHTML += rankDiv;       
					socialBtnCon.querySelector(".frbtn_rank").innerHTML = kiki_frd_data.ranking? kiki_frd_data.ranking + " 위": "순위없음";
					break;
				case "sugfriend" :
					socialBtnCon.innerHTML += frdReqBtn;       					
					socialBtnCon.querySelector(".frbtn_add").onclick = (function(eachFrdDiv, kiki_frd_data){
						return function(){
							/*var reqResult = confirm("친구 요청하시겠습니까?");
							console.debug("kiki_frd_data", kiki_frd_data,kiki_frd_data.UserId ,kiki_frd_data.userId);
							if (reqResult) {
								window.kikiUtil.requestSendMsg("reqfriend", [kiki_frd_data.UserId]);		                                
								this.onclick = false;
								this.parentNode.removeChild(this);
								kiki_frd_data = false;
								//eachFrdDiv.parentNode.removeChild(eachFrdDiv);
							} else {
								return
							}*/
							alertify.confirm("친구 요청하시겠습니까 1336?", function (flag) {
								if (flag) {
									window.kikiUtil.requestSendMsg("reqfriend", [kiki_frd_data.UserId]);		                                
									this.onclick = false;
									this.parentNode.removeChild(this);
									kiki_frd_data = false;
								} else {
									alertify.error("취소를 누르셨습니다.");
								}
							});
						}
					})(eachFrdDiv, kiki_frd_data);
					break;
				case "reqfriendlist" :
					socialBtnCon.innerHTML +=  acceptBtn + rejectBtn;
					socialBtnCon.querySelector(".acc").onclick = (function(eachFrdDiv, kiki_frd_data){
						return function(){
							var confirmReq = alertify.confirm("친구로 수락하시겠습니까?");
							if (confirmReq) {
								// after accept API
								try{
									//console.log("opts", getMsgs);
									window.kiki.acceptYN = true;
									window.kikiUtil.requestSendMsg("procreqfriend", [kiki_frd_data.userId, "Y"]);		                                
									//alertify.alert("친구로 수락되었습니다");
									kiki_frd_data = false;
									this.onclick = false;
									eachFrdDiv.parentNode.removeChild(eachFrdDiv);                                
								}catch(e){
	//								console.log("procreqfriend reject error : " + e);
								}
							} else {
								return
							}
						}
					})(eachFrdDiv,kiki_frd_data);
					
				   
					socialBtnCon.querySelector(".ref").onclick = (function(eachFrdDiv, kiki_frd_data){
						return function(){
							/*var confirmReq = confirm("친구요청을 거절하시겠습니까?");
							if (confirmReq) {
								// after reject API
								try{
									window.kikiUtil.requestSendMsg("procreqfriend", [kiki_frd_data.userId, "N"]);	                                                              
									alertify.alert("친구요청을 거절하였습니다");
									kiki_frd_data = false;
									this.onclick = false;
									eachFrdDiv.parentNode.removeChild(eachFrdDiv);                                
								}catch(e){
									//console.log("procreqfriend reject error : " + e);
								}
							} else {
								return
							}*/
							
							alertify.confirm("친구요청을 거절하시겠습니까??", function (flag) {
								if (flag) {
								// after reject API
									try{
										window.kikiUtil.requestSendMsg("procreqfriend", [kiki_frd_data.userId, "N"]);	                                                              
										//alertify.success("친구요청을 거절하였습니다");
										kiki_frd_data = false;
										this.onclick = false;
										eachFrdDiv.parentNode.removeChild(eachFrdDiv);                                
									}catch(e){
									} 
								}else {
									alertify.error("취소를 누르셨습니다.");
								}
							});
							
						}
					})(eachFrdDiv,kiki_frd_data);
					break;
				case "srcfriend" :
					socialBtnCon.innerHTML += (kiki_frd_data.friendFlag != null)? isFrdBtn : frdReqBtn;
					
					socialBtnCon.querySelector(".frbtn_add").onclick = (kiki_frd_data.friendFlag != null)? false : (function(eachFrdDiv, kiki_frd_data){
						return function(){
							
							alertify.confirm("친구 요청하시겠습니까?", function (flag) {
								if (flag) {
									window.kikiUtil.requestSendMsg("reqfriend", [kiki_frd_data.userId]);		                                
									this.onclick = false;
									this.parentNode.removeChild(this);
									kiki_frd_data = false;
								} else {
									alertify.error("취소를 누르셨습니다.");
								}
							});
							
						}
					})(eachFrdDiv,kiki_frd_data);           
					break;
			}
			targetDiv.appendChild(eachFrdDiv);
		}
	
		//window.kiki.frdSectFlag = false;
		this.frdSectFlag = false;
	}
	
});
	

window.kiki = {
    g_conn : false, 
    initFlag : false,
    configSetup : false,
    loginFlag : false,
	connectFlag : false,
	frdSectFlag : false,
	isProfileNewsfeed : false,
	constructFlag : false,
	loginCallback : function(){},
	logoutCallback : function(){},
	actionCallback : function(){},
	fUploadInst : false,
	acceptYN : false,
	callType : "",
	usrIP : "",
	baseUrl : "http://gamekiki.com/kiki_client_modules",
    get_IE_version : function(){
        try{
            var word;
            var version = "N/A";
            var agent = navigator.userAgent.toLowerCase();
            var name = navigator.appName;
            // IE old version ( IE 10 or Lower )
            if ( name == "Microsoft Internet Explorer" ) word = "msie ";
            else {
                // IE 11
                if ( agent.search("trident") > -1 ) word = "trident/.*rv:";
                // IE 12  ( Microsoft Edge )
                else if ( agent.search("edge/") > -1 ) word = "edge/";
            }
            var reg = new RegExp( word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})" );

            if (  reg.exec( agent ) != null  ) version = RegExp.$1 + RegExp.$2;
            return version;         
        }catch(e){
            return false
        }
    },
	doAction : function(opt){
		this.callType = "action";
		window.kiki.actionCallback = opt.callback? opt.callback : function(){};
		opt.targetId = opt.targetId? opt.targetId : null;
		
		if(!opt.actId){
			console.log("send action requires action id");
			return
		}
		
		if(!window.kiki.loginFlag){
			console.log("send action requires token. please login");
			window.kiki.actionCallback(false, "send action requires token. please login");
			return
		}
		
		try{
			if(window.kiki.g_conn){
				window.kikiUtil.requestSendMsg("activity", opt);		
			}else{
				console.log("Cant send action, g_conn not defined");
				cb(false);
			}
        }catch(e){
            console.log("doAction exception e : " + e);
            cb(false);
        }
	},
    listenSvrNode : function(msgType,msg, isLast){
		console.debug("got msg from svr!!", msgType,msg, isLast);
		
		if(msg == "disconnect" && window.kiki.loginFlag){
			console.log("%c disconnect!", 'background: #222; color: #bada55');
			try{
				window.kiki.g_conn.connSocket(function(e){
					//window.kiki.g_conn = new nodeConn(this.listenSvrNode);							
				}); 				
			}catch(e){
				alertify.alert("접속이 원활하지 않습니다");
				return
			}
		}
		
		
		window.kikiDOMUtil.isRequesting = false;
		console.debug("58 calling sppiner false");
		window.kikiDOMUtil.showSpinner(false);
		
		if(msg == "disconnect socket!!"){
			// socket.io connection 이후 응답이 없어도 catch exception을 주지 않는다			
			alertify.alert("접속이 원활하지 않습니다");
			console.debug("is disconnect 1561");
			try{
				console.log("con socket try");
				window.kiki.g_conn.connSocket(function(e){
					//window.kiki.g_conn = new nodeConn(this.listenSvrNode);			
					
				}); 				
			}catch(e){
				alertify.alert("접속이 원활하지 않습니다");
			}
			
			return
		}
		
		if(msg == "requiredParams"){
			console.debug("is requiredParams");
			return
		}
		
		
		console.debug("next calls??!!", msgType);
		switch(msgType){
			case "subscribe" :
				if(!window.kiki.subscribeFlag){					
					// construct
					window.kiki.subscribeFlag = true;    
					
					
					//instanciate file upload instance
					console.debug("checking fUpload instance");
					//login or call activityReady
					var aRdyFxn = window.kiki.activityReady? window.kiki.activityReady : function(){};
					console.debug("aRdyFxn", aRdyFxn);
					console.debug("check token", kiki.g_conn.getToken());
					if(window.kikiOption.userID && !window.kiki.loginFlag){	
						if(window.kikiOption.userID.length > 0){
							window.kiki.login(window.kikiOption.appId,window.kikiOption.userID, window.kiki.activityReady);							
						}
					}else{
						window.kiki.activityReady();							
					}
				}
				break;
			case "login" :
				window.kiki.loginFlag = true;
				console.debug("login done", window.kiki.g_conn.fUploadInst, window.kiki.g_conn.fUploadInst, window.kiki.g_conn.fUploadInst);
				//window.kiki.g_conn.fUploadInst.listenOnInput(document.querySelector("._kiki_profileChangeInput2"));
				//console.log("listenOnInput attached");
				if(document.querySelector(".kiki_profileLoginDiv")){
					var loginTextDivs = document.querySelectorAll(".kiki_profileLoginDiv");
					var loginDoneDivs = document.querySelectorAll(".kiki_profileLoginDoneDiv");
					for(var i = 0; i < loginTextDivs.length; i++){
						loginTextDivs[i].style.display="none";				
						loginDoneDivs[i].style.display="block";
					}
				}
				if(!window.kiki.constructFlag && window.kikiOption.useWidget){
					kiki.construct();				
					window.kiki.constructFlag = true;							                                     
				}
				
				window.kikiUtil.requestSendMsg("profile", [kiki.g_conn.getUserId()]);											
				
				window.kiki.loginCallback(true);
			break;
		case "unsubscribe" :
			//window.kikiUtil.requestSendMsg("logout", [kiki.g_conn.getUserId()]);	
			console.log("about to send log req");
			try{
				console.log("log request send");
				kiki.g_conn.sendLogRequest("unsubscribe", window.kikiOption.appId, function(){
					console.log("logout req?", window.kiki.logoutCallback);
					console.log("clearing uid and tokens");
					window.kiki.logoutCallback(msg);
					window.kiki.g_conn = false;					
					window.kiki.loginFlag = false;
					window.kiki.subscribeFlag = false;
					window.kikiOption.userID = false;
				}, window.kikiOption.appId);															
			}catch(e){
				console.log("is exception ", e);
				window.kiki.logoutCallback(false);
			}
			
			break;
		case "logout" :
			window.kiki.g_conn.clearUserId();
			window.kiki.g_conn.clearToken();
			if(window.kiki.useWidget){
				var loginRequestDiv = document.querySelectorAll(".kiki_profileLoginDiv");
				var loginDoneDiv = document.querySelectorAll(".kiki_profileLoginDoneDiv");
				for(var i =0; i < loginRequestDiv.length; i++){
					loginRequestDiv[i].style.display = "block";
				}
				for(var i =0; i < loginDoneDiv.length; i++){
					loginDoneDiv[i].style.display = "none";
				}				
			}
			try{		
				kiki.g_conn.socket.emit("unsubscribe", window.kikiOption.appId);								
			}catch(e){
				window.kiki.logoutCallback(false);											
			}
			//kiki.g_conn.sendLogRequest("unsubscribe", window.kikiOption.appId);					
			//window.kikiUtil.requestSendMsg("unsubscribe", window.kikiOption.appId);	
			
			break;
		case "socket" :
			console.log("socket status is " + msg);
			
			window.kiki.connectFlag = status;
			if(msg == "disconnect"){								
				console.log("Status is disconnect, not going to reconnect");
				// 로그아웃을 하지 않은 경우 소켓 재연결
				if(window.kiki.loginFlag){
					window.kiki.g_conn = new nodeConn(this.listenSvrNode);			
					try{
						window.kiki.g_conn.connSocket(function(e){
							window.kiki.g_conn.setSubscribe();
						}); 							
					}catch(e){
						alertify.alert("접속이 원활하지 않습니다");						
					}
				}
			}
			break;
		case "activity" :
			console.log("activity result is " + msg.result);
			var successFlag = msg.result == "success"? true : false;
			window.kiki.actionCallback(successFlag);
			break;
		case "profile" : 
				if(window.kiki.loginFlag){ 
					var loginRequestDiv = document.querySelectorAll(".kiki_profileLoginDiv");
					var loginDoneDiv = document.querySelectorAll(".kiki_profileLoginDoneDiv");
					for(var i =0; i < loginRequestDiv.length; i++){
						loginRequestDiv[i].style.display = "none";
					}
					for(var i =0; i < loginDoneDiv.length; i++){
						loginDoneDiv[i].style.display = "block";
					}
					try{
						for(var i =0; i < window.kikiTemplates.length; i++){
							if(document.querySelector(window.kikiTemplates[i].className)){
								window.kikiTemplates[i].profileCallback(msg);
							}
						}						
					}catch(e){console.log("setProfileData exception : " + e)};               					
				}
                break;
            case "feed" :
                try{
					for(var i =0; i < window.kikiTemplates.length; i++){
						if(document.querySelector(window.kikiTemplates[i].className)){
							window.kikiTemplates[i].newsfeedCallback(msg, isLast);
						}
					}	
				}catch(e){console.log("setNewsfeedData exception : " + e)};               				
				break;
            case "ranking" :
				try{
					for(var i =0; i < window.kikiTemplates.length; i++){
						if(document.querySelector(window.kikiTemplates[i].className)){
							window.kikiTemplates[i].rankingCallback(msg, isLast);
						}
					}
				}catch(e){console.log("set ranking exception : " + e)};          				
                break;  
			case "reqfriend" :
				console.debug("req msg", msg, msg.result);
				try{
					if(window.kiki.loginFlag){
						if(msg.indexOf("fail") !== -1){
							alertify.error("친구요청에 실패했습니다 : " + msg);					
						}else{
							alertify.success("친구요청 하였습니다");					
						};		
					}					
				}catch(e){
					console.log("request friend exception : " + e)
				}
				break;
            case "reqfriendlist" :
            case "sugfriend" :
            case "friendlist" :
				try{
					if(window.kiki.loginFlag){
						console.log("login flag set");
						for(var i =0; i < window.kikiTemplates.length; i++){
							if(document.querySelector(window.kikiTemplates[i].className)){
								try{
									window.kikiTemplates[i].frdCallback(msg, msgType)
								}catch(e){
									console.log("friendlist exception : ", e)
								};
							}
						}
					}
				}catch(e){
					console.log("frdlist , sugfrd exception : " + e)
				}
                break;              
			case "srcfriend" :
			try{
					if(window.kiki.loginFlag){
						for(var i =0; i < window.kikiTemplates.length; i++){
							if(document.querySelector(window.kikiTemplates[i].className)){
								try{window.kikiTemplates[i].frdCallback(msg, msgType)}catch(e){
										console.log("srcfriend exception : ", e)
									};
							}
						}
					}
				}catch(e){
					console.log("frdlist , sugfrd exception : " + e)
				}
				
				break;
            case "procreqfriend" :
				var frdRstMsg = window.kiki.acceptYN? "친구로 수락되었습니다" : "친구 요청을 거절하였습니다";
				
				if(msg.indexOf("fail") !== -1){
					alertify.error("해당 요청을 실행하는데 에러가 발생했습니다 : " + msg);					
				}else{
					alertify.success(frdRstMsg);
				};							
                break;
			case "uploadImage" :
				console.log("upload image done");
				break;
            case "error" :    
                console.log("got error msg from svr", msg, window.kiki.callType);
				alertify.alert("서버와의 통신이 원활하지 않습니다");
				switch(window.kiki.callType){
					case "login" :
						window.kiki.loginCallback(false);
						break;
					case "unsubscribe" :
					case "logout" :
						window.kiki.logoutCallback(false);					
						break;
					case "action" :
						window.kiki.actionCallback(false);
						break;
					case "activityReady" :
					
						break;
				}
                break;
			default : 
				console.log("check.. default", msgType, msg);
				break;
        }
    },
    activityReady : function(){
        
    },
    login : function(appId, userId,cb){
		this.callType = "login";
		window.kikiOption.userID = userId;
		window.kikiOption.appId = appId;		
		if(window.kiki.loginFlag){
			//logoutCallback
			this.logout(function(){
				return (function(data){
					console.debug("d...", data);
					kiki.login(appId, userId);
				})(appId, userId);
			});
			return;
		}
		console.debug("check login callback", cb);
		window.kiki.loginCallback = cb? cb : function(){};
		window.kikiOption["userID"] = userId;
		window.kikiOption["appId"] = appId;
		if(!window.kiki.g_conn){
			window.kiki.g_conn = new nodeConn(this.listenSvrNode);
			
			// 쿠키의 userId값과 option의 userId값이 같다면 로그인 할 필요가 없다
			var gConn = window.kiki.g_conn; 
			if(gConn.isToken() && (window.kikiOption.userID == gConn.getUserId())){
				window.kiki.loginFlag = true;
			}						
			
			window.kiki.g_conn.connNode(window.kikiOption.appId, window.kikiOption.userID);         			
			return
		}else{
			// 페이지 로딩 시 로그인 하지않고 로딩이후 로그인 하는 경우
			if(!window.kiki.g_conn.getUserId()){
				window.kiki.g_conn.setUserId(window.kikiOption.userID);
			}
			
			if(!window.kiki.g_conn.getAppId()){
				window.kiki.g_conn.setAppId(window.kikiOption.appId);
			}			
		}
		try{		
			window.kiki.g_conn.sendMessage("login",[userId, "P"]);
		}catch(e){
			console.log("login error : " + e);
			window.kiki.loginCallback(false);
		}
    },
	logout : function(cb){
		window.kiki.loginFlag = false;
		window.kiki.logoutCallback = cb? cb : function(){};
		this.callType = "logout";
		try{
			if(!this.g_conn.isToken() || !this.g_conn.getUserId() == "kiki_wg_uId"){
				console.log("serial or userId does not exist");
				kiki.g_conn.socket.emit("unsubscribe", window.kikiOption.appId);				
				return 
			}				
			kikiUtil.requestSendMsg("logout", [kiki.g_conn.getUserId()]);			
        }catch(e){
            console.log("logout exception : " + e);
            cb(false);
        } 
    },
    join : function(appId, userID, finalCB){
        if(!finalCB) finalCB = function(){};
        try{
            this.login(appId,userID, finalCB);        
        }catch(e){
            console.log("join exception e : " + e);
            finalCB(false);
        }
    },
    kikiDivRemainCnt : 0,
    callObj : false,
    construct : function(callback_, prop_){
        var ieVer = this.get_IE_version();
        if(typeof parseFloat(ieVer) == "number"){
            if(ieVer < 9){
                console.log("fasle rtn");
                return;
            }
        }
        if(!prop_) prop_ = function(){};
        
        //var appId = prop_.appId? prop_.appId : "app_DK6gnDy300000"; 
        this.callObj =  new GbAPI(window.kikiOption.appId);
        var kikiHtmlReqUrl = window._kikiBaseUrl + "/" + "php" + "/" + "widgetContents.php?filename=";
        var reqArry = [];
        for(var i =0; i < window.kikiTemplates.length; i++){
			if(document.querySelector(window.kikiTemplates[i].className)){
				this.setReqArry(reqArry,window.kikiTemplates[i]);				
			}
		}
        for(var i =0; i < reqArry.length; i++){
            console.log("iterating reqArry", i, reqArry[i]);
            try{
                if([reqArry[i].cssName]){window.kikiUtil.addCss([reqArry[i].cssName])};
                this.callObj.sendXMLHttpReq(reqArry[i].url, "GET", {
                    callback : function(d){	
                        var baseDiv = document.querySelector(this.opt.baseClass);
                        baseDiv.setAttribute("baseClass", this.opt.baseClass);
                        baseDiv.innerHTML = d;
						
                        // hide unnecessary animation to usr??
                        kiki.kikiDivRemainCnt--; 
                        kiki.kikiDivRemainCnt <= 0 ?  window._kikiAsyncInit() : false;
                    },
                    baseClass : reqArry[i].className
                });	                            
            }catch(e){
                console.log("kiki html construction exception e : " + e);
            }
        }
    },
    setReqArry : function(reqArry, template){
		 reqArry.push(template);
        //ranking Div
        if(template.subHTML){
            for(var subI =0; subI < template.subHTML.length; subI++){
                var subHTMLObj = template.subHTML[subI];
                this.callObj.sendXMLHttpReq(template.subHTML[subI].url, "GET", {
                    callback : function(subDivHTML){
					  switch(this.opt.subHTMLObj.type){
                            case "rankSub" :
                                template.rankListSubHTML = subDivHTML;                               
                                break;
                            case "friendSub" :
								template.frdListSubHTML = subDivHTML; 
                                break;
                            case "newsfeedSub" :
								template.newsfeedSubHTML = subDivHTML; 
                                break;
                        }
                    },
                    subHTMLObj : template.subHTML[subI]
                });                                  
            }
        }
        kiki.kikiDivRemainCnt++;                        
    },
	getFeedPtsMsg : function(data, date, cnt, baseClass){
        var defaultSrc,picClass,txtClass,dateClass;
        switch(baseClass){
            case ".kikiBottom" : 
                defaultSrc = window._kikiBaseUrl + "/" + "images" + "/" + "img_charactor.png";
                picClass = "new-pick";
                txtClass = "new-txt";
                dateClass = "date";
                break;
            case ".kikiRight" : 
            case ".kikiLeft" : 
                defaultSrc = window._kikiBaseUrl + "/" + "images" + "/" + "img_charactor.png";
                picClass = "kiki-new-pick";
                txtClass = "kiki-new-txt";
                dateClass = "kiki-date";
                break;
        }            
        //var usrNameArry = ["shj****", "shj****", "fly****", "rtn****", "bbq****", "bbq****", "shj****", "fly****", "fly****", "rtn****"];   
        var src = data.userImg? window._kikiPaths.users + "/" +  (data.userImg).substring(2) : defaultSrc;
        var amountDiv = data.amount? "<strong>" + data.amount + "</strong>" : "";
        //var amountDiv = "<strong>" + 100 + "</strong>";            
        var dateDiv = date? '<p class='+'"'+dateClass+'"'+'>'+ date + '</p>' : "";		
        var picDiv = '<div class='+'"'+picClass+'"'+'><img src="'+src+'"></div>';
        //var usrName = (cnt < 9)? usrNameArry[cnt] : "shj****";
        var usrName = "shj****";
        var txtDiv = "<div class="+"'"+txtClass+"'"+"><p><span>" + data.UserId + "</span> " + amountDiv + data.actName + ".</p>" + dateDiv + "</div>";
        //var txtDiv = "<div class="+"'"+txtClass+"'"+"><p><span>" + usrName + "</span> earned " + amountDiv + " points" + ".</p>" + dateDiv + "</div>";           
        return picDiv+txtDiv;     				
    },
    setup : function(config){
		
		console.log("setup is about to begin", config);
		if(!config.appId){
			console.log("appId not defined");
			return
		}
        window.kikiOption = config;		
		if(config.activityReady){
			window.kiki.activityReady = config.activityReady;
		}
		
        if(kiki.initFlag){
            window.kiki.initWithConfig(config);
        }else{
            window.kiki.configSetup = true;
        }
    },
    initWithConfig : function(){
		var kiki_default_option = {
            useWidget : false,
			stopCookie : false,
            activityReady : function(){},
			loginType : "P"
        }
		if(window.kikiOption.useWidget && !kiki.constructFlag){
			kiki.constructFlag = true;
			kiki.construct();				
		}
		for(var key in kiki_default_option){
			 window.kikiOption[key] = window.kikiOption[key]?  window.kikiOption[key] : kiki_default_option[key];
        }
		window.kiki.g_conn = new nodeConn(this.listenSvrNode);
		try{
			if(!window.kikiOption.userID || window.kikiOption.userID.length < 1){
				var uId=window.kiki.g_conn.getUserId();
				if(uId.length < 1 || window.kikiOption.stopCookie){
					window.kiki.g_conn.clearUserId();
					window.kiki.g_conn.clearToken();	
				}else{
					window.kikiOption.userID = uId;		
				}
			}			
		}catch(e){
			
		}
		console.log("window.kikiOption.userID", window.kikiOption.userID);
		window.kiki.g_conn.connNode(window.kikiOption.appId, window.kikiOption.userID);         
    },
	changeUserProfileImage : function(imageSrc){
		 try{
			 if(!window.kiki.loginFlag){
				 alertify.alert("로그인해주세요.");
				 return
			 }
			for(var i =0; i < window.kikiTemplates.length; i++){
				if(document.querySelector(window.kikiTemplates[i].className)){
					for(var j =0; j < window.kikiTemplates[i].profileImgDivPath.length; j++){
						console.debug("img path..", window.kikiTemplates[i].profileImgDivPath, document.querySelector(window.kikiTemplates[i].profileImgDivPath[j]));
						document.querySelector(window.kikiTemplates[i].profileImgDivPath[j]).src = imageSrc;
					}
				}
			}	
		}catch(e){console.log("setProfileImage exception : " + e)};  
	},checkLoginFlag : function(){
		if(!window.kiki.loginFlag){
			alertify.alert("로그인해주세요");
		}
	}
};

/*if (!window.addEventListener){ 
	// IE DOM
	window.addEventListener = window.attachEvent;
}*/
$(document).ready(function(){
	 var baseUrl = "http://gamekiki.com/kiki_client_modules";
    function addProfileChangeDiv(){
		//id="siofu_input"
		var profileChangeInput = document.createElement("input");
		profileChangeInput.className = "_kiki_profileChangeInput";
		profileChangeInput.setAttribute("type", "file");
		profileChangeInput.setAttribute("id", "siofu_input");
		profileChangeInput.style.display = "none";
		
		document.body.appendChild(profileChangeInput);			
		document.body.className += (document.body.className.length > 0)? " kiki" : "kiki";
		$('._kiki_profileChangeInput').change(function(evt){
			window.testTarget = evt.target;
			console.log("window.testTarget", window.testTarget.files[0]);
			var f = evt.target.files[0]; 
			
			window.kiki.g_conn.uploadImage(f);
			var reader  = new FileReader();

			  reader.addEventListener("load", function () {
					window.kiki.changeUserProfileImage(this.result);
			  }, false);

			 reader.readAsDataURL(f);
			//pseudoInput_fileReader.readAsDataURL(f);    
		});
		
		kiki.initFlag = true;
		//window.kiki.g_conn = new nodeConn(kiki.listenSvrNode);        
		if(kiki.configSetup){
			console.log("is config setup");
			window.kiki.initWithConfig();
		} 
	}
	try{
        window.kikiUtil.addCss([
			window._kikiBaseUrl + "/" + "css" + "/" + "jquery.mCustomScrollbar.css",
			window._kikiBaseUrl + "/" + "css" + "/" + "alertify.core.css",
			window._kikiBaseUrl + "/" + "css" + "/" + "alertify.default.css",		
			window._kikiBaseUrl + "/" + "css" + "/" + "loadme.min.css"		
        ]);    
        var scriptsToAdd = [		
			window._kikiBaseUrl + "/" + "kiki_js" + "/" + "connNode_v3_20170726.js",
			window._kikiBaseUrl + "/" + "kiki_js" + "/" + "GbAPI.js",
            window._kikiBaseUrl + "/" + "kiki_js" + "/" + "socket.io.js",
//			window._kikiBaseUrl + "/" + "kiki_js" + "/" + "siofu.client.js",
			
			window._kikiBaseUrl + "/" + "kiki_js" + "/" + "jquery.mCustomScrollbar.min.js",			            
			window._kikiBaseUrl + "/" + "kiki_js" + "/" + "jquery.UI.min.js",		
			window._kikiBaseUrl + "/" + "kiki_js" + "/" + "modernizr.min.js",
			window._kikiBaseUrl + "/" + "kiki_js" + "/" + "alertify.min.js"
		];
		
		
        window.kikiUtil.addScripts(scriptsToAdd,function(){
			alertify.set({
				labels : {
					ok     : "OK",
					cancel : "Cancel"
				},
				delay : 5000,
				buttonReverse : true,
				buttonFocus   : "ok"
			});
			if(!document.body){
				window.addEventListener("DOMContentLoaded", function(){
					addProfileChangeDiv();
				},false);
			}else{
				addProfileChangeDiv();
			}
			 window.kikiReady  = true; 
			 console.log("window.kikiReadyFunc", window.kikiReadyFunc);
			 if(window.kikiReadyFunc){
				window.kikiReadyFunc();
			 }
			 
		

        });
    }catch(e){
        //console.log("kiki exception : " + e);    
		if(window.kikiReadyFunc){
				 window.kikiReadyFunc();
			 }
    }
	
});


	