 //"use strict";
  // 일정타임 시간 경과 후 브라우저 실행시 resp 값 null 됨.
  //resp 값이 null이므로 disconnected respond callback 실행안됨
  // 글로벌값으로 세팅 후 테스트 필요
  nodeConnGetResp = function(){};
  var nodeConn = function(resp) {
		this.socket = null;
		this.message = null;
		this.fUploadInst = null;	
		
		//this.resp = resp;
		nodeConnGetResp = resp;
		
		this.idNumber = -1;
		this.isMaster = 0;
		this.isReceiveFirst = 1;
					
	  	this.kiki_widget_appId = "kiki_wg_pId";
	  	this.kiki_widget_userId = "kiki_wg_uId";
	  	this.kiki_widget_deviceType = "kiki_wg_dType";
	  	this.kiki_widget_token_s01 = "kiki_wg_tk_fr";
		this.kiki_widget_token_s02 = "kiki_wg_tk_sc";
		this.kiki_widget_token_s03 = "kiki_wg_tk_tr";

	  	this.cookieExpire = 1000*3600*24;

		this.receiveMsgArray  = [];

		this.responseStatus = null;
		this.connectStatus = 0;		// 0:init, 1:req, 2:resp, -1:error
		this.usrIP = "";
  };
    
	nodeConn.prototype = {
		
		logSaveAddr : "http://gamekiki.com/kiki_client_modules/log/logSender.php",
		getAddress : {
	//		address : "211.50.119.54",
			address : "gamebin.iptime.org",
//			address : "localhost",
			port : "4433"	// 9092
		},

  		// Login
		connNode : function(appId, userId, deviceType) {
			console.log("connNode");
			//var mType = "login";
			//var _this = this;
			//var successLogin = false;
			if(appId == null) {	// deviceType == null
				console.log("This params should be Not null");
				this.getResponse("connNode", "requiredParams", null);
				
				return;
			}
						
			this.setAppId(appId);
				
			if(userId){
				this.setUserId(userId);
			}
			

			this.setDeviceType(deviceType);
			console.log("connNode line");

			this.connSocket();
		},
		changeUserInfo : function(userId) {
			this.connNode(this.getAppId(), userId, null);
		},
		connSocket : function() {
			console.log("connSocket");
			var mType="socket";
			var _this = this;
			var successConn = false;
			//var mURL = "ws://"+this.getAddress.address+":"+this.getAddress.port;
			var mURL = "ws://"+this.getAddress.address+":"+this.getAddress.port;
			console.log("ws url : ", mURL);
			var opts = {
					'timeout': 1*1000,	// connect
					'reconnection': false,
						    'reconnectionDelay': 3*1000,
						    'reconnectionAttempts': 3
//					'force new connection': true
			};
			
			try{
				this.socket = io.connect(mURL, opts);
			}catch(e){
				alert("접속이 원활하지 않습니다");
			}
				
				
			this.socket.on('ccall', function (data, last) {
				console.log("ccall sendlogrequest", data); 					
				if(data.type != "unsubscribe"){_this.sendLogRequest("ccall", data)};	
				try{
					_this.receiveMessage(data); 					
				}catch(e){
					console.log("receivMsg error", e);
					_this.getResponse("error", data.msg, null);
				}
			 });				
			this.socket.on('scall', function (data) {
					console.log("scallFromSvr", data); 
					try{
						_this.sendLogRequest("scall", data);
						_this.sendRequest("http://gamekiki.com/kiki_client_modules/php/getClientAddr.php", "GET", null, function(data){console.debug("sendreq data", data)});
						_this.receiveMessage(data); 					
					}catch(e){
						console.log("receivMsg error", data);
					}
					
				});
			this.socket.on('disconnect', 	function(){
				console.log('socket disconnected');
				_this.sendLogRequest("disconnect", "socket is disconnected");			
				_this.getResponse(mType, "disconnect", null);
			});
			this.socket.on('error', 		function(err){
				console.log(err);

				_this.getResponse(mType, "error", null);
			});
			
			this.socket.on('connect', 		function(){
				console.log('socket connected');
				_this.accessUsrIP();
//					this.sendMessage('check', 'N', 1, 'null');		// '{"sender":"client"}'
				_this.socket.emit("subscribe", _this.getAppId());				
				//_this.sendLogRequest("subscribe", _this.getAppId())
				_this.getResponse(mType, "connect", null);
			});
			this.socket.on('connect_failed', 		function(){
				console.log('socket connect failed');

//					this.sendMessage('check', 'N', 1, 'null');		// '{"sender":"client"}'

				_this.getResponse(mType, "connectFailed", null);
			});
			//console.debug("SocketIOFileUpload", SocketIOFileUpload);
			//this.fUploadInst = new SocketIOFileUpload(this.socket);
			console.debug("fUploadInst", this.fUploadInst);
		},
		// Logout
  		disConnNode : function() {
			this.sendMessage("logout", null);
			this.disConnSocket();
  		},

		disConnSocket : function() {
			if(this.socket == null) return;

			try {
				this.socket.disconnect();
	
	} catch(err) {
				console.log(err);
			}
		},

	  isConnected : function() {
		return this.socket.connected;
	  },
	  sendMetaData : function(kword){
		console.log("%c send metadata call!", 'background: #7d3c98; color:  #f9e79f');
		var form = new FormData();
			form.append("kword", kword);
			
			/*this.socket.emit("scall",{
				type : "uploadImage",
				userImg : form,
				serial : this.getToken(),
				appId : this.getAppId()
			})*/
			var mType="sendMetaData";
			var _this = this;
			var successSend = false;

			if(!this.isAppId() || !this.isToken()) {
				console.log("Can Not get Params... in Activity");
	
				this.getResponse(mType, "requiredParams", null);

				return;
			}
			var mquery = "appId="+this.getAppId()+"&"+"token="+this.getToken()+"&kword="+kword+"&userId="+this.getUserId();
			var mURL = "http://"+this.getAddress.address+":"+"4000"+"/api/v1/kiki/gd/userlog?"+mquery;
			
			this.sendRequest(mURL, "POST", null, function(respText) {
//				console.log("msie " + kikiMSIEversionCheck());

				try {
					var jsonObj = null;

//					if (kikiMSIEversionCheck() > 4) {
//			        jsonObj = eval('(' + respText + ')');
//			    	}
//			    	else {
					jsonObj = JSON.parse(respText);
//			    	}

					if(jsonObj.hasOwnProperty('error')) {
						_this.getResponse(mType, "error", null);

						return;
					}

					if(!jsonObj.hasOwnProperty('result')) {
						_this.getResponse(mType, successSend, null);

						return;
					}

					if(jsonObj.result == "success") successSend = true;

				} catch(err) {
					console.log(err);
				}
				_this.getResponse(mType, successSend, null);
			});  
	  },
	  uploadImage : function(imgData) {
			// 사용자 이미지 업데이트
			var form = new FormData();
			form.append("userImg", imgData);
			console.debug("Check params", {
				type : "uploadProfile",
				userImg : form,
				serial : this.getToken(),
				appId : this.getAppId()
			});
			/*this.socket.emit("scall",{
				type : "uploadImage",
				userImg : form,
				serial : this.getToken(),
				appId : this.getAppId()
			})*/
			var mType="updateProfile";
			var _this = this;
			var successSend = false;

			if(!this.isAppId() || !this.isToken()) {
				console.log("Can Not get Params... in Activity");
	
				this.getResponse(mType, "requiredParams", null);

				return;
			}
			var mquery = "appId="+this.getAppId()+"&"+"token="+this.getToken();
			var mURL = "http://"+this.getAddress.address+":"+"4444"+"/api/v1/kiki/updateProfile?"+mquery;

			var form = new FormData();
			form.append("userImg", imgData);
			
			this.sendRequest(mURL, "POST", form, function(respText) {
				console.log(respText);
//				console.log("msie " + kikiMSIEversionCheck());

				try {
					var jsonObj = null;

//					if (kikiMSIEversionCheck() > 4) {
//			        jsonObj = eval('(' + respText + ')');
//			    	}
//			    	else {
					jsonObj = JSON.parse(respText);
//			    	}

					if(jsonObj.hasOwnProperty('error')) {
						_this.getResponse(mType, "error", null);

						return;
					}

					if(!jsonObj.hasOwnProperty('result')) {
						_this.getResponse(mType, successSend, null);

						return;
					}

					if(jsonObj.result == "success") successSend = true;

				} catch(err) {
					console.log(err);
				}

				_this.getResponse(mType, successSend, null);
			});
		},
		sendMessage : function(getType, getMsgs) {	// isFriend, pageNo, 
			console.log("from client= " + getType);
			var sendMsgs = {};
			sendMsgs.IP = this.usrIP;					
			if(!this.isAppId()) {
				console.log("Can Not get Params... in Dashboard");
				
					this.getResponse("error", "requiredParams", null);
				
				return;
			}
			
			if(!this.getUserId()){
				var typeCheckStrs = ["login", "logout", "ranking", "feed", "unsubscribe", "subscribe"];
				var usrReqFlag =true;
				for(var i =0; i < typeCheckStrs.length; i++){
					if(getType == typeCheckStrs[i]){
						usrReqFlag = false;
					}else{
						
					}					
				}
				console.debug("check usrReqFlag", usrReqFlag);
				if(usrReqFlag){
					console.log("Can Not get Params... in Dashboard");						
					this.getResponse("error", "requiredParams", null);				
					return	
				}
			}else{
				console.log("has usrid");
				sendMsgs.userId = this.getUserId();
			}
				
				
			console.log("userId is !!" + this.getUserId());
			console.log("app id is !!" + this.getAppId());
		
			if(getType == "ranking") getType = "toplist";

			//var sendMsgs = new Object();
			
			
			//sendMsgs.sender = "client";
			sendMsgs.type = getType;

			sendMsgs.appId = this.getAppId();
			/*if(getType != "login"){
				sendMsgs.serial = this.getToken();			
			}*/

			switch(getType) {
				case "unsubscribe" :
				
					break;
				case "activity" :
					if(getMsgs["userId"]){
						sendMsgs.userId = getMsgs["userId"];									
					}
					sendMsgs.serial = this.getToken();	
					sendMsgs.actId = getMsgs["actId"];			
					if(getMsgs["targetId"]){
						sendMsgs.targetId = getMsgs["targetId"];					
					}
					break;
				case "login" : 
					sendMsgs.userId = getMsgs[0];			
					sendMsgs.loginType = getMsgs[1];
					break;
				case "logout" :
					sendMsgs.serial = this.getToken();	
					sendMsgs.userId = getMsgs[0];			
					break;
				case "profile" :	
						if(getMsgs != null)
							sendMsgs.userId = getMsgs[0];
						else 
							sendMsgs.userId = this.getUserId();
						sendMsgs.serial = this.getToken();								
						break;		

				case "updateProfile" :
						sendMsgs.userName = getMsgs;
						sendMsgs.serial = this.getToken();	
						break;
												
				case "rewardList" :
				
						break;
														
				case "feed" :	
						sendMsgs.pageNo = getMsgs[0];
						sendMsgs.isFriend = getMsgs[1];
						sendMsgs.isMine = getMsgs[2];
																	
						break;		
						
				case "toplist" :	
						sendMsgs.pageNo = getMsgs[0];
						sendMsgs.isFriend = getMsgs[1];
											
						break;	
																											
				case "reqfriendlist" :
				case "sugfriend" :
						sendMsgs.serial = this.getToken();	
						break;
						
				case "srcfriend" :
						sendMsgs.kWord = getMsgs;
						sendMsgs.serial = this.getToken();											
						break;	

				case "friendlist" :
					// 20160615 added keyword prop to sugfriend case in connect factory
		//	                sendMsgs.keyword = data.keyword;

		//	                sendMsgs.userImg = opts.userImg;

					// 20160624 added targetUserId prop to friendlist case in connect factory
					sendMsgs.targetUserId = getMsgs[0];
					sendMsgs.serial = this.getToken();	
					break;
											
					case "reqfriend" :
						sendMsgs.friendUserId = getMsgs[0];
						sendMsgs.serial = this.getToken();	
						break;
										
					case "procreqfriend" :
							sendMsgs.friendUserId = getMsgs[0];
							sendMsgs.acceptYN = getMsgs[1];
							sendMsgs.serial = this.getToken();	
						break;	
						
				default :

					break;			
			}
			if(this.socket == null){
				console.log("socket is null");
			}
			if(!this.isConnected()){
				console.log("is not connected");
			}
			if(this.socket == null || !this.isConnected()) {
				console.log("socket is disconnect");
				this.getResponse(getType, "disconnect socket!!", null);
				return;				
			}
			
//  		this.socket.emit("scall", {sender: "client", type:getType, appId:this.getAppId(), serial:this.getToken(), userId:this.getUserId(), isFriend:isFriend, pageNo:pageNo, msg:getMsgs});
			console.debug("sendMsgs obj", sendMsgs);
			this.socket.emit("scall", sendMsgs);	
			this.sendLogRequest("scall", sendMsgs);
			this.connectStatus = 1;
    },
	  
    receiveMessage : function(data) {
    	
			console.log("receive message= " ,data);
						
			
			this.connectStatus = 2;

			console.log("receive type= " + data.type);

			if(data.hasOwnProperty("serial")) {
				console.log("new token is " + data.serial);

//				this.setToken(data.serial);
			}

			switch(data.type) {
					case "updateProfile" :
						break;
					case "activity" :
						this.getResponse(data.type, data, null);						 	
						break;
					case "login" :
						this.setToken(data.serial);
						this.getResponse(data.type, data, null);						 
						break;
					case "logout" :
						//var successDisconn = false;
						this.getResponse(data.type, successDisconn, null);
						//this.socket.emit("unsubscribe", this.getAppId);
						break;
					case "unsubscribe" :
						this.clearAppId();
						this.clearToken();
						this.clearUserId();
						var successDisconn = true;
						console.debug("unsubscribe 394");
						this.getResponse(data.type, data, null);						 
						break;
					case "subscribe" :
						console.debug("subscribe..");
						this.getResponse(data.type, data, null);						 
						break;
					case "check":
						console.log("check connection");
						break;		

					 
					 case "feed" :
							this.getResponse(data.type, data.result, data.isLast);						 	
						 	break;
					 
					 case "toplist" :
							console.log("ranking length is " + data.result.length);

						 	this.getResponse("ranking", data.result, null);
						 	
						 	break;
					 
					 case "toplist" :
							console.log("ranking length is " + data.result.length);
						 	this.getResponse("ranking", data.result, data.isLast);						 	
						 	break;
					
						
					
					case "resultSuccess" :
							console.log("resultSuccess = " + data.result.branch);
						
//							snsInfo.setResultSuccess(resultInfo.branch);

//							snsInfo.closeResultPop();
						
						 	break;
					 	
					 case "resultFail" :
						
							console.log("resultSuccess = " + data.result.branch);
						
//							snsInfo.setResultFail(resultInfo.branch);
						
//							snsInfo.closeResultPop();
					 	
						 	break;
				 	
						
					case "error" :
							console.log(data.msg);
							console.log("appId is " + data.appId);
							console.log("token is " + data.serial);

							this.connectStatus = -1;

						 	this.getResponse(data.type, data.msg, null);
						 	
							break;
					//profile, rewardList, updateProfile, toplist, frdreqlist ...
					default :
							this.getResponse(data.type, data.result, null);						 	
						 	break;				
			};

//			this.connectStatus = 0;
    },

	setResponse : function(resp) {
		//this.resp = resp;
		nodeConnGetResp = resp;
	},
	
	getResponse : function(getType, getJson, isLast) {
		console.log("GetResp", this, nodeConnGetResp);
		//this.resp(getType, getJson, isLast);
		try{
			nodeConnGetResp(getType, getJson, isLast);
		}catch(e){
			if(window.kiki){
				window.kiki.listenSvrNode(getType, getJson, isLast);
			}
		}
		
	},
	
	clearResponse : function() {
		//this.resp = null;
		nodeConnGetResp = null;
	},
	
	setMessage : function(msgs) {
		this.message = msgs;

//  		console.log("set message= " + this.message);
	},

	getMessage : function() {
//			console.log("get message= " + this.message);
		
		return this.message;
	},

	setRespStatus : function(msgs) {
		this.responseStatus = msgs;

		console.log("connect status is " + this.connectStatus);
	},

	getRespStatus : function() {
		console.log("getResponse = " + this.responseStatus);
		
		return this.responseStatus;
	},

    setCookie : function(cName, cValue) {

        var expire = new Date();

		var valueType = cName.split("_");

		console.log("value Type is " + valueType[valueType.length-1]);

		if(valueType[valueType.length-1] === "token")
       		expire.setTime(expire.getTime() + (1000*3600*3));
		else
			expire.setTime(expire.getTime() + this.cookieExpire);

		var cookies = null;
//			cookies = cName + '=' + escape(cValue) + ';';		// ' path=/ '
			cookies = cName + '=' + cValue + ';' + 'path=/' + ';';

        cookies += 'expires=' + expire.toUTCString();	//  ';'
        
        console.log("cookie is " + cookies);
        
        document.cookie = cookies;
    },
 
    getCookie : function(cName) {
        cName = cName + '=';
        
        var cookieData = document.cookie;
        var start = cookieData.indexOf(cName);
        var cValue = '';
        
        if(start != -1) {
            start += cName.length;
            
            var end = cookieData.indexOf(';', start);
            
            if(end == -1) end = cookieData.length;
            
            cValue = cookieData.substring(start, end);
        }
        
        return decodeURI(cValue);	// unescape(cValue)
    },

    clearCookie : function(cName) {
        var expire = new Date();

		var valueType = cName.split("_");

		console.log("value Type is " + valueType[valueType.length-1]);

		if(valueType[valueType.length-1] === "token")
			expire.setTime(expire.getTime() - (1000*3600*3));
		else
			expire.setTime(expire.getTime() - this.cookieExpire);

		var cookies = null;
//			cookies = cName + '=' + escape(cValue) + ';';		// ' path=/ '
			cookies = cName + '=' + "" + ';' + 'path=/' + ';';

        cookies += 'expires=' + expire.toUTCString();	//  ';'
        
        console.log("cookie is " + cookies);
        
        document.cookie = cookies;
    },

	clearAppId : function() {
		console.log("this.kiki_widget_appId", this.kiki_widget_appId);
		this.clearCookie(this.kiki_widget_appId);
	},

	isAppId : function() {
		var appIdIs = this.getCookie(this.kiki_widget_appId);
		
		return (appIdIs == null | appIdIs == "") ? false : true;
	},
		
	getAppId : function() {
		return this.getCookie(this.kiki_widget_appId);
	},
	
	setAppId : function(appId) {
//			console.log("appId is " + appId);

//			this.kiki_widget_appId = "kiki_widget_" + new Date().getTime() + "_appId";

		this.setCookie(this.kiki_widget_appId, appId);
	},

	clearUserId : function() {
		console.log("clearing usrid", this.kiki_widget_userId);
		this.clearCookie(this.kiki_widget_userId);
	},

	getUserId : function() {
		console.log("getting usrid", this.kiki_widget_userId);
		return this.getCookie(this.kiki_widget_userId);
	},

	setUserId : function(userSerial) {
		this.setCookie(this.kiki_widget_userId, userSerial);
	},

	clearDeviceType : function() {
		this.clearCookie(this.kiki_widget_deviceType);
	},
		
	getDeviceType : function() {
		return this.getCookie(this.kiki_widget_deviceType);
	},
	
	setDeviceType : function(deviceType) {
//			this.kiki_widget_deviceType = "kiki_widget_" + new Date().getTime() + "_deviceType";

		this.setCookie(this.kiki_widget_deviceType, deviceType);
	},
									
	clearToken : function() {
		try {
			this.clearCookie(this.kiki_widget_token_s01);
			this.clearCookie(this.kiki_widget_token_s02);
			this.clearCookie(this.kiki_widget_token_s03);
		} catch(err) {
			console.log(err);
		}
	},

	isToken : function() {
		var tokenIs = this.getCookie(this.kiki_widget_token_s01);
		
		return (tokenIs == null | tokenIs == "") ? false : true;
	},
		
	getToken : function() {
		var tokenStr = null;

		try {
			var tokenStr02 = this.getCookie(this.kiki_widget_token_s02);
			var tokenStr03 = this.getCookie(this.kiki_widget_token_s03);

			tokenStr = this.getCookie(this.kiki_widget_token_s01);

			if(tokenStr02 != null) tokenStr = tokenStr + "." + this.getCookie(this.kiki_widget_token_s02);
			if(tokenStr03 != null) tokenStr = tokenStr + "." + this.getCookie(this.kiki_widget_token_s03);
		} catch(err) {
			console.log(err);
		}

		return tokenStr;
	},
	
	setToken : function(token) {
//			console.log("token is " + token);

//			this.kiki_widget_token = "kiki_widget_" + new Date().getTime() + "_token";

		if(token == null) return;

		try {
			var tokenSet = token.split(".");
			var tokenStr = null;

			for(var k=0; k<tokenSet.length; k++) {
				if(k == 0) {
					this.setCookie(this.kiki_widget_token_s01, tokenSet[0]);
				} else if(k == 1) {
					this.setCookie(this.kiki_widget_token_s02, tokenSet[1]);
				} else {
					if(tokenStr != null)
						tokenStr = tokenStr + tokenSet[k];
					else
						tokenStr = tokenSet[k];

					this.setCookie(this.kiki_widget_token_s03, tokenStr);
				}
			}
		} catch(err) {
			console.log(err);
		}
	},

	
	successHandler : function(result) {
			var strResult = "";

			if(typeof result === 'object')
				strResult = JSON.stringify(result);
			 else
				strResult = result;

			console.log("SUCCESS: \r\n"+strResult );
	},
	
	errorHandler : function(error) {
		alert("ERROR: \r\n"+error );
	},

	onComplete : function(getType) {
		console.log('callback called');
	  
		this.connectStatus = 0;
	  
//   	 	snsInfo.setCurNetworkState(g_conn.connectStatus);  // 2015.03.08
	  
//			document.removeEventListener('backbutton', SNSInfo.prototype.closeSNS, false);
//			document.addEventListener('backbutton', onBack, false);

	},
	sendLogRequest : function(emitType, logData, callback, appId) {
		
		// 서버 php코드에 access-allow-origin : * 로해도 cors 문제 생김. JSONP로 전송
		var logSaveAddr = "http://gamekiki.com/kiki_client_modules/log/logSender.php";
		var id = appId? appId : this.getAppId();
		var logDataStr;
		if(!this.isAppId() && !appId) {
			console.log("send log request appId required");
			return
		}
		try{
			logDataStr = JSON.stringify(logData);
			console.debug("logDataStr", logDataStr);
		}catch(e){
			console.log("cant stringify log data");
			return
		}
		var url = logSaveAddr + "?" + "callback=?";
		var data=  "appId="+ id + "&" +
		   "emitType="+ emitType + "&" +
		   "logData="+ logDataStr + "&"+	
			"href="+window.location;
			
			window.kiki.logCallback = callback? callback : false;
		try{
			$.getJSON(url,data,callback)
				.success(function() { if(window.kiki.logCallback){window.kiki.logCallback()};; })
				.error(function() { if(window.kiki.logCallback){window.kiki.logCallback()}; })
				.complete(function() { if(window.kiki.logCallback){window.kiki.logCallback()}; });
			
			
		}catch(e){
			if(window.kiki.logCallback){window.kiki.logCallback()};
		}
		
		
		/*
		try {
			if (window.XDomainRequest) {
				var xdr = new XDomainRequest();
				if (xdr) {
					xdr.onload=function() {
						if (xdr.readyState == 4){
							if(callback != null) callback(xdr.responseText);							
						};						
					}
					xdr.open("GET", url, true);
					xdr.send();
				} else {
					if(callback != null) callback("error");
				}
				
			} else {
				var xmlHttp = new XMLHttpRequest();

				//xmlHttp.withCredentials = true;

				xmlHttp.ontimeout = function(e) {
					if(callback != null) callback("error");
				};
//								
				xmlHttp.onreadystatechange = function() {
					if (xmlHttp.readyState != 4) return;

						if(xmlHttp.status === 200) {		// xmlHttp.status === 0
							console.log("status is " + xmlHttp.status, "rdy", xmlHttp.readyState);					        	    
							//console.log(xmlHttp.responseText);
							if(callback != null) callback(xmlHttp.responseText);				        				
					} else {			
						// response status error, errorCode = (-1)*xmlHttp.status;
						//console.log("status is " + (-1)*xmlHttp.status);
						if(callback != null) callback("error");
					}
			  };
			 xmlHttp.open("GET", url, true);
//				 	   	  xmlHttp.setRequestHeader('Content-Type', 'text/plain');		// application/xml
			  xmlHttp.timeout = 10*1000;
			  xmlHttp.send();
		}
				
	  } catch(err) {
		//console.log("error is" + err);	// errorCode = -5

		if(callback != null) callback("error");
	  }*/
	},
	sendRequest : function(getURL, getType, opts, callback, withCredentials) {
				
				console.log("sendRequest URL is " + getURL);
				console.log("opts", opts);
					try {
						/*if (window.XDomainRequest) {
						    console.log("xdr withCredentials"); // , kikiMSIEversionCheck()
			
							var xdr = new XDomainRequest();
						    xdr.withCredentials = true;
							
						    if (xdr) {
								console.log("xdr in");
								
						        xdr.onload=function() {
														console.log(xdr.responseText);
															
														if(callback != null) callback(xdr.responseText);
						        }
						        xdr.open(getType, getURL, true);
						        xdr.send(opts);
						    } else {
								console.log("XDomainRequest Not Null");

						    	if(callback != null) callback("error");
						    }
						    
						}*/
							var xmlHttp = null;
							if (window.XMLHttpRequest)
                                xmlHttp=new XMLHttpRequest();
                            else
                                xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
/*							if(kikiMSIEversionCheck() == 0) xmlHttp.withCredentials = true;
/*
					 		if (window.XMLHttpRequest) {
 								xmlHttp = new XMLHttpRequest();
					    	} else {
								// code for IE6, IE5
								console.log("Microsoft.XMLHTTP");

								xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
							}
 */
				 	   		xmlHttp.ontimeout = function(e) {
				 	   			console.log("time out"); 
				 	   			console.log(e); 
				 	   			
				 	   			if(callback != null) callback("error");
				 	   		};
//								xmlHttp.onload = function() {};
					      xmlHttp.onreadystatechange = function() {
							console.log("URL is " + getURL);
			
						  	console.log("readyState is " + xmlHttp.readyState);

			    	    	if (xmlHttp.readyState != 4) return;

				        	    if(xmlHttp.status === 200) {		// xmlHttp.status === 0
					        	    console.log("status is " + xmlHttp.status);
					        	    
				        		    console.log(xmlHttp.responseText);
												
									if(callback != null) callback(xmlHttp.responseText);
				        				
				        	    } else {			// response status error, errorCode = (-1)*xmlHttp.status;
			        			    console.log("status is " + (-1)*xmlHttp.status);

									if(callback != null) callback("error");
				        	    }
				          };
				  
					      xmlHttp.open(getType, getURL, true);
//				 	   		xmlHttp.setRequestHeader('Content-Type', 'text/plain');		// application/xml
				 	   		xmlHttp.timeout = 10*1000;
				     		xmlHttp.send(opts);
					
				     		
				  } catch(err) {
				  	console.log("error is" + err);	// errorCode = -5

 				  	if(callback != null) callback("error");
				  }
		},accessUsrIP : function(){
			var accessUsrIPAddr = "http://gamekiki.com/kiki_client_modules/php/getClientAddr.php";				
			try{
				var _this = this;		
				this.sendRequest(accessUsrIPAddr, "GET", null, (function(data){
						return function(data){
							var ipData = JSON.parse(data);
							_this.usrIP = ipData.ipInfo;
							console.log("%ip is : " +  ipData.ipInfo, 'background: #222; color: #bada55');

						}
				})(_this));				
			}catch(e){
				console.log("getusrIP exception : ", e);
			}
		}

}    

	function kikiMSIEversionCheck() {
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf("MSIE ");

      if ( msie > 0 )      // If Internet Explorer, return version number
         return parseInt (ua.substring (msie+5, ua.indexOf(".", msie )));
      else                 // If another browser, return 0
         return 0;
   }
 