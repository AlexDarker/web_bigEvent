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
        });
    }
    // 初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image');
  
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
  
    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 给选择按钮绑定点击事件，调用上传图片的点击事件
    $('#btnChooseImage').on('click', function () {
        // console.log(1111);
        $('#cover_file').click();
    })

    // 监听cover_file的change事件，获取用户选择的文件列
    $('#cover_file').on('change', function (e) {
        var files = e.target.files;
        if (files.length === 0) {
            return
        }
        // 根据文件创建URL地址
        var imgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    // 定义变量接受文章的发布状态
    var art_state = '已发布';

    // 为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    });

    // 为表单绑定提交事件
    $('#form_pub').on('submit', function (e) {
        // 1.阻止默认提交事件
        e.preventDefault()
        // 2.基于form表单，快速创建一个formData对象
        var fd = new FormData($(this)[0]);
        // 3.将文件的发布状态添加到fd
        fd.append('state', art_state);
        // 4.将裁减过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象，存储到formData
                fd.append('cover_img', blob);
                // 6.发起Ajax请求，传递图片数据
                publishArticle(fd)
            });
    });
    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：使用formData传递数据，一定要加上以下内容，否则提交不会成功
            contentType: false,
            processData: false,
            success: res => {
                if (res.status !== 0) {
                    return layui.layer.msg('发布文章失败')
                }
                layui.layer.msg('发布文章成功');
                // 发布文章成功后，跳转到文章列表页面
                location.href = './art_list.html'
            }
        })
    }
})