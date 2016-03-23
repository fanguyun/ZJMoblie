/**
 * Created by lenovo on 2015/11/28.
 */
//公共js
var common={
    init:function(){

    },
    //导航切换
    menuSelect:function(num){
        var topMenuObj=$("ul#mbTopMenu");
        topMenuObj.find("li").find("a").removeClass("menuSelect");
        topMenuObj.children("li").eq(num).children("a").addClass("menuSelect");
    },
    //ajax
    userInfoInt:function(get){
        $.ajax({
             type : 'POST',
             url : url,
             data:parmer,
             timeout:10000,
             dataType:"json",
             success : function(data) {
                 return data;
             },
             error : function() {
                console.log("error");
             }
        })
    }

}

