$(document).ready(function(){

    //========================以下图表相关==========================
    // 表格
    var myChart;
    // 指定图表的配置项和数据
    var option = {
        title  : {
            text: '问题1的答案应该是选项几呢？'
        },
        series : [
            {
                name: '',
                type: 'pie',
                radius: '60%',
                label:{            //饼图图形上的文本标签
                    normal:{
                        show:true,
                        //position:'inner', //标签的位置
                        textStyle : {
                            fontWeight : 300 ,
                            fontSize : 16    //文字的字体大小
                        },
                        formatter:'{b}:{d}%'
                    }
                },
                data:[
                    {value:235, name:'选项1'},
                    {value:274, name:'选项2'},
                    {value:310, name:'选项3'},
                    {value:335, name:'选项4'},
                    {value:400, name:'选项5'}
                ]
            }
        ]
    };
    //========================以上图表相关==========================
    initDialog("#sign-dialog");
    initDialog("#lottery-dialog");
    initDialog("#vote-dialog");
    initDialog('#sign-wall-dialog');

    // 仅做测试自定义函数用
    $(document).keydown(function (event) {
        switch (event.keyCode) {
            case 37:// 左键：出现弹幕
                createChip("barrage--001","image/user.jpg","这里是弹幕内容");
                break;
            case 38:// 上键，打开dailog
                openDialog("#test-dialog");
                break;
            case 39:// 右键：更换ppt
                changePowerPoint("http://dc.office.mmais.com.cn/t/59/7F36000E47676835B2DF3A515D05EF36.pptx");
                break;
            case 40:// 下键，关闭dialog();
                document.querySelector("#test-dialog").close();
                break;

            case 65:// A键盘，打开投票Dialog
                // 初始化空Chart，一定要在Dialog已经显示后再初始化
                openDialog("#vote-dialog");
                myChart = echarts.init(document.getElementById('vote-result-div'));// 基于准备好的dom，初始化echarts实例
                myChart.setOption(option);
                break;
            case 66:// B键，关闭投票Dialog
                document.querySelector("#vote-dialog").close();
                break;
            case 67:// C键，打开抽奖Dialog
                openDialog("#lottery-dialog");
                break;
            case 68:// D键，关闭抽奖Dialog
                document.querySelector("#lottery-dialog").close();
        };
        return false;
    });



    $("#chip-test").click(function(){
        createChip("barrage--001","image/user.jpg","这里是弹幕内容");
    });
});

/**
 * 动态创建弹幕，在屏幕上划过后删除
 * @param chipId        弹幕id
 * @param chipImg       弹幕头像
 * @param chipContent   弹幕内容
 */
function createChip(chipId, chipImg,chipContent){
    var posY = Math.floor(Math.random()*($(window).height()-100)+50);
    posY = posY+"px";
    $("body").append("<div id=\""+chipId+"\" class=\"chip\" style=\"top: "+posY+"\">\n" +
        "        <span class=\"mdl-chip mdl-chip--contact\" style=\"z-index = 99999\">\n" +
        "            <img class=\"mdl-chip__contact\" src=\""+chipImg+"\"></img>\n" +
        "            <span class=\"mdl-chip__text\">"+chipContent+"</span>\n" +
        "        </span>\n" +
        "    </div>");
    $(".chip").ready( function(){
        $(".chip").animate({left:'0px'},10000,"linear", function(){
            $(this).remove();
        });
    });
}

/**
 *  更换PPT。删除现有的<iframe>，并重新创建一个
 * @param pptSource 幻灯片在服务器上的路径
 */
function changePowerPoint(pptSource){
    if($(".ppt-frame").length > 0) {
        $(".ppt-frame").remove();
    }
    $(".ppt-div").append("<iframe class =\"ppt-frame\" src='https://view.officeapps.live.com/op/embed.aspx?src="+pptSource+"&wdAr=1.7777777777777777' frameborder='0'>\n" +
        "        </iframe>");

}

/**
 * 初始化Dialog，以便在非Chrome浏览器上使用
 * @param dialogId
 */
function initDialog(dialogId){
    var dialog = document.querySelector(dialogId);
    if (! dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
}

/**
 * 关闭旧的Dialog(如果有)，显示新的Dialog
 * @param dialogId
 */
function openDialog(dialogId){
    if($('body').find('dialog').length > 0){
        $('body').find('dialog').removeAttr("open");
    }
    document.querySelector(dialogId).showModal();
}

