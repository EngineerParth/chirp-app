var app = angular.module("chirpApp",['ngRoute', 'ngResource']).run(function($rootScope, $http){
  $rootScope.authenticated = false;
  $rootScope.currentUser = '';

  $rootScope.signout = function(){
    $http.get('/auth/signout');
    $rootScope.authenticated = false;
    $rootScope.currentUser = '';
  }
});

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

// Registering a factory using $http service
// app.factory('postService', function($http){
//   var factory = {};
//   factory.getAll = function(){
//     return $http.get('/api/posts');
//   }
//   return factory;
// });

// Registring a factory using the resource service
app.factory('postService', function($resource){
  return $resource('/api/posts/:id');
});

var controller = app.controller('mainController', function($rootScope, $scope, postService){
  $scope.posts = postService.query();
  $scope.newPost = {
    createdBy: '',
    text: '',
    createdAt:''
  };

  // postService.getAll().success(function(data){
  //   $scope.posts = data;
  // });

  $scope.post = function(){
    // $scope.newPost.createdAt = Date.now();
    // $scope.posts.push($scope.newPost);
    // $scope.newPost = {
    //   createdBy: '',
    //   text: '',
    //   createdAt:''
    // };

    $scope.newPost.createdBy = $rootScope.currentUser;
    $scope.newPost.createdAt = Date.now();
    postService.save($scope.newPost, function(){
      $scope.posts = postService.query();
      $scope.newPost = {
        createdBy: '',
        text: '',
        createdAt:''
      };
    });
  }
});

app.controller('authController', function($scope, $rootScope, $http, $location){
  $scope.user = {userName:'', password:''};
  $scope.errorMessage='';

  $scope.logIn = function(){
    //$scope.errorMessage = "Login request for" + $scope.user.userName;
    $http.post('auth/login', $scope.user).success(function(data){
      $rootScope.authenticated = true;
      $rootScope.currentUser = data.user.username;
      $location.path('/');
    });
  }

  $scope.register = function(){
    //$scope.errorMessage = "registration request for" + $scope.user.userName;
    $http.post('auth/signup', $scope.user).success(function(data){
      $rootScope.authenticated = true;
      $rootScope.currentUser = data.user.username;
      $location.path('/');
    });
  }
});
