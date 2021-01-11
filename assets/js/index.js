$(function () {
    // 调用getUserInfo()获取用户的基本信息
    getUserInfo();

    // 退出事件
    $('#btnLogout').on('click', function () {
        // 提示用户是否退出后台首页
        layui.layer.confirm('确定退出?', { icon: 3, title: '提示' }, function (index) {
            // 1.清空本地存储的token
            localStorage.removeItem('token');
            // 2.重新跳转到登录页面
            location.href = './login.html'
            // 关闭confirm询问框
            layui.layer.close(index);
        });
    });
})

// 自定义getUserInfo()函数获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers - 请求头配置信息  -- headers优化至baseAPI.js文件
        success: res => {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败!')
            }
            // 调取renderAvatar()函数渲染用户头像
            renderAvatar(res.data);
        },
        // // 不论请求成功失败，均会返回complete()回调函数 -- complete()优化至baseAPI.js文件
    })
}

// 渲染用户头像
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 按需渲染用户的头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text_avatar').hide();
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first);
    }
}