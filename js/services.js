sakaryarehberi
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

            return true;
        }
    }
}])
.service('User', function (FirebaseSession, $ls, $timeout) {
    var data = {};
    var User = {};    
    User.Info = function () {
        data = $ls.getObject(FirebaseSession.Data);
        if (data)
            return {
                data: data["" + data.provider + ""],
                isAuthanthanced: data ? true : false
            };
        else
            return {};
    }
  
    return User;




})
.factory('AuthService', function ($rootScope, AUTH_EVENTS, $http, $ls, $firebaseAuth) {

    var authService = {};

    var ref = new Firebase("https://sakaryarehberi.firebaseio.com");


    authService.SocialLoginProvider = $firebaseAuth(ref);

    authService.logout = function () {
        this.SocialLoginProvider.$unauth();
    };
    authService.login = function (credentials) {

    };
    authService.socialLogin = function (provider, callback) {
        this.SocialLoginProvider.$authWithOAuthPopup(provider).then(function (authData) {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, authData);

        }).catch(function (error) {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed, error);
        });
    }


    return authService;
})
