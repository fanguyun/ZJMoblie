/**
 * Created by lenovo on 2015/11/28.
 */
/*控制器*/
//全局概览
myApp.controller('database', function() {
    setTimeout(function(){
        bigData.init();
    },800)
});
//数据集成
myApp.controller('dataIntegration', function() {
    setTimeout(function(){
        dataIntegration.init();
    },800)
});
//集群管理
myApp.controller('clusterManagement', function() {
    setTimeout(function(){
        clusterManagement.init();
    },800)
});
//HDFS设备视图
myApp.controller('hdfsShow', function() {
    setTimeout(function(){
        hdfsShow.init();
    },800)
});
//数据治理
myApp.controller('dataGovernance', function() {
    setTimeout(function(){
        dataGovernance.init();
    },800)
});