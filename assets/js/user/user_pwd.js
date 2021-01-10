$(function () {
    // 自定义校验规则
    layui.form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 定义愿密码和新密码一样
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return layui.layer.msg('新旧密码不能一样')
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return layui.layer.msg('两次密码不一致')
            }
        }
    });

    // 提交数据
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('重置密码失败');
                }
                layui.layer.msg('更新密码成功');
                // 重置表单
                $('.layui-form')[0].reset();
            }

        })
    })
})