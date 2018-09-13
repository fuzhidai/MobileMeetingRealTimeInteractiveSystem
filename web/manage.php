<!DOCTYPE html>
<html>
<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="thz.ico" type="image/x-icon"/>

    <!-- Material Design Lite -->
    <link rel="stylesheet" href="https://fonts.lug.ustc.edu.cn/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://cdn.staticfile.org/material-design-lite/1.3.0/material.blue_grey-indigo.min.css">
    <link rel="stylesheet" href="https://fonts.lug.ustc.edu.cn/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en">
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdn.staticfile.org/material-design-lite/1.3.0/material.min.js"></script>
    <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
    <script src="ajaxfileupload.js" type="text/javascript"></script>

    <script defer src="vote_js.js"></script>
    <script defer src="lottery_js.js"></script>
    <script defer src="manage_js.js"></script>


    <style>
        /* 右下角按钮位置 */
        #view-source {
            position: fixed;
            display: block;
            right: 0;
            top: 0;
            margin-right: 20px;
            margin-top: 70px;
            z-index: 1;
        }

        .hide {
            display: none;
        }

        /*修改提示文字的颜色*/

        input::-webkit-input-placeholder { /* WebKit browsers */
            color: rgb(230, 230, 230);
        }

        input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
            color: rgb(230, 230, 230);
        }

        input::-moz-placeholder { /* Mozilla Firefox 19+ */
            color: rgb(230, 230, 230);
        }

        input:-ms-input-placeholder { /* Internet Explorer 10+ */
            color: rgb(230, 230, 230);
        }

        /*input聚焦时占位符自动消失*/

        /* WebKit browsers */
        input:focus::-webkit-input-placeholder { color:transparent; }

        /* Mozilla Firefox 4 to 18 */
        input:focus:-moz-placeholder { color:transparent; }

        /* Mozilla Firefox 19+ */
        input:focus::-moz-placeholder { color:transparent; }

        /* Internet Explorer 10+ */
        input:focus:-ms-input-placeholder { color:transparent; }


    </style>

    <script type="text/javascript">
        if (typeof console === "undefined") {    this.console = { log: function (msg) {  } };}
        // 如果浏览器不支持websocket，会使用这个flash自动模拟websocket协议，此过程对开发者透明
        WEB_SOCKET_SWF_LOCATION = "/swf/WebSocketMain.swf";
        // 开启flash的websocket debug
        WEB_SOCKET_DEBUG = true;
        var ws, client_id, client_list={}, room_id, content_block="screen_control", openid, file_name, theme, lottery_id=0,lottery_state = false, questionNumber = 0, priceNumber = 0, vote_list=[], upload_list=[], ppt_list=[], barrage_list=[], lottery_list=[];

        // 连接建立时发送登录信息
        function onopen()
        {
            var name = 'web';
            theme = '<?php echo $_POST['theme'] ?>';
            openid = '<?php echo $_POST['openid']?>';
            room_id = '<?php echo isset($_POST['id']) ? $_POST['id'] : 1?>';
            // 登录
            var login_data = '{"type":"login","client_name":"'+name+'","room_id":"'+room_id+'","openid":"'+openid+'"}';
            room_id = <?php echo isset($_POST['id']) ? $_POST['id'] : 1?>;
            document.getElementById('avatarUrl').innerHTML='<img src="<?php echo $_POST['avatarUrl']?>" class="demo-avatar">';
            document.getElementById('user_info').innerHTML='<?php echo $_POST['nickName'] ?>@<?php echo $_POST['theme'] ?>';
            console.log("websocket握手成功，发送登录数据:"+login_data);
            ws.send(login_data);

        }

    </script>

    <title>拓荒者-会议互动系统</title>
</head>

