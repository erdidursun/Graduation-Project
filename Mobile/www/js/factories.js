angular.module('sakaryarehberi')
.service('User', function (Session, $rootScope, AUTH_EVENTS, $ls, $timeout, $http, $httpParamSerializerJQLike, md5) {
    var User = {};

    User.Login = function (mail, pass) {
        var data = $httpParamSerializerJQLike({
            username: mail,
            password: pass
        });
        var func = $http.post("{apihost}/api/Login", data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(function (data) {
                    swal({ title: "Ba�ar�l�", text: "Giri� Ba�ar�l�", type: "success", confirmButtonText: "Tamam" });

                    if (data)
                        Session.Create("form", data.data[0]);
                    else
                        Session.Create("form", null);


                }, function (error) {
                    swal({ title: "Ba�ar�s�z", text: "Giri� Ba�ar�s�z", type: "error", confirmButtonText: "Tamam" });

                    Session.Create("form", null);

                });
    };



    User.SocialLogin = function (data) {
        var data = $httpParamSerializerJQLike(data);
        var func = $http.post("{apihost}/api/AddSocialUser", data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(function (data) {
                    if (data)
                        Session.Create("social", data.data[0]);
                    else
                        Session.Create("social", null);


                }, function (error) {
                    Session.Create("social", null);

                });
    };
    User.Register = function (user) {
        user.User_Password = md5.createHash(user.User_Password);

        var func = $http.post("{apihost}/API/Register", $httpParamSerializerJQLike(user), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                      .then(function (data) {
                          swal({ title: "Ba�ar�l�", text: "Ba�ar�yla Kay�t Oldunuz. Giri� Yap�l�yor.", type: "success", confirmButtonText: "Tamam" }
                              , function () {
                                  User.Login(data.data.Email, data.data.Password);
                              });


                      }, function (error) {
                          swal({ title: "Ba�ar�s�z", text: "Kay�t Olma Esnas�nda Bir hata olu�tu", type: "error", confirmButtonText: "Tamam" });

                      });
    }


    User.SendComment = function (comment) {
        var data = $httpParamSerializerJQLike(comment);
        var func = $http.post("{apihost}/API/SendComment", data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

        return func;
    };

    User.GetAll = function () {
        var func = $http.get("{apihost}/API/GetUsers", { headers: { 'Content-Type': 'application/json' } })
        return func;
    }
    User.ChangeInfo = function (userId, name, email) {
        var url = "{apihost}/API/ChangeInfo?userId=" + userId + "&name=" + name + "&mail=" + email;
        var func = $http.get(url, { headers: { 'Content-Type': 'application/json' } })
        return func;
    }
    User.GetUserById = function (id) {
        var func = $http.get("{apihost}/API/GetUserById?userId=" + id).then(function (data) {
            return data.data[0];
        })
        return func;
    }
    User.GetUserComments = function (id) {
        var func = $http.get("{apihost}/API/GetUserComments?userId=" + id).then(function (data) {
            return data.data;
        })
        return func;
    }
    User.GetUserLikes = function (id) {
        var func = $http.get("{apihost}/API/GetUserLikes?userId=" + id).then(function (data) {
            return data.data;
        })
        return func;
    }
    User.Delete = function (id) {
        var data = {
            UserID: id
        }
        var func = $http.get("{apihost}/API/DeleteUser?UserID=" + id);
        return func;
    }

    User.GetUserTypes = function () {
        var func = $http.get("{apihost}/API/GetUserTypes", { RequireAuth: false });
        return func;
    }

    User.Update = function (user, id) {
        var data = {
            UserID: id
        }
        var func = $http.post("{apihost}/API/UpdateUser?UserID=" + id, $httpParamSerializerJQLike(user), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
          .then(function (data) {
              console.log(data);

          }, function (error) {
              console.log(error);
          });
        return func;
    }


    return User;




})
.service('Location', function ($http, $httpParamSerializerJQLike, Session) {
    var data = {};
    var Location = {};
    Location.GetLocations = function (Coord, page) {
        var Coord1 = {
            Latitude: -1,
            Longtitude: -1
        };
        if (!page)
            page = 1;
        var userId = -1;
        var url = "{apihost}/API/GetLocations?page=" + page;
        if (Session.isAuthenticated())
            url = url + "&userId=" + Session.User.id;
        if (Coord)
            var data = $httpParamSerializerJQLike(Coord)
        else
            var data = $httpParamSerializerJQLike(Coord1)

        var func = $http.post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        return func;
    }

    Location.GetSearchLocation = function () {

        var func = $http.get("{apihost}/API/GetSearchLocation");
        return func;
    }
    Location.UpdateLocation = function (id, data) {

        var func = $http.post("{apihost}/API/UpdateLocation?locationId=" + id, $httpParamSerializerJQLike(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        return func;
    }
    Location.GetLocationById = function (id) {
        var url = "{apihost}/API/GetLocationById?id=" + id;
        if (Session.isAuthenticated())
            url = url + "&userId=" + Session.User.id;
        var func = $http.get(url, { headers: { 'Content-Type': 'application/json' } });
        return func;
    }
    Location.Like = function (locationId, userId) {
        var func = $http.get("{apihost}/API/LikeLocation?locationId=" + locationId + "&userId=" + userId, { headers: { 'Content-Type': 'application/json' } });
        return func;
    }
    Location.UnLike = function (locationId, userId) {
        var func = $http.get("{apihost}/API/UnLikeLocation?locationId=" + locationId + "&userId=" + userId, { headers: { 'Content-Type': 'application/json' } });
        return func;
    }
    Location.GetLocationTypes = function () {

        var func = $http.get("{apihost}/API/GetLocationTypes", { RequireAuth: false });


        var func = $http.get("{apihost}/API/GetLocationTypes", { RequireAuth: false });

        return func;
    }

    Location.Delete = function (id) {
        var data = {
            LocationID: id
        }
        var func = $http.get("{apihost}/API/DeleteLocation?LocationID=" + id);
        return func;
    }
    Location.Add = function (data) {


        var func = $http.post("{apihost}/API/AddLocation", $httpParamSerializerJQLike(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        return func;

    }

    Location.AddLocationType = function (data) {
        var func = $http.get("{apihost}/API/AddLocationType?name=" + data);
        return func;
    }
    return Location;
})
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
.factory('httpRequestInterceptor', function ($q, $injector, HttpCache, $timeout) {

    var interceptor = {
        request: function (config) {

            if (config.url.indexOf('{apihost}') > -1) {
                if (!config.timeout)
                    config.timeout = window.Settings.defaultRequestTimeout;


                config.url = config.url.replace('{apihost}', Settings.apiHostUrl);

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


                }
            }


            return response;
        },
        requestError: function (error) {
            console.log(error)



        },
        responseError: function (error) {
            console.log(error)



        }
    };
    return interceptor;
})
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
.factory('AuthService', function ($rootScope, User, Session, AUTH_EVENTS, $ls, $firebaseAuth) {

    var authService = {};

    var ref = new Firebase("https://sakaryarehberi.firebaseio.com");


    authService.SocialLoginProvider = $firebaseAuth(ref);
    var retry = 0;
    authService.logout = function () {
        console.log("2sssssssssss2");
        $ls.remove("SessionData");
        Session.Destroy();
        authService.SocialLoginProvider.$unauth();
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
                type_name: data.TypeName
            };

            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, Session.User);
        }
        else {
            Session.User = null;
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed, null);
        }
    }

    Session.Destroy = function () {
        Session.User = null;
        data = null;
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess, null);

    }
    Session.isAuthenticated = function () {
        return Session.User != null ? true : false;
    }
    Session.isAdmin = function () {
        return Session.isAuthenticated() ? Session.User.type_id == 2 ? true : false : false;
    }
    return Session;
})
.factory('HttpCache', function ($cacheFactory) {
    return $cacheFactory.get('$http');

    /*  istek yap�l�rken options parametresiyle cache:true de�eri verilirse
        appSettings.js dosyas�ndaki cacheTime parametresinde belirtilen
        s�re kadar(ms cinsinden)  ilgili veri cachte tutulur, s�re dolunca cachten silinir.
        Not:Verilerin g�sterildi�i template'in cache de�eri app.js dosyas�ndaki ilgili k�s�mdan false yap�lmal�. Aksi takdirde
        templateden istek gelmedi�i i�in cache s�resi dolmu� olsa dahi yeni veriler y�klenmez.
     */
})
.factory('CurrrentLocation', ["$cordovaGeolocation", function ($cordovaGeolocation) {
    var CurrentLocation = {};
    var Coord = {
        Latitude: -1,
        Longtitude: -1
    };
    var currentPlatform = ionic.Platform.platform();

    CurrentLocation.get = function (successCB, errorCB) {
        function success(location) {
            console.log(location);
            Coord.Latitude = location.coords.latitude;
            Coord.Longtitude = location.coords.longitude;
            successCB(Coord);
        }
        function error(err) {
            console.log(err);
            errorCB(err);

        }
        if (currentPlatform == "android" || currentPlatform == "ios") {
            var posOptions = { timeout: 20000, enableHighAccuracy: false };
            $cordovaGeolocation.getCurrentPosition(posOptions).then(success, error);
        }
        else
            navigator.geolocation.getCurrentPosition(success, error);
    };

    return CurrentLocation;

   
}]);
