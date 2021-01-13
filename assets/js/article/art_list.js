$(function () {
    // 定义美化时间的过滤器 方法一：
    // template.defaults.imports.dateFormat = function (date) {
    //     const dt = new Date(date);

    //     let y = dt.getFullYear();
    //     let m = padZero(dt.getMonth() + 1);
    //     let d = padZero(dt.getDate());

    //     let hh = padZero(dt.getHours());
    //     let mm = padZero(dt.getMinutes());
    //     let ss = padZero(dt.getSeconds());

    //     return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    // }
    // // 定义补零 函数
    // function padZero(a) {
    //     if (a < 10) {
    //         return '0'+a
    //     } else {
    //         return a
    //     }
    // }

    // 定义美化时间的过滤器 方法二：
    template.defaults.imports.dateFormat = date => {
        return date.split('.')[0];
    }

    // 定义一个查的参数对象，将来请求数据的时候，需要将请求的参数对象传递给服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类id
        state: '' // 文章的发布状态
    }

    // 初始化默认文章列表数据的方法
    initTable();
    // 初始化文章分类的方法
    initCate();

    // 初始化默认文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: res => {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                // 使用模版引擎渲染页面数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 渲染底部分页区域
                renderPage(res.total);
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) {
                    return layui.layer.msg('获取分类数据失败!')
                }
                // console.log(111);
                // 调用模版引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通知layUI重新渲染表单区域下拉界面UI结构
                layui.form.render();
            }
        });
    }

    // 实现筛选功能
    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象 q 赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新获取文章列表数据
        initTable();
    });

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页结构
        layui.laypage.render({
            elem: 'pageBox', // 分页容器的 id
            count: total, // 数据总数，从服务端得到
            limit: q.pagesize, // 每页显示几条
            curr: q.pagenum, // 设置默认选中的 -- 高亮展示
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], // 自定义排版
            limits:['2','3','5','10'], // 条目选项中的条目数量
            // 分页发生切换时，触发 jump 回调函数
            // 触发jump回调的方式有两种
            // 1.点击页码的时候，就会触发
            // 2.页面加载完成，只要调用了laypage.render(),就会触发 jump 回调函数
            jump: (obj, first) => {
                // 可以通过 first 的值，来判断是通过那种方式，触发的jump函数
                // 如果 firdt 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                // console.log(obj.curr); // 打印当前页码
                // 把最新的页码赋值给 q 查询参数对象
                q.pagenum = obj.curr;
                // 把最新的条目数赋值给 q 查询参数对象
                q.pagesize = obj.limit;
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                // 注意⚠️：不能直接调用initTable，会发生一个死循环
                // initTable();
                // console.log(first);
                if (!first) {
                    initTable();
                }
            }
        });
    }

    // 删除文章的功能
    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '#btnDelete', function () {
        // 获取删除按钮的个数
        var len = $('#btnDelete').length;
        var id = $(this).attr('data-id');
        // 询问用户是否要删除
        layui.layer.confirm('确认删除?', { icon: 3,title:'提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete' + id,
                success: res => {
                    if (res.status !== 0) {
                        return layui.layer.msg('删除失败')
                    }
                    layui.layer.msg('删除成功');
                    // 当数据删除完成之后，需要判断当前页面是否还有剩余数据
                    // 如果没有数据了，则让页码值-1，之后再重新调用 initTable()
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完成之后，页面上就没有数据了
                        // 注意：页码值最小就是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            });
            layui.layer.close(index);
        })
    })

})