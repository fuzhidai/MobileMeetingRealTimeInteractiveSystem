$(document).ready(function(){
    //弹幕模块中的弹幕按钮
    $('#barrage_switch').on("click",function () {
        var state = $('#barrage_switch').prop('checked');
        var change_barrage = '{"type":"change","operation":"change","id":"'+room_id+'","module":"barrage","state":"'+state+'","if_manage":"true","openid":"'+openid+'"}';
        ws.send(change_barrage);
    });
    //屏幕控制中的弹幕按钮
    $('#barrage_control_switch').on("click",function () {
        var state = $('#barrage_control_switch').prop('checked');
        var change_barrage = '{"type":"change","operation":"change","id":"'+room_id+'","module":"barrage","state":"'+state+'","if_manage":"true","openid":"'+openid+'"}';
        ws.send(change_barrage);
    });
    //二维码签到
    $('#qr_sign_in_switch').on("click",function () {
        var state = $('#qr_sign_in_switch').prop('checked');
        var change_qr_sign = '{"type":"change","operation":"change","id":"'+room_id+'","module":"QR_sign","state":"'+state+'","if_manage":"true","openid":"'+openid+'"}';
        ws.send(change_qr_sign);
    });
    //个人信息签到
    $('#personage_sign_in_switch').on("click",function () {
        var state = $('#personage_sign_in_switch').prop('checked');
        var change_personage_sign = '{"type":"change","operation":"change","id":"'+room_id+'","module":"personage_sign","state":"'+state+'","if_manage":"true","openid":"'+openid+'"}';
        ws.send(change_personage_sign);
    });
    //签到墙
    $('#sign_wall_switch').on("click",function () {
        var state = $('#sign_wall_switch').prop('checked');
        var change_sign_wall = '{"type":"change","operation":"change","id":"'+room_id+'","module":"sign_wall","state":"'+state+'","if_manage":"true","openid":"'+openid+'"}';
        ws.send(change_sign_wall);
        if (state){
            var display_sign_wall = '{"type":"display_sign_wall","room_id":"'+room_id+'","openid":"'+openid+'"}';
            ws.send(display_sign_wall);
        }
    });
    //人工弹幕审核
    $('#manual_detect_switch').on("click",function () {
        var state = $('#manual_detect_switch').prop('checked');
        var change_manual_detect = '{"type":"change","operation":"change","id":"'+room_id+'","module":"manual_detect","state":"'+state+'","if_manage":"true","openid":"'+openid+'"}';
        ws.send(change_manual_detect);
    });
    //选择PPT
    $('#ppt_switch').on("click",function () {
        var state = $('#ppt_switch').prop('checked');
        if (state==true){
            $("#screen_control_block").hide();
            $("#ppt_select_block").show();
        }else{

        }
    });
    //抽奖按钮
    $('#lottery_switch').on("click",function () {
        var state = $('#lottery_switch').prop('checked');
        if (state==true){
            $("#screen_control_block").hide();
            $("#lottery_select_block").show();
        }else{

        }
    });
    //切换会议按钮
    $('#change_conference').on("click",function () {
        window.location.href = 'https://www.viaviai.com';
    });
    //显示签到二维码
    $('#display_qr_switch1').on("click",function () {

        var qr_sign_state = $('#qr_sign_in_switch').prop('checked');
        var state = $('#display_qr_switch1').prop('checked');

        if (!qr_sign_state && state){
            $('#qr_sign_in_switch').click();
        }

        $('#display_qr_switch2').prop('checked',state);
        var display_qr = '{"type":"display_qr","id":"'+room_id+'","openid":"'+openid+'","state":'+state+'}';
        ws.send(display_qr);
    });
    //显示签到二维码
    $('#display_qr_switch2').on("click",function () {
        var qr_sign_state = $('#qr_sign_in_switch').prop('checked');
        var state = $('#display_qr_switch2').prop('checked');

        if (!qr_sign_state && state){
            $('#qr_sign_in_switch').click();
        }

        $('#display_qr_switch1').prop('checked',state);
        var display_qr = '{"type":"display_qr","id":"'+room_id+'","openid":"'+openid+'","state":'+state+'}';
        ws.send(display_qr);
    });

    //其它文件上传按钮
    $("#file").change(function(){
        // 获取文件名，显示在页面上
        var fragment = $("#file").val();
        var array_fragment = fragment.split('\\');
        file_name = $(array_fragment).last()[0];
        $("#file-name").text("已选择："+$(array_fragment).last()[0]);
    });
    //显示设置抽奖关键字模块
    $("#lottery_function-1").on("click",function () {
        $('#lottery-key-word').show();
        $('#lottery_function-1').prop('checked',true);

    });

    $("#lottery_function-2").on("click",function () {
        $('#lottery-key-word').hide();
        $('#lottery_function-2').prop('checked',true);

    });

    $("#lottery_function-3").on("click",function () {
        $('#lottery-key-word').hide();
        $('#lottery_function-3').prop('checked',true);

    });

    $("#lottery_function-4").on("click",function () {
        $('#lottery-key-word').hide();
        $('#lottery_function-4').prop('checked',true);

    });

});


