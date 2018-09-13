<?php
/**
 * Created by PhpStorm.
 * User: dell
 * Date: 2018/2/23
 * Time: 0:08
 */

    //接收并保存logo相关信息
    if (!empty($_FILES['logo'])){

        $last = strrpos($_FILES['logo']['name'], '.'); //获取 . 的位置
        $suffix = substr($_FILES['logo']['name'], $last); //获得后缀名
        $arr = array('.png','.png','.gif'); //设置合法后缀名集合
        $path = urldecode($_POST['path']); //获得前端给定的UID地址
        $old_path = urldecode($_POST['old_path']); //原图片地址

        //删除原图片文件
        if (!empty($old_path)){
            unlink($old_path);
        }

//        $conn = mysqli_connect('localhost', 'root', '', 'webchat');
//        mysqli_query($conn, 'set names utf8');
//        $sql = "INSERT INTO `userinfo` (`nickname`, `username`, `password`, `profile`) VALUES ('$path', '11111', '1111', '1111')";
//        mysqli_query($conn, $sql);

        if (!in_array($suffix, $arr)){
            exit('文件的格式错误');
        }
        if ($_FILES['logo']['size'] > 1024*1024){
            exit('文件过大');
        }
        $path = 'upload/logo/'.$path; //设置保存地址名
        move_uploaded_file($_FILES['logo']['tmp_name'], $path); //将文件从临时保存地址移动至保存的文件夹

    }
    //接收并保存cover相关信息
    if (!empty($_FILES['cover'])){

        $last = strrpos($_FILES['cover']['name'], '.'); //获取 . 的位置
        $suffix = substr($_FILES['cover']['name'], $last); //获得后缀名
        $arr = array('.png','.png','.gif'); //设置合法后缀名集合
        $path = urldecode($_POST['path']); //获得前端给定的UID地址
        $old_path = urldecode($_POST['old_path']);//原图片地址

        //删除原图片文件
        if (!empty($old_path)){
            unlink($old_path);
        }

        if (!in_array($suffix, $arr)){
            exit('文件的格式错误');
        }
        if ($_FILES['cover']['size'] > 1024*1024){
            exit('文件过大');
        }
        $path = 'upload/cover/'.$path; ////设置保存地址名
        move_uploaded_file($_FILES['cover']['tmp_name'], $path); //将文件从临时保存地址移动至保存的文件夹

    }