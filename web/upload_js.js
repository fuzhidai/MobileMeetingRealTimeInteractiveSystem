$(document).ready(function(){
    // ppt上传按钮
    // $("#ppt-file").change(function(){
    //     // 获取文件名，显示在页面上
    //     var fragment = $("#ppt-file").val();
    //     var array_fragment = fragment.split('\\');
    //     $("#ppt-name").text("已选择："+$(array_fragment).last()[0]);
    // });

    // 其它文件上传按钮
    $("#file").change(function(){
        // 获取文件名，显示在页面上
        var fragment = $("#file").val();
        var array_fragment = fragment.split('\\');
        console.log($(array_fragment).last()[0]);
        file_name = $(array_fragment).last()[0];
        $("#file-name").text("已选择："+$(array_fragment).last()[0]);
    });

});