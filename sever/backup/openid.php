<?php
/**
 * Created by PhpStorm.
 * User: dell
 * Date: 2018/2/23
 * Time: 9:32
 */
    $appid = 'wxbdd3313b6f29aa15';
    $secret = '714d9979ee7b59d9bb3e510c12871756';

    //1、使用isset()函数检测客户端是否有传递code参数
    if(isset($_GET['code'])){

        $code = $_GET['code'];
        //2、使用 curl_init()函数初始化一个CURL会话，初始化成功后返回一个句柄供curl_setopt(), curl_exec(),和 curl_close() 函数使用
        $curl = curl_init();
        //使用curl_setopt()设置要获取的URL地址
        $url='https://api.weixin.qq.com/sns/jscode2session?appid='.$appid.'&secret='.$secret.'&js_code='.$code.'&grant_type=authorization_code';
        curl_setopt($curl, CURLOPT_URL, $url);
        //4、设置是否输出header
        curl_setopt($curl, CURLOPT_HEADER, 0);
        //5、设置是否输出结果
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 0);
        //6、设置是否输出结果
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 0);
        //7、设置是否检查服务器端的证书
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        //8、使用curl_exec()将CURL返回的结果转换成正常数据并保存到一个变量
        $data = curl_exec($curl);
        //9、使用 curl_close() 关闭CURL会话
        curl_close($curl);

    }
