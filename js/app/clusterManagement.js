/**
 * Created by lenovo on 2015/11/28.
 */
var clusterManagement={//集群管理
    init:function(){
        var scope=this;
        common.menuSelect(2);//选中导航
        scope.serOveviewInt();//服务总览
        scope.cpuUserInt();//CPU使用率
        scope.ramUserInt();//内存使用率
        scope.discUserInt();//CPU使用率分布
        scope.ramUserFbInt();//内存使用率分布
        scope.ypUserFbInt();//磁盘使用率分布
        scope.mbsUserFbInt();//网络读写速率
    },
    //获取时间
    getTimeInt:function(){
        var firstDate =parseInt(new Date().getHours().toLocaleString());//当前小时
        var secondDate = firstDate*60;
        if(secondDate<480){
            secondDate=480;
        }
        var dateArr=[];
        var dataList;
        for(var i=0;i<6;i++){
            dataList=(secondDate/60).toLocaleString();
            if(dataList.indexOf(".5")>-1){
                dataList=dataList.replace(".5",':30');
            }else{
                dataList=dataList+":00";
            }
            dateArr.push(dataList);
            secondDate-=30;
        }
        dateArr.reverse();//数组倒序排列
        return dateArr;
    },
    //服务总览
    serOveviewInt:function(ec){
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
                            y:15,
                            x2:20,
                            y2:30,
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
                                        color: '#48b',
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
                                    label : {show: true, position:'left',textStyle:{
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
                            },
                            {
                                name:'服务总览',
                                type:'pie',
                                tooltip : {
                                    trigger: 'item',
                                    formatter: '{a} <br/>{b}({d}%)'
                                },
                                center: [476,193],
                                radius : [12, 25],
                                itemStyle :　{
                                    normal : {
                                        label : {show: true,textStyle:{
                                            color:"#333"
                                        }},
                                        labelLine : {
                                            length : 20
                                        }
                                    }
                                },
                                data:[
                                    {
                                        value:data.normal, name:'正常'+data.normal+'台',
                                        itemStyle:{
                                            normal:{
                                                color:'#86ba6f',
                                                label:{
                                                    textStyle:{
                                                        color:'#86ba6f'
                                                    }
                                                },
                                                labelLine:{
                                                    lineStyle:{
                                                        color:'#cccccc'
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        value:data.abnormal, name:'故障'+data.abnormal+'台',
                                        itemStyle:{
                                            normal:{
                                                color:'#d50100',
                                                label:{
                                                    textStyle:{
                                                        color:'#d50100'
                                                    }
                                                },
                                                labelLine:{
                                                    lineStyle:{
                                                        color:'#cccccc'
                                                    }
                                                }
                                            }
                                        }
                                    },
                                ]
                            }

                        ]
                    };
                    //...使用
                    require(
                        [
                            'echarts',
                            'echarts/chart/bar', //配置所需图片类型插件
                            'echarts/chart/pie'
                        ],
                        //加载图表
                        function(ec){
                            //图表渲染的容器对象
                            var chartContainer = document.getElementById("serOverShow");
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
    //CPU使用率
    cpuUserInt:function(ec){
        //var url="gadgets/cpuUser/cpuUser.json";
        var url="/console/ebus/customerWebService/getClusterTotalRate";
        var dataValue=[];
        var scope=this;
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
             data:JSON.stringify({"rateType":"cpu"}),
             timeout:10000,
             dataType:"json",
             contentType:"application/json",
             success : function(data) {
                if(data){
                    for(var i=0;i<data.length;i++){
                        dataValue.push(data[i].rate);
                    }
                            //参数配置
                    var option = {
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'line',        // 默认为直线，可选为：'line' | 'shadow'
                                lineStyle:{
                                    color: '#ccc',
                                    width: 1,
                                    type: 'solid'
                                }
                            }
                        },
                        grid:{
                            x:25,
                            y:30,
                            x2:15,
                            y2:25

                        },
                        legend: {
                            data:['CPU使用率'],
                            show:false
                        },
                        toolbox: {
                            show : false
                        },
                        calculable : false,
                        xAxis : [
                            {
                                type : 'category',
                                axisLabel:{//坐标轴字体
                                    textStyle:{
                                        fontSize:10
                                    }
                                },
                                splitLine:{ //网格
                                    show:true,
                                    lineStyle:{
                                        color: '#efefef',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                                axisLine:{//轴线
                                    show:true,
                                    lineStyle:{
                                        color: '#ccc',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                                boundaryGap : false,
                                data : scope.getTimeInt()
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                splitLine:{ //网格
                                    show:true,
                                    lineStyle:{
                                        color: '#efefef',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
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
                                name:'CPU使用率',
                                type:'line',
                                symbol: 'emptyCircle',//节点控制
                                smooth:true,
                                itemStyle: {
                                    normal:{
                                        areaStyle: {type: 'default',color:'rgba(95, 201, 227, 0.65)'},
                                        color:'#5fc9e3',
                                        lineStyle:{
                                            color:'#5fc9e3',
                                            width:2
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
                            'echarts/chart/line' // ʹ配置所需图片类型插件
                        ],
                        //加载图表
                        function(ec){
                            //图表渲染的容器对象
                            var chartContainer = document.getElementById("cpuUserShow");
                            //加载图表
                            var myChart = ec.init(chartContainer);
                            myChart.setOption(option);
                        }
                    );
                }

             },
             error:function(){
                console.log("error-CPU使用率");
             }
         })
    },
    //内存使用率
    ramUserInt:function(ec){
        //var url="gadgets/ramUser/ramUser.json";
        var url="/console/ebus/customerWebService/getClusterTotalRate";
        var dataValue=[];
        var scope=this;
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
             data:JSON.stringify({"rateType":"mem"}),
             timeout:10000,
             dataType:"json",
             contentType:"application/json",
             success : function(data) {
                if(data){
                    for(var i=0;i<data.length;i++){
                        dataValue.push(data[i].rate);
                    }
                    //参数配置
                    var option = {
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'line',        // 默认为直线，可选为：'line' | 'shadow'
                                lineStyle:{
                                    color: '#ccc',
                                    width: 1,
                                    type: 'solid'
                                }
                            }
                        },
                        grid:{
                            x:25,
                            y:30,
                            x2:15,
                            y2:25

                        },
                        legend: {
                            data:['CPU使用率'],
                            show:false
                        },
                        toolbox: {
                            show : false
                        },
                        calculable : false,
                        xAxis : [
                            {
                                type : 'category',
                                axisLabel:{//坐标轴字体
                                    textStyle:{
                                        fontSize:10
                                    }
                                },
                                splitLine:{ //网格
                                    show:true,
                                    lineStyle:{
                                        color: '#efefef',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                                axisLine:{//轴线
                                    show:true,
                                    lineStyle:{
                                        color: '#ccc',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                                boundaryGap : false,
                                data : scope.getTimeInt()
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                splitLine:{ //网格
                                    show:true,
                                    lineStyle:{
                                        color: '#efefef',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
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
                                name:'CPU使用率',
                                type:'line',
                                symbol: 'emptyCircle',//节点控制
                                smooth:true,
                                itemStyle: {
                                    normal:{
                                        areaStyle: {type: 'default',color:'rgba(95, 201, 227, 0.65)'},
                                        color:'#5fc9e3',
                                        lineStyle:{
                                            color:'#5fc9e3',
                                            width:2
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
                            'echarts/chart/line' // ʹ配置所需图片类型插件
                        ],
                        //加载图表
                        function(ec){
                            //图表渲染的容器对象
                            var chartContainer = document.getElementById("ramUserShow");
                            //加载图表
                            var myChart = ec.init(chartContainer);
                            myChart.setOption(option);
                        }
                    );
                }

             },
             error:function(){
                console.log("error-内存使用率");
             }
         })  
    },
    //CPU使用率分布
    discUserInt:function(ec){
        //var url="gadgets/discUser/discUser.json";
        var url="/console/ebus/customerWebService/getClusterSingleRate";
        var dataValue=[];
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
             data:JSON.stringify({"rateType":"cpu"}),
             timeout:10000,
             dataType:"json",
             contentType:"application/json",
             success : function(data) {
                 if(data){
                    for(var i=0;i<data.length;i++){
                        dataValue.push(data[i].value);
                    }
                    //参数配置
                    var option = {
                        tooltip : {
                            trigger: '{b}:{c}'
                        },
                        grid:{
                            x:28,
                            y:30,
                            x2:10,
                            y2:25

                        },
                        legend: {
                            data:['CPU使用率分布'],
                            show:false
                        },
                        toolbox: {
                            show : true
                        },
                        calculable : false,
                        xAxis : [
                            {
                                type : 'category',
                                axisLabel:{//坐标轴字体
                                    textStyle:{
                                        fontSize:10
                                    }
                                },
                                splitLine:{ //网格
                                    show:true,
                                    lineStyle:{
                                        color: '#efefef',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                                axisLine:{//轴线
                                    show:true,
                                    lineStyle:{
                                        color: '#ccc',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                                data : ['0-25%','25-50%','50-75%','75-100%']
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                splitLine:{ //网格
                                    show:true,
                                    lineStyle:{
                                        color: '#efefef',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                                axisLine:{//轴线
                                    show:true,
                                    lineStyle:{
                                        color: '#ccc',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                            }
                        ],
                        series : [
                            {
                                name:'CPU使用率分布',
                                type:'bar',
                                itemStyle:{
                                    normal:{
                                        color:'#3bc0e1'
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
                            'echarts/chart/bar' // ʹ配置所需图片类型插件
                        ],
                        //加载图表
                        function(ec){
                            //图表渲染的容器对象
                            var chartContainer = document.getElementById("discUserShow");
                            //加载图表
                            var myChart = ec.init(chartContainer);
                            myChart.setOption(option);
                        }
                    );
                 }
             },
             error : function() {
                console.log("error-CPU使用率分布");
             }
        })    
    },
    //内存使用率分布
    ramUserFbInt:function(ec){
        //var url="gadgets/ramUserFb/ramUserFb.json";
        var url="/console/ebus/customerWebService/getClusterSingleRate";
        var dataValue=[];
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
             data:JSON.stringify({"rateType":"mem"}),
             timeout:10000,
             dataType:"json",
             contentType:"application/json",
             success : function(data) {
                if(data){
                    for(var i=0;i<data.length;i++){
                        dataValue.push(data[i].value);
                    }
                    //参数配置
                    var option = {
                        tooltip : {
                            trigger: '{b}:{c}'
                        },
                        grid:{
                            x:28,
                            y:30,
                            x2:10,
                            y2:25

                        },
                        legend: {
                            data:['内存使用率分布'],
                            show:false
                        },
                        toolbox: {
                            show : true
                        },
                        calculable : false,
                        xAxis : [
                            {
                                type : 'category',
                                axisLabel:{//坐标轴字体
                                    textStyle:{
                                        fontSize:10
                                    }
                                },
                                splitLine:{ //网格
                                    show:true,
                                    lineStyle:{
                                        color: '#efefef',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                                axisLine:{//轴线
                                    show:true,
                                    lineStyle:{
                                        color: '#ccc',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                                data : ['0-25%','25-50%','50-75%','75-100%']
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                splitLine:{ //网格
                                    show:true,
                                    lineStyle:{
                                        color: '#efefef',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                                axisLine:{//轴线
                                    show:true,
                                    lineStyle:{
                                        color: '#ccc',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                            }
                        ],
                        series : [
                            {
                                name:'内存使用率分布',
                                type:'bar',
                                itemStyle:{
                                    normal:{
                                        color:'#3bc0e1'
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
                            'echarts/chart/bar' // ʹ配置所需图片类型插件
                        ],
                        //加载图表
                        function(ec){
                            //图表渲染的容器对象
                            var chartContainer = document.getElementById("ramUserFbShow");
                            //加载图表
                            var myChart = ec.init(chartContainer);
                            myChart.setOption(option);
                        }
                    );
                }

             },
             error:function(){
                console.log("error-内存使用率分布");
             }
         })
    },
    //磁盘使用率分布
    ypUserFbInt:function(ec){
        //var url="gadgets/ypUser/ypUser.json";
        var url="/console/ebus/customerWebService/getClusterSingleRate";
        var dataValue=[];
        //路径配置
        require.config({
            paths: {
                echarts: 'js/echart'
            }
        });
        //请求
        $.ajax({
             type : 'POST',
             url : url,
             data:JSON.stringify({"rateType":"disk"}),
             timeout:10000,
             dataType:"json",
             contentType:"application/json",
             success : function(data) {
                if(data){
                    for(var i=0;i<data.length;i++){
                        dataValue.push(data[i].value);
                    }
                    //参数配置
                    var option = {
                        tooltip : {
                            trigger: '{b}:{c}'
                        },
                        grid:{
                            x:28,
                            y:30,
                            x2:10,
                            y2:25

                        },
                        legend: {
                            data:['磁盘使用率分布'],
                            show:false
                        },
                        toolbox: {
                            show : true
                        },
                        calculable : false,
                        xAxis : [
                            {
                                type : 'category',
                                axisLabel:{//坐标轴字体
                                    textStyle:{
                                        fontSize:10
                                    }
                                },
                                splitLine:{ //网格
                                    show:true,
                                    lineStyle:{
                                        color: '#efefef',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                                axisLine:{//轴线
                                    show:true,
                                    lineStyle:{
                                        color: '#ccc',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                                data : ['0-25%','25-50%','50-75%','75-100%']
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                splitLine:{ //网格
                                    show:true,
                                    lineStyle:{
                                        color: '#efefef',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                                axisLine:{//轴线
                                    show:true,
                                    lineStyle:{
                                        color: '#ccc',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                            }
                        ],
                        series : [
                            {
                                name:'磁盘使用率分布',
                                type:'bar',
                                itemStyle:{
                                    normal:{
                                        color:'#3bc0e1'
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
                            'echarts/chart/bar' // ʹ配置所需图片类型插件
                        ],
                        //加载图表
                        function(ec){
                            //图表渲染的容器对象
                            var chartContainer = document.getElementById("ypUserShow");
                            //加载图表
                            var myChart = ec.init(chartContainer);
                            myChart.setOption(option);
                        }
                    );  
                }

             },
             error:function(){
                console.log("error-磁盘使用率分布");
             }
         })      
    },
    //网络读写速率
    mbsUserFbInt:function(ec){
        //var url="gadgets/mbsUser/mbsUser.json";
        var url="/console/ebus/customerWebService/getClusterStreamRate";
        var dataValue=[];
        var dataValue2=[];
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
             //data:parmer,
             timeout:10000,
             dataType:"json",
             success : function(data) {
                if(data){
                    for(var i=0;i<data.length;i++){
                        dataValue.push(data[i].stream.in);
                        dataValue2.push(data[i].stream.out);
                    }
                    //参数配置
                    var option = {
                        tooltip : {
                            trigger: '{b}:{c}'
                        },
                        grid:{
                            x:28,
                            y:30,
                            x2:10,
                            y2:25

                        },
                        legend: {
                            data:['网络读速率','网络写速率'],
                            show:false
                        },
                        toolbox: {
                            show : true
                        },
                        calculable : false,
                        xAxis : [
                            {
                                type : 'category',
                                axisLabel:{//坐标轴字体
                                    textStyle:{
                                        fontSize:10
                                    }
                                },
                                splitLine:{ //网格
                                    show:true,
                                    lineStyle:{
                                        color: '#efefef',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                                axisLine:{//轴线
                                    show:true,
                                    lineStyle:{
                                        color: '#ccc',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                                data : ['0-25','25-50','50-75','>75']
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                splitLine:{ //网格
                                    show:true,
                                    lineStyle:{
                                        color: '#efefef',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                                axisLine:{//轴线
                                    show:true,
                                    lineStyle:{
                                        color: '#ccc',
                                        width: 1,
                                        type: 'solid'
                                    }
                                },
                            }
                        ],
                        series : [
                            {
                                name:'网络读速率',
                                type:'bar',
                                itemStyle:{
                                    normal:{
                                        color:'#3bc0e1'
                                    }
                                },
                                data:dataValue
                            },
                            {
                                name:'网络写速率',
                                type:'bar',
                                itemStyle:{
                                    normal:{
                                        color:'#86ba6f'
                                    }
                                },
                                data:dataValue2
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
                            var chartContainer = document.getElementById("mbsUserShow");
                            //加载图表
                            var myChart = ec.init(chartContainer);
                            myChart.setOption(option);
                        }
                    );
                }

             },
             error:function(){
                console.log("error-网络读写速率");
             }
         })  
    },
};
