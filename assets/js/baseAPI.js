// 注意：每次调用 $.get() / $.post() / $.ajax时
// 会先调用 ajaxPreFilter 这个函数
// 在这个函数中,可以拿到我们给Ajax提供的配置对象
// 以下函数中的回调函数叫做请求拦截器
$.ajaxPrefilter(function (options) {
    // 在发起Ajax请求之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    // console.log(options.url)

    // 统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete 回调函数
    // 不论请求成功失败，均会返回complete()回调函数
    options.complete = res => {
        // 在complete函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空token
            localStorage.removeItem('token');
            // 强制跳转到登录页面
            location.href = './login.html'
        }
    }
});

