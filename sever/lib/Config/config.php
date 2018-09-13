<?php
/**
 * Created by PhpStorm.
 * User: 杨帆
 * Date: 2018/2/26
 * Time: 21:08
 * Function: 设置相关配置信息
 */

    define("DB_HOST","localhost"); //数据库地址
    define("DB_USERNAME","root"); //数据库用户名
    define("DB_PASSWORD","root"); //数据库密码
    define("SEVER","sever"); //会议信息数据库
    define("SIGN_IN","sign_in"); //会议签到信息表
    define("VOTE","vote"); //会议投票表
    define("LOTTERY","lottery"); //会议抽奖表
    define("NOTE","note"); //会议笔记表
    define("FILE","file"); //会议文件表
    define("BARRAGE","barrage"); //会议弹幕表
    define("COLLECTION","collection"); //用户收藏信息表
    define("OPINION","opinion"); //用户反馈意见
    define("APPID","wxbdd3313b6f29aa15"); //appid
    define("SECRET","714d9979ee7b59d9bb3e510c12871756"); //secret密钥
    define("CONFERENCE_TABLE","conference_table"); //数据库会议基本信息表
    define("CREATE_TABLE","create_table"); //数据库创建会议列表
    define("ATTEND_TABLE","attend_table"); //数据库参加会议列表
    define("CONFERENCE_MANAGE","conference_manage"); //数据库会议签到类型表
    define("DEFAULT_COVER","http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg"); //默认会议封面地址