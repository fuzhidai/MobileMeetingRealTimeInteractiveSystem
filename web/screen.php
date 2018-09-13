<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Material Design Lite -->
    <link rel="stylesheet" href="https://fonts.lug.ustc.edu.cn/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://cdn.staticfile.org/material-design-lite/1.3.0/material.blue_grey-indigo.min.css">
    <link rel="stylesheet" href="https://fonts.lug.ustc.edu.cn/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en">
    <link rel="stylesheet" href="dialog-polyfill.css">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="lotteryStyle.css">
    <link rel="stylesheet" href="screen.css">
    <link rel="icon" href="thz.ico" type="image/x-icon"/>
    <script defer src="https://cdn.staticfile.org/material-design-lite/1.3.0/material.min.js"></script>
    <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://cdn.bootcss.com/echarts/4.0.4/echarts.min.js"></script>
    <script src="dialog-polyfill.js"></script>
    <title>拓荒者-互动屏幕</title>
    <style>
        html,body{
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
        }
    </style>

    <script type="text/javascript">
        if (typeof console === "undefined") {    this.console = { log: function (msg) {  } };}
        // 如果浏览器不支持websocket，会使用这个flash自动模拟websocket协议，此过程对开发者透明
        WEB_SOCKET_SWF_LOCATION = "/swf/WebSocketMain.swf";
        // 开启flash的websocket debug
        WEB_SOCKET_DEBUG = true;
        var ws, name, client_list={}, openid, room_id, ppt_state, ppt_path, vote_index, vote_display_function, grade_id, award_id, lottery_id, lottery_range = [],barrage_list = [], question_list = [], answer_list = [], shark_list = [], question_id = 0, random = [], have_lucky=0,random_index=0;

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
            // 登录
            var name = 'web';
            openid = '<?php echo $_POST['openid']?>';
            document.getElementById('title_info').innerText='<?php echo $_POST['theme']?>';
            room_id = '<?php echo isset($_POST['room_id']) ? $_POST['room_id'] : 1?>';
            var login_data = '{"type":"login","client_name":"'+name+'","room_id":"'+room_id+'","openid":"'+openid+'"}';
            console.log("websocket握手成功，发送登录数据:"+login_data);
            ws.send(login_data);
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
                    break;;
                // 登录 更新用户列表
                case 'login':
                    //{"type":"login","client_id":xxx,"client_name":"xxx","client_list":"[...]","time":"xxx"}
                    // say(data['client_id'], data['client_name'],  data['client_name']+' 加入了聊天室', data['time']);
                    if(data['client_list'])
                    {
                        client_list = data['client_list'];
                    }
                    else
                    {
                        client_list[data['client_id']] = data['client_name'];
                    }
                    // flush_client_list();
                    console.log(data['client_name']+"登录成功");
                    break;
                // 发言
                case 'say':
                    //{"type":"say","from_client_id":xxx,"to_client_id":"all/client_id","content":"xxx","time":"xxx"}
                    say(data['from_client_id'], data['from_client_name'], data['content'], data['time']);
                    break;

                //开启ppt
                case 'open_ppt':
                    ppt_state = 'open';
                    ppt_path = 'https://www.viaviai.com/thz/sever/upload/file/'+data['ppt_path'];
                    changePowerPoint(ppt_path);
                    $('#ppt_block').show();
                    break;

                //显示弹幕
                case 'display_barrage':
                    console.log(data);
                    barrage_list.push(data);
                    var id = barrage_list.length+1;
                    createChip(id,data['avatarUrl'],data['content']);

                    $.ajax({
                        cache: true,
                        type: "GET",
                        url:"sever/barrage.php",
                        data:{
                            'id': room_id,
                            'openid': data['openid'],
                            'time': data['time'],
                            'nickName': data['nickName'],
                            'avatarUrl': data['avatarUrl'],
                            'content': data['content']
                        },
                        async: false,
                        error: function(request) {
                            console.log("Connection error:"+request.error);
                            alert('出现错误，请稍后再试');
                        },
                        success: function(data) {
                            console.log('success!');
                            console.log(data);
                        }
                    });


                    console.log(barrage_list);

                    break;

                    //显示等待参会者加入抽奖
                case 'display_lottery_hold':
                    console.log(data);

                    if (data['function']=='key_word'){
                        document.getElementById('lottery_tip').innerHTML='<div style="font-size: 30px;width: 100%; height: 100px;display: flex;justify-content: center;align-content: center;">发送弹幕</div> <div style="color: #333333;font-size: 50px;width: 100%;height: 100px;display: flex;justify-content: center;align-content: center;">'+data['barrage_content']+'</div> <div style="display: flex;justify-content: center;align-content: center;font-size: 30px;width: 100%;height: 30%;">参与互动抽奖</div>';
                        $('#lottery-dialog-hold').show();
                    }else if (data['function']=='shark_it_off') {

                        document.getElementById('lottery_tip').innerHTML='<div style="font-size: 40px;width: 100%;display: flex;justify-content: center;align-content: center;">幸运数字随机生成中...</div>';
                        $('#lottery-dialog-hold').show();

                    }else if (data['function']=='race_to_control') {

                        document.getElementById('lottery_tip').innerHTML='<div style="font-size: 40px;width: 100%;display: flex;justify-content: center;align-content: center;">从现在开始，盯好你的手机~</div>';
                        $('#lottery-dialog-hold').show();

                    }

                    break;

                    //开始抽奖
                case 'display_lottery_start':
                    console.log(data);

                    var temp_list = JSON.parse(data['lucky_list']);

                    for (var i = 0; temp_list && i < temp_list.length; ++i){
                        if (temp_list[i][0]['lottery_id']==data['lottery_id']){
                            shark_list = temp_list[i][1]['lucky_list'];
                        }
                    }
                    console.log(shark_list);

                    //如果抽奖方式为发送特定关键字抽奖
                    if (data['function']=='key_word'){
                        $('#lottery-dialog-hold').hide();

                        grade_id = data['grade_id'];
                        award_id = data['award_id'];
                        lottery_id = data['lottery_id'];
                        lottery_range = data['lottery_range'];

                        Lotterynumber = data['award_num'];
                        var len = data['lottery_range'].length;
                        //保存参与者信息
                        for (var j = 0; j < len; ++j){
                            headPictures.push(data['lottery_range'][j]['avatarUrl']);
                            nickName.push(data['lottery_range'][j]['nickName']);
                        }
                        numOfPeople = headPictures.length-1;

                        // 初始化大头像和昵称
                        $(function () {
                            headPicSlot.css('background-image','url('+headPictures[0]+')');
                            nickNameDiv.html(nickName[0]);
                        });

                        document.getElementById('lottery_info').innerHTML='<span>'+data['grade']+' '+data['award']+' '+data['award_num']+'人'+'</span>';

                        console.log(headPictures);
                        console.log(nickName);
                        openDialog("#lottery-dialog");

                        $('#start').click();
                        setTimeout(function () {
                            $('#start').click();
                        },2000);

                    }else if (data['function']=='shark_it_off') { //抽奖方式为摇一摇抽奖

                        grade_id = data['grade_id'];
                        award_id = data['award_id'];
                        lottery_id = data['lottery_id'];
                        Lotterynumber = data['award_num'];

                        $('#shark_award_info').append(data['grade'] + ' ' + data['award'] + ' ' + data['award_num'] + '人');

                        var max;
                        var min;
                        for (var i = 0; i < data['award_num']; ++i){
                            min = i*100;
                            max = (i+1)*100;
                            random.push(Math.floor(Math.random()*(max-min+1)+min));
                        }

                        console.log(random);

                        $('#lottery-dialog-hold').hide();
                        $('#shark-it-off-block').show();

                    }else if (data['function']=='race_to_control'){ //拼手速进行抽奖

                        grade_id = data['grade_id'];
                        award_id = data['award_id'];
                        lottery_id = data['lottery_id'];
                        Lotterynumber = data['award_num'];

                        $('#race_award_info').append(data['grade'] + ' ' + data['award'] + ' ' + data['award_num'] + '人');
                        var race_to_control_start = '{"type":"race_to_control_start","room_id":"'+room_id+'"}';
                        ws.send(race_to_control_start);
                        $('#lottery-dialog-hold').hide();
                        $('#race-to-control-block').show();

                    }


                    break;

                //添加新的投票结果
                case 'new_vote':

                    if (data['index'] == vote_index){

                        console.log('data:'+data);
                        console.log('answer_list:'+answer_list);

                        var answer = data['answer'][question_id];

                        // $tmp_res = json_decode($tmp_res['answer']);
                        // for (var k = 0; k < data['answer'].length; ++k)
                        for (var j = 0; j < answer.length; ++j)
                            answer_list[answer[j]]++;

                        console.log(answer_list);

                        var title = question_list['question'] ;
                        var option_data = [];

                        var len = answer_list.length;
                        for (var i = 0; i < len; ++i)
                            option_data.push({value: answer_list[i], name: question_list['choices'][i]});

                        // 指定图表的配置项和数据
                        var option = {
                            title  : {
                                text: title
                            },
                            series : [
                                {
                                    name: '',
                                    type: 'pie',
                                    radius: '60%',
                                    label:{            //饼图图形上的文本标签
                                        normal:{
                                            show:true,
                                            //position:'inner', //标签的位置
                                            textStyle : {
                                                fontWeight : 300 ,
                                                fontSize : 16    //文字的字体大小
                                            },
                                            formatter:'{b}:{d}%'
                                        }
                                    },
                                    data: option_data
                                }
                            ]
                        };
                        myChart = echarts.init(document.getElementById('vote-result-div'));// 基于准备好的dom，初始化echarts实例
                        myChart.setOption(option);

                    }

                    break;

                //显示投票结果
                case 'display_vote_result':

                    have_lucky = 0;
                    question_list = data['question_list'];
                    answer_list = data['answer_list'];
                    vote_index = data['vote_index'];
                    question_id = data['question_id'];
                    var title = question_list['question'] ;
                    var option_data = [];

                    var len = answer_list.length;
                    for (var i = 0; i < len; ++i)
                        option_data.push({value: answer_list[i], name: question_list['choices'][i]});

                    console.log(option_data);

                    // 指定图表的配置项和数据
                    var option = {
                        title  : {
                            text: title
                        },
                        series : [
                            {
                                name: '',
                                type: 'pie',
                                radius: '60%',
                                label:{            //饼图图形上的文本标签
                                    normal:{
                                        show:true,
                                        //position:'inner', //标签的位置
                                        textStyle : {
                                            fontWeight : 300 ,
                                            fontSize : 16    //文字的字体大小
                                        },
                                        formatter:'{b}:{d}%'
                                    }
                                },
                                data: option_data
                            }
                        ]
                    };
                    openDialog("#vote-dialog");
                    myChart = echarts.init(document.getElementById('vote-result-div'));// 基于准备好的dom，初始化echarts实例
                    myChart.setOption(option);
                    console.log(data);
                    break;

                //显示签到二维码
                case 'display_qr':
                    if (data['state']){
                        document.getElementById('sign_qr').innerHTML='<img src="https://pan.baidu.com/share/qrcode?w=360&h=360&url=sign_in:'+data['qr_code']+'" style="width: auto; height: auto; max-width: 100%; max-height: 100%;">';
                        openDialog("#sign-dialog");
                    } else {
                        document.querySelector("#sign-dialog").close();
                    }
                    break;

                    //显示签到墙
                case 'display_sign_wall':
                    if (data['sign_info']){
                        var len = data['sign_info'].length;
                        for (var k=0; k < len; ++k)
                            $('#sign-wall-div').append('<div class="sign_wall"><img src="'+data['sign_info'][k]['head_portrait']+'"><div>'+data['sign_info'][k]['nickname']+'</div></div>');
                    }
                    $('#sign-wall-dialog').show();
                    break;

                    //隐藏签到墙
                case 'change':
                    switch (data['module']) {
                        case 'sign_wall':
                            //如果状态为关闭
                            if (data['state']=='false')
                                $('#sign-wall-dialog').hide();
                            break;
                    }
                    break;

                        //签到墙插入新的签到信息
                case 'new_sign_in':
                    $('#sign-wall-div').append('<div class="sign_wall"><img src="'+data['head_portrait']+'"><div>'+data['nickName']+'</div></div>');
                    break;

                    //新的摇一摇信息
                case 'new_shark':
                    var info = data;
                    var len = shark_list.length;
                    var i;
                    for (i = 0; i < len && shark_list[i]['num']!=99999 && shark_list[i]['num']!=10000; ++i){
                        if (shark_list[i]['openid']==info['openid']){
                            shark_list[i]['num']++;

                            if (shark_list[i]['num']==random[random_index]){
                                shark_list[i]['type'] = 'shark_it_off';
                                lucky_list.push(shark_list[i]);
                                shark_list[i]['num'] = 99999;
                                have_lucky++;

                                var info = {
                                        'lottery_id': lottery_id,
                                        'grade_id': grade_id,
                                        'award_id': award_id
                                };

                                var win_prize_inform = '{"type":"win_prize_inform","room_id":"'+room_id+'","openid":"'+shark_list[i]['openid']+'","info":'+JSON.stringify(info)+'}';
                                ws.send(win_prize_inform);

                            }

                            break;
                        }
                    }
                    if (i==len){
                        var num = {num: 0};
                        Object.assign(info,num);
                        shark_list.push(info);
                    }

                    console.log(shark_list);
                    len = shark_list.length;
                    document.getElementById('shark_list_block').innerHTML='';
                    for (i = 0; i < len && shark_list[i]['num']!=99999 && shark_list[i]['num']!=10000; ++i){
                        $('#shark_list_block').append('                    <div style="width: 80%;margin: auto;display: flex;justify-content: space-around;font-size: 16px;">\n' +
                            '                        <img src="'+shark_list[i]['avatarUrl']+'" style="width: 35px;height: 35px;margin:auto;">\n' +
                            '                        <span style="width: 60%; margin:12px 0 12px 0;display:-moz-inline-box;display:inline-block;">'+shark_list[i]['nickName']+'</span>\n' +
                            '                        <span style="width: 15%; margin:12px 0 12px 0;display:-moz-inline-box;display:inline-block;">'+shark_list[i]['num']+'</span>\n' +
                            '                    </div>');
                    }

                    document.getElementById('shark_result_list_block').innerHTML='';
                    for (i = 0; i < have_lucky; ++i){
                        $('#shark_result_list_block').append('                    <div style="width: 80%;margin: auto;display: flex;justify-content: space-around;font-size: 16px;">\n' +
                            '                        <img src="'+lucky_list[i]['avatarUrl']+'" style="width: 35px;height: 35px;margin:auto;">\n' +
                            '                        <span style="width: 60%; margin:12px 0 12px 0;display:-moz-inline-box;display:inline-block;">'+lucky_list[i]['nickName']+'</span>\n' +
                            '                    </div>');
                    }

                    if (Lotterynumber==have_lucky){
                        alert('抽奖结束！');

                        var lucky_info = [
                            {
                                'lottery_id': lottery_id,
                                'grade_id': grade_id,
                                'award_id': award_id
                            },
                            {'lucky_list': lucky_list }
                        ];

                        console.log(lucky_info);
                        var save_lottery_result = '{"type":"save_lottery_result","room_id":"'+room_id+'","openid":"'+openid+'","lottery_result":'+JSON.stringify(lucky_info)+'}';
                        ws.send(save_lottery_result);

                    }

                    break;
                    
                    //新的抢红包类信息
                case 'new_race':

                    var flag = true;
                    for (var i = 0; i < lucky_list.length; ++i){
                        if (lucky_list[i]['openid']==data['openid']) {
                            flag = false;
                        }
                    }
                    
                    if (have_lucky < Lotterynumber && flag) {

                        lucky_list.push(data);
                        $('#race_result_list_block').append('                    <div style="width: 80%;margin: auto;display: flex;justify-content: space-around;font-size: 16px;">\n' +
                            '                        <img src="'+data['avatarUrl']+'" style="width: 35px;height: 35px;margin:auto;">\n' +
                            '                        <span style="width: 60%; margin:12px 0 12px 0;display:-moz-inline-box;display:inline-block;">'+data['nickName']+'</span>\n' +
                            '                    </div>');

                        have_lucky++;

                        var info = {
                            'lottery_id': lottery_id,
                            'grade_id': grade_id,
                            'award_id': award_id
                        };
                        var win_prize_inform = '{"type":"win_prize_inform","room_id":"'+room_id+'","openid":"'+data['openid']+'","info":'+JSON.stringify(info)+'}';
                        ws.send(win_prize_inform);

                        if (have_lucky==Lotterynumber) {

                            var lucky_info = [
                                {
                                    'lottery_id': lottery_id,
                                    'grade_id': grade_id,
                                    'award_id': award_id
                                },
                                {'lucky_list': lucky_list }
                            ];
                            console.log(lucky_info);

                            var save_lottery_result = '{"type":"save_lottery_result","room_id":"'+room_id+'","openid":"'+openid+'","lottery_result":'+JSON.stringify(lucky_info)+'}';
                            ws.send(save_lottery_result);

                        }


                    } else {

                        alert('抽奖人数已满！');

                    }
                    
                    break;

                // 用户退出 更新用户列表
                case 'logout':
                    //{"type":"logout","client_id":xxx,"time":"xxx"}
                    // say(data['from_client_id'], data['from_client_name'], data['from_client_name']+' 退出了', data['time']);
                    delete client_list[data['from_client_id']];
                    // flush_client_list();
                    break;
            }
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
    <style>
        body {
            background: url('bg3.jpg') center / cover;
        }
    </style>

    <div class = "my-header" style="z-index: 20">
        <header>
            <h4 id="title_info" class="mdl-layout-title" style="color: #eeeeee; padding-left: 40px;margin-top:16px"></h4>
        </header>
    </div>

    <div id="ppt_block" class="ppt-div" style="display: none;">

    </div>

    <dialog id="sign-wall-dialog" class="mdl-dialog" style="width: 80%; height:80%; margin-top: 4%; padding: 0px;opacity: 0.9;">
        <h4 class="mdl-dialog__title">签到墙</h4>
        <div id="sign-wall-div" class="mdl-dialog__content" style="width: 85%; height: 85%; margin:auto; display: flex; flex-wrap: wrap;">
        </div>
    </dialog>

    <dialog id="sign-dialog" class="mdl-dialog" style="width: 35%; height:60%">
        <h4 class="mdl-dialog__title">扫码签到</h4>
        <div id="sign_qr" class="mdl-dialog__content" style="width: 75%; height:75%;margin-left:auto;margin-right:auto;text-align: center; padding-top: 5%">
        </div>
    </dialog>

    <dialog id="vote-dialog" class="mdl-dialog" style="width: 80%; height:80%; padding: 0px;opacity: 0.9;">
        <h4 class="mdl-dialog__title">投票结果</h4>
        <div id="vote-result-div" class="mdl-dialog__content" style="width: 85%; height: 85%; margin:auto">

        </div>
    </dialog>

    <div id="lottery-dialog-hold" style="width: 80%; height:70%; margin: 5% 10%;background: #ffffff;padding: 0px;opacity: 0.9; position:absolute; display: none;">
        <h4 style="padding-left: 20px;font-size: 32px;">参与抽奖</h4>
        <div class="mdl-dialog__content" style="width: 85%; height: 85%; margin:auto;">
            <div id="lottery_tip" style="display: flex; justify-content: center; flex-wrap: wrap;align-items: center;">

            </div>
        </div>
    </div>

    <div id="shark-it-off-block" style="width: 80%; height:80%; margin: 5% 10%;background: #ffffff;padding: 0px;opacity: 0.9; position:absolute; display: none;">
        <h4 id="shark_award_info" style="padding-left: 20px;font-size: 32px;"></h4>
        <div style="display: flex;">
            <div id="lottery_tip" class="mdl-dialog__content" style="width: 30%; margin: auto;height: 85%;display: flex; justify-content: center; flex-wrap: wrap;">
                <span style="font-size: 20px;width: 100%;color: #333333;display: flex;justify-content: center;margin-bottom: 10px;">实时榜单</span>
                <div id="shark_list_block" style="overflow: auto;width: 100%;height: 450px;">

                </div>
            </div>
            <div id="lottery_list" class="mdl-dialog__content" style="width: 30%; margin: auto; height: 85%;display: flex; justify-content: center; flex-wrap: wrap;border-left: #ECECEC solid 2px;">
                <span style="font-size: 20px;width: 100%;color: #333333;display: flex;justify-content: center;margin-bottom: 10px;">已中奖名单</span>
                <div id="shark_result_list_block" style="overflow: auto;width: 100%;height: 450px;">

                </div>
            </div>
        </div>
    </div>

    <div id="race-to-control-block" style="width: 80%; height:80%; margin: 5% 10%;background: #ffffff;padding: 0px;opacity: 0.9; position:absolute; display: none;">
        <h4 id="race_award_info" style="padding-left: 20px;font-size: 32px;"></h4>
        <div style="display: flex;">
            <div id="lottery_list" class="mdl-dialog__content" style="width: 30%; margin: auto; height: 85%;display: flex; justify-content: center; flex-wrap: wrap;">
                <span style="font-size: 20px;width: 100%;color: #333333;display: flex;justify-content: center;margin-bottom: 10px;">已中奖名单</span>
                <div id="race_result_list_block" style="overflow: auto;width: 100%;height: 450px;">

                </div>
            </div>
        </div>
    </div>

    <dialog id="lottery-dialog" class="mdl-dialog" style="width: 75%; height:80%; padding: 0px;opacity: 0.9;">
        <h4 class="mdl-dialog__title">现场抽奖</h4>
        <div id="lottery-result-div" class="mdl-dialog__content" style="width: 85%; height: 85%; margin:auto">
            <div id="lottery_info" style="color: #333333;font-size: 20px;margin-top: 20px;">

            </div>
            <div id="luckuser" class="slotMachine" style="margin-left: 20%">
                <div class="slot mdl-card mdl-shadow--2dp">
                    <span class="name">姓名</span>
                </div>
            </div>
            <div class="luck-content-btn">
                <button id="start" class="start mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" onclick="start()" style="padding-left: 32px;padding-right: 32px; margin-left: 55px">
                    开始
                </button>
            </div>
            <div class="luck-user">
                <div class="luck-user-title">
                    <span>中奖名单</span>
                </div>
                <ul class="luck-user-list"></ul>
            </div>
        </div>
    </dialog>

    <script src="screen.js"></script>
    <script src="Luckdraw.js"></script>

</body>
</html>