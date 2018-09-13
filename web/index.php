<!DOCTYPE html>
<html>
<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="thz.ico" type="image/x-icon"/>
    <!-- Material Design Lite -->
    <link rel="stylesheet" href="//fonts.lug.ustc.edu.cn/icon?family=Material+Icons">
    <link rel="stylesheet" href="//cdn.staticfile.org/material-design-lite/1.3.0/material.grey-indigo.min.css">
    <link rel="stylesheet" href="//fonts.lug.ustc.edu.cn/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en">
    <script defer src="//cdn.staticfile.org/material-design-lite/1.3.0/material.min.js"></script>
    <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
    <title>拓荒者-登陆</title>
    <script defer src="welcome_js.js"></script>
    <script type="text/javascript">
        if (typeof console === "undefined") {    this.console = { log: function (msg) {  } };}
        // 如果浏览器不支持websocket，会使用这个flash自动模拟websocket协议，此过程对开发者透明
        WEB_SOCKET_SWF_LOCATION = "/swf/WebSocketMain.swf";
        // 开启flash的websocket debug
        WEB_SOCKET_DEBUG = true;
        var ws, name, client_id, client_list={};

        // 连接服务端
        function connect() {
            // 创建websocket
            ws = new WebSocket('wss://www.viaviai.com/wss');
            // 当socket连接打开时，输入用户名
            ws.onopen = onopen;
            // 当有消息时根据消息类型显示不同信息
            ws.onmessage = onmessage;
            ws.onclose = function() {
                console.log("连接关闭，定时重连");
                connect();
            };
            ws.onerror = function() {
                console.log("出现错误");
            };
        }

        // 连接建立时发送登录信息
        function onopen()
        {
            name = 'web';
            // 登录
            var login_data = '{"type":"login","client_name":"'+name.replace(/"/g, '\\"')+'","room_id":"1"}';
            console.log("websocket握手成功，发送登录数据:"+login_data);
            ws.send(login_data);
        }

        // function post(URL, PARAMS) {
        //     var temp_form = document.createElement("form");
        //     temp_form .action = URL;
        //     temp_form .target = "_blank";
        //     temp_form .method = "post";
        //     temp_form .style.display = "none";
        //     for (var x in PARAMS) {
        //         var opt = document.createElement("textarea");
        //         opt.name = x;
        //         opt.value = PARAMS[x];
        //         temp_form .appendChild(opt);
        //     }
        //     document.body.appendChild(temp_form);
        //     temp_form .submit();
        // }

        function openPostWindow(url,data1,data2,data3,data4,data5){

            var tempForm = document.createElement("form");
            tempForm.id = "tempForm1";
            tempForm.method = "post";
            tempForm.action = url;
            tempForm.target="_blank"; //打开新页面

            var hideInput1 = document.createElement("input");
            hideInput1.type = "hidden";
            hideInput1.name="id"; //后台要接受这个参数来取值
            hideInput1.value = data1; //后台实际取到的值

            var hideInput2 = document.createElement("input");
            hideInput2.type = "hidden";
            hideInput2.name="openid";
            hideInput2.value = data2;

            var hideInput3 = document.createElement("input");
            hideInput3.type = "hidden";
            hideInput3.name="nickName";
            hideInput3.value = data3;

            var hideInput4 = document.createElement("input");
            hideInput4.type = "hidden";
            hideInput4.name="avatarUrl";
            hideInput4.value = data4;

            var hideInput5 = document.createElement("input");
            hideInput5.type = "hidden";
            hideInput5.name="theme";
            hideInput5.value = data5;

            tempForm.appendChild(hideInput1);
            tempForm.appendChild(hideInput2);
            tempForm.appendChild(hideInput3);
            tempForm.appendChild(hideInput4);
            tempForm.appendChild(hideInput5);

            if(document.all){
                tempForm.attachEvent("onsubmit",function(){});        //IE
            }else{
                var subObj = tempForm.addEventListener("submit",function(){},false);    //firefox
            }
            document.body.appendChild(tempForm);
            if(document.all){
                tempForm.fireEvent("onsubmit");
            }else{
                tempForm.dispatchEvent(new Event("submit"));
            }
            tempForm.submit();
            document.body.removeChild(tempForm);
        }

        // 服务端发来消息时
        function onmessage(e)
        {
            console.log(e.data);
            var data = JSON.parse(e.data);
            switch(data['type']){
                // 服务端ping客户端
                case 'ping':
                    ws.send('{"type":"pong"}');
                    break;
                // 登录 更新用户列表
                case 'login':
                    //{"type":"login","client_id":xxx,"client_name":"xxx","client_list":"[...]","time":"xxx"}
                    // say(data['client_id'], data['client_name'],  data['client_name']+' 加入了聊天室', data['time']);

                    if (data['client_name']=='web'){
                        document.getElementById('qr_code').innerHTML='<img src="https://pan.baidu.com/share/qrcode?w=180&h=180&url=client_id:'+data['client_id']+'" style="margin:0 auto;padding-top:20px;padding-bottom:5px" />';
                    }

                    if(data['client_list'])
                    {
                        client_list = data['client_list'];
                    }
                    else
                    {
                        client_list[data['client_id']] = data['client_name'];
                    }
                    flush_client_list();
                    console.log(data['client_name']+"登录成功");
                    break;
                // 发言
                case 'say':
                    //{"type":"say","from_client_id":xxx,"to_client_id":"all/client_id","content":"xxx","time":"xxx"}
                    say(data['from_client_id'], data['from_client_name'], data['content'], data['time']);
                    break;

                // 浏览器推送 改变按钮状态
                case 'change':
                    console.log("module: "+data['module']+" state: "+data['state']);
                    break;

                //近期的会议列表
                case 'list':

                    // for (var i = 0; i < data['conference_list'].length;++i){
                    //     console.log(data['conference_list'][i]['theme']);
                    //     console.log(data['conference_list'][i]['time']);
                    //     console.log(data['conference_list'][i]['id']);
                    //
                    // }

                    var len = data['conference_list'].length;
                    for ( var i=0; i< len;++i) {
                        $('#conference_list').append('<li class="mdl-list__item mdl-list__item--two-line"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-avatar">group</i> <span>'+ data['conference_list'][i]['theme'] +'</span> <span class="mdl-list__item-sub-title">会议ID：'+ data['conference_list'][i]['id'] +'</span> </span> <span class="mdl-list__item-secondary-content"> <a class="mdl-list__item-secondary-action"> <button class=" mdl-button mdl-js-button mdl-button--primary" onclick="openPostWindow(\'manage.php\','+data['conference_list'][i]['id']+',\''+data['openid']+'\',\''+data['nickName']+'\',\''+data['avatarUrl']+'\',\''+data['conference_list'][i]['theme']+'\');">进入 </button> </a> </span> </li>');
                        $('#btn_enter').data('id',data['conference_list'][i]['id']);
                        // document.getElementById('conference_list').innerHTML= '<li class="mdl-list__item mdl-list__item--two-line"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-avatar">group</i> <span>'+ data['conference_list'][i]['theme'] +'</span> <span class="mdl-list__item-sub-title">会议ID：'+ data['conference_list'][i]['id'] +'</span> </span> <span class="mdl-list__item-secondary-content"> <a class="mdl-list__item-secondary-action" href="#"> <button class=" mdl-button mdl-js-button mdl-button--primary">进入 </button> </a> </span> </li>'
                    }

                    $("#login-card").hide();
                    $("#head-text--right").text("请选择会议");

                    $("#meeting-select-card").fadeIn();
                    // $(".a_post").on("click",function(event){
                    //     // event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL(http://www.baidu.com)
                    //     $.ajax({
                    //         type: "POST",
                    //         url: "template.php",
                    //         contentType:"application/json",
                    //         data: '{"type":"login","client_name":"web","room_id":"2"}',//参数列表
                    //         dataType:"json",
                    //         success: function(result){
                    //             //请求正确之后的操作
                    //         },
                    //         error: function(result){
                    //             //请求失败之后的操作
                    //         }
                    //     });
                    // });

                    break;

                // 用户退出 更新用户列表
                case 'logout':
                    //{"type":"logout","client_id":xxx,"time":"xxx"}
                    // say(data['from_client_id'], data['from_client_name'], data['from_client_name']+' 退出了', data['time']);
                    delete client_list[data['from_client_id']];
                    flush_client_list();

            }
        }

        // 输入姓名
        function show_prompt(){
            name = prompt('输入你的名字：', '');
            if(!name || name=='null'){
                name = '游客';
            }
        }

        // 提交对话
        function onSubmit() {
            var input = document.getElementById("textarea");
            var to_client_id = $("#client_list option:selected").attr("value");
            var to_client_name = $("#client_list option:selected").text();
            ws.send('{"type":"say","to_client_id":"'+to_client_id+'","to_client_name":"'+to_client_name+'","content":"'+input.value.replace(/"/g, '\\"').replace(/\n/g,'\\n').replace(/\r/g, '\\r')+'"}');
            input.value = "";
            input.focus();
        }

        // 刷新用户列表框
        function flush_client_list(){
            var userlist_window = $("#userlist");
            var client_list_slelect = $("#client_list");
            userlist_window.empty();
            client_list_slelect.empty();
            userlist_window.append('<h4>在线用户</h4><ul>');
            client_list_slelect.append('<option value="all" id="cli_all">所有人</option>');
            for(var p in client_list){
                userlist_window.append('<li id="'+p+'">'+client_list[p]+'</li>');
                client_list_slelect.append('<option value="'+p+'">'+client_list[p]+'</option>');
            }
            $("#client_list").val(select_client_id);
            userlist_window.append('</ul>');
        }

        // 发言
        function say(from_client_id, from_client_name, content, time){
            //解析新浪微博图片
            content = content.replace(/(http|https):\/\/[\w]+.sinaimg.cn[\S]+(jpg|png|gif)/gi, function(img){
                return "<a target='_blank' href='"+img+"'>"+"<img src='"+img+"'>"+"</a>";}
            );

            //解析url
            content = content.replace(/(http|https):\/\/[\S]+/gi, function(url){
                    if(url.indexOf(".sinaimg.cn/") < 0)
                        return "<a target='_blank' href='"+url+"'>"+url+"</a>";
                    else
                        return url;
                }
            );

            $("#dialog").append('<div class="speech_item"><img src="http://lorempixel.com/38/38/?'+from_client_id+'" class="user_icon" /> '+from_client_name+' <br> '+time+'<div style="clear:both;"></div><p class="triangle-isosceles top">'+content+'</p> </div>').parseEmotion();
        }

        $(function(){
            select_client_id = 'all';
            $("#client_list").change(function(){
                select_client_id = $("#client_list option:selected").attr("value");
            });
            $('.face').click(function(event){
                $(this).sinaEmotion();
                event.stopPropagation();
            });
        });

    </script>

</head>
<body onload="connect();">
    <!-- Uses a transparent header that draws on top of the layout's background -->
    <style>
        .demo-layout-transparent {
            background: url('bg3.jpg') center / cover;
        }
        .demo-layout-transparent .mdl-layout__header,
        .demo-layout-transparent .mdl-layout__drawer-button {
            /* This background is dark, so we set text to white. Use 87% black instead if
               your background is light. */
            color: white;
        }
    </style>
    <div class="demo-layout-transparent mdl-layout mdl-js-layout">
        <header class="mdl-layout__header mdl-layout__header--transparent">
            <div class="mdl-layout__header-row">
                <!-- Title -->
                <span class="mdl-layout-title">拓荒者</span>
                <!-- Add spacer, to align navigation to the right -->
                <div class="mdl-layout-spacer"></div>
                <!-- Navigation -->
                <nav class="mdl-navigation">
                    <a id="head-text--right" lass="mdl-navigation__link" style="color: white">请登录</a>
                </nav>
            </div>
        </header>

        <div class="mdl-layout__drawer-button">
            <i class="material-icons">title</i>
        </div>
        <main class="mdl-layout__content">

            <div style="padding-top: 74px;padding-bottom: 118px; width:100%">
                <div id="login-card" class="mdl-card mdl-card--supporting-text mdl-shadow--4dp" style="margin-left:65%; height:380px">
                    <div class="mdl-card__title">
                        <h2 class="mdl-card__title-text" style="color: slategray; font-size: 20px; font-weight:500">&nbsp;会议管理端</h2>
                    </div>
                    <div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
                        <div class="mdl-tabs__tab-bar">
                            <a href="#starks-panel" class="mdl-tabs__tab is-active">扫码登录</a>
                            <a href="#lannisters-panel" class="mdl-tabs__tab">密码登录</a>
                        </div>

                        <div class="mdl-tabs__panel is-active" id="starks-panel">
                            <div style="text-align: center" id="qr_code"></div>
                            <div style="align-self: center; text-align:center">
                                <a class="mdl-color--gray-100" style="color: #777777;font-size:14px">请使用微信小程序扫码</a>
                            </div>
                        </div>

                        <div class="mdl-tabs__panel" id="lannisters-panel" style="padding-top: 35px;padding-left:50px;padding-right:50px">

                            <form action="#">
                                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                    <input class="mdl-textfield__input" type="text" id="meeting_id">
                                    <label class="mdl-textfield__label" for="meeting_id">会议ID</label>
                                </div>
                                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                    <input class="mdl-textfield__input" type="password" id="passcode">
                                    <label class="mdl-textfield__label" for="passcode">管理密码</label>
                                </div>
                                <div style="height: 24px">
                                    <label id="error-msg" style="font-size:12px; color: red"></label>
                                </div>
                                <div style="width:100%;margin: 0 auto; padding-left:29%">

                                    <a id="login-btn" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
                                        &nbsp;登录系统&nbsp;
                                    </a>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <section id="meeting-select-card" class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp" style="max-width: 600px;display: none;">
                    <div class="mdl-card mdl-cell mdl-cell--12-col">
                        <div class="mdl-card__supporting-text mdl-grid--no-spacing">
                            <h4 class="mdl-cell mdl-cell--12-col">近期会议</h4>
                            <!-- 装有一个ul表单的mdl-cell -->
                            <div class="mdl-cell mdl-cell--12-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                                <ul id="conference_list" class="demo-list-two mdl-list">

                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    </div>
    <footer class="mdl-mini-footer" style="position:fixed;width:100%;bottom: 0px;padding-top: 18px;padding-bottom: 18px">
        <div class="mdl-mini-footer__left-section">
            <div class="mdl-logo">关于</div>
            <ul class="mdl-mini-footer__link-list">
                <li><a href="#">帮助</a></li>
                <li><a href="#">联系我们</a></li>
            </ul>
        </div>
        <div class="mdl-mini-footer__right-section">
            <ul class="mdl-mini-footer__link-list" style="padding-right: 16px">
                <li><a>拓荒者会议互动系统</a></li>
                <li><a href="http://www.miitbeian.gov.cn" target="view_window">蒙ICP备18001203号-1</a></li>
            </ul>
        </div>
    </footer>
</body>
</html>