/**
 * 连接服务器
 */
function connect() {
    // 创建websocket
    ws = new WebSocket('wss://www.viaviai.com/wss');
    // 当socket连接打开时，输入用户名
    ws.onopen = onopen;
    // 当有消息时根据消息类型显示不同信息
    ws.onmessage = onmessage;
    //连接关闭时，进行相应的提示
    ws.onclose = function() {
        console.log("连接关闭，定时重连");
        connect();
    };
    //出现错误时，进行相应的提示
    ws.onerror = function() {
        console.log("出现错误");
    };
}


/**
 * 服务端发来消息时
 * @param e 服务器发送的相关数据信息
 */
function onmessage(e) {
    //将服务器传来的数据由字符串转为JSON对象数组
    var data = JSON.parse(e.data);
    //根据服务器传来信息的类型执行不同的操作
    switch(data['type']){

        // 服务端ping客户端
        case 'ping':
            ws.send('{"type":"pong"}');
            break;

        // 消息类型为改变按钮状态
        case 'change':
            //判断需要改变的按钮类型
            switch (data['module']){
                //要改变的按钮的类型为弹幕开关
                case 'barrage':
                    //如果要改变为的状态为关闭
                    if (data['state']=='false'){
                        //将弹幕功能模块内的弹幕开关关闭
                        $('#barrage_switch').prop('checked',false);
                        //样式设置为关闭
                        $('#barrage_label').removeClass('is-checked');
                        //将屏幕功能模块内的弹幕开关关闭
                        $('#barrage_control_switch').prop('checked',false);
                        //样式设置为关闭
                        $('#barrage_control_label').removeClass('is-checked');
                    } else {
                        //将弹幕功能模块内的弹幕开关打开
                        $('#barrage_switch').prop('checked',true);
                        //样式这是为开启
                        $('#barrage_label').addClass('is-checked');
                        //将屏幕功能模块内的弹幕开关打开
                        $('#barrage_control_switch').prop('checked',true);
                        //样式为开启
                        $('#barrage_control_label').addClass('is-checked');
                    }
                    break;

                //要改变的按钮类型为人工审核开关
                case 'manual_detect':
                    //如果状态为关闭
                    if (data['state']=='false'){
                        //将人工审核按钮关闭
                        $('#manual_detect_switch').prop('checked',false);
                        //人工审核按钮样式设置为关闭
                        $('#manual_detect_label').removeClass('is-checked');
                        //隐藏人工审核模块
                        $('#barrage_detect_block').hide();
                    } else {
                        //将人工审核按钮开启
                        $('#manual_detect_switch').prop('checked',true);
                        //人工审核按钮样式设置为开启
                        $('#manual_detect_label').addClass('is-checked');
                        //显示人工审核模块
                        $('#barrage_detect_block').show();

                    }
                    break;

                //要改变的按钮类型为二维码签到
                case 'QR_sign':
                    //如果状态为关闭
                    if (data['state']=='false'){
                        //关闭二维码签到
                        $('#qr_sign_in_switch').prop('checked',false);
                        //二维码签到样式为关闭
                        $('#qr_sign_in_label').removeClass('is-checked');
                    } else {
                        //开启二维码签到
                        $('#qr_sign_in_switch').prop('checked',true);
                        //二维码签到样式为开启
                        $('#qr_sign_in_label').addClass('is-checked');
                    }
                    break;

                //要改变的按钮类型为个人信息签到
                case 'personage_sign':
                    //如果状态为关闭
                    if (data['state']=='false'){
                        //关闭个人信息签到
                        $('#personage_sign_in_switch').prop('checked',false);
                        $('#personage_sign_in_label').removeClass('is-checked');
                    } else {
                        //开启个人信息签到
                        $('#personage_sign_in_switch').prop('checked',true);
                        $('#personage_sign_in_label').addClass('is-checked');
                    }
                    break;

                //要改变的按钮类型为签到墙
                case 'sign_wall':
                    //如果状态为关闭
                    if (data['state']=='false'){
                        //关闭签到墙
                        $('#sign_wall_switch').prop('checked',false);
                        $('#sign_wall_label').removeClass('is-checked');
                    } else {
                        //开启签到墙
                        $('#sign_wall_switch').prop('checked',true);
                        $('#sign_wall_label').addClass('is-checked');
                    }
                    break;

            }

            break;


        //类型为弹幕消息
        case 'barrage':

            //如果弹幕为开启状态
            if ($('#barrage_switch').prop('checked')==true){

                //弹幕抽奖模式开启时对弹幕进行筛选
                if (lottery_state){

                    //将弹幕内容和管理者设置的关键字进行对比，如果相同
                    if (data['content']==lottery_list[lottery_id][1]['barrage_content']){
                        //临时保存弹幕信息
                        var barrage_lottery = data;
                        //弹幕类型设置为参与抽奖的弹幕
                        barrage_lottery['type'] = 'set_barrage_lottery';
                        //将参与抽奖的序号设置为管理者当前开启的抽奖序号
                        barrage_lottery['lottery_id'] = lottery_id;
                        //将修改后的信息转为字符串
                        barrage_lottery = JSON.stringify(barrage_lottery);
                        //发送至服务器
                        ws.send(barrage_lottery);
                    }
                }

                //如果弹幕人工审核开启
                if ($('#manual_detect_switch').prop('checked')==true) {
                    //将此弹幕添加至待审核弹幕列表
                    barrage_list.push(data);
                    //设置此待审核弹幕的ID
                    var id = barrage_list.length-1;
                    //将此弹幕添加至管理者待审核弹幕模块中
                    $('#barrage_list').append('<li id="barrage_'+id+'" class="mdl-list__item mdl-list__item--two-line"><span class="mdl-list__item-primary-content"><img src="'+data['avatarUrl']+'" class="material-icons mdl-list__item-avatar"/><span>'+data['nickName']+'</span><span class="mdl-list__item-sub-title">'+data['content']+'</span></span><span class="mdl-list__item-secondary-content"><a class="mdl-list__item-secondary-action" href="#"><button name="'+id+'" onclick="detect_fail(this)" class=" mdl-button mdl-js-button mdl-button--primary">拒绝</button><button name="'+id+'" onclick="detect_pass(this)" class="mdl-button mdl-js-button mdl-button--primary">通过</button></a></span></li>');

                } else {
                    //如果未开启审核将此弹幕信息临时保存
                    var barrage_data = data;
                    //修改此弹幕的类型为待显示弹幕
                    barrage_data['type'] = 'display_barrage';
                    //将此弹幕信息转化为字符串
                    barrage_data = JSON.stringify(barrage_data);
                    //将次弹幕发送至服务器
                    ws.send(barrage_data);

                }

            }

            break;

        //初始化设置界面的相关信息
        case 'set_state':

            //控制弹幕是否开启
            if (data['state']['barrage']=='false'){
                $('#barrage_switch').prop('checked',false);
                $('#barrage_label').removeClass('is-checked');
                $('#barrage_control_switch').prop('checked',false);
                $('#barrage_control_label').removeClass('is-checked');
            } else {
                $('#barrage_switch').prop('checked',true);
                $('#barrage_label').addClass('is-checked');
                $('#barrage_control_switch').prop('checked',false);
                $('#barrage_control_label').removeClass('is-checked');
            }

            //控制弹幕审核是否开启
            if (data['state']['manual_detect']=='false'){
                $('#manual_detect_switch').prop('checked',false);
                $('#manual_detect_label').removeClass('is-checked');
            } else {
                $('#manual_detect_switch').prop('checked',true);
                $('#manual_detect_label').addClass('is-checked');
                $('#barrage_detect_block').show();
            }

            //控制二维码签到是否开启
            if (data['state']['QR_sign']=='false'){
                $('#qr_sign_in_switch').prop('checked',false);
                $('#qr_sign_in_label').removeClass('is-checked');
            } else {
                $('#qr_sign_in_switch').prop('checked',true);
                $('#qr_sign_in_label').addClass('is-checked');
            }

            //控制个人信息签到是否开启
            if (data['state']['personage_sign']=='false'){
                $('#personage_sign_in_switch').prop('checked',false);
                $('#personage_sign_in_label').removeClass('is-checked');
            } else {
                $('#personage_sign_in_switch').prop('checked',true);
                $('#personage_sign_in_label').addClass('is-checked');
            }

            //控制签到墙是否开启
            if (data['state']['sign_wall']=='false'){
                $('#sign_wall_switch').prop('checked',false);
                $('#sign_wall_label').removeClass('is-checked');
            } else {
                $('#sign_wall_switch').prop('checked',true);
                $('#sign_wall_label').addClass('is-checked');
                var display_sign_wall = '{"type":"display_sign_wall","room_id":"'+room_id+'","openid":"'+openid+'"}';
                ws.send(display_sign_wall);
            }

            //初始化已上传文件列表（获取已上传文件列表）
            var upload_data = '{"type":"get_upload_list","room_id":"'+room_id+'","openid":"'+openid+'"}';
            //将此请求发送至服务器
            ws.send(upload_data);

            //投票页面初始化，获取问题ID
            questionNumber += 1;
            //获取投票列表模块
            var o = $("#vote-list-cell");
            //默认添加一个问题
            addQuestion(o,questionNumber);
            // 在新添加的问题中增加“添加选项”按钮并附上js
            var list = o.children().last();
            var addChoiceBtn = list.find(".add-choice-btn");
            $(addChoiceBtn).on("click",function () {
                addChoice($(list));
            });

            //抽奖页面初始化
            priceNumber += 1;
            var oo = $("#lottery-list-cell");
            addGrade(oo,priceNumber);

            //初始化已发起的投票列表，将获取到的已发起的投票列表数据转化为JSON对象数组
            vote_list = JSON.parse(data['state']['vote']);
            //如果已发起投票列表存在
            if (vote_list){
                //获取已发起投票数量
                var len = vote_list.length;
                //遍历已发起投票列表
                for (var i = 0; i < len; ++i){
                    //将单次投票信息插入列表中
                    $('#vote_list').append('                                <li class="mdl-list__item mdl-list__item--two-line">\n' +
                        '                                    <span class="mdl-list__item-primary-content">\n' +
                        '                                        <i class="material-icons mdl-list__item-avatar">person</i>\n' +
                        '                                      <span>投票ID：'+(i+1)+'</span>\n' +
                        '                                      <span class="mdl-list__item-sub-title">\n' +
                        '                                          '+vote_list[i][0]['time']+'&nbsp;&nbsp;&nbsp;&nbsp;\n' +
                        '                                      </span>\n' +
                        '                                    </span>\n' +
                        '                                    <span class="mdl-list__item-secondary-content">\n' +
                        '                                      <a class="mdl-list__item-secondary-action" href="#">\n' +
                        '                                        <button onclick="select_vote('+i+')" class="mdl-button mdl-js-button mdl-button--primary delete-btn">\n' +
                        '                                          显示结果\n' +
                        '                                        </button>\n' +
                        '                                      </a>\n' +
                        '                                    </span>\n' +
                        '                                </li>\n');

                }
            }else{
                vote_list = [];
            }


            //初始化设置的已发起的抽奖列表
            if (JSON.parse(data['state']['lottery'])){
                lottery_list = JSON.parse(data['state']['lottery']);
            }

            //遍历已发起的抽奖列表
            if (lottery_list){
                for (var j =0; j< lottery_list.length; ++j){
                    $('#lottery_list').append('<li class="mdl-list__item mdl-list__item--two-line"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-avatar">group</i> <span>'+ lottery_list[j][1]['time'] +'</span> <span class="mdl-list__item-sub-title">抽奖序号：'+(j+1)+'</span> </span> <span class="mdl-list__item-secondary-content"> <a class="mdl-list__item-secondary-action"> <button class=" mdl-button mdl-js-button mdl-button--primary" onclick="choose_lottery('+j+')">开启此抽奖 </button> </a> </span> </li>');
                }
            }

            break;

        //类型为设置用户上传文件列表
        case 'set_upload_list':
            //获取用户已上传文件列表的长度
            var len = data['upload_list'].length;
            //将已上传文件列表保存至本地
            upload_list = data['upload_list'];
            //清空之前的列表
            document.getElementById('upload_list').innerHTML='';
            //遍历已上传文件列表
            for (var i = 0; i < len && data['upload_list'][i]['download']=='true'; ++i){
                //添加单个文件样式至列表模块中
                $('#upload_list').append('<div class="mdl-list__item uploaded-file--list-item"><span class="mdl-list__item-primary-content" style="margin-left: 20px;"><i class="material-icons" style="padding-right: 30px">done</i><span>'+data['upload_list'][i]['name']+'</span></span><a class="mdl-list__item-secondary-action"><button name="'+data['upload_list'][i]['id']+'" onclick="hide_file(this);" class="mdl-button mdl-js-button mdl-js-ripple-effect" style="color: rgb(96,125,139);">隐藏</button></a></div>');
                //如果此文将类型为PPT或PPTX，将此文件加入可播放的PPT列表中
                if (data['upload_list'][i]['type']=='ppt' || data['upload_list'][i]['type']=='pptx'){
                    ppt_list.push(data['upload_list'][i]);
                    $('#ppt_list').append('<li class="mdl-list__item mdl-list__item--two-line"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-avatar">group</i> <span>'+ data['upload_list'][i]['name'] +'</span> <span class="mdl-list__item-sub-title">PPT序号：'+ppt_list.length+'</span> </span> <span class="mdl-list__item-secondary-content"> <a class="mdl-list__item-secondary-action"> <button class=" mdl-button mdl-js-button mdl-button--primary" onclick="choose_ppt(\''+data['upload_list'][i]['path']+'\')">播放 </button> </a> </span> </li>');
                }

            }
            break;

    }
}


