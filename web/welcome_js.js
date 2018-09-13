$(document).ready(function(){
    // 用户名密码判断
    $("#login-btn").click(function(){
        if(!$("#meeting_id").val())
            $("#error-msg").text("请输入会议ID");
        else if(!$("#passcode").val())
            $("#error-msg").text("请输入管理密码");
        else if($("#passcode").val().length != 6)
            $("#error-msg").text("管理密码错误");
        else{

            $.post("sever/manage.php",
                {
                    'type': 'login',
                    'id': $("#meeting_id").val(),
                    'manage_password': $("#passcode").val()
                },


                function(data,status){
                    openPostWindow('manage.php',JSON.parse(data)['id'],JSON.parse(data)['openid'],JSON.parse(data)['nickName'],JSON.parse(data)['avatarUrl'],JSON.parse(data)['theme']);
                });

            }
    })
});