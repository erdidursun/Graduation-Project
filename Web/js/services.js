﻿angular.module("sakaryarehberi")
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

                    //var $spinner = $injector.get('$spinner');
                    //setTimeout(function () {
                    //    $spinner.hide();
                    //}, 500);
                }
            }


            return response;
        },
        requestError: function (error) {
            console.log(error);

        },
        responseError: function (error) {
            console.log(error);

        }
    };
    return interceptor;
}])

.factory('AuthService', function ($rootScope, AUTH_EVENTS, $http, Auth, $ls, $firebaseAuth, transformRequestAsFormPost) {

    var authService = {};

    var ref = new Firebase("https://sakaryarehberi.firebaseio.com");


    authService.SocialLoginProvider = $firebaseAuth(ref);

    authService.logout = function () {
        $ls.removeAll();
        Auth.token = undefined;
        this.SocialLoginProvider.$unauth();
    };
    authService.Login = function (mail, pass) {
        var request = $http({
            method: "POST",
            url: "http://{apihost}/token",
            transformRequest: transformRequestAsFormPost,
            data: {
                username: mail,
                password: pass,
                grant_type: "password"
            }
        });
        request.success(function (data) {
            if (data)
                Auth.token = data.access_token;
            Auth.type = "form";
            $ls.setObject("User", data);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, data);

        }
        );
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
    .factory("transformRequestAsJsonPost", function () {
        function transformRequest(data, headers) {
            headers["Content-type"] = "application/json; charset=utf-8";
            return data;
        }
        return (transformRequest);
    })
.factory("transformRequestAsFormPost", function () {
    function transformRequest(data, headers) {
        headers["Content-type"] = "application/x-www-form-urlencoded; charset=utf-8";
        return (serializeData(data));
    }
    return (transformRequest);

    function serializeData(data) {
        if (!angular.isObject(data)) {
            return ((data == null) ? "" : data.toString());
        }
        var buffer = [];
        for (var name in data) {
            if (!data.hasOwnProperty(name)) {
                continue;
            }
            var value = data[name];
            buffer.push(
                encodeURIComponent(name) +
                "=" +
                encodeURIComponent((value == null) ? "" : value)
            );
        }
        var source = buffer
            .join("&")
            .replace(/%20/g, "+")
        ;
        return (source);
    }
})
.service('User', function (FirebaseSession, $ls, $timeout, Auth, $http) {
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
            data = $ls.getObject("User");
            if (data) {
                return {
                    id: data.User_ID,
                    name: data.User_Name,
                    access_token: data.access_token,
                    profileImageURL: data.profileImageURL,
                    isAuthanthanced: data ? true : false
                };
            }

            else
                return {};
        }

    }
    var config = {
        headers: {
            'Content-Type': 'application/json;charset=utf-8;'
        }
    }
    User.Register = function (user) {
        $http.post('http://{apihost}/API/Register', user, config)
            .success(function (data, status, headers, config) {
                console.log(data);

            })

    }
    return User;




})