$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    })

    // 为文件选择框绑定change事件
    $('#file').on('change', function (e) {
        // 获取到用户选择的图片
        var fileList = e.target.files;
        // 判断用户有没有拿到文件
        if (fileList.length === 0) {
            return layui.layer.msg('请选择照片!')
        }
        // 拿到用户获得的文件
        var file = e.target.files[0];
        // 将文件转化为路径 
        var url = URL.createObjectURL(file);
        // 重新初始化裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', url)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    // 上传头像,给确定按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        // 拿到用户要上传到服务器的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 调用接口，上传头像至服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar:dataURL
            },
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.msg('图片上传失败!');
                }
                layui.layer.msg('更换头像成功!');
                // 更新用户数据
                window.parent.getUserInfo();
            }
        })
    });
})