/**
 * 生成用户保存为上传图片路径名的UID
 */
function getuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    })
}


/**
 * 获取当前的时间
 */
function CurentTime() {
    var now = new Date();

    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日

    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ss = now.getSeconds();           //秒

    var clock = year + "-";

    if(month < 10)
        clock += "0";

    clock += month + "-";

    if(day < 10)
        clock += "0";

    clock += day + " ";

    if(hh < 10)
        clock += "0";

    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm + ":";

    if (ss < 10) clock += '0';
    clock += ss;
    return (clock);
}


/**
 * 获取文件的后缀名
 * @param e 文件名称
 */
function getFileType (e){
    var arr = e.split('.');
    return arr[arr.length - 1];
}


/**
 * 文件的上传
 */
function upload() {
    //获取当前的时间
    var time = CurentTime();
    //获取文件全名
    var fragment = $("#file").val();
    var array_fragment = fragment.split('\\');
    file_name = $(array_fragment).last()[0];
    //获取文件的后缀名
    var type = getFileType(file_name);
    //设置文件的保存路径
    var path = getuid()+'.'+type;
    //通过AJAX的方式上传文件
    $.ajaxFileUpload
    (
        {
            url: 'sever/upload.php', //用于文件上传的服务器端请求地址
            secureuri: false, //是否需要安全协议，一般设置为false
            fileElementId: 'file', //文件上传域的ID
            data: {
                'openid': openid, //用户openid
                'id': room_id, //会议ID
                'download':'true', //是否允许下载
                'time': time, //上传时间
                'type': type, //文件类型
                'name': file_name, //文件名称
                'path': path //保存路径

            },
            dataType: 'JSON', //返回值类型
            success: function (data, status)  //服务器成功响应处理函数
            {
                //上传成功后进行提示
                alert('文件上传成功');
                //将已上传文件记录清空
                $("#file").replaceWith('<input type="file" id="file" name="file"/>');
                //保存文件的相关信息
                var upload_info = {
                    id: String(data),
                    openid: openid,
                    conference_id: ''+room_id+'',
                    download: 'true',
                    time: time,
                    name: file_name,
                    type: type,
                    path: path
                };
                //将此文件信息保存至本地
                upload_list.push(upload_info);
                //将此文件信息添加至已上传文件列表
                $('#upload_list').append('<div class="mdl-list__item uploaded-file--list-item"><span class="mdl-list__item-primary-content" style="margin-left: 20px;"><i class="material-icons" style="padding-right: 30px">done</i><span>'+file_name+'</span></span><a class="mdl-list__item-secondary-action"><button name="'+data+'" onclick="hide_file(this)" class="mdl-button mdl-js-button mdl-js-ripple-effect" style="color: rgb(96,125,139);">隐藏</button></a></div>');
                //如果文件类型为PPT或PPTX，将此文件添加至可播放PPT列表
                if (upload_info['type']=='ppt' || upload_info['type']=='pptx'){
                    ppt_list.push(upload_info);
                    $('#ppt_list').append('<li class="mdl-list__item mdl-list__item--two-line"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-avatar">group</i> <span>'+ upload_info['name'] +'</span> <span class="mdl-list__item-sub-title">PPT序号：'+ppt_list.length+'</span> </span> <span class="mdl-list__item-secondary-content"> <a class="mdl-list__item-secondary-action"> <button class=" mdl-button mdl-js-button mdl-button--primary" onclick="choose_ppt(\''+upload_info['path']+'\')">播放 </button> </a> </span> </li>');
                }

            },
            error: function (data, status, e)//服务器响应失败处理函数
            {
                console.log(e);
                alert('出现错误，请稍后再试');
            }
        }
    );
    // return false;
}


