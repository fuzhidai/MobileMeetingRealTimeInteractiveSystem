<?php
/**
 * Created by PhpStorm.
 * User: dell
 * Date: 2018/3/15
 * Time: 20:36
 */
    include_once(dirname(__FILE__)."/lib/DataBaseModel/mysql.class.php"); //引入查询信息的公共类
    include_once (dirname(__FILE__)."/lib/Config/config.php"); //导入数据库配置文件


    $type = $_GET['type'];
    if ($type == 'getAccessList'){

        $mysqli = new Mysql(SEVER); //创建对象
        $mysqli->haveAccessToDownload($_GET);

    }else if ($type=='download'){

        $mysqli = new Mysql(FILE); //创建对象
        $mysqli->setDownload($_GET);
        $_GET['type'] = 'getAccessList';
        $mysqli = new Mysql(SEVER); //创建对象
        $mysqli->haveAccessToDownload($_GET);

    }else if ($type=='manage'){

        $mysqli = new Mysql(SEVER);
        $mysqli->getDownload($_GET);

    }else if ($type=='update'){

        $mysqli = new Mysql(SEVER);
        $mysqli->setAccessToDownload($_GET);

    }

