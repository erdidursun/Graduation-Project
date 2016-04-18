var sakaryarehberi = angular.module('sakaryarehberi', ['oc.lazyLoad', "ui.router", "ui.select", "firebase",'angular-md5',
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    'angularSpinner'])
.config(function ($httpProvider, $stateProvider, $urlRouterProvider, usSpinnerConfigProvider) {
   
    //$httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.interceptors.push('httpRequestInterceptor');
    usSpinnerConfigProvider.setDefaults({ color: '#3598DC' });
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
                              'assets/global/css/login.min.css'
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
                              'assets/global/css/login.min.css'
                          ]
                      });
                  }]
              }
          })
      .state('home.register', {
          url: "register",
          templateUrl: 'views/partials/register.html',
          controller: 'RegisterCtrl',
          resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'sakaryarehberi',
                      insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                      files: [
                          'assets/global/css/login.min.css'
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