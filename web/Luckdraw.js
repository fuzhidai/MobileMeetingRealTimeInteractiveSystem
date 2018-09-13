var headPictures = new Array(); // 头像数组
var nickName = new Array(); // 微信昵称
var lucky_list = new Array(); //中奖者名单

var headPicSlot = $('.slot');   // 显示大头像的div
var nickNameDiv = $('.name');   // 显示大头像下方昵称的div
var numOfPeople = headPictures.length-1;//可获奖人数（不包括已经中奖的人）
var runing = true;
var trigger = true;
var inUser = (Math.floor(Math.random() * 10000)) % 5 + 1;
var num = 0;
var Lotterynumber = 5; //可获奖人数

// 开始停止
function start() {
	if (runing) {
		if ( numOfPeople <= Lotterynumber ) {
			alert("抽奖人数不足");
		}else{
			runing = false;
			$('#start').text('准备中');
			startNum()
		}
	} else {
		$('#start').text('抽取中');
		zd();
	}
}

// 开始抽奖
function startLuck() {
	runing = false;
	$('#btntxt').removeClass('start').addClass('stop');
	startNum();
}

// 循环参加名单
function startNum() {
	num = Math.floor(Math.random() * numOfPeople);
	headPicSlot.css('background-image','url('+headPictures[num]+')');
    nickNameDiv.html(nickName[num]);
	t = setTimeout(startNum, 0);
}

// 停止跳动
function stop() {
	numOfPeople = headPictures.length-1;
	clearInterval(t);
	t = 0;
}

// 打印中奖人
function zd() {
	if (trigger) {
		trigger = false;
		var i = Lotterynumber;
		if ( numOfPeople >= Lotterynumber ) {
			stopTime = window.setInterval(function () {
				if (runing) {
				    // 未开始时，开始
					runing = false;
					$('#btntxt').removeClass('start').addClass('stop');
					startNum();
				} else {
				    // 已开始时，停止
					runing = true;
					$('#btntxt').removeClass('stop').addClass('start');
					stop();
					i--;
					Lotterynumber--;

					$('#start').text('抽取中');

					if ( i == 0 ) {
                        $('#start').text('抽取完毕');
						window.clearInterval(stopTime);
						$("#start").fadeOut();

						var lucky_info = [
							{
								'lottery_id': lottery_id,
                                'grade_id': grade_id,
                                'award_id': award_id
							},
							{'lucky_list': lucky_list }
						];

						console.log(lucky_info);

						var save_lottery_result = '{"type":"save_lottery_result","room_id":"'+room_id+'","openid":"'+openid+'","lottery_result":'+JSON.stringify(lucky_info)+'}';
						ws.send(save_lottery_result);

						//Lotterynumber = 5;
						//trigger = true;
					};
						//打印中奖者名单

					lucky_list.push(lottery_range[num]['openid']);

					$('.luck-user-list').prepend("<li><div class='portrait' style='background-image:url("+headPictures[num]+")'></div><div class='luckuserName'>"+nickName[num]+"</div></li>");

                    //$('.modality-list ul').append("<li><div class='luck-img' style='background-image:url("+headPictures[num]+")'></div><p>"+nickName[num]+"</p></li>");
                    //将已中奖者从数组中"删除",防止二次中奖
                    headPictures.splice($.inArray(headPictures[num], headPictures), 1);
                    nickName.splice($.inArray(nickName[num], nickName), 1);
            }
			},1000);
		};
	}
}

