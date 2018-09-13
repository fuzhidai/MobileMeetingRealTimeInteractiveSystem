<?php
/**
 * Created by PhpStorm.
 * User: 杨帆
 * Date: 2018/3/20
 * Time: 12:58
 * Function: 用户发送弹幕信息接口
 */

    include_once(dirname(__FILE__)."/lib/DataBaseModel/mysql.class.php"); //引入查询信息的公共类
    include_once (dirname(__FILE__)."/lib/Config/config.php"); //导入数据库配置文件

    $mysqli = new Mysql(BARRAGE); //创建对象
    $mysqli->barrage($_GET);
