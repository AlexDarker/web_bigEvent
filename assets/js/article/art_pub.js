$(function () {
    // 初始化文章分类
    initCate();
    // 定义加载文章的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) {
                    return layui.layer.msg('初始化文章分类失败!')
                }
                // 调用模版引擎，渲染下拉框结构
                var htmlStr = template('tpl_cate', res);
                // console.log(htmlStr);
                $('[name="cate_id"]').html(htmlStr);
                // 调用 render() 方法，更新下拉框的内容
                layui.form.render();
            }
        })
    }
})