<?php
/**
 * Created by PhpStorm.
 * User: dell
 * Date: 2018/2/21
 * Time: 19:27
 */

    if (!empty($_POST)){

        //数据库基本信息
        $host = 'localhost';
        $user = 'root';
        $dbpassword = '';
        $database = 'sever';

        //会议信息
        $openid = $_POST['openid'];
        $name = $_POST['name'];
        $telephone = $_POST['telephone'];
        $wechat = $_POST['wechat'];
        $sponsor = $_POST['sponsor'];
        $contractor = $_POST['contractor'];
        $company_wechat = $_POST['company_wechat'];
        $theme = $_POST['theme'];
        $type = $_POST['type'];
        $password = $_POST['password'];
        $time = $_POST['date'].' '.$_POST['time'];
        if($_POST['place'] == '点击这里选择'){
            $place = '';
        }else{
            $place = $_POST['place'];
        }
        $place_info = $_POST['place_info'];
        $people_num = $_POST['people_num'];
        $start_apply = $_POST['begin_date'].' '.$_POST['begin_time'];
        $over_apply = $_POST['over_date'].' '.$_POST['over_time'];
        $introduction = $_POST['introduction'];
        $property = $_POST['property'];
        $do_type = $_POST['do_type'];

        if (empty($_POST['logo'])){
            $logo = '';
        } else {
            $logo = 'upload/logo/'.$_POST['logo'];
        }

        if (empty($_POST['cover'])) {
            $cover = '';
        } else {
            $cover = 'upload/cover/'.$_POST['cover'];
        }

        //创建连接
        $conn = mysqli_connect($host, $user, $dbpassword, $database);

        //检查链接
        if (!$conn) {
            die('Connection failed: ' . mysqli_connect_error());
        }

        //设置传输编码
        mysqli_query($conn, 'set names utf8');

        //数据插入数据库语句
        if($do_type=='register'){
            $sql = "INSERT INTO `conference_info` (`openid`, `property`, `name`, `telephone`, `wechat`, `sponsor`, `contractor`, `company_wechat`, `theme`, `type`, `password`, `time`, `place`, `place_info`, `people_num`, `start_apply`, `over_apply`, `introduction`, `logo`, `cover`)
                VALUES ('$openid', '$property', '$name', '$telephone', '$wechat', '$sponsor', '$contractor', '$company_wechat', '$theme', '$type', '$password', '$time', '$place', '$place_info', '$people_num', '$start_apply', '$over_apply', '$introduction', '$logo', '$cover')";
        }else if($do_type=='update'){
            $id = $_POST['id'];
            $sql = "UPDATE `conference_info` SET `openid`='$openid', `property`='$property', `name`='$name', `telephone`='$telephone', `wechat`='$wechat', `sponsor`='$sponsor', `contractor`='$contractor', `company_wechat`='$company_wechat', `theme`='$theme', `type`='$type', `password`='$password', `time`='$time', `place`='$place', `place_info`='$place_info', `people_num`='$people_num', `start_apply`='$start_apply', `over_apply`='$over_apply', `introduction`='$introduction', `logo`='$logo', `cover`='$cover'
                WHERE `id`='$id'";
        }

        //插入数据库
        if (mysqli_query($conn, $sql)) {
            echo "数据插入成功";
        } else {
            echo "Error: " . $sql . "<br>" . mysqli_error($conn);
        }

        //关闭数据库连接
        mysqli_close($conn);

    }