/**
 * 弹幕审核未通过
 * @param e 弹幕信息
 */
function detect_fail(e) {
    //将此弹幕样式从列表中删除
    var id = $(e).attr("name");
    document.getElementById('barrage_'+id).remove();
}


/**
 * 弹幕审核通过
 * @param e 弹幕信息
 */
function detect_pass(e) {
    //将次弹幕样式从列表中删除
    var id = $(e).attr("name");
    document.getElementById('barrage_'+id).remove();
    //保存弹幕的信息
    var data = barrage_list[id];
    //类型更改为显示弹幕
    data['type'] = 'display_barrage';
    //转化为字符串
    var barrage_data = JSON.stringify(data);
    //发送至服务器
    ws.send(barrage_data);
}


/**
 * 发起新的投票并更新已发起的投票列表
 */
function sub_vote() {
    //将此投票信息通过AJAX发送至服务器
    $.ajax({
        cache: true,
        type: "POST",
        url:"sever/manage.php",
        data:$('#vote_form').serialize(),// 表单ID
        async: false,
        error: function(request) {
            console.log("Connection error:"+request.error);
            alert('出现错误，请稍后再试');
        },
        success: function(data) {
            //发起成功后进行提示
            alert("发起投票成功");
            //将此投票添加至已发起的投票列表中
            vote_list.push(JSON.parse(data));
            //投票页面初始化，清空发起投票模块
            document.getElementById('vote-list-cell').innerHTML = '';
            questionNumber = 0;
            questionNumber += 1;
            var o = $("#vote-list-cell");
            addQuestion(o,questionNumber);
            // 在新添加的问题中增加“添加选项”按钮并附上js
            var list = o.children().last();
            var addChoiceBtn = list.find(".add-choice-btn");
            $(addChoiceBtn).on("click",function () {
                addChoice($(list));
            });
            //将此次投票纪录样式添加至已发起的投票列表样式中
            $('#vote_list').append('                                <li class="mdl-list__item mdl-list__item--two-line">\n' +
                '                                    <span class="mdl-list__item-primary-content">\n' +
                '                                        <i class="material-icons mdl-list__item-avatar">person</i>\n' +
                '                                      <span>投票ID：'+(vote_list.length)+'</span>\n' +
                '                                      <span class="mdl-list__item-sub-title">\n' +
                '                                          '+vote_list[vote_list.length-1][0]['time']+'&nbsp;&nbsp;&nbsp;&nbsp;\n' +
                '                                      </span>\n' +
                '                                    </span>\n' +
                '                                    <span class="mdl-list__item-secondary-content">\n' +
                '                                      <a class="mdl-list__item-secondary-action" href="#">\n' +
                '                                        <button onclick="select_vote('+(vote_list.length-1)+')" class="mdl-button mdl-js-button mdl-button--primary delete-btn">\n' +
                '                                          显示结果\n' +
                '                                        </button>\n' +
                '                                      </a>\n' +
                '                                    </span>\n' +
                '                                </li>\n');


        }
    });

}


