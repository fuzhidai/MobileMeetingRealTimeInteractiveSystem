<?php
/**
 * Created by PhpStorm.
 * User: 杨帆
 * Date: 2018/2/27
 * Time: 17:39
 * Function: 执行数据库语句、处理执行后的数据库的结果集
 */

    include_once (dirname(__FILE__)."/../DataBaseModel/sql.class.php"); //引入数据库语句公共类
    include_once (dirname(__FILE__)."/../Config/config.php"); //导入数据库配置文件

    class Mysql extends Sql {

        public function __construct($dbname)
        {
            parent::__construct($dbname);
        }

        //执行数据库语句
        public function execute($conn,$sql){
            return $this->res = mysqli_query($conn,$sql);
        }

        //将查询到的会议ID保存至数组中返回
        public function getId($result){
            $list = array();

            while ($res = mysqli_fetch_assoc($result)){
                $list[] = $res['conference_id'];
            }

            return $list;
        }

        //注册会议（post为前端传来数据）
        public function register($post){
            $conn = $this->getConnect(); //获取数据库的链接

            $this->setInfo($post); //设置会议的相关信息
            $this->setOpenid($post['openid']);

            $sql = $this->registerSql()[0]; //获取填入会议信息语句
            $this->execute($conn,$sql); //执行相关的数据库语句

            $id = mysqli_insert_id($conn); //将会议信息插入表中
            $this->setId($id); //保存会议ID

            $sql = $this->signInTypeTableSql()[1]; //创建当前会议的管理信息
            $this->execute($conn, $sql);//执行相关语句

            $sql = $this->registerSql()[1]; //将创建者信息保存至新表中
            $this->execute($conn,$sql); //执行相关的数据库语句

        }

        public function verify($post){

            $conn = $this->getConnect(); //获取数据库的链接
            $this->setId($post['id']); //保存用户输入会议ID
            $sql = $this->recordSql(); //获取查询会议详细信息的数据库语句
            $result = $this->execute($conn,$sql); //执行相关的数据库语句，并保存其结果集
            $res = mysqli_fetch_assoc($result); //将结果集转化为PHP数组

            if ($res['manage_password'] == md5($post['manage_password'])){ //将前端传来的管理进行md5加密后与数据库中保存的加密后的管理密码相比较
                $sql = $this->createByIdSql(); //获取根据会议ID查询用户创建的会议列表
                $info = $this->execute($conn,$sql); //执行查询操作并将保存其结果集
                $info = mysqli_fetch_assoc($info); //将结果集转化为PHP数组
                $info = array( //将此会议的信息进行包装
                  'id'=>$res['id'], //会议ID
                  'theme'=>$res['theme'], //会议主题
                  'openid'=>$info['openid'], //管理者的openid
                  'nickName'=> $info['nickName'], //管理者的昵称
                  'avatarUrl'=> $info['avatarUrl'], //管理者的头像地址
                );
                print_r(json_encode($info)); //将此信息集传输至前端
            } else {
                print_r('false'); //如果管理密码匹配失败则返回 false
            }

        }

        //更新会议（post为前端传来数据）
        public function update($post){

            $conn = $this->getConnect(); //获取数据库的链接

            $this->setInfo($post); //设置会议的相关信息
            $this->setId($post['id']); //保存会议ID
            $this->setOpenid($post['openid']); //获取用户的Openid

            if ($post['state']=='finish'){

                $this->setState($post['state']);
                $sql = $this->updateSql()[0]; //获取更新数据的数据库语句


            }else if ($post['state']=='prepare'){

                $sql = $this->updateSql()[1]; //获取更新数据的数据库语句

            }

            $this->execute($conn,$sql); //执行相关的数据库语句

        }

        //按时间将数组排序方法
        public function timeSort($list){

            $time_data = array(); //创建新的数组
            foreach($list as $key => $value){
                $time_data[] = $value["time"];

            }
            array_multisort($time_data, SORT_ASC,$list); //根据List中的time_data键值来进行排序
            return $list; //将排序后的数组返回

        }

        //获取结果集
        public function getResult(){

            //状态为已完成、未开始、全部会议
            if ($this->state=='finish' || $this->state=='prepare' || $this->state=='all'){

                if ($this->property=='create'){ //属性为创建

                    $sql = $this->createSql(); //获取用户创建会议列表

                }else if ($this->property=='attend'){ //属性为参加

                    $sql = $this->attendSql(); //获取用户参加会议列表

                }else if ($this->property=='recent' || $this->property=='start'){ //属性为近期的会议或即将开始的会议

                    $sql = $this->recentSql(); //获取用户最近会议列表

                }

                $result = $this->execute($this->getConnect(),$sql); //执行相关的数据库语句并保存结果集
                $Id_list = $this->getId($result); //保存用户会议的序号组
                $list = array(); //创建临时数组用来储存已完成会议列表

                for ($i = 0; $i < sizeof($Id_list); $i++) { //通过循环来遍历用户的会议列表

                    $this->setId($Id_list[$i]); //将会议ID保存

                    if ($this->state=='finish'){ //状态为已完成

                        if ($this->property=='create' || $this->property=='attend'){ //属性为创建或参加

                            $sql = $this->finishSql(); //获取已完成会议列表的数据库语句

                        }else if ($this->property=='recent'){ //状态为近期

                            $sql = $this->recentFinishSql(); //获取已经完成的一周之内的会议列表的数据库语句

                        }else if ($this->property=='start'){ //状态为即将开始

                            $sql = $this->startFinishSql(); //获取已开始12个小时之内的会议列表的数据库语句

                        }

                    }else if ($this->state=='prepare'){

                        if ($this->property=='create' || $this->property=='attend'){

                            $sql = $this->prepareSql(); //获取未开始会议列表的数据库语句

                        }else if ($this->property=='recent'){

                            $sql = $this->recentPrepareSql(); //获取未开始的一周之内的会议列表的数据库语句

                        }else if ($this->property=='start'){

                            $sql = $this->startPrepareSql(); //获取未开始的一天之内的会议列表的数据库语句

                        }

                    }else if ($this->state=='all'){

                        if ($this->property=='create' || $this->property=='attend'){

                            $sql = $this->allSql()[0]; //获取当前状态的全部会议

                        }else if ($this->property=='recent'){

                            $sql = $this->allSql()[1]; //获取一周之内的会议列表的数据库语句

                        }else if ($this->property=='start'){

                            $sql = $this->allSql()[2]; //获取一天之内的会议列表的数据库语句

                        }


                    }

                    $result = $this->execute($this->getConnect(),$sql); //执行相关数据库语句，并保存结果集
                    $temp = array(); //创建临时数组

                    if (!empty($res = mysqli_fetch_assoc($result))){ //如果结果集不为空

//                        if ($this->property=='recent' || $this->property=='start'){
                            $sql = $this->ifApplySql(); //获取是否已报名此会议数据库语句
                            $temp_result = $this->execute($this->getConnect(),$sql); //执行相关数据库语句
                            $temp_res = mysqli_fetch_assoc($temp_result); //将结果集转化为数组
                            if (empty($temp_res)){
                                $temp['attend'] = 'false'; //如果查询结果为空，则为创建会议
                            }else{
                                $temp['attend'] = 'true'; //如果结果不为空，则为参加会议
                            }
//                        }

                        $temp['id'] = $res['id']; //保存会议ID
                        $temp['state'] = $res['state']; //保存会议状态（prepare未开始或已结束、finish已结束）
                        $temp['theme'] = $res['theme']; //保存会议主题
                        $temp['time'] = $res['time']; //保存会议时间
                        $temp['place'] = $res['place']; //保存会议地点
                        $temp['place_info'] = $res['place_info']; //保存会议详细地点

                        $list[] = $temp; //将临时数组填入已完成会议列表
                    }

                }

                $list = $this->timeSort($list); //根据创建时间进行排序
                print_r(json_encode($list)); //将已完成列表打印传递给前端
                return $list;

            } else if ($this->state=='record'){ //如果操作类型为详细记录

                $conn = $this->getConnect(); //获取数据库连接
                $sql = $this->recordSql(); //查询该会议的详细信息
                $result = $this->execute($conn,$sql); //执行相关的数据库语句并保存结果集
                $res = mysqli_fetch_assoc($result); //将结果转化为数组
                print_r(json_encode($res)); //以json传递给前端

            } else if ($this->state=='theme' || $this->state=='time' || $this->state=='place' || $this->state=='id'){ //如果操作类型为查询

                if($this->state == 'theme') { //按主题查找会议信息

                    $sql = $this->themeSql(); //获取相关数据库语句

                }else if($this->state == 'time') { //按时间查找会议信息

                    $sql = $this->timeSql(); //获取相关数据库语句

                }else if($this->state == 'place') { //按地点来查找会议信息

                    $sql = $this->placeSql(); //获取相关数据库语句

                }else if($this->state == 'id') { //按ID来查找会议信息

                    $this->setId($this->search_info);
                    $sql = $this->recordSql(); //获取相关的数据库语句

                }

                $result = $this->execute($this->getConnect(),$sql); //执行相关的数据库语句并保存结果集
                $list = array(); //创建临时数组来储存已完成会议列表
                $temp = array(); //创建临时数组来储存暂时获取到的会议信息

                //依次将每一行数据库结果转化为数组
                while ($res = mysqli_fetch_assoc($result)){

                    $temp['id'] = $res['id']; //保存会议ID
                    $temp['state'] = $res['state']; //保存会议状态（prepare未开始或已结束、finish已结束）
                    $temp['theme'] = $res['theme']; //保存会议主题
                    $temp['time'] = $res['time']; //保存会议时间
                    $temp['place'] = $res['place']; //保存会议地点
                    $temp['place_info'] = $res['place_info']; //保存会议详细地点

                    $list[] = $temp; //将本条数据插入会议信息总数组
                }

                print_r(json_encode($list)); //以json传递给前端

            }else if ($this->state=='apply'){

                $sql = $this->applySql(); //获取报名会议数据库语句
                $this->execute($this->getConnect(),$sql); //执行相关数据库语句

            }else if ($this->state=='ifapply'){

                $sql = $this->ifApplySql(); //获取是否已报名此会议数据库语句
                $conn = $this->getConnect();
                $result = $this->execute($conn,$sql); //执行相关数据库语句
                $res = mysqli_fetch_assoc($result); //将结果集转化为数组
                if (empty($res)){
                    $res = 'null'; //如果查询结果为空，返回null
                }
                print_r(json_encode($res)); //以json传递给前端

            }else if ($this->state=='recommend'){

                $sql = $this->attendSql(); //获取参加过的会议列表
                $conn = $this->getConnect();
                $result = $this->execute($conn,$sql); //执行相关的数据库语句并保存结果集
                $Id_list = $this->getId($result); //保存用户会议的序号组

                $list = array(); //创建临时数组用来储存已完成会议列表
                $len  = sizeof($Id_list);

                for ($i = 0; $i < $len; ++$i) { //通过循环来遍历用户的会议列表

                    $this->setId($Id_list[$i]); //将会议ID保存
                    $sql = $this->recordSql(); //获取会议的详细信息
                    $result = $this->execute($conn,$sql); //执行相关数据库语句，并保存结果集
                    $res = mysqli_fetch_assoc($result); //将结果集转化为数组
                    $flag = false; //设置标记
                    foreach ($list as $key=>$value){ //遍历用户参加过的会议

                        if ($key==$res['type']){ //如果找到同类型会议
                            $flag = true; //设置标记
                            break; //退出循环
                        }

                    }
                    if ($flag==false){ //添加新的类型的会议
                        $list[$res['type']] = 1; //设置频率为1
                    }else{ //若为之前存在的会议类型
                        $list[$res['type']]++; //之前存在的会议类型频率加一
                    }

                }

                $type = ''; //设置频率最高的会议类型
                $count = 0; //设置会议类型的最高频率

                foreach ($list as $key=>$value){ //遍历用户参与过的会议类型频率表

                    if ($value > $count){ //如果此会议类型的频率大于之前会议类型的频率
                        $type = $key; //频率最高的会议类型设置为当前会议类型
                        $count = $value; //频率设置为此会议类型频率
                    }

                }

                $this->setSearch($type); //设置查询类型
                $sql = $this->typeSql(); //获取按会议类型查询的语句
                $result = $this->execute($conn,$sql); //执行相关的数据库语句并保存结果集

                $list = array(); //创建临时数组来储存已完成会议列表
                $temp = array(); //创建临时数组来储存暂时获取到的会议信息

                //依次将每一行数据库结果转化为数组
                while ($res = mysqli_fetch_assoc($result)){

                    $this->setId($res['id']); //设置会议ID
                    $sql = $this->ifMatterSql(); //获取查询此会议是否为用户参加或创建的数据库语句
                    $temp_result = $this->execute($this->getConnect(),$sql); //执行相关的数据库语句并保存结果集
                    $temp_res = mysqli_fetch_assoc($temp_result); //将结果集转化为数组

                    //如果结果集为空则此会议不是该用户参加或创建
                    if (empty($temp_res)){

                        $temp['id'] = $res['id']; //保存会议ID
                        $temp['state'] = $res['state']; //保存会议状态（prepare未开始或已结束、finish已结束）
                        $temp['theme'] = $res['theme']; //保存会议主题
                        $temp['time'] = $res['time']; //保存会议时间
                        $temp['introduction'] = $res['introduction']; //保存会议介绍
                        $temp['place'] = $res['place']; //保存会议地点
                        $temp['place_info'] = $res['place_info']; //保存会议详细地点
                        $temp['apply'] = $res['apply']; //保存是否允许报名状态
                        $temp['password'] = $res['password']; //保存会议密码

                        if (empty($res['cover'])){ //如果用户未设置封面信息

                            $temp['cover'] = DEFAULT_COVER; //保存会议默认封面

                        }else {
                            $temp['cover'] = $res['cover']; //保存会议封面
                        }


                        $list[] = $temp; //将本条数据插入会议信息总数组

                    }

                }

                $i = 0; //设置循环初始值
                $temp = null;  //将数组初始化
                while (!empty($list[$i]) && $i<3){ //循环当前三个元素都不为空且列表中会议数量小于3时循环
                    $temp[] = $list[$i]; //将元素复制到新的数组
                    $i++; //序号自增
                }
                print_r(json_encode($temp)); //将已完成列表打印传递给前端

            }else if ($this->state=='new'){

                $sql = $this->newSql(); //获取最新会议
                $conn = $this->getConnect(); //获取数据库连接
                $result = $this->execute($conn,$sql); //执行相关的数据库语句并保存结果集
                $list = array(); //创建临时数组来储存已完成会议列表
                $temp = array(); //创建临时数组来储存暂时获取到的会议信息

                //依次将每一行数据库结果转化为数组
                while ($res = mysqli_fetch_assoc($result)){

                    $sql = $this->ifMatterSql($res['id']); //获取查询此会议是否为用户参加或创建的数据库语句
                    $temp_result = $this->execute($this->getConnect(),$sql); //执行相关的数据库语句并保存结果集
                    $temp_res = mysqli_fetch_assoc($temp_result); //将结果集转化为数组

                    //如果结果集为空则此会议不是该用户参加或创建
                    if (empty($temp_res)){

                        $temp['id'] = $res['id']; //保存会议ID
                        $temp['state'] = $res['state']; //保存会议状态（prepare未开始或已结束、finish已结束）
                        $temp['theme'] = $res['theme']; //保存会议主题
                        $temp['time'] = $res['time']; //保存会议时间
                        $temp['introduction'] = $res['introduction']; //保存会议介绍
                        $temp['place'] = $res['place']; //保存会议地点
                        $temp['place_info'] = $res['place_info']; //保存会议详细地点
                        $temp['cover'] = DEFAULT_COVER; //保存会议封面
                        $temp['apply'] = $res['apply']; //保存是否允许报名状态
                        $temp['password'] = $res['password']; //保存会议密码

                        $list[] = $temp; //将本条数据插入会议信息总数组

                    }

                }

                $i = 0; //设置循环初始值
                $temp = null;  //将数组初始化
                while (!empty($list[$i]) && $i<30){ //循环当当前元素都不为空且列表中会议数量小于三十时循环
                    $temp[] = $list[$i]; //将元素复制到新的数组
                    $i++; //序号自增
                }
                print_r(json_encode($temp)); //将已完成列表打印传递给前端

            }

        }

        //创建签到表
        public function setSignInTable($get){

            $this->setId($get['id']); //获取会议的id
            $this->setType($get['type']); //获取开启或关闭的签到类型
            $this->setState($get['state']); //更新签到状态（开启或关闭）

            $conn = $this->getConnect(); //获取数据库连接

            if ($this->state == true){ //如果更新的签到状态为开启

                $sql = $this->signInTableSql(); //获取在数据库中创建会议签到信息登记表单的语句
                $this->execute($conn, $sql); //执行数据语句

                $sql = $this->signInTypeTableSql()[2];//创建当前会议的管理表单
                $this->execute($conn, $sql); //执行数据库语句

            }


        }

        //插入签到数据（get为前端传递数据）
        public function signIn($get){

            $conn = $this->getConnect(); //获取当数据库连接
            $this->setState($get['state']); //保存操作的方式

            if ($this->state=='make_sure'){ //确认数据

                $this->setId($get['id']); //保存当前会议ID

                if ($this->property=='create'){ //如果属性为创建

                    $sql = $this->signInTypeTableSql()[0]; //获取当前会议管理信息
                    $result = $this->execute($conn, $sql); //执行数据库语句
                    $res = mysqli_fetch_assoc($result); //将结果集转化为PHP数组
                    return $res; //将结果返回

                }else if ($this->property=='attend'){ //如果状态为参加

                    $this->setOpenid($get['openid']); //保存用户openid
                    $sql = $this->signInSql()[0]; //查询用户是否已经签到
                    $result = $this->execute($conn, $sql); //执行数据库语句获得结果集
                    $res  = mysqli_fetch_assoc($result); //将结果集转化为PHP数组
                    if (empty($res)){ //如果结果集为空，则该用户未未签到

                        return 'false';

                    }else {

                        return 'true';

                    }

                }

            }else if ($this->state=='sign_in'){ //如果操作状态为签到

                $this->setSignInInfo($get); //保存用的签到信息
                $sql = $this->signInSql()[1]; //获取插入信息的数据库语句
                $this->execute($conn, $sql); //执行数据库语句插入数据

            }

        }

        //PHP stdClass Object转array
        public function object_array($array) {
            if(is_object($array)) {
                $array = (array)$array;
            } else if(is_array($array)) {
                foreach($array as $key=>$value) {
                    $array[$key] = object_array($value);
                }
            }
            return $array;
        }

        //会议投票问题及答案的存储
        public function setVote($get){

            $this->setId($get['id']); //保存当前会议的ID
            $conn = $this->getConnect(); //获取数据库连接
            $sql = $this->signInTypeTableSql()[0]; //查找次会议的管理信息记录
            $result = $this->execute($conn,$sql); //执行当前语句并获取结果集
            $res = mysqli_fetch_assoc($result); //将结果集化为PHP数组

            //如果下标信息不为空('null')，则为查询投票详细信息
            if (sizeof($get['index'])!=0 && $get['index']!='null'){

                $index = $get['index']; //用变量保存投票数据的下标
                $vote_list = json_decode($res['vote'], JSON_UNESCAPED_UNICODE); //对数据库取出的信息进行UNICODE解码转化为PHP数组
                print_r(json_encode($vote_list[$index])); //查询后的对应该下标的投票信息并JSON编码后传至前端
                return;

            }

            //如果前端传来的信息中投票信息不为空进行投票数据插入操作
            if (!empty($get['vote'])){

                //如果这是第一条投票信息
                if ($res['vote']=='null'){

                    if ($get['from']=='wx'){ //如果此信息来自于小程序
                        $temp = array(json_decode($get['vote'])); //设置临时数组保存前端传来的投票信息并进行JSON解码转化为PHP数组并存入一个总数组
                    }else{ //否则信息来自于网页
                        $temp = array($get['vote']); //不进行解码直接保存数组中
                    }

                    $temp = json_encode($temp, JSON_UNESCAPED_UNICODE); //将数组进行UNICODE编码转化为JSON数组

                    print_r(json_encode($get['vote'], JSON_UNESCAPED_UNICODE)); //将此信息传输给前端

                    $this->setContent($temp); //保存投票信息
                    $sql = $this->setVoteSql(); //执行插入投票信息语句
                    $this->execute($conn,$sql); //执行数据库语句

                    $temp_db = new Mysql(VOTE); //连接VOTE数据库
                    $temp_db->setVoteTable($get); //创建该会议的投票表

                }else{ //不是第一条投票信息

                    $vote_list = json_decode($res['vote'], JSON_UNESCAPED_UNICODE); //对数据库取出的信息进行UNICODE解码转化为PHP数组

                    $temp = array(); //创建临时数组保存前端传来的数据

                    if ($get['from']=='wx'){ //如果信息来自于微信

                        for ($i=0; $i<sizeof(json_decode($get['vote'])); ++$i){ //通过循环将前端数据转化为PHP类
                            $temp[] = $this->object_array(json_decode($get['vote'])[$i]); //将PHP类转化为PHP数组
                        }

                    }else { //否则信息来自于网页

                        $temp = $get['vote']; //将该投票信息保存

                    }



                    $vote_list[] = $temp; //将此次投票信息存入总的投票信息列表
                    print_r(json_encode($get['vote'], JSON_UNESCAPED_UNICODE)); //将投票列表解码后传输至前端

                    $vote_list = json_encode($vote_list,JSON_UNESCAPED_UNICODE); //对总的投票信息进行JSON UNICODE编码
                    $this->setContent($vote_list); //保存新的投票列表的内容
                    $sql = $this->setVoteSql(); //获取数据库插入数据语句
                    $this->execute($conn,$sql); //执行当前语句

                }

            }else{

                print_r($res['vote']); //输出发起过的投票
                return $res['vote']; //将投票列表返回

            }

        }

        //抽奖信息的存储
        public function setLottery($get){

            $this->setId($get['id']); //保存当前会议的ID
            $conn = $this->getConnect(); //获取数据库连接
            $sql = $this->signInTypeTableSql()[0]; //查找次会议的管理信息记录
            $result = $this->execute($conn,$sql); //执行当前语句并获取结果集
            $res = mysqli_fetch_assoc($result); //将结果集化为PHP数组

            //如果下标信息不为空('null')，则为查询投票详细信息
            if (sizeof($get['index'])!=0 && $get['index']!='null'){

                $index = $get['index']; //用变量保存投票数据的下标
                $lottery_list = json_decode($res['lottery'], JSON_UNESCAPED_UNICODE); //对数据库取出的信息进行UNICODE解码转化为PHP数组
                print_r(json_encode($lottery_list[$index])); //查询后的对应该下标的投票信息并JSON编码后传至前端
                return;

            }

            //如果前端传来的信息中投票信息不为空进行投票数据插入操作
            if (!empty($get['lottery'])){

                //如果这是第一条投票信息
                if ($res['lottery']=='null'){

                    if ($get['from']=='wx'){ //如果此信息来自于小程序
                        $temp = array(json_decode($get['lottery'])); //设置临时数组保存前端传来的投票信息并进行JSON解码转化为PHP数组并存入一个总数组
                    }else{ //否则信息来自于网页
                        $temp = array($get['lottery']); //不进行解码直接保存数组中
                    }

                    $temp = json_encode($temp, JSON_UNESCAPED_UNICODE); //将数组进行UNICODE编码转化为JSON数组

                    print_r(json_encode($get['lottery'], JSON_UNESCAPED_UNICODE)); //将此信息传输给前端

                    $this->setContent($temp); //保存投票信息
                    $sql = $this->setLotterySql(); //执行插入投票信息语句
                    $this->execute($conn,$sql); //执行数据库语句

                    $temp_db = new Mysql(LOTTERY); //连接VOTE数据库
                    $temp_db->setLotteryTable($get); //创建该会议的投票表

                }else{ //不是第一条投票信息

                    $lottery_list = json_decode($res['lottery'], JSON_UNESCAPED_UNICODE); //对数据库取出的信息进行UNICODE解码转化为PHP数组

                    $temp = array(); //创建临时数组保存前端传来的数据

                    if ($get['from']=='wx'){ //如果信息来自于微信

                        for ($i=0; $i<sizeof(json_decode($get['lottery'])); ++$i){ //通过循环将前端数据转化为PHP类
                            $temp[] = $this->object_array(json_decode($get['lottery'])[$i]); //将PHP类转化为PHP数组
                        }

                    }else { //否则信息来自于网页

                        $temp = $get['lottery']; //将该投票信息保存

                    }

                    $lottery_list[] = $temp; //将此次投票信息存入总的投票信息列表
                    print_r(json_encode($get['lottery'], JSON_UNESCAPED_UNICODE)); //将投票列表解码后传输至前端

                    $lottery_list = json_encode($lottery_list,JSON_UNESCAPED_UNICODE); //对总的投票信息进行JSON UNICODE编码
                    $this->setContent($lottery_list); //保存新的投票列表的内容
                    $sql = $this->setLotterySql(); //获取数据库插入数据语句
                    $this->execute($conn,$sql); //执行当前语句

                }

            }else{

                print_r($res['lottery']); //输出发起过的投票
                return $res['lottery']; //将投票列表返回

            }

        }

        //抽奖信息的存储
        public function saveLottery($get){

            $this->setId($get['id']); //保存当前会议的ID
            $conn = $this->getConnect(); //获取数据库连接
            $sql = $this->signInTypeTableSql()[0]; //查找次会议的管理信息记录
            $result = $this->execute($conn,$sql); //执行当前语句并获取结果集
            $res = mysqli_fetch_assoc($result); //将结果集化为PHP数组

            //如果前端传来的信息中投票信息不为空进行投票数据插入操作
            if (!empty($get['lottery_result'])){

                //如果这是第一条投票信息
                if ($res['lottery_result']=='null'){

                    if ($get['from']=='wx'){ //如果此信息来自于小程序
                        $temp = array(json_decode($get['lottery_result'])); //设置临时数组保存前端传来的投票信息并进行JSON解码转化为PHP数组并存入一个总数组
                    }else{ //否则信息来自于网页
                        $temp = array($get['lottery_result']); //不进行解码直接保存数组中
                    }

                    $temp = json_encode($temp, JSON_UNESCAPED_UNICODE); //将数组进行UNICODE编码转化为JSON数组

                    print_r(json_encode($get['lottery_result'], JSON_UNESCAPED_UNICODE)); //将此信息传输给前端

                    $this->setContent($temp); //保存投票信息
                    $sql = $this->setLotteryResultSql(); //执行插入投票信息语句
                    $this->execute($conn,$sql); //执行数据库语句

                }else{ //不是第一条投票信息

                    $lottery_list = json_decode($res['lottery_result'], JSON_UNESCAPED_UNICODE); //对数据库取出的信息进行UNICODE解码转化为PHP数组

                    $temp = array(); //创建临时数组保存前端传来的数据

                    if ($get['from']=='wx'){ //如果信息来自于微信

                        for ($i=0; $i<sizeof(json_decode($get['lottery_result'])); ++$i){ //通过循环将前端数据转化为PHP类
                            $temp[] = $this->object_array(json_decode($get['lottery_result'])[$i]); //将PHP类转化为PHP数组
                        }

                    }else { //否则信息来自于网页

                        $temp = $get['lottery_result']; //将该投票信息保存

                    }

                    $lottery_list[] = $temp; //将此次投票信息存入总的投票信息列表
                    print_r(json_encode($get['lottery_result'], JSON_UNESCAPED_UNICODE)); //将投票列表解码后传输至前端

                    $lottery_list = json_encode($lottery_list,JSON_UNESCAPED_UNICODE); //对总的投票信息进行JSON UNICODE编码
                    $this->setContent($lottery_list); //保存新的投票列表的内容
                    $sql = $this->setLotteryResultSql(); //获取数据库插入数据语句
                    $this->execute($conn,$sql); //执行当前语句

                }

            }else{

                print_r($res['lottery_result']); //输出发起过的投票
                return $res['lottery_result']; //将投票列表返回

            }

        }

        //创建投票表
        public function setVoteTable($get){

            $this->setId($get['id']); //会议ID
            $conn = $this->getConnect(); //获取数据库连接
            $sql = $this->voteTableSql(); //获取创建投票表语句（表名为会议ID）
            $this->execute($conn,$sql); //执行该数据库语句

        }

        //创建抽奖表
        public function setLotteryTable($get){

            $this->setId($get['id']); //会议ID
            $conn = $this->getConnect(); //获取数据库连接
            $sql = $this->lotteryTableSql(); //获取创建抽奖表语句（表名为会议ID）
            $this->execute($conn,$sql); //执行该数据库语句

        }

        //插入投票数据（get为前端传递数据）
        public function vote($get){

            $this->setType($get['type']); //获取操作类型
            $this->setId($get['id']); //获取会议ID
            $this->setOpenid($get['openid']); //获取用户的openid
            $this->setVoteId($get['index']); //获取投票下标
            if (!empty($get['answer'])){
                $this->setAnswer($get['answer']); //若问题不为空则获取投票答案并转化为JSON格式
            }
            $conn = $this->getConnect(); //获取数据库连接


            if ($this->type=='make_sure'){

                $sql = $this->voteSql()[0]; //获取用户投票信息
                $result = $this->execute($conn,$sql); //执行语句
                //判断结果集（如果结果集为空即未投票,否则为已投票）
                if (empty(mysqli_fetch_assoc($result))){

                    print_r(false);

                }else {

                    print_r(true);

                }

            }else if ($this->type=='vote'){

                $sql = $this->voteSql()[1]; //获取插入用户答卷的语句
                $this->execute($conn,$sql); //执行语句


            }




        }

        //笔记相关操作
        public function note($get){

            $this->setId($get['id']); //获取会议ID
            $this->setState($get['state']);
            $this->setOpenid($get['openid']); //获取用户openid
            $this->setContent($get['content']); //获取笔记内容
            $conn = $this->getConnect(); //获取数据库连接

            if ($this->state=='collect'){

                $sql = $this->noteSql()[3]; //从数据库获取笔记记录的数据库语句
                $result = $this->execute($conn,$sql); //执行操作语句
                $res = mysqli_fetch_assoc($result);
                $info = array($res['id'],$res['content']);
                print_r(json_encode($info)); //将此数据传至前端

            }

            $sql = $this->noteSql()[0]; //从数据库获取笔记记录的数据库语句
            $result = $this->execute($conn,$sql); //执行操作语句
            $res = mysqli_fetch_assoc($result);

            //如果会议内容不为空，则为页面关闭时保存笔记数据
            if ($this->state=='out'){

                $sql = $this->noteSql()[2]; //获取更新笔记数据语句
                $this->execute($conn,$sql); //执行语句

            }else if ($this->state=='enter'){ //如果会议内容为空则为进入编辑页面时自动加载之前的数据

                if (empty($res)){

                    $sql = $this->noteSql()[1]; //获取创建笔记到数据库的语句
                    $this->execute($conn,$sql); //执行语句
                    $id = mysqli_insert_id($conn);
                    $info = array($id,'');
                    print_r(json_encode($info));

                }else{

                    $info = array($res['id'],$res['content']);
                    print_r(json_encode($info)); //将此数据传至前端

                }

            }else if ($this->state=='compile'){

                $sql = $this->noteSql()[4];
                $this->execute($conn,$sql);

            }

        }

        //查找可以下载文件
        public function haveAccessToDownload($get){

            $conn = $this->getConnect(); //获取数据库连接
            $this->setId($get['id']); //获取会议ID
            $this->setType($get['type']); //获取文件类型
            $sql = $this->searchFileSql()[0]; //获取查询本次会议所有文件的数据库语句
            $result = $this->execute($conn,$sql); //执行数据库语句
            $file_list = array(); //创建临时数据来保存可下载的文件列表

            while ($res = mysqli_fetch_assoc($result)){ //循环结果集，并将结果集转化为PHP数组
                $res['type_icon'] = '../../assets/images/iconfont-'.$res['type'].'.png'; //根据文件类型添加文件前端图标
                if ($res['download']=='true'){ //如果文件允许下载
                    $file_list[] = $res; //将此文件加入临时列表中
                }
            }

            $upload_list = $file_list;
            $myqli = new Mysql(FILE); //创建新的数据库（保存会议文件，表单名为会议ID）连接
            $myqli->setId($get['id']); //获取会议ID
            $myqli->setOpenid($get['openid']); //获取用户openid
            $newConn = $myqli->getConnect(); //获取新的数据库（保存会议文件）的连接
            $prepareList = array(); //创建保存可下载文件的临时数组
            $finishList = array(); //创建保存已下载文件的临时数组

            for ($i = 0; $i < sizeof($file_list); ++$i){ //循环允许下载的文件列表

                $myqli->setFileId($file_list[$i]['id']); //保存文件ID
                $sql = $myqli->searchFileSql()[1]; //到本次会议文件记录列表中查找此用户是否已经下载过此文件
                $result = $myqli->execute($newConn,$sql); //执行数据库操作并保存结果集

                if (empty($res = mysqli_fetch_assoc($result))){ //未查询到数据则为未下载

                    $prepareList[] = $file_list[$i]; //将此文件添加到可下载文件列表

                }else { //否则此文件该用户已经下载

                    $file_list[$i]['create_time'] = $res['create_time']; //保存此文件的下载时间
                    $finishList[] = $file_list[$i]; //将此文件添加到已下载文件列表中

                }

            }

            $list = array($prepareList,$finishList); //将可下载文件列表和已下载文件列表打包
            print_r(json_encode($list)); //将可下载文件列表和已下载文件列表数据传递至前端
            return $upload_list;

        }

        //下载文件后添加记录
        public function setDownload($get){

            $conn = $this->getConnect(); //获取数据库连接
            $this->setId($get['id']); //获取会议ID
            $this->setType($get['type']); //获取文件类型
            $this->setOpenid($get['openid']); //获取用户openid
            $this->setCreateTime($get['create_time']); //获取文件下载时间
            $this->setFileId($get['file_id']); //获取文件ID
            $sql = $this->setDownloadSql(); //获取保存此用户下载此文件的数据到本次会议文件记录列表中
            $this->execute($conn,$sql); //执行数据库语句
        }

        //获取会中已上传文件列表（管理者）
        public function getDownload($get){

            $this->setId($get['id']); //获取会议ID
            $conn = $this->getConnect(); //获取数据库连接
            $sql = $this->searchFileSql()[0]; //获取查询可下载列表的数据库语句
            $result = $this->execute($conn,$sql); //执行数据库语句并保存结果集
            $file_list = array(); //创建临时数组用来保存可下载文件列表

            while ($res = mysqli_fetch_assoc($result)){ //循环结果集并转化为PHP数组

                $res['type_icon'] = '../../assets/images/iconfont-'.$res['type'].'.png'; //根据文件类型设置其前端的图标
                $file_list[] = $res; //将此文件数据插入可下载文件列表

            }

            print_r(json_encode($file_list)); //将此列表数据传递至前端

        }

        //控制文件是否可下载
        public function setAccessToDownload($get){

            $this->setFileId($get['file_id']); //获取文件ID
            $this->setProperty($get['download']); //获取文件是否可以下载的状态（true可以下载、false不可以下载）
            $conn = $this->getConnect(); //获取数据库连接
            $sql = $this->updateDownloadSql(); //获取控制文件是否可以下载属性的数据库语句
            $this->execute($conn,$sql); //执行数据库语句

        }

        //创建弹幕表
        public function setBarrage($get){

            $this->setId($get['id']); //获取会议ID
            $conn = $this->getConnect(); //获取数据连接

            //如果是用户身份为管理者
            if ($get['if_manage']=='true'){

                //如果操作是获取弹幕状态（开启/关闭）
                if ($get['operation']=='search'){

                    $sql =$this->setBarrageSql()[0]; //获取查询会议管理信息的数据库语句
                    $result = $this->execute($conn,$sql); //执行数据库语句
                    $res = mysqli_fetch_assoc($result); //将执行后获取的结果集转化为PHP数组
                    $info = array($res['barrage'],$res['auto_detect'],$res['manual_detect']);
                    print_r(json_encode($info)); //将数组中的弹幕状态信息传递至前端

                }else if ($get['operation']=='change'){ //如果操作是更改弹幕状态（开启/关闭）

                    $this->setState($get['state']); //获取要更改的状态（开启/关闭）
                    $this->setType($get['type']);
                    $sql = $this->setBarrageSql()[1]; //获取更改弹幕状态的数据库语句
                    $this->execute($conn,$sql); //执行数据库语句

                    $mysqli = new Mysql(BARRAGE); //创建一个新的数据库连接，连接弹幕表单数据库
                    $mysqli->setId($get['id']); //获取会议ID
                    $newConn = $mysqli->getConnect(); //获取当前数据库（弹幕表单数据库）连接
                    $sql = $mysqli->setBarrageSql()[2]; //获取插入弹幕的数据库语句
                    $mysqli->execute($newConn,$sql); //执行数据库语句

                }

            }

        }

        //保存用户发送的弹幕信息
        public function barrage($get){

            $this->setId($get['id']); //获取会议ID
            $conn = $this->getConnect(); //获取数据库连接

            $this->setOpenid($get['openid']); //获取用户openid
            $this->setCreateTime($get['time']); //获取用户发送弹幕的时间
            $this->setNickname($get['nickName']); //获取用户的昵称
            $this->setHeadPortrait($get['avatarUrl']); //获取用户的头像
            $this->setContent($get['content']); //获取弹幕的内容

            $sql = $this->barrageSql()[0]; //获取插入弹幕的数据库语句
            $this->execute($conn,$sql); //执行插入操作

        }

        //确认用户信息是否曾经创建过，若没有则创建用户相关信息
        public function setCollection(){

            $conn = $this->getConnect(); //获取数据库连接
            $sql = $this->setCollectionSql()[0]; //查询是否存在当前用户的收藏信息
            $result = $this->execute($conn,$sql); //执行语句并保存查询结果集
            if (empty($res =  mysqli_fetch_assoc($result))){ //如果结果集为空，则该用户的收藏信息不存在

                $sql = $this->setCollectionSql()[1]; //创建该用户的收藏信息
                $this->execute($conn,$sql); //执行语句

            }

            return $res; //将查询结果以PHP数组的形式返回

        }

        //更新用户的收藏信息
        public function collect($get){

            $this->setOpenid($get['openid']); //保存用户的openid
            $this->setType($get['type']); //保存要更新的收藏数据的类型
            $conn = $this->getConnect(); //获取数据库连接

            if ($this->type=='info'){ //用户信息
                print_r($get['info']); //输出该信息
                $this->setContent($get['info']); //将此信息保存
                $sql = $this->setCollectionSql()[2]; //获取插入数据库语句
                $this->execute($conn,$sql); //执行操作
                return;
            }

            $res = $this->setCollection(); //确认该用户的收藏信息是否存在，若不存在则创建该用户的收藏信息

            if ($res[$this->type]=='null'){ //如果此次收藏信息为该用户的第一次收藏该类信息

                $temp = array(array('id'=>$get['id'],'time'=>$get['time'])); //设置临时数组保存前端传来的投票信息并进行JSON解码转化为PHP数组并存入一个总数组
                $temp = json_encode($temp, JSON_UNESCAPED_UNICODE); //将数组进行UNICODE编码转化为JSON数组
                $this->setContent($temp); //将前端传递的信息存储
                $sql = $this->setCollectionSql()[2]; //保存此次收藏信息语句
                $this->execute($conn,$sql); //执行当前语句

            }else{ //不是第一条收藏信息

                $collect_list = json_decode($res[$this->type], JSON_UNESCAPED_UNICODE); //对数据库取出的信息进行UNICODE解码转化为PHP数组
                for ($i = 0; $i < sizeof($collect_list); ++$i){ //通过循环判断用户是否曾已收藏此次信息

                    if ($collect_list[$i]['id']==$get['id']) return false; //如果用户已收藏过此信息，则将此次信息清空

                }


                $collect_list[] = array('id'=>$get['id'],'time'=>$get['time']); //将此次收藏信息插入用户该类型的收藏信息数组中
                $collect_list = json_encode($collect_list,JSON_UNESCAPED_UNICODE); //对总的投票信息进行JSON UNICODE编码
                $this->setContent($collect_list); //保存更新后的此类收藏信息
                $sql = $this->setCollectionSql()[2]; //获取数据库插入数据语句
                $this->execute($conn,$sql); //执行当前语句

            }

            return true;

        }

        //获取用户的收藏信息
        public function getCollection($get){

            $this->setType($get['type']); //获取收藏类型
            $this->setOpenid($get['openid']); //获取用户Openid
            $conn = $this->getConnect(); //获取数据库连接
            $sql = $this->setCollectionSql()[0]; //获取查询该用户该类型收藏列表
            $result = $this->execute($conn,$sql); //执行查询操作
            $res = mysqli_fetch_assoc($result); //将此列表转为PHP数组

            if ($this->type=='get_note'){ //如果类型为获取收藏过的笔记

                $res = json_decode($res['note'],JSON_UNESCAPED_UNICODE); //将获取到的列表进行解码
                print_r(json_encode($res)); //输出前端

            }else if ($this->type=='get_file'){ //如果类型为获取收藏过的文件

                $res = json_decode($res['file'],JSON_UNESCAPED_UNICODE); //将获取到的列表进行解码
                $len = sizeof($res); //获取列表长度
                $info = array(); //创建临时数组
                for ($i=0; $i<$len; ++$i){ //遍历数组

                    $this->setId($res[$i]['id']); //获取此文件的ID
                    $sql = $this->searchFileSql()[2]; //查询该文件的详细信息
                    $result = $this->execute($conn,$sql); //获取执行查询的后的结果集
                    $temp = mysqli_fetch_assoc($result); //将此结果集转化为PHP数组
                    $temp['type_icon'] = '../../assets/images/iconfont-'.$temp['type'].'.png'; //根据文件类型设置其前端的图标
                    $info[] = $temp; //将临时数组进行保存

                }
                print_r(json_encode($info)); //输出文件列表信息

            }else if ($this->type=='get_conference'){ //收藏过的会议

                $res = json_decode($res['conference'],JSON_UNESCAPED_UNICODE); //将查询到的信息进行JSON解码
                $len = sizeof($res); //获取列表长度
                $info = array(); //保存单个会议信息
                $list = array(); //保存收藏会议列表
                for ($i=0; $i<$len; ++$i){ //遍历数组

                    $this->setId($res[$i]['id']); //获取会议的ID
                    $sql = $this->recordSql(); //获取该会议的详细信息
                    $result = $this->execute($conn,$sql); //执行查询操作
                    $temp = mysqli_fetch_assoc($result); //将此信息转化为PHP数组

                    $info['id'] = $temp['id']; //保存会议ID
                    $info['state'] = $temp['state']; //保存会议状态（prepare未开始或已结束、finish已结束）
                    $info['theme'] = $temp['theme']; //保存会议主题
                    $info['time'] = $temp['time']; //保存会议时间
                    $info['place'] = $temp['place']; //保存会议地点
                    $info['place_info'] = $temp['place_info']; //保存会议详细地点
                    $list[] = $info;

                }

                print_r(json_encode($list)); //将此列表输出至前端

            }else if ($this->type=='get_info'){ //如果操作为获取用户信息

                $res = json_decode($res['info'],JSON_UNESCAPED_UNICODE); //将查询到的信息进行解码
                print_r(json_encode($res)); //输出至前端

            }else if ($this->type=='get_card'){ //获取用户收藏的名片

                $res = json_decode($res['card'],JSON_UNESCAPED_UNICODE); //将查询到的信息进行解码
                $len = sizeof($res); //获取长度
                $info = array(); //单个名片信息
                $list = array(); //收藏的名片列表
                for ($i=0; $i<$len; ++$i){ //遍历数组

                    $this->setOpenid($res[$i]['id']); //获取收藏用户的Openid
                    $info['time'] = explode(' ',$res[$i]['time'])[0]; //获取保存的时间
                    $info['openid'] = $res[$i]['id']; //获取收藏用户的Openid
                    $sql = $this->setCollectionSql()[0]; //获取查询名片列表的语句
                    $result = $this->execute($conn,$sql); //执行查询操作
                    $result = mysqli_fetch_assoc($result); //将结果集转化为PHP数组
                    $temp_info = json_decode($result['info'],JSON_UNESCAPED_UNICODE); //将此用户的信息JSON解码
                    $info['name'] = $temp_info['name']; //获取该收藏用户的姓名
                    $list[] = $info; //将此信息保存列表

                }
                print_r(json_encode($list));

            }else if ($this->type=='get_lottery'){ //获取收藏到的奖品

                $res = json_decode($res['info'],JSON_UNESCAPED_UNICODE); //解码
                print_r(json_encode($res)); //输出至前端

            }


        }

        //保存用户意见
        public function setOpinion($get){

            $this->setOpenid($get['openid']); //保存用户的Openid
            $this->setCreateTime($get['time']); //保存用户的提交时间
            $this->setContent($get['content']); //保存用户意见
            $conn = $this->getConnect(); //获取数据库连接
            $sql = $this->setOpinionSql(); //获取插入意见语句
            $this->execute($conn,$sql); //执行插入操作

        }

        //析构方法
        public function __destruct(){
            mysqli_close($this->mysqli); //关闭数据库链接
        }

    }