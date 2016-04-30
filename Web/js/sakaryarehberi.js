var sakaryarehberi = angular.module('sakaryarehberi', ['oc.lazyLoad', 'angularMoment', 'uiGmapgoogle-maps', "ui.router", "ui.select", "firebase", 'angular-md5',
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    'angularSpinner'])
.config(function ($httpProvider, $stateProvider, $urlRouterProvider, usSpinnerConfigProvider, uiGmapGoogleMapApiProvider) {

    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.interceptors.push('httpRequestInterceptor');
    usSpinnerConfigProvider.setDefaults({ color: '#3598DC' });

    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
    $stateProvider

          // setup an abstract state for the tabs directive
          .state('home', {
              url: "/",
              templateUrl: 'views/main.html',
              controller: "MainCtrl"
          })
           .state('home.login', {
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
        .state('home.locations', {
            url: "anasayfa",
            templateUrl: 'views/partials/locations.html',
            controller: 'LocationsCtrl'
        })
         .state('home.locationDetails', {
             url: "locationDetail",
             templateUrl: 'views/partials/locationFull.html',
             controller: 'LocationDetailCtrl',
             params: { locationID: null }

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
         .state('admin', {
             url: "/admin",
             templateUrl: 'views/adminmain.html',
             controller: "AdminMainCtrl",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'sakaryarehberi',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                             'assets/layouts/layout2/css/layout.min.css',
                             'assets/layouts/layout2/css/themes/default.min.css',
                             'assets/layouts/layout2/css/custom.min.css',
                             'assets/layouts/layout2/scripts/layout.min.js',
                             'assets/layouts/layout2/quick-sidebar.min.js',
                             'assets/layouts/layout2/css/themes/blue.min.css'

                         ]
                     });
                 }]
             }
         })
    .state('admin.locations', {
        url: "/locations",
        templateUrl: 'views/admin-partials/locations.html',
        controller: "AdminMainCtrl",
     
    })
        .state('admin.users', {
            url: "/users",
            templateUrl: 'views/admin-partials/users.html',
            controller: "AdminMainCtrl",

        })
    ;
    $urlRouterProvider.otherwise("/anasayfa");
})
.run(function ($rootScope, $state, AUTH_EVENTS, AuthService, amMoment) {
    amMoment.changeLocale('tr');

    $rootScope.$on(AUTH_EVENTS.loginSuccess, function (data) {
        $state.go("home.locations", {}, { reload: true });
    });
    $rootScope.$on(AUTH_EVENTS.loginFailed, function (error) {
        console.log(error);

    });
})
;