/**
 * 选择要显示投票结果
 * @param index 投票的ID
 */
function select_vote(index) {
    //将发起投票模块隐藏
    $('#vote_block').hide();
    //选择要显示的投票结果模块显示
    $('#vote_select_block').show();
    //清空列表
    $('#vote_list_block').empty();
    //获取该投票的长度
    var len = vote_list[index].length;
    //遍历该投票的各个问题
    for (var i = 0; i < len; ++i)
        $('#vote_list_block').append('<li class="mdl-list__item mdl-list__item--two-line"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-avatar">group</i> <span>'+ vote_list[index][i]['question'] +'</span> <span class="mdl-list__item-sub-title">问题序号：'+(i+1)+'</span> </span> <span class="mdl-list__item-secondary-content"> <a class="mdl-list__item-secondary-action"> <button class=" mdl-button mdl-js-button mdl-button--primary" onclick="choose_display_vote('+index+','+i+')">显示 </button> </a> </span> </li>');

}


/**
 * 在大屏幕上显示特定问题的投票结果
 * @param index 投票问题的ID
 * @param vote_index 投票的ID
 */
function choose_display_vote(vote_index,index) {
    var vote_result = '{"type":"display_vote_result","room_id":"'+room_id+'","openid":"'+openid+'","vote_id":"'+vote_index+'","question_id":'+index+'}';
    ws.send(vote_result);
}


