<?php
/**
 * Created by PhpStorm.
 * User: dell
 * Date: 2018/2/26
 * Time: 21:17
 * Function: 注册会议的会议基本信息设置
 */

    include_once(dirname(__FILE__)."/../DataBaseModel/connect.class.php"); //引入连接数据库公共类

    class Setinfo extends Connect {

        protected $openid; //用户的openid，即用户的唯一标识
        protected $property; //会议属性（创建或参加）
        protected $id; //会议id
        protected $state; //操作的会议状态（prepare/未开始、finish/已完成、record/记录详情）
        protected $search_info; //搜索信息
        protected $nickname; //用户昵称
        protected $head_portrait; //用户头像地址
        protected $content; //笔记内容
        protected $vote_id; //投票下标
        protected $lottery_id; //抽奖下标
        protected $answer; //投票用户答案
        protected $create_time; //创建时间
        protected $file_id; //文件ID
        protected $note_id; //笔记ID
        protected $barrage_id; //弹幕ID
        protected $picture; //图片
        protected $download; //是否允许下载
        protected $path; //文件路径

        //会议注册提交信息
        protected $name ; //负责人姓名（必填）
        protected $telephone; //负责人电话（必填）
        protected $wechat; //负责人微信（选填）
        protected $sponsor; //主办方（必填）
        protected $contractor; //承办方（选填）
        protected $company_wechat; //企业公众号（选填）
        protected $theme; //会议主题（必填）
        protected $type; //会议类型（必填）
        protected $manage_password; //会议管理密码（必填）
        protected $password; //会议密码（选填）
        protected $time; //会议时间（必填）
        protected $place; //会议地点（必填）
        protected $place_info; //会议地点详细信息（和会议地点二选一必填）
        protected $people_num; //会议人数（选填）
        protected $apply; //是否开启会议报名
        protected $start_apply; //报名开始时间（选填）
        protected $over_apply; //报名结束时间（选填）
        protected $introduction; //会议简介（必填）
        protected $logo; //企业logo（选填）
        protected $cover; //会议封面（选填）

        public function __construct($dbname)
        {
            parent::__construct($dbname);
        }

        //设置签到信息
        public function setSignInInfo($get){

            if (!empty($get)){
                $this->state = $get['state'];
                $this->id = $get['id'];
                $this->openid = $get['openid'];
                $this->nickname = $get['nickname'];
                $this->head_portrait = $get['head_portrait'];
                $this->type = $get['type'];
                $this->time = $get['time'];
                $this->name = $get['name'];
                $this->telephone = $get['telephone'];
            }

        }

        //设置会议信息
        public function setInfo($post){

            if (!empty($post)){
                $this->nickname = $post['nickName'];
                $this->head_portrait = $post['avatarUrl'];
                $this->name = $post['name'];
                $this->telephone = $post['telephone'];
                $this->wechat = $post['wechat'];
                $this->sponsor = $post['sponsor'];
                $this->contractor = $post['contractor'];
                $this->company_wechat = $post['company_wechat'];
                $this->theme = $post['theme'];
                $this->type = $post['type'];
                $this->manage_password = md5($post['manage_password']);
                $this->password = $post['password'];
                $this->setTime($post['date'],$post['time']);
                $this->setPlace($post['place']);
                $this->place_info = $post['place_info'];
                $this->people_num = $post['people_num'];
                $this->apply = $post['apply'];
                $this->setApply($post['begin_date'],$post['begin_time'],$post['over_date'],$post['over_time']);
                $this->introduction = $post['introduction'];
                $this->setLogo($post['logo']);
                $this->setCover($post['cover']);
                $this->state = $post['state'];
                $this->create_time = $post['create_time'];
            }

        }

        public function setSearch($search_info){
            if (empty($search_info)){
                $this->search_info = '';
            } else {
              $this->search_info = $search_info;
            }
        }

        //下载
        public function setIfDownload($download){
            $this->download = $download;
        }

        //文件路径
        public function setPath($path){
            $this->path = $path;
        }

        //图片
        public function setPicture($picture){
            $this->picture = $picture;
        }

        //用户昵称
        public function setNickname($nickname){
            $this->nickname = $nickname;
        }

        //用户头像
        public function setHeadPortrait($head_portrait){
            $this->head_portrait = $head_portrait;
        }

        //文件ID
        public function setFileId($file_id){
            $this->file_id = $file_id;
        }

        //创建时间
        public function setCreateTime($create_time){
            $this->create_time = $create_time;
        }

        //投票答案
        public function setAnswer($answer){
            if (empty($answer)){
                $this->answer = '';
            } else {
                $this->answer = $answer;
            }
        }

        //投票下标
        public function setVoteId($vote_id){
            $this->vote_id = $vote_id;
        }

        //抽奖下标
        public function setLotteryId($lottery_id){
            $this->lottery_id = $lottery_id;
        }

        //弹幕下标
        public function setBarrageId($barrage_id){
            $this->barrage_id = $barrage_id;
        }

        //笔记下标
        public function setNoteId($note_id){
            $this->note_id = $note_id;
        }

        //设置会议笔记内容
        public function setContent($content){
            $this->content = $content;
        }

        //设置会议属性（创建、参加）
        public function setProperty($property){
            if (empty($property)){
                $this->property = '';
            } else {
                $this->property = $property;
            }
        }

        //设置会议的操作的状态
        public function setState($state){
            if (empty($state)){
                $this->state = '';
            } else {
                $this->state = $state;
            }
        }

        //设置会议的唯一id
        public function setId($id){
            if (empty($id)){
                $this->id = '';
            } else {
                $this->id = $id;
            }
        }

        //设置签到类型
        public function setType($type){
            if (empty($type)){
                $this->type = '';
            } else {
                $this->type = $type;
            }
        }

        //设置用户唯一的openid
        public function setOpenid($openid){
            if (empty($openid)){
                $this->openid = '';
            } else {
                $this->openid = $openid;
            }
        }

        //设置会议时间
        private function setTime($date, $time){
            $this->time = $date.' '.$time;
        }

        //设置会议地点
        private function setPlace($place){
            if($place == '点击这里选择'){
                $this->place = '';
            }else{
                $this->place = $place;
            }
        }

        //设置报名时间
        private function setApply($begin_date, $begin_time, $over_date, $over_time){
            $this->start_apply = $begin_date.' '.$begin_time;
            $this->over_apply = $over_date.' '.$over_time;
        }

        //设置logo路径
        private function setLogo($logo){
            if (empty($logo)){
                $this->logo = '';
            } else {
                $this->logo = 'https://www.viaviai.com/sever/upload/logo/'.$logo;
            }
        }

        //设置封面路径
        public function setCover($cover){
            if (empty($cover)){
                $this->cover = '';
            } else {
                $this->cover = 'https://www.viaviai.com/sever/upload/cover/'.$cover;
            }
        }


    }