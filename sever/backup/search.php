<?php
/**
 * Created by PhpStorm.
 * User: dell
 * Date: 2018/2/23
 * Time: 15:58
 */

        if (!empty($_GET)){
            //数据库基本信息
            $host = 'localhost';
            $user = 'root';
            $password = '';
            $database = 'sever';

            //获取openid和会议属性
            $property = $_GET['property'];
            $state = $_GET['state'];

            //创建连接
            $conn = mysqli_connect($host, $user, $password, $database);

            //检查链接
            if (!$conn) {
                die('Connection failed: ' . mysqli_connect_error());
            }

            //设置传输编码
            mysqli_query($conn, 'set names utf8');

            //查询数据语句
            if($state == 'finish'){
                $openid = $_GET['openid'];
                $sql = "SELECT * from `conference_info` WHERE `openid`='$openid' AND `property`='create' AND DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i')>`time` ORDER BY `time` ASC";
            }else if($state == 'prepare') {
                $openid = $_GET['openid'];
                $sql = "SELECT * from `conference_info` WHERE `openid`='$openid' AND `property`='create' AND DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i')<`time` ORDER BY `time` ASC";
            }else if($state == 'record') {
                $id = $_GET['id'];
                $sql = "SELECT * from `conference_info` WHERE `id`=$id";
                $result = mysqli_query($conn, $sql);
                $res = mysqli_fetch_assoc($result);
                print_r(json_encode($res));
                exit();
            }

            //插入数据库
            if ($result = mysqli_query($conn, $sql)) {

            } else {
                echo "Error: " . $sql . "<br>" . mysqli_error($conn);
            }

            //创建一个保存数据的数组
            $list = array();

            //创建临时数组保存每一条数据
            $temp = array(
                'id' => '',
                'theme' => '',
                'time' => '',
                'place' => ''
            );

            //获取查询数据库后的结果集并转换为数组
            while($res = mysqli_fetch_assoc($result)){
                $temp['id'] = $res['id'];
                $temp['theme'] = $res['theme'];
                $temp['time'] = $res['time'];
                $temp['place'] = $res['place'];
                $list[] = $temp;
            }

            print_r(json_encode($list));

            //关闭数据库连接
            mysqli_close($conn);

        }
