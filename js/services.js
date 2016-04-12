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
.service('Session', function (FirebaseSession, $ls) {
    this.create = function (sessionId, userId) {
        this.id = sessionId;
        this.userId = userId;
    };
    this.destroy = function () {
        this.id = null;
        this.userId = null;
    };
    this.Data = $ls.getObject(FirebaseSession.Data);
})
.factory('AuthService', function ($rootScope, AUTH_EVENTS, $http, $ls, $firebaseAuth, Session) {

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
    authService.isAuthenticated = function () {
        return !!Session.Data && !!Session.Data.uid;
    };

    return authService;
})
