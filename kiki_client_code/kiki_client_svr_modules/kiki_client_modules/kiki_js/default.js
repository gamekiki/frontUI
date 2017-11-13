jQuery(function($){
	
	// Side Menu
	var menu_v = $('.tNav');
	var sItem = menu_v.find('>ul>li');
	var ssItem = menu_v.find('>ul>li>ul>li');
	var lastEvent = null;
	
	
	menu_v.find('>ul>li>ul>li[class=active]').parents('li').attr('class','active');
	menu_v.find('>ul>li[class=active]').find('>ul').css('display','block');

	$(".conCon02:not("+$(".sub_list02 li a.on").attr("href")+")").hide();
	function menu_vToggle(event){
		var t = $(this);
		
		if (this == lastEvent) return false;
		lastEvent = this;
		setTimeout(function(){ lastEvent=null }, 200);
		
		if (t.next('ul').is(':hidden')) {
			sItem.find('>ul').slideUp(100);
			t.next('ul').slideDown(100);
		} else if(!t.next('ul').length) {
			sItem.find('>ul').slideUp(100);
		} else {
			t.next('ul').slideUp(100);
		}
		
		if (t.parent('li').hasClass('active')){
			t.parent('li').removeClass('active');
		} else {
			sItem.removeClass('active');
			t.parent('li').addClass('active');
		}
	}
	sItem.find('>a').click(menu_vToggle).focus(menu_vToggle);
	
	function subMenuActive(){
		ssItem.removeClass('active');
		$(this).parent(ssItem).addClass('active');
	}; 
	ssItem.find('>a').click(subMenuActive).focus(subMenuActive);
	
	//icon
	menu_v.find('>ul>li>ul').prev('a').append('<span class="i"></span>');
});

	// Gnb Style
	// gnb01
jQuery(function($){

	$("#btn_list01").click(function() {
		$(".gnb_list01").fadeIn("fast");
		$("#btn_list01").css("display","none");
		$("#btn_close01").css("display","block");
	});
	
	$("#btn_close01").click(function() {
		$(".gnb_list01").fadeOut("fast");
		$("#btn_close01").css("display","none");
		$("#btn_list01").css("display","block");
	});

	$(".depth1>li>a").each(function(index){
		$(this).attr("data-index",index);
	}).mouseenter(function() {
		var index = $(this).attr("data-index");
		$(".depth2[data-index="+index+"]").slideDown("fast");
		$(".depth2[data-index!="+index+"]").fadeOut();
	}).focus(function(){
		$(this).mouseenter();
	});
	
	$(".depth1>li").each(function(index){
		$(this).attr("data-index",index);
	}).mouseleave(function() {
		var index = $(this).attr("data-index");
		$(".depth2[data-index="+index+"]").fadeOut();
	});

	$(".depth2").each(function(index){
		$(this).attr("data-index",index);
	});

});

	// gnb02
jQuery(function($){

	$("#btn_list02").click(function() {
		$(".gnb_list02").fadeIn("fast");
		$("#btn_list02").css("display","none");
		$("#btn_close02").css("display","block");
	});
	
	$("#btn_close02").click(function() {
		$(".gnb_list02").fadeOut("fast");
		$("#btn_close02").css("display","none");
		$("#btn_list02").css("display","block");
	});

	$(".depth1>li>a").each(function(index){
		$(this).attr("data-index",index);
	}).mouseenter(function() {
		var index = $(this).attr("data-index");
		$(".depth2[data-index="+index+"]").slideDown("fast");
		$(".depth2[data-index!="+index+"]").fadeOut();
	}).focus(function(){
		$(this).mouseenter();
	});
	
	$(".depth1>li").each(function(index){
		$(this).attr("data-index",index);
	}).mouseleave(function() {
		var index = $(this).attr("data-index");
		$(".depth2[data-index="+index+"]").fadeOut();
	});

	$(".depth2").each(function(index){
		$(this).attr("data-index",index);
	});

});

	//gnb03
jQuery(function($){

	$("#btn_list03").click(function() {
		$(".gnb_list03").fadeIn("fast");
		$("#btn_list03").css("display","none");
		$("#btn_close03").css("display","block");
	});
	
	$("#btn_close03").click(function() {
		$(".gnb_list03").fadeOut("fast");
		$("#btn_close03").css("display","none");
		$("#btn_list03").css("display","block");
	});

	$(".depth1m>li>a").each(function(index){
		$(this).attr("data-index",index);
	}).mouseenter(function() {
		var index = $(this).attr("data-index");
		$(".depth2m[data-index="+index+"]").slideDown("fast");
		$(".depth2m[data-index!="+index+"]").fadeOut();
	}).focus(function(){
		$(this).mouseenter();
	});
	
	$(".depth1m>li").each(function(index){
		$(this).attr("data-index",index);
	}).mouseleave(function() {
		var index = $(this).attr("data-index");
		$(".depth2m[data-index="+index+"]").fadeOut();
	});

	$(".depth2m").each(function(index){
		$(this).attr("data-index",index);
	});

});

	// gnb04
