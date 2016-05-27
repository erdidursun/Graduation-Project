// Ionic Starter App

angular.module('underscore', [])
.factory('_', function () {
    return window._; // assumes underscore has already been loaded on the page
});

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('sakaryarehberi', [
  'ionic',
  'angularMoment',
  'angular-md5',
  'underscore',
  'ngMap',
  'ngCordova',
  'slugifier',
  'firebase',
])

.run(function ($ionicPlatform, $window, $location, $rootScope, $ionicConfig, $timeout, AUTH_EVENTS, $ls, $state) {

    $window.moment().locale("tr");
    $ionicPlatform.on("deviceready", function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        console.log(Settings.apiHostUrl);
        //PushNotificationsService.register();
    });

    // This fixes transitions for transparent background views
    //$rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
    //    if (toState.name.indexOf('auth.walkthrough') > -1) {
    //        // set transitions to android to avoid weird visual effect in the walkthrough transitions
    //        $timeout(function () {
    //            $ionicConfig.views.transition('android');
    //            $ionicConfig.views.swipeBackEnabled(false);
    //            console.log("setting transition to android and disabling swipe back");
    //        }, 0);
    //    }
    //});
    //$rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
    //    if (toState.name.indexOf('app.home') > -1) {
    //        // Restore platform default transition. We are just hardcoding android transitions to auth views.
    //        $ionicConfig.views.transition('platform');
    //        $scope.refresh();

    //        // If it's ios, then enable swipe back again
    //        if (ionic.Platform.isIOS()) {
    //            $ionicConfig.views.swipeBackEnabled(true);
    //        }
    //        console.log("enabling swipe back and restoring transition to platform default", $ionicConfig.views.transition());
    //    }
    //});


    $rootScope.$on(AUTH_EVENTS.loginSuccess, function (conf, data) {
        $ls.setObject("SessionData", data)
        swal({ title: "Başarılı", text: "Giriş başarılı", type: "success", confirmButtonText: "Tamam" });

        $state.go("app.home", {}, { reload: true });

    });
    $rootScope.$on(AUTH_EVENTS.loginFailed, function (error) {
        swal({ title: "Giriş Başarısız", text: "Kullanıcı adı veya şifre hatalı", type: "error", confirmButtonText: "Tamam" });


    });
    $rootScope.$on(AUTH_EVENTS.logoutSuccess, function (error) {
        $state.go("auth.login", {}, { reload: true });

    });
})


.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('httpRequestInterceptor');
    $stateProvider

    //INTRO
    .state('auth', {
        url: "/auth",
        templateUrl: "views/auth/auth.html",
        abstract: true
    })

    .state('auth.walkthrough', {
        url: '/walkthrough',
        templateUrl: "views/auth/walkthrough.html",
        controller: 'AuthCtrl'

    })

    .state('auth.login', {
        url: '/login',
        templateUrl: "views/auth/login.html",
        controller: 'LoginCtrl'
    })

    .state('auth.signup', {
        url: '/signup',
        templateUrl: "views/auth/signup.html",
        controller: 'SignupCtrl'
    })

    .state('auth.forgot-password', {
        url: "/forgot-password",
        templateUrl: "views/auth/forgot-password.html",
        controller: 'ForgotPasswordCtrl'
    })

    .state('app', {
        url: "/app",
        abstract: true,
        cache:false,
        templateUrl: "views/app/side-menu.html",
        controller: 'AppCtrl'
    })
    .state('app.home', {
        url: "/home",
        views: {
            'menuContent': {
                templateUrl: "views/app/locations/home.html",
                controller: 'HomeCtrl',
                cache: false
            }
        }

    })
  .state('app.settings', {
      url: "/settings",
      views: {
          'menuContent': {
              templateUrl: "views/app/settings.html",
              controller: 'SettingsCtrl',
              cache: false
          }
      }

  })
 .state('app.profile', {
     url: "/profile/:userId",
     views: {
         'menuContent': {
             templateUrl: "views/app/profile.html",
             controller: 'ProfileCtrl',
             cache: false
         }
     }

 })
    .state('app.details', {
        url: "/details/:locationId",
        views: {
            'menuContent': {
                templateUrl: "views/app/locations/details.html",
                controller: 'DetailCtrl',
                cache: false
            }
        }
    })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/auth/walkthrough');
});
