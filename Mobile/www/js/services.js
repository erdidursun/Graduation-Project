angular.module('sakaryarehberi.services', ['sakaryarehberi.appSettings'])
.factory('$ls', ['$window', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = compressed;
        },
        get: function (key, defaultValue) {
            var value = $window.localStorage[key];
            return value ;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
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
            var apiHost = localStorage.getItem('ApiHost');
            var organization = localStorage.getItem('Organization');
            $window.localStorage.clear();
            localStorage.setItem('ApiHost', apiHost);
            localStorage.setItem('Organization', organization);
            return true;
        }
    }
}])
.factory('Auth', function ($firebaseAuth,$ls,Settings) {
  var ref = new Firebase(Settings.FireBaseUrl);
  var refAuth=$firebaseAuth(ref);

  function getName(authData) {
    switch(authData.provider) {
       case 'password':
         return authData.password.email.replace(/@.*/, '');
       case 'twitter':
         return authData.twitter.displayName;
       case 'facebook':
         return authData.facebook.displayName;
    }
  }


  ref.onAuth(function(authData) {
      if (authData) {
        ref.child("users").child(authData.uid).set({
          provider: authData.provider,
          name: getName(authData)
        });
      }
    });
  return {
    login:function(provider){
      var LsAuthData=$ls.get(Settings.LsAuthDataKey);

      if(!LsAuthData){
        refAuth.$authWithOAuthRedirect(provider).then(function(authData) {
      // User successfully logged in
      })
        .catch(function(error) {
            if (error.code === "TRANSPORT_UNAVAILABLE") {
              refAuth.$authWithOAuthPopup(provider).then(function(authData) {
              });
            }
            else {
            console.log(error);
            }
        });
      }
      else{
        console.log(LsAuthData);
      }

    },
    logOut:function(){
      alert("33");
      ref.unauth();
    }
  }
});