/**
 * 发起新的抽奖并更新已发起的投票列表
 */
function sub_lottery() {
    //将弹幕抽奖关键字信息插入表单中
    if ($('#lottery_barrage_content').val()!='我要参与抽奖'){
        $('#lottery_form').append('<input name="lottery[1][barrage_content]" type="text" value="'+$('#lottery_barrage_content').val()+'" style="display: none;">');
    } else{
        $('#lottery_form').append('<input name="lottery[1][barrage_content]" type="text" value="我要参与抽奖" style="display: none;">');
    }
    //添加抽奖方式
    $('#lottery_form').append('<input name="lottery[1][function]" type="text" value="'+$('input[name="lottery_function"]:checked').val()+'" style="display: none;">');
    //通过AJAX的方式发送表单
    $.ajax({
        cache: true,
        type: "POST",
        url:"sever/manage.php",
        data:$('#lottery_form').serialize(),//表单ID
        async: false,
        error: function(request) {
            console.log("Connection error:"+request.error);
            alert('出现错误，请稍后再试');
        },
        success: function(data) {
            //发起成功后进行相关的提示
            alert("发起抽奖成功");

            if (JSON.parse(data)) {
                //将此次抽奖信息保存至本地
                lottery_list.push(JSON.parse(data));
            }
            //在已发起的抽奖列表中添加此次抽奖信息
            $('#lottery_list').append('<li class="mdl-list__item mdl-list__item--two-line"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-avatar">group</i> <span>'+ lottery_list[lottery_list.length-1][1]['time'] +'</span> <span class="mdl-list__item-sub-title">抽奖序号：'+lottery_list.length+'</span> </span> <span class="mdl-list__item-secondary-content"> <a class="mdl-list__item-secondary-action"> <button class=" mdl-button mdl-js-button mdl-button--primary" onclick="choose_lottery('+(lottery_list.length-1)+')">开启此抽奖 </button> </a> </span> </li>');
            //清空已发起投票列表
            document.getElementById('lottery-list-cell').innerHTML = '';
            document.getElementById('lottery_barrage_content').value = '';
            priceNumber = 0;
            //抽奖页面初始化
            priceNumber += 1;
            var oo = $("#lottery-list-cell");
            addGrade(oo,priceNumber);

        }
    });

}


