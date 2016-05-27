var sakaryarehberi = angular.module('sakaryarehberi', ['oc.lazyLoad', 'angularFileUpload', 'infinite-scroll', 'angularMoment', 'uiGmapgoogle-maps', "ui.router", "ui.select", "firebase", 'angular-md5',
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    'angularSpinner'])

.config(function ($httpProvider, $stateProvider, $urlRouterProvider, usSpinnerConfigProvider, uiGmapGoogleMapApiProvider) {

    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.options = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    $httpProvider.defaults.useXDomain = true;

    delete $httpProvider.defaults.headers.common['X-Requested-With'];

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
              controller: "MainCtrl",
              cache: false
          })
          .state('home.login', {
              url: "giris_yap",
              templateUrl: 'views/partials/login.html',
              controller: 'LoginCtrl',
              cache: false,
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
            cache: false,
            templateUrl: 'views/partials/locations.html',
            controller: 'LocationsCtrl',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sakaryarehberi',
                        files: [
                            'assets/global/plugins/cubeportfolio/css/cubeportfolio.min.css',
                            'assets/pages/css/portfolio.min.css'
                        ]
                    });
                }]
            }
        })
         .state('home.locationDetails', {
             url: "mekan/:locationId",
             cache: false,
             templateUrl: 'views/partials/locationFull.html',
             controller: 'LocationDetailCtrl'

         })
        .state('admin.newLocation', {
            url: 'mekanekle',
            cache: false,
            templateUrl: 'views/admin-partials/addLocation.html',
            controller: "LocationNewCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sakaryarehberi',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'assets/global/css/login.min.css',
                              "assets/global/plugins/jquery-file-upload/blueimp-gallery/blueimp-gallery.min.css",
                              "assets/global/plugins/jquery-file-upload/css/jquery.fileupload.css",
                             "assets/global/plugins/jquery-file-upload/css/jquery.fileupload-ui.css"
                        ]
                    });
                }]
            }
        })
          .state('home.forgot', {
              url: "sifremi_unuttum",
              cache: false,
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
          url: "kayit_ol",
          cache: false,
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
              url: "/yonetici",
              cache: false,
              templateUrl: 'views/adminmain.html',
              controller: "AdminMainCtrl"
          })
            .state('admin.locations', {
                url: "/mekanlar",
                cache: false,
                templateUrl: 'views/admin-partials/locations.html',
                //controller: "AdminMainCtrl",

            })
         .state('admin.editLocation', {
             url: "/mekanDuzenle/:locationId",
             cache: false,
             templateUrl: 'views/admin-partials/LocationEdit.html',
             controller: "LocationEditCtrl",

         })
        .state('admin.users', {
            url: "/kullanicilar",
            cache: false,
            templateUrl: 'views/admin-partials/users.html',
            //controller: "AdminMainCtrl",

        })

        .state('admin.newlocationtypes', {
            url: "/addlocationtypes",
            cache: false,
            templateUrl: 'views/admin-partials/addlocationtypes.html',
            controller: "NewLocationTypeCtrl",

        })
        .state('home.account', {
            url: "kullanici/:userId",
            templateUrl: 'views/partials/account.html',
            controller: 'AccountCtrl',
            cache: false,
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sakaryarehberi',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/pages/css/profile.css'
                        ]
                    });
                }]
            }
        })
    ;
    $urlRouterProvider.otherwise("/anasayfa");
})
.run(function ($rootScope, $location, $state, $ls, $window, AUTH_EVENTS, AuthService, amMoment) {
    amMoment.changeLocale('tr');
    $rootScope.$on(AUTH_EVENTS.loginSuccess, function (conf, data) {
        console.log(data);
        $ls.setObject("SessionData", data)
        if (data.type_id == 2)
            $state.go("admin", {}, { reload: true });
        else
            $state.go("home.locations", {}, { reload: true });

    });
    $rootScope.$on(AUTH_EVENTS.loginFailed, function (error) {
        swal({ title: "Giriş Başarısız", text: "Seçtiğiniz kriterlere uygun yol bulunmamaktadır.!", type: "error", confirmButtonText: "Cool" });


    });
    $rootScope.$on(AUTH_EVENTS.logoutSuccess, function (error) {
        $state.go("home.locations", {}, { reload: true });

    });
})

;
