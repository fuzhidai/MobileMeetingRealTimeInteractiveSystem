<?php
/**
 * Created by PhpStorm.
 * User: 杨帆
 * Date: 2018/3/3
 * Time: 15:58
 * Function: 用于接收报名信息的接口
 */

    include_once(dirname(__FILE__)."/lib/DataBaseModel/mysql.class.php");
    include_once (dirname(__FILE__)."/lib/Config/config.php"); //导入数据库配置文件


    $mysqli = new Mysql(SEVER); //创建对象
    $mysqli->setState($_GET['state']); //设置操作的状态
    $mysqli->setId($_GET['id']); //设置会议ID
    $mysqli->setOpenid($_GET['openid']); //设置用户openid
    $mysqli->getResult(); //执行操作