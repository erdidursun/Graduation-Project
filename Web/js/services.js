angular.module("sakaryarehberi")
.factory('$ls', ['$window', function ($window) {
    return {
        set: function (key, value) {
            var compressed = Settings.compressedStorage ? LZString.compressToUTF16(value) : value;
            $window.localStorage[key] = compressed;
        },
        get: function (key, defaultValue) {
            var value = $window.localStorage[key];
            return value;
        },
        setObject: function (key, value) {
            var compressed = JSON.stringify(value);
            $window.localStorage[key] = compressed;
        },
        getObject: function (key) {
            var obj = null;
            var value = $window.localStorage[key];
            if (value)
                obj = JSON.parse(value);
            return obj;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
            return true;
        },
        removeAll: function () {
            var key = "firebase:session::sakaryarehberi";
            var data = $window.localStorage[key];
            $window.localStorage.clear();

            $window.localStorage[key] = data;
            return true;
        }
    }
}])
.factory('httpRequestInterceptor', ['$q', 'usSpinnerService', '$injector', 'HttpCache', '$timeout', function ($q, usSpinnerService, $injector, HttpCache, $timeout) {

    var interceptor = {
        request: function (config) {

            if (config.url.indexOf('{apihost}') > -1) {
                if (!config.timeout)
                    config.timeout = window.Settings.defaultRequestTimeout;
                if (!config.hasOwnProperty('spinner'))
                    config.spinner = true;
                usSpinnerService.spin('spinner-1');
                config.url = config.url.replace('{apihost}', Settings.apiHostUrl);
                //var token = Auth.getToken();
                //if (token && config.RequireAuth) {
                //    config.headers.Authorization = 'Bearer ' + token;
                //}
            };

            if (config.cache == false) {
                if (window.Settings.logingEnabled) console.log('Cache removed : ' + config.url);
                try {
                    HttpCache.remove(config.url);
                }
                catch (Ex) {
                }
            }

            if (window.Settings.logingEnabled && config.url.indexOf('http') > -1)
                console.log('Api Request : ' + config.url);
            return config;
        },
        response: function (response) {

            if (response && response.config && response.config.url.indexOf('http') > -1) {
                var url = response.config.url;
                if (url.indexOf(Settings.apiHostUrl) > -1) {
                    if (window.Settings.logingEnabled) {
                        console.log('Api Response : ' + url);
                        console.log(response);
                    }
                    $timeout(function () {
                        HttpCache.remove(url);
                        if (window.Settings.logingEnabled) console.log('Cache removed : ' + url);
                    }, window.Settings.cacheTime);

                    setTimeout(function () {
                        usSpinnerService.stop('spinner-1');
                    }, 500);
                }
            }


            return response;
        },
        requestError: function (error) {

            setTimeout(function () {
                usSpinnerService.stop('spinner-1');
            }, 500);


        },
        responseError: function (error) {
            setTimeout(function () {
                usSpinnerService.stop('spinner-1');
            }, 500);


        }
    };
    return interceptor;
}])
.factory('$spinner', function ($ionicLoading, $translate, usSpinnerService) {
    var openCount = 0;
    return {
        show: function () {
            return true;
        },

        hide: function () {
            openCount--;
            if (openCount <= 0) {
                openCount = 0;
                $ionicLoading.hide();
            }
            return true;
        },
        forceHide: function (message) {
            $translate('r_gen_mob_spinnerforceerrortitle').then(function (title) {
                $translate(message).then(function (msg) {
                    swal({ title: title, text: msg, timer: 5000, type: 'warning' });
                });
            });
            openCount = 0;
            $ionicLoading.hide();
            return true;
        }
    };
})
.service("Session", function ($ls, $rootScope, AUTH_EVENTS) {

    var data = {};
    var Session = {};
    Session.User = $ls.getObject("SessionData");
    Session.Create = function (type, data) {
        this.data = data;
        if (data) {
            Session.User = {
                loginType: type,
                id: data.ID,
                name: data.Name,
                profileImageURL: data.ImgPath,
                type_id: data.Type_ID,
                type_name: data.TypeName,
                expireTime: moment().add(1, 'h').toDate()
            };
            $ls.setObject("SessionData", Session.User);
        }
        else
            Session.User = null;
    }

    Session.Destroy = function () {
        Session.User = null;
        data = null;
        $ls.removeAll();
    }
    Session.isAuthenticated = function () {
        var now = moment().toDate();
        return Session.User != null ? moment(Session.User.expireTime).toDate() > now ? true : false : false;
    }
    Session.isAdmin = function () {
        return Session.isAuthenticated() ? Session.User.type_id == 2 ? true : false : false;
    }
    return Session;
})
.factory('AuthService', function ($rootScope, $state, User, Session, AUTH_EVENTS, $ls, $firebaseAuth) {

    var authService = {};

    var ref = new Firebase("https://sakaryarehberi.firebaseio.com");


    authService.SocialLoginProvider = $firebaseAuth(ref);
    var retry = 0;
    authService.logout = function () {
        Session.Destroy();
        authService.SocialLoginProvider.$unauth();
        $state.go("home.locations", {}, { reload: true });

    };
    authService.SocialLoginProvider.$onAuth(function (authData) {
        if (authData && !Session.isAuthenticated()) {

            var _data = {
                ProviderName: authData.provider,
                Mail: authData.uid,
                Password: authData["" + authData.provider + ""].accessToken,
                Name: authData["" + authData.provider + ""].displayName,
                ImgPath: authData["" + authData.provider + ""].profileImageURL
            }
            User.SocialLogin(_data);
        }

    });
    authService.socialLogin = function (provider) {

        authService.SocialLoginProvider.$authWithOAuthPopup(provider).then(function (authData) {

        }).catch(function (error) {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed, error);

        });

    };


    return authService;
})
.factory('HttpCache', function ($cacheFactory) {
    return $cacheFactory.get('$http');

    /*  istek yapılırken options parametresiyle cache:true değeri verilirse
        appSettings.js dosyasındaki cacheTime parametresinde belirtilen
        süre kadar(ms cinsinden)  ilgili veri cachte tutulur, süre dolunca cachten silinir.
        Not:Verilerin gösterildiği template'in cache değeri app.js dosyasındaki ilgili kısımdan false yapılmalı. Aksi takdirde
        templateden istek gelmediği için cache süresi dolmuş olsa dahi yeni veriler yüklenmez.
     */
})
.factory('CurrentLocation', function ($http, $ls) {
    var CurrentLocation = {};

    CurrentLocation.data = $ls.getObject("CurrentLocation");
    function storeCurrentLocation(location) {
        location.time = moment().add(1, 'h').toDate();
        $ls.setObject("CurrentLocation", CurrentLocation.data);
    }
    CurrentLocation.get = function (successCB, errorCB) {

        if (CurrentLocation.data && moment(CurrentLocation.data.time).toDate() > moment().toDate()) {
            successCB(CurrentLocation.data);
        }
        else {


            navigator.geolocation.getCurrentPosition(
          function (location) {
              CurrentLocation.data = { Latitude: location.coords.latitude, Longtitude: location.coords.longitude };
              storeCurrentLocation(CurrentLocation.data)
              successCB(CurrentLocation.data);
          },
          function (err) {
              switch (err.code) {
                  case err.TIMEOUT:
                      errorCB(err);
                      break;
                  case err.PERMISSION_DENIED:
                      if (err.message.indexOf("Only secure origins are allowed") == 0) {
                          var func = $http.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCeHrsgRhVTLVIpx_HwGNTsl6nO0HyXXoc")
                                      .then(function (data) {
                                          if (data && data.data) {
                                              CurrentLocation.data = { Latitude: data.data.location.lat, Longtitude: data.data.location.lng };
                                              storeCurrentLocation(CurrentLocation.data)
                                              successCB(CurrentLocation.data);
                                          }
                                      });

                      }
                      break;
                  case err.POSITION_UNAVAILABLE:
                      errorCB(err);
                      break;
              }
          },
        { maximumAge: 50000, timeout: 20000, enableHighAccuracy: false });
        }



    };

    return CurrentLocation;
})
;