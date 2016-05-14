// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('sakaryarehberi', ['ionic', 'sakaryarehberi.controllers', 'underscore', 'sakaryarehberi.services', 'sakaryarehberi.directives', 'firebase'])
 .run(function ($ionicPlatform, $rootScope,$timeout,$ionicConfig) {
          $ionicPlatform.ready(function () {
              // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
              // for form inputs)
              if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                  cordova.plugins.Keyboard.disableScroll(true);

              }
              if (window.StatusBar) {
                  // org.apache.cordova.statusbar required
                  StatusBar.styleDefault();
              }
          });
          $rootScope.$on("$stateChangeStart", function (n, e, t, s, a) {
              if (e.name.indexOf("auth.walkthrough") > -1)
                  $timeout(function () {
                      $ionicConfig.views.transition("android");
                      $ionicConfig.views.swipeBackEnabled(false);
                      console.log("setting transition to android and disabling swipe back");
                  }, 0)
          });
          $rootScope.$on("$stateChangeSuccess", function (n, e, t, i, s) {
              if (e.name.indexOf("app.feeds-categories") > -1)
                  $ionicConfig.views.transition("platform");
              if (ionic.Platform.isIOS())
                  $ionicConfig.views.swipeBackEnabled(true);
              console.log("enabling swipe back and restoring transition to platform default");
              $ionicConfig.views.transition()
          });
      })
.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $stateProvider
    .state("auth", {
        url: "/auth",
        templateUrl: "views/auth/auth.html",
        abstract: true,
        controller: "AuthCtrl"
    })

    .state("auth.walkthrough", {
        url: "/walkthrough",
        templateUrl: "views/auth/walkthrough.html"
    })
    .state("auth.login", {
        url: "/login",
        templateUrl: "views/auth/login.html",
        controller: "LoginCtrl"
    })

    ;

    $urlRouterProvider.otherwise("/auth/walkthrough");

});
