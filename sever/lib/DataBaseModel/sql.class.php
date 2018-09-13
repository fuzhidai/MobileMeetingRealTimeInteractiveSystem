<?php
/**
 * Created by PhpStorm.
 * User: 杨帆
 * Date: 2018/2/26
 * Time: 21:46
 * Function: 注册会议信息的sql语句
 */

    include_once (dirname(__FILE__)."/../DataBaseModel/setinfo.class.php"); //引入设置信息公共类
    include_once (dirname(__FILE__)."/../Config/config.php"); //导入数据库配置文件

    class Sql extends Setinfo {

        private $sql; //sql语句

        public function __construct($dbname)
        {
            parent::__construct($dbname);
        }

        //将注册时提交的信息插入数据库的语句
        public function registerSql(){
            return array(
                "INSERT INTO `".CONFERENCE_TABLE."` ( `create_time`,  `state`, `name`, `telephone`, `wechat`, `sponsor`, `contractor`, `company_wechat`, `theme`, `type`, `manage_password`, `password`, `time`, `place`, `place_info`, `people_num`, `apply`, `start_apply`, `over_apply`, `introduction`, `logo`, `cover`)
                VALUES ('$this->create_time', '$this->state', '$this->name', '$this->telephone', '$this->wechat', '$this->sponsor', '$this->contractor', '$this->company_wechat', '$this->theme', '$this->type', '$this->manage_password', '$this->password', '$this->time', '$this->place', '$this->place_info', '$this->people_num', '$this->apply', '$this->start_apply', '$this->over_apply', '$this->introduction', '$this->logo', '$this->cover')",
                "INSERT INTO `".CREATE_TABLE."` (`conference_id`, `openid`, `nickName`, `avatarUrl`) VALUES ('$this->id', '$this->openid', '$this->nickname', '$this->head_portrait')"
            );
        }

        //修改会议信息后更新数据库信息的语句
        public function updateSql(){
            return array(
                "UPDATE `".CONFERENCE_TABLE."` SET `state`='$this->state' WHERE `id`='$this->id'",
                "UPDATE `".CONFERENCE_TABLE."` SET `name`='$this->name', `telephone`='$this->telephone', `wechat`='$this->wechat', `sponsor`='$this->sponsor', `contractor`='$this->contractor', `company_wechat`='$this->company_wechat', `theme`='$this->theme', `type`='$this->type',  `manage_password`='$this->manage_password', `password`='$this->password', `time`='$this->time', `place`='$this->place', `place_info`='$this->place_info', `people_num`='$this->people_num', `apply`='$this->apply', `start_apply`='$this->start_apply', `over_apply`='$this->over_apply', `introduction`='$this->introduction', `logo`='$this->logo', `cover`='$this->cover'
                WHERE `id`='$this->id'",
            );
        }

        //查询创建会议列表的语句
        public function createSql(){
            return "SELECT * from `".CREATE_TABLE."` WHERE `openid`='$this->openid'";
        }

        //查询参加会议列表的语句
        public function attendSql(){
            return "SELECT * from `".ATTEND_TABLE."` WHERE `openid`='$this->openid'";
        }

        //查询创建会议的语句（按会议序号查找）
        public function createByIdSql(){
            return "SELECT * from `".CREATE_TABLE."` WHERE `conference_id`='$this->id'";
        }

        //查询会议是否为用户创建或用户参加
        public function ifMatterSql(){
            return "SELECT * from `".CREATE_TABLE."` WHERE `conference_id`='$this->id' AND `openid`='$this->openid' UNION SELECT * from `".ATTEND_TABLE."` WHERE `conference_id`='$this->id' AND `openid`='$this->openid'";
        }

        //查询近期会议列表的语句
        public function recentSql(){
            return "SELECT * from `".CREATE_TABLE."` WHERE `openid`='$this->openid' UNION SELECT * from `".ATTEND_TABLE."` WHERE `openid`='$this->openid'";
        }

        //查询已完成会议列表的语句
        public function finishSql(){
            return "SELECT * from `".CONFERENCE_TABLE."` WHERE `id`='$this->id' AND DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i')>`time` OR `state`='finish' ORDER BY `time` ASC";
        }

        //获取已经完成的一周之内的会议
        public function recentFinishSql(){
            return "SELECT * from `".CONFERENCE_TABLE."` WHERE `id`='$this->id' AND DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i')>`time` AND DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 7 DAY),'%Y-%m-%d %H:%i')<`time` ORDER BY `time` ASC";
        }

        //获取已开始一天之内的会议
        public function startFinishSql(){
            return "SELECT * from `".CONFERENCE_TABLE."` WHERE `id`='$this->id' AND DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i')>`time` AND DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 DAY),'%Y-%m-%d %H:%i')<`time` AND `state`='prepare' ORDER BY `time` ASC";
        }

        //查询未开始会议列表的语句
        public function prepareSql(){
            return "SELECT * from `".CONFERENCE_TABLE."` WHERE `id`='$this->id' AND DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i')<`time` AND `state`='prepare' ORDER BY `time` ASC";
        }

        //获取未开始的一周之内的会议
        public function recentPrepareSql(){
            return "SELECT * from `".CONFERENCE_TABLE."` WHERE `id`='$this->id' AND DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i')<`time` AND DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 7 DAY),'%Y-%m-%d %H:%i')>`time` AND `state`='prepare'  ORDER BY `time` ASC";
        }

        //获取未开始的一天之内的会议
        public function startPrepareSql(){
            return "SELECT * from `".CONFERENCE_TABLE."` WHERE `id`='$this->id' AND DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i')<`time` AND DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 DAY),'%Y-%m-%d %H:%i')>`time`  AND `state`='prepare'  ORDER BY `time` ASC";
        }

        //获取全部会议
        public function allSql(){

            return array(
                "SELECT * from `".CONFERENCE_TABLE."` WHERE `id`=$this->id",
                "SELECT * from `".CONFERENCE_TABLE."` WHERE `id`='$this->id' AND DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 7 DAY),'%Y-%m-%d %H:%i')>`time` AND DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 7 DAY),'%Y-%m-%d %H:%i')<`time`",
                "SELECT * from `".CONFERENCE_TABLE."` WHERE `id`='$this->id' AND DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 DAY),'%Y-%m-%d %H:%i')>`time` AND DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 DAY),'%Y-%m-%d %H:%i')<`time` AND `state`='prepare'",
            );

        }

        //查询会议详细信息的语句
        public function recordSql(){
            return "SELECT * from `".CONFERENCE_TABLE."` WHERE `id`=$this->id";
        }

        //按主题查询相关信息的语句
        public function themeSql(){
            return "SELECT * from `".CONFERENCE_TABLE."` WHERE `theme` LIKE '%$this->search_info%'";
        }

        //按地点查询相关信息的语句
        public function placeSql(){
            return "SELECT * from `".CONFERENCE_TABLE."` WHERE `place` LIKE '%$this->search_info%' OR `place_info` LIKE '%$this->search_info%'";
        }

        //按时间查询相关信息的语句
        public function timeSql(){
            return "SELECT * from `".CONFERENCE_TABLE."` WHERE `time` LIKE '%$this->search_info%'";
        }

        //按会议类型查询相关语句
        public function typeSql(){
            return "SELECT * from `".CONFERENCE_TABLE."` WHERE `type` LIKE '%$this->search_info%' ORDER BY `create_time` DESC";
        }

        //报名会议的语句
        public function applySql(){
            return "INSERT INTO `".ATTEND_TABLE."` (`conference_id`, `openid`, `nickName`, `avatarUrl`) VALUES ('$this->id', '$this->openid', 'null', 'null')";
        }

        //是否报名会议的语句
        public function ifApplySql(){
            return "SELECT * from `".ATTEND_TABLE."` WHERE `conference_id`='$this->id' AND `openid`='$this->openid'";
        }

        //最新会议的语句
        public function newSql(){
            return "SELECT * from `".CONFERENCE_TABLE."` ORDER BY `create_time` ASC";
        }

        //在保存单场会议的签到信息的数据库中创建会议签到信息登记表单（表单名为会议ID）
        public function signInTableSql(){
            return "CREATE TABLE IF NOT EXISTS `".SIGN_IN."`.`$this->id` ( `id` INT NOT NULL AUTO_INCREMENT , `openid` VARCHAR(64) NOT NULL , `nickname` VARCHAR(32) NOT NULL , `head_portrait` VARCHAR(128) NOT NULL , `type` VARCHAR(32) NOT NULL , `time` DATETIME NOT NULL , `name` VARCHAR(32) NOT NULL , `telephone` VARCHAR(11) NOT NULL , PRIMARY KEY (`id`)) ENGINE = MyISAM;";
        }

        //在数据库中创建会议签到信息登记表单
        public function signInTypeTableSql(){
            return array(
                "SELECT * from `".CONFERENCE_MANAGE."` WHERE `conference_id`='$this->id' ", //在会议管理表单中查找当前会议的管理信息
                "INSERT INTO `".CONFERENCE_MANAGE."` (`conference_id`, `QR_sign`, `personage_sign`, `WIFI_sign`, `sign_wall`, `barrage`, `auto_detect`, `manual_detect`,`vote`, `file`, `lottery`, `lottery_result`) VALUES ('$this->id', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'null', 'null', 'null', 'null')", //创建当前会议的管理表单
                "UPDATE `".CONFERENCE_MANAGE."` SET `$this->type`='$this->state' WHERE `conference_id`='$this->id'", //更新特定功能的状态（type为管理的类型、state为更改的状态）
            );
        }

        //插入签到信息的语句
        public function signInSql(){
            return array(
                "SELECT * from `$this->id` WHERE `openid`='$this->openid' ",
                "INSERT INTO `$this->id` (`openid`, `nickname`, `head_portrait`, `type`, `time`, `name`, `telephone`) VALUES ('$this->openid', '$this->nickname', '$this->head_portrait', '$this->type', '$this->time', '$this->name', '$this->telephone')",
            );
        }

        //将会议投票的问题和选项储存（$vote为投票的详细记录，$id为会议ID）
        public function setVoteSql(){
            return "UPDATE `".CONFERENCE_MANAGE."` SET `vote` = '$this->content' WHERE `conference_id`='$this->id'"; //创建保存投票记录的JSON
        }

        //将会议投票的问题和选项储存（$vote为投票的详细记录，$id为会议ID）
        public function setLotterySql(){
            return "UPDATE `".CONFERENCE_MANAGE."` SET `lottery` = '$this->content' WHERE `conference_id`='$this->id'"; //创建保存投票记录的JSON
        }

        //将会议投票的问题和选项储存（$vote为投票的详细记录，$id为会议ID）
        public function setLotteryResultSql(){
            return "UPDATE `".CONFERENCE_MANAGE."` SET `lottery_result` = '$this->content' WHERE `conference_id`='$this->id'"; //创建保存投票记录的JSON
        }

        //获取该投票的所有结果
        public function getVoteResultSql(){
            return "SELECT * from `$this->id` WHERE `vote_id`='$this->vote_id'";
        }

        //获取签到消息
        public function getSignInSql(){
            return "SELECT * from `$this->id`";
        }

        //在保存单场会议的投票信息的数据库中创建会议投票记录单（表单名为会议ID，vote_id为投票标号、openid为用户的openid、answer用户保存用户的答案）
        public function voteTableSql(){
            return "CREATE TABLE IF NOT EXISTS `".VOTE."`.`$this->id` ( `id` INT NOT NULL AUTO_INCREMENT , `vote_id` INT NOT NULL , `openid` VARCHAR(64) NOT NULL , `answer` JSON NOT NULL , PRIMARY KEY (`id`)) ENGINE = MyISAM;";
        }

        //在保存单场会议的的抽奖信息的数据库中创建抽奖记录单（表单名未会议ID，lottery_id为抽奖标号、openid为用户的Openid,nickName为昵称，AVARTUAL为头像）
        public function lotteryTableSql(){
            return "CREATE TABLE IF NOT EXISTS `".LOTTERY."`.`$this->id` ( `id` INT NOT NULL AUTO_INCREMENT , `lottery_id` INT NOT NULL , `openid` VARCHAR(64) NOT NULL , `nickName` VARCHAR(32) NOT NULL , `avatarUrl` VARCHAR(256) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;";
        }

        //将弹幕抽奖信息插入表中
        public function insertLotterySql(){
            return "INSERT INTO `$this->id` (`lottery_id`, `openid`, `nickName`, `avatarUrl`) VALUES ('$this->lottery_id', '$this->openid', '$this->nickname','$this->head_portrait')";
        }

        //获取当前抽奖参与者信息
        public function getLotteryRangeSql(){
            return "SELECT * from `$this->id` WHERE `lottery_id`='$this->lottery_id'";
        }

        //查找相关数据和插入用户投票信息语句（vote_id为投票ID、openid为用户openid、answer为用户输入的答案）
        public function voteSql(){
            return array(
                "SELECT * from `$this->id` WHERE `openid`='$this->openid' AND `vote_id`='$this->vote_id'", //查找用户投票信息
                "INSERT INTO `$this->id` (`vote_id`, `openid`, `answer`) VALUES ('$this->vote_id', '$this->openid', '$this->answer')" //插入用户投票信息
            );
        }

        //笔记操作
        public function noteSql(){
            return array(
                "SELECT * from `".NOTE."` WHERE `openid`='$this->openid' AND `conference_id`='$this->id'", //查询笔记信息
                "INSERT INTO `".NOTE."` (`conference_id`, `openid`, `content`) VALUES ('$this->id', '$this->openid', '$this->content')", //创建笔记
                "UPDATE `".NOTE."` SET `content` = '$this->content' WHERE `conference_id`='$this->id' AND `openid`='$this->openid'", //更新笔记
                "SELECT * from `".NOTE."` WHERE `openid`='$this->openid' AND `id`='$this->id'", //查询笔记信息
                "UPDATE `".NOTE."` SET `content` = '$this->content' WHERE `id`='$this->id' AND `openid`='$this->openid'", //更新笔记
            );
        }

        //文件上传后将其记录插入
        public function setFileSql(){

            return "INSERT INTO `".FILE."` (`openid`, `conference_id`, `download`, `time`, `name`, `type`, `path`) VALUES ('$this->openid', '$this->id', '$this->download', '$this->create_time','$this->nickname','$this->type','$this->path')";

        }

        //查询可下载文件列表
        public function searchFileSql(){
            return array(
                "SELECT * from `".FILE."` WHERE `conference_id`='$this->id'", //在文件总表中根据会议ID查询会议文件列表
                "SELECT * from `$this->id` WHERE `openid`='$this->openid' AND `file_id`='$this->file_id'", //在专门保存单场会议文件上传、下载记录的数据库中根据会议ID查找相关信息
                "SELECT * from `".FILE."` WHERE `id`='$this->id'", //在文件总表中根据会议ID查询会议文件列表
            );
        }

        //上传后创建此会议的文件表单
        public function setUploadSql(){

            return "CREATE TABLE `".FILE."`.`$this->id` ( `id` INT NOT NULL AUTO_INCREMENT , `file_id` INT NOT NULL , `openid` VARCHAR(64) NOT NULL , `type` VARCHAR(10) NOT NULL , `create_time` VARCHAR(32) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;";

        }

        //下载文件后将已下载信息插入表中
        public function setDownloadSql(){

            //将下载后的信息插入保存会议文件表单的数据库中（表单名为会议ID）
            return "INSERT INTO `$this->id` (`file_id`, `openid`, `type`, `create_time`) VALUES ('$this->file_id', '$this->openid', '$this->type', '$this->create_time')";
        }

        //更新文件是否可下载状态
        public function updateDownloadSql(){
            return "UPDATE `".FILE."` SET `download`='$this->property' WHERE `id`='$this->file_id'"; //更新文件的是否可下载状态
        }

        //在保存单场会议的弹幕信息的数据库中创建会议弹幕表单（表单名为会议ID）
        public function setBarrageSql(){

            return array(
                "SELECT * from `".CONFERENCE_MANAGE."` WHERE `conference_id`='$this->id'", //在会议管理表单中查询此会议的管理信息
                "UPDATE `".CONFERENCE_MANAGE."` SET `$this->type` = '$this->state' WHERE `conference_id`='$this->id'", //更新弹幕墙的状态（开启/关闭）

                //在保存会议弹幕表单的数据库中创建此次会议的弹幕表单（表单名为会议ID）
                "CREATE TABLE `".BARRAGE."`.`$this->id` ( `id` INT NOT NULL AUTO_INCREMENT , `openid` VARCHAR(64) NOT NULL , `time` VARCHAR(32) NOT NULL , `nickName` VARCHAR(32) NOT NULL , `avatarUrl` VARCHAR(256) NOT NULL , `content` VARCHAR(256) NOT NULL , PRIMARY KEY (`id`)) ENGINE = MyISAM"
            );

        }

        //保存用户弹幕信息
        public function barrageSql(){

            //将用户的弹幕相关信息插入数据库
            return array(
                "INSERT INTO `$this->id` (`openid`, `time`, `nickName`, `avatarUrl`, `content`) VALUES ('$this->openid', '$this->create_time', '$this->nickname', '$this->head_portrait', '$this->content')", //插入用户投票信息
                "SELECT * from `$this->id` WHERE `detection`='no'",
                "UPDATE `$this->id` SET `detection`='$this->state' WHERE `id`='$this->barrage_id'",
            );
        }

        //用户收藏操作
        public function setCollectionSql(){

            return array(

                "SELECT * from `".COLLECTION."` WHERE `openid`='$this->openid'",
                "INSERT INTO `".COLLECTION."` (`openid`, `info`, `photo`, `note`, `file`, `conference`, `card`, `lottery`) VALUES ('$this->openid', 'null', 'null', 'null', 'null', 'null', 'null', 'null')",
                "UPDATE `".COLLECTION."` SET `$this->type`='$this->content' WHERE `openid`='$this->openid'",

            );

        }

        //保存用户的反馈意见
        public function setOpinionSql(){

            return "INSERT INTO `".OPINION."` (`openid`, `time`, `content`) VALUES ('$this->openid', '$this->create_time', '$this->content')";

        }

    }