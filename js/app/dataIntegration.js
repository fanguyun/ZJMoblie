/**
 * Created by lenovo on 2015/11/28.
 */
var dataIntegration={//数据集成
    init:function(){
        var scope=this;
        common.menuSelect(1);//选中导航
        scope.etlLineInt();//etl控制流计划分布
        scope.dataFlowInt();//数据集成流向
    },
    //数据集成流向
    dataFlowInt:function(){
        var dataBoss=$("#dataBoss");
        var factyList=$("#factyList");
        var etlKfa=$("#etlKfa");
        var hadPoo=$("#hadPoo");
        var baseList=$("#baseList");
        var overWidth=20;
        var top=0;
        var dataBossData=[],factyListData=[],etlKfaData=[],hadPooData=[],baseListData=[];
        var url="gadgets/dataFlow/getDataFowTopology.json";
        //var url="/console/ebus/customerWebService/getDataFowTopology";
        //请求
        $.ajax({
             type : 'POST',
             url : url,
             timeout:10000,
             dataType:"json",
             contentType:"application/json",
             success : function(data) {
                if (data) {
                    dataBossData=data.dataFlowPhaseList[0];
                    factyListData=data.dataFlowPhaseList[1];
                    etlKfaData=data.dataFlowPhaseList[2];
                    hadPooData=data.dataFlowPhaseList[3];
                    baseListData=data.dataFlowPhaseList[4];
                    //数据源
                    var dataBossHtml="";
                    var dataValue=[];
                    dataBossHtml+="<h4>"+dataBossData.phaseName+"</h4><ul>";
                    for(var di=0;di<dataBossData.dataFlowNodeList.length;di++){
                        var dcid=[],lineWidth=[];
                        if(dataBossData.dataFlowNodeList[di].dataFlowList){
                            //var smallHtml="<p>"+factyListData.phaseName+":</p>";
                            for(var si=0;si<dataBossData.dataFlowNodeList[di].dataFlowList.length;si++){
                                dcid.push(dataBossData.dataFlowNodeList[di].dataFlowList[si].nodeId);
                                lineWidth.push(dataBossData.dataFlowNodeList[di].dataFlowList[si].width);
                                //smallHtml+="<p>"+dataBossData.dataFlowNodeList[di].dataFlowList[si].nodeName+":"+dataBossData.dataFlowNodeList[di].dataFlowList[si].width+"</p>"
                            }
                        }
                        dcid.join(",");
                        var thisMath=dataBossData.dataFlowNodeList[di].width*1024*1024*8/60/60/12;
                        thisMath>50?thisMath:thisMath=50;
                        dataBossHtml+="<li mid='"+dataBossData.dataFlowNodeList[di].nodeId+"' dcid='"+dcid+"' linewidth='"+lineWidth+"'><span>"+dataBossData.dataFlowNodeList[di].nodeName+"</span><div class='shujulTips'><p>"+dataBossData.dataFlowNodeList[di].nodeName+"</p><p>"+thisMath.toFixed(1)+"kb/s</p></div></li>";
                        dataValue.push(dataBossData.dataFlowNodeList[di].width);
                    }
                    dataBossHtml+="</ul>";
                    dataBoss.html(dataBossHtml);
                    var dataBossColor=["#f6b14c","#fddda0","#f38d4f","#cd9950","#ffafae","#ffa8ca","#ffb183","#3bc0e1","#a4fffa","#c0e5b1","#a4edff","#56bfb8","#3be1d7","#ffafae","#ffa8ca","#ffb183","#3bc0e1"];
                    dataBoss.find("ul>li").each(function(i){
                        var thisHeight=overWidth*dataValue[i];
                        if(thisHeight>90){
                            thisHeight=90;
                        }
                        $(this).css({"background":dataBossColor[i],"height":thisHeight+"px"});
                        if($(this).height()<8){//文字位置
                            $(this).find("span").css({"top":"-5px"});
                        }else{
                            $(this).find("span").css({"height":$(this).height()+"px","line-height":$(this).height()+"px"});
                        }
                    })
                    //接入厂商
                    var factyListHtml="";
                    var factyValue=[];
                    factyListHtml+="<h4>"+factyListData.phaseName+"</h4><ul>";
                    for(var di=0;di<factyListData.dataFlowNodeList.length;di++){
                        var dcid=[],ecid=[],lineWidth1=[],lineWidth2=[];
                        if(factyListData.dataFlowNodeList[di].dataFlowList){
                            for(var si=0;si<factyListData.dataFlowNodeList[di].dataFlowList.length;si++){
                                var nodeId=factyListData.dataFlowNodeList[di].dataFlowList[si].nodeId;
                                if(nodeId>=200 && nodeId<300){
                                    dcid.push(nodeId);
                                    lineWidth1.push(factyListData.dataFlowNodeList[di].dataFlowList[si].width);
                                }else{
                                    ecid.push(nodeId);
                                    lineWidth2.push(factyListData.dataFlowNodeList[di].dataFlowList[si].width);
                                }
                                
                                
                            }
                        }
                        dcid.join(",");
                        var thisMath=factyListData.dataFlowNodeList[di].width*1024*1024*8/60/60/12;
                        thisMath>50?thisMath:thisMath=50;
                        factyListHtml+="<li fid='"+factyListData.dataFlowNodeList[di].nodeId+"' eid='"+dcid+"' hid='"+ecid+"' linewidth1='"+lineWidth1+"' linewidth2='"+lineWidth2+"'><span>"+factyListData.dataFlowNodeList[di].nodeName+"</span><div class='shujulTips'><p>"+factyListData.dataFlowNodeList[di].nodeName+"</p><p>"+thisMath.toFixed(1)+"kb/s</p></div></li>";
                        factyValue.push(factyListData.dataFlowNodeList[di].width);
                    }
                    factyListHtml+="</ul>";
                    factyList.html(factyListHtml);
                    var factyListColor=["#51b133","#024593","#2c0b73","#f94e56","#dc7809","#023f98","#0197d2","#20287b","#bd1e18","#1c4289","#29a7d7","#446fb3","#2e8fc2","#023f98","#0197d2","#20287b","#bd1e18"];
                    factyList.find("ul>li").each(function(i){
                        var thisHeight=overWidth*factyValue[i];
                        if(thisHeight>90){
                            thisHeight=90;
                        }
                        $(this).css({"background":factyListColor[i],"height":thisHeight+"px"});
                        if($(this).height()<8){//文字位置
                            $(this).find("span").css({"top":"-5px"});
                        }else{
                            $(this).find("span").css({"height":$(this).height()+"px","line-height":$(this).height()+"px"});
                        }

                    })
                    //ETL+KAFKA
                    var etlKfaHtml="";
                    var etlValue=[];
                    etlKfaHtml+="<h4>"+etlKfaData.phaseName+"</h4><ul style='padding-top:280px;'>";
                    for(var di=0;di<etlKfaData.dataFlowNodeList.length;di++){
                        var dcid=[],bcid=[],lineWidth1=[],lineWidth2=[];
                        if(etlKfaData.dataFlowNodeList[di].dataFlowList){
                            for(var si=0;si<etlKfaData.dataFlowNodeList[di].dataFlowList.length;si++){
                                var nodeId=etlKfaData.dataFlowNodeList[di].dataFlowList[si].nodeId;
                                if(nodeId>=300 && nodeId<400){
                                    dcid.push(nodeId);
                                    lineWidth1.push(etlKfaData.dataFlowNodeList[di].dataFlowList[si].width);
                                }else{
                                    bcid.push(nodeId);
                                    lineWidth2.push(etlKfaData.dataFlowNodeList[di].dataFlowList[si].width);
                                }
                                
                            }
                        }
                        dcid.join(",");
                        var thisMath=etlKfaData.dataFlowNodeList[di].width*1024*1024*8/60/60/12;
                        thisMath>50?thisMath:thisMath=50;
                        etlKfaHtml+="<li eid='"+etlKfaData.dataFlowNodeList[di].nodeId+"' hid='"+dcid+"' bid='"+bcid+"' linewidth1='"+lineWidth1+"' linewidth2='"+lineWidth2+"'><span>"+etlKfaData.dataFlowNodeList[di].nodeName+"</span><div class='shujulTips'><p>"+etlKfaData.dataFlowNodeList[di].nodeName+"</p><p>"+thisMath.toFixed(1)+"kb/s</p></div></li>";
                        etlValue.push(etlKfaData.dataFlowNodeList[di].width);
                    }
                    etlKfaHtml+="</ul>";
                    etlKfa.html(etlKfaHtml);
                    var etlKfaColor=["#d7efcd","#3bc0e1","#a4fffa","#c0e5b1","#a4edff","#56bfb8","#3be1d7"];
                    etlKfa.find("ul>li").each(function(i){
                        var thisHeight=overWidth*etlValue[i];
                        if(thisHeight>90){
                            thisHeight=90;
                        }
                        $(this).css({"background":etlKfaColor[i],"height":thisHeight+"px"});
                        if($(this).height()<8){//文字位置
                            $(this).find("span").css({"top":"-5px"});
                        }else{
                            $(this).find("span").css({"height":$(this).height()+"px","line-height":$(this).height()+"px"});
                        }

                    })
                    //准实时交换
                    var hadPooHtml="";
                    var hadValue=[];
                    hadPooHtml+="<h4>"+hadPooData.phaseName+"</h4><ul style='padding-top:75px;'>";
                    for(var di=0;di<hadPooData.dataFlowNodeList.length;di++){
                        var dcid=[],lineWidth=[];
                        if(hadPooData.dataFlowNodeList[di].dataFlowList){
                            for(var si=0;si<hadPooData.dataFlowNodeList[di].dataFlowList.length;si++){
                                dcid.push(hadPooData.dataFlowNodeList[di].dataFlowList[si].nodeId);
                                lineWidth.push(hadPooData.dataFlowNodeList[di].dataFlowList[si].width); 
                            }
                        }
                        dcid.join(",");
                        var thisMath=hadPooData.dataFlowNodeList[di].width*1024*1024*8/60/60/12;
                        thisMath>50?thisMath:thisMath=50;
                        hadPooHtml+="<li hid='"+hadPooData.dataFlowNodeList[di].nodeId+"' bid='"+dcid+"' linewidth='"+lineWidth+"'><span>"+hadPooData.dataFlowNodeList[di].nodeName+"</span><div class='shujulTips'><p>"+hadPooData.dataFlowNodeList[di].nodeName+"</p><p>"+thisMath.toFixed(1)+"kb/s</p></div></li>";
                        hadValue.push(hadPooData.dataFlowNodeList[di].width);
                    }
                    hadPooHtml+="</ul>";
                    hadPoo.html(hadPooHtml);
                    var hadPooColor=["#cceaf2","#bd1e18","#1c4289","#29a7d7","#446fb3","#2e8fc2"];
                    hadPoo.find("ul>li").each(function(i){
                        var thisHeight=overWidth*hadValue[i];
                        if(thisHeight>90){
                            thisHeight=90;
                        }
                        $(this).css({"background":hadPooColor[i],"height":thisHeight+"px"});
                        if($(this).height()<8){//文字位置
                            $(this).find("span").css({"top":"-5px"});
                        }else{
                            $(this).find("span").css({"height":$(this).height()+"px","line-height":$(this).height()+"px"});
                        }
                    })
                    //分发地
                    var baseListHtml="";
                    var hadData=[];
                    baseListHtml+="<h4>"+baseListData.phaseName+"</h4><ul style='padding-top:20px;'>";
                    for(var di=0;di<baseListData.dataFlowNodeList.length;di++){
                        var dcid=[];
                        if(baseListData.dataFlowNodeList[di].dataFlowList){
                            for(var si=0;si<baseListData.dataFlowNodeList[di].dataFlowList.length;si++){
                                dcid.push(baseListData.dataFlowNodeList[di].dataFlowList[si].nodeId);
                            }
                        }
                        dcid.join(",");
                        var thisMath=baseListData.dataFlowNodeList[di].width*1024*1024*8/60/60/12;
                        thisMath>50?thisMath:thisMath=50;
                        baseListHtml+="<li bid='"+baseListData.dataFlowNodeList[di].nodeId+"'><span>"+baseListData.dataFlowNodeList[di].nodeName+"</span><div class='shujulTips'><p>"+baseListData.dataFlowNodeList[di].nodeName+"</p><p>"+thisMath.toFixed(1)+"kb/s</p></div></li>";
                        hadData.push(baseListData.dataFlowNodeList[di].width);
                    }
                    baseListHtml+="</ul>";
                    baseList.html(baseListHtml);
                    var baseListColor=["#ffa2c6","#ebd7d6","#f2e4ca","#ffd1b7","#ffafae","#dc7809","#023f98","#0197d2",];
                    baseList.find("ul>li").each(function(i){
                        var thisHeight=overWidth*hadData[i];
                        if(thisHeight>90){
                            thisHeight=90;
                        }
                        $(this).css({"background":baseListColor[i],"height":thisHeight+"px"});
                        if($(this).height()<8){//文字位置
                            $(this).find("span").css({"top":"-5px"});
                        }else{
                            $(this).find("span").css({"height":$(this).height()+"px","line-height":$(this).height()+"px"});
                        }
                    })
                    //高度自适应
                    $("#dataFlowCont").animate({
                        "height":dataBoss.height()>factyList.height()?dataBoss.height()+50:factyList.height()+50
                    },1000);
                    var diagonal = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });//声明对角线
                    var svg = d3.select("#dataFlowCont").append("svg")
                        .attr("width",0)
                        .attr("height",dataBoss.height())
                        .append("g")
                        .attr("transform", "translate(40,0)");
                    //流向图第一层
                    dataBoss.find("ul>li").each(function(i){
                        var endLine=0;
                        var liuBase=$(this).attr("dcid").split(",");
                        var lineBase=$(this).attr("lineWidth").split(",");
                        var overHeight=$(this).height();
                        for(var xt=0;xt<liuBase.length;xt++){
                            var svgWidth=overWidth*lineBase[xt];
                            if(svgWidth<2){
                               svgWidth=2 
                            }else if(svgWidth>overHeight){
                                svgWidth=overHeight;
                            }else if(svgWidth<overHeight){
                                endLine=(overHeight-svgWidth)/2;
                            }
                         //添加路劲
                         svg.append("path").attr("d",diagonal({
                             source:{x:($(this).offset().top+$(this).height()*0.5)-171,y:-3},
                             target:{x:factyList.find("li[fid="+liuBase[xt]+"]").offset().top+$(this).height()*0.5-172,y:240}
                         })).attr("fill","none").attr("stroke","#ccc").attr("fill-opacity","0.5").attr("stroke-opacity","0.5").attr("stroke-width",svgWidth);
                        }
                    })
                    //第二层
                    var fdataValue=[];
                    var flineBase=[];
                    var fthisData=[];
                    factyList.find("ul>li").each(function(i){
                        var eid=$(this).attr("eid");
                        var hid=$(this).attr("hid");
                        var edataValue=eid.split(",");
                        var hdataValue=hid.split(",");
                        if(eid && hid){
                            for(var li=0;li<edataValue.length+hdataValue.length;li++){
                                fthisData.push($(this).attr("fid"));
                            } 
                        }else{
                           fthisData.push($(this).attr("fid"));  
                        }
                        var lineBase1=$(this).attr("lineWidth1");
                        var lineBase2=$(this).attr("lineWidth2");
                        if(lineBase1){flineBase.push(lineBase1);}
                        if(lineBase2){flineBase.push(lineBase2);}
                        if(eid){fdataValue.push(eid);}
                        if(hid){fdataValue.push(hid);}
                    })
                    for(var xt=0;xt<fdataValue.length;xt++){
                        var endLine=0;
                        var thisObj=factyList.find("li[fid="+fthisData[xt]+"]");
                        var overHieght=thisObj.height();
                        if(fdataValue[xt]>=200 && fdataValue[xt]<300){
                            var svgWidth=overWidth*flineBase[xt];
                            if(svgWidth<2){
                               svgWidth=2 
                            }else if(svgWidth>overHieght){
                                svgWidth=overHieght;
                            }else if(svgWidth<overHieght){
                                endLine=(overHieght-svgWidth)/2;
                            }
                            
                            //添加路劲
                            svg.append("path").attr("d",diagonal({
                                source:{x:(thisObj.offset().top+thisObj.height()*0.5)-171,y:275},
                                target:{x:etlKfa.find("li[eid="+fdataValue[xt]+"]").offset().top+thisObj.height()*0.5-171-endLine,y:490}
                            })).attr("fill","none").attr("stroke","#ccc").attr("fill-opacity","0.5").attr("stroke-opacity","0.5").attr("stroke-width",svgWidth);
                        }else{
                            var svgWidth=overWidth*flineBase[xt];
                            if(svgWidth<2){
                               svgWidth=2 
                            }else if(svgWidth>overHieght){
                                svgWidth=overHieght;
                            }else if(svgWidth<overHieght){
                                endLine=(overHieght-svgWidth)/2;
                            }
                            //添加路劲
                            svg.append("path").attr("d",diagonal({
                                source:{x:(thisObj.offset().top+thisObj.height()*0.5)-171,y:275},
                                target:{x:hadPoo.find("li[hid="+fdataValue[xt]+"]").offset().top+thisObj.height()*0.5-171-endLine,y:710}
                            })).attr("fill","none").attr("stroke","#ccc").attr("fill-opacity","0.5").attr("stroke-opacity","0.5").attr("stroke-width",svgWidth);
                        }
                    }
                    //第三层
                    var edataValue=[];
                    var elineBase=[];
                    var ethisData=[];
                    etlKfa.find("ul>li").each(function(i){
                        var hid=$(this).attr("hid");
                        var bid=$(this).attr("bid");
                        var hdataValue=hid.split(",");
                        var bdataValue=bid.split(",");
                        if(hid && bid){
                            for(var li=0;li<hdataValue.length+bdataValue.length;li++){
                                ethisData.push($(this).attr("eid"));
                            } 
                        }else{
                           ethisData.push($(this).attr("eid"));  
                        }
                        var lineBase1=$(this).attr("lineWidth1");
                        var lineBase2=$(this).attr("lineWidth2");
                        if(lineBase1){elineBase.push(lineBase1);}
                        if(lineBase2){elineBase.push(lineBase2);}
                        if(hid){edataValue.push(hid);}
                        if(bid){edataValue.push(bid);}    
                    })
                    for(var xt=0;xt<edataValue.length;xt++){
                        var endLine=0;
                        var thisObj=etlKfa.find("li[eid="+ethisData[xt]+"]");
                        var overHieght=thisObj.height();
                        if(edataValue[xt]>=300 && edataValue[xt]<400){
                            var svgWidth=overWidth*elineBase[xt];
                            if(svgWidth<2){
                               svgWidth=2 
                            }else if(svgWidth>overHieght){
                                svgWidth=overHieght;
                            }else if(svgWidth<overHieght){
                                endLine=(overHieght-svgWidth)/2;
                            }
                            //添加路劲
                            svg.append("path").attr("d",diagonal({
                                source:{x:(thisObj.offset().top+thisObj.height()*0.5)-171,y:525},
                                target:{x:hadPoo.find("li[hid="+edataValue[xt]+"]").offset().top+thisObj.height()*0.5-171-endLine,y:710}
                            })).attr("fill","none").attr("stroke","#ccc").attr("fill-opacity","0.5").attr("stroke-opacity","0.5").attr("stroke-width",svgWidth);
                        }else{
                            var endLine=0;
                            var svgWidth=overWidth*elineBase[xt];
                            if(svgWidth<2){
                               svgWidth=2 
                            }else if(svgWidth>overHieght){
                                svgWidth=overHieght;
                            }else if(svgWidth<overHieght){
                                endLine=(overHieght-svgWidth)/2;
                            }
                            //添加路劲
                            svg.append("path").attr("d",diagonal({
                                source:{x:(thisObj.offset().top+thisObj.height()*0.5)-171,y:525},
                                target:{x:baseList.find("li[bid="+edataValue[xt]+"]").offset().top+thisObj.height()*0.5-171-endLine,y:937}
                            })).attr("fill","none").attr("stroke","#ccc").attr("fill-opacity","0.5").attr("stroke-opacity","0.5").attr("stroke-width",svgWidth);
                        }

                    }
                    //第四层
                    hadPoo.find("ul>li").each(function(i){
                        var bdatavalue=$(this).attr("bid").split(",");
                        var lineBase=$(this).attr("lineWidth").split(",");
                        var overHeight=$(this).height();
                        for(var xt=0;xt<bdatavalue.length;xt++){
                            var endLine=0;
                            var svgWidth=overWidth*lineBase[xt];
                                if(svgWidth<2){
                                   svgWidth=2;
                                }else if(svgWidth>overHeight){
                                    svgWidth=overHeight;
                                }else if(svgWidth<overHeight){
                                    endLine=(overHeight-svgWidth)/2;
                                }
                            //添加路劲
                            svg.append("path").attr("d",diagonal({
                                source:{x:($(this).offset().top+$(this).height()*0.5)-171,y:745},
                                target:{x:baseList.find("li[bid="+bdatavalue[xt]+"]").offset().top+$(this).height()*0.5-170-endLine,y:937}
                            })).attr("fill","none").attr("stroke","#ccc").attr("fill-opacity","0.5").attr("stroke-opacity","0.5").attr("stroke-width",svgWidth);
                        }
                    })
                    //svganimate
                    var svgObj=$("#dataFlowCont").find("svg");
                    svgObj.animate({
                        "width":1160
                    },3000);
                    
                }
             },
             error:function(){
                console.log("error-数据集成流向");
             }
         })        

    },
    //etl控制流计划分布
    etlLineInt:function(ec){
        var url="/console/ebus/customerWebService/getControlFowState.json";
        //var url="/console/ebus/customerWebService/getControlFowState";
        var planValue=[];
        var successValue=[];
        var failValue=[];
        var nowTime=parseInt(new Date().getHours().toLocaleString());//当前小时
        // 路径配置
        require.config({
            paths: {
                echarts: 'js/echart'
            }
        });
        //请求
        $.ajax({
             type : 'POST',
             url : url,
             timeout:10000,
             dataType:"json",
             contentType:"application/json",
             success : function(data) {
                if (data) {
                    for(var i=0;i<data.dataFlowPhaseList.length;i++){
                        planValue.push(data.dataFlowPhaseList[i].planed);
                        if(nowTime>=i){
                            successValue.push(data.dataFlowPhaseList[i].success);
                            failValue.push(data.dataFlowPhaseList[i].fail);
                        }else{
                            successValue.push({value:'-', symbol:'none'});
                        }
                    }
                    //参数配置
                    var option = {
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {           // 坐标轴指示器，坐标轴触发有效
                                type : 'line',        // 默认为直线，可选为：'line' | 'shadow'
                                lineStyle:{
                                    color: '#ccc',
                                    width: 1,
                                    type: 'solid'
                                }
                            }
                        },
                        grid:{
                            x:40,
                            y:20,
                            x2:40,
                            y2:70

                        },
                        legend: {
                            data:['计划执行控制流','实际执行成功控制流','实际执行失败控制流'],
                            y:'bottom'
                        },
                        toolbox: {
                            show : false
                        },
                        calculable : false,
                        xAxis : [
                            {
                                type : 'category',
                                axisLine:{//轴线
                                    show:false
                                },
                                splitLine:{ show:false },//网格
                                boundaryGap : false,
                                data : ['0:00','1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00']
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                splitLine:{ 
                                    show:true,
                                    lineStyle:{
                                        color: '#efefef',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },//网格
                                axisLine:{//轴线
                                    show:true,
                                    lineStyle:{
                                        color: '#00c1ff',
                                        width: 1,
                                        type: 'solid'
                                    }
                                }
                            },
                            {
                                type : 'value',
                                splitLine:{ show:false },//网格
                                axisLine:{//轴线
                                    show:true,
                                    lineStyle:{
                                        color: '#ff5757',
                                        width: 1,
                                        type: 'solid'
                                    }
                                }
                            }
                        ],
                        series : [
                            {
                                name:'计划执行控制流',
                                symbol: 'emptyCircle',//节点控制
                                symbolSize:3,
                                type:'line',
                                itemStyle:{
                                    normal:{
                                        color:'#00c0ff',
                                        lineStyle:{
                                            color:'#00c0ff'
                                        }
                                    }
                                },
                                data:planValue
                            },
                            {
                                name:'实际执行成功控制流',
                                symbol: 'emptyCircle',//节点控制
                                symbolSize:3,
                                type:'line',
                                itemStyle:{
                                    normal:{
                                        color:'#8fc321',
                                        lineStyle:{
                                            color:'#8fc321'
                                        }
                                    }
                                },
                                zlevel:1,//层级
                                data:successValue
                            },
                            {
                                name:'实际执行失败控制流',
                                symbol: 'none',
                                yAxisIndex:1,
                                type:'line',
                                itemStyle:{
                                    normal:{
                                        color:'#ff5757',
                                        lineStyle:{
                                            color:'#ff5757',
                                            width:1
                                        }
                                    }
                                },
                                data:failValue
                            }
                        ]
                    };
                    //...使用
                    require(
                        [
                            'echarts',
                            'echarts/chart/line' // ʹ配置所需图片类型插件
                        ],
                        //加载图表
                        function(ec){
                            //图表渲染的容器对象
                            var chartContainer = document.getElementById("etlLineCont");
                            //加载图表
                            var myChart = ec.init(chartContainer);
                            myChart.setOption(option);
                        }
                    );
                }
             },
             error:function(){
                console.log("error-etl控制流计划分布");
             }
         }) 
        
    },
};
