$(document).ready(function(){
    //
    //
    // $(".add-award-btn").click(function(){
    //     console.log('text');
    //     var oo= $(this).parent().parent().parent();
    //     addAward(oo);
    //     console.log(2);
    // });

    $(".delete-btn").click(function(){
        // 先在服务器端删除奖项，然后再删除页面元素

        // 以下语句用来删除页面元素
        $(this).parent().parent().parent().remove();
    });



});

function addGrade(oo,priceNumber){
    // 添加奖项元素
    oo.append("<ul class=\"mdl-list vote-list add-award-btn\">\n" +
        "                                <li class=\"mdl-list__item vote-list--question\">\n" +
        "                                    <span class=\"mdl-list__item-primary-content\">\n" +
        "                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+priceNumber+".&nbsp;&nbsp;\n" +
        "                                          <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n" +
        "                                            <input name=\"lottery[0][lottery]["+(priceNumber-1)+"][grade]\" class=\"mdl-textfield__input\" style=\"outline:none;\" placeholder=\"奖项等级\" type=\"text\">\n" +
        "                                          </div>\n" +
        "                                        <button class=\"mdl-button mdl-js-button mdl-button--colored mdl-js-ripple-effect\" onclick=\"addNewAward()\" type=\"button\">\n" +
        "                                           添加奖项\n" +
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
        "                                            <input name=\"lottery[0][lottery]["+(priceNumber-1)+"][awards][0][award]\" class=\"mdl-textfield__input\" style=\"outline:none;\" placeholder=\"奖品名称\" type=\"text\">\n" +
        "                                          </div>\n" +
        "                                    </span>\n" +
        "                                </li>\n" +
        "                                <li class=\"mdl-list__item vote-list--answer\">\n" +
        "                                    <span class=\"mdl-list__item-primary-content\">\n" +
        "                                      <i class=\"material-icons\">aa</i>\n" +
        "                                        <!--field with Floating Label -->\n" +
        "                                          <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n" +
        "                                            <input name=\"lottery[0][lottery]["+(priceNumber-1)+"][awards][0][num]\" class=\"mdl-textfield__input\" style=\"outline:none;\" placeholder=\"可获奖人数(数字)\" type=\"number\">\n" +
        "                                          </div>\n" +
        "                                    </span>\n" +
        "                                </li>\n" +
        "                            </ul>");
}

function addAward(oo) {
    console.log('test');
    oo.append('<li class="mdl-list__item vote-list--answer"><span class="mdl-list__item-primary-content"><i class="material-icons">aa</i><div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><input name="lottery[0][lottery]['+(priceNumber-1)+'][awards]['+($(oo).children().length-2)+'][award]" class="mdl-textfield__input" style="outline:none;" placeholder="奖品名称" type="text"></div></span></li><li class="mdl-list__item vote-list--answer"><span class="mdl-list__item-primary-content"><i class="material-icons">aa</i><div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><input name="lottery[0][lottery]['+(priceNumber-1)+'][awards]['+($(oo).children().length-2)+'][num]" class="mdl-textfield__input" style="outline:none;" placeholder="可获奖人数" type="number"></div></span></li></ul>');
}
