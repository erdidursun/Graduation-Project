var sakaryarehberi = angular.module('sakaryarehberi', ['oc.lazyLoad', "ui.router","firebase",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize"])
.config(function ($httpProvider, $stateProvider, $urlRouterProvider) {

    $stateProvider

          // setup an abstract state for the tabs directive
          .state('home', {
              url: "/",
              templateUrl: 'views/main.html',
              controller: "MainCtrl"
          }).state('home.login', {
              url: "login",
              templateUrl: 'views/partials/login.html',
              controller: 'LoginCtrl',
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load({
                          name: 'sakaryarehberi',
                          insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                          files: [
                              'assets/global/css/login.min.css',
                              "assets/global/plugins/jquery-validation/js/jquery.validate.min.js",
                              "assets/global/plugins/jquery-validation/js/additional-methods.js",
                              "assets/pages/scripts/login.min.js"
                          ]
                      });
                  }]
              }
          })
          .state('home.forgot', {
              url: "forgot",
              templateUrl: 'views/partials/forgot.html',
              controller: 'LoginCtrl',
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load({
                          name: 'sakaryarehberi',
                          insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                          files: [
                              'assets/global/css/login.min.css',
                              "assets/global/plugins/jquery-validation/js/jquery.validate.min.js",
                              "assets/global/plugins/jquery-validation/js/additional-methods.js",
                              "assets/pages/scripts/login.min.js"
                          ]
                      });
                  }]
              }
          })
      .state('home.register', {
          url: "register",
          templateUrl: 'views/partials/register.html',
          controller: 'LoginCtrl',
          resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'sakaryarehberi',
                      insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                      files: [
                          'assets/global/css/login.min.css',
                          "assets/global/plugins/jquery-validation/js/jquery.validate.min.js",
                          "assets/global/plugins/jquery-validation/js/additional-methods.js",
                          "assets/pages/scripts/login.min.js"
                      ]
                  });
              }]
          }
      })
  
    $urlRouterProvider.otherwise("/");
})
.run(function ($rootScope, AUTH_EVENTS, AuthService) {
   
})
;