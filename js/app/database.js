/**
 * Created by lenovo on 2015/11/26.
 */
var bigData={//全局概览
    init:function(){
        var scope=this;
        common.menuSelect(0);//选中导航
        scope.overviewInt();//总体概览
        scope.bomdataInt();//B/O/M域数据统计
        scope.serviceInt();//服务总览
        scope.serCaiInt();//服务采集分发流程
    },
    //总体概览
    overviewInt:function(){
        var scope=this;
        var url="/console/ebus/customerWebService/getClusterOveralState";
        //请求
        $.ajax({
             type : 'POST',
             url : url,
             timeout:10000,
             dataType:"json",
             contentType:"application/json",
             success : function(data) {
                if(data){
                    scope.topTendataInt(data.top10Rank);//TOP10数据接入厂商
                    scope.runingInt(data.controlFlowStatistic);//运行监控
                    $("#overNormalDays").text(data.normalDays);
                    $("#overNodeNum").text(data.nodeNum);
                    $("#overTotalSize").text(data.totalSize);
                    $("#overUsedSize").text(data.usedSize);
                }
             },
             error:function(){
                console.log("error-总体概览");
             }
         })
    },
    //B/O/M域数据统计
    bomdataInt:function(ec){
        // 路径配置
        require.config({
            paths: {
                echarts: 'js/echart'
            }
        });
        var url="/console/ebus/customerWebService/getDataManageDomain";
        
        //请求
        $.ajax({
             type : 'POST',
             url : url,
             timeout:10000,
             dataType:"json",
             contentType:"application/json",
             success : function(data) {
                if(data){
                    var dataValue=[];
                    for(var mi=0;mi<data.length;mi++){
                        if(data[mi].domainName=="O"){
                            for(var oi=0;oi<data[mi].dataList.length;oi++){
                                dataValue.push({name:data[mi].dataList[oi].dataName,value:parseFloat(data[mi].dataList[oi].dataSize),itemStyle: {normal: {color: '#00b7ee',borderWidth:1,borderColor: '#fff'}}});
                            }
                        }else if(data[mi].domainName=="M"){
                            for(var ci=0;ci<data[mi].dataList.length;ci++){
                                dataValue.push({name:data[mi].dataList[ci].dataName,value:parseFloat(10),itemStyle: {normal: {color:'#86bc70',borderWidth:1,borderColor: '#fff'}}});
                            }
                        }else if(data[mi].domainName=="B"){
                            for(var bi=0;bi<data[mi].dataList.length;bi++){
                                dataValue.push({name:data[mi].dataList[bi].dataName,value:parseFloat(data[mi].dataList[bi].dataSize),itemStyle: {normal: {color:'#f8b551',borderWidth:1,borderColor:'#fff'}}});
                            } 
                        }
                    }
                    //参数配置
                    var option = {
                        tooltip : {//提示框
                            trigger: 'item',
                            formatter: "{b}: {c}"
                        },
                        toolbox: {//多共嫩按钮区
                            feature : {
                                mark : {show: false},//功能按钮
                                dataView : {show: false, readOnly: false},//数据转换
                                restore : {show: false},//刷新
                                saveAsImage : {show: false}//保存问图片
                            }
                        },
                        calculable : false,
                        series : [//文字
                            {
                                name:'',
                                type:'treemap',
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true,
                                            formatter: "{b}",
                                            textStyle: {//字体
                                                fontFamily:'微软雅黑',
                                                color: '#fff'
                                            }
                                        },
                                        borderWidth: 1
                                    },
                                    emphasis: {
                                        label: {
                                            show: true
                                        }

                                    }
                                },
                                data:dataValue
                            }
                        ]
                    };
                    //...使用
                    require(
                        [
                            'echarts',
                            'echarts/chart/treemap' // ʹ配置所需图片类型插件
                        ],
                        //加载图表
                        function(ec){
                            //图表渲染的容器对象
                            var chartContainer = document.getElementById("bomContMain");
                            //加载图表
                            var myChart = ec.init(chartContainer);
                            myChart.setOption(option);
                        }
                    );
                }
             },
             error:function(){
                console.log("error-B/O/M域数据资产分布");
             }
         })
    },
    //TOP10数据接入厂商
    topTendataInt:function(valueData,ec){
        var valueName=[];
        var sizeValue=[];
        var colorValue=[];
        if(valueData){
            for(var vi=valueData.length-1;vi>=0;vi--){
                valueName.push(valueData[vi].companyName);
                sizeValue.push(valueData[vi].dataSize);
                if(valueData[vi].dataState=="1"){
                    colorValue.push("#86ba6f");
                }else{
                    colorValue.push("#e5e5e5");
                }
            }
        }
        // 路径配置
        require.config({
            paths: {
                echarts: 'js/echart'
            }
        });

        //参数配置
        var option = {
            tooltip : {
                trigger: 'axis',
                formatter: "{b}: {c}",
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'none'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid:{
                x:60,
                y:35,
                x2:30,
                y2:40,
                borderWidth:0

            },
            toolbox: {
                show : false
            },
            calculable : false,
            xAxis : [//横轴
                {
                    type : 'value',
                    show: false,
                    splitLine:{ show:false },//网格
                    axisLine:{//轴线
                        lineStyle:{
                            color: '#ccc',
                            width: 1,
                            type: 'solid'
                        }
                    },
                    axisLabel:{
                        textStyle:{
                            fontFamily:"microsoft yahei"
                        }
                    }
                }

            ],
            yAxis : [//纵轴
                {
                    type : 'category',
                    splitLine:{ show:false },//网格
                    axisLine:{//轴线
                        show:true,
                        lineStyle:{
                            color: '#ccc',
                            width: 1,
                            type: 'solid'
                        }
                    },
                    axisLabel:{
                        textStyle:{
                            fontFamily:"microsoft yahei"
                        }
                    },
                    data : valueName
                }
            ],
            series : [
                {
                    type:'bar',
                    data:sizeValue,
                    itemStyle: {
                        normal: {
                            label : {
                                show: true,
                                textStyle:{
                                    color:"#333"
                                }
                            },
                            color: function(params) {
                                // build a color map as your need.
                                var colorList = colorValue;
                                return colorList[params.dataIndex]
                            }
                        }
                    },

                }
            ]
        };


        //...使用
        require(
            [
                'echarts',
                'echarts/chart/bar' // ʹ配置所需图片类型插件
            ],
            //加载图表
            function(ec){
                //图表渲染的容器对象
                var chartContainer = document.getElementById("topCanvas");
                //加载图表
                var myChart = ec.init(chartContainer);
                myChart.setOption(option);
            }
        );
    },
    //服务总览
    serviceInt:function(ec){
        var url="/console/ebus/customerWebService/getClusterComState";
        var dataName=[];
        var dataNormal=[];
        var dataAbnormal=[];
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
                    for(var i=data.children.length-1;i>=0;i--){
                        dataName.push(data.children[i].comType);
                        dataNormal.push(data.children[i].comState.normal);
                        dataAbnormal.push("-"+data.children[i].comState.abnormal);
                    }
                    //参数配置
                    var option = {
                        tooltip : {
                            trigger: 'axis',
                            formatter:function(data){
                                return data[0].name+"<br/>"+data[0].seriesName+":"+data[0].value+"<br/>"+ data[1].seriesName+":"+(-data[1].value);       
                            },
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'none'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid:{
                            x:90,
                            y:35,
                            x2:25,
                            y2:40,
                            borderWidth:0

                        },
                        legend: {
                            show:false,
                            data:['故障', '正常']
                        },
                        toolbox: {
                            show : false,
                        },
                        calculable : false,
                        xAxis : [
                            {
                                type : 'value',
                                show: false,
                                splitLine:{ show:false },//网格
                                axisLine:{//轴线
                                    show:true,
                                    lineStyle:{
                                        color: '#ccc',
                                        width: 1,
                                        type: 'solid'
                                    }
                                }
                            }
                        ],
                        yAxis : [
                            {
                                type : 'category',
                                splitLine:{ show:false },//网格
                                axisLine:{//轴线
                                    show:true,
                                    lineStyle:{
                                        color: '#ccc',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                                axisTick : {show: false},
                                data : dataName
                            }
                        ],
                        series : [
                            {
                                name:'正常',
                                type:'bar',
                                stack: '总量',
                                itemStyle: {normal: {
                                    label : {show: true,textStyle:{
                                            color:"#333"
                                        }
                                    },//值控制
                                    color:'#86ba6f'
                                }},
                                data:dataNormal
                            },
                            {
                                name:'故障',
                                type:'bar',
                                stack: '总量',
                                itemStyle: {normal: {
                                    color:'#d50100',
                                    label : {show: true, position: 'left',textStyle:{
                                            color:"#333"
                                        },
                                        formatter:function(parmer){
                                            if(parmer.value!="-0"){
                                                return -parmer.value;
                                            }
                                        }
                                    }
                                }},
                                data:dataAbnormal
                            }
                        ]
                    };
                    //...使用
                    require(
                        [
                            'echarts',
                            'echarts/chart/bar' // ʹ配置所需图片类型插件
                        ],
                        //加载图表
                        function(ec){
                            //图表渲染的容器对象
                            var chartContainer = document.getElementById("servicrShow");
                            //加载图表
                            var myChart = ec.init(chartContainer);
                            myChart.setOption(option);
                        }
                    );
                }
             },
             error:function(){
                console.log("error-服务总览");
             }
         })      
    },
    //运行监控
    runingInt:function(valueData,ec){
        var nameValue=[];
        var sizeValue=[];
        var colorValue=[];
        for(var i=0;i<valueData.length;i++){
            nameValue.push(valueData[i].flowType);
            sizeValue.push(valueData[i].flowSize);
            if(valueData[i].flowState=="planed"){
                colorValue.push("#c3ddb6");
            }else if(valueData[i].flowState=="suspend" || valueData[i].flowState=="fail"){
                colorValue.push("#d60000");
            }else if(valueData[i].flowState=="delay"){
                colorValue.push("#ffd600");
            }else{
                colorValue.push("#86ba6f");
            }
        }
        // 路径配置
        require.config({
            paths: {
                echarts: 'js/echart'
            }
        });

        //参数配置
        var option = {
            tooltip : {
                trigger: 'axis',
                formatter: "{b}: {c}",
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'none'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid:{
                x:40,
                y:35,
                x2:30,
                y2:40,
                borderWidth:0

            },
            legend: {
                show:false,
                data:['数量']
            },
            toolbox: {
                show : false
            },
            calculable : false,
            xAxis : [
                {
                    type : 'category',
                    splitLine:{ show:false },//网格
                    axisLine:{//轴线
                        show:true,
                        lineStyle:{
                            color: '#ccc',
                            width: 1,
                            type: 'solid'
                        }
                    },
                    data : nameValue
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    show: false,
                    splitLine:{ show:false },//网格
                    axisLine:{//轴线
                        show:true,
                        lineStyle:{
                            color: '#ccc',
                            width: 1,
                            type: 'solid'
                        }
                    }
                }
            ],
            series : [
                {
                    name:'数量',
                    type:'bar',
                    data:sizeValue,
                    itemStyle: {
                        normal: {
                            label : {
                                show: true,
                                textStyle:{
                                    color:"#333"
                                }
                            },
                            color: function(params) {
                                // build a color map as your need.
                                var colorList = colorValue;
                                return colorList[params.dataIndex]
                            }
                        }
                    }
                }
            ]
        };


        //...使用
        require(
            [
                'echarts',
                'echarts/chart/bar' // ʹ配置所需图片类型插件
            ],
            //加载图表
            function(ec){
                //图表渲染的容器对象
                var chartContainer = document.getElementById("runCanvas");
                //加载图表
                var myChart = ec.init(chartContainer);
                myChart.setOption(option);
            }
        );
    },
    //服务采集分发流程
    serCaiInt:function(){
        var url="/console/ebus/customerWebService/getOverallColDisStat";
        //请求
        $.ajax({
             type : 'POST',
             url : url,
             timeout:10000,
             dataType:"json",
             contentType:"application/json",
             success : function(data) {
                if(data){
                    var contHeight=380;
                    var contObj=$("#clistShow");
                    $("#dataClassNum").text(data.sourceNum);
                    $("#dataTotal").text(data.colSize);
                    $("#facNum").text(data.companyNum);
                    $("#etlLmun").text(data.etlNum);
                    $("#fenfanum").text(data.distrSize);
                    var leftData=data.colList;
                    var rightData=data.distrList;
                    var valueData=[];
                    for(var li=0;li<leftData.length;li++){
                        var thisSize=leftData[li].dataSize/data.colSize;
                        valueData.push(thisSize);
                        var valueHtml="";
                        valueHtml+="<div>";
                        for(var ci=0;ci<leftData[li].dataList.length;ci++){
                            valueHtml+="<p>"+leftData[li].dataList[ci].dataModule+"</p>";
                        }
                        valueHtml+="</div><p class='jishub'>"+parseInt(thisSize*100)+"%</p><span class='xianData"+(li+1)+"'>"+leftData[li].dataName+" "+leftData[li].dataSize.toFixed(1)+"(TB)</span>";
                        $("#clSHow"+(li+1)).append(valueHtml);
                    }
                    contObj.find("li").each(function(i){//垂直居中，高度超出隐藏
                        var thisValue=valueData[i];
                        contObj.find("li").eq(i).height(contHeight*thisValue);
                        var contobjMain=contObj.find("li").eq(i).find("div");
                        var contObjMainHeight=contobjMain.height();
                        if(contObjMainHeight>contHeight*thisValue && contObjMainHeight>16){
                            contobjMain.height(contHeight*thisValue-7);
                            contobjMain.after("<p style='width:135px;position:absolute;bottom:0;text-align:center;'>...</p>");
                            contObjMainHeight=contobjMain.height();
                        }
                        $(this).hover(function(){//提示框
                            var text=$(this).children("div").html();
                            $(this).children("div").after("<ol class='positionObj'>"+text+"</ol>");
                        },function(){
                            $(this).children("div").next("ol").remove();
                        });
                        contObj.find("li").eq(i).find("div").css("margin-top",(contHeight*thisValue-contObjMainHeight)/2>0?(contHeight*thisValue-contObjMainHeight)/2:0+"px");//上下居中

                    })
                    //流程线
                    var liObj1=contObj.find("li").eq(0);
                    var liObj2=contObj.find("li").eq(1);
                    var liObj3=contObj.find("li").eq(2);
                    var svgHeight1=185-(liObj1.height()+10);
                    liObj2.find("svg").height(svgHeight1);
                    liObj2.find("svg").find("path").attr("d","M0 5 l110 0 M110 5 l0 "+(svgHeight1-3)+" M110 "+(svgHeight1-1)+" l75 0");
                    var svgHeight2=214-(liObj1.height()+liObj2.height()+20);
                    liObj3.find("svg").height(svgHeight2);
                    liObj3.find("svg").find("path").attr("d","M0 5 l100 0 M100 5 l0 "+(svgHeight2-5)+" M100 "+(svgHeight2-1)+" l84 0");
                    var dataListSt=$("#dataListSt");
                    var placeLast=$("#placeLast");
                    var rightValue=[];
                    var rightHtml="";
                    var rightDataHtml="";
                    for(var ri=0;ri<rightData.length;ri++){
                        for(var ci=0;ci<rightData[ri].dataList.length;ci++){
                            rightValue.push(rightData[ri].dataList[ci].dataModule);
                            
                        }
                        rightDataHtml+="<p class='rightBdata' id='rightBdata"+ri+"'>"+rightData[ri].dataSize.toFixed(1)+"(TB)</p>";
                    }
                    for(var vi=0;vi<rightValue.length;vi++){
                        rightHtml+="<li class='xianxi"+(vi+1)+"'>"+rightValue[vi]+"</li>";
                    }
                    placeLast.append(rightDataHtml);
                    dataListSt.append(rightHtml);
                }
             },
             error:function(){
                console.log("error-服务采集分发流程");
             }
        });
    }
};
