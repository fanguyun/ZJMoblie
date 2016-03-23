/**
 * Created by lenovo on 2015/12/7.
 */
var hdfsShow={
    init:function(){
        var scope=this;
        common.menuSelect(2);//选中导航
        scope.hdfsinit();
    },
    hdfsinit:function(){
        var machList=$("#machList");
        var machtml="";
        var thisClass;
        var url="/console/ebus/customerWebService/getClusterPosition";
        var parmer=[
            {"cluster_id":"1"},
            {"room_id":"SQ4-2F"},
            {"room_row_id":"D"}
        ];
        //请求
        $.ajax({
            type : 'POST',
            url : url,
            timeout:10000,
            data:JSON.stringify(parmer),
            dataType:"json",
            contentType:"application/json",
            success : function(machData) {
                if(machData){
                    for(var mi=0;mi<machData.length;mi++){
                        var thisName="";
                        /*if(machData[mi].stats=="yes"){
                            
                            thisClass="machShowListok";
                        }else{
                            thisClass="machShowList";
                        }*/
                        if(mi+1<10){
                           thisName="D0"+(mi+1)+"列"; 
                        }else{
                           thisName="D"+(mi+1)+"列";  
                        }
                        thisClass="machShowListok";
                        machtml+="<ul class='machShow'><li class='machText'>"+thisName+"</li><li class='"+thisClass+"'>";
                        if(machData[mi].positionList){
                            var thisBottom=0;
                            for(var si=0;si<machData[mi].positionList.length;si++){
                                thisBottom=si*15+30;
                                var statusl="normal";
                                if(mi=="5" && si=="3" || mi=="10" && si=="1" || mi=="2" && si=="4" || mi=="8" && si=="1" || mi=="13" && si=="5" || mi=="13" && si=="2"){
                                    statusl="warn";
                                }
                                //machtml+="<span class='"+machData[mi].positionList[si].state+"' style='bottom:"+thisBottom+"px'><div><p>服务器名:"+machData[mi].positionList[si].serverName+"</p><p>IP地址:"+machData[mi].positionList[si].ipAddress+"</p><p>机器型号:"+machData[mi].positionList[si].serverVersion+"</p></div></span>";
                                machtml+="<span class='"+statusl+"' style='bottom:"+thisBottom+"px'><div><p>服务器名: "+machData[mi].positionList[si].serverName+"</p><p>IP地址: "+machData[mi].positionList[si].ipAddress+"</p><p>机器型号: "+machData[mi].positionList[si].serverVersion+"</p></div></span>";
                            }
                        }
                        machtml+="</li></ul>";
                    }
                    machList.html(machtml);
                }
                
            },
            error:function(){
                console.log("error-设备视图");
            }
        })
        
    }

}