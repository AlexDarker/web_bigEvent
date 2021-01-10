$(function () {
    // 调用getUserInfo()获取用户的基本信息
    getUserInfo();
})

// 自定义getUserInfo()函数获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers - 请求头配置信息
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: res => {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败!')
            }
            // 调取renderAvatar()函数渲染用户头像
            renderAvatar(res.data);
        }
    })
}

// 渲染用户头像
function renderAvatar(url) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 按需渲染用户的头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first);
    }
}