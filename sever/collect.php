<?php
/**
 * Created by PhpStorm.
 * User: 杨帆
 * Date: 2018/3/23
 * Time: 11:03
 * Function: 用于接收用户收藏信息的接口
 */

    include_once(dirname(__FILE__)."/lib/DataBaseModel/mysql.class.php"); //引入查询信息的公共类
    include_once (dirname(__FILE__)."/lib/Config/config.php"); //导入数据库配置文件

    $mysqli = new Mysql(SEVER);
    $type = $_GET['type'];

    if ($type=='note' || $type=='file' || $type=='conference' || $type=='card' || $type=='info' || $type=='lottery'){

        $mysqli->collect($_GET);

    }else if ($type=='get_note' || $type=='get_file' || $type=='get_conference' || $type=='get_info' || $type=='get_card' || $type=='get_lottery'){

        $mysqli->getCollection($_GET);

    }