/**
 * 准备的抽奖
 * @param index 抽奖的ID
 */
function choose_lottery(index) {
    //将选择抽奖模块隐藏
    $('#lottery_select_block').hide();
    //保存抽奖ID
    lottery_id = index;
    //开启抽奖状态
    lottery_state = true;
    //将此状态和用户设置的抽奖关键字发送至服务器
    var lottery_hold = '{"type":"display_lottery_hold","room_id":"'+room_id+'","openid":"'+openid+'","function":"'+lottery_list[index][1]['function']+'","barrage_content":"'+lottery_list[lottery_id][1]['barrage_content']+'"}';
    ws.send(lottery_hold);
    //获取此次抽奖的详细信息
    var lottery_info = lottery_list[index][0]['lottery'];
    var len = lottery_info.length;
    //初始化清空列表
    document.getElementById('lottery_award_list').innerHTML='';
    //遍历添加此次抽奖的奖项
    for (var j = 0; j < len; ++j)
        for (var k = 0; k < lottery_info[j]['awards'].length; ++k)
            $('#lottery_award_list').append('<li class="mdl-list__item mdl-list__item--two-line"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-avatar">group</i> <span>'+ lottery_info[j]['grade'] +'</span> <span class="mdl-list__item-sub-title">奖品：'+lottery_info[j]['awards'][k]['award']+'</span> </span> <span class="mdl-list__item-secondary-content"> <a class="mdl-list__item-secondary-action"> <button class=" mdl-button mdl-js-button mdl-button--primary" onclick="startLottery('+j+','+k+','+index+')">开始抽奖 </button> </a> </span> </li>');
    //显示等待参与抽奖的人员进入控制模块
    if (lottery_list[index][1]['function']=="key_word"){
        $('#on_lottery_block').show();
    }
    //显示选择抽奖奖项模块
    $('#choose_lottery_award_block').show();
    $('#control_lottery_award_block').show();
    
}


/**
 * 开始抽奖
 * @param grade_id 奖项ID
 * @param award_id 奖品ID
 * @param index 抽奖ID
 */
function startLottery(grade_id,award_id,index) {
    var lottery_info = lottery_list[index][0]['lottery'];
    var lottery_start = '{"type":"display_lottery_start","room_id":"'+room_id+'","lottery_id":'+lottery_id+',"function":"'+lottery_list[index][1]['function']+'","openid":"'+openid+'","grade":"'+lottery_info[grade_id]['grade']+'","award":"'+lottery_info[grade_id]['awards'][award_id]['award']+'","grade_id":'+grade_id+',"award_id":'+award_id+',"award_num":'+lottery_info[grade_id]['awards'][award_id]['num']+'}';
    ws.send(lottery_start);

}


/**
 * 关闭参与抽奖入口
 */
function close_lottery_entrance() {
    lottery_state = false;
    $('#lottery_state').text('抽奖入口已关闭');
    $('#close_lottery_entrance').addClass("hide");
}


/**
 * 添加新的投票问题
 */
function addNewQuestion(){
    questionNumber += 1;
    var o = $("#vote-list-cell");
    addQuestion(o,questionNumber);
    // 在新添加的问题中增加“添加选项”按钮并附上js
    var list = o.children().last();
    var addChoiceBtn = list.find(".add-choice-btn");
    $(addChoiceBtn).on("click",function () {
        addChoice($(list));
    });

}


/**
 * 添加新的奖项
 */
function addNewGrade(){
    priceNumber += 1;
    var oo = $("#lottery-list-cell");
    addGrade(oo,priceNumber);
}


/**
 * 添加新的投票选项
 */
function addNewChoice(){}


/**
 * 添加新的奖品
 */
function addNewAward() {
    var oo= $(".add-award-btn");
    addAward(oo);
}


/**
 * 隐藏文件
 * @param e 文件详细信息
 */
