var GbAPI = (function(){
    function GbAPI(appId){
        this.appId = appId;
        //this.BASE_URL = "http://211.50.119.54:8087";
        this.BASE_URL =  "http://gamekiki.com/kiki_client_modules";
    }
    /**
     * call API request
     * @param {string} playerId
     * @param {string} activity Id 
     * @param {opt} option object        
     * @param {opt[callback]} callback function when xmlHttpRequest Done
     * @param {opt[context]} context to use when callback fxn occurs     
     */
    GbAPI.prototype.call = function(playerId, actId, opt){
        if(!this.appId){
            alert("appId information not exist");
            return
        }
        var url = this.BASE_URL + "/activity?" +
        "&appId="+ this.appId+
        "&actId="+actId+
        "&userId="+playerId;
        this.sendXMLHttpReq(url, "GET", opt);            
    }
    
    GbAPI.prototype.sendXMLHttpReq = function(url, method, option){
        if(!option) option = {};
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.callback = option.callback? option.callback : false;
        xmlhttp.orgContext = option.context? option.context : false;
        xmlhttp.opt = option;
        
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {	
                    xmlhttp.orgContext = !xmlhttp.orgContext? this : xmlhttp.orgContext;
                    xmlhttp.callback? xmlhttp.callback.call(xmlhttp.orgContext, xmlhttp.responseText) : false;                
            }
        }
        
        xmlhttp.open(method, url, true);
        xmlhttp.setRequestHeader('Content-Type', 'text/plain');
        xmlhttp.send();
    }
    return GbAPI;
})();