jQuery(function($){

	$("#btn_list04").click(function() {
		$(".gnb_list04").fadeIn("fast");
		$("#btn_list04").css("display","none");
		$("#btn_close04").css("display","block");
	});
	
	$("#btn_close04").click(function() {
		$(".gnb_list04").fadeOut("fast");
		$("#btn_close04").css("display","none");
		$("#btn_list04").css("display","block");
	});

	$(".depth1>li>a").each(function(index){
		$(this).attr("data-index",index);
	}).mouseenter(function() {
		var index = $(this).attr("data-index");
		$(".depth2[data-index="+index+"]").slideDown("fast");
		$(".depth2[data-index!="+index+"]").fadeOut();
	}).focus(function(){
		$(this).mouseenter();
	});
	
	$(".depth1>li").each(function(index){
		$(this).attr("data-index",index);
	}).mouseleave(function() {
		var index = $(this).attr("data-index");
		$(".depth2[data-index="+index+"]").fadeOut();
	});

	$(".depth2").each(function(index){
		$(this).attr("data-index",index);
	});

});

	// Snb Style
	// snbBox01
jQuery(function($){
  
  var snbBox01 = $('div.snbBox01');
  var sItem = snbBox01.find('>ul>li');
  var ssItem = snbBox01.find('>ul>li>ul>li');
  var lastEvent = null;

  sItem.find('>ul').css('display','none');
  snbBox01.find('>ul>li>ul>li[class=active]').parents('li').attr('class','active');
  snbBox01.find('>ul>li[class=active]').find('>ul').css('display','block');

  function snbBox01Toggle(event){
    var t = $(this);
    
    if (this == lastEvent) return false;
    lastEvent = this;
    setTimeout(function(){ lastEvent=null }, 200);
    
    if (t.next('ul').is(':hidden')) {
      sItem.find('>ul').slideUp(100);
      t.next('ul').slideDown(100);
    } else if(!t.next('ul').length) {
      sItem.find('>ul').slideUp(100);
    } else {
      t.next('ul').slideUp(100);
    }
    
    if (t.parent('li').hasClass('active')){
      t.parent('li').removeClass('active');
    } else {
      sItem.removeClass('active');
      t.parent('li').addClass('active');
    }
  }
  sItem.find('>a').click(snbBox01Toggle).focus(snbBox01Toggle);
  
  function subMenuActive(){
    ssItem.removeClass('active');
    $(this).parent(ssItem).addClass('active');
  }; 
  ssItem.find('>a').click(subMenuActive).focus(subMenuActive);
  
});

	// snbBox02
jQuery(function($){
  
  var snbBox02 = $('div.snbBox02');
  var sItem = snbBox02.find('>ul>li');
  var ssItem = snbBox02.find('>ul>li>ul>li');
  var lastEvent = null;

  sItem.find('>ul').css('display','none');
  snbBox02.find('>ul>li>ul>li[class=active]').parents('li').attr('class','active');
  snbBox02.find('>ul>li[class=active]').find('>ul').css('display','block');

  function snbBox02Toggle(event){
    var t = $(this);
    
    if (this == lastEvent) return false;
    lastEvent = this;
    setTimeout(function(){ lastEvent=null }, 200);
    
    if (t.next('ul').is(':hidden')) {
      sItem.find('>ul').slideUp(100);
      t.next('ul').slideDown(100);
    } else if(!t.next('ul').length) {
      sItem.find('>ul').slideUp(100);
    } else {
      t.next('ul').slideUp(100);
    }
    
    if (t.parent('li').hasClass('active')){
      t.parent('li').removeClass('active');
    } else {
      sItem.removeClass('active');
      t.parent('li').addClass('active');
    }
  }
  sItem.find('>a').click(snbBox02Toggle).focus(snbBox02Toggle);
  
  function subMenuActive(){
    ssItem.removeClass('active');
    $(this).parent(ssItem).addClass('active');
  }; 
  ssItem.find('>a').click(subMenuActive).focus(subMenuActive);
  
});

	// snbBox03
