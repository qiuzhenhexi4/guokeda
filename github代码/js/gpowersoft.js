function toggleOnOff(){
	for (var i = 0; i < arguments.length; i++){
		if( $(arguments[i]).hasClass('on') || $(arguments[i]).hasClass('off') ){
			$(arguments[i]).toggleClass('on off');
		}else{
			$(arguments[i]).addClass('on');
		}
	}
}

//移动端主导航 
$(".mobile-nav a").each(function(index) {
	$(this).css({ 'animation-delay': (index / 20) + 's'});
});
$('.mobile-nav li strong').click(function() {
	$(this).next('dl').slideToggle(500);
	$(this).toggleClass('on');
	if ($(this).hasClass('on')) {
		$(this).html("&times;")
	} else {
		$(this).html("+")
	}
})

// 搜索弹出效果
$('.ser_btn').click(function(){
	$('.search_box').addClass('on')
	setTimeout(function(){
		$(".search_box .notxt").focus();
	},100)
})
$('.search_box .close').click(function(){
	$('.search_box').removeClass('on')
}) 


// 导航固定
fixNav();
$(window).scroll(function(){
	fixNav();
});
function fixNav(){
	var sWSon = document.documentElement.clientWidth;
	var sHeight = document.documentElement.clientHeight;
	var bodyHeight = document.body.scrollHeight;
	var x = $('header').next().offset().top;
	if(bodyHeight > sHeight+100 && sWSon>1024 ){
		$(window).scroll(function(){
			var scrollTop = $(window).scrollTop();
			if(scrollTop > 300){
				$('header').addClass('currents')
				$('body').css('padding-top',x)
			}else{
				$('header').removeClass('currents')
				$('body').css('padding-top',0)
			}
		});
	}
}

// 鼠标滚动渐渐出现
setTimeout("enterEffects();","200");
$(document).ready(function(){
	enterEffects();
});
$(window).resize(function(){
	var resizeTimer = null;
	if (resizeTimer) clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function(){
		enterEffects();
	},50);
});
$(window).scroll(function(){
	enterEffects();
});
// 鼠标滚动渐渐出现
$('.effect11,.effect21,.effect31,.effect41,.effect51,.effectChildren').each(function() {
	$(this).find("li").each(function(index){
		var len = $(this).parent().find("li").length;
		$( this ).css({'transition-delay': (index*0.5/len)+'s'});
		// $( this ).css({'transition-delay': (index*0.05)+'s'});
	})
});
function enterEffects(){
	var sWSon = document.documentElement.clientWidth;
	if(sWSon >= 992){
		$(".effect").each(function(index, element) {
			var e = $(this);
			var c = $(window).height();
			if($(window).scrollTop()>=$(e).offset().top - 0.9 * c){
				$(e).addClass("isView");
			}else{
				$(e).removeClass("isView");
			}
		});
	}
}
// 二级页侧栏菜单
$('.sub_menu a.current').each(function(){
	$(this).parent('li').addClass('current');
	$(this).parents('.sub_menu ul').parent('li').addClass('on');
	$(this).parents('.sub_menu ul').slideDown(300);
	$(this).parents('.sub_menu ul').siblings('.arrow').addClass('on');
})
$('.sub_menu .arrow').click(function(){
	$(this).toggleClass('on');
	$(this).parent('li').toggleClass('on');
	$(this).siblings('ul').toggle(300);
})
$('.sub_left_title').click(function(){
	var sWSon = document.documentElement.clientWidth;
	if(sWSon < 992 && $('.sub_menu').length > 0 ){
		$(this).toggleClass('on');
		$('.sub_left').toggleClass('on');
		$('.sub_menu').toggle(300);
	}
})

// 页码下拉
$('.pages .selectLink').click(function() {
	$(this).find('.arrow').toggleClass('on');
	$(this).find('.alertBox').toggleClass('on');
	$(this).toggleClass('on');
})


// tab切换
$.fn.extend({
	tab: function (options){
		var defaults = {             //默认参数
			ev : 'mouseover',        //默认事件'mouseover','click'
			til : 'h2',              //默认标签
			box : '.tab_list',       //默认列表
			defaultNum : 0,          //默认展示第几个
			eachPage : 1,            //每次切换的个数
			delay : 100,             //延迟时间
			auto : true,             //是否自动切换 true,false
			speed : 4000,            //自动切换间隔时间(毫秒)
			init : function(){},     //首次加载时触发时间
			before : function (){},  //切换前触发事件
			after : function (){},   //切换后触发事件
			more : true              //是否有more,false,true
		};
		var options = $.extend(defaults, options);  //用户设置参数覆盖默认参数
		
		return this.each(function (){
			var o = options;
			var obj = $(this);
			var oTil = obj.find(o.til);
			var oBox = obj.find(o.box);
			var oMore = null;
			var iNum = o.defaultNum;
			var iLen = oTil.length;
			var iBefore = o.before;
			var iAfter = o.after;
			var iEach = o.eachPage;
						
			// 默认选中第一个
			o.init();
			if( iNum >= 0 ){
				change( oTil.eq(iNum) );
			}
			oTil.each(function(i){
				if( $(this).children().length == 0 ){
					oBox.slice( iEach * iNum , iEach * (iNum + 1) ).attr('block_name',$(this).html() )
				}
			})
			
			//鼠标事件绑定
			oTil.bind(o.ev , function (){
				var _this = this;
				if(o.ev == 'mouseover' && o.delay){
					_this.timer = setTimeout(function (){
						change(_this);
					},o.delay);
				}else{
					change(_this);
				}; 
			})

			oTil.bind('mouseout',function (){
				var _this = this;
				clearTimeout(_this.timer);
			});
			
			//自动切换效果
			(function autoPlay(){
				var timer2 = null;
				if(o.auto){
					function play(){
						iNum++;
						if(iNum >= iLen){
							iNum =0;
						};
						change(oTil.eq(iNum));
					};
					timer2 = setInterval(play,o.speed);
					obj.on('mouseover',function (){
						clearInterval(timer2);
					})
					obj.on('mouseout',function (){
						timer2 = setInterval(play,o.speed);
					})
				};
			})();
			
			function change(box){
				iBefore(iNum,obj);
				iNum = $(box).index() - obj.find(o.til).eq(0).index();
				
				oTil.removeClass('on').addClass('off');
				oBox.removeClass('on').addClass('off');
				if(o.more){
					oMore = obj.find('.more');
					oMore.removeClass('on').addClass('off');
					oMore.eq(iNum).addClass('on').removeClass('off');
				};
				oTil.eq(iNum).addClass('on').removeClass('off');
				oBox.slice( iEach * iNum , iEach * (iNum + 1) ).addClass('on').removeClass('off');
				iAfter(iNum,obj);
			}
			
		});
	}
})


