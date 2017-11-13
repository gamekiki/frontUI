 //"use strict";

  var nodeConn = function(resp) {
		this.socket = null;
		this.message = null;

		this.resp = resp;

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
  };
    
	nodeConn.prototype = {

		getAddress : {
//			address : "211.50.119.54",
			address : "211.234.110.144",
//			address : "localhost",
			port : "8087"	// 9092
		},

  		// Login
		connNode : function(appId, userId, deviceType) {
			var mType = "login";
			var _this = this;
			var successLogin = false;
			
			if(appId == null || userId == null) {	// deviceType == null
				console.log("This params should be Not null");

				this.getResponse(mType, "requiredParams", null);
				
				return;
			}
			
			this.setAppId(appId);
			this.setUserId(userId);
			this.setDeviceType(deviceType);

	    	var mquery = "appId="+appId+"&"+"userId="+userId+"&"+"deviceType="+deviceType;
			var mURL = "http://"+this.getAddress.address+":"+this.getAddress.port+"/"+mType+"?"+mquery;

			this.sendRequest(mURL, "GET", null, function(respText) {
			
				console.log(respText);
//				console.log("msie " + kikiMSIEversionCheck());

				try {
					var jsonObj = null;
			
//					if (kikiMSIEversionCheck() > 4) {
//			        jsonObj = eval('(' + respText + ')');
//			    }
//			    else {
			        jsonObj = JSON.parse(respText);
//			    }

					if(jsonObj.hasOwnProperty('error')) {
						_this.getResponse(mType, "error", null);

						return;
					}

				  if(!jsonObj.hasOwnProperty('token')) {
					_this.getResponse(mType, successLogin, null);

				  	return; 			 
				  }
				  
	 				_this.setToken(jsonObj.token);

					successLogin = true;

				} catch(err) {
					console.log(err);
				}

				_this.getResponse(mType, successLogin, null);
			});

		},

		changeUserInfo : function(userId) {
			this.connNode(this.getAppId(), userId, null);
		},
		
		connSocket : function() {
			var mType="socket";
			var _this = this;
			var successConn = false;
		  	
		  	if(!this.isAppId() || !this.isToken()) {
		  		console.log("Can Not get Params... in Socket");
		  		
					this.getResponse(mType, "requiredParams", null);

		  		return;
		  	}
				
				var mURL = "ws://"+this.getAddress.address+":"+this.getAddress.port;
				var mquery = 'appId='+this.getAppId()+'&'+'token='+this.getToken();
	
				console.log("socket is " + mURL + "?" + mquery);
				
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

					_this.getResponse(mType, "disconnect", null);
				});
				this.socket.on('error', 		function(err){
					console.log(err);

					_this.getResponse(mType, "error", null);
				});
				this.socket.on('connect', 		function(){
					console.log('socket connected');

//					this.sendMessage('check', 'N', 1, 'null');		// '{"sender":"client"}'

					_this.getResponse(mType, "connect", null);
				});
				this.socket.on('connect_failed', 		function(){
					console.log('socket connect failed');

//					this.sendMessage('check', 'N', 1, 'null');		// '{"sender":"client"}'

					_this.getResponse(mType, "connectFailed", null);
				});
		},

		// Logout
  		disConnNode : function() {
			var mType="logout";
  			var _this = this;
			var successDisconn = false;
			
			this.disConnSocket();
		  	
		  	if(!this.isAppId() || !this.isToken()) {
		  		console.log("Can Not get Params... in DisConn");
		  		
				this.getResponse(mType, "requiredParams", null);
		  	}
								
	   		var mquery = "appId="+this.getAppId()+"&"+"token="+this.getToken();
			var mURL = "http://"+this.getAddress.address+":"+this.getAddress.port+"/"+mType+"?"+mquery;

			this.sendRequest(mURL, "GET", null, function(respText) {
				console.log(respText);

				try {
					var jsonObj = null;

//					if (kikiMSIEversionCheck() > 4) {
//			        jsonObj = eval('(' + respText + ')');
//			    }
//			    else {
					jsonObj = JSON.parse(respText);
//			    }
					if(jsonObj.hasOwnProperty('error')) {
						_this.getResponse(mType, "error", null);

						return;
					}

					_this.clearAppId();
					_this.clearToken();
					_this.clearUserId();
//					_this.clearResponse();
	
					successDisconn = true;
				
				} catch(err) {
					console.log(err);
				} 		
				
				_this.getResponse(mType, successDisconn, null);
			});
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

	  sendAction : function(actId) {
	  	this.sendAction(actId, null);
	  },
/*
	  sendAction : function(actId, callback) {
	  	this.sendAction(actId, null, callback);
	  },
 */
	  sendAction : function(actId, targetId) {
		  console.log("sendAction", actId,targetId)
		var mType="activity";
		var _this = this;
		var successSend = false;
						
	  	if(!this.isAppId() || !this.isToken()) {
	  		console.log("Can Not get Params... in Activity");

			this.getResponse(mType, "requiredParams", null);
	  		
	  		return;
	  	}	  	

//	  	console.log("appId is " + this.getAppId() + " " + "deviceType is " + this.getDeviceType());
//	  	console.log("token is " + this.getToken());
	  	
	    var mquery = "appId="+this.getAppId()+"&"+"actId="+actId+"&"+"deviceType="+this.getDeviceType()+"&"+"token="+this.getToken();

		console.log("targetId is " + targetId);

	    if(targetId != null) mquery = mquery +"&"+ "targetId="+targetId;
		
		var mURL = "http://"+this.getAddress.address+":"+this.getAddress.port+"/"+mType+"?"+mquery;
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
			this.sendRequest(mURL, "GET", null, function(respText) {
//				console.log(respText);
				console.log(respText);
//				console.log("msie " + kikiMSIEversionCheck());

				try {
					var jsonObj = null;
			
//					if (kikiMSIEversionCheck() > 4) {
//			        jsonObj = eval('(' + respText + ')');
//			    }
//			    else {
			        jsonObj = JSON.parse(respText);
//			    }

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
			var mType="uploadImage";
			var _this = this;
			var successSend = false;

			if(!this.isAppId() || !this.isToken()) {
				console.log("Can Not get Params... in Activity");

				this.getResponse(mType, "requiredParams", null);

				return;
			}

			var mquery = "appId="+this.getAppId()+"&"+"token="+this.getToken();
			var mURL = "http://"+this.getAddress.address+":"+this.getAddress.port+"/"+mType+"?"+mquery;

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
/*
		sendMessage : function(getType, getMsgs) {

		console.log("from client= " + getType);

	  	if(!this.isAppId() || !this.isToken()) {
	  		console.log("Can Not get Params... in Dashboard");
	  		
	  		this.getResponse(getType, "requiredParams", null);
	  		
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

			  this.getResponse(getType, "disconnect socket!!", null);

			  return;
		  }

			this.socket.emit("fromclient", sendMsgs);
//  		this.socket.emit("fromclient", {sender: "client", type:getType, appId:this.getAppId(), serial:this.getToken(), userId:this.getUserId(), msg:getMsgs});
	
			this.connectStatus = 1;
	  },
 */
    sendMessage : function(getType, getMsgs) {	// isFriend, pageNo, 

		console.log("from client= " + getType);

	  	if(!this.isAppId() || !this.isToken()) {
	  		console.log("Can Not get Params... in Dashboard");
	  		
				this.getResponse(getType, "requiredParams", null);
	  		
	  		return;
	  	}
			
		console.log("userId is " + this.getUserId());
		console.log("msgs is " + getMsgs);
	
		if(getType == "ranking") getType = "toplistSS";

		var sendMsgs = new Object();
		
		sendMsgs.sender = "client";
		sendMsgs.type = getType;

		sendMsgs.appId = this.getAppId();
		sendMsgs.serial = this.getToken();

				switch(getType) {
						case "profile" :	
								if(getMsgs != null)
									sendMsgs.userId = getMsgs[0];
								else 
									sendMsgs.userId = this.getUserId();
															
								break;		

						case "updateProfile" :
								sendMsgs.userName = getMsgs;
								
								break;
														
						case "rewardList" :
						
								break;
																
						case "newsfeed" :	
								sendMsgs.pageNo = getMsgs[0];
								sendMsgs.isFriend = getMsgs[1];
								sendMsgs.isMine = getMsgs[2];
																			
								break;		
								
						case "toplistSS" :	
								sendMsgs.pageNo = getMsgs[0];
								sendMsgs.isFriend = getMsgs[1];
													
								break;	
																													
						case "reqfriendlist" :
						case "sugfriend" :
						
								break;
								
						case "srcfriend" :
								sendMsgs.keyword = getMsgs;
																		
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

		if(this.socket == null || !this.isConnected()) {
			console.log("socket is disconnect");

			this.getResponse(getType, "disconnect socket!!", null);

			return;
		}

  		this.socket.emit("fromclient", sendMsgs);
//  		this.socket.emit("fromclient", {sender: "client", type:getType, appId:this.getAppId(), serial:this.getToken(), userId:this.getUserId(), isFriend:isFriend, pageNo:pageNo, msg:getMsgs});
	
			this.connectStatus = 1;

    },
	  
    receiveMessage : function(data) {
    	
			console.log("receive message= " + JSON.stringify(data));
			
			this.connectStatus = 2;

			console.log("receive type= " + data.type);

			if(data.hasOwnProperty("serial")) {
				console.log("new token is " + data.serial);

//				this.setToken(data.serial);
			}

			switch(data.type) {
					case "check":
						console.log("check connection");
//						console.log("client serial is " + data.serial);
						
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
 						    	
//				    SNSInfo.prototype.loginSNS();           
//				    snsInfo.loginSNS();         

						break;
												
					 case "profile" :
							var jsonMsg = JSON.parse(data.msg);
						 	
						 	console.log("userId is " + jsonMsg.userId);
						 						 	
						 	this.getResponse(data.type, jsonMsg, null);
						 	
						 	break;

					case "rewardList" :
							var jsonMsg = JSON.parse(data.msg);

							this.getResponse(data.type, jsonMsg, null);

							break;

					case "updateProfile" :
							var jsonMsg = JSON.parse(data.msg);

							this.getResponse(data.type, jsonMsg, null);

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

						 	this.getResponse("ranking", jsonMsg, null);
						 	
						 	break;
					 
					 case "toplistSS" :
							var jsonMsg = JSON.parse(data.msg);
						 	
//						 	for(var k=0; k<jsonMsg.length; k++) {
//							 	console.log("userId is " + jsonMsg[k].userId);
//							}

							console.log("ranking length is " + jsonMsg.length);

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

						 	this.getResponse(data.type, jsonMsg, null);
						
							break;
					
					case "reqfriend" :
					case "procreqfriend" :
							console.log(data.msg);

							this.getResponse(data.type, data.msg, null);

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

							console.log("appId is " + data.appId);
							console.log("token is " + data.serial);

							this.connectStatus = -1;

						 	this.getResponse(data.type, data.msg, null);
						 	
							break;
			};

//			this.connectStatus = 0;
    },

		setResponse : function(resp) {
			this.resp = resp;
		},
	
		getResponse : function(getType, getJson, isLast) {
			this.resp(getType, isLast, getJson);
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

		sendRequest : function(getURL, getType, opts, callback) {
				
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
						   console.log("xmlHttp 935");
						   var xmlHttp = null;
							if (window.XMLHttpRequest)
                                xmlHttp=new XMLHttpRequest();
                            else
                                xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
							if(kikiMSIEversionCheck() == 0) xmlHttp.withCredentials = true;
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
 