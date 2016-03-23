    /**
 * Created by lenovo on 2015/11/28.
 */
var dataGovernance={//数据治理
    init:function(){
        var scope=this;
        common.menuSelect(3);//选中导航
        scope.bomListshow();//B/O/M域数据资产分布
        scope.tableSvgInt();//右侧表格增长趋势
        scope.tabSelectInt();//TAB切换
        scope.pathContInt();//主题域资产分布全景图
    },
    tabSelectInt:function(){
        var scope=this;
        var tabMenu=$("#tabMenu");//导航
        var tabCont=$("#tabMain");//内容
        var barSameShow=$("#barSameShow");//quanjing
        var barListShow=$("#barListShow");//xiangxi
        tabMenu.find("li").click(function(){
            var index=$(this).index();
            tabMenu.find("li").removeClass("active");
            $(this).addClass("active");
            tabCont.children("div").hide();
            tabCont.children("div").eq(index).fadeIn();
            if(index==1){
                barSameShow.fadeIn();
                barListShow.hide();
                $("#barListShowOne").hide().html("");
                $("#barListShowCont").attr("pageId",1).html("");
                $("#btnNext").unbind("click");
                $("#btnPrev").unbind("click");
            }
        })
    },
    //B/O/M域数据资产分布
    bomListshow:function(ec){
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
                            var odataShow=0;
                            for(var oi=0;oi<data[mi].dataList.length;oi++){
                                odataShow+=parseFloat(data[mi].dataList[oi].dataSize);
                                dataValue.push({name:data[mi].dataList[oi].dataName,value:parseFloat(data[mi].dataList[oi].dataSize),itemStyle: {normal: {color: '#00b7ee',borderWidth:1,borderColor: '#fff'}}});
                            }
                            $("#odataShow").text(odataShow.toFixed(1));
                        }else if(data[mi].domainName=="M"){
                            var mdataShow=0;
                            for(var ci=0;ci<data[mi].dataList.length;ci++){
                                mdataShow+=parseFloat(data[mi].dataList[ci].dataSize);
                                dataValue.push({name:data[mi].dataList[ci].dataName,value:parseFloat(data[mi].dataList[ci].dataSize),itemStyle: {normal: {color: '#80c269',borderWidth:1,borderColor: '#fff'}}});
                            }
                            $("#mdataShow").text(mdataShow.toFixed(1));
                        }else if(data[mi].domainName=="B"){
                            var bdataShow=0;
                            for(var bi=0;bi<data[mi].dataList.length;bi++){
                                bdataShow+=parseFloat(data[mi].dataList[bi].dataSize);
                                dataValue.push({name:data[mi].dataList[bi].dataName,value:parseFloat(data[mi].dataList[bi].dataSize),itemStyle: {normal: {color:'#f8b551',borderWidth:1,borderColor:'#fff'}}});
                            } 
                            $("#bdataShow").text(bdataShow.toFixed(1));
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
                            var chartContainer = document.getElementById("bomListShowCanvas");
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
    //右侧表格增长趋势
    tableSvgInt:function(){
        var diagonal = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });//声明对角线
        //O域
        var tableoData=[0.3,0.2,0.3,0.4,0.6,0.7,0.4,0.3,0.2,0.5];
        var svg = d3.select("#tableoSvg").append("svg")
            .attr("width",170)
            .attr("height",80)
            .append("g")
            .attr("transform", "translate(40,0)");
        for(var ti=0;ti<tableoData.length-1;ti++){
            //添加路劲
            svg.append("path").attr("d",diagonal({
                source:{x:80-(tableoData[ti]*80),y:17*ti-28},
                target:{x:80-(tableoData[ti+1]*80),y:17*(ti+1)-28}
            })).attr("fill","none").attr("stroke","#f88d4e").attr("stroke-width",2);

        }
        //B域
        var tablebData=[0.3,0.2,0.3,0.4,0.6,0.7,0.4,0.3,0.2,0.5];
        var svg1 = d3.select("#tablebSvg").append("svg")
            .attr("width",170)
            .attr("height",80)
            .append("g")
            .attr("transform", "translate(40,0)");
        for(var ti=0;ti<tableoData.length-1;ti++){
            //添加路劲
            svg1.append("path").attr("d",diagonal({
                source:{x:80-(tableoData[ti]*80),y:17*ti-28},
                target:{x:80-(tableoData[ti+1]*80),y:17*(ti+1)-28}
            })).attr("fill","none").attr("stroke","#33c3e7").attr("stroke-width",2);

        }
        //M域
        var tablebData=[0.3,0.2,0.3,0.4,0.6,0.7,0.4,0.3,0.2,0.5];
        var svg1 = d3.select("#tablemSvg").append("svg")
            .attr("width",170)
            .attr("height",80)
            .append("g")
            .attr("transform", "translate(40,0)");
        for(var ti=0;ti<tableoData.length-1;ti++){
            //添加路劲
            svg1.append("path").attr("d",diagonal({
                source:{x:80-(tableoData[ti]*80),y:17*ti-28},
                target:{x:80-(tableoData[ti+1]*80),y:17*(ti+1)-28}
            })).attr("fill","none").attr("stroke","#577bff").attr("stroke-width",2);

        }
    },
    //主题域资产分布全景图
    pathContInt:function(){
        var scope=this;
        var pathColor=["#86ba6f","#f54d80","#939bfe","#2196f3","#ff999a","#55beb7","#3bc0e1","#f6b050","#f95973"];
        var url="/console/ebus/customerWebService/getDataManageTheme"; 
        //请求
        $.ajax({
             type : 'POST',
             url : url,
             timeout:10000,
             dataType:"json",
             contentType:"application/json",
             success : function(data) {
                if(data){
                        dataList=data;
                        var colorData=[
                            {
                                "bgcolor":"#daefd0",
                                "maincolor":"#86ba6f"
                            },
                            {
                                "bgcolor":"#ffdbe9",
                                "maincolor":"#f54d80"
                            },
                            {
                                "bgcolor":"#d1d4ff",
                                "maincolor":"#939bfe"
                            },

                            {
                                "bgcolor":"#bcdffb",
                                "maincolor":"#2196f3"
                            },
                            {
                                "bgcolor":"#ffdddc",
                                "maincolor":"#fd999b"
                            },
                            {
                                "bgcolor":"#9ef0ec",
                                "maincolor":"#54bfb9"
                            },
                            {
                                "bgcolor":"#9ddef0",
                                "maincolor":"#3bc0e1"
                            },
                            {
                                "bgcolor":"#f7dfbb",
                                "maincolor":"#f6b14c"
                            }
                        ]
                        var pathData=[];
                        for(var si=0;si<dataList.length;si++){
                            var childData=[],total=0;
                            for(var pi=0;pi<dataList[si].layerList.length;pi++){
                                var valueThis=parseInt(dataList[si].layerList[pi].layerNum);
                                if(valueThis!=0){
                                    total+=valueThis;
                                    childData.push({"name":dataList[si].layerList[pi].layerName,"value":valueThis,"type":dataList[si].layerList[pi].layerTable});
                                }  
                            } 
                            pathData.push({"name":dataList[si].themeName,"total":total,"children":childData});
                        }
                        var pathCont=$("#pathCont");
                        var rightTableList=$("#rightTableList");
                        var barSameShow=$("#barSameShow");//quanjing
                        var barListShow=$("#barListShow");//xiangxi
                        var diagonal = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });//声明对角线
                        var totalNum=0;
                        for(var si=0;si<pathData.length;si++){
                            totalNum+=pathData[si].total;
                        }
                        var widthPx=730/totalNum*1.3;
                        var heightPx=450/totalNum*1.3;
                        for(var pi=0;pi<pathData.length;pi++){
                            var valueData=pathData[pi];
                            var colorValue=colorData[pi];
                            var pathPi=widthPx*pathData[pi].total;
                            if(pathPi<20){
                                pathPi=20;
                            }
                            //右侧表格
                            rightTableList.append("<ul class='rightTableList'><li class='sameColor'><span style='background:"+colorValue.maincolor+"'></span></li><li>"+valueData.name+"</li><li>"+valueData.total+"</li><li id='pack_"+pi+"' style='position:relative;'></li></ul>");
                            var tableData=[0.3,0.2,0.3,0.4,0.6,0.7,0.4,0.3,0.2,0.5];
                            //表格趋势图
                            var svgTable = d3.select("#pack_"+pi).append("svg")
                                .attr("width",170)
                                .attr("height",50)
                                .append("g").attr("transform", "translate(40,0)");
                            for(var ti=0;ti<tableData.length-1;ti++){
                                //添加路劲
                                svgTable.append("path").attr("d",diagonal({
                                    source:{x:50-(tableData[ti]*50),y:17*ti-28},
                                    target:{x:50-(tableData[ti+1]*50),y:17*(ti+1)-28}
                                })).attr("fill","none").attr("stroke",colorValue.maincolor).attr("stroke-width",2);

                            }

                            //左侧打包图
                            var svg = d3.select("#pathCont").append("svg")
                                .attr("width",pathPi)
                                .attr("height",pathPi);
                            var circleStyle = {cx: F('x'), cy: F('y'), r: F('r')};
                            var textStyle = {x: F('x'), y: F('y')};
                            var retSize = function(d){ return d.value; };
                            var pack = d3.layout.pack().size([pathPi,pathPi]);
                            var circleGroup = svg.selectAll("g").data(pack.value(retSize).nodes(valueData)).enter().append("g");
                            var circle = circleGroup.append('circle')
                                .attr({
                                    class:F('name'),
                                    "fill-opacity":0.8,
                                    fill: function(d){return d.children ? colorValue.bgcolor:colorValue.maincolor;}
                                })
                                .attr(circleStyle)
                                .on("mouseover", function(d){
                                    tooltip.html( d.name+"<br/>"+d.value)
                                        .style("left", (d3.event.pageX+30) + "px")
                                        .style("top", (d3.event.pageY -25) + "px")
                                        .style({"opacity":0.7,"z-index":2,"display":"block"});
                                    d3.select("." + d3.select(this).attr('class')).attr("fill-opacity",function(d){return d.children ? 0.8:1;});
                                })
                                .on("mouseout", function(){
                                    tooltip.style({"opacity":0,"z-index":-1,"display":"none"});
                                    d3.select("." + d3.select(this).attr('class')).attr("fill-opacity",0.8);
                                })
                                .on("click", function(d){
                                    if(!d.children){
                                        barSameShow.hide();
                                        barListShow.show();
                                        $("#mianbaoxie").html(d.parent.name +"-"+ d.name);
                                        scope.barListShow(d);//查看详细
                                    }
                                });
                            var text = circleGroup.append('text')
                                .attr({
                                    fill: "#fff",
                                    "text-anchor": "middle",
                                    "alignment-baseline": "middle",
                                })
                                .attr(textStyle)
                                .on("mouseover", function(d){
                                    tooltip.html( d.name+"<br/>"+d.value)
                                        .style("left", (d3.event.pageX+30) + "px")
                                        .style("top", (d3.event.pageY -25) + "px")
                                        .style({"opacity":0.7,"z-index":2,"display":"block"});
                                    d3.select("." + d3.select(this).attr('class')).attr("fill-opacity",function(d){return d.children ? 0.8:1;});
                                })
                                .on("mouseout", function(){
                                    tooltip.style({"opacity":0,"z-index":-1,"display":"none"});
                                    d3.select("." + d3.select(this).attr('class')).attr("fill-opacity",0.8);
                                })
                                .on("click", function(d){
                                    if(!d.children){
                                        barSameShow.hide();
                                        barListShow.show();
                                        $("#mianbaoxie").html(d.parent.name +"-"+ d.name);
                                        scope.barListShow(d);//查看详细
                                    }
                                })
                                .text(function(d){ return d.children ? "" : d.value ;});
                            var tooltip = d3.select("body")
                                .append("div")
                                .attr("class","tooltip")
                                .style("opacity",0.0);
                        }
                }
             },
             error:function(){
                console.log("error-主题域资产分布全景图");
             }
         })
    },
    //详细云图
    barListShow:function(d){
        var scope=this;
        var barListShowOne=$("#barListShowOne"); 
        var barListShowCont=$("#barListShowCont");
        var pageNumshow=$("#pageNumshow");
        var url="/console/ebus/customerWebService/getDataManageLayer"; 
        //请求
        $.ajax({
             type : 'POST',
             url : url,
             data:JSON.stringify({"entityName":d.type}),
             timeout:10000,
             dataType:"json",
             contentType:"application/json",
             success : function(data) {
                if(data){
                    barListData=data;
                    var pageNumber;
                    barListData.length%20==0?pageNumber=barListData.length/20:pageNumber=parseInt(barListData.length/20)+1;
                    var pageNumHtml="当前第 <span class='pageNumTotal' id='stratPageNum'>1</span> 页&nbsp;共 <span class='pageNumTotal'>"+pageNumber+"</span> 页&nbsp;实体数 <span class='pageNumTotal'>"+barListData.length+"</span> 个&nbsp;每页 <span class='pageNumTotal'>20</span> 个";
                    scope.pageNumInt(barListData,0,20,1);
                    pageNumshow.html(pageNumHtml);
                    var stratPageNum=$("#stratPageNum");
                    $("#btnNext").click(function(){
                        var pageNum=parseInt(barListShowCont.attr("pageId"));
                        barListShowOne.hide().html("");
                        if(barListData.length>pageNum*20){
                            console.log(pageNum);
                            pageNum=pageNum+1;
                            console.log(pageNum+"___");
                            var strNum=(pageNum-1)*20,endnNum=pageNum*20;
                            barListShowCont.attr("pageId",pageNum);
                            barListShowCont.html("");
                            scope.pageNumInt(barListData,strNum,endnNum,pageNum);
                            stratPageNum.text(pageNum);
                            $(this).attr("title","下一页");
                        }else{
                            $(this).attr("title","已经是最后一页");
                        }
                        
                    })
                    $("#btnPrev").click(function(){
                        var pageNum=parseInt(barListShowCont.attr("pageId"));
                        barListShowOne.hide().html("");
                        if(pageNum!=1){
                            pageNum=pageNum-1;
                            var strNum=(pageNum-1)*20,endnNum=pageNum*20;
                            barListShowCont.attr("pageId",pageNum);
                            barListShowCont.html("");
                            scope.pageNumInt(barListData,strNum,endnNum,pageNum);
                            stratPageNum.text(pageNum);
                            $(this).attr("title","上一页");
                        }else{
                            $(this).attr("title","已经是第一页");
                        }
                        
                    })
                }
             },
             error:function(){
                console.log("error-详细云图");
             }
         })
        
    },
    //分页加载
    pageNumInt:function(barListData,strNum,endnNum,pageNum){
        var strNum=strNum,endnNum=endnNum;
        barListData.length<endnNum?endnNum=barListData.length:endnNum;
        var barListShowCont=$("#barListShowCont");
        var barListShowOne=$("#barListShowOne");
        for(var bi=strNum;bi<endnNum;bi++){
            var perWidth=110;
            var perMargin=Math.random()*30;
            var thisHtml="<h3>"+barListData[bi].description+"</h3><h4><p></p>Basic Information</h4><div class='ownListOne'>";
                thisHtml+="<div><p class='ownL'>Business Name:</p><p class='ownR'>"+barListData[bi].businessName+"</p></div>";
                thisHtml+="<div><p class='ownL'>Entity Name:</p><p class='ownR'>"+barListData[bi].entityName+"</p></div>";      
                thisHtml+="<div><p class='ownL'>Entity Type:</p><p class='ownR'>"+barListData[bi].entityType+"</p></div>";       
                thisHtml+="<div><p class='ownL'>Description:</p><p class='ownR'>"+barListData[bi].description+"</p></div>";      
                thisHtml+="<div><p class='ownL'>Operater:</p><p class='ownR'>"+barListData[bi].operater+"</p></div>";       
                thisHtml+="<div><p class='ownL'>Created Date:</p><p class='ownR'>"+barListData[bi].createTime+"</p></div></div>";       
            barListShowCont.append("<li class='peopenList' style='width:"+perWidth+"px;height:"+perWidth+"px;margin-left:"+perMargin+"px;margin-right:"+perMargin+"px;' title="+barListData[bi].description+"><span>"+barListData[bi].description+"</span><i><div style='display:none'>"+thisHtml+"</div></i></li>");
        }
        //点击事件
        barListShowCont.children("li").each(function(){
            $(this).find("i").on("click",function(){
                var thisHtml=$(this).find("div").html();
                if($(this).attr("class")=="listIco"){
                    if(barListShowOne.is(":hidden")){
                        barListShowOne.html(thisHtml).slideDown();
                    }else{
                        barListShowOne.slideUp().html("");
                    }

                }
            })
            $(this).find("span").on("click",function(){
                barListShowOne.fadeOut();
                var atrClass=$(this).parent("li").attr("class");
                if(atrClass.indexOf("jueduijz")>-1){
                    $(this).parent("li").css({"width":"110px","height":"110px","top":0,"left":0}).removeClass("jueduijz");
                    $(this).css({"width":"90px","height":"90px","top":"12px","left":"12px","lineHeight":"90px"});
                    $(this).next("i").css({"width":"10px","height":"10px","top":"2px","right":"21px"}).removeClass("listIco");;
                }else{
                    if(!barListShowCont.children("li").is(":animated")){
                        barListShowCont.children("li").css({"width":"110px","height":"110px","top":0,"left":0}).removeClass("jueduijz");
                        barListShowCont.children("li").find("span").css({"width":"90px","height":"90px","top":"10px","left":"10px","lineHeight":"90px"});
                        barListShowCont.children("li").find("i").css({"width":"12px","height":"12px","top":"2px","right":"21px"}).removeClass("listIco");;
                        $(this).parent("li").animate({
                            "width":"320px",
                            "height":"320px",
                            "top":"50px",
                            "left":"50%"
                        },300).addClass("jueduijz");
                        $(this).next("i").animate({
                            "width":"40px",
                            "height":"40px",
                            "top":"25px",
                            "right":"30px"
                        },300).addClass("listIco");
                        $(this).animate({
                            "width":"260px",
                            "height":"260px",
                            "top":"30px",
                            "left":"30px",
                            "lineHeight":"260px"
                        },200);
                    }

                }
            })
        })
    }

};