function hide_file(e){

    var id = $(e).attr("name");

    $.ajax({url:"sever/download.php?type=update&download=false&file_id="+id,success:function () {
            //重新请求数据
            var upload_data = '{"type":"get_upload_list","room_id":"' + room_id + '","openid":"' + openid + '"}';
            ws.send(upload_data);

        }})//执行命令隐藏文件

}


/**
 * 选择要显示的PPT文件
 * @param path PPT路径
 */
function choose_ppt(path) {
    //从服务器获取PPT文件
    var open_ppt = '{"type":"open_ppt","room_id":"'+room_id+'","openid":"'+openid+'","ppt_path":"'+path+'"}';
    ws.send(open_ppt);
    //隐藏选择PPT模块
    $("#ppt_select_block").hide();
    $("#screen_control_block").show();
}


/**
 * 控制功能模块的显示
 * @param block 模块的ID
 */
function setContent(block){

    //将部分功能模块全部隐藏
    $('#vote_select_block').hide();
    $('#ppt_select_block').hide();
    $('#lottery_select_block').hide();
    $('#on_lottery_block').hide();
    $('#choose_lottery_award_block').hide();
    $('#control_lottery_award_block').hide();
    //隐藏曾选择模块
    switch (content_block){
        case 'screen_control':$("#screen_control_block").hide();break;
        case 'checkin':$("#checkin_block").hide();break;
        case 'upload':$("#upload_block").hide();break;
        case 'barrage':$("#barrage_block").hide();break;
        case 'vote':$("#vote_block").hide();break;
        case 'lottery':$("#lottery_block").hide();break;
    }
    //保存已选择模块
    content_block = block;
    //显示模块
    switch (block){
        case 'screen_control':$("#screen_control_block").show();break;
        case 'checkin':$("#checkin_block").show();break;
        case 'upload':$("#upload_block").show();break;
        case 'barrage':$("#barrage_block").show();break;
        case 'vote':$("#vote_block").show();break;
        case 'lottery':$("#lottery_block").show();break;
    }
    //如果选择投票模块进行信息的初始化
    if ('vote'==block){

        $('#vote_form').append('<input name="type" type="text" value="vote" style="display: none;">');
        $('#vote_form').append('<input name="from" type="text" value="web" style="display: none;">');
        $('#vote_form').append('<input name="id" type="text" value="'+room_id+'" style="display: none;">');

    }
    //如果选择抽奖模块进行信息的初始化
    if ('lottery'){

        $('#lottery_form').append('<input name="type" type="text" value="lottery" style="display: none;">');
        $('#lottery_form').append('<input name="lottery[1][range]" type="text" value="'+$('input[name="lottery_range"]:checked').val()+'" style="display: none;">');
        $('#lottery_form').append('<input name="lottery[1][time]" type="text" value="'+CurentTime()+'" style="display: none;">');
        $('#lottery_form').append('<input name="from" type="text" value="web" style="display: none;">');
        $('#lottery_form').append('<input name="id" type="text" value="'+room_id+'" style="display: none;">');

    }
    //设置选择模块样式
    $('#'+block).addClass("link-selected");
    //设置未选择模块央视
    if ('screen_control'!=block) $("#screen_control").attr("class","mdl-navigation__link");
    if ('checkin'!=block) $("#checkin").attr("class","mdl-navigation__link");
    if ('upload'!=block) $("#upload").attr("class","mdl-navigation__link");
    if ('barrage'!=block) $("#barrage").attr("class","mdl-navigation__link");
    if ('vote'!=block) $("#vote").attr("class","mdl-navigation__link");
    if ('lottery'!=block) $("#lottery").attr("class","mdl-navigation__link");

}


/**
 * 开启大屏幕
 * @param url 开启屏幕的网址
 * @param openid 用户的openid
 * @param room_id 会议ID
 * @param theme 会议主题
 */
function openPostWindow(url,openid, room_id,theme){

    var tempForm = document.createElement("form");
    tempForm.id = "tempForm1";
    tempForm.method = "post";
    tempForm.action = url;
    tempForm.target="_blank"; //打开新页面

    var hideInput1 = document.createElement("input");
    hideInput1.type = "hidden";
    hideInput1.name="openid"; //后台要接受这个参数来取值
    hideInput1.value = openid; //后台实际取到的值

    var hideInput2 = document.createElement("input");
    hideInput2.type = "hidden";
    hideInput2.name="room_id";
    hideInput2.value = room_id;

    var hideInput3 = document.createElement("input");
    hideInput3.type = "hidden";
    hideInput3.name="theme";
    hideInput3.value = theme;

    tempForm.appendChild(hideInput1);
    tempForm.appendChild(hideInput2);
    tempForm.appendChild(hideInput3);

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

