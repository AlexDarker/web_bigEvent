$(function () {
    // 点击注册账号的链接
    $('#link-reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    // 点击去登录的链接
    $('#link-login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    });
    
    // 从layUI获取form对象
    var form = layui.form;
    var layer = layui.layer;

    // 通过form.verify()函数自定义校验规则
    form.verify({
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验注册时两次密码天蝎是否一致
        rePwd: function (val) {
            // val是确认密码框中的值
            // 还需要密码框中的值
            // 然后进行判断
            // 如果判断失败return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== val) {
                return '两次密码输入不一致';
            }
        }
    });

// 监听注册表单提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault();
        // 发起请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);;
                }
                // console.log('注册成功!!!');
                layer.msg('注册成功，请登录');
                // 模拟点击事件，跳回登录页面
                $('#link-login').click();
            }
        });
    });

    // 监听登录表单提交事件
    $('#form_login').submit(function (e) {
        // 阻止默认提交
        e.preventDefault();
        // 获取输入数据
        // var data = {
        //     username: $('#form_login [name=username]').val(),
        //     password: $('#form_login [name=password]').val()
        // }
        // 发起请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize() ,
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message);
                }
                console.log(res);
                layer.msg('登录成功!!');
                // 请求成功之后返回用于身份验证的token值
                // token值用于请求有权限的数据，所以注意保存到本地
                localStorage.setItem('token', res.token);
                // 跳转页面
                location.href = './index.html'
            }
        });
    })

})