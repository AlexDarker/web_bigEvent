// 注意：每次调用 $.get() / $.post() / $.ajax时
// 会先调用 ajaxPreFilter 这个函数
// 在这个函数中,可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起Ajax请求之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    // console.log(options.url)
});