// 国科大日历功能
$(document).ready(function() {
    // 页面加载后自动显示日历
    $('.calendar-container').addClass('active');
    
    // 三秒后自动隐藏日历
    setTimeout(function() {
        $('.calendar-container').removeClass('active');
    }, 3000);
    
    // 点击日历链接显示/隐藏日历
    $('#calendar-link').click(function(e) {
        e.preventDefault();
        $('.calendar-container').toggleClass('active');
    });
    
    // 点击其他地方隐藏日历
    $(document).click(function(e) {
        if (!$(e.target).closest('#calendar-link, .calendar-container').length) {
            $('.calendar-container').removeClass('active');
        }
    });
});