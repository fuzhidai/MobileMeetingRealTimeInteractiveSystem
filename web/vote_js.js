$(document).ready(function(){
    // $("#add-question-btn").on("click",(function(){;
    //     questionNumber += 1;
    //     var o = $("#vote-list-cell");
    //     addQuestion(o,questionNumber);
    //     // 在新添加的问题中增加“添加选项”按钮并附上js
    //     var list = o.children().last();
    //     var addChoiceBtn = list.find(".add-choice-btn");
    //     console.log($(addChoiceBtn));
    //     $(addChoiceBtn).on("click",function () {
    //         addChoice($(list));
    //     });
    // }));

    // $("#demo-show-toast").on("click",function(){
    //     $.ajax({
    //         cache: true,
    //         type: "POST",
    //         url:"upload.php",
    //         data:$('#vote_form').serialize(),// 你的formid
    //         async: false,
    //         error: function(request) {
    //             alert("Connection error:"+request.error);
    //         },
    //         success: function(data) {
    //             alert("SUCCESS!");
    //         }
    //     });
    // });

    // 添加选项元素
    $(".add-choice-btn").click(function(){
        var o= $(this).parent().parent().parent();
        addChoice(o);
        console.log(2);
    });

    $(".delete-btn").click(function(){
        // 先在服务器端删除投票问题，然后再删除页面元素

        // 以下语句用来删除页面元素
        $(this).parent().parent().parent().remove();
    });



});

function addQuestion(o,questionNumber) {
    o.append("<ul class=\"mdl-list vote-list\">\n" +
        "                                <li class=\"mdl-list__item vote-list--question\">\n" +
        "                                    <span class=\"mdl-list__item-primary-content\">\n" +
        "                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+questionNumber+".&nbsp;&nbsp;\n" +
        "                                          <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n" +
        "                                            <input name=\"vote["+(questionNumber-1)+"][question]\" class=\"mdl-textfield__input\" style=\"outline:none;\" placeholder=\"请输入投票问题\" type=\"text\">\n" +
        "                                            <input name=\"vote["+(questionNumber-1)+"][time]\" value=\""+CurentTime()+"\" class=\"mdl-textfield__input\" style=\"display:none;\" type=\"text\">\n" +
        "                                          </div>\n" +
        "                                        <label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"question-"+questionNumber+"-single\">\n" +
        "                                          <input type=\"radio\" id=\"question-"+questionNumber+"-single\" class=\"mdl-radio__button\" name=\"vote["+(questionNumber-1)+"][radio]\" value=\"true\" checked>\n" +
        "                                          <span class=\"mdl-radio__label\">单选</span>\n" +
        "                                        </label>\n" +
        "                                        <label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"question-"+questionNumber+"-multiple\">\n" +
        "                                          <input type=\"radio\" id=\"question-"+questionNumber+"-multiple\" class=\"mdl-radio__button\" name=\"vote["+(questionNumber-1)+"][radio]\" value=\"false\">\n" +
        "                                          <span class=\"mdl-radio__label\">多选</span>\n" +
        "                                        </label>\n" +
        "                                        <button class=\"mdl-button mdl-js-button mdl-button--colored mdl-js-ripple-effect add-choice-btn\" onclick=\"addNewChoice()\" type=\"button\">\n" +
        "                                           添加选项\n" +
        "                                        </button>\n" +
        "                                    </span>\n" +
        "                                    <span class=\"mdl-list__item-secondary-action\">\n" +
        "                                    </span>\n" +
        "                                </li>\n" +

        "                                <li class=\"mdl-list__item vote-list--answer\">\n" +
        "                                    <span class=\"mdl-list__item-primary-content\">\n" +
        "                                      <i class=\"material-icons\">aa</i>\n" +
        "                                        <!-- Textfield with Floating Label -->\n" +
        "                                          <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n" +
        "                                            <input name=\"vote["+(questionNumber-1)+"][choices][0]\" class=\"mdl-textfield__input\" style=\"outline:none;\"  placeholder=\"请输入选项\" type=\"text\">\n" +
        "                                          </div>\n" +
        "                                    </span>\n" +
        "                                </li>\n" +

        "                                <li class=\"mdl-list__item vote-list--answer\">\n" +
        "                                    <span class=\"mdl-list__item-primary-content\">\n" +
        "                                      <i class=\"material-icons\">aa</i>\n" +
        "                                        <!--field with Floating Label -->\n" +
        "                                          <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n" +
        "                                            <input name=\"vote["+(questionNumber-1)+"][choices][1]\"  class=\"mdl-textfield__input\" style=\"outline:none;\" placeholder=\"请输入选项\" type=\"text\">\n" +
        "                                          </div>\n" +
        "                                    </span>\n" +
        "                                </li>\n" +
        "                            </ul>");
}
function addChoice(o){
    o.append("<li class=\"mdl-list__item vote-list--answer\">\n" +
        "                                    <span class=\"mdl-list__item-primary-content\">\n" +
        "                                      <i class=\"material-icons\">aa</i>\n" +
        "                                        <!--field with Floating Label -->\n" +
        "                                          <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n" +
        "                                            <input name=\"vote["+questionNumber+"][choices]["+($(o).children().length-1)+"]\" class=\"mdl-textfield__input\" style=\"outline:none;\" placeholder=\"请输入选项\" type=\"text\" id=\"sample7\">\n" +
        "                                          </div>\n" +
        "                                    </span>\n" +
        "                                </li>");
}