jQuery(function($){
  
  var snbBox03 = $('div.snbBox03');
  var sItem = snbBox03.find('>ul>li');
  var ssItem = snbBox03.find('>ul>li>ul>li');
  var lastEvent = null;

  sItem.find('>ul').css('display','none');
  snbBox03.find('>ul>li>ul>li[class=active]').parents('li').attr('class','active');
  snbBox03.find('>ul>li[class=active]').find('>ul').css('display','block');

  function snbBox03Toggle(event){
    var t = $(this);
    
    if (this == lastEvent) return false;
    lastEvent = this;
    setTimeout(function(){ lastEvent=null }, 200);
    
    if (t.next('ul').is(':hidden')) {
      sItem.find('>ul').slideUp(100);
      t.next('ul').slideDown(100);
    } else if(!t.next('ul').length) {
      sItem.find('>ul').slideUp(100);
    } else {
      t.next('ul').slideUp(100);
    }
    
    if (t.parent('li').hasClass('active')){
      t.parent('li').removeClass('active');
    } else {
      sItem.removeClass('active');
      t.parent('li').addClass('active');
    }
  }
  sItem.find('>a').click(snbBox03Toggle).focus(snbBox03Toggle);
  
  function subMenuActive(){
    ssItem.removeClass('active');
    $(this).parent(ssItem).addClass('active');
  }; 
  ssItem.find('>a').click(subMenuActive).focus(subMenuActive);
  
});

	// Tab Style
	// tab01
jQuery(function($){
	$(".tab_con01 ul li :not("+$(".tablist_01 ul li a.on").attr("href")+")").hide();
	$(".tablist_01 ul li a").click(function(){
		$(".tablist_01 ul li a").removeClass("on");
		$(this).addClass("on");
		$(".tab_con01 ul li ").hide();
		$($(this).attr("href")).show();
		return false;
	});
});

	// tab02
jQuery(function($){
	$(".tab_con02 ul li :not("+$(".tablist_02 ul li a.on").attr("href")+")").hide();
	$(".tablist_02 ul li a").click(function(){
		$(".tablist_02 ul li a").removeClass("on");
		$(this).addClass("on");
		$(".tab_con02 ul li ").hide();
		$($(this).attr("href")).show();
		return false;
	});
});

	// tab03
jQuery(function($){
	$(".tab_con03 ul li :not("+$(".tablist_03 ul li a.on").attr("href")+")").hide();
	$(".tablist_03 ul li a").click(function(){
		$(".tablist_03 ul li a").removeClass("on");
		$(this).addClass("on");
		$(".tab_con03 ul li ").hide();
		$($(this).attr("href")).show();
		return false;
	});
});

	// Accordion Style
	// accordion01
jQuery(function($){
	$("dl.accordion_01 dd:not(:first)").css("display","none");
	$("dl.accordion_01 dt:first").addClass("selected");
	$("dl.accordion_01 dt").click(function(){
		if($("+dd",this).css("display")=="none"){
			$("dd").slideUp("fast");
			$("+dd",this).slideDown("fast");
			$("dt").removeClass("selected");
			$(this).addClass("selected");
		}
	}).mouseover(function(){
		$(this).addClass("over");
	}).mouseout(function(){
		$(this).removeClass("over");
	});
});

	// accordion02
jQuery(function($){
	$("dl.accordion_02 dd:not(:first)").css("display","none");
	$("dl.accordion_02 dt:first").addClass("selected");
	$("dl.accordion_02 dt").click(function(){
		if($("+dd",this).css("display")=="none"){
			$("dd").slideUp("fast");
			$("+dd",this).slideDown("slow");
			$("dt").removeClass("selected");
			$(this).addClass("selected");
		}
	}).mouseover(function(){
		$(this).addClass("over");
	}).mouseout(function(){
		$(this).removeClass("over");
	});
});

	// accordion03
jQuery(function($){
	$("accordion_03 dd:not(:first)").css("display","none");
	$("accordion_03 dt:first").addClass("selected");
	$("accordion_03 dt").click(function(){
		if($("+dd",this).css("display")=="none"){
			$("dd").slideUp("fast");
			$("+dd",this).slideDown("slow");
			$("dt").removeClass("selected");
			$(this).addClass("selected");
		}
	}).mouseover(function(){
		$(this).addClass("over");
	}).mouseout(function(){
		$(this).removeClass("over");
	});
});

	// FAQ Style
	// faq01
