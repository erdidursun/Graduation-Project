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

            };
            config.url = config.url.replace('{apihost}', Settings.apiHostUrl);
            if (Auth.token) {
                config.headers.Authorization = 'Bearer ' + Auth.token;

            }
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
                if (url.indexOf(Auth.host) > -1) {
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
    authService.Login = function (mail, pass) {
        var data = $httpParamSerializerJQLike({
            username: mail,
            password: pass,
            grant_type: "password"
        });
        var func = $http.post("http://{apihost}/token", data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(function (data) {
                    Auth.type = "form";
                    Auth.token = data.data.access_token;
                    $ls.setObject(FirebaseSession.Data, data.data);
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, data.data);

                }, function (error) {
                    console.log(error);
                });
    };
    authService.socialLogin = function (provider, callback) {
        this.SocialLoginProvider.$authWithOAuthPopup(provider).then(function (authData) {
            Auth.type = "social";
            Auth.token = authData["" + authData.provider + ""].accessToken;

            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, authData);

        }).catch(function (error) {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed, error);
        });
    }


    return authService;
})
.service('Auth', function () {
    this.host = window.Settings.apiHostUrl;
    this.token = '';

    this.type = 'form';
    this.setToken = function (token) {
        this.token = token;
    }
    this.setType = function (type) {
        this.type = type;
    }
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
.service('User', function (FirebaseSession, $ls, $timeout, Auth, $http, $httpParamSerializerJQLike, md5) {
    var data = {};
    var User = {};
    User.Info = function () {
        if (Auth.type == 'social') {
            data = $ls.getObject(FirebaseSession.Data);
            if (data) {
                var provider = data["" + data.provider + ""];
                return {
                    id: provider.id,
                    name: provider.displayName,
                    access_token: provider.accessToken,
                    profileImageURL: provider.profileImageURL,
                    isAuthanthanced: data ? true : false
                };
            }
            else
                return {};
        }
        else if (Auth.type == 'form') {
            data = $ls.getObject(FirebaseSession.Data);
            if (data) {
                return {
                    id: data.User_ID,
                    name: data.User_Name,
                    access_token: data.access_token,
                    profileImageURL: data.User_ImgPath,
                    isAuthanthanced: data ? true : false
                };
            }

            else
                return {};
        }

    }

    User.Register = function (user) {

        //var req = $http({
        //    url: "http://{apihost}/API/Register",
        //    method: 'POST',
        //    data: $httpParamSerializerJQLike(user),
        //    headers: {
        //        'Content-Type': 'application/x-www-form-urlencoded'
        //    },
        //    success:function(data){
        //        console.log(data);
        //    }
        //});
        user.User_Password = md5.createHash(user.User_Password);

        var func = $http.post("http://{apihost}/API/Register", $httpParamSerializerJQLike(user), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                      .then(function (data) {
                          console.log(data);

                      }, function (error) {
                          console.log(error);
                      });

    }
    return User;




})