<body  onload="connect();">
<div class="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
    <header class="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div class="mdl-layout__header-row">
            <span class="mdl-layout-title">拓荒者会议控制中心</span>
            <div class="mdl-layout-spacer"></div>
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
                <label class="mdl-button mdl-js-button mdl-button--icon" for="search">
                    <i class="material-icons">search</i>
                </label>
                <div class="mdl-textfield__expandable-holder">
                    <input class="mdl-textfield__input" type="text" id="search">
                    <label class="mdl-textfield__label" for="search">Enter your query...</label>
                </div>
            </div>
            <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
                <i class="material-icons">more_vert</i>
            </button>
            <ul class="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" for="hdrbtn">
                <li class="mdl-menu__item">切换用户</li>
                <li class="mdl-menu__item">退出登录</li>
            </ul>
        </div>
    </header>
    <div class="demo-drawer mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50">
        <header class="demo-drawer-header">
            <div id="avatarUrl"></div>
            <div class="demo-avatar-dropdown">
                <span id="user_info"></span>
                <div class="mdl-layout-spacer"></div>
                <div class="mdl-layout-spacer"></div>
                <button id="accbtn" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon">
                    <i class="material-icons" role="presentation">arrow_drop_down</i>
                    <span class="visuallyhidden">Accounts</span>
                </button>
                <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="accbtn">
                    <li id="change_conference" class="mdl-menu__item">切换会议</li>
                </ul>
            </div>
        </header>
        <nav class="demo-navigation mdl-navigation mdl-color--blue-grey-800">
            <style>
                /*左栏已选中标签的颜色*/
                .link-selected{
                    background-color: #62727b;
                    color: #37474F;
                    cursor: pointer;
                }
            </style>

            <a id="screen_control" class="mdl-navigation__link link-selected" onclick="setContent('screen_control');"><i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">personal_video</i>屏幕控制</a>
            <a id="checkin" class="mdl-navigation__link" onclick="setContent('checkin');"><i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">fingerprint</i>会议签到</a>
            <a id="upload" class="mdl-navigation__link" onclick="setContent('upload');"><i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">cloud_upload</i>文件上传</a>
            <a id="barrage" class="mdl-navigation__link" onclick="setContent('barrage');"><i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">question_answer</i>弹幕控制</a>
            <a id="vote" class="mdl-navigation__link" onclick="setContent('vote');"><i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">equalizer</i>现场投票</a>
            <a id="lottery" class="mdl-navigation__link" onclick="setContent('lottery');"><i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">card_giftcard</i>现场抽奖</a>
            <div class="mdl-layout-spacer"></div>
            <a id="help" class="mdl-navigation__link" onclick="setContent('help');"><i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">help_outline</i>问题帮助<span class="visuallyhidden">Help</span></a>

        </nav>
    </div>

    <main id="mainContent" class="mdl-layout__content mdl-color--grey-100">

        <div id="ppt_select_block" class="mdl-layout__tab-panel is-active" style="display: none;">
            <section class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp" style="max-width: 600px;">
                <div class="mdl-card mdl-cell mdl-cell--12-col">
                    <div class="mdl-card__supporting-text mdl-grid--no-spacing">
                        <h4 class="mdl-cell mdl-cell--12-col">近期会议</h4>
                        <!-- 装有一个ul表单的mdl-cell -->
                        <div class="mdl-cell mdl-cell--12-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                            <ul id="ppt_list" class="demo-list-two mdl-list">

                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div id="vote_select_block" class="mdl-layout__tab-panel is-active" style="display: none;">
            <section class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp" style="max-width: 600px;">
                <div class="mdl-card mdl-cell mdl-cell--12-col">
                    <div class="mdl-card__supporting-text mdl-grid--no-spacing">
                        <h4 class="mdl-cell mdl-cell--12-col">投票问题</h4>
                        <!-- 装有一个ul表单的mdl-cell -->
                        <div class="mdl-cell mdl-cell--12-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                            <ul id="vote_list_block" class="demo-list-two mdl-list">

                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div id="lottery_select_block" class="mdl-layout__tab-panel is-active" style="display: none;">
            <section class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp" style="max-width: 600px;">
                <div class="mdl-card mdl-cell mdl-cell--12-col">
                    <div class="mdl-card__supporting-text mdl-grid--no-spacing">
                        <h4 class="mdl-cell mdl-cell--12-col">发起抽奖</h4>
                        <!-- 装有一个ul表单的mdl-cell -->
                        <div class="mdl-cell mdl-cell--12-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                            <ul id="lottery_list" class="demo-list-two mdl-list">

                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div id="control_lottery_award_block" class="mdl-layout__tab-panel is-active" style="display: none;">
            <section id="on_lottery_block" class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp" style="max-width: 600px;display: none;">
                <div class="mdl-card mdl-cell mdl-cell--12-col">
                    <div class="mdl-card__supporting-text mdl-grid--no-spacing">
                        <h4 class="mdl-cell mdl-cell--12-col">等待人员加入中</h4>
                        <!-- 装有一个ul表单的mdl-cell -->
                        <div class="mdl-cell mdl-cell--12-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                            <ul class="demo-list-two mdl-list">
                                <li class="mdl-list__item mdl-list__item--two-line">
                                    <span class="mdl-list__item-primary-content">
                                        <i class="material-icons mdl-list__item-icon">power_settings_new</i>
                                        <span>参会者抽奖入口</span> <span id="lottery_state" class="mdl-list__item-sub-title">等待参会人员进入抽奖室</span>
                                    </span>
                                    <span class="mdl-list__item-secondary-content">
                                        <a class="mdl-list__item-secondary-action">
                                            <button class=" mdl-button mdl-js-button mdl-button--primary" id="close_lottery_entrance" onclick="close_lottery_entrance()">关闭 </button>
                                        </a>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <section id="choose_lottery_award_block" class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp" style="max-width: 600px;display: none;">
                <div class="mdl-card mdl-cell mdl-cell--12-col">
                    <div class="mdl-card__supporting-text mdl-grid--no-spacing">
                        <h4 class="mdl-cell mdl-cell--12-col">抽奖</h4>
                        <!-- 装有一个ul表单的mdl-cell -->
                        <div class="mdl-cell mdl-cell--12-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                            <ul id="lottery_award_list" class="demo-list-two mdl-list">

                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div id="screen_control_block" class="mdl-layout__tab-panel is-active">
            <!-- 页面content开始 -->
            <section class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
                <div class="mdl-card mdl-cell mdl-cell--12-col">
                    <div class="mdl-card__supporting-text mdl-grid--no-spacing">
                        <h4 class="mdl-cell mdl-cell--12-col">会前控制</h4>
                        <!-- 装有一个ul表单的mdl-cell -->
                        <div class="mdl-cell mdl-cell--12-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                            <ul class="demo-list-two mdl-list">
                                <li class="mdl-list__item mdl-list__item--two-line">
                                    <span class="mdl-list__item-primary-content">
                                        <i class="material-icons mdl-list__item-icon">add_to_queue</i>
                                      <span>显示签到墙</span>
                                      <span class="mdl-list__item-sub-title">控制大屏幕上二维码签到墙的开启/关闭</span>
                                    </span>
                                    <span class="mdl-list__item-secondary-content">
                                      <a class="mdl-list__item-secondary-action" href="#">
                                          <label id="sign_wall_label" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                                          <input  type="checkbox" id="sign_wall_switch" class="mdl-switch__input">
                                          <span class="mdl-switch__label"></span>
                                          </label>
                                      </a>
                                    </span>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            <section class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
                <div class="mdl-card mdl-cell mdl-cell--12-col">
                    <div class="mdl-card__supporting-text mdl-grid--no-spacing">
                        <h4 class="mdl-cell mdl-cell--12-col">会中控制</h4>
                        <!-- 装有一个ul表单的mdl-cell -->
                        <div class="mdl-cell mdl-cell--12-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                            <ul class="demo-list-two mdl-list">
                                <li class="mdl-list__item mdl-list__item--two-line">
                                <span class="mdl-list__item-primary-content">
                                    <i class="material-icons mdl-list__item-icon">crop_free</i>
                                  <span>显示签到二维码</span>
                                  <span class="mdl-list__item-sub-title">开启后，屏幕上显示签到二维码</span>
                                </span>
                                    <span class="mdl-list__item-secondary-content">
                                  <a class="mdl-list__item-secondary-action" href="#">
                                      <label id="display_qr_label" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                                      <input type="checkbox" id="display_qr_switch1" class="mdl-switch__input">
                                      <span class="mdl-switch__label"></span>
                                      </label>
                                  </a>
                                </span>
                                </li>
                                <li class="mdl-list__item mdl-list__item--two-line">
                                    <span class="mdl-list__item-primary-content">
                                        <i class="material-icons mdl-list__item-icon">textsms</i>
                                      <span>弹幕</span>
                                      <span class="mdl-list__item-sub-title">互动屏幕上的即时弹幕开关</span>
                                    </span>
                                    <span class="mdl-list__item-secondary-content">
                                      <a class="mdl-list__item-secondary-action" href="#">
                                          <label id="barrage_control_label" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                                          <input type="checkbox" id="barrage_control_switch" class="mdl-switch__input">
                                          <span class="mdl-switch__label"></span>
                                          </label>
                                      </a>
                                    </span>
                                </li>
                                <li class="mdl-list__item mdl-list__item--two-line">
                                    <span class="mdl-list__item-primary-content">
                                        <i class="material-icons mdl-list__item-icon">subscriptions</i>
                                      <span>幻灯片放映</span>
                                      <span class="mdl-list__item-sub-title">选择后，互动屏幕将开始播放您所选定的PPT</span>
                                    </span>
                                    <span class="mdl-list__item-secondary-content">
                                      <a class="mdl-list__item-secondary-action" href="#">
                                          <label id="ppt_label" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                                          <input type="checkbox" id="ppt_switch" class="mdl-switch__input">
                                          <span class="mdl-switch__label"></span>
                                          </label>
                                      </a>
                                    </span>
                                </li>
                                <li class="mdl-list__item mdl-list__item--two-line">
                                    <span class="mdl-list__item-primary-content">
                                        <i class="material-icons mdl-list__item-icon">card_giftcard</i>
                                      <span>抽奖</span>
                                      <span class="mdl-list__item-sub-title">开始抽奖，并在大屏幕上实时展示</span>
                                    </span>
                                    <span class="mdl-list__item-secondary-content">
                                      <a class="mdl-list__item-secondary-action" href="#">
                                          <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                                          <input type="checkbox" id="lottery_switch" class="mdl-switch__input">
                                          <span class="mdl-switch__label"></span>
                                          </label>
                                      </a>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>



                </div>
            </section>


            <!-- 页面content结束 -->
        </div>

        <div id="barrage_block" class="mdl-layout__tab-panel is-active" style="display: none;">
            <!-- 页面content开始 -->
            <section class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
                <div class="mdl-card mdl-cell mdl-cell--12-col">
                    <div class="mdl-card__supporting-text mdl-grid--no-spacing">
                        <h4 class="mdl-cell mdl-cell--12-col">启用功能</h4>
                        <!-- 装有一个ul表单的mdl-cell -->
                        <div class="mdl-cell mdl-cell--12-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                            <ul class="demo-list-two mdl-list">
                                <li class="mdl-list__item mdl-list__item--two-line">
                                    <span class="mdl-list__item-primary-content">
                                        <i class="material-icons mdl-list__item-icon">power_settings_new</i>
                                      <span>启用弹幕</span>
                                      <span class="mdl-list__item-sub-title">关闭时，与会人员将无法发送弹幕至后台</span>
                                    </span>
                                    <span class="mdl-list__item-secondary-content">
                                      <a class="mdl-list__item-secondary-action" href="#">
                                          <label id="barrage_label" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                                          <input type="checkbox" id="barrage_switch" class="mdl-switch__input">
                                          <span class="mdl-switch__label"></span>
                                          </label>
                                      </a>
                                    </span>
                                </li>
                                <li class="mdl-list__item mdl-list__item--two-line">
                                    <span class="mdl-list__item-primary-content">
                                        <i class="material-icons mdl-list__item-icon">power_settings_new</i>
                                      <span>启用弹幕审核</span>
                                      <span class="mdl-list__item-sub-title">关闭时，与会人员发送的弹幕将直接显示</span>
                                    </span>
                                    <span class="mdl-list__item-secondary-content">
                                      <a class="mdl-list__item-secondary-action" href="#">
                                          <label id="manual_detect_label" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                                          <input type="checkbox" id="manual_detect_switch" class="mdl-switch__input">
                                          <span class="mdl-switch__label"></span>
                                          </label>
                                      </a>
                                    </span>
                                </li>

                            </ul>
                        </div>

                    </div>
                </div>
            </section>
            <section class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
                <div id="barrage_detect_block" class="mdl-card mdl-cell mdl-cell--12-col" style="display: none;">
                    <div class="mdl-card__supporting-text mdl-grid--no-spacing">
                        <h4 class="mdl-cell mdl-cell--12-col">弹幕审核</h4>

                        <div class="mdl-cell mdl-cell--12-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                            <ul id="barrage_list" class="demo-list-two mdl-list">

                            </ul>
                        </div>
                    </div>
                </div>
            </section>


            <!-- 页面content结束 -->
        </div>

        <div id="upload_block" class="mdl-layout__tab-panel is-active" style="display: none">
            <!-- 页面content开始 -->
            <section class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
                <div class="mdl-card mdl-cell mdl-cell--12-col">
                    <div class="mdl-card__supporting-text mdl-grid--no-spacing">
                        <h4 class="mdl-cell mdl-cell--12-col">文件上传</h4>
                        <!-- 装有一个ul表单的mdl-cell -->
                        <li id="upload_tip_block" class="mdl-list__item mdl-list__item--two-line">
                                    <span class="mdl-list__item-primary-content">
                                        <i class="material-icons mdl-list__item-icon">file_upload</i>
                                      <span>会议文件</span>
                                      <span class="mdl-list__item-sub-title">
                                          幻灯片及其它有关会务文件&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<!--                                        <i id="file-name">当前尚未选择文件</i>-->
                                      </span>
                                    </span>
                            <span class="mdl-list__item-secondary-content">
                                      <a class="mdl-list__item-secondary-action" href="#">
                                         <style>#file { display: none; }</style>
                                        <label class="mdl-button mdl-js-button mdl-button--icon mdl-button--file">
                                          <i class="material-icons">attach_file</i><input type="file" id="file" name="file">
                                        </label>
                                      </a>
                                    </span>
                        </li>
                        </ul>
                    </div>
                    <div class="mdl-card__actions mdl-card--border" style="padding-left: 85%">
                        <button id="demo-show-toast" class="mdl-button mdl-button--colored mdl-button--raised mdl-js-button mdl-js-ripple-effect" type="button"  onclick="upload();">
                            确认上传
                        </button>
                    </div>
                </div>
            </section>

            <section class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
                <div class="mdl-card mdl-cell mdl-cell--12-col">
                    <div class="mdl-card__supporting-text mdl-grid--no-spacing">
                        <h4 class="mdl-cell mdl-cell--12-col">已上传</h4>
                        <!-- 装有一个ul表单的mdl-cell -->
                        <div id="upload_list" class="demo-list-action mdl-list">

                        </div>
                    </div>
                </div>
            </section>


            <!-- 页面content结束 -->
        </div>

        <div id="vote_block" class="mdl-layout__tab-panel is-active" style="display: none;">
            <!-- 页面content开始 -->
            <section class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
                <div class="mdl-card mdl-cell mdl-cell--12-col">
                    <form id="vote_form" action="upload.php" method="POST" onsubmit="return sub_vote();">

                        <div class="mdl-card__supporting-text mdl-grid--no-spacing">
                        <h4 class="mdl-cell mdl-cell--12-col">题目设置</h4>


                        <!-- 装有一个ul表单的mdl-cell -->
                        <div id="vote-list-cell" class="mdl-cell mdl-cell--12-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone">

                        </div>

                    </div>

                        <div class="mdl-card__actions mdl-card--border" >
                        <button id="add-question-btn" class="mdl-button mdl-js-button mdl-button--colored mdl-js-ripple-effect" onclick="addNewQuestion()" type="button" style="margin-left: 73%">
                            添加题目
                        </button>
                        <button id="demo-show-toast" class="mdl-button mdl-button--colored mdl-button--raised mdl-js-button mdl-js-ripple-effect" onclick="sub_vote()" type="button">
                            发起投票
                        </button>
                    </div>

                    </form>

                </div>
            </section>

            <section class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
                <div class="mdl-card mdl-cell mdl-cell--12-col">
                    <div class="mdl-card__supporting-text mdl-grid--no-spacing">
                        <h4 class="mdl-cell mdl-cell--12-col">已发起投票</h4>
                        <!-- 装有一个ul表单的mdl-cell -->
                        <div class="mdl-cell mdl-cell--12-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                            <ul id="vote_list" class="demo-list-two mdl-list">

                            </ul>
                        </div>
                    </div>
                </div>
            </section>


            <!-- 页面content结束 -->
        </div>

        <div id="checkin_block" class="mdl-layout__tab-panel is-active" style="display: none;">
            <!-- 页面content开始 -->
            <section class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
                <div class="mdl-card mdl-cell mdl-cell--12-col">
                    <div class="mdl-card__supporting-text mdl-grid--no-spacing">
                        <h4 class="mdl-cell mdl-cell--12-col">签到选项</h4>
                        <!-- 装有一个ul表单的mdl-cell -->
                        <div class="mdl-cell mdl-cell--12-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                            <ul class="demo-list-two mdl-list">
                                <li class="mdl-list__item mdl-list__item--two-line">
                                <span class="mdl-list__item-primary-content">
                                    <i class="material-icons mdl-list__item-icon">crop_free</i>
                                  <span>二维码签到</span>
                                  <span class="mdl-list__item-sub-title">开启后，参会人员可以通过扫描屏幕上二维码进行签到</span>
                                </span>
                                    <span class="mdl-list__item-secondary-content">
                                  <a class="mdl-list__item-secondary-action" href="#">
                                      <label id="qr_sign_in_label" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                                      <input type="checkbox" id="qr_sign_in_switch" class="mdl-switch__input">
                                      <span class="mdl-switch__label"></span>
                                      </label>
                                  </a>
                                </span>
                                </li>
                                <li class="mdl-list__item mdl-list__item--two-line">
                                <span class="mdl-list__item-primary-content">
                                    <i class="material-icons mdl-list__item-icon">account_circle</i>
                                  <span>个人信息签到</span>
                                  <span class="mdl-list__item-sub-title">开启后，参会人员可通过输入个人信息和手机号进行签到</span>
                                </span>
                                    <span class="mdl-list__item-secondary-content">
                                  <a class="mdl-list__item-secondary-action" href="#">
                                      <label id="personage_sign_in_label" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                                      <input type="checkbox" id="personage_sign_in_switch" class="mdl-switch__input">
                                      <span class="mdl-switch__label"></span>
                                      </label>
                                  </a>
                                </span>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>
            <section class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
                <div class="mdl-card mdl-cell mdl-cell--12-col">
                    <div class="mdl-card__supporting-text mdl-grid--no-spacing">
                        <h4 class="mdl-cell mdl-cell--12-col">签到设置</h4>
                        <!-- 装有一个ul表单的mdl-cell -->
                        <div class="mdl-cell mdl-cell--12-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                            <ul class="demo-list-two mdl-list">
                                <li class="mdl-list__item mdl-list__item--two-line">
                                <span class="mdl-list__item-primary-content">
                                    <i class="material-icons mdl-list__item-icon">crop_free</i>
                                  <span>显示签到二维码</span>
                                  <span class="mdl-list__item-sub-title">开启后，屏幕上显示签到二维码</span>
                                </span>
                                    <span class="mdl-list__item-secondary-content">
                                  <a class="mdl-list__item-secondary-action" href="#">
                                      <label id="display_qr_label" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                                      <input type="checkbox" id="display_qr_switch2" class="mdl-switch__input">
                                      <span class="mdl-switch__label"></span>
                                      </label>
                                  </a>
                                </span>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>
            <!-- 页面content结束 -->
        </div>

        <div id="lottery_block" class="mdl-layout__tab-panel is-active" style="display: none;">
            <!-- 页面content开始 -->
            <section class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
                <div class="mdl-card mdl-cell mdl-cell--12-col">
                    <div class="mdl-card__supporting-text mdl-grid--no-spacing">
                        <h4 class="mdl-cell mdl-cell--12-col">抽奖方式</h4>
                        <!-- 装有一个ul表单的mdl-cell -->
                        <div class="mdl-cell mdl-cell--12-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                            <ul class="demo-list-two mdl-list">
                                <li class="mdl-list__item mdl-list__item--two-line">
                                    <span class="mdl-list__item-primary-content">
                                        <i class="material-icons mdl-list__item-icon">card_giftcard</i>
                                      <span>弹幕关键字抽奖</span>
                                      <span class="mdl-list__item-sub-title">工作人员现场设置关键字，参会者通过发送关键字弹幕参与抽奖</span>
                                    </span>
                                    <span class="mdl-list__item-secondary-content">
                                      <a class="mdl-list__item-secondary-action" href="#">
                                          <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="lottery_function-1">
                                              <input type="radio" id="lottery_function-1" class="mdl-radio__button" name="lottery_function" value="key_word" checked='checked'>
                                          </label>
                                      </a>
                                    </span>

                                </li>
                                <li class="mdl-list__item mdl-list__item--two-line">
                                    <span class="mdl-list__item-primary-content">
                                        <i class="material-icons mdl-list__item-icon">card_giftcard</i>
                                      <span>根据弹幕数量抽奖</span>
                                      <span class="mdl-list__item-sub-title">根据参会者已发送的弹幕数量进行抽奖</span>
                                    </span>
                                    <span class="mdl-list__item-secondary-content">
                                      <a class="mdl-list__item-secondary-action" href="#">
                                          <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="lottery_function-2">
                                              <input type="radio" id="lottery_function-2" class="mdl-radio__button" name="lottery_function" value="barrage_num">
                                          </label>
                                      </a>
                                    </span>
                                </li>
                                <li class="mdl-list__item mdl-list__item--two-line">
                                    <span class="mdl-list__item-primary-content">
                                        <i class="material-icons mdl-list__item-icon">card_giftcard</i>
                                      <span>摇一摇抽奖</span>
                                      <span class="mdl-list__item-sub-title">根据参会者摇一摇次数进行抽奖</span>
                                    </span>
                                    <span class="mdl-list__item-secondary-content">
                                      <a class="mdl-list__item-secondary-action" href="#">
                                          <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="lottery_function-3">
                                              <input type="radio" id="lottery_function-3" class="mdl-radio__button" name="lottery_function" value="shark_it_off">
                                          </label>
                                      </a>
                                    </span>
                                </li>
                                <li class="mdl-list__item mdl-list__item--two-line">
                                    <span class="mdl-list__item-primary-content">
                                        <i class="material-icons mdl-list__item-icon">card_giftcard</i>
                                      <span>拼手速抽奖</span>
                                      <span class="mdl-list__item-sub-title">类似于抢红包的方式进行抽奖</span>
                                    </span>
                                    <span class="mdl-list__item-secondary-content">
                                      <a class="mdl-list__item-secondary-action" href="#">
                                          <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="lottery_function-4">
                                              <input type="radio" id="lottery_function-4" class="mdl-radio__button" name="lottery_function" value="race_to_control">
                                          </label>
                                      </a>
                                    </span>
                                </li>

                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            <section id="lottery-key-word" class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
                <div class="mdl-card mdl-cell mdl-cell--12-col">
                    <div class="mdl-card__supporting-text mdl-grid--no-spacing">
                        <h4 class="mdl-cell mdl-cell--12-col">抽奖关键字</h4>
                        <!-- 装有一个ul表单的mdl-cell -->
                        <div class="mdl-cell mdl-cell--12-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                            <ul class="demo-list-two mdl-list">
                                <li class="mdl-list__item mdl-list__item--two-line">
                                    <span class="mdl-list__item-primary-content">
                                        <i class="material-icons mdl-list__item-icon">card_giftcard</i>
                                      <span>发送弹幕抽奖</span>
                                      <span class="mdl-list__item-sub-title">参会者通过弹幕发送特定关键字参与抽奖</span>
                                    </span>
                                    <span class="mdl-list__item-secondary-content">
                                      <a class="mdl-list__item-secondary-action" href="#">
                                          <label id="barrage_label" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
                                          <input type="radio" name="lottery_range" value="barrage" class="mdl-switch__input">
                                          <span class="mdl-switch__label"></span>
                                          </label>
                                      </a>
                                    </span>
                                </li>

                                <li class="mdl-list__item vote-list--answer">
                                    <span class="mdl-list__item-primary-content">
                                        <i class="material-icons">card_giftcard</i>
                                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="margin-left: 40px;">
                                            <input id="lottery_barrage_content" class="mdl-textfield__input" style="outline:none;" placeholder="请输入抽奖口令" type="text">
                                        </div>
                                    </span>
                                </li>

                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            <section class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
                <div class="mdl-card mdl-cell mdl-cell--12-col">

                    <form id="lottery_form" name="lottery" action="upload.php" method="POST" onsubmit="return sub_lottery();">


                        <div class="mdl-card__supporting-text mdl-grid--no-spacing">
                            <h4 class="mdl-cell mdl-cell--12-col">抽奖设置</h4>
                            <!-- 装有一个ul表单的mdl-cell -->

                            <div id="lottery-list-cell" class="mdl-cell mdl-cell--12-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone">

                            </div>
                        </div>

                        <div class="mdl-card__actions mdl-card--border">
                            <button class="mdl-button mdl-js-button mdl-button--colored mdl-js-ripple-effect" onclick="addNewGrade()" type="button" style="margin-left: 73%">
                                添加等级
                            </button>
                            <button class="mdl-button mdl-button--colored mdl-button--raised mdl-js-button mdl-js-ripple-effect" onclick="sub_lottery()" type="button">
                                发起抽奖
                            </button>
                        </div>

                    </form>


                </div>
            </section>

            <!-- 页面content结束 -->
        </div>


    </main>

</div>

<a target="_blank" id="view-source" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color--primary mdl-color-text--primary-contrast" onclick="openPostWindow('screen.php',openid,room_id,theme)">开启互动墙</a>
</body>
</html>