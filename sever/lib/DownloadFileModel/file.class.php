<?php
/**
 * Created by PhpStorm.
 * User: 杨帆
 * Date: 2018/3/19
 * Time: 15:58
 * Function: 用户下载文件接口
 */
    class File {

        //下载指定文件的方法
        public function downDetails($file_path){
            header("Content-type:text/html;charset=utf-8");
            //$file_path="testMe.txt";
            //用以解决中文不能显示出来的问题
            //$file_name=iconv("utf-8","gb2312",$file_name);
            //$file_sub_path=$_SERVER['DOCUMENT_ROOT']."marcofly/phpstudy/down/down/";
            //$file_path=$file_sub_path.$file_name;

            //首先要判断给定的文件存在与否
            if(!file_exists($file_path)){
                echo "没有该文件文件";
                return ;
            }
            $fp=fopen($file_path,"r");
            $file_size=filesize($file_path);
            //下载文件需要用到的头
            Header("Content-type: application/octet-stream");
            Header("Accept-Ranges: bytes");
            Header("Accept-Length:".$file_size);
            Header("Content-Disposition: attachment; filename=".$file_path);
            $buffer=1024;
            $file_count=0;
            //向前端返回数据
            while(!feof($fp) && $file_count<$file_size){
                $file_con=fread($fp,$buffer);
                $file_count+=$buffer;
                echo $file_con;
            }
            fclose($fp);
        }

}