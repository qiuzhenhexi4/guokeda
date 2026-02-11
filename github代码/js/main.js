$(document).ready(function () {
    // 懒加载功能
    function lazyLoad() {
        var lazyImages = document.querySelectorAll('.lazyload');

        // 立即加载所有轮播图的图片，包括banner和guangying
        var bannerImages = document.querySelectorAll('.banner-item .lazyload, .guangying-swiper-container .lazyload');
        bannerImages.forEach(function (image) {
            image.src = image.dataset.src || image.src;
            image.classList.remove('lazyload');
            image.classList.add('loaded');
        });

        // 对其他图片使用IntersectionObserver
        var otherImages = Array.from(lazyImages).filter(function (image) {
            return !image.closest('.banner-item') && !image.closest('.guangying-swiper-container');
        });

        // 配置观察器
        var observerOptions = {
            root: null,
            rootMargin: '0px 0px 50px 0px',
            threshold: 0.1
        };

        if ('IntersectionObserver' in window) {
            var imageObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var image = entry.target;
                        if (image.dataset.src) {
                            image.src = image.dataset.src;
                        }
                        image.classList.remove('lazyload');
                        image.classList.add('loaded');
                        imageObserver.unobserve(image);
                    }
                });
            }, observerOptions);

            otherImages.forEach(function (image) {
                imageObserver.observe(image);
            });
        } else {
            // 兼容不支持IntersectionObserver的浏览器 (IE10+)
            var lazyLoadThrottleTimeout;

            function lazyLoadWithoutObserver() {
                if (lazyLoadThrottleTimeout) {
                    clearTimeout(lazyLoadThrottleTimeout);
                }

                lazyLoadThrottleTimeout = setTimeout(function () {
                    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                    
                    otherImages.forEach(function (img, index) {
                        // 使用getBoundingClientRect兼容IE10
                        var rect = img.getBoundingClientRect();
                        var imgTop = rect.top + scrollTop;
                        
                        if (imgTop < (scrollTop + windowHeight + 50)) {
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                            }
                            img.classList.remove('lazyload');
                            img.classList.add('loaded');
                            // 从数组中移除已加载的图片
                            otherImages.splice(index, 1);
                        }
                    });
                    
                    if (otherImages.length === 0) {
                        // 移除事件监听器
                        if (document.removeEventListener) {
                            document.removeEventListener('scroll', lazyLoadWithoutObserver);
                            window.removeEventListener('resize', lazyLoadWithoutObserver);
                            window.removeEventListener('orientationchange', lazyLoadWithoutObserver);
                        } else if (document.detachEvent) {
                            // IE10兼容
                            document.detachEvent('onscroll', lazyLoadWithoutObserver);
                            window.detachEvent('onresize', lazyLoadWithoutObserver);
                        }
                    }
                }, 20);
            }

            // 绑定事件监听器，兼容IE10
            if (document.addEventListener) {
                document.addEventListener('scroll', lazyLoadWithoutObserver);
                window.addEventListener('resize', lazyLoadWithoutObserver);
                window.addEventListener('orientationchange', lazyLoadWithoutObserver);
            } else if (document.attachEvent) {
                document.attachEvent('onscroll', lazyLoadWithoutObserver);
                window.attachEvent('onresize', lazyLoadWithoutObserver);
            }
            
            // 初始检查
            lazyLoadWithoutObserver();
        }
    }

    // 元素进入视口动画
    function initScrollAnimation() {
        var animatedElements = document.querySelectorAll('.column-section, .content-item, .combined-section');
        
        if ('IntersectionObserver' in window) {
            var observerOptions = {
                root: null,
                rootMargin: '0px 0px -50px 0px',
                threshold: 0.1
            };
            
            var animationObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var element = entry.target;
                        element.classList.add('visible');
                        animationObserver.unobserve(element);
                    }
                });
            }, observerOptions);
            
            animatedElements.forEach(function (element) {
                animationObserver.observe(element);
            });
        } else {
            // 兼容不支持IntersectionObserver的浏览器 (IE10+)
            var scrollAnimationThrottleTimeout;
            
            function scrollAnimationWithoutObserver() {
                if (scrollAnimationThrottleTimeout) {
                    clearTimeout(scrollAnimationThrottleTimeout);
                }
                
                scrollAnimationThrottleTimeout = setTimeout(function () {
                    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                    
                    animatedElements.forEach(function (element) {
                        if (!element.classList.contains('visible')) {
                            var rect = element.getBoundingClientRect();
                            var elementTop = rect.top + scrollTop;
                            
                            if (elementTop < (scrollTop + windowHeight - 50)) {
                                element.classList.add('visible');
                            }
                        }
                    });
                }, 30);
            }
            
            // 绑定事件监听器，兼容IE10
            if (document.addEventListener) {
                document.addEventListener('scroll', scrollAnimationWithoutObserver);
                window.addEventListener('resize', scrollAnimationWithoutObserver);
            } else if (document.attachEvent) {
                document.attachEvent('onscroll', scrollAnimationWithoutObserver);
                window.attachEvent('onresize', scrollAnimationWithoutObserver);
            }
            
            // 初始检查
            scrollAnimationWithoutObserver();
        }
    }

    // 左侧栏隐藏/展开功能
    function initLeftToggle() {
        var toggleBtn = document.getElementById('left-toggle-btn');
        var leftSection = document.getElementById('section-2-left');
        
        if (toggleBtn && leftSection) {
            toggleBtn.addEventListener('click', function () {
                leftSection.classList.toggle('collapsed');
                
                // 切换图标
                var icon = this.querySelector('.toggle-icon');
                if (icon) {
                    if (leftSection.classList.contains('collapsed')) {
                        icon.textContent = '≡';
                    } else {
                        icon.textContent = '≡';
                    }
                }
            });
        }
    }

    // 平滑滚动功能
    function initSmoothScroll() {
        var smoothLinks = document.querySelectorAll('a[href^="#"]');
        
        smoothLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                var href = this.getAttribute('href');
                if (href === '#') return;
                
                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    // 平滑滚动实现，兼容IE10
                    var startPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                    var targetRect = target.getBoundingClientRect();
                    // 添加100px的顶部偏移，确保内容不卡边
                    var targetPos = targetRect.top + startPos - 160;
                    // 确保滚动位置不会小于0
                    targetPos = Math.max(0, targetPos);
                    var distance = targetPos - startPos;
                    var duration = 800;
                    var startTime = null;
                    
                    function animation(currentTime) {
                        if (startTime === null) startTime = currentTime;
                        var timeElapsed = currentTime - startTime;
                        var run = easeInOutQuad(timeElapsed, startPos, distance, duration);
                        
                        // 设置滚动位置，兼容IE10
                        if (window.pageYOffset !== undefined) {
                            window.scrollTo(0, run);
                        } else if (document.documentElement && document.documentElement.scrollTop) {
                            document.documentElement.scrollTop = run;
                        } else if (document.body) {
                            document.body.scrollTop = run;
                        }
                        
                        if (timeElapsed < duration) requestAnimationFrame(animation);
                    }
                    
                    // 缓动函数
                    function easeInOutQuad(t, b, c, d) {
                        t /= d / 2;
                        if (t < 1) return c / 2 * t * t + b;
                        t--;
                        return -c / 2 * (t * (t - 2) - 1) + b;
                    }
                    
                    // 使用requestAnimationFrame或setTimeout兼容IE10
                    if (window.requestAnimationFrame) {
                        requestAnimationFrame(animation);
                    } else {
                        // IE10兼容
                        var startTime = new Date().getTime();
                        var timer = setInterval(function() {
                            var currentTime = new Date().getTime();
                            var timeElapsed = currentTime - startTime;
                            if (timeElapsed >= duration) {
                                clearInterval(timer);
                                return;
                            }
                            animation(currentTime);
                        }, 16);
                    }
                }
            });
        });
    }

    // 第二部分左侧栏懒加载进入动画
    function initSecondLeftAnimation() {
        var secondLeft = document.getElementById('section-2-left-new');
        var section1 = document.querySelector('.section-1');
        var section2 = document.getElementById('section-2');
        var section3 = document.querySelector('.section-3');
        
        if (!secondLeft || !section1 || !section2) return;
        
        function checkScroll() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            
            // 获取各部分的位置信息
            var section1Rect = section1.getBoundingClientRect();
            var section2Rect = section2.getBoundingClientRect();
            var section1Bottom = section1Rect.bottom + scrollTop;
            var section2Top = section2Rect.top + scrollTop;
            var section2Bottom = section2Rect.bottom + scrollTop;
            
            // 当第二部分进入视口时显示左侧栏，当离开视口时隐藏
            if (scrollTop > section1Bottom - 200 && scrollTop < section2Bottom - windowHeight + 200) {
                secondLeft.classList.add('visible');
            } else {
                secondLeft.classList.remove('visible');
            }
        }
        
        // 绑定事件监听器，兼容IE10
        if (window.addEventListener) {
            window.addEventListener('scroll', checkScroll);
        } else if (window.attachEvent) {
            window.attachEvent('onscroll', checkScroll);
        }
        
        // 初始检查
        checkScroll();
    }

    // 初始化所有功能
    lazyLoad();
    initScrollAnimation();
    initLeftToggle();
    initSmoothScroll();
    initSecondLeftAnimation();

    // Banner轮播
    new Swiper('.swiper-banner-box', {
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        // 添加以下分页配置
        pagination: {
        el: '.swiper-pagination', // 分页容器选择器
        clickable: true, // 允许点击分页切换
        type: 'bullets' // 分页类型：dots
        }
    })

    // 国科大光影轮播
    new Swiper('.guangying-swiper-container', {
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
       
        // 添加以下分页配置
        pagination: {
        el: '.guangying-swiper-pagination', // 分页容器选择器
        clickable: true, // 允许点击分页切换
        type: 'bullets' // 分页类型：dots
        }
    })

    // 国科大校报轮播 - 存储实例以便外部访问
    var biweeklySwiper = new Swiper('.biweekly-swiper-container', {
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        // observer: true,
        // observeParents: true,
        // width: '100%',
        // autoHeight: true,
        // // 禁用Swiper的宽度计算，使用CSS控制
        // setWrapperSize: false,
        // 添加以下分页配置
        pagination: {
        el: '.biweekly-swiper-pagination', // 分页容器选择器
        clickable: true, // 允许点击分页切换
        type: 'bullets' // 分页类型：dots
        }
    })
    
    // 添加点击标题切换轮播功能
    $(document).on('click', '.biweekly-title', function() {
        biweeklySwiper.slideNext();
    });

    // 移动端导航菜单 - 汉堡菜单功能
    $('.hamburger-btn').click(function () {
        $(this).toggleClass('open');
        $('.nav-menu').slideToggle();
    });

    // 点击导航菜单中的链接后，隐藏导航菜单
    $('.nav-menu ul li a').click(function () {
        // 检查屏幕宽度，只有在小屏幕上才执行此操作
        if ($(window).width() <= 996) {
            $('.hamburger-btn').removeClass('open');
            $('.nav-menu').slideUp();
        }
    });

    // 窗口大小变化时调整导航菜单
    $(window).resize(function () {
        if ($(window).width() > 996) {
            $('.nav-menu').css('display', 'block');
            $('.hamburger-btn').removeClass('open');
        } else {
            $('.nav-menu').css('display', 'none');
            $('.hamburger-btn').removeClass('open');
        }
    });

    // 导航菜单悬停效果增强
    $('.nav-menu li').hover(function () {
        $(this).find('a').css('color', '#174994');
    }, function () {
        $(this).find('a').css('color', '#333');
    });

    // 搜索框交互
    $('.search-box input').focus(function () {
        $(this).parent().css('box-shadow', '0 0 10px rgba(23, 73, 148, 0.3)');
    }).blur(function () {
        $(this).parent().css('box-shadow', 'none');
    });

    // 投稿按钮悬停效果
    $('.submit-btn').hover(function () {
        $(this).css('transform', 'translateY(-3px)');
        $(this).css('box-shadow', '0 5px 15px rgba(23, 73, 148, 0.3)');
    }, function () {
        $(this).css('transform', 'translateY(0)');
        $(this).css('box-shadow', 'none');
    });

    // 右侧链接悬停效果
    $('.right-link').hover(function () {
        $(this).css('width', '70px');
    }, function () {
        $(this).css('width', '60px');
    });

    // 页面滚动动画
    $(window).scroll(function () {
        var scrollPosition = $(window).scrollTop();

        // 左侧导航栏滚动效果
        if (scrollPosition > 100) {
            $('.left-nav').css('background-color', 'rgba(255, 255, 255, 0.98)');
        } else {
            $('.left-nav').css('background-color', 'rgba(255, 255, 255, 0.95)');
        }

        // 滚动时的元素动画
        $('.effect').each(function () {
            var elementTop = $(this).offset().top;
            if (scrollPosition > elementTop - window.innerHeight + 100) {
                $(this).addClass('isView');
            }
        });
    });

    // 仅针对回到顶部按钮的点击事件，不影响其他a标签
    $('.back-to-top-btn').click(function(e) {
        e.preventDefault();
        $('html, body').stop().animate({
            scrollTop: 0
        }, 1000);
    });

    // 初始化时检查滚动位置
    $(window).scroll();

    // 添加页面加载动画
    $(window).on('load', function () {
        $('body').addClass('loaded');
    });
});

// 响应式调整函数
function responsiveAdjust() {
    var width = window.innerWidth;

    // 根据屏幕宽度调整元素样式
    if (width <= 996) {
        // 移动端调整
        $('.left-nav').css('position', 'relative');
        $('.right-banner').css('margin-left', '0');
    } else {
        // 桌面端调整
        $('.left-nav').css('position', 'absolute');
        $('.right-banner').css('margin-left', '');
    }
}


// 初始化响应式调整
responsiveAdjust();

// 窗口大小变化时重新调整
window.addEventListener('resize', responsiveAdjust);

// 添加键盘快捷键支持
document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + F 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        $('.search-box input').focus();
    }
});
