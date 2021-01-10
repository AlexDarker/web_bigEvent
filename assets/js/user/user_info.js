$(function () {
    // 从layUI获取form对象
    var form = layui.form;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    });

    initUserInfo();

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res)
                // 调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        });
    }

    // 重置表单数据
    $('#v').on('click', function (e) {
        // 组织表单的默认重置行为
        e.preventDefault();
        // 重新获取数据
        initUserInfo();
    });
    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新用户信息失败!')
                }
                layui.layer.msg('更新更新用户信息成功!')
                // 调用父页面中的方法，重新渲染用户的头像和用户信息
                window.parent.getUserInfo();
                // console.log(window);
            }
        });
    })
});