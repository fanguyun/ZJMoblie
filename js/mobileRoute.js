/**
 * Created by lenovo on 2015/11/28.
 */
//路由控制页面视图
var myApp = angular.module("myApp", ['ngRoute']);
myApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/main', {//全局概览
                templateUrl: 'mobileMain.html',
                controller: 'database'
            }).
            when('/dataIntegration', {//数据集成
                templateUrl: 'mobileDataIntegration.html',
                controller:'dataIntegration'
            }).
            when('/clusterManagement',{//集群管理
                templateUrl: 'mobileClusterManagement.html',
                controller:'clusterManagement'
            }).
            when('/hdfsShow',{//HDFS设备试图
                templateUrl: 'mobileHdfsmain.html',
                controller:'hdfsShow'
            }).
            when('/dataGovernance',{//数据治理
                templateUrl: 'mobileDataGovernance.html',
                controller:'dataGovernance'
            }).
            otherwise({//默认
                redirectTo: '/main'
            });
    }
]);