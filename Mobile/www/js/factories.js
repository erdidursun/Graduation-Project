angular.module('sakaryarehberi')
.factory('User', function (Session, $rootScope, AUTH_EVENTS, $ls, $timeout, $http, $httpParamSerializerJQLike, md5) {
    var User = {};

    User.Login = function (mail, pass) {
        var data = $httpParamSerializerJQLike({
            username: mail,
            password: pass
        });
        var func = $http.post("http://{apihost}/api/Login", data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(function (data) {
                    swal({ title: "Baþarýlý", text: "Giriþ Baþarýlý", type: "success", confirmButtonText: "Tamam" });

                    if (data)
                        Session.Create("form", data.data[0]);
                    else
                        Session.Create("form", null);


                }, function (error) {
                    swal({ title: "Baþarýsýz", text: "Giriþ Baþarýsýz", type: "error", confirmButtonText: "Tamam" });

                    Session.Create("form", null);

                });
    };



    User.SocialLogin = function (data) {
        var data = $httpParamSerializerJQLike(data);
        var func = $http.post("http://{apihost}/api/AddSocialUser", data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
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

        var func = $http.post("http://{apihost}/API/Register", $httpParamSerializerJQLike(user), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                      .then(function (data) {
                          swal({ title: "Baþarýlý", text: "Baþarýyla Kayýt Oldunuz. Giriþ Yapýlýyor.", type: "success", confirmButtonText: "Tamam" }
                              , function () {
                                  User.Login(data.data.Email, data.data.Password);
                              });


                      }, function (error) {
                          swal({ title: "Baþarýsýz", text: "Kayýt Olma Esnasýnda Bir hata oluþtu", type: "error", confirmButtonText: "Tamam" });

                      });
    }


    User.SendComment = function (comment) {
        var data = $httpParamSerializerJQLike(comment);
        var func = $http.post("http://{apihost}/API/SendComment", data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

        return func;
    };

    User.GetAll = function () {
        var func = $http.get("http://{apihost}/API/GetUsers", { headers: { 'Content-Type': 'application/json' } })
        return func;
    }
    User.GetUserById = function (id) {
        var func = $http.get("http://{apihost}/API/GetUserById?userId=" + id).then(function (data) {
            return data.data[0];
        })
        return func;
    }
    User.GetUserComments = function (id) {
        var func = $http.get("http://{apihost}/API/GetUserComments?userId=" + id).then(function (data) {
            return data.data;
        })
        return func;
    }
    User.GetUserLikes = function (id) {
        var func = $http.get("http://{apihost}/API/GetUserLikes?userId=" + id).then(function (data) {
            return data.data;
        })
        return func;
    }
    User.Delete = function (id) {
        var data = {
            UserID: id
        }
        var func = $http.get("http://{apihost}/API/DeleteUser?UserID=" + id);
        return func;
    }

    User.GetUserTypes = function () {
        var func = $http.get("http://{apihost}/API/GetUserTypes", { RequireAuth: false });
        return func;
    }

    User.Update = function (user, id) {
        var data = {
            UserID: id
        }
        var func = $http.post("http://{apihost}/API/UpdateUser?UserID=" + id, $httpParamSerializerJQLike(user), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
          .then(function (data) {
              console.log(data);

          }, function (error) {
              console.log(error);
          });
        return func;
    }


    return User;




})
.factory('Location', function ($http, $httpParamSerializerJQLike, Session) {
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
        var url = "http://{apihost}/API/GetLocations?page=" + page;
        if (Session.isAuthenticated())
            url = url + "&userId=" + Session.User.id;
        if (Coord)
            var data = $httpParamSerializerJQLike(Coord)
        else
            var data = $httpParamSerializerJQLike(Coord1)

        var func = $http.post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        return func;
    }
    Location.GetLocationById = function (id) {
        var url = "http://{apihost}/API/GetLocationById?id=" + id;
        if (Session.isAuthenticated())
            url = url + "&userId=" + Session.User.id;
        var func = $http.get(url, { headers: { 'Content-Type': 'application/json' } });
        return func;
    }
    Location.Like = function (locationId, userId) {
        var func = $http.get("http://{apihost}/API/LikeLocation?locationId=" + locationId + "&userId=" + userId, { headers: { 'Content-Type': 'application/json' } });
        return func;
    }
    Location.UnLike = function (locationId, userId) {
        var func = $http.get("http://{apihost}/API/UnLikeLocation?locationId=" + locationId + "&userId=" + userId, { headers: { 'Content-Type': 'application/json' } });
        return func;
    }
    Location.GetLocationTypes = function () {

        var func = $http.get("http://{apihost}/API/GetLocationTypes", { RequireAuth: false });


        var func = $http.get("http://{apihost}/API/GetLocationTypes", { RequireAuth: false });

        return func;
    }

    Location.Delete = function (id) {
        var data = {
            LocationID: id
        }
        var func = $http.get("http://{apihost}/API/DeleteLocation?LocationID=" + id);
        return func;
    }
    Location.Add = function (data) {


        var func = $http.post("http://{apihost}/API/AddLocation", $httpParamSerializerJQLike(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        return func;

    }

    Location.AddLocationType = function (data) {
        var func = $http.get("http://{apihost}/API/AddLocationType?name=" + data);
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


    var SocialLoginProvider = $firebaseAuth(ref);
    var retry = 0;
    authService.logout = function () {
        Session.Destroy();
        SocialLoginProvider.$unauth();
    };
    SocialLoginProvider.$onAuth(function (authData) {
        console.log(authData);
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
        SocialLoginProvider.$authWithOAuthRedirect(provider).then(function (authData) {
        }).catch(function (error) {
            if (error.code === "TRANSPORT_UNAVAILABLE") {
                SocialLoginProvider.$authWithOAuthPopup(provider).then(function (authData) {
                    console.log(authData);

                }).catch(function (error) {
                    console.log(error);

                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed, error);

                });
            }
            else {
                consolelog(error);
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed, error);

            }
        });
    }


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
        $ls.removeAll();
    }
    Session.isAuthenticated = function () {
        return Session.User!=null ? true : false;
    }
    Session.isAdmin = function () {
        return Session.isAuthenticated() ? Session.User.type_id == 2 ? true : false : false;
    }
    return Session;
})
.factory('HttpCache', function ($cacheFactory) {
    return $cacheFactory.get('$http');

    /*  istek yapýlýrken options parametresiyle cache:true deðeri verilirse
        appSettings.js dosyasýndaki cacheTime parametresinde belirtilen
        süre kadar(ms cinsinden)  ilgili veri cachte tutulur, süre dolunca cachten silinir.
        Not:Verilerin gösterildiði template'in cache deðeri app.js dosyasýndaki ilgili kýsýmdan false yapýlmalý. Aksi takdirde
        templateden istek gelmediði için cache süresi dolmuþ olsa dahi yeni veriler yüklenmez.
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
            errorCB(err);
            console.log(err);
        }
        if (currentPlatform == "android" || currentPlatform == "ios") {
            var posOptions = { timeout: 20000, enableHighAccuracy: false };
            $cordovaGeolocation.getCurrentPosition(posOptions).then(success, error);
        }
        else
            navigator.geolocation.getCurrentPosition(success, error);
    };

    return CurrentLocation;

    /*  istek yapýlýrken options parametresiyle cache:true deðeri verilirse
        appSettings.js dosyasýndaki cacheTime parametresinde belirtilen
        süre kadar(ms cinsinden)  ilgili veri cachte tutulur, süre dolunca cachten silinir.
        Not:Verilerin gösterildiði template'in cache deðeri app.js dosyasýndaki ilgili kýsýmdan false yapýlmalý. Aksi takdirde
        templateden istek gelmediði için cache süresi dolmuþ olsa dahi yeni veriler yüklenmez.
     */
}])

.factory('FeedLoader', function ($resource) {
    return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
        fetch: { method: 'JSONP', params: { v: '1.0', callback: 'JSON_CALLBACK' } }
    });
})


// Factory for node-pushserver (running locally in this case), if you are using other push notifications server you need to change this
.factory('NodePushServer', function ($http) {
    // Configure push notifications server address
    // 		- If you are running a local push notifications server you can test this by setting the local IP (on mac run: ipconfig getifaddr en1)
    var push_server_address = "http://192.168.1.102:8000";

    return {
        // Stores the device token in a db using node-pushserver
        // type:  Platform type (ios, android etc)
        storeDeviceToken: function (type, regId) {
            // Create a random userid to store with it
            var user = {
                user: 'user' + Math.floor((Math.random() * 10000000) + 1),
                type: type,
                token: regId
            };
            console.log("Post token for registered device with data " + JSON.stringify(user));

            $http.post(push_server_address + '/subscribe', JSON.stringify(user))
            .success(function (data, status) {
                console.log("Token stored, device is successfully subscribed to receive push notifications.");
            })
            .error(function (data, status) {
                console.log("Error storing device token." + data + " " + status);
            });
        },
        // CURRENTLY NOT USED!
        // Removes the device token from the db via node-pushserver API unsubscribe (running locally in this case).
        // If you registered the same device with different userids, *ALL* will be removed. (It's recommended to register each
        // time the app opens which this currently does. However in many cases you will always receive the same device token as
        // previously so multiple userids will be created with the same token unless you add code to check).
        removeDeviceToken: function (token) {
            var tkn = { "token": token };
            $http.post(push_server_address + '/unsubscribe', JSON.stringify(tkn))
            .success(function (data, status) {
                console.log("Token removed, device is successfully unsubscribed and will not receive push notifications.");
            })
            .error(function (data, status) {
                console.log("Error removing device token." + data + " " + status);
            });
        }
    };
})


.factory('AdMob', function ($window) {
    var admob = $window.AdMob;

    if (admob) {
        // Register AdMob events
        // new events, with variable to differentiate: adNetwork, adType, adEvent
        document.addEventListener('onAdFailLoad', function (data) {
            console.log('error: ' + data.error +
            ', reason: ' + data.reason +
            ', adNetwork:' + data.adNetwork +
            ', adType:' + data.adType +
            ', adEvent:' + data.adEvent); // adType: 'banner' or 'interstitial'
        });
        document.addEventListener('onAdLoaded', function (data) {
            console.log('onAdLoaded: ' + data);
        });
        document.addEventListener('onAdPresent', function (data) {
            console.log('onAdPresent: ' + data);
        });
        document.addEventListener('onAdLeaveApp', function (data) {
            console.log('onAdLeaveApp: ' + data);
        });
        document.addEventListener('onAdDismiss', function (data) {
            console.log('onAdDismiss: ' + data);
        });

        var defaultOptions = {
            // bannerId: admobid.banner,
            // interstitialId: admobid.interstitial,
            // adSize: 'SMART_BANNER',
            // width: integer, // valid when set adSize 'CUSTOM'
            // height: integer, // valid when set adSize 'CUSTOM'
            position: admob.AD_POSITION.BOTTOM_CENTER,
            // offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
            bgColor: 'black', // color name, or '#RRGGBB'
            // x: integer,		// valid when set position to 0 / POS_XY
            // y: integer,		// valid when set position to 0 / POS_XY
            isTesting: true, // set to true, to receiving test ad for testing purpose
            // autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
        };
        var admobid = {};

        if (ionic.Platform.isAndroid()) {
            admobid = { // for Android
                banner: 'ca-app-pub-6869992474017983/9375997553',
                interstitial: 'ca-app-pub-6869992474017983/1657046752'
            };
        }

        if (ionic.Platform.isIOS()) {
            admobid = { // for iOS
                banner: 'ca-app-pub-6869992474017983/4806197152',
                interstitial: 'ca-app-pub-6869992474017983/7563979554'
            };
        }

        admob.setOptions(defaultOptions);

        // Prepare the ad before showing it
        // 		- (for example at the beginning of a game level)
        admob.prepareInterstitial({
            adId: admobid.interstitial,
            autoShow: false,
            success: function () {
                console.log('interstitial prepared');
            },
            error: function () {
                console.log('failed to prepare interstitial');
            }
        });
    }
    else {
        console.log("No AdMob?");
    }

    return {
        showBanner: function () {
            if (admob) {
                admob.createBanner({
                    adId: admobid.banner,
                    position: admob.AD_POSITION.BOTTOM_CENTER,
                    autoShow: true,
                    success: function () {
                        console.log('banner created');
                    },
                    error: function () {
                        console.log('failed to create banner');
                    }
                });
            }
        },
        showInterstitial: function () {
            if (admob) {
                // If you didn't prepare it before, you can show it like this
                // admob.prepareInterstitial({adId:admobid.interstitial, autoShow:autoshow});

                // If you did prepare it before, then show it like this
                // 		- (for example: check and show it at end of a game level)
                admob.showInterstitial();
            }
        },
        removeAds: function () {
            if (admob) {
                admob.removeBanner();
            }
        }
    };
})

.factory('iAd', function ($window) {
    var iAd = $window.iAd;

    // preppare and load ad resource in background, e.g. at begining of game level
    if (iAd) {
        iAd.prepareInterstitial({ autoShow: false });
    }
    else {
        console.log("No iAd?");
    }

    return {
        showBanner: function () {
            if (iAd) {
                // show a default banner at bottom
                iAd.createBanner({
                    position: iAd.AD_POSITION.BOTTOM_CENTER,
                    autoShow: true
                });
            }
        },
        showInterstitial: function () {
            // ** Notice: iAd interstitial Ad only supports iPad.
            if (iAd) {
                // If you did prepare it before, then show it like this
                // 		- (for example: check and show it at end of a game level)
                iAd.showInterstitial();
            }
        },
        removeAds: function () {
            if (iAd) {
                iAd.removeBanner();
            }
        }
    };
})

;
