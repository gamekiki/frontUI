 //"use strict";
  var nodeConn = function(resp) {
		this.socket = null;
		this.message = null;

		this.resp = resp;

		this.idNumber = -1;
		this.isMaster = 0;

	  	this.kiki_widget_appId = "kiki_wg_pId";
	  	this.kiki_widget_userId = "kiki_wg_uId";
	  	this.kiki_widget_deviceType = "kiki_wg_dType";
	  	this.kiki_widget_sessionId = "kiki_wg_sessId";

	  	this.cookieExpire = 1000*3600*24;

		this.receiveMsgArray  = [];

		this.responseStatus = null;
		this.connectStatus = 0;		// 0:init, 1:req, 2:resp, -1:error
  };
    
	nodeConn.prototype = {

		getAddress : {
//			address : "211.50.119.54",
			address : "211.234.110.144",
//			address : "localhost",
			port : "8089"	// 9092	8087
		},

  		// Login
		connNode : function(appId, userId, deviceType) {

			if(appId == null || userId == null) {	// deviceType == null
				console.log("This params should be Not null");

				this.getResponse(mType, "requiredParams");
				
				return;
			}

//			this.setAppId(appId);
			this.setUserId(userId);
			this.setDeviceType(deviceType);

			var data = new FormData();
				data.append('appId', appId);
				data.append('userId', userId);
				data.append('deviceType', deviceType);

//	    	var mquery = "appId="+appId+"&"+"userId="+userId+"&"+"deviceType="+deviceType;
//			var mURL = "http://"+this.getAddress.address+":"+this.getAddress.port+"/"+mType;	// mquery

			this.sendRequest("login", "POST", data);

		},

		onLoginComplete : function(mType, respText) {
			console.log(respText);
//				console.log("msie " + kikiMSIEversionCheck());

			if(respText === "error") {
				this.getResponse(mType, "error");

				return;
			}

			var successLogin = false;

			try {
				var jsonObj = null;

//					if (kikiMSIEversionCheck() > 4) {
//			        jsonObj = eval('(' + respText + ')');
//			    }
//			    else {
				jsonObj = JSON.parse(respText);
//			    }
				if(jsonObj.hasOwnProperty('error')) {
					this.getResponse(mType, "error");
					return;
				}

				if(!jsonObj.hasOwnProperty('token')) {
					this.getResponse(mType, successLogin);

					return;
				}

//	 				_this.setToken(jsonObj.token);
				this.setSessionId(jsonObj.sessionId);

				successLogin = true;

			} catch(err) {
				console.log(err);
			}
			this.getResponse(mType, successLogin);
		},

//		changeUserInfo : function(userId) {
//			this.connNode(this.getAppId(), userId, null);
//		},
		
		connSocket : function() {
			var mType="socket";
			var _this = this;
			var successConn = false;

//				var mquery = 'appId='+this.getAppId()+'&'+'token='+this.getToken();
				var mquery = 'sessionId='+this.getSessionId();

				var mURL = "ws://"+this.getAddress.address+":"+this.getAddress.port;

				console.log("socket is " + mURL );	// mquery
				
				var opts = {
						    'timeout': 30*1000,	// connect
						    'reconnection': false,
//						    'reconnectionDelay': 3*1000,
//						    'reconnectionAttempts': 10,
						    'force new connection': true,
							'query' : mquery
							};

				this.socket = io.connect(mURL, opts);
								
				this.socket.on('toclient', 		function (data) {	_this.receiveMessage(data); });
				this.socket.on('disconnect', 	function(){
					console.log('socket disconnected');

					_this.getResponse(mType, "disconnect");
				});
				this.socket.on('error', 		function(err){
					console.log(err);

					_this.getResponse(mType, "error");
				});
				this.socket.on('connect', 		function(){
					console.log('socket connected');

					successConn = true;

//					this.sendMessage('check', 'N', 1, 'null');		// '{"sender":"client"}'

					_this.getResponse(mType, "connect");
				});
				this.socket.on('connect_failed', 		function(){
					console.log('socket connect failed');

//					this.sendMessage('check', 'N', 1, 'null');		// '{"sender":"client"}'

					_this.getResponse(mType, "failed");
				});
		},

		disConnSocket : function() {
			if(!this.socket) return;

			try {
				this.socket.disconnect();
			} catch(err) {
				console.log(err);
			}
		},

		// Logout
  		disConnNode : function() {

//			this.disConnSocket();

			var data = new FormData();
				data.append('sessionId', this.getSessionId());
//				data.append('appId', this.getAppId());
				data.append('userId', this.getUserId());
//				data.append('token', this.getToken());

//	   		var mquery = "appId="+this.getAppId()+"&"+"token="+this.getToken();
//			var mURL = "http://"+this.getAddress.address+":"+this.getAddress.port+"/"+mType;	// mquery;

			this.sendRequest("logout", "POST", data);
  		},

		onLogoutComplete : function(mType, respText) {
			console.log(respText);

			if(respText === "error") {
				this.getResponse(mType, "error");

				return;
			}

			var successDisconn = false;

			try {
				var jsonObj = null;

//					if (kikiMSIEversionCheck() > 4) {
//			        jsonObj = eval('(' + respText + ')');
//			    }
//			    else {
				jsonObj = JSON.parse(respText);
//			    }
				if(jsonObj.hasOwnProperty('error')) {
					this.getResponse(mType, "error");

					return;
				}

//					_this.clearAppId();
//					_this.clearToken();
//					_this.clearUserId();
//					_this.clearResponse();

				successDisconn = true;

			} catch(err) {
				console.log(err);
			}

			this.getResponse(mType, successDisconn);
		},

	  isConnected : function() {
		return this.socket.connected;
	  },
/*
	  sendAction : function(actId) {
	  	this.sendAction(actId, null);
	  },
 */
	  sendAction : function(actId, targetId) {
//	    var mquery = "appId="+this.getAppId()+"&"+"actId="+actId+"&"+"deviceType="+this.getDeviceType()+"&"+"token="+this.getToken();

		var data = new FormData();
		  	data.append('sessionId', this.getSessionId());
//			data.append('appId', this.getAppId());
			data.append('actId', actId);
			data.append('deviceType', this.getDeviceType());
//			data.append('token', this.getToken());

		console.log("targetId is " + targetId);

	    if(targetId != null) data.append("targetId", targetId);

//		var mURL = "http://"+this.getAddress.address+":"+this.getAddress.port+"/"+mType;	// mquery
/*
			if(typeof(Worker) !== "undefined") {
			    console.log("Yes! Web worker support!");
			} else {
			    console.log("Sorry! No Web Worker support..");
			}

			try {
				var filepath = 'file:///C:/Projects/Gamification/sources/Dashboard/js/';
				
				var worker = new Worker(filepath + 'work_xmlhttprequest.js');
				
				worker.onmessage = function(e) {
				  console.log('Worker said: ', e.data);
				 
//				 if(profileIs) _this.sendMessage("profile", 'null');
	
					if(callback != null) callback();
	
					worker.terminate();
				};
				
				worker.postMessage(mURL); 
				
			} catch(err) {
				console.log(err);
			}
 */						
			this.sendRequest("activity", "POST", data);
	  },

		uploadImage : function(imgData) {
//			var mquery = "appId="+this.getAppId()+"&"+"token="+this.getToken();
//			var mURL = "http://"+this.getAddress.address+":"+this.getAddress.port+"/"+mType;	// mquery

			var form = new FormData();
				form.append('sessionId', this.getSessionId());
				form.append("userImg", imgData);

			this.sendRequest("uploadImage", "POST", form);
		},

		onComplete : function(mType, respText) {
			console.log(respText);
//				console.log("msie " + kikiMSIEversionCheck());
			if(mType === 'login'){this.onLoginComplete(mType, respText); return;}; 
			if(mType === 'logout') {this.onLogoutComplete(mType, respText); return;};

			var successSend = false;
			var jsonObj = null;

			if(respText === "error") {
				this.getResponse(mType, "error");

				return;
			}

			try {
//					if (kikiMSIEversionCheck() > 4) {
//			        jsonObj = eval('(' + respText + ')');
//			    	}
//			    	else {
				jsonObj = JSON.parse(respText);
//			    	}

				if(jsonObj.hasOwnProperty('error')) {
					this.getResponse(mType, "error");

					return;
				}

				if(!jsonObj.hasOwnProperty('result')) {
					this.getResponse(mType, successSend);

					return;
				}

				if(jsonObj.result == "success") successSend = true;

			} catch(err) {
				console.log(err);
			}

			this.getResponse(mType, successSend);
		},
/*
		sendMessage : function(getType, getMsgs) {

		console.log("from client= " + getType);

	  	if(!this.isAppId() || !this.isToken()) {
	  		console.log("Can Not get Params... in Dashboard");
	  		
	  		this.getResponse(getType, "requiredParams");
	  		
	  		return;
	  	}
			
			console.log("userId is " + this.getUserId());
			console.log("msgs is " + JSON.stringify(sendMsgs));

			if(getType == "ranking") getType = "toplist";

			var sendMsgs = new Object();
				sendMsgs.sender = "client";
				sendMsgs.type = getType;
				sendMsgs.appId = this.getAppId();
				sendMsgs.serial = this.getToken();
				sendMsgs.userId = this.getUserId();
				sendMsgs.msg = getMsgs;

		  if(this.socket == null || !this.isConnected()) {
			  console.log("socket is disconnect");

			  this.getResponse(getType, "disconnect socket!!");

			  return;
		  }

			this.socket.emit("fromclient", sendMsgs);
//  		this.socket.emit("fromclient", {sender: "client", type:getType, appId:this.getAppId(), serial:this.getToken(), userId:this.getUserId(), msg:getMsgs});
	
			this.connectStatus = 1;
	  },
 */
    sendMessage : function(getType, getMsgs) {		// isFriend, pageNo,

		if(this.socket == null || !this.isConnected()) {
			console.log("socket is disconnect");

			this.getResponse(getType, "disconnect");

			return;
		}

		console.log("from client = " + getType);
		console.log("userId is " + this.getUserId());
		console.log("msgs is " + getMsgs);
	
		if(getType == "ranking") getType = "toplistSS";

		var sendMsgs = new Object();
		
		sendMsgs.sender = "client";
		sendMsgs.type = getType;

//		sendMsgs.appId = this.getAppId();
//		sendMsgs.serial = this.getToken();

			switch(getType) {
				case "profile" :
						if(getMsgs != null)
							sendMsgs.userId = getMsgs[0];
						else
							sendMsgs.userId = this.getUserId();

						break;

				case "updateProfile" :
						sendMsgs.userName = getMsgs[0];

						break;

				case "rewardList" :

						break;

				case "newsfeed" :
						sendMsgs.pageNo = getMsgs[0];
						sendMsgs.isFriend = getMsgs[1];
						sendMsgs.isMine = getMsgs[2];

						break;

				case "toplist" :
				case "toplistSS" :
						sendMsgs.pageNo = getMsgs[0];
						sendMsgs.isFriend = getMsgs[1];

						break;

				case "reqfriendlist" :
				case "sugfriend" :

						break;

				case "srcfriend" :
						sendMsgs.keyword = getMsgs[0];

						break;

				case "friendlist" :
						// 20160615 added keyword prop to sugfriend case in connect factory
	//	                sendMsgs.keyword = data.keyword;
	//	                sendMsgs.userImg = opts.userImg;

						// 20160624 added targetUserId prop to friendlist case in connect factory
						sendMsgs.targetUserId = getMsgs[0];

						break;

				case "reqfriend" :
						sendMsgs.friendUserId = getMsgs[0];

						break;

				case "procreqfriend" :
						sendMsgs.friendUserId = getMsgs[0];
						sendMsgs.acceptYN = getMsgs[1];

						break;

				default :
						break;
			}

  		this.socket.emit("fromclient", sendMsgs);

		this.connectStatus = 1;
    },
	  
    receiveMessage : function(data) {
    	
			console.log("receive message= " + JSON.stringify(data));
			
			this.connectStatus = 2;

			console.log("receive type= " + data.type);

			//if(data.updatedToken === "Y") {
			//	console.log("token is update");
            //
			//	this.setToken(data.serial);
			//} else {
			//	console.log("token is Not update");
			//}

			switch(data.type) {
					case "check":
						console.log("check connection");

//						try {
//							var jsonMsg = JSON.parse(data.msg);
//						} catch(Exception e) {
//							e.printStackTrace();
//						}
						
//						this.getResponse(data.msg);	// jsonMsg.id, jsonMsg.point, jsonMsg.exp
//						this.clearResponse();
/*						
						var stringArray = data.msg.split(" ");
						
						if(stringArray[0] == "Welcome!"){
							this.parseServerLoginMessage(stringArray);
						//	this.parseServerLoginMessage(stringArray);
						}else{
							this.receiveServerMessage(data.msg);
							//this.receiveServerMessage(data.msg);
						}
 */					
						break;
												
					case "profile" :
							var jsonMsg = JSON.parse(data.msg);
						 	
						 	console.log("userId is " + jsonMsg.userId);
						 						 	
						 	this.getResponse(data.type, jsonMsg);
						 	
						 	break;

					case "rewardList" :
							var jsonMsg = JSON.parse(data.msg);

							this.getResponse(data.type, jsonMsg);

							break;

					case "updateProfile" :
							var jsonMsg = JSON.parse(data.msg);

							this.getResponse(data.type, jsonMsg);

							break;

					case "newsfeed" :
							var jsonMsg = JSON.parse(data.msg);
						 	
//						 	for(var k=0; k<jsonMsg.length; k++) {
//							 	console.log("userId is " + jsonMsg[k].UserId);
//							}

							console.log("newsfeed length is " + jsonMsg.length);

						 	this.getResponse(data.type, jsonMsg, data.isLast);
						 	
						 	break;
					 
					case "toplist" :
							var jsonMsg = JSON.parse(data.msg);
						 	
//						 	for(var k=0; k<jsonMsg.length; k++) {
//							 	console.log("userId is " + jsonMsg[k].userId);
//							}

							console.log("ranking length is " + jsonMsg.length);

						 	this.getResponse("ranking", jsonMsg);
						 	
						 	break;
					 
					case "toplistSS" :
							var jsonMsg = JSON.parse(data.msg);
						 	
//						 	for(var k=0; k<jsonMsg.length; k++) {
//							 	console.log("userId is " + jsonMsg[k].userId);
//							}

							console.log("ranking length is " + jsonMsg.rankList.length);

						 	this.getResponse("ranking", jsonMsg, data.isLast);
						 	
						 	break;

					case "reqfriendlist" :
					case "friendlist" :
					case "srcfriend" :
					case "sugfriend" :
							var jsonMsg = JSON.parse(data.msg);
						 	
						 	for(var k=0; k<jsonMsg.length; k++) {
							 	console.log("userId is " + jsonMsg[k].UserId);
							}

						 	this.getResponse(data.type, jsonMsg);
						
							break;
					
					case "reqfriend" :
					case "procreqfriend" :
							console.log(data.msg);

							this.getResponse(data.type, data.msg);

							break;
							
					case "resultSuccess" :
							var resultInfo = JSON.parse(data.msg);
						
							console.log("resultSuccess = " + resultInfo.branch);
						
//							snsInfo.setResultSuccess(resultInfo.branch);

//							snsInfo.closeResultPop();
						
						 	break;
					 	
					case "resultFail" :
							var resultInfo = JSON.parse(data.msg);
						
							console.log("resultSuccess = " + resultInfo.branch);
						
//							snsInfo.setResultFail(resultInfo.branch);
						
//							snsInfo.closeResultPop();
					 	
						 	break;
				 	
						
					case "error" :
							console.log(data.msg);

							this.connectStatus = -1;

						 	this.getResponse(data.type, data.msg);
						 	
							break;
			};

			this.connectStatus = 0;
    },

		setResponse : function(resp) {
			this.resp = resp;
		},
	
		getResponse : function(getType, getJson, isLast) {
			this.resp(getType, getJson, isLast);
		},
	
		clearResponse : function() {
			this.resp = null;
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
        var cValue = null;
        
        if(start != -1) {
            start += cName.length;
            
            var end = cookieData.indexOf(';', start);
            
            if(end == -1) end = cookieData.length;
            
            cValue = cookieData.substring(start, end);

			return decodeURI(cValue);	// unescape(cValue)
        }

		return cValue;
    },

		clearUserId : function() {
			this.clearCookie(this.kiki_widget_userId);
		},

		getUserId : function() {
			return this.getCookie(this.kiki_widget_userId);
		},

		setUserId : function(userSerial) {
//			this.kiki_widget_userId = "kiki_widget_" + new Date().getTime() + "_userId";

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

		clearSessionId : function() {
			this.clearCookie(this.kiki_widget_sessionId);
		},

		getSessionId : function() {
			return this.getCookie(this.kiki_widget_sessionId);
		},

		setSessionId : function(sessionId) {
		//			console.log("sessionId is " + sessionId);

		//			this.kiki_widget_sessionId = "kiki_widget_" + new Date().getTime() + "_sessionId";

			this.setCookie(this.kiki_widget_sessionId, sessionId);
		},

		sendRequest : function(getPath, getType, opts, callback) {

				var getURL = "http://"+this.getAddress.address+":"+this.getAddress.port+"/"+getPath;	// mquery
				var _this = this;

//				console.log("URL is " + getURL);
			
					try {
/*
						if (window.XDomainRequest) {
							console.log("XDomainRequest");

						    var xdr = new XDomainRequest();
//								xdr.withCredentials = true;		// if(getType == "POST")
								xdr.open(getType, getURL);	// true

						    if (xdr) {
						        xdr.onload=function() {
											console.log(xdr.responseText);

//											if(callback != null) callback(getPath, xdr.responseText);
											_this.onComplete(getPath, xdr.responseText);
	       						};
								xdr.onerror = function(err) {
									console.log(err);
								};
						        xdr.send(opts);
						    } else {
								console.log("XDomainRequest Not Null");

//						    	if(callback != null) callback(getPath, "error");
								_this.onComplete(getPath, "error");
							}
						}
 */
							console.log("XMLHttpRequest");

							var xmlHttp = null;

							if (window.XMLHttpRequest)
								xmlHttp=new XMLHttpRequest();
							else
								xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");

							if(this.kikiMSIEversionCheck() < 1 && this.kikiMSIEversionCheck() > 10) xmlHttp.withCredentials = true;		// if(getType == "POST")

				 	   		xmlHttp.ontimeout = function(e) {
				 	   			console.log("time out"); 
				 	   			console.log(e); 
				 	   			
//				 	   			if(callback != null) callback(getPath, "error");
								_this.onComplete(getPath, "error");
							};

					    	xmlHttp.onreadystatechange = function() {
								console.log("readyState is " + xmlHttp.readyState);

								if (xmlHttp.readyState != 4) return;

									if(xmlHttp.status === 200) {		// xmlHttp.status === 0
										console.log("status is " + xmlHttp.status);

//										console.log(xmlHttp.responseText);

//										if(callback != null) callback(getPath, xmlHttp.responseText);
										_this.onComplete(getPath, xmlHttp.responseText);

									} else {			// response status error, errorCode = (-1)*xmlHttp.status;
										console.log("status is " + (-1)*xmlHttp.status);

//										if(callback != null) callback(getPath, "error");
										_this.onComplete(getPath, "error");
									}
				        	};
				  
					    	xmlHttp.open(getType, getURL, true);
//				 	   		xmlHttp.setRequestHeader('Content-Type', 'text/plain');		// application/xml
							xmlHttp.timeout = 10*1000;
			     			xmlHttp.send(opts);

				  } catch(err) {
				  	console.log("error is " + err);	// errorCode = -5

// 				  	if(callback != null) callback(getPath, "error");
					_this.onComplete(getPath, "error");
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
/*
		onComplete : function(getType) {
	 	  	console.log('callback called');
	 	  
	 	  	this.connectStatus = 0;
	 	  
//   	 	snsInfo.setCurNetworkState(g_conn.connectStatus);  // 2015.03.08
	 	  
//			document.removeEventListener('backbutton', SNSInfo.prototype.closeSNS, false);
//			document.addEventListener('backbutton', onBack, false);
		}
 */
		kikiMSIEversionCheck : function() {
			 var ua = window.navigator.userAgent;
			 var msie = ua.indexOf("MSIE ");

			 console.log("msie is " + msie);

			 if ( msie > 0 )      // If Internet Explorer, return version number
				 return parseInt (ua.substring (msie+5, ua.indexOf(".", msie )));
			 else                 // If another browser, return 0
				 return 0;
		 }
	}


