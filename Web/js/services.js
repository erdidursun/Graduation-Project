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
            $window.localStorage.clear();
            return true;
        }
    }
}])
.factory('httpRequestInterceptor', ['$q', 'usSpinnerService', '$injector', 'Auth', 'HttpCache', '$timeout', function ($q, usSpinnerService, $injector, Auth, HttpCache, $timeout) {

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
                    console.log('HATA OLDU');
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
            console.log(error)

            setTimeout(function () {
                usSpinnerService.stop('spinner-1');
            }, 500);


        },
        responseError: function (error) {
            console.log(error)
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
.factory('AuthService', function ($rootScope, AUTH_EVENTS, $http, Auth, $ls, $firebaseAuth, FirebaseSession, $httpParamSerializerJQLike) {

    var authService = {};

    var ref = new Firebase("https://sakaryarehberi.firebaseio.com");


    authService.SocialLoginProvider = $firebaseAuth(ref);

    authService.logout = function () {
        $ls.removeAll();
        Auth.token = undefined;
        this.SocialLoginProvider.$unauth();
    };
    authService.socialLogin = function (provider, callback) {
        this.SocialLoginProvider.$authWithOAuthPopup(provider).then(function (authData) {
            Auth.setType("social");
            Auth.setType(authData["" + authData.provider + ""].accessToken);

            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, authData);

        }).catch(function (error) {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed, error);
        });
    }


    return authService;
})
.service('Auth', function ($ls) {
    var Auth = {};

    Auth.setToken = function (token) {
        $ls.set("token", token)
    }
    Auth.getToken = function () {
        return $ls.get("token");
    };
    Auth.setType = function (type) {
        $ls.set("AuthType", type)
    };
    Auth.getType = function () {
       return $ls.get("AuthType")
    };
    return Auth;
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

;