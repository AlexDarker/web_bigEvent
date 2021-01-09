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
    
/**
 * 自定义校验规则  
 */
    // 从layUI获取form对象
    var form = layui.form;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ]
    });

})