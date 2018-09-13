<?php
/**
 * Created by PhpStorm.
 * User: 杨帆
 * Date: 2018/2/26
 * Time: 20:58
 * Function: 连接数据库、执行数据库语句的公共模型
 */
    include_once (dirname(__FILE__)."/../Config/config.php"); //导入数据库配置文件

    class Connect{
        protected $mysqli; //数据库链接

        //构造方法
        public function __construct($dbname){

            //连接数据库
            $this->mysqli = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD,$dbname);

            //连接失败
            if(mysqli_connect_error()){
                echo "连接失败，原因为：".mysqli_connect_error();
                $this->mysqli = FALSE;
                exit(); //退出
            }

            //设置数据传递的格式
            mysqli_set_charset($this->mysqli,"utf8");
        }

        //外部获取数据库连接
        function getConnect(){
            return $this->mysqli;
        }



        public function __destruct(){
            mysqli_close($this->mysqli); //关闭数据库链接
        }

    }