jQuery(function($){
	$("dl.faq_01 dd:not(:first)").css("display","none");
	$("dl.faq_01 dt:first").addClass("selected");
	$("dl.faq_01 dt").click(function(){
		if($("+dd",this).css("display")=="none"){
			$("dd").slideUp("fast");
			$("+dd",this).slideDown("fast");
			$("dt").removeClass("selected");
			$(this).addClass("selected");
		}
	}).mouseover(function(){
		$(this).addClass("over");
	}).mouseout(function(){
		$(this).removeClass("over");
	});
});

	// faq02
jQuery(function($){
	$("dl.faq_02 dd:not(:first)").css("display","none");
	$("dl.faq_02 dt:first").addClass("selected");
	$("dl.faq_02 dt").click(function(){
		if($("+dd",this).css("display")=="none"){
			$("dd").slideUp("fast");
			$("+dd",this).slideDown("slow");
			$("dt").removeClass("selected");
			$(this).addClass("selected");
		}
	}).mouseover(function(){
		$(this).addClass("over");
	}).mouseout(function(){
		$(this).removeClass("over");
	});
});

	// faq03
jQuery(function($){
	$("dl.faq_03 dd:not(:first)").css("display","none");
	$("dl.faq_03 dt:first").addClass("selected");
	$("dl.faq_03 dt").click(function(){
		if($("+dd",this).css("display")=="none"){
			$("dd").slideUp("fast");
			$("+dd",this).slideDown("fast");
			$("dt").removeClass("selected");
			$(this).addClass("selected");
		}
	}).mouseover(function(){
		$(this).addClass("over");
	}).mouseout(function(){
		$(this).removeClass("over");
	});
});

	// faq04
jQuery(function($){
	$("dl.faq_04 dd:not(:first)").css("display","none");
	$("dl.faq_04 dt:first").addClass("selected");
	$("dl.faq_04 dt").click(function(){
		if($("+dd",this).css("display")=="none"){
			$("dd").slideUp("fast");
			$("+dd",this).slideDown("slow");
			$("dt").removeClass("selected");
			$(this).addClass("selected");
		}
	}).mouseover(function(){
		$(this).addClass("over");
	}).mouseout(function(){
		$(this).removeClass("over");
	});
});




	// filetree01
this.sitemapstyler01 = function(){
	var sitemap1 = document.getElementById("sitemap1")
	if(sitemap1){
		
		this.listItem = function(li){
			if(li.getElementsByTagName("ul").length > 0){
				var ul = li.getElementsByTagName("ul")[0];
				ul.style.display = "none";
				var span = document.createElement("span");
				span.className = "treeon";
				span.onclick = function(){
					ul.style.display = (ul.style.display == "none") ? "block" : "none";
					this.className = (ul.style.display == "none") ? "treeon" : "treeoff";
				};
				li.appendChild(span);
			};
		};
		
		var items = sitemap1.getElementsByTagName("li");
		for(var i=0;i<items.length;i++){
			listItem(items[i]);
		};
		
	};	
};
window.onload = sitemapstyler01;

// filetree02
this.sitemapstyler02 = function(){
	var sitemap2 = document.getElementById("sitemap2")
	if(sitemap2){
		
		this.listItem = function(li){
			if(li.getElementsByTagName("ul").length > 0){
				var ul = li.getElementsByTagName("ul")[0];
				ul.style.display = "none";
				var span = document.createElement("span");
				span.className = "treeon";
				span.onclick = function(){
					ul.style.display = (ul.style.display == "none") ? "block" : "none";
					this.className = (ul.style.display == "none") ? "treeon" : "treeoff";
				};
				li.appendChild(span);
			};
		};
		
		var items = sitemap2.getElementsByTagName("li");
		for(var i=0;i<items.length;i++){
			listItem(items[i]);
		};
		
	};	
};
window.onload = sitemapstyler02;



// filetree03
// this.sitemapstyler03 = function(){
// 	var sitemap3 = document.getElementById("sitemap3")
// 	if(sitemap3){
		
// 		this.listItem = function(li){
// 			if(li.getElementsByTagName("ul").length > 0){
// 				var ul = li.getElementsByTagName("ul")[0];
// 				ul.style.display = "none";
// 				var span = document.createElement("span");
// 				span.className = "treeon";
// 				span.onclick = function(){
// 					ul.style.display = (ul.style.display == "none") ? "block" : "none";
// 					this.className = (ul.style.display == "none") ? "treeon" : "treeoff";
// 				};
// 				li.appendChild(span);
// 			};
// 		};
		
// 		var items = sitemap3.getElementsByTagName("li");
// 		for(var i=0;i<items.length;i++){
// 			listItem(items[i]);
// 		};
		
// 	};	
// };
// window.onload = sitemapstyler03;