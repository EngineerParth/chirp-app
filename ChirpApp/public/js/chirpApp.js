var app = angular.module("chirpApp",['ngRoute']);

app.config(function($routeProvider){
  $routeProvider
  .when('/',{
    templateUrl:'main.html',
    controller:'mainController'
  })
  .when('/register',{
    templateUrl:'register.html',
    controller:'authController'
  })
  .when('/login',{
    templateUrl:'login.html',
    controller:'authController'
  })
});

var controller = app.controller('mainController', function($scope){
  $scope.posts = [];
  $scope.newPost = {
    createdBy: '',
    text: '',
    createdAt:''
  };

  $scope.post = function(){
    $scope.newPost.createdAt = Date.now();
    $scope.posts.push($scope.newPost);
    $scope.newPost = {
      createdBy: '',
      text: '',
      createdAt:''
    };
  }
});

app.controller('authController', function($scope){
  $scope.user = {userName:'', password:''};
  $scope.errorMessage='';

  $scope.logIn = function(){
    $scope.errorMessage = "Login request for" + $scope.user.userName;
  }

  $scope.register = function(){
    $scope.errorMessage = "registration request for" + $scope.user.userName;
  }
});
