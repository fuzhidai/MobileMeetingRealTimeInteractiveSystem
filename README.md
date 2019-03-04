## 概述
基于小程序和WEB的移动会议实时互动系统，最初用于参加比赛，也是自己的第一份系统代码，最后更新日期为2018/4/17，其中有一些API已经被更新，可能无法继续使用，如果要启用此项目需要重新按照官网重写部分API接口，比如登陆时自动获取用户信息的接口等。且后端仅使用PHP socket workerman框架，以及部分组件样式为借鉴网上的相关代码，代码总体理解难度较低，且基本所有代码都已添加注释，适合于初学者学习使用。但因为项目已经完成很久，很多多余文件未来得及进行清理，需进行相关清理。</br>
注：此项目仅用于初学者学习使用，不得用于商业目的。

## 项目界面展示和功能展示请移步
https://blog.csdn.net/qq_40697071/article/details/82704432
https://blog.csdn.net/qq_40697071/article/details/82714426
https://blog.csdn.net/qq_40697071/article/details/82723878

## 功能描述
### 小程序端：
用户：</br>
报名参加相关会议，可在会议列表中查询已开始、进行中和已完成的会议详情，当会议开始时，可在相关页面进行相关的操作，比如：向大屏幕发送弹幕、扫二维码签到、参与答题、参与抽奖、记录笔记、下载预览文件等等。</br>
管理者：</br>
创建会议，管理会议，比如：审核大屏幕弹幕、管理签到方式、管理大屏幕显示内容、发起答题、发起抽奖等等功能。</br>
### WEB端：
管理页面：</br>
同小程序管理端，对大屏幕上展示内容进行控制、审核弹幕内容、上传文件等等。</br>
显示页面：</br>
专用于相关信息的展示，比如：PPT展示、显示弹幕、抽奖、实时展示答题结果等等功能。</br>

## 技术选型
小程序端：WXML + WXSS + JS</br> 
WEB端：HTML + CSS + material-design-lite + JQuery</br>
后端：PHP + workerman</br>
数据库：Mysql</br>
服务器：Linux CentOS</br>

## 项目目录结构

### （一）小程序端目录结构 
#### wx + components(非自写组件)
├─components //相关组件样式文件</br>
│  ├─actionsheet</br>
│  ├─backdrop</br>
│  ├─barcode</br>
│  ├─countdown</br>
│  ├─countup</br>
│  ├─dialog</br>
│  ├─gallery</br>
│  ├─loading</br>
│  ├─picker</br>
│  ├─picker-city</br>
│  ├─prompt</br>
│  ├─qrcode</br>
│  │  └─qr.js</br>
│  │      └─lib</br>
│  ├─rater</br>
│  ├─refresher</br>
│  ├─seats</br>
│  ├─toast</br>
│  ├─toptips</br>
│  └─xnumber</br>
├─pages //小程序主要页面存放</br>
│  ├─barrage </br>弹幕管理页面</br>
│  ├─business_card //名片页面</br>
│  ├─collection //收藏信息页面</br>
│  ├─conference_list //会议列表</br>
│  ├─current_conference //当前会议页面</br>
│  ├─file //上传下载文件页面</br>
│  ├─home_page //主页</br>
│  ├─info_conference //会议信息页面</br>
│  ├─lottery //抽奖页面</br>
│  ├─manage_conference_open //开灯时参与会议页面</br>
│  ├─note //笔记页面</br>
│  ├─photo //拍摄相片页面</br>
│  ├─qr_code //二维码页面</br>
│  ├─register_conference //注册会议页面</br>
│  ├─setting //设置页面</br>
│  ├─sign_in //签到页面</br>
│  ├─sign_in_manage //签到管理页面</br>
│  ├─user_center //用户中心</br>
│  ├─vote_attend //参与投票页面</br>
│  └─vote_manage //投票管理页面</br>

### （二）WEB端目录结构
#### web
│  ajaxfileupload.js //文件上传服务器</br>
│  background2.jpg //背景图片</br>
│  barrage.html //弹幕控制页面</br>
│  bg3.jpg //背景图片</br>
│  default.jpg //默认用户头像</br>
│  default_head.jpg //默认用户头像</br>
│  dialog-polyfill.css </br>
│  dialog-polyfill.js</br>
│  index.php //登陆页面</br>
│  index_cn.html </br>
│  jquery-1.6.1.min.js //JQuery</br>
│  jquery.js</br>
│  lamp.gif</br>
│  lottery.html //抽奖页面</br>
│  lotteryStyle.css //抽奖样式</br>
│  lottery_js.js //抽奖JS控制</br>
│  Luckdraw.js //抽奖过程控制</br>
│  manage.php //管理页面</br>
│  manage_js.js </br>
│  multiprotocol.log</br>
│  ocp.php</br>
│  p.php</br>
│  phpinfo.php</br>
│  p_cn.php</br>
│  screen-control.html //大屏幕控制文件</br>
│  screen.css //大屏幕样式</br>
│  screen.js //大屏幕功能</br>
│  screen.php</br> //大屏幕控制</br>
│  styles.css</br> //样式文件</br>
│  thz.ico //图标</br>
│  thz.jpg </br> //图标</br>
│  upload.html //上传文件页面</br>
│  upload.php//上传文件控制</br>
│  upload_js.js//上传文件控制</br>
│  vote_js.js //投票控制</br>
│  welcome_js.js </br>

### （三）后端目录结构
#### sever
│  apply.php //报名接口</br>
│  barrage.php //弹幕接口</br>
│  collect.php //收藏接口</br>
│  download.php //下载文件接口</br>
│  manage.php //管理接口</br>
│  openid.php //获取小程序的Openid</br>
│  register.php //注册相关信息接口</br>
│  search.php //查询接口</br>
│  signin.php //签到接口</br>
│  upload.php //上传文件接口</br>
│  vote.php //投票接口</br>
│</br>
├─.idea</br>
│  │  misc.xml</br>
│  │  modules.xml</br>
│  │  sever.iml</br>
│  │  workspace.xml</br>
│  │</br>
│  └─inspectionProfiles</br>
├─backup</br>
│      openid.php</br>
│      register.php</br>
│      search.php</br>
│      upload.php</br>
│</br>
├─download//上传文件目录</br>
│</br>
├─lib</br>
│  ├─Config</br>
│  │      config.php</br>
│  │</br>
│  ├─DataBaseModel//数据库相关文件</br>
│  │      connect.class.php//数据库连接</br>
│  │      mysql.class.php//数据库语句执行</br>
│  │      setinfo.class.php//设置相关信息</br>
│  │      sql.class.php//数据库语句</br>
│  │</br>
│  ├─DownloadFileModel//下载文件模块</br>
│  │      file.class.php</br>
│  │</br>
│  ├─GatewayWorker //socket异步框架</br>
│  │  │</br>
│  │  ├─Applications</br>
│  │  │</br>
│  │  └─vendor</br>
│  │      │  autoload.php</br>
│  │      │</br>
│  │      ├─composer</br>
│  │      └─workerman //workerman框架</br>
│  │</br>
│  ├─PublicModel</br>
│  │      openid.class.php</br>
│  │</br>
│  └─UploadFileModel //上传文件接口</br>
│          files.class.php //上传文件</br>
│          photo.class.php //上传图片</br>
│</br>
└─upload //上传文件保存</br>
    ├─barrage //弹幕保存</br>
    ├─cover //封面保存</br>
    ├─file //文件保存</br>
    ├─head //头像保存</br>
    └─logo //logo保存</br>
