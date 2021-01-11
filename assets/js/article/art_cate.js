$(function () {

    // 初始化文章分类列表数据
    initArtCateList();

    // 获取打开弹窗的index值
    var layerIndex = null;
    // 为添加按钮绑定点击事件
    $('#addArtCate').on('click', function () {
        layerIndex = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog_add').html()
        });
    });

    // 通过代理的形式,为 form_add表单 绑定submit代理事件
    $('body').on('submit', '#form_add', function () {
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.msg('新增文章分类失败!')
                }
                initArtCateList();
                layui.layer.msg('新增文章分类成功!')
                // 提交成功，关闭弹出框
                layui.layer.close(layerIndex);
            }
        });
    });

    // 通过代理的形式，为btn_edit按钮绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '#btn_edit', function () {
        // 弹出一个修改分类的弹出层
        indexEdit = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog_edit').html()
        });
        // 将已有的分类信息，填充到弹出层对应的input框
        // 通过自定义属性 获取数据的id
        var id = $(this).attr('data-id');
        console.log(id);
        // 发起请求获取对应分类的数据
        $.ajax({
            method: "GET",
            url: '/my/article/cates/' + id,
            success: res => {
                // 使用layui的快速添加表单元素功能，对表单内容进行添加
                layui.form.val('form_edit', res.data);
            }
        });
    });

    // 通过代理的形式，为修改分类表单绑定 submit 事件
    var editIndex = null;
    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layui.layer.msg('更新分类信息失败！')
                }
                initArtCateList();
                layui.layer.msg('更新分类信息成功！')
                // 提交成功，关闭弹出框
                layui.layer.close(editIndex);
            }
        })
    });

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '#btn_delete', function () {
        var id = $(this).attr('data-id');
        // 提示用户是否要删除
        layui.layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 发起请求，删除数据
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/'+id,
                success: res => {
                    if (res.status !== 0) {
                        return layui.layer.msg('删除文章分类失败！')
                    }
                    layui.layer.msg('删除文章分类成功！')
                    layui.layer.close(index);
                    // 刷新分类列表
                    initArtCateList();
                }
            })
            
        });
    })
})
// 初始化文章分类列表数据
function initArtCateList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: res => {
            // console.log(res);
            var htmlStr = template("tpl_table", res);
            $('tbody').html(htmlStr)
